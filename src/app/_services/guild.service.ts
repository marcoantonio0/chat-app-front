import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  guilds: BehaviorSubject<any[]>;
  constructor(
    private http: HttpClient
  ) {
    this.guilds = new BehaviorSubject<any[]>([]);
  }

  create(data: any){
    return this.http.post(environment.baseUrl+'/guild', data);
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

  getMembers(guildId: string): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl+'/guild/'+guildId+'/members');
  }
}
