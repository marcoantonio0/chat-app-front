import { ChannelComponentModule } from './../../../components/channel/channel.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';


@NgModule({
  declarations: [
    ChannelComponent
  ],
  imports: [
    CommonModule,
    ChannelComponentModule,
    ReactiveFormsModule,
    ChannelRoutingModule
  ]
})
export class ChannelModule { }
