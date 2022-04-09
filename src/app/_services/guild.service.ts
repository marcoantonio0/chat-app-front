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

  list(): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl+'/guild');
  }

  get(guildId: string): Observable<any> {
    return this.http.get<any>(environment.baseUrl+'/guild/'+guildId).pipe(map(guild => {
      if (this.guilds.value.filter(x => x._id == guildId).length <= 0) {
        let value = [];
        if(this.guilds.value.length >= 10){
           value = this.guilds.value.pop()
        }
        this.guilds.next([ guild, ...value ]);
      }
      return guild;
    }))
  }
}
