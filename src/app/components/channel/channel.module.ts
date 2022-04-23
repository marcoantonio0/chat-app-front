import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from './channel.component';
import { ListMembersComponent } from './list-members/list-members.component';
import { MarkedRenderer, MarkdownModule, MarkedOptions } from 'ngx-markdown';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TextFieldModule} from '@angular/cdk/text-field';

export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return text;
  };
  renderer.heading = (text: string) => {
    return text;
  };
  renderer.listitem = (text: string) => {
    return text;
  };

  renderer.link = (href: string, title: string) => {
    return `<a href="${href}" target="_blank">${title || href}</a>`;
  }

  return {
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

@NgModule({
  declarations: [
    ChannelComponent,
    ListMembersComponent
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    TextFieldModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
    MatTooltipModule
  ],
  exports:[
    ChannelComponent,
    ListMembersComponent
  ]
})
export class ChannelComponentModule { }
