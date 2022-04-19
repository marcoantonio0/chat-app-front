import { Subscription } from 'rxjs';
import { MessageService } from './../../../_services/message.service';
import { SocketService } from './../../../_services/socket.service';
import { FormControl } from '@angular/forms';
import { MeService } from './../../../_services/me.service';
import { ChannelService } from './../../../_services/channel.service';
import { ElectronService } from './../../../_services/electron.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/_services/guild.service';
import { v4 as uuidv4 } from 'uuid';
import { NgScrollbar } from 'ngx-scrollbar';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  channelId:  string  = '';
  guildId:  string  = '';
  guild:  any = '';
  channel:  any = '';
  content = new FormControl('');
  messages: any[] = [];
  @ViewChild('scrollable', { static:true }) scroll !: NgScrollbar;
  messageObservable!: Subscription | null;
  messageStateObservable!: Subscription | null;
  constructor(
    public electron: ElectronService,
    private sGuild: GuildService,
    public me: MeService,
    private route: ActivatedRoute
  ) {
    this.route.parent?.parent?.params.subscribe(params =>{
      this.route.params.subscribe(paramsChannel => {
        this.channelId = paramsChannel['channelId'];
        this.guildId = params['guildId'];
        this.guild = this.sGuild.guilds.value.filter(x => x._id == this.guildId)[0];
        this.channel = this.guild['channels'].filter((x:any) => x._id == this.channelId)[0];
      })
     
    })
  }



  ngOnInit(): void {
  
  }

}
