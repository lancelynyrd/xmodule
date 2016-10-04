import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as xi from '../interfaces/xapi';
//import * as x from '../all';
@Component({
  selector: 'xapi-password',
  template: `
    <ion-list>

      <ion-item>
        <ion-label primary stacked>{{t.OldPassword}}</ion-label>
        <ion-input [(ngModel)]="user.old_password" placeholder="{{t.Input_Old_Password}}"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label primary stacked>{{t.NewPassword}}</ion-label>
        <ion-input [(ngModel)]="user.new_password" placeholder="{{t.Input_New_Password}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="loading">
        <ion-spinner></ion-spinner> Loading ...
      </ion-item>
      <ion-item *ngIf="message">
        <ion-icon name="star"></ion-icon> {{ message }}
      </ion-item>

      <ion-item>
        <button ion-button (click)="onClickUpdate()">{{t.Update}}</button>
        <button ion-button (click)="onClickCancel()">{{t.Cancel}}</button>
      </ion-item>

  </ion-list>
  `
})
export class PasswordComponent {
  user: xi.UserPassword = <xi.UserPassword> {};
  loading: boolean = false;
  message: string = '';
  t = {
    OldPassword: 'Old Password',
    NewPassword: 'New Password',
    Input_Old_Password: 'Input Old Password',
    Input_New_Password: 'Input New Password',
    Update: 'Update',
    Cancel: 'Cancel'
  };
  @Output() beforeRequest = new EventEmitter<PasswordComponent>();
  @Output() afterRequest = new EventEmitter<PasswordComponent>();
  @Output() success = new EventEmitter<xi.UserLoginData>();
  @Output() cancel = new EventEmitter<PasswordComponent>();
  @Output() error = new EventEmitter<string>();

  constructor( private x: Xapi ) {
    console.log('PasswordComponent::constructor()');
    this.x.getLoginData( user => this.userAlreadyLoggedIn(user) );
  }
  userAlreadyLoggedIn( user: xi.UserLoginData ) {
    this.user.session_id = user.session_id;
  }


  onClickUpdate() {
    console.log("PasswordComponent::onClickUpdate()");
    this.beforeRequest.emit(this);
    this.loading = true;
    this.message = '';
    this.x.password( this.user, ( re: xi.RegisterResponse ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      if ( re.success ) {
        console.log("PasswordComponent::onClickRegister() success");
        this.user.session_id = re.data.session_id;
        this.success.emit( re.data );
      }
      else {
        console.log("PasswordComponent::onClickRegister() error");
        this.message = <string>re.data;
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      console.log('PasswordComponent::onClickRegister() error: ', err);
    });
  }

  onClickCancel() {
    console.log("PasswordComponent::onClickCancel()");
    this.loading = false;
    this.cancel.emit(this);
  }

}