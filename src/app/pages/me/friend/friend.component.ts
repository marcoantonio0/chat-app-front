import { ElectronService } from './../../../_services/electron.service';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { map, Subscription } from 'rxjs';
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
  listSubscription!: Subscription|null;
  constructor(
    public electron: ElectronService,
    private _dialog: MatDialog,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.user.friendsState.subscribe(friends => {
     this.users = [];
     switch (this.currentTab) {
      case 'ONLINE':
        this.users = friends.filter(x => (x.activity_status == 'ONLINE' || x.activity_status == 'BUZY' || x.activity_status == 'AFK') && (!x.new_friendship && !x.blocked));
        break;
        
      case 'ALL':
        this.users = friends.filter(x => !x.new_friendship && !x.blocked);
        break;
      case 'PEDING':
        this.users = friends.filter(x => x.new_friendship == true);
        break;
      case 'BLOCKED':
        this.users = friends.filter(x => x.blocked == true && !x.new_friendship);
        break;
    
      default:
        this.users = friends;
        break;
    }
    })
    this.user.listFriends('disponible');
    this.changeTabEvent.subscribe(type =>{
      this.users = [];
      switch (type) {
        case 'ONLINE':
          this.user.listFriends('disponible');
          break;
          
        case 'ALL':
          this.user.listFriends('all');
          break;
        case 'PEDING':
          this.user.listFriends('peding');
          break;
        case 'BLOCKED':
          this.user.listFriends('blocked');
          break;
      
        default:
          this.user.listFriends('disponible');
          break;
      }
    });
  }

  listFriends(type: 'all'|'peding'|'blocked'|'disponible', friends: any[]){
    switch (type) {
      case 'disponible':
        this.users = friends.filter(x => x.activity_status == 'ONLINE' || x.activity_status == 'AFK' || x.activity_status == 'BUZY');
        break;
        
      case 'all':
        this.users = friends;
        break;
      case 'peding':
        this.users = friends;
        break;
      case 'blocked':
        this.users = friends;
        break;
    
      default:
        this.users = friends;
        break;
    }
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
