import { Title } from '@angular/platform-browser';
import { ChannelService } from 'src/app/_services/channel.service';
import { ElectronService } from './../../_services/electron.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  currentUrl = '';
  channels: any[] = [];
  constructor(
    private router: Router,
    private title: Title,
    public channel: ChannelService,
    public electron: ElectronService
  ) {
    this.title.setTitle('Discorderino');
    
  }

  urlContains(param: string){
    if(param == ''){
      return this.router.url.split('/')[1].includes('@me') && this.router.url.split('/').length <=2
    }
    return this.router.url.includes(param);
  }

  ngOnInit(): void {
    this.channel.listDM().subscribe({
      next: (channels) =>{
        console.log(channels);
        this.channels = channels;
      },
      error: (error) =>{

      }
    })
  }

}
