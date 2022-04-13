import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(
    private http: HttpClient
  ) { }

  create(guildId: string, data: any): Observable<any> {
    return this.http.post(environment.baseUrl+'/channel/'+guildId+'/create', data);
  }

  listMessages(channelId: string): Observable<any[]>{
    return this.http.get<any[]>(environment.baseUrl+'/channel/'+channelId+'/message');
  }

  sendMessage(channelId: string, data: any): Observable<any>{
    return this.http.post<any>(environment.baseUrl+'/channel/'+channelId+'/message', data);
  }
}
