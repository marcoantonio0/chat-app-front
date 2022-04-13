import { Router } from '@angular/router';
import { ChannelService } from './../../../../_services/channel.service';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-list-friend',
  templateUrl: './list-friend.component.html',
  styleUrls: ['./list-friend.component.scss']
})
export class ListFriendComponent implements OnInit {
  @Input() users: any[] = [];
  @Input() type: 'LIST' | 'REQUEST' | 'BLOCKED' = 'LIST'; 
  constructor(
    private router: Router,
    private channel: ChannelService,
    private user: UserService
  ) { }

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
