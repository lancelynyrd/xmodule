export class Language {
    constructor() {

    }
    korean( code ) {
        switch ( code ) {
            case 'user_login_is_empty' : return '회원 아이디를 입력하십시오.';
            case 'user_pass_is_empty' : return '비밀번호를 입력하십시오.';
            case 'user_email_is_empty' : return '이메일을 입력하십시오.';
            case 'server_error' : return '서버 에러가 발생하였습니다. 서버가 정상 동작중인지 확인하십시오.';
            default : return '인식되지 않는 에러: ' + code;
        }
    }
}