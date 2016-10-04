import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as xi from '../interfaces/xapi';
@Component({
  selector: 'xapi-register',
  template: `
    <ion-list>

      <ion-item *ngIf=" ! loggedIn ">
        <ion-label primary stacked>{{t.User_ID}}</ion-label>
        <ion-input [(ngModel)]="user.user_login" placeholder="{{t.Input_User_ID}}"></ion-input>
      </ion-item>

      <ion-item *ngIf=" ! loggedIn ">
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

      <ion-item *ngIf="loading">
        <ion-spinner></ion-spinner> Loading ...
      </ion-item>
      <ion-item *ngIf="message">
        <ion-icon name="star"></ion-icon> {{ message }}
      </ion-item>

      <ion-item>
        <button *ngIf=" ! loggedIn " ion-button (click)="onClickRegister()">{{t.Register}}</button>
        <button *ngIf="   loggedIn " ion-button (click)="onClickUpdate()">{{t.Update}}</button>
        <button ion-button (click)="onClickCancel()">{{t.Cancel}}</button>
      </ion-item>

  </ion-list>
  `,
  providers: [ Xapi ]
})
export class RegisterComponent {
  loading: boolean = false;
  message: string = '';
  loggedIn: boolean = false;
  user: xi.UserRegisterData = xi.userRegisterData;
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
    Update: 'Update',
    Cancel: 'Cancel'
  };
  /**
   * 이 값을 앱에서 변경하여 원하는 필드를 보이지 않게 할 수 있다.
   */
  public o = {
    Name: true,
    Mobile: true,
    Birthday: true,
    Gender: true
  };
  @Output() beforeRequest = new EventEmitter<RegisterComponent>();
  @Output() afterRequest = new EventEmitter<RegisterComponent>();
  @Output() success = new EventEmitter<xi.UserLoginData>();
  @Output() update = new EventEmitter<xi.UserLoginData>();
  @Output() cancel = new EventEmitter<RegisterComponent>();
  @Output() error = new EventEmitter<string>();

  constructor(
    private x: Xapi
  ) {
    console.log('RegisterComponent::constructor()');
    this.user = <xi.UserRegisterData>{};
    this.x.getLoginData( user => this.userAlreadyLoggedIn( user ) );
  }

  /**
   * 회원이 이미 로그인을 한 경우 이 함수가 호출된다.
   * 회원이 로그인을 했으면,
   *  1. 로그인 관련 정보 출력
   *  2. 서버로 부터 로그인 사용자의 정보를 추출하여 폼에 입력
   */
  userAlreadyLoggedIn( user: xi.UserLoginData ) {

    //this.t.Register = this.t.Update;
    this.loggedIn = true;
    this.x.get_user( user.user_login, u => this.onGetUser( u.data ), e => this.onGetUserError( e ) )
  }
  onGetUser( user: xi.UserData ) {
    console.log('onGetUser()', user );
    this.user.session_id = user.session_id;
    this.user.user_login = user.user_login;
    this.user.user_email = user.user_email;
    this.user.name = user.meta.name ? user.meta.name : '';
    this.user.mobile = user.meta.mobile ? user.meta.mobile : '';
    this.user.birthday = user.meta.birthday ? user.meta.birthday : '';
    this.user.gender = user.meta.gender ? user.meta.gender : '';
  }
  onGetUserError( e ) {
    console.log( 'onGetUserError() ', e );
  }


  /**
   * 회원 가입
   * @attention 서버 에러가 발생한 겨우에는 이벤트가 발생되지 않는다.
   *    'error' 이벤트는 서버로 쿼리가 올바로 되었는데, 프로그램적으로 logical 에러가 발생한 경우 이벤트를 trigger 한다.
   */
  onClickRegister() {
    console.log("RegisterComponent::onClickRegister()");
    this.loading = true;
    this.message = '';
    this.beforeRequest.emit(this);
    this.x.register( this.user, ( re: xi.RegisterResponse ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      if ( re.success ) {
        console.log("RegisterComponent::onClickRegister() success");
        this.success.emit( re.data );
      }
      else {
        console.log("RegisterComponent::onClickRegister() error");
        this.message = <string>re.data;
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      console.log('RegisterComponent::onClickRegister() error: ', err);
    });
  }
  onClickUpdate() {
    console.log("RegisterComponent::onClickUpdate()");
    this.loading = true;
    this.message = '';
    this.beforeRequest.emit(this);
    this.x.profile( this.user, ( re: xi.RegisterResponse ) => {
      this.loading = false;
      console.log('RegisterComponent::onClickUpdate() -> userUpdate-> after', re);
      this.afterRequest.emit(this);
      if ( re.success ) {
        console.log("RegisterComponent::onClickUpdate() success");
        this.update.emit( re.data );
      }
      else {
        console.log("RegisterComponent::onClickUpdate() error");
        this.message = <string>re.data;
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      this.loading = false;
      this.afterRequest.emit(this);
      console.log('RegisterComponent::onClickUpdate() error: ', err);
    });
  }

  onClickCancel() {
    console.log("RegisterComponent::onClickCancel()");
    this.loading = false;
    this.message = '';
    this.cancel.emit(this);
  }
  


}
