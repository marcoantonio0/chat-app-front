import { LoginComponentModule } from './../../components/login-component/login-component.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteRoutingModule } from './invite-routing.module';
import { InviteComponent } from './invite.component';


@NgModule({
  declarations: [
    InviteComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    LoginComponentModule,
    MatProgressSpinnerModule,
    InviteRoutingModule
  ]
})
export class InviteModule { }
