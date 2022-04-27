import { PlaceholderNameImageModule } from './../../../_pipes/placeholder-name-image/placeholder-name-image.module';
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendRoutingModule } from './friend-routing.module';
import { FriendComponent } from './friend.component';
import { AddFriendModule } from 'src/app/components/add-friend/add-friend.module';
import { MatDialogModule } from '@angular/material/dialog'
import {MatRippleModule} from '@angular/material/core';
import { ListFriendComponent } from './list-friend/list-friend.component';
import { MatButtonModule } from '@angular/material/button';
import { NgxTippyModule } from 'ngx-tippy-wrapper';


@NgModule({
  declarations: [
    FriendComponent,
    ListFriendComponent
  ],
  imports: [
    CommonModule,
    AddFriendModule,
    MatButtonModule,
    PlaceholderNameImageModule,
    ContextMenuModule,
    MatDialogModule,
    MatRippleModule,
    NgxTippyModule,
    FriendRoutingModule
  ]
})
export class FriendModule { }
