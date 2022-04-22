import { ChannelService } from 'src/app/_services/channel.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, pipe, subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageState: BehaviorSubject<any>;
  constructor(
    private http: HttpClient,
    private socket: SocketService,
    private channel: ChannelService
  ) {
    this.messageState = new BehaviorSubject([]);
    this.socket.currentSocketConnection?.on('message', message => {
     this.addMessageState(message);
    })
  }

  addMessageState(message: any) {
    this.channel.removeSendedMessageTyping(message);
   
    let currentValue = this.messageState.getValue();
    if(currentValue.findIndex((x: any) => x.channel_id == message.channel_id) <= -1) {
      currentValue.push({
        channel_id:  message.channel_id,
        messages: []
      })
    }
    const channelIndex = currentValue.findIndex((x: any) => x.channel_id == message.channel_id);
    const messageIndex = currentValue[channelIndex].messages.findIndex((x: any) => x.nonce == message.nonce);
    if(messageIndex <= -1) {
      console.log('adicinou')
      currentValue[channelIndex].messages = [...currentValue[channelIndex].messages, message ]
    } else {
      console.log('atualizou')
      currentValue[channelIndex].messages[messageIndex] = message;
    }
    this.messageState.next(currentValue);
  }
  

  public addChannelMessages(channelId: string, messages: any[], push = false): void {
    let currentValue = this.messageState.getValue();
    let channelIndex = -1;
    if(currentValue.findIndex((x: any) => x.channel_id == channelId) <= -1) {
      currentValue.push({
        channel_id:  channelId,
        messages: []
      })
    }
    channelIndex = currentValue.findIndex((x: any) => x.channel_id == channelId);
    if(push) {
      messages.forEach(message => {
        let index = currentValue[channelIndex].messages.findIndex((x: any) => x._id === message._id);
        if(index == -1){
          currentValue[channelIndex].messages = [ message, ...currentValue[channelIndex].messages,  ];
        } else {
          currentValue[channelIndex].messages[index] = message;
        }
      })
      // currentValue[channelIndex].messages = [ ...messages, ...currentValue[channelIndex].messages,  ];
    } else {
      currentValue[channelIndex].messages = [ ...messages ];
    }
    this.messageState.next(currentValue);
  }

  public getMessagesByChannelId(channelId: string) {
    let currentValue = this.messageState.getValue();
    const channelIndex = currentValue.findIndex((x: any) => x.channel_id == channelId);
    if(channelIndex <= -1){
      return [];
    } else {
      return currentValue[channelIndex].messages;
    }
  }

  public getMessagesBefore(channelId: string, before: string): Observable<any[]> {
    return new Observable(subscribe => {
      this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message', { params: { before } }).subscribe(messages => {
        this.addChannelMessages(channelId, messages, true);
        subscribe.next(messages);
        subscribe.complete();
      })
    })
  }



  public getMessages(channelId: string): void {
    let channelIndex = this.messageState.value.findIndex((x: any) => x.channel_id == channelId);
    if(channelIndex <= -1) {
      this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message').subscribe(messages => {
        if(messages[0]._id != channelId){
          this.addChannelMessages(channelId, messages);
        }
      })
    }
  }
  

}

