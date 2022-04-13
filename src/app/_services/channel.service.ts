import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channelsState: BehaviorSubject<any[]>;
  channelsDMState: BehaviorSubject<any[]>;
  constructor(
    private http: HttpClient
  ) {
    this.channelsState = new BehaviorSubject<any[]>([]);
    this.channelsDMState = new BehaviorSubject<any[]>([]);
  }

  create(guildId: string, data: any): Observable<any> {
    return this.http.post(environment.baseUrl+'/channel/'+guildId+'/create', data);
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

  addGuildChannels(guildId: string, channels: any[]) {
    let value = {
      guild_id: guildId,
      channels: channels
    };
    let currentValue = this.channelsState.value;
    this.channelsState.next([... currentValue, value]);
  }

  addChannelState(channel: any){
    let value = this.channelsState.value;
    if(value.findIndex(x => x._id == channel._id) <= -1){
      this.channelsState?.next([ ...value, channel ]);
    }
  }

  addChannelDMState(channel: any){
    let value = this.channelsDMState.value;
    if(value.findIndex(x => x._id == channel._id) <= -1){
      this.channelsDMState?.next([ ...value, channel ]);
    }
  }

  sendMessage(channelId: string, data: any): Observable<any>{
    return this.http.post<any>(environment.baseUrl+'/channel/'+channelId+'/message', data);
  }
}
