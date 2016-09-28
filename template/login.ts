import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../service/xapi';
import * as wi from '../interface/wordpress';
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

      <ion-item>
        <button (click)="onClickLogin()">{{t.Login}}</button>
        <button (click)="onClickCancel()">{{t.Cancel}}</button>
      </ion-item>

  </ion-list>
  `,
  providers: [ Xapi ]
})
export class LoginTemplate {
  private user: wi.UserRegisterData = wi.userRegisterData;
  t = {
    User_ID: 'User ID',
    Password: 'Password',
    Input_User_ID: 'Input User ID',
    Input_Password: 'Input Password',
    Login: 'Register',
    Cancel: 'Cancel'
  };
  @Output() beforeLogin = new EventEmitter<LoginTemplate>();
  @Output() success = new EventEmitter<wi.UserData>();
  @Output() cancel = new EventEmitter<LoginTemplate>();
  @Output() error = new EventEmitter<string>();

  constructor(
    private x: Xapi
  ) {
    console.log('RegisterTemplate::constructor()');
    this.x.getLoginData( x => this.userLoggedIn() );
  }

  /**
   * 회원이 이미 로그인을 한 경우 이 함수가 호출된다.
   */
  userLoggedIn() {
  }

  onClickLogin() {
    console.log("RegisterTemplate::onClickRegister()");
    this.beforeLogin.emit(this);
    this.x.register( this.user, ( re: wi.RegisterResponse ) => {
      if ( re.success ) {
        console.log("RegisterTemplate::onClickRegister() success");
        this.success.emit( re.data );
      }
      else {
        console.log("RegisterTemplate::onClickRegister() error");
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      console.log('RegisterTemplate::onClickRegister() error: ', err);
      this.error.emit('server_error');
    });
    this.afterRegister.emit(this);
  }

  onClickCancel() {
    console.log("RegisterTemplate::onClickCancel()");
    this.cancel.emit(this);
  }
  


}
