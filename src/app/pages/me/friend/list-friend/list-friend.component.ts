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
    private user: UserService
  ) { }

  ngOnInit(): void {
  }

  acceptOrRecuse(type: 'accept'|'recuse', id: string, i: number) {
    this.user.acceptOrRecuse(type, id).subscribe(r =>{
      this.users.splice(i, 1);
    });
  }

  deleteRequest(id: string, i: number) {
    this.user.deleteFriend(id).subscribe(r =>{
      this.users.splice(i, 1);
    });
  }

}
