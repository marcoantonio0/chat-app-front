import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  error = '';
  constructor(
    private title: Title,
    private auth: AuthService,
    private router: Router
  ) {
    this.title.setTitle('Entrar no App');
    if(Object.keys(this.auth.currentUserValue).length > 0) { 
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  login(){
    this.error = '';
    if(this.loginGroup.valid){
      this.isLoading = true;
      this.loginGroup.disable();
      this.auth.login(this.loginGroup.value.username, this.loginGroup.value.password).subscribe(r =>{
        console.log(r);
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
