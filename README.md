# Ionic Xmodule

Ionic Xmodule for Ionic app development.

* api for wordpress xapi


# TODO


* 로딩 표시, 에러메세지 표시를 xmodule 컴포넌트에서 처리

* bug : login failed, but on header "LOGOUT" appears.

* 다국어 처리. xmodule 컴포넌트에서 에러를 표시하면, 부모 컴포넌트에서 어떻게 에러를 다국어 처리 할 수 있나?
@Input() t: Array<{code:string, text: string; }> 와 같이?

* 검토: xmodule component 에서 전송하는 EventEmitter 를 xapi service 에서 전송하면??

* @doc AppHeader 는 컴포넌트로서 각 앱에서 커스터마이징을 해야 한다.

    AppHeaderComponent 로 명칭을 변경하도록 한다.

    AppHeader 에서 Event 를 밖으로 보내는 것은 모든 페이지에서 이벤트를 받아서 처리해야 하기 때문에 힘들다.

    

# 참고

* 비밀번호를 바꾸고 나서 연속으로 계속 바꾼 후 리프레쉬를 하면 로그인이 풀리는 경우가 있다.

    * 가끔 그러는데, 웹 브라우저에서 LocalStorage 데이터를 막 지워서 그런 것 아닐까?

    * 로그인이 풀리는 것은 심각한 문제로 이런일이 벌어지면 안된다.


# Installation

ionic plugin add cordova-plugin-whitelist --save

# Sample App Installation


ionic start sample blank --v2 --verbose
cd sample/src
rm -rf pages
git clone https://github.com/thruthesky/xmodule-sample-pages pages 
git clone http://github.com/thruthesky/xmodule
cd ..
ionic serve

그리고 나서 xmodule/etc/app.module.ts 의 내용을 적절히 app/app.module.ts 로 복사한다.

/*
# Old Folder structure

    * xapi/template/
        In this folder, only template can be put.
        A template may have a funcionality like 'user registration' or 'user login'
        There is no 'page' folder and no page component since 'page' concept is included in template.
        Do whatever a 'page' can do.

    * xapi/provider/
        In this folder, only service and function can be put.
        No theme, css, template, page.
        But service, functions
*/



# New foler structure

* xmodule/components

    In this folder, all components, directives, templates are stored.
    For the maintanance, each typescript files should stand alone.
        there should be only .ts files. no html files, css files, image files...

* xmodule/interfaces
    all interfaces stay here.
    Jsut import and use interfaces any place.

* xmodule/pipes
    all pipes must be placed here.

* xmodule/providers
    all service proders must be placed here.

* xmodule/modules
    all modules of xapi must be placed here.
    




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
    * success : 성공( 글 작성, 회원 가입 등 )
    * update : 업데이트 성공.
    * delete : 삭제 성공.
    * error : 실패. 주의 : 이 이벤트는 서버 4xx, 5xx 등의 에러를 포함하지 않는다. 오직 2xx 등 서버로 쿼리가 올바로 이루어진 후, 결과가 올바르지 않는 경우, 발생하는 에러이다. 예를 들면 비밀번호가 틀리는 등의 에러 상황에서 발생하는 이벤트이다.
    * cancel : 취소 버튼이 눌러진 경우 이벤트가 발생.


## 회원 로그인 체크

앱이 실행되거나 컴포넌트가 view 에 들어 갈 때, 회원 로그인을 했는지 하지 않았는지 확인하는 방법은 아래와 같다.

예제) 템플릿에서 예제 코드. Xapi 를 x 로 DI 해서 사용하면 된다.

    constructor( private x: Xapi ) {
        this.x.getLoginData( user => this.userAlreadyLoggedIn(user) );
    }
    userAlreadyLoggedIn( user: xi.UserLoginData ) {
    }

참고: 로그인에 따른 상태 변경을 @ViewChild() 으로 하면 된다.



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
      (update)="onUpdate($event)" // 업데이트 성공 시
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


# 코딩 가이드

## 컴포넌트
xmodule/components 의 내용은 모든 앱(프로젝트)마다 커스터마징을 따로 해야 한다.

필요에 따라서 xmodule/components/* 의 내용을 src/components/* 폴더로 복사해서 사용을 하면 된다.

## Global Event 전송을 통한 액션 처리

어떤 컴포넌트에서 어떤 행동을 취하면 다른 컴포넌트에 영향이 미쳐야하는 경우가 있다.

예를 들면, AppHeader 에서 logout 을 하면, 페이지 본문의 로그인 사용자 정보가 사라지고 로그인 입력창이 나타나야한다.

이것은 다른 페이지로 이동(navCtrl.pop)했을 경우에도 로그 아웃을 한 정보가 나와야 한다.

즉, 현재 컴포넌트 뿐만아니라 다른 모든 컴포넌트의 상태 변경을 해야하는데, 이 때 액션을 통해서 처리를 한다.

이와 같은 경우, 어느 컴포넌트에서든지 로그아웃 기능을 수행하면 logout 이벤트를 발생시키면된다.

그러면 필요한 곳에서 subscribe 해서 적절히 처리를 하면 되는 것이다.

다르게 설명하면, Header Component 의 경우, 각 페이지마다 객체가 생성되어 여러개의 객체가 각기 다른 상태 값을 가질 수 이있다.
이 때, 이벤트 전송을 통해, 로그인/로그아웃 등을 할 때, 모든 객체에서 이벤트를 수신하고 처리하므로서 동일한 상태값을 가질 수 있다.


### 참고 : 자식 컴포넌트에서 부모 컴포넌트로 전송하는 이벤트와는 별개의 이다.

예를 들어 로그인 컴포넌트에서 로그인을 할 때, beforeRequest 등의 이벤트를 부모 컴포넌트로 보내는데,

이것은 Global Event 전송이 아닌 부모 컴포넌트에게만 보내는 것이다.





### global 액션 이벤트의 종류

    * login
        사용자 정보가 전달된다.
        이벤트가 전송되기 전에 회원 정보가 LocalStroage 에 저장된다.
    * logout
        전달되는 정보가 없다.
        이벤트가 전송되기 전에 회원 정보가 LocalStroage 에서 삭제된다.
    * register
        사용자 정보가 전달된다.
        이벤트가 전송되기 전에 회원 정보가 LocalStroage 에 저장된다.
    * profile
        사용자 정보를 업데이트하면 이벤트가 전송된다.
        사용자 정보가 전달된다.
        LocalStroage 에 저장된다.
    
    이러한 event 가 수신되면 각 컴포넌트에서는 적절한 처리를 하면 된다.


# @ViewChild() 를 통한 xapi 컴포넌트 수정

xapi 의 HeaderComponent 의 경우 각 앱에 따라 크게 수정되어야 하지만,

LoginComponent 의 경우, 모든 앱마다 일정한 틀이 있어서 크게 변경을 하지 않아도 된다.

이와 같은 경우, 부모 컴포넌트에서 @ViewChild() 를 통해서 LoginComponent 의 부분적인 변경을 할 수 있다.




