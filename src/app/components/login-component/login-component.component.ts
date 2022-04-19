import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit {
  isLoading = false;
  loginGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  error = '';
  returnUrl = '/';
  @Output() loginEvent = new EventEmitter<any>();
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
   
  }

  login(){
    this.error = '';
    if(this.loginGroup.valid){
      this.isLoading = true;
      this.loginGroup.disable();
      this.auth.login(this.loginGroup.value.username, this.loginGroup.value.password).subscribe(r =>{
        this.loginEvent.emit(r);
      }, e => {
        this.error = e.error.message;
        this.loginGroup.enable();
        this.isLoading = false;
      })
    } else {
      this.loginGroup.markAllAsTouched();
      this.loginGroup.controls['username'].markAsDirty();
      this.loginGroup.controls['password'].markAsDirty();
    }
  }

  getError(control: AbstractControl){
    if(control.hasError('required')){
      return 'Este campo é obrigatório.'
    }
    if(control.hasError('email')){
      return 'Insira um e-mail válido.'
    }
    return '';
  }

}
