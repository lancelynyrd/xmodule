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





# How to translate language

템플릿이나 service 에 't' 라는 public 객체 변수를 아래와 같이 지정하여, 부모 컴포넌트에서 번역을 할 수 있도록 한다.
every template/service must have a public object named 't' like below and parent compoent will translate it.

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


# registration

template/register.ts 에 관련 루틴이 있다.


커스터마이징을 할 수 있도록 되어져 있으며
회원 가입 성공/실패, 취소 등의 이벤트를 받을 수 있다.

register.ts 컴포넌트의 속성에 접근하기 위해서는 @ViewChild() 를 사용하고
RegisterTemplate 에서 부모 컴포넌트로 접근하기 위해서는 @Output() event 를 사용한다.

