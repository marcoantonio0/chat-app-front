import { AudioService } from './audio.service';
import { GuildService } from './guild.service';
import { SocketService } from './socket.service';
import { MeService } from './me.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import hark from 'hark';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  currentPeer: Peer | undefined;
  channelsState: BehaviorSubject<any[]>;
  channelsDMState: BehaviorSubject<any[]>;
  typingState: BehaviorSubject<any[]>;
  connectedState: BehaviorSubject<any>;
  join = new Audio('../../assets/audio/join.mp3');
  leave = new Audio('../../assets/audio/leave.mp3');

  constructor(
    private http: HttpClient,
    private socket: SocketService,
    private guild: GuildService,
    private audio: AudioService,
    private me: MeService
  ) {
    this.channelsState = new BehaviorSubject<any[]>([]);
    this.connectedState = new BehaviorSubject<any>({});
    this.channelsDMState = new BehaviorSubject<any[]>([]);
    this.typingState = new BehaviorSubject<any[]>([]);
  }

  create(guildId: string, data: any): Observable<any> {
    return this.http.post(environment.baseUrl+'/channel/'+guildId+'/create', data);
  }

  public get hasConnection() {
    return Object.keys(this.connectedState.value).length > 0;
  }

  createDM(recipientId: string): Observable<any> {
    return this.http.post<any[]>(environment.baseUrl+'/channel/'+recipientId+'/dm', {}).pipe(map(channel =>{
      this.addChannelState(channel);
      return channel;
    }))
  }

  listDM(): Observable<any>{
    return new Observable(subscriber => {
      if(this.channelsDMState.value.length <= 0) {
        this.http.get<any[]>(environment.baseUrl+'/channel/@me/dm').subscribe(channels => {
          channels.forEach(channel =>{
            this.addChannelDMState(channel);
          })
          subscriber.next(channels);
          subscriber.complete();
        });
      } else {
        subscriber.next(this.channelsDMState.value);
        subscriber.complete();
      }
    })
  }

  addGuildChannels(channels: any[]) {
    let currentValue = this.channelsState.value;
    channels.forEach(e => {
      e['scrollTop'] = 0;
    })
    this.channelsState.next([ ...currentValue, ...channels ]);
  }

  addChannelState(channel: any){
    let value = this.channelsState.value;
    let channelAdd = { ...channel };
    channel['scrollTop'] = 0;
    if(value.findIndex(x => x._id == channelAdd._id) <= -1){
      this.channelsState?.next([ ...value, channel ]);
    }
  }

  updateScrollTopChannel(channelId: string, scrollTop: number){
    let currentValue = this.channelsState.value;
    let index = currentValue.findIndex(x => x._id == channelId);
    if(index > -1){
      currentValue[index].scrollTop = scrollTop;
      this.channelsState.next(currentValue);
    }
  }

  addChannelDMState(channel: any){
    let value = this.channelsDMState.value;
    let channelAdd = { ...channel };
    channel['scrollTop'] = 0;
    if(value.findIndex(x => x._id == channelAdd._id) <= -1){
      this.channelsDMState?.next([ ...value, channel ]);
    }
  }

  connectAudioChannel(channelId: string): void {
    if(Object.keys(this.connectedState.value).length > 0){
      if(this.connectedState.value.channel._id != channelId){
        this.leaveVoice()
      } else {
        return;
      }
    }
    navigator.mediaDevices.getUserMedia({
      audio: {
        autoGainControl: true,
        channelCount: 2,
        echoCancellation: true,
        latency: 0,
        noiseSuppression: true,
        sampleRate: 48000,
        sampleSize: 16
      }
    }).then(stream => {
      this.http.post(environment.baseUrl+'/channel/'+channelId+'/audio', {}).subscribe(r => {
        let cloned = stream.clone()
        let speechEvents = hark(cloned, {
          threshold: -84
        });

        speechEvents.on('speaking', () =>{
          this.socket.currentSocketConnection?.emit('voice', { state: 1, channelId: this.connectedState.value.channel._id });
        })

        speechEvents.on('stopped_speaking', () =>{
          this.socket.currentSocketConnection?.emit('voice', { state: 0, channelId: this.connectedState.value.channel._id });
        })

        this.audio.currentStream.next(stream);
        this.connectVoicePeer();
        
        this.getPeer?.on('open', cb => {
          this.socket.currentSocketConnection?.emit('join_channel', { channelId, userId: this.me.meSubject.value._id });

          const channel = this.channelsState.value.filter(x => x._id == channelId)[0];
          let guild;
          if(channel.guild){
            guild = this.guild.guilds.value.filter(x => x._id == channel.guild)[0]
          }
          this.connectedState.next({
            channel,
            guild
          });

          this.socket.currentSocketConnection?.on('new_user_channel', payload => {
            this.updateConnectedChannel(payload.channel, payload);
            if(payload.channel == this.connectedState.value.channel._id) {
              if(payload.user._id != this.me.meSubject.value._id) {
                const call = this.getPeer?.call(payload.user._id, stream)
               
                call?.on('stream', userAudioStream => {
                  this.audioJoin();
                  this.audio.addNewAudio(payload.user._id, userAudioStream);
                })
                call?.on('close', () => {
                  this.audio.removeAudio(payload.user._id);
                })
              } else {
                this.audioJoin();
              }
            }
          })

          this.socket.currentSocketConnection?.on('channel_leave', payload => {
            if(payload.channel == this.connectedState.value.channel._id) {
              this.audio.removeAudio(payload.user._id);
              this.audioLeave();
            }
          })

          this.getPeer?.on('call', call => { 
            call.answer(stream);
         
            call.on('stream', userAudioStream => {
              this.audio.addNewAudio(call.peer, userAudioStream);
            })
            call.on('close', () => {
              this.audio.removeAudio(call.peer);
            })
          })

        })
      })
    })
  }

  leaveVoice() {
    this.audioLeave();
    this.getPeer?.destroy();
    this.socket.currentSocketConnection?.emit('left_channel', { channelId: this.connectedState.value.channel._id });
    this.audio.voiceLeaveAll();
    this.connectedState.next({});
  }

  channelTextActivity() {
    this.socket.currentSocketConnection?.on('channel_typing', payload => {
      this.addTypingState(payload);
    })
  }

  addTypingState(state: any) {
    let typingState = this.typingState.value;
    if(typingState.findIndex((x: any) => x.channelId == state.channelId) <= -1) { 
      typingState.push({
        channelId: state.channelId,
        states: []
      })
    }
    let index = typingState.findIndex((x: any) => x.channelId == state.channelId);
    if(typingState[index].states.findIndex((x:any) => x.user._id == state.user._id) <= -1) {
      let timeRemove = setTimeout(() => {
        let currentValue = this.typingState.value;
        let indexState = currentValue[index].states.findIndex((x: any) => x.user_id == state.user._id);
        currentValue[index].states.splice(indexState, 1);
        this.typingState.next(currentValue);
      }, 8000);

      typingState[index].states.push({...state, timeRemove});
    } else {
      let indexState = typingState[index].states.findIndex((x:any) => x.user._id == state.user._id);
      clearTimeout(typingState[index].states[indexState].timeRemove);
      let timeRemove = setTimeout(() => {
        let currentValue = this.typingState.value;
        let indexState = currentValue[index].states.findIndex((x: any) => x.user_id == state.user._id);
        currentValue[index].states.splice(indexState, 1);
        this.typingState.next(currentValue);
      }, 8000);

      typingState[index].states[indexState] = {state, timeRemove};
    }
    this.typingState.next(typingState);
  }


  channelVoiceActivity(){
    this.socket.currentSocketConnection?.on('new_user_channel', payload => {
      this.updateConnectedChannel(payload.channel, payload);
    })
    this.socket.currentSocketConnection?.on('channel_leave', payload => {
      this.updateConnectedChannel(payload.channel, payload, true);
    })
    this.socket.currentSocketConnection?.on('state_voice_activity', payload => {
      this.updateConnectedChannel(payload.channel, payload);
    })
    this.socket.currentSocketConnection?.on('voice_state', payload => {
      this.audio.voiceAudio(payload.userId, payload.state);
      this.updateVoiceState(payload.channelId, payload.userId, payload.state);
    })
  }

  updateVoiceState(channelId: string, userId: string, state: 0 | 1) {
    let value = this.channelsState.value;
    let index = value.findIndex(x => x._id == channelId);
    if(index >= 0){
      let stateIndex = value[index].voiceStates.findIndex((x:any) => x.user._id == userId);
      if(stateIndex != -1) {
        console.log(value[index].voiceStates[stateIndex])
        value[index].voiceStates[stateIndex]['state'] = state;
        this.channelsState.next(value);
        console.log(value[index].voiceStates[stateIndex],'apos')
      }
    }
  }

  updateConnectedChannel(channelId: string, voiceState: any, leave = false) {
    let value = this.channelsState.value;
    let index = value.findIndex(x => x._id == channelId);
    let hasMemberIndex = value[index].voiceStates.findIndex((x:any) => x.user._id == voiceState.user._id);
    if(!leave){
      if(hasMemberIndex >= 0){
        value[index].voiceStates[hasMemberIndex] = voiceState;
      } else {
        value[index].voiceStates.push(voiceState);
      }
    } else {
      if(hasMemberIndex >= 0){
        value[index].voiceStates.splice(hasMemberIndex, 1);
      }
    }
    this.channelsState.next([ ...value ]);
  }

  get getPeer() {
    return this.currentPeer;
  }

  connectVoicePeer() {
    this.currentPeer = new Peer(this.me.meSubject.value._id, {
      host: environment.peerServerHost,
      port: environment.peerServerPort,
      path: '/',
      secure: true,
      debug: 3,
    });
  }

  setTyping(channelId: string){
    return this.http.post(environment.baseUrl+'/channel/'+channelId+'/typing', {});
  }

  selfMute(status: boolean){
    if(Object.keys(this.connectedState.value).length > 0){
      this.socket.currentSocketConnection?.emit('self_mute', { self_mute: status, channelId: this.connectedState.value.channel._id });
    }
  }
  selfDeaf(status: boolean){
    if(Object.keys(this.connectedState.value).length > 0){
      this.socket.currentSocketConnection?.emit('self_deaf', { self_deaf: status, channelId: this.connectedState.value.channel._id });
    }
  }

  removeSendedMessageTyping(message: any){
    let typingValue = this.typingState.value;
    let currentChannelTyping = typingValue.findIndex(x => x.channelId == message.channel_id);
    console.log(currentChannelTyping);
    if(currentChannelTyping >= 0){
     let stateIndex =  typingValue[currentChannelTyping].states.findIndex((x: any) => x.user._id == message.author._id);
     if(stateIndex >= 0){
      clearTimeout(typingValue[currentChannelTyping].states[stateIndex].timeRemove);
      typingValue[currentChannelTyping].states.splice(stateIndex);
      this.typingState.next(typingValue);
     }
    }
  }
  

  audioJoin(){
    this.join.play();
  }

  audioLeave(){
    this.leave.play();
  }

  sendMessage(channelId: string, data: any): Observable<any> {
    return this.http.post<any>(environment.baseUrl+'/channel/'+channelId+'/message', data);
  }
}
