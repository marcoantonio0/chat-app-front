import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeService {
  meSubject: BehaviorSubject<any>;
  constructor(
    private http: HttpClient
  ) {
    this.meSubject = new BehaviorSubject<any>(null);
  }

  me(): Observable<any> {
    return this.http.get(environment.baseUrl+'/me');
  }
}
