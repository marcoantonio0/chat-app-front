import { ChannelService } from './../../../_services/channel.service';
import { MeService } from 'src/app/_services/me.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from './../../../_services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  channelId = '';
  constructor(
    private router: ActivatedRoute,
    private sChannel: ChannelService,
    private me: MeService,
    private message: MessageService
  ) {
    this.router.params.subscribe({
      next: (params: any) =>{
        console.log(params);
        if(params['channelId']){
          this.channelId = params['channelId'];
        }
      }
    })
  }


  ngOnInit(): void {
  }

}
