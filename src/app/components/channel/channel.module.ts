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
import { PlaceholderNameImageModule } from 'src/app/_pipes/placeholder-name-image/placeholder-name-image.module';

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

  renderer.image = (text: string) => {
    return text;
  }
  renderer.table = (text: string) => {
    return text;
  }
  renderer.tablecell = (text: string) => {
    return text;
  }
  renderer.tablerow = (text: string) => {
    return text;
  }

  renderer.text = (text: string) => {
    let regex = /(^|[^@\w])@(\w{1,15})\b/g;
    let textReplaced = text.replace(regex, '<span class="mention">@$2</span>');
  
    return textReplaced;
  }


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
    PlaceholderNameImageModule,
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
