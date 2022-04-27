import { PlaceholderNameImageModule } from './_pipes/placeholder-name-image/placeholder-name-image.module';
import { GuildService } from 'src/app/_services/guild.service';
import { SocketService } from './_services/socket.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ContentComponent } from './components/layout/content/content.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog'
import { NewGuildModule } from './components/new-guild/new-guild.module';
import { MatMenuModule } from '@angular/material/menu';
import localeBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { MessageService } from './_services/message.service';
import { UserService } from './_services/user.service';
import { AudioService } from './_services/audio.service';
import { MatIconModule } from '@angular/material/icon';

registerLocaleData(localeBr, 'pt')


@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    NgxTippyModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    PlaceholderNameImageModule,
    MatDialogModule,
    MatIconModule,
    NewGuildModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt' },
    UserService,
    GuildService,
    SocketService,
    MessageService,
    AudioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
