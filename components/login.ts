import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as xi from '../interfaces/xapi';
//import * as x from '../all';
@Component({
  selector: 'xapi-login',
  template: `
    <ion-list>
      <ion-item>
        <ion-label primary stacked>{{t.User_ID}}</ion-label>
        <ion-input [(ngModel)]="user.user_login" placeholder="{{t.Input_User_ID}}"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label primary stacked>{{t.Password}}</ion-label>
        <ion-input [(ngModel)]="user.user_pass" placeholder="{{t.Input_Password}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="loading">
        <ion-spinner></ion-spinner> Loading ...
      </ion-item>
      <ion-item *ngIf="message">
        <ion-icon name="star"></ion-icon> {{ message }}
      </ion-item>

      <ion-item>
        <button ion-button (click)="onClickLogin()">{{t.Login}}</button>
        <button ion-button (click)="onClickCancel()">{{t.Cancel}}</button>
      </ion-item>

  </ion-list>
  `
})
export class LoginComponent {
  user: xi.UserLogin = xi.userLogin;
  loading: boolean = false;
  message: string = '';
  t = {
    User_ID: 'User ID',
    Password: 'Password',
    Input_User_ID: 'Input User ID',
    Input_Password: 'Input Password',
    Login: 'Login',
    Cancel: 'Cancel'
  };
  @Output() beforeRequest = new EventEmitter<LoginComponent>();
  @Output() afterRequest = new EventEmitter<LoginComponent>();
  @Output() success = new EventEmitter<xi.UserLoginData>();
  @Output() cancel = new EventEmitter<LoginComponent>();
  @Output() error = new EventEmitter<string>();

  constructor(
    private api: Xapi
    ) {
    console.log('LoginComponent::constructor()');
    this.api.getLoginData( x => this.userAlreadyLoggedIn(x) );
  }

  /**
   * 회원이 이미 로그인을 한 경우 이 함수가 호출된다.
   */
  userAlreadyLoggedIn( user: xi.UserLoginData ) {
  }

  onClickLogin() {
    console.log("LoginComponent::onClickRegister()");
    this.loading = true;
    this.beforeRequest.emit(this);
    this.api.login( this.user, ( re: xi.RegisterResponse ) => {
      this.loading = false;
      this.message = '';
      this.afterRequest.emit(this);
      if ( re.success ) {
        console.log("LoginComponent::onClickRegister() success");
        this.success.emit( re.data );
      }
      else {
        console.log("LoginComponent::onClickRegister() error");
        this.message = <string>re.data;
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      console.log('LoginComponent::onClickRegister() error: ', err);
      // this.error.emit('server_error');
    });
  }

  onClickCancel() {
    this.loading = false;
    console.log("LoginComponent::onClickCancel()");
    this.cancel.emit(this);
  }

}
