/**
 * 
 * @refer README.md
 */
import { Component, Output, EventEmitter } from '@angular/core';
import { WordPress } from '../service/wordpress';
import * as wi from '../interface/wordpress';
@Component({
  selector: 'xapi-register',
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
        <ion-label primary stacked>{{t.Email}}</ion-label>
        <ion-input [(ngModel)]="user.user_email" placeholder="{{t.Input_Email}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Name">
        <ion-label primary stacked>{{t.Name}}</ion-label>
        <ion-input [(ngModel)]="user.name" placeholder="{{t.Input_Name}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Mobile">
        <ion-label primary stacked>{{t.Mobile}}</ion-label>
        <ion-input [(ngModel)]="user.mobile" placeholder="{{t.Input_Mobile}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Birthday">
        <ion-label primary stacked>{{t.Birthday}}</ion-label>
        <ion-input [(ngModel)]="user.birthday" placeholder="{{t.Input_Birthday}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Gender">
        <ion-label primary stacked>{{t.Gender}}</ion-label>
        <ion-input [(ngModel)]="user.gender" placeholder="{{t.Input_Gender}}"></ion-input>
      </ion-item>

      <ion-item>
        <button (click)="onClickRegister()">{{t.Register}}</button>
        <button (click)="onClickCancel()">{{t.Cancel}}</button>
      </ion-item>

  </ion-list>
  `,
  providers: [WordPress]
})
export class RegisterTemplate {
  private user: wi.UserRegisterData = wi.userRegisterData;
  t = {
    User_ID: 'User ID',
    Password: 'Password',
    Name: 'Name',
    Email: 'Email',
    Mobile: 'Mobile No.',
    Birthday: 'Birthday',
    Gender: 'Gender',
    Input_User_ID: 'Input User ID',
    Input_Password: 'Input Password',
    Input_Email: 'Input Email',
    Input_Name: 'Input Name',
    Input_Mobile: 'Input Mobile',
    Input_Birthday: 'Input Birthday',
    Input_Gender: 'Input Gender',
    Register: 'Register',
    Cancel: 'Cancel'
  };
  o = {
    Name: true,
    Mobile: true,
    Birthday: false,
    Gender: false
  };
  @Output() beforeRegister = new EventEmitter<RegisterTemplate>();
  @Output() afterRegister = new EventEmitter<RegisterTemplate>();
  @Output() success = new EventEmitter<wi.UserData>();
  @Output() cancel = new EventEmitter<RegisterTemplate>();
  @Output() error = new EventEmitter<string>();

  constructor(
    private wp: WordPress
  ) {
    console.log('RegisterTemplate::constructor()');
  }

  onClickRegister() {
    console.log("RegisterTemplate::onClickRegister()");
    this.beforeRegister.emit(this);
    this.wp.register( this.user, ( re: wi.RegisterResponse ) => {
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
