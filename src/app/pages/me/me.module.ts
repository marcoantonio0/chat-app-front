import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeRoutingModule } from './me-routing.module';
import { MeComponent } from './me.component';



@NgModule({
  declarations: [
    MeComponent
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    MeRoutingModule
  ]
})
export class MeModule { }
