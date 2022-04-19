import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponentComponent } from './login-component.component';



@NgModule({
  declarations: [
    LoginComponentComponent
  ],
  imports: [
    ReactiveFormsModule,

    CommonModule
  ],
  exports:[LoginComponentComponent]
})
export class LoginComponentModule { }
