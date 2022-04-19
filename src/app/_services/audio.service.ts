import { Injectable } from '@angular/core';
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
  constructor() {
    this.MediaEngineStore = new BehaviorSubject(JSON.parse(localStorage.getItem(this.mediaLocalStorageName) || '{}'));
    this.audioConnectedVoice = new BehaviorSubject<connectStream[]>([]);
    this.currentStream = new BehaviorSubject<MediaStream|undefined>(undefined);
    this.audioConnectedVoice.subscribe(e =>{
      console.log(e);
    })
    if(
      localStorage.getItem(this.mediaLocalStorageName) == undefined || 
      localStorage.getItem(this.mediaLocalStorageName) == null) {
        this.boostrapMediaEngine();
    }
  }

  getCurrentStream(){
   
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(stream =>{
      
      this.currentStream.next(stream);
    }).catch(err => {

    })
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
      console.log(audioValue[index].audio);
      audioValue[index].audio.srcObject = null;
      audioValue[index].audio.remove();
      audioValue.splice(index, 1);
      this.audioConnectedVoice.next(audioValue);
    }
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
    this.MediaEngineStore.next(value);
  }

  deaf(){
    let value = this.MediaEngineStore.value;
    if(!value.deaf){
      value.deaf = true;
    } else value.deaf = false;
    this.MediaEngineStore.next(value);
  }

  
}
