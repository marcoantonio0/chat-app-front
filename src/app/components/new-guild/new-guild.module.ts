import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewGuildComponent } from './new-guild.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewGuildComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [
    NewGuildComponent
  ]
})
export class NewGuildModule { }
