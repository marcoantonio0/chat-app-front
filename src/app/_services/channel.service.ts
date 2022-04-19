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

        let speechEvents = hark(stream, {
          threshold: -100
        });

        speechEvents.on('speaking', () =>{
          stream.getAudioTracks().forEach(e => {
            
          })
        })

        speechEvents.on('stopped_speaking', () =>{
          stream.getAudioTracks().forEach(e => {
            
          })
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
            this.updateConnectedChannel(payload.channelId, { user: payload.user, memberGuild: payload.memberGuild });
            if(payload.channelId == this.connectedState.value.channel._id) {
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
            if(payload.channelId == this.connectedState.value.channel._id) {
              this.getPeer?.getConnection
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

  leaveVoice(){
    this.getPeer?.destroy();
    this.socket.currentSocketConnection?.emit('left_channel', { channelId: this.connectedState.value.channel._id });
    this.connectedState.next({});
  }


  channelVoiceActivity(){
    this.socket.currentSocketConnection?.on('new_user_channel', payload => {
      this.updateConnectedChannel(payload.channelId, { user: payload.user, memberGuild: payload.memberGuild });
    })
    this.socket.currentSocketConnection?.on('channel_leave', payload => {
      this.updateConnectedChannel(payload.channelId, { user: payload.user, memberGuild: payload.memberGuild }, true);
    })
  }

  updateConnectedChannel(channelId: string, member: any, leave = false) {
    let value = this.channelsState.value;
    let index = value.findIndex(x => x._id == channelId);
    let hasMemberIndex = value[index].connected.findIndex((x:any) => x.user._id == member.user._id);
    if(!leave){
      if(hasMemberIndex >= 0){
        value[index].connected[hasMemberIndex] = member;
      } else {
        value[index].connected.push(member);
      }
    } else {
      if(hasMemberIndex >= 0){
        value[index].connected.splice(hasMemberIndex, 1);
      }
    }
    this.channelsState.next([ ...value ]);
  }

  get getPeer() {
    return this.currentPeer;
  }

  connectVoicePeer() {
    this.currentPeer = new Peer(this.me.meSubject.value._id, {
      host: '26.228.3.2',
      port: 9000,
      debug: 1,
      path:'/audio'
    });
  }
  

  audioJoin(){
    this.join.play();
  }

  audioLeave(){
    this.leave.play();
  }

  sendMessage(channelId: string, data: any): Observable<any>{
    return this.http.post<any>(environment.baseUrl+'/channel/'+channelId+'/message', data);
  }
}
