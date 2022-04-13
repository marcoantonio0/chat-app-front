import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from './context-menu.component';
import { ContextMenuDirective } from './context-menu.directive';



@NgModule({
  declarations: [
    ContextMenuComponent,
    ContextMenuDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[ContextMenuComponent,ContextMenuDirective]
})
export class ContextMenuModule { }
