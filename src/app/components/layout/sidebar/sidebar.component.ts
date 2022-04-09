import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/_services/guild.service';
import { NewGuildComponent } from '../../new-guild/new-guild.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  guilds: any[] = [];
  constructor(
    private router: Router,
    private _dialog: MatDialog,
    private guild: GuildService
  ) {
    this.guild.list().subscribe(r => this.guilds = r)
  }

  newServer(){
    this._dialog.open(NewGuildComponent);
  }

  checkIsActive(guildId: string){
    if(this.router.url.includes('channels')){
      if(this.router.url.includes(guildId)) return true;
      return;
    }
    return;
  }

  acronym(text: string) {
    return text
      .split(/\s/)
      .reduce(function(accumulator, word) {
        return accumulator + word.charAt(0);
      }, '');
  }

  ngOnInit(): void {
  }

}
