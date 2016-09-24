/**
 * 
 * @refer README.md
 */
import { Component, Output, EventEmitter } from '@angular/core';
import * as ui from '../interface/user';
@Component({
  selector: 'xapi-register',
  template: `
    <ion-list>
      <ion-item>
        <ion-label primary stacked>{{t.User_ID}}</ion-label>
        <ion-input [(ngModel)]="user.user_login" placeholder="Input User ID"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label primary stacked>{{t.Password}}</ion-label>
        <ion-input [(ngModel)]="user.user_pass" placeholder="Input Password"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label primary stacked>{{t.Email}}</ion-label>
        <ion-input [(ngModel)]="user.user_email" placeholder="Input Email"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Name">
        <ion-label primary stacked>{{t.Name}}</ion-label>
        <ion-input [(ngModel)]="user.name" placeholder="Input Name"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Mobile">
        <ion-label primary stacked>{{t.Mobile}}</ion-label>
        <ion-input [(ngModel)]="user.mobile" placeholder="Input Mobile"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Birthday">
        <ion-label primary stacked>{{t.Birthday}}</ion-label>
        <ion-input [(ngModel)]="user.birthday" placeholder="Input Birthday"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Gender">
        <ion-label primary stacked>{{t.Gender}}</ion-label>
        <ion-input [(ngModel)]="user.gender" placeholder="Input Gender"></ion-input>
      </ion-item>

      <ion-item>
        <button (click)="onClickRegister()">Register</button>
        <button (click)="onClickCancel()">Cancel</button>
      </ion-item>

  </ion-list>
  `
})
export class RegisterTemplate {
  private user: ui.UserRegisterData = ui.userRegisterData;
  t = {
    User_ID: 'User ID',
    Password: 'Password',
    Name: 'Name',
    Email: 'Email',
    Mobile: 'Mobile No.',
    Birthday: 'Birthday',
    Gender: 'Gender'
  };
  o = {
    Name: true,
    Mobile: true,
    Birthday: false,
    Gender: false
  };
  @Output() beforeRegister : EventEmitter<RegisterTemplate> = new EventEmitter<RegisterTemplate>();
  @Output() afterRegister : EventEmitter<RegisterTemplate> = new EventEmitter<RegisterTemplate>();
  @Output() cancel : EventEmitter<RegisterTemplate> = new EventEmitter<RegisterTemplate>();
  @Output() error : EventEmitter<RegisterTemplate> = new EventEmitter<RegisterTemplate>();

  constructor() {
    console.log('RegisterPage::constructor()');
  }

  onClickRegister() {
    console.log("onClickRegister()");
    this.beforeRegister.emit(this);
    this.afterRegister.emit(this);
  }

  onClickCancel() {
    console.log("RegisterTemplate::onClickCancel()");
    this.cancel.emit(this);
  }
  


}
