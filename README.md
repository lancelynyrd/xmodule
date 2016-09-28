# Ionic Xapi

Ionic 2 xapi for wordpress xapi


# TODO

* login.ts 를 작업하다가 졸려서 중단 했음.

* 회원 정보 수정.

    xapi=user.get&login=abc 를 통해서 회원 정보를 추출 하고 보여 줄 것.
    

# Folder structure

    * xapi/template/
        In this folder, only template can be put.
        A template may have a funcionality like 'user registration' or 'user login'
        There is no 'page' folder and no page component since 'page' concept is included in template.
        Do whatever a 'page' can do.

    * xapi/provider/
        In this folder, only service and function can be put.
        No theme, css, template, page.
        But service, functions







# registration

template/register.ts 에 관련 루틴이 있다.


커스터마이징을 할 수 있도록 되어져 있으며
회원 가입 성공/실패, 취소 등의 이벤트를 받을 수 있다.

register.ts 컴포넌트의 속성에 접근하기 위해서는 @ViewChild() 를 사용하고
RegisterTemplate 에서 부모 컴포넌트로 접근하기 위해서는 @Output() event 를 사용한다.




# 코딩 가이드

xapi 는 앱을 작성 할 때 사용되는 라이브러리이다.

xapi 에 백엔드 서버 주소 등은 앱 마다 틀리다.

그리고 이러한 결정은 가능한 xapi 의 수정 없이 부모 앱에서 할 수 있어야 한다.

따라서 앱의 영역에 xapi-config.ts 를 두는데, 그 위치는 xapi 폴더 바로 위 영역이어야 한다.

따라서 xapi 에서 xapi-config.ts 를 포함하기 위해서는 import * as xc from '../xapi-config'; 와 같이 하면 된다.

xapi-config.ts 는 xapi 에 필요한 각종 변수, 함수, 클래스, 인터페이스 등을 기록하는 장소이다.



## 템플릿에서 발생하는 이벤트트

템플릿(회원 가입, 수정, 탈퇴, 로그인, 로그아웃 등)에서 아래의 이벤트를 앱으로 발생 시킨다.

이벤트로

    * beforeRequest : 서버로 호출 직전에 이벤트가 발생
    * afterRequeset : 서버로 호출 한 다음에 이벤트가 발생. success, error 이벤트가 발생하지 직전에 먼저 이 이벤트가 발생한다.
    * success : 성공
    * error : 실패. 주의 : 이 이벤트는 서버 4xx, 5xx 등의 에러를 포함하지 않는다. 오직 2xx 등 서버로 쿼리가 올바로 이루어진 후, 결과가 올바르지 않는 경우, 발생하는 에러이다. 예를 들면 비밀번호가 틀리는 등의 에러 상황에서 발생하는 이벤트이다.
    * cancel : 취소 버튼이 눌러진 경우 이벤트가 발생.


## 회원 로그인 체크

회원 로그인은 app-header.ts 템플릿부터 많은 템플릿에서 기본적으로 사용된다.

로그인에 따른 옵션 처리를 앱에서 @ViewChild() 등으로 하지 말고

그냥 해당 template 에서 direct 로 아래와 같이 처리를 한다.

예제) 템플릿에서 예제 코드. Xapi 를 x 로 DI 해서 사용하면 된다.

    this.x.getLoginData( x => this.userLoggedIn() );
    userLoggedIn() { ... 필요한 처리 ... }

필요한 경우 템플릿이 아닌 앱의 page 에서도 위의 코드를 그대로 사용 할 수 있다.
다만, 꼭 필요 한 경우에만 사용 해야 한다.

### 로그인 성공시 회원 정보가 파라메타로전달된다.

  onSuccess( user: x.UserData) {
    console.log("onSuccess()");
    this.api.alert("LOGIN OK", `Welcome, ${user.user_login}. You have logged in.`);
  }



## 언어 변경

주의 : xapi 자체에서 언어 변경 기능을 넣지 않는다.

다만 언어 변경을 할 수는 있게 한다.

한글, 영어 등의 언어로 변경하기 위해서, 가장 간편하게 하기 위해서

template/register.ts 처러 t 변수에 변경 할 텍스트를 기록하고,

실제 언어 변경을 앱에서 원하는 대로 변경하게 한다.

예를 들어 xapi/template/register.ts 를 보면, t 멤버 변수에 변경 할 수 있는 문자열을 저장 해 놓고 활용한다.

* 템플릿이나 service 에 't' 라는 public 객체 변수를 아래와 같이 지정하여, 부모 컴포넌트에서 번역을 할 수 있도록 한다.
* every template/service must have a public object named 't' like below and parent compoent will translate it.

example code)

    t = {
        User_ID: 'User ID',
        Password: 'Password'
    };

번역은 @ViewChild() 로 하면 된다.
Translate with @ViewChild()


example code)

  @ViewChild('Register') register: RegisterTemplate;
  this.register.t.User_ID = '회원 아이디';



# 회원 가입

앱에서 회원 가입/수정 페이지를 보여주는 경우, 아래와 같이 xapi-register 를 사용하면 된다.

예제)

  <xapi-register #Register
      (beforeRequest)="onBeforeRequest($event)"
      (afterRequest)="onAfterRequest($event)"
      (success)="onSuccess($event)"
      (cancel)="onCancel($event)"
      (error)="onError($event)"
    ></xapi-register>

# 회원 로그인

아래의 예제는 앱에서 xapi/template/login.ts 템플릿을 포함하여 회원 로그인 페이지를 만든 예제이다.

예제) page/login.ts

    import { Component, ViewChild } from '@angular/core';
    import { NavController } from 'ionic-angular';
    import { LoginTemplate } from '../../xapi/template/login';
    import * as x from '../../xapi/all';
    @Component({
    templateUrl: 'build/pages/login/login.html',
    directives: [ x.AppHeader, LoginTemplate ]
    })
    export class LoginPage {
        appTitle = "Login";
        @ViewChild('Login') login: LoginTemplate;
        constructor(private navCtrl: NavController) {
            console.log("LoginPage::constrcutor()");
        }
        ionViewLoaded() {
            this.login.t.Login = "로그인";
        }
        onBeforeRequest() {
            console.log("onBeforeRequest()");
        }
        onAfterRequest() {
            console.log("onAfterRequest()");
        }
        onSuccess() {
            console.log("onSuccess()");
        }
        onError() {
            console.log("onError()");
        }
        onCancel() {
            console.log("onCancel()");
        }
    }