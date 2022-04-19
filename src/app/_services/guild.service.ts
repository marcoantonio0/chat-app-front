import { SocketService } from 'src/app/_services/socket.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  guilds: BehaviorSubject<any[]>;
  guildMembers: BehaviorSubject<any[]>;
  constructor(
    private http: HttpClient,
    private socket: SocketService
  ) {
    this.guilds = new BehaviorSubject<any[]>([]);
    this.guildMembers = new BehaviorSubject<any[]>([]);

  }

  createInvite(guildId: string, data: any): Observable<any> {
    return this.http.post(environment.baseUrl+'/guild/'+guildId+'/invite', data);
  }

  getInvite(token: string): Observable<any> {
    return this.http.get(environment.baseUrl+'/guild/'+token+'/invite');
  }

  create(data: any) {
    return this.http.post(environment.baseUrl+'/guild', data);
  }

  acceptInvite(token: string): Observable<any>  {
    return this.http.post(environment.baseUrl+'/guild/'+token+'/invite/accept', {});
  }

  getGuilds(): Observable<any[]> {
   return new Observable(subscribe => {
      if(this.guilds.value.length <= 0){
        this.http.get<any[]>(environment.baseUrl+'/guild').subscribe(guilds => {
          this.guilds.next([ ...guilds ]);
          subscribe.next(guilds);
        })
      } else {
        subscribe.next(this.guilds.value);
        this.http.get<any[]>(environment.baseUrl+'/guild').subscribe(guilds => {
          this.guilds.next([ ...guilds ]);
          subscribe.next(guilds);
          subscribe.complete();
        })
      }
    })
  }

  getGuildActivitys() {
    this.socket.currentSocketConnection?.on('guild_member_activity', payload => {
      let currentValue = this.guildMembers.value;
      let index = currentValue.findIndex(x => x.guild_id == payload.guild_id);
      let indexMember = currentValue[index].members.findIndex((x:any) => x._id == payload.member._id)
      if(indexMember <= -1){
        currentValue[index].members.push(payload.member)
      } else {
        currentValue[index].members[indexMember] = payload.member;
      }
      this.guildMembers.next(currentValue);
    })
  }

  get(guildId: string): Observable<any> {
    return new Observable(subscribe => {
      if(this.guilds.value.filter(x => x._id == guildId).length <= 0){
        this.http.get<any>(environment.baseUrl+'/guild/'+guildId).subscribe(guild => {
          this.guilds.next([ ...this.guilds.value, guild ]);
          subscribe.next(guild);
          subscribe.complete();
        })
      } else {
        subscribe.next(this.guilds.value.filter(x => x._id == guildId)[0]);
        subscribe.complete();
      }
    })
  }

  getMembers(guildId: string): void {
    let currentValue = this.guildMembers.value;
    if(currentValue.findIndex(x => x.guild_id == guildId) <= -1) {
      currentValue.push({
        guild_id: guildId,
        members: []
      })
    }
    let index = currentValue.findIndex(x => x.guild_id == guildId);
    if(currentValue[index].members.length <= 0) {
      this.http.get<any[]>(environment.baseUrl+'/guild/'+guildId+'/members').subscribe({
        next: (members: any) =>{
          currentValue[index].members = [ ...members ];
          this.guildMembers.next(currentValue);
        }
      })
    } else {
      this.http.get<any[]>(environment.baseUrl+'/guild/'+guildId+'/members').subscribe({
        next: (members: any) =>{
          currentValue[index].members = [ ...members ];
          this.guildMembers.next(currentValue);
        }
      })
    }
  }
}
