import { ChannelService } from './../../_services/channel.service';
import { SocketService } from './../../_services/socket.service';
import { NewChannelComponent } from './../../components/new-channel/new-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { ElectronService } from './../../_services/electron.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GuildService } from 'src/app/_services/guild.service';
import { InviteComponent } from 'src/app/components/invite/invite.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  guild: any = null;
  channels: any[] = [];
  isLoading = true;
  guildId: string = '';
  mediaRecorder!: MediaRecorder;;
  constructor(
    private route: ActivatedRoute,
    public electron: ElectronService,
    private router: Router,
    private socket: SocketService,
    private _dialog: MatDialog,
    private sGuild: GuildService,
    public channel: ChannelService
  ) {

    this.route.params.subscribe(params => {
      this.guildId = params['guildId'];
      this.isLoading = true;
      this.sGuild.get(this.guildId).subscribe(guild => {
        let channelHome = null;
        if(guild['channels'].length > 0) {
          channelHome = guild['home_channel'];
        }
        if(channelHome && this.router.url.split('/').length <= 3) {
          this.router.navigate(['/channels/'+guild._id+'/'+channelHome]);
        }
        this.guild = guild;
        this.channel.channelsState.subscribe(channels => {
          this.listChannels(channels.filter(x => x.guild == guild._id));
        })
        this.isLoading = false;
      })
    })
  }

  checkActive(channelId: string){
    if(this.router.url.split('/')[this.router.url.split('/').length-1] == channelId){
      return true;
    }
    return false;
  }


  listChannels(channels: any[]) {
    let chs: any[] = [];
    let channel = channels.filter(x => x.type == 1 || x.type == 2);
    let category = channels.filter(x => x.type == 0);
    category.forEach(cat => {
      cat['children'] = channel.filter(x => x.parent_id == cat._id);
      chs.push(cat);
    })
    this.channels = chs;
  }

  ngOnInit(): void {
    this.socket.currentSocketConnection?.on("send", function (data) {
      var audio = new Audio(data);
      audio.play();
    });
  }

  joinChannel(channelId: string) { 
    this.channel.connectAudioChannel(channelId);
  }

  newChannel(type: number, parent_id = '') {
    this._dialog.open(NewChannelComponent, {
      data: {
        type,
        parent_id,
        guildId: this.guildId
      }
    })
  }

  newInvite(){
    this._dialog.open(InviteComponent, {
      data: {
        guildId: this.guildId
      }
    })
  }

}
