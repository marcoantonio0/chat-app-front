import { Title } from '@angular/platform-browser';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GuildService } from 'src/app/_services/guild.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  token = '';
  invite: any | null = null;
  hasError = false;
  isLoading = true;
  isNotAuth = false;
  isLoadingInvite = false;
  disabled = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private sGuild: GuildService,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.auth.currentUser.subscribe(e =>{
      if(Object.keys(e).length <= 0){
        this.isNotAuth = true;
      } else {
        this.isNotAuth = false;
        this.disabled = false;
      }
    })
    this.route.parent?.params.subscribe(params => {
     if(params['token']){
      this.token = params['token'];
      this.sGuild.getInvite(this.token).subscribe(invite =>{
        this.isLoading = false;
        this.invite = invite;
        this.title.setTitle(invite.guild.name);
      }, e => {
        this.isLoading = false;
        this.hasError =  true;
      })
     }
    })
  }
  

  acceptInvite() {
    this.isLoadingInvite = true;
    this.sGuild.acceptInvite(this.token).subscribe({
      next: (invite) => {
        this.router.navigate(['/channels/'+invite.guild]);
        this.isLoadingInvite = false;
      }, error: (e) => {
        this.isLoadingInvite = false;
      }
    })
  }

  register() {
    this.router.navigate(['/register'], { queryParams: { returnUrl: location.pathname } });
  }

}
