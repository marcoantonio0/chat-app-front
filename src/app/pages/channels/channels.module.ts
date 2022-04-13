import { MatDialogModule } from '@angular/material/dialog';
import { NewChannelModule } from './../../components/new-channel/new-channel.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChannelComponentModule } from 'src/app/components/channel/channel.module';


@NgModule({
  declarations: [
    ChannelsComponent
  ],
  imports: [
    CommonModule,
    ContextMenuModule,
    NgxTippyModule,
    ChannelComponentModule,
    NgScrollbarModule,
    NewChannelModule,
    MatDialogModule,
    ChannelsRoutingModule
  ]
})
export class ChannelsModule { }
