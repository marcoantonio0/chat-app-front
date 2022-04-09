import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './components/layout/content/content.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ContentComponent, children: [
    { path: '@me', loadChildren: () => import('./pages/me/me.module').then(mod => mod.MeModule) }, 
    { path: 'channels', loadChildren: () => import('./pages/channels/channels.module').then(mod => mod.ChannelsModule) }, 
  ] },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(mod => mod.LoginModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(mod => mod.RegisterModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
