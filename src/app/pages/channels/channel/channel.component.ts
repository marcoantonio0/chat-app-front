import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/_services/guild.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  channelId: null | string  = null;
  guildId: null | string  = null;
  guild: null | any = null;
  channel: null | any = null;
  constructor(
    private title: Title,
    private sGuild: GuildService,
    private route: ActivatedRoute
  ) {
    this.route.parent?.parent?.params.subscribe(params =>{
      this.route.params.subscribe(paramsChannel => {
        this.channelId = paramsChannel['channelId'];
        this.guildId = params['guildId'];
        this.guild = this.sGuild.guilds.value.filter(x => x._id == this.guildId)[0];
        
        this.channel = this.guild['channels'].filter((x:any) => x._id == this.channelId)[0];
        this.title.setTitle(this.channel.name);
        console.log(this.channel);
      })
     
    })
  }

  ngOnInit(): void {
  }

}
