# Ionic Xmodule

Ionic Xmodule for Ionic app development.

* api for wordpress xapi


# TODO

* Remove "x.getLoginData()", use "x.userloginData" instead
* Member login & post crud.
* Post delete
* User crud with photo
* Comment CRUD
* TEST on each function.
* code refactoring.


    
# Installation

How to install Xmodule.

* package.json - adds below on package.json to copy xmodule assets into www/assets

    "config": {
        "ionic_copy": "./src/xmodule/etc/copy-assets.js"
    },

* Plugins to install

    * ionic plugin add cordova-plugin-whitelist --save
    * npm install ng2-file-upload --save




# Installation - Sample App for Xmodule


ionic start sample blank --v2 --verbose
cd sample/src
rm -rf pages
git clone https://github.com/thruthesky/xmodule-sample-pages pages 
git clone http://github.com/thruthesky/xmodule
cd ..
// do what in installation
// install modules, plugins in Installation
cp xmodule/etc/app.module.ts app/app.module.ts
ionic serve

그리고 나서 xmodule/etc/app.module.ts 의 내용을 적절히 app/app.module.ts 로 복사한다.



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
    
* x-assets
    This fold holds assets like image that are not copied to www folder and will be copied to www/x-assets.

    




# registration

template/register.ts 에 관련 루틴이 있다.


커스터마이징을 할 수 있도록 되어져 있으며
회원 가입 성공/실패, 취소 등의 이벤트를 받을 수 있다.

register.ts 컴포넌트의 속성에 접근하기 위해서는 @ViewChild() 를 사용하고
RegisterTemplate 에서 부모 컴포넌트로 접근하기 위해서는 @Output() event 를 사용한다.




# Coding Guideline - 코딩 가이드

xapi 는 앱을 작성 할 때 사용되는 라이브러리이다.

xapi 에 백엔드 서버 주소 등은 앱 마다 틀리다.

그리고 이러한 결정은 가능한 xapi 의 수정 없이 부모 앱에서 할 수 있어야 한다.

따라서 앱의 영역에 xapi-config.ts 를 두는데, 그 위치는 xapi 폴더 바로 위 영역이어야 한다.

따라서 xapi 에서 xapi-config.ts 를 포함하기 위해서는 import * as xc from '../xapi-config'; 와 같이 하면 된다.

xapi-config.ts 는 xapi 에 필요한 각종 변수, 함수, 클래스, 인터페이스 등을 기록하는 장소이다.



## Pages of xmodule

* if it is a page, it must be created by app.
    * xmodule does not create or directly access page.

* xmodule only handes directive component and communicates with
    * @Input, @Output, @ViewChild, EventEmitter, Events
    


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



## User Login - 회원 로그인 체크

* To see if the user has logged in already,
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


## How to assets and images


all images must be saved into x-assets folder
and x-assets folder will be copied into www/x-assets
so you can use like below.

you can create sub-folders.

    urlPhoto = 'x-assets/photo.png';




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




# providers/PageController.ts 를 통한 page 공유 및 페이지 관리

예를 들어, HeaderComponent 에서 로그인 버튼을 클릭하면 이벤트가 발생하는데,

모든 page component 에서 일일히 다 로그인 버튼에 대한 이벤트 핸들링을 할 수 없다.

반복되는 코드가 많아지고, 번거러워 지기 때문이다.

물론, 커스터마이징을 할 때에는 직접 처리를 할 수 있다.

그래서,

1. 처음 앱이 실행 될 때, Pages 에 페이지 정보를 입력한다.

    주로 home.ts 에서 PageController.page = { ... } 에 설정을 하게 된다.
    로그인 페이지, 회원 가입 페이지, 글 쓰기 페이지 등 사용자의 입력이 필요하고 자주 사용되는 메뉴의 페이지를 지정한다.
    특히, HeaderComponent 와 같이 버튼이 항상 클릭 가능한 위치에 있을 때,
    
    주의: 'home' 항목의 NavController 를 사용해서 네이비게이션을 하므로 home 항목은 필수로 넣어야 한다.

2. HeaderComponent 에서 로그인 버튼 클릭 이벤트가 발생하면,

3. PageController.push() 를 통해서 원하는 페이지로 이동을 하는 것이다.

    모든 페이지 이동 코드를 PageController 클래스로 모아서 관리하기가 편하다.


문제점,

    HeaderComponent 에서 버튼이 여러개 있는 경우, 반복적으로 버튼을 클릭하면 계속 navCtrl.push() 하는 결과가 나타난다.

    해결점,

    이와 같은 문제가 생기면, 아래와 같이 헤더에 해당 버튼을 없애는 것이 현재로서는 가장 좋은 방법 같다.

        <ion-navbar>
            <ion-title>User Login</ion-title>
        </ion-navbar>


# 글 작성/수정/목록 엮시 많은 커스터마이징이 필요하다.

    컴포넌트 개념템플릿 개념으로 해서,

        일반 게시판, 사진 게시판과 같이 템플릿화 할 필요성이 있다.



# How to use Xmodule

* Do 'Installation'
* Add Xmodule to app module as git submodule.
* Copy 'src/xmodule/components/*' into your app folder and edit it on your need.
* For Post editing
    * use post edit service


* If any compoent in xmodule/componets matches your need, then use it as it is.
* If not, create your own page without component.
