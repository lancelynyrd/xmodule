import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as xi from '../interfaces/xapi';
@Component({
    selector: 'xapi-resign',
    template: `
        <ion-list>
            <ion-item>
                {{t.Title}}
            </ion-item>

            <ion-item *ngIf="loading">
                <ion-spinner></ion-spinner> Loading ...
            </ion-item>
            <ion-item *ngIf="message">
                <ion-icon name="star"></ion-icon> {{ message }}
            </ion-item>

            <ion-item>
                <button ion-button (click)="onClickYes()">{{t.Yes}}</button>
                <button ion-button (click)="onClickNo()">{{t.No}}</button>
            </ion-item>
        </ion-list>
    `
})
export class ResignComponent {
    loading: boolean = false;
    message: string = '';
    t = {
        Title: 'Resign?',
        Yes: 'Yes',
        No: 'No'
    };
    user: xi.UserLoginData;
    @Output() beforeRequest = new EventEmitter<ResignComponent>();
    @Output() afterRequest = new EventEmitter<ResignComponent>();
    @Output() success = new EventEmitter<ResignComponent>();
    @Output() cancel = new EventEmitter<ResignComponent>();
    @Output() error = new EventEmitter<string>();
    constructor( private x: Xapi ) {

        console.log('ResignComponent::constructor()');
        this.x.getLoginData( user => this.userAlreadyLoggedIn(user) );

    }

  userAlreadyLoggedIn( user: xi.UserLoginData ) {
  }
    onClickYes() {

    console.log("ResignComponent::onClickRegister()");
    this.loading = true;
    this.beforeRequest.emit(this);
    this.x.resign( ( re: xi.RegisterResponse ) => {
      this.loading = false;
      this.message = '';
      this.afterRequest.emit(this);
      if ( re.success ) {
        console.log("ResignComponent::onClickRegister() success");
        this.success.emit( this );
      }
      else {
        console.log("ResignComponent::onClickRegister() error");
        this.message = <string>re.data;
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      console.log('ResignComponent::onClickRegister() error: ', err);
      // this.error.emit('server_error');
    });

        //

    }
    onClickNo() {
        this.loading = false;
        console.log("ResignComponent::onClickCancel()");
        this.cancel.emit( this );
    }

}