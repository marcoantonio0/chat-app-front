import { ChannelService } from 'src/app/_services/channel.service';
import { GuildService } from 'src/app/_services/guild.service';
import { SocketService } from './../../../_services/socket.service';
import { AuthService } from './../../../_services/auth.service';
import { Router } from '@angular/router';
import { ElectronService } from './../../../_services/electron.service';
import { Component, OnInit } from '@angular/core';
import { MeService } from 'src/app/_services/me.service';
import { firstValueFrom, EMPTY } from 'rxjs';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  isLoading = true;
  me: any = null;
  constructor(
    private sMe: MeService,
    private router: Router,
    private auth: AuthService,
    private guild: GuildService,
    private channel: ChannelService,
    private socket: SocketService,
    public electron: ElectronService
  ) {
    if(this.router.url == '/'){
      this.router.navigate(['/@me'])
    }
  }

  getAuth(){
    // this.socket.on('message', (e: any) =>{
    //   console.log(e === 'authenticated');
    //   if(e === 'authenticated'){
    //     this.isLoading = false;
    //   } else this.socket.disconnect();
      
    // })
  }

  async ngOnInit(): Promise<void> {
    const me: any = await firstValueFrom(this.sMe.me())
    this.sMe.meSubject.next(me);
    this.me = me;
    const guilds = await firstValueFrom(this.guild.getGuilds());
    console.log(guilds);
    if(guilds.length > 0){
      guilds.forEach(guild=> {
        this.channel.addGuildChannels(guild._id, guild.channels);
      })
    }
    await firstValueFrom(this.channel.listDM())
    this.socket.connect();
    this.socket.statusSocket.subscribe(e =>{
      if(e == 'CONNECTED'){
        this.isLoading = false;
      }
    })
  }

}
