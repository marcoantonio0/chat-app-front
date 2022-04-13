import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewChannelComponent } from './new-channel.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    NewChannelComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports: [NewChannelComponent]
})
export class NewChannelModule { }
