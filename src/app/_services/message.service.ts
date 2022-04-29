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
     this.channel.updateLastMessage(message.channel_id, message);
     this.addMessageState(message);
    })
    this.socket.currentSocketConnection?.on('delete_message', message => {
      this.removeMessageState(message);
    })
  }

  removeMessageState(message: any) {
    let currentValue = this.messageState.getValue();
    let channelID = message.channel_id._id || message.channel_id;
    if(currentValue.findIndex((x: any) => x.channel_id == channelID) >= 0) {
      const channelIndex = currentValue.findIndex((x: any) => x.channel_id == channelID);
      currentValue[channelIndex].messages = currentValue[channelIndex].messages.filter((x: any) => x.nonce != message.nonce);
      this.messageState.next(currentValue);
    }
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
      currentValue[channelIndex].messages = [...currentValue[channelIndex].messages, message ]
    } else {
      currentValue[channelIndex].messages[messageIndex] = message;
    }
    this.messageState.next(currentValue);
  }
  

  public addChannelMessages(channelId: string, messages: any[], push = false, bottom = false): void {
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
      if(!bottom){
        messages.forEach(message => {
          let index = currentValue[channelIndex].messages.findIndex((x: any) => x._id === message._id);
          if(index == -1){
            currentValue[channelIndex].messages = [ message, ...currentValue[channelIndex].messages  ];
          } else {
            currentValue[channelIndex].messages[index] = message;
          }
        })
      } else {
          messages.forEach(message => {
            let index = currentValue[channelIndex].messages.findIndex((x: any) => x._id === message._id);
            if(index == -1) {
              currentValue[channelIndex].messages = [ ...currentValue[channelIndex].messages, message ];
            } else {
              currentValue[channelIndex].messages[index] = message;
            }
          })
      }
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

  public getMessagesAfter(channelId: string, after: string): Observable<any[]> {
    return new Observable(subscribe => {
      this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message', { params: { after } }).subscribe(messages => {
        this.addChannelMessages(channelId, messages, true, true);
        subscribe.next(messages);
        subscribe.complete();
      })
    })
  }

  public getMessagesAround(channelId: string, around: string): Observable<any[]> {
    return new Observable(subscribe => {
      this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message', { params: { around } }).subscribe(messages => {
        this.addChannelMessages(channelId, messages);
        subscribe.next(messages);
        subscribe.complete();
      })
    })
  }



  public getMessages(channelId: string): void {
    let channelIndex = this.messageState.value.findIndex((x: any) => x.channel_id == channelId);
    if(channelIndex <= -1) {
      this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message').subscribe(messages => {
        this.addChannelMessages(channelId, messages);
      })
    }
  }

  public deleteMessage(message: any): Observable<any> {
   return new Observable(subscriber => {
      if(!message.error && message.type != 99){
        this.http.delete<any>(environment.baseUrl+'/channel/'+message._id+'/message').subscribe(message =>{
          this.removeMessageState(message);
          subscriber.next(message);
          subscriber.complete();
        });
      } else {
        if(message.error == true || message.type == 99){
          this.removeMessageState(message);
          subscriber.next(message);
          subscriber.complete();
        }
      }
      
   })
  }
  

}

