import { SocketService } from './../../../_services/socket.service';
import { AuthService } from './../../../_services/auth.service';
import { Router } from '@angular/router';
import { ElectronService } from './../../../_services/electron.service';
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
    private sMe: MeService,
    private router: Router,
    private auth: AuthService,
    private socket: SocketService,
    public electron: ElectronService
  ) {
    this.sMe.me().subscribe(r => {
      this.sMe.meSubject.next(r);
      this.me = r;
      if(this.router.url == '/'){
        this.router.navigate(['/@me'])
      }
      this.socket.connect();
      this.socket.statusSocket.subscribe(e =>{
        if(e == 'CONNECTED'){
          this.isLoading = false;
        }
      })
    })
  }

  getAuth(){
    // this.socket.on('message', (e: any) =>{
    //   console.log(e === 'authenticated');
    //   if(e === 'authenticated'){
    //     this.isLoading = false;
    //   } else this.socket.disconnect();
      
    // })
  }

  ngOnInit(): void {
  }

}
