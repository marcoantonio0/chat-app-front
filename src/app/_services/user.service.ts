import { SocketService } from 'src/app/_services/socket.service';
import { HttpClient } from '@angular/common/http';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  friendsState: BehaviorSubject<any[]>;
  friendsRequestState: BehaviorSubject<any[]>;
  constructor(  
    private http: HttpClient,
    private socket: SocketService
  ) {
    this.friendsState = new BehaviorSubject<any[]>([]);
    this.friendsRequestState = new BehaviorSubject<any[]>([]);

  }

  addFriendByName(name: string): Observable<any> {
    return this.http.post(environment.baseUrl+'/friendship', { name });
  }

  create(data: any){
    return this.http.post(environment.baseUrl+'/user', data);
  }

  listFriends(type: 'all'|'peding'|'blocked'|'disponible'): void {
    this.http.get<any>(environment.baseUrl+'/friendship/list/'+type).subscribe({
      next: (friends) =>{
        this.friendsState.next([ ...this.checkExists(friends.list) ]);
      }
    })
  }

  getMembersActivity(){
    this.socket.currentSocketConnection?.on('friend_activity', friend => {
      this.friendsState.next([ ...this.checkExists([ ...this.friendsState.value, friend]) ]);
    })
  }

  checkExists(friends: any[]){
    let value = this.friendsState.value;
    friends.forEach(friend => {
      if(value.findIndex(x => x._id == friend._id) <= -1){
        value.push(friend);
      } else {
        let index = value.findIndex(x => x._id == friend._id);
        value[index] = friend;
      }
    });
    return value;
  }

  checkExistsRequest(friends: any[]){
    let returnValue: any[] = [];
    let value = this.friendsRequestState.value;
    friends.forEach(friend => {
      if(value.findIndex(x => x._id == friend._id) <= -1){
        returnValue.push(friend);
      }
    });
    return returnValue;
  }

  acceptOrRecuse(type: 'accept'|'recuse', id: string): Observable<any> {
    return this.http.patch(environment.baseUrl+'/friendship/request/'+id+'/'+type, {});
  }
  
  deleteFriend(id: string): Observable<any> {
    return this.http.delete(environment.baseUrl+'/friendship/'+id);
  }
}
