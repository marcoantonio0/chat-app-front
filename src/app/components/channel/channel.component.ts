import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, AfterViewInit, NgZone, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subscription, take } from 'rxjs';
import { ChannelService } from 'src/app/_services/channel.service';
import { ElectronService } from 'src/app/_services/electron.service';
import { GuildService } from 'src/app/_services/guild.service';
import { MeService } from 'src/app/_services/me.service';
import { MessageService } from 'src/app/_services/message.service';
import { SocketService } from 'src/app/_services/socket.service';
import { v4 as uuidv4 } from 'uuid';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({
  selector: 'channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnChanges, AfterViewInit {
  typingUsers: any[] = [];
  @Input() channelId?:  string  = '';
  @Input() guildId?:  string  = '';
  @Input() type: 'DM'|'CHANNEL' = 'CHANNEL';
  @Input() guild?:  any = '';
  autoScroll = true;
  @Input() channel:  any = '';
  content = new FormControl('');
  messages: any[] = [];
  isLoadingMore = false;
  lastScrollHeight = 0;
  scrollTo = '';
  isLoading = false;
  isFirst = true;
  isTyping = false;
  stopTiming: any;
  @ViewChild('scrollable', { static:true }) scroll !: NgScrollbar;
  messageObservable!: Subscription | null;
  messageStateObservable!: Subscription | null;
  removeScrollObservable!: Subscription | null;
  clearTypingState!: Subscription | null;
  currentUser: any;
  currentReplayState: any | null = null;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;
  constructor(
    private title: Title,
    public electron: ElectronService,
    private sGuild: GuildService,
    private sChannel: ChannelService,
    public me: MeService,
    private message: MessageService,
    private _ngZone: NgZone,
    private socket: SocketService,
    private route: ActivatedRoute
  ) {    
    this.currentUser = this.me.meSubject.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.clearObservables();
    this.socket.joinGuildAndChannel(this.guildId || '', [this.channelId || '']);
    this.deleteMessageActivity();
    if(this.type == 'DM'){
      this.channel = this.sChannel.channelsDMState.value.filter(x => x._id == this.channelId)[0];
      this.title.setTitle(this.channel.recipients[0].name);
      this.getMessages(this.channelId || '');
      this.getTypingState();
    } else {
      this.guild = this.sGuild.guilds.value.filter(x => x._id == this.guildId)[0];
      this.channel = this.sChannel.channelsState.value.filter(x => x._id == this.channelId)[0];
      this.title.setTitle(this.channel.name);
      this.getMessages(this.channelId || '');
      this.getTypingState();
    }
    
    // this.channelId = paramsChannel['channelId'];
    // this.guildId = params['guildId'];
    // this.title.setTitle(this.channel.name);
    // Limpar os observadores e chama as mensagens
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.autosize.resizeToFitContent(true)
    });
  }

  ngAfterViewInit(): void {
    this.scroll.scrolled.subscribe((e:any) => {
      this.sChannel.updateScrollTopChannel(this.channelId || '', e.target.scrollTop);
      if(e.target.scrollTop == this.scroll.viewport.scrollMaxY) {
        this.autoScroll = true;
      } else {
        this.autoScroll = false;
      }
      console.log(this.channel?.first_message[0]?._id != this.messages[0]?._id);
     if (e.target.scrollTop <= 300 && !this.isLoadingMore && this.channel?.first_message[0]?._id != this.messages[0]?._id) {
      this.isFirst  = true;
      this.isLoadingMore = true;
      this.scrollTo = this.messages[0]?._id;
      this.message.getMessagesBefore(this.channelId || '', this.messages[0]?._id).subscribe(e => {
        this.isLoadingMore = false;
      })
     } 
    });
  }

  getTypingState() {
    this.typingUsers = [];
    this.clearTypingState = this.sChannel.typingState.subscribe(states => {
      let channelTypingStates = states.filter(x => x.channelId == this.channelId || '')[0];
      if(channelTypingStates){
        this.typingUsers = [...channelTypingStates?.states.filter((x: any) => x.user._id != this.me.meSubject.value._id)];
      }
    })
  }

  sendMessageEnter(event: KeyboardEvent) {
    if(event.key == 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  typing() {
    if(!this.isTyping){
      this.isTyping = true;
      this.sChannel.setTyping(this.channelId || '').subscribe(r => {});
    }
    this.stopTiming = setTimeout(() => {
      this.isTyping = false;
    }, 8000);
  }

  clearObservables(){
    if(this.messageObservable) {
      this.messageObservable.unsubscribe()
      this.messageObservable = null;
    }
    if(this.messageStateObservable) {
      this.messageStateObservable.unsubscribe()
      this.messageStateObservable = null;
    }
    if(this.clearTypingState){
      this.clearTypingState.unsubscribe();
      this.clearTypingState = null;
    }
  }

 

  

   getMessages(channelId: string) {
    this.isFirst = true;
    this.messages = [];
    this.message.getMessages(this.channelId || '');
    
    this.messageObservable = this.message.messageState.subscribe(msg => {
      let messagesChannel = this.message.getMessagesByChannelId(channelId);
      if(this.isFirst && messagesChannel.length > 0) {
        this.messages = [];
        this.messages = [...messagesChannel];
        this.messages.forEach(e => {
          e['recived'] = true
          e['animation'] = true
        });
        

        if(this.scrollTo){
          this.scroll.scrollToElement('#message-'+this.messages.findIndex(x => x._id == this.scrollTo), { duration: 0 }).then(e =>{
            this.scrollTo = '';
          })
        }
        this.isFirst = false;
      }
      let newMessage = messagesChannel[messagesChannel.length-1];
      if(
      this.messages.findIndex(x => x.nonce == newMessage.nonce) <= -1 &&
      newMessage?.channel_id == channelId
      ){
        if(newMessage.author._id == this.me.meSubject.value._id && newMessage['recived'] == false){
          newMessage['animation'] = true;
        } else {
          newMessage['recived'] = true;
          newMessage['animation'] = true;
        }
        this.messages = [...this.messages, newMessage];
     } else {
       if( this.messages.findIndex(x => x.nonce == newMessage.nonce) >= 0 &&
       newMessage?.channel_id == channelId) {
        newMessage['recived'] = true;
        this.messages[this.messages.findIndex(x => x.nonce == newMessage.nonce)] = newMessage;
       }
     }
    })
  }

  getTyping(){
    let names = '';
    this.typingUsers.forEach((e,i) =>{
      if(this.typingUsers.length == 1 || this.typingUsers.length == 0){
        names += `<b>${e.user.name}</b>`;
      }
      if(this.typingUsers.length > 1 && i == this.typingUsers.length-1){
        names+=` e <b>${e.user.name}</b>`;
      }
      if(this.typingUsers.length > 1 && i != this.typingUsers.length-1){
        names+=`<b>${e.user.name}</b>${i != this.typingUsers.length-2 ? ',' : ''} `
      }
    })
    if(this.typingUsers.length == 1) names+=' está digitando...';
    if(this.typingUsers.length > 1) names+=' estão digitando...';
    if(this.typingUsers.length <= 0) names+='';
    if(this.typingUsers.length > 5) names ='Várias pessoas digitando...';
    return names;
  }

  scrollBottom(){
    if(this.autoScroll){
      this.scroll.scrollTo({ bottom: 0, duration: 0 });
    }
  }

  deleteMessageActivity(){
    this.socket.currentSocketConnection?.on('delete_message', message => {
      console.log(this.messages.findIndex(x => x.nonce == message.nonce));
      if(this.messages.findIndex(x => x.nonce == message.nonce) >= 0){
        let index = this.messages.findIndex(x => x.nonce == message.nonce);
        this.messages.splice(index, 1);
      }
    })
  }


  sendMessage(){
    if(this.content.value && this.content.value.length > 0){
      let nonce = uuidv4();
      let message = {
        content: this.content.value,
        author: this.me.meSubject.value,
        createdAt: new Date().toISOString(),
        nonce,
        channel_id: this.channelId,
        animation: true,
        type: 0,
        referenced_message: this.currentReplayState,
        recived: false
      };
      
  
      let messageData = {
        nonce,
        referenced_message: this.currentReplayState?._id,
        content: this.content.value
      }
      if(this.currentReplayState) {
        this.currentReplayState = null;
      }
      this.message.addMessageState(message);
      this.sChannel.sendMessage(this.channelId || '', messageData).subscribe(r => {
        this.isTyping = false;
        this.message.addMessageState(r);
      })
      this.content.reset();
    }
  }

  ngOnInit(): void {
  
  }

  replayState(message: any) {
    this.currentReplayState = message;
    this.textArea.nativeElement.focus();
  }

  removeReplayState() {
    this.currentReplayState = null;
  }

  scrollToReplayed(){
    const index = this.messages.findIndex((x:any) => x._id == this.currentReplayState._id);
    this.scroll.scrollToElement('#message-'+index);
  }

  deleteMessage(message: any, index: number) {
    this.message.deleteMessage(message).subscribe(r =>{
      this.messages.splice(index, 1);
    })
  }

}
