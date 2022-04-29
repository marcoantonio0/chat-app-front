import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from './channel.component';
import { ListMembersComponent } from './list-members/list-members.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextFieldModule} from '@angular/cdk/text-field';
import { PlaceholderNameImageModule } from 'src/app/_pipes/placeholder-name-image/placeholder-name-image.module';
import { SafeHtmlPipe } from 'src/app/_pipes/safe-html/safe-html.pipe';
import { SafeHtmlModule } from 'src/app/_pipes/safe-html/safe-html.module';



@NgModule({
  declarations: [
    ChannelComponent,
    ListMembersComponent
  ],
  imports: [
    CommonModule,
    PlaceholderNameImageModule,
    NgScrollbarModule,
    TextFieldModule,
    SafeHtmlModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  exports:[
    ChannelComponent,
    ListMembersComponent
  ],
  providers: []
})
export class ChannelComponentModule { }
