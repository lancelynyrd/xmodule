# Ionic Xapi

Ionic 2 xapi for wordpress xapi


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