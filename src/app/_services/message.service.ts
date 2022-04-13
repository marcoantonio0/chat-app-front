import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageState: BehaviorSubject<any>;
  constructor(
    private http: HttpClient,
    private socket: SocketService
  ) {
    this.messageState = new BehaviorSubject([]);
    this.socket.currentSocketConnection?.on('message', message => {
     this.addMessageState(message);
    })
  }

  private addMessageState(message: any) {
    let currentValue = this.messageState.getValue();
    if(currentValue.findIndex((x: any) => x.channel_id == message.channel_id) <= -1) {
      currentValue.push({
        channel_id:  message.channel_id,
        messages: []
      })
    }
    const channelIndex = currentValue.findIndex((x: any) => x.channel_id == message.channel_id);
    currentValue[channelIndex].messages = [...currentValue[channelIndex].messages, message ]
    this.messageState.next(currentValue);
  }

  public addChannelMessages(channelId: string, messages: any[]): void {
    let currentValue = this.messageState.getValue();
    let channelIndex = -1;
    if(currentValue.findIndex((x: any) => x.channel_id == channelId) <= -1) {
      currentValue.push({
        channel_id:  channelId,
        messages: []
      })
    }
    channelIndex = currentValue.findIndex((x: any) => x.channel_id == channelId);
    currentValue[channelIndex].messages = [ ...messages ];
    this.messageState.next(currentValue);
  }

  public getMessagesByChannelId(channelId: string){
    let currentValue = this.messageState.getValue();
    const channelIndex = currentValue.findIndex((x: any) => x.channel_id == channelId);
    if(channelIndex <= -1){
      return [];
    } else {
      return currentValue[channelIndex].messages;
    }
  }

  public getMessages(channelId: string): Observable<any[]> {
  
    return new Observable(subscriber =>{
      let channelIndex = this.messageState.value.findIndex((x: any) => x.channel_id == channelId);
      if(channelIndex > -1) {
        this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message').subscribe(messages => {
          this.addChannelMessages(channelId, messages);
          subscriber.next(messages);
        })
        subscriber.next(this.messageState.value[channelIndex].messages);
        subscriber.complete();
      } else {
        this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message').subscribe(messages => {
          this.addChannelMessages(channelId, messages);
          subscriber.next(messages);
          subscriber.complete();
        })
      }
    })
  }
  

}

