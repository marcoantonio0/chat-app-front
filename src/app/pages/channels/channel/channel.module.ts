import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelRoutingModule } from './channel-routing.module';
import { ChannelComponent } from './channel.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ListMembersComponent } from './list-members/list-members.component';


@NgModule({
  declarations: [
    ChannelComponent,
    ListMembersComponent
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    ReactiveFormsModule,
    ChannelRoutingModule
  ],
  exports:[ListMembersComponent]
})
export class ChannelModule { }
