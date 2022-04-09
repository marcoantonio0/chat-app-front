import { Component, OnInit } from '@angular/core';
import { MeService } from 'src/app/_services/me.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  isLoading = true;
  me: any = null;
  constructor(
    private sMe: MeService
  ) {
    this.sMe.me().subscribe(r => {
      this.isLoading = false;
      this.sMe.meSubject.next(r);
      this.me = r;
    })
  }

  ngOnInit(): void {
  }

}
