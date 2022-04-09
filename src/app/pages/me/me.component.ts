import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  currentUrl = '';
  constructor(
    private router: Router
  ) {
    
    this.router.events.subscribe((val) => {
     
    });
  }

  urlContains(param: string){
    if(param == ''){
      return this.router.url.split('/')[1].includes('@me') && this.router.url.split('/').length <=2
    }
    return this.router.url.includes(param);
  }

  ngOnInit(): void {
  }

}
