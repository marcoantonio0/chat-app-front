import { SocketService } from '../../../_services/socket.service';
import { GuildService } from 'src/app/_services/guild.service';
import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'list-members',
  templateUrl: './list-members.component.html',
  styleUrls: ['./list-members.component.scss']
})
export class ListMembersComponent implements OnInit {
  @Input('guildId') guildId: string = '';
  members: any[] = [];
  constructor(
    private socket: SocketService,
    private sanitizer: DomSanitizer,
    private guild: GuildService
  ) { }

  urlParse(name: string): any {
    
  }

  ngOnInit(): void {
    this.guild.getMembers(this.guildId);
    let time = 20;
    this.guild.guildMembers.subscribe(members => {
      
      this.members = members.filter(x => x.guild_id == this.guildId)[0].members;
      this.members.forEach(e => {
        time += 20;
        setTimeout(() => {
          e['show'] = true;
        }, time);
      })
    })
  }

}
