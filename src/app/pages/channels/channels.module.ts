import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsComponent } from './channels.component';
import { GuildMenuContextModule } from 'src/app/_directives/guild-menu-context/guild-menu-context.module';


@NgModule({
  declarations: [
    ChannelsComponent
  ],
  imports: [
    CommonModule,
    GuildMenuContextModule,
    ChannelsRoutingModule
  ]
})
export class ChannelsModule { }
