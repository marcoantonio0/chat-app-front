import { PlaceholderNameImageModule } from './../../_pipes/placeholder-name-image/placeholder-name-image.module';
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
    PlaceholderNameImageModule,
    NgScrollbarModule,
    MeRoutingModule
  ]
})
export class MeModule { }
