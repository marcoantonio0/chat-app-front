import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  years: number[] = [];
  isLoading = false;
  error = '';
  day = new FormControl('', [Validators.required]);
  year = new FormControl('', [Validators.required]);
  month = new FormControl('', [Validators.required]);
  registerGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(32)]),
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthday: new FormControl(''),
  })
  returnUrl = '/';
  constructor(
    private title: Title,
    private sAuth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private sUser: UserService
  ) {
    this.title.setTitle('Registrar no App')
    if(Object.keys(this.sAuth.currentUserValue).length > 0) { 
      this.router.navigate(['/']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    let currentYear = new Date().getFullYear();
    let earliestYear = 1970;

    while (currentYear >= earliestYear) {
      this.years.push(currentYear);
      currentYear -= 1;
    }
  }

  getError(control: AbstractControl) {
    if(control.hasError('required')){
      return 'Este campo é obrigatório.'
    }
    if(control.hasError('email')){
      return 'Insira um e-mail válido.'
    }
    return '';
  }

  getDateError(){
    if(
      (this.day.touched && this.day.dirty && this.day.invalid) ||
      (this.month.touched && this.month.dirty && this.month.invalid) ||
      (this.year.touched && this.year.dirty && this.year.invalid)
    ) {
      return 'Este compo é obrigatório.';
    }
    return '';
  }

  save(){
    if(this.registerGroup.invalid){
      this.dirtyAndTouch();
    } else {
      this.isLoading = true;
      this.disable();
      let value = this.registerGroup.getRawValue();
      value['birthday'] = new Date(this.year.value, parseInt(this.month.value)-1, this.day.value).toISOString();
      this.sUser.create(value).subscribe(r => {
        this.auth.login(this.registerGroup.value.email, this.registerGroup.value.password).subscribe(e =>{
          this.router.navigate([this.returnUrl]);
        }, e => {
          this.router.navigate([this.returnUrl]);
        })
      }, e => {
        this.error = e.error.message;
        this.enable();
        this.isLoading = false;
      })
    }
  }

  disable(){
    this.registerGroup.disable();
    this.day.disable();
    this.year.disable();
    this.month.disable();
  }

  enable(){
    this.registerGroup.enable();
    this.day.enable();
    this.year.enable();
    this.month.enable();
  }

  dirtyAndTouch(){
    this.registerGroup.markAllAsTouched()
    this.registerGroup.controls['username'].markAsDirty();
    this.registerGroup.controls['password'].markAsDirty();
    this.registerGroup.controls['email'].markAsDirty();
    this.day.markAsDirty()
    this.day.markAllAsTouched();
    this.year.markAsDirty()
    this.year.markAllAsTouched();
    this.month.markAsDirty()
    this.month.markAllAsTouched();
  }

  ngOnInit(): void {
  }

}
