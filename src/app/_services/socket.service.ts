import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from './../../environments/environment';

import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public currentSocketConnection: Socket | null = null;
  public statusSocket: BehaviorSubject<any>;
  constructor(
    private auth: AuthService
  ) {
    this.statusSocket = new BehaviorSubject<any>('OFFLINE');
  }

  socket = io(environment.baseUrl,{
    auth: {
      access_token: this.auth.currentUserValue.access_token
    },
    autoConnect: false,
    reconnection: true
  })
  

  connect() {
    this.currentSocketConnection = this.socket.connect();
    this.currentSocketConnection.on('connect', () => {
      this.statusSocket.next('CONNECTED');
    })
    this.currentSocketConnection.on('reconnect', (e: any) => {
      this.statusSocket.next('RECONNECTING');
    })
    this.currentSocketConnection.on('disconnect', (e: any) => {
      this.statusSocket.next('DISCONNECTED');
    })
    this.currentSocketConnection.on('connect_error', (e: any) => {
      this.currentSocketConnection = this.socket.connect();
    })
  }

  joinGuildAndChannel(guildId: string, channels: string[]){
    this.currentSocketConnection?.emit('join_guild', {
      guildId,
      channels,
      typing: true,
      activities: true
    })
  }

  

}
