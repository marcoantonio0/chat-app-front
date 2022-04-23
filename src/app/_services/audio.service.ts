import { ChannelService } from 'src/app/_services/channel.service';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


interface audioConfig {
  outputVolume: number;
  mute: boolean;
  inputVolume: number;
  mode: string;
}


interface connectStream {
  userId: string;
  audioContext?: AudioContext;
  audioStream: MediaStream;
  audio: HTMLAudioElement;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  mediaLocalStorageName = 'MediaEngineStore';
  MediaEngineStore: BehaviorSubject<audioConfig|any>;
  audioConnectedVoice: BehaviorSubject<connectStream[]>;
  currentStream: BehaviorSubject<MediaStream | undefined>;
  constructor(
    private injector: Injector
  ) {
    this.MediaEngineStore = new BehaviorSubject(JSON.parse(localStorage.getItem(this.mediaLocalStorageName) || '{}'));
    this.audioConnectedVoice = new BehaviorSubject<connectStream[]>([]);
    this.currentStream = new BehaviorSubject<MediaStream|undefined>(undefined);
    if(
      localStorage.getItem(this.mediaLocalStorageName) == undefined || 
      localStorage.getItem(this.mediaLocalStorageName) == null) {
        this.boostrapMediaEngine();
    }
  }


  boostrapMediaEngine() {
    let data = {
      outputVolume: 100,
      mute: false,
      deaf: false,
      inputVolume: 100,
      mode: 'default'
    };
    localStorage.setItem(this.mediaLocalStorageName, JSON.stringify(data));
    this.MediaEngineStore.next(data);
  }

  addNewAudio(userId: string, stream: MediaStream) {
    const audio = new Audio;
    if(stream){
      // let context = new AudioContext;
      // let source = context.createMediaStreamSource(stream);
      // var volume = context.createGain();
      // source.connect(volume);
      // volume.connect(context.destination);
      // volume.gain.value = 0;  //turn off the speakers
      let audioValue = this.audioConnectedVoice.value;
      audio.srcObject = stream;
      audio.autoplay = true;
      audio.play();
      audioValue.push({
        userId: userId,
        // audioContext: context,
        audioStream: stream,
        audio
      });
    } else{
      audio.remove();
    }
  }
 
  removeAudio(userId: string) {
    let audioValue = this.audioConnectedVoice.value;
    let index = audioValue.findIndex(x => x.userId == userId);
    if(index >= 0) {
      audioValue[index].audio.srcObject = null;
      audioValue[index].audio.remove();
      audioValue.splice(index, 1);
      this.audioConnectedVoice.next(audioValue);
    }
  }

  voiceAudio(userId: string, state: 0 | 1) {
    let audioValue = this.audioConnectedVoice.value;
    let index = audioValue.findIndex(x => x.userId == userId);
    if(index >= 0) {
      if(state==0)audioValue[index].audio.muted = true;
      if(state==1)audioValue[index].audio.muted = false;
    }
  }

  voiceLeaveAll(){
    let voices = this.audioConnectedVoice.value;
    voices.forEach(voice =>{
      voice.audio.remove();
    })
    this.audioConnectedVoice.next([]);
  }

  mute(){
    let value = this.MediaEngineStore.value;
    this.currentStream.value?.getTracks().forEach(e =>{
      if(e.kind == 'audio'){
        e.enabled = !e.enabled;
      } 
    });
    if(!value.mute){
      value.mute = true;
    } else value.mute = false;
    const channel = this.injector.get<ChannelService>(ChannelService);
    channel.selfMute(value.mute);
    this.updateMediaEngine(value);
  }

  updateMediaEngine(next: any){
    this.MediaEngineStore.next(next);
    localStorage.setItem(this.mediaLocalStorageName,JSON.stringify(this.MediaEngineStore.value));
  }

  deaf() {
    let value = this.MediaEngineStore.value;
    let voices = this.audioConnectedVoice.value;
    this.currentStream.value?.getTracks().forEach(e =>{
      if(e.kind == 'audio'){
        e.enabled = !e.enabled;
      } 
    });
    if(!value.deaf){
      value.mute = true;
      voices.forEach(e =>{
        e.audio.muted = true;
      })
      value.deaf = true;
    } else {
      voices.forEach(e =>{
        e.audio.muted = false;
      })
      value.deaf = false;
      value.mute = false;
    }
    const channel = this.injector.get<ChannelService>(ChannelService);
    channel.selfDeaf(value.deaf);
    channel.selfMute(value.muted);
    this.updateMediaEngine(value);
  }

  
}
