import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeComponent } from './me.component';

const routes: Routes = [
  { path: '', component: MeComponent, children:[
    { path: '', loadChildren: () => import('./friend/friend.module').then(mod => mod.FriendModule) },
    { path: 'channel/:channelId', loadChildren: () => import('./channel/channel.module').then(mod => mod.ChannelModule) },
    { path: 'settings', loadChildren: () => import('./settings/settings.module').then(mod => mod.SettingsModule) }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeRoutingModule { }
