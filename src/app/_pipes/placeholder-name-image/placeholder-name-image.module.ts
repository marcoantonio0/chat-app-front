import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceholderNameImage } from './placeholder-name-image.pipe';



@NgModule({
  declarations: [
    PlaceholderNameImage
  ],
  imports: [
    CommonModule
  ],
  exports: [PlaceholderNameImage]
})
export class PlaceholderNameImageModule { }
