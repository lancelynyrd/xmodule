import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Library as lib } from '../functions/library';
import { AlertController } from 'ionic-angular';
import * as xi from '../interfaces/xapi';
//import * as xc from '../../xapi-config';
//import { Data } from './data';
import { Storage } from '@ionic/storage';


@Injectable()
export class Xapi {
    static _serverUrl: string;
    userLoginData: xi.UserLoginData = <xi.UserLoginData> {};
    constructor(
        private http: Http,
        private alertCtrl: AlertController,
        private storage: Storage,
        private events: Events
        ) {
//            console.log("Xapi::constructor()");
        this.getLoginData( x => {
            this.userLoginData = x;
        });
    }

    /**
     * Returns URL without user login session
     */
    get serverUrl() {
        return Xapi._serverUrl;
    }
    /**
     * Returns URL with user login session
     */
    get serverSessionUrl() {
        if ( this.userLoginData ) {
            return this.serverUrl + "?session_id=" + this.userLoginData.session_id;
        }
        else {
            return this.serverUrl + "?";
        }
    }
    set serverUrl( url ) {
        Xapi._serverUrl = url;
    }
    get uploadUrl() {
        return this.serverUrl + "?xapi=file.upload&type=primary-photo";
    }


    /**
     * @param errorCallback - is error callback. It is usually called on server fault.
     */
    private get( url: string, successCallback, errorCallback? ) {
        if ( ! this.serverUrl ) return this.error("No server url");
        console.log("WordPress::get : ", url );
        this.http.get( url )
        .map( e => {
            return this.json(e['_body']);
        } )
        .catch( ( e ) => {
            if ( errorCallback ) errorCallback( e );
            return this.errorHandler( e );
        } )
        .subscribe( (res) => {
            console.log(res);
            successCallback(res);
        } );
    }
    private post( url: string, body: any, successCallback, errorCallback? ) {
        console.log("WordPress::post : " + url, body );
        if ( ! this.serverUrl ) return this.error("No server url");
        let headers = new Headers( { 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        body = lib.http_build_query( body );
        console.log('url:', url);
        console.log('body:', body);
        this.http.post( url, body, options )
            .map( e => {
                return this.json(e['_body']);
            } )
            .catch( (e) => {
                console.log( "WordPress::post() => catch() :", e );
                if ( errorCallback ) errorCallback( e );
                return Observable.throw( e );
            } )
            .subscribe( res => {
                successCallback( res );
            });
    }


    ping( callback ) {
        return this.get( this.serverUrl + "?xapi=ping", callback);
    }


    /**
     * Resisters to the server.
     * 
     * @note it delivers the result through callback to the callee.
     * @note it does Promise for non-blocking code.
     */
    register( data: xi.UserRegisterData, successCallback: (res:xi.RegisterResponse) => void, errorCallback? ) {
        let url = this.serverUrl + '?xapi=user.register&' + lib.http_build_query( data );
        console.log('Xapi::register() : ' + url);
        this.get( url, (res:xi.RegisterResponse) => {
            console.log("Xapi::register() -> success: ", res);
            this.saveLoginData( res.data ).then( () => {
                this.events.publish( 'register', res.data );
                successCallback( res );
            });
        }, errorCallback);
    }
    /**
     * 사용자 정보를 수정한다.
     * @note 이메일 수정은 가능하나 비밀번호 변경은 안된다.
     * @todo 사용자 session id 를 입력하고 수정하는 것.
     */
    profile( user: xi.UserRegisterData, successCallback, errorCallback ) {
        let url = this.serverUrl + '?xapi=user.profile&' + lib.http_build_query( user );
        console.log('Xapi::userUpdate()', url);
        this.get( url, (res:xi.RegisterResponse) => {
            console.log('Xapi::userUpdate() -> success: ', res);
            this.saveLoginData( res.data );
            this.events.publish( 'profile', res.data );
            successCallback( res );
        }, errorCallback);

    }


    /**
     * Checks login to the server.
     */
    login( u: xi.UserLogin, successCallback, errorCallback) {
        let url = this.serverUrl + "?xapi=user.login&user_login="+u.user_login+"&user_pass="+u.user_pass;
        console.log('Xforum::login()', url);
        return this.get( url, ( res : xi.LoginResponse ) => {
            this.saveLoginData( res.data ).then( () => {
                if ( res.success ) this.events.publish( 'login', res.data );
                successCallback( res );
            } );
        }, errorCallback );
    }


    /**
     * Changes user password
     * 
     * 
     */
    password( user: xi.UserPassword, successCallback, errorCallback ) {
        let url = this.serverUrl + '?xapi=user.password&' + lib.http_build_query( user );
        console.log('XModule::password()', url);
        this.get( url, ( res: xi.LoginResponse ) => {
            this.saveLoginData( res.data );
            this.events.publish( 'password', res.data );
            successCallback( res );
        },
        errorCallback );
    }


    /**
     * Resign
     */
    resign( successCallback, errorCallback ) {
        console.log("Xapi::resign()");
        this.getLoginData( user => {
            console.log("Xapi::getLoginData() callback()");
            let url = this.serverUrl + '?xapi=user.resign&' + lib.http_build_query( user );
            console.log('XModule::resign()', url);
            this.get( url, ( res: xi.ResignResponse ) => {
                this.storage.remove('login');
                this.events.publish( 'resign', res.data );
                successCallback( res );
            },
            errorCallback );
        });
    }

    
    /**
     * Gets categories from WordPress.
     * @code
     * 
        let args: xi.CategoryListArgument = {};
        args.search = "my";
        this.x.get_categories( args, (res: Array<xi.Category>) => {
            this.categories = res;
        });
     * @endcode
     */
    get_categories( args: xi.CategoryQueryArgument, successCallback: (res: xi.CategoryResponse) => void, errorCallback ) {
        let url = this.serverUrl + '?xapi=wordpress.get_categories' + lib.http_build_query( args );
        return this.get( url, (x: xi.CategoryResponse) => successCallback( x ), errorCallback);
    }

/**
     * Gets a post.
     */
    get_post( post_ID : number | string, successCallback, errorCallback? ) {
        let url = this.serverUrl + '?xapi=wordpress.get_post&post_ID=' + post_ID;
        return this.get( url, successCallback, errorCallback);
    }
    delete_post( post_ID : any, successCallback, errorCallback? ) {
        let url: string;
        if ( typeof post_ID == 'number' || typeof post_ID == 'string' ) {
            url = this.serverUrl + '?xapi=wordpress.delete_post&post_ID=' + post_ID;
        }
        else {
            let obj = post_ID;
            post_ID = obj.post_ID;
            let password = obj.password;
            url = this.serverUrl + '?xapi=wordpress.delete_post&post_ID=' + post_ID + '&password=' + password;
        }
        return this.get( url, successCallback, errorCallback);
    }

    /**
     * Gets posts from WordPress
     */
    get_posts( args: xi.PostQuery, successCallback, errorCallback) {
        /*
        let params = Object.keys( arg )
                        .map( k => k + '=' + arg[k] )
                        .join( '&' );
        let url = this.serverUrl + '?' + params;
        */
        let url = this.serverUrl + '?xapi=wp.get_posts&' + lib.http_build_query( args );
        return this.get( url, successCallback, errorCallback);
    }

    post_insert( data, successCallback, errorCallback ) {
        // console.log('Xforum::post_insert()', data);

        /* TEST
        let url = this.serverUrl + '?xapi=post.insert&' + this.buildQuery( data );
        return this.get( url, callback, serverError );
        */
        return this.post( this.serverSessionUrl + '&xapi=post.insert',
                data,
                successCallback,
                errorCallback );
    }

    wp_query( queryString, successCallback, errorCallback ) {

        let url = this.serverUrl + '?xapi=wordpress.wp_query&' + queryString;
        console.log( 'wp_query: ', url );
        return this.get( url, successCallback, errorCallback );

    }

    get_user( $user_login, successCallback, errorCallback ) {
        let url = this.serverUrl + '?xapi=wordpress.get_user_by&field=login&value=' + $user_login;
        console.log('get_user()', url);
        return this.get( url, successCallback, errorCallback );
    }

    

    /**
     * Returns JSON from the input.
     */
    json( str ) {
        let res;
        if ( ! str ) {
            this.error("WordPress::Json() - Server returns empty data");
            return str;
        }
        try {
            res = JSON.parse( str );
        }
        catch (e) {
            this.reportError();
            this.error("WordPress::json() - Failed to parse JSON data. This may be  a server error.");
            console.log(e);
        }
        return res;
    }
    error( message: string, e?: any ) {
        let error_message = '';
        if ( e && e.message ) error_message = e.message + ' - ';
        this.alert( 'ERROR', error_message + message );
    }

    
    /**
     * @code
     *      this.x.alert("ERROR", "Failed on JSON.parse() try in onBrowserUploadComplete(). Please show this message to admin.");
     * @endcode
     */
    alert( title: string, content: string ) {
        let alert = this.alertCtrl.create({
        title: title,
        subTitle: content,
        buttons: ['OK']
        });
        alert.present();
    }

    
    /**
     * Automatic report to server admin.
     * @todo when there is error, this client automatically reports and logs into server.
     */
    private reportError() {

    }

    private errorHandler( err: any ) {
        let errMsg = (err.message) ?
            err.message :
            err.status ? `${err.status} - ${err.statusText}` : 'Server error. Please check if backend server is alive and there is no error.';
        this.error(errMsg);
        return Observable.throw(errMsg);
    }

    /**
     * 
     * 
     * 
     * Returns user login data through callback.
     * - Check if the user has already logged.
     * 
     * @edit failureCallback will be called if user has not logged in.
     * 
     * 사용자 정보를 콜백으로 리턴한다.
     * 만약, 사용자 정보가 없거나 올바르지 않으면 failureCalback 콜백 함수 호출된다.
     * 
     * 참고 : 이 함수가 항상 async 형태로 사용 될 수 밖에 없는 이유는 Promise 를 사용하여,
     *       이 함수가 끝이 나도 실제로 로그인을 했는지 하지 않았는지 알 수 없기 때문이다.
     * 특히, 이 Xapi 를 Dependency Injection 을 하는 경우,
     *      DI 를 할 때, 이 함수를 호출해서 값을 보관한다고 해도,
     *      이 함수가 끝난다고 해서, 값이 저장되는 것이 아니다.
     *      왜냐하면 이 함수는 Async 이 기 때문이다.
     * 
     *      이것은 다른 모든 자바스크립트 코드에도 동일하게 적용되는 것이다.
     *      
     * 따라서 이 함수의 결과와 saveLoginData() 의 결과를 userLoginData 에 저장하는데, 이 값은 Promise 의 동작에 의해서
     * 올바른 값을 가지지 않을 수 있다.
     * 
     * @code
     *   this.getLoginData( x => this.loggedIn = true, () => this.loggedIn = false );
     * @endcode
     * 
     */
    getLoginData( successCallback, failureCallback? ) {
        this.storage.get('login').then(x => {
            if ( x ) {
                try {
                    // debugger;
                    if ( x ) {
                        let info: xi.UserLoginData = JSON.parse( x );
                        if ( info && info.session_id ) {
                            successCallback( info );
                            return;
                        }
                    }
                    if ( failureCallback ) failureCallback();
                }
                catch( e ) {
                    this.error("Failed on loading user login information. Please login again.");
                    //this.error("getLoginData() -> JSON.parse() error");
                }
            }
            else if ( failureCallback ) failureCallback();
        });
    }
    
    
    /**
     * Saves user login data ( after login )
     * 
     * @return void|Promise
     * 
     * 
     * @note it returns Promise for non-blocking code.
     */
    private saveLoginData( loginResponse ) {
        console.log("Xmodule::saveLoginData()", loginResponse);
        try {
            this.userLoginData = loginResponse;
            return this.storage.set('login', JSON.stringify( loginResponse ) );
        }
        catch ( e ) {
            this.error("setLoginData() -> JSON.stringify() error");
        }
    }
    /**
     * 
     * @attention This method is being called on 'logout'
     */
    logout() {
        console.log("Xmodule::logout()");
        this.saveLoginData( '' );
        this.userLoginData = {};
        //this.storage.remove('login');
        this.events.publish('logout');
    }
    
    
    delete_attachment( id: number, successCallback, errorCallback ) {
        let url = this.serverUrl + '?xapi=wp.delete_attachment&id=' + id;
        console.log('Xapi::register() : ' + url);
        this.get( url, (res: xi.Response) => {
            console.log("Xapi::delete_attachment(): ", res);
            successCallback( res );
        }, errorCallback);
    }

}