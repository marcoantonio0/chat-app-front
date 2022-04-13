import { ElectronService } from './../../../_services/electron.service';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { map } from 'rxjs';
import { AddFriendComponent } from 'src/app/components/add-friend/add-friend.component';
import { UserService } from 'src/app/_services/user.service';


@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {
  users: any[] = [];
  total = 0;
  currentTab: 'ONLINE' | 'ALL' | 'PEDING' | 'BLOCKED' = 'ONLINE';
  changeTabEvent = new EventEmitter();
  constructor(
    public electron: ElectronService,
    private _dialog: MatDialog,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.listFriends('disponible');
    this.changeTabEvent.subscribe(type =>{
      switch (type) {
        case 'ONLINE':
          this.listFriends('disponible');
          break;
          
        case 'ALL':
          this.listFriends('all');
          break;
        case 'PEDING':
          this.listFriends('peding');
          break;
        case 'BLOCKED':
          this.listFriends('blocked');
          break;
      
        default:
          this.listFriends('disponible');
          break;
      }
     
    })
  }

  listFriends(type: 'all'|'peding'|'blocked'|'disponible'){
    this.total = 0;
    this.users = [];
    this.user.listFriends(type).subscribe(list => {
      this.users = list.list;
      this.total = list.total;
    });
  }

  changeTab(tabType: 'ONLINE' | 'ALL' | 'PEDING' | 'BLOCKED'){
    if(tabType != this.currentTab) {
      this.currentTab = tabType;
      this.changeTabEvent.emit(tabType);
      return;
    }
    return;
  }



  newFriend(){
    this._dialog.open(AddFriendComponent);
  }

}
