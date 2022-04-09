import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {
    
  }

  addFriendByName(name: string): Observable<any> {
    return this.http.post(environment.baseUrl+'/friendship', { name });
  }

  create(data: any){
    return this.http.post(environment.baseUrl+'/user', data);
  }

  listFriends(type: 'all'|'peding'|'blocked'|'disponible'): Observable<{
    list: any[],
    total: number
  }> {
    return this.http.get<{
      list: any[],
      total: number
    }>(environment.baseUrl+'/friendship/list/'+type)
  }

  acceptOrRecuse(type: 'accept'|'recuse', id: string): Observable<any> {
    return this.http.patch(environment.baseUrl+'/friendship/request/'+id+'/'+type, {});
  }
  
  deleteFriend(id: string): Observable<any> {
    return this.http.delete(environment.baseUrl+'/friendship/'+id);
  }
}
