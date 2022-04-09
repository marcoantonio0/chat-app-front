import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from './channels.component';

const routes: Routes = [
  { path: ':guildId', component: ChannelsComponent, children: [
    { path: ':channelId', loadChildren: () => import('./channel/channel.module').then(mod => mod.ChannelModule) }, 
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelsRoutingModule { }
