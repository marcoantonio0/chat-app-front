import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { Subscription } from 'rxjs';
import { ChannelService } from 'src/app/_services/channel.service';
import { ElectronService } from 'src/app/_services/electron.service';
import { GuildService } from 'src/app/_services/guild.service';
import { MeService } from 'src/app/_services/me.service';
import { MessageService } from 'src/app/_services/message.service';
import { SocketService } from 'src/app/_services/socket.service';
import { v4 as uuidv4 } from 'uuid'
@Component({
  selector: 'channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnChanges {
  @Input() channelId?:  string  = '';
  @Input() guildId?:  string  = '';
  @Input() type: 'DM'|'CHANNEL' = 'CHANNEL';
  @Input() guild?:  any = '';
  @Input() channel:  any = '';
  content = new FormControl('');
  messages: any[] = [];
  @ViewChild('scrollable', { static:true }) scroll !: NgScrollbar;
  messageObservable!: Subscription | null;
  messageStateObservable!: Subscription | null;
  constructor(
    private title: Title,
    public electron: ElectronService,
    private sGuild: GuildService,
    private sChannel: ChannelService,
    public me: MeService,
    private message: MessageService,
    private socket: SocketService,
    private route: ActivatedRoute
  ) {
    // this.route.parent?.parent?.params.subscribe(params =>{
    //   this.route.params.subscribe(paramsChannel => {
    //     this.channelId = paramsChannel['channelId'];
    //     this.guildId = params['guildId'];
    //     this.guild = this.sGuild.guilds.value.filter(x => x._id == this.guildId)[0];
    //     this.channel = this.guild['channels'].filter((x:any) => x._id == this.channelId)[0];
    //     this.title.setTitle(this.channel.name);
    //     this.socket.joinGuildAndChannel(this.guildId, [this.channelId]);
    //     // Limpar os observadores e chama as mensagens
    //     this.clearObservables();
    //     this.getMessages(this.channelId);
    //   })
     
    // })
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.clearObservables();
    this.socket.joinGuildAndChannel('', [this.channelId || '']);
    this.getMessages(this.channelId || '');
    if(!this.channel){
      this.channel = this.sChannel.channelsDMState.value.filter(x => x._id == this.channelId)[0];
      if(this.type == 'DM'){
        this.title.setTitle(this.channel.recipients[0].name);
      } else {
        this.title.setTitle(this.channel.name);
      }
    }
    
    // this.channelId = paramsChannel['channelId'];
    // this.guildId = params['guildId'];
    // this.title.setTitle(this.channel.name);
    // Limpar os observadores e chama as mensagens
   
  }

  sendMessageEnter(event: KeyboardEvent){
    if(event.key == 'Enter' && !event.shiftKey){
      this.sendMessage();
    }
  }

  clearObservables(){
    console.log(this.messageStateObservable);
    if(this.messageObservable) {
      this.messageObservable.unsubscribe()
      this.messageObservable = null;
    }
    if(this.messageStateObservable) {
      this.messageStateObservable.unsubscribe()
      this.messageStateObservable = null;
    }
  }

   getMessages(channelId: string) {
    this.messages = [];
    
    this.messageObservable = this.message.getMessages(channelId).subscribe({
      next: messages => {
        this.messages = [...messages];
        this.messages.forEach(e => e['recived'] = true);
        if(!this.messageStateObservable){
          this.messageStateObservable = this.message.messageState.subscribe(changeMessagesState => {
            let messagesChannel = this.message.getMessagesByChannelId(channelId);
            let newMessage = messagesChannel[messagesChannel.length-1];
             if(
             this.messages.findIndex(x => x.nonce == newMessage.nonce) <= -1 &&
             newMessage.channel_id == channelId
             ){
              newMessage['recived'] = true;
              newMessage['animation'] = true;
               this.messages = [...this.messages, newMessage];
             }
          })
        }
      },
      error: messages => {
        console.log(messages);
      },
      complete: () =>{
        this.messageObservable?.unsubscribe();
      }
    })
  }

  scrollBottom(){
    this.scroll.scrollTo({ bottom: 0, duration: 0 });
  }

  getLastMessage(i: number){
    console.log( this.messages[i]);
    return this.messages[i];
  }

  sendMessage(){
    let nonce = uuidv4();
    let message = {
      content: this.content.value,
      author: this.me.meSubject.value,
      createdAt: new Date().toISOString(),
      nonce,
      animation: true,
      recived: false
    };

    let messageData = {
      nonce,
      content: this.content.value
    }
    this.sChannel.sendMessage(this.channelId || '', messageData).subscribe(r => {
      let index = this.messages.findIndex(x => x.nonce == r.nonce);
      this.messages[index] = r;
      this.messages[index]['recived'] = true;
    })

    this.messages = [ ...this.messages, message ]
    setTimeout(() => {
      this.scroll.scrollTo({ bottom: 0, duration: 0 })
    }, 0);
    this.content.reset();
  }

  ngOnInit(): void {
  
  }

}
