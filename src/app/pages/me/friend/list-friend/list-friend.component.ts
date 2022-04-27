import { Router } from '@angular/router';
import { ChannelService } from './../../../../_services/channel.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-list-friend',
  templateUrl: './list-friend.component.html',
  styleUrls: ['./list-friend.component.scss']
})
export class ListFriendComponent implements OnInit, OnChanges {
  @Input() users: any[] = [];
  @Input() type: 'LIST' | 'REQUEST' | 'BLOCKED' = 'LIST'; 
  constructor(
    private router: Router,
    private channel: ChannelService,
    private user: UserService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    let time = 20;
    this.users.forEach(user => {
      user['show'] = false;
    })
    this.users.forEach(user => {
      time += 20;
      setTimeout(() => {
        user['show'] = true;
      },time);
    })
  }

  ngOnInit(): void {
  }

  acceptOrRecuse(type: 'accept'|'recuse', id: string, i: number) {
    this.user.acceptOrRecuse(type, id).subscribe(r =>{
      this.users.splice(i, 1);
    });
  }

  createDM(user: any){
    this.channel.createDM(user._id).subscribe({
      next: (channel: any) =>{
        this.router.navigate(['/@me/channel/'+channel._id])
      },
      error: (error: any) => {
        
      }
    })
  }

  deleteRequest(id: string, i: number) {
    this.user.deleteFriend(id).subscribe(r =>{
      this.users.splice(i, 1);
    });
  }

}
