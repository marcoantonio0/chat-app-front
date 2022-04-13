
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from './channel.component';
import { ListMembersComponent } from './list-members/list-members.component';



@NgModule({
  declarations: [
    ChannelComponent,
    ListMembersComponent
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    ReactiveFormsModule
  ],
  exports:[
    ChannelComponent,
    ListMembersComponent
  ]
})
export class ChannelComponentModule { }
