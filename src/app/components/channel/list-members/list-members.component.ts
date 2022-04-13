import { SocketService } from '../../../_services/socket.service';
import { GuildService } from 'src/app/_services/guild.service';
import { Component, Input, OnInit } from '@angular/core';

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
    private guild: GuildService
  ) { }

  ngOnInit(): void {
    this.guild.getMembers(this.guildId).subscribe(members => this.members = members);
    
  }

}
