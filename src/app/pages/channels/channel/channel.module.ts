import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChannelComponentModule } from '../../../components/channel/channel.module'

@NgModule({
  declarations: [
    ChannelComponent,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    ChannelComponentModule,
    ChannelRoutingModule
  ]
})
export class ChannelModule { }
