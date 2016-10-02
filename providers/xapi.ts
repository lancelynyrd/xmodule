import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Library as lib } from '../functions/library';
import { AlertController } from 'ionic-angular';
import * as wi from '../interfaces/wordpress';
//import * as xc from '../../xapi-config';
//import { Data } from './data';
import { Storage } from '@ionic/storage';


@Injectable()
export class Xapi {
    private serverUrl: string;
    private uploadUrl: string;
    constructor(
        private http: Http,
        private alertCtrl: AlertController,
        private storage: Storage,
        private events: Events
        ) {
        //
        this.serverUrl = "http://work.org/wordpress/index.php";
        this.uploadUrl = this.serverUrl + "?xapi=file.upload&type=primary-photo";
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

    register( data: wi.UserRegisterData, successCallback: (res:wi.RegisterResponse) => void, errorCallback? ) {
        let url = this.serverUrl + '?xapi=user.register&' + lib.http_build_query( data );
        console.log('Xforum::register() : ' + url);
        this.get( url, (res:wi.RegisterResponse) => {
            console.log("WordPress::register() -> success: ", res);
            this.saveLoginData( res.data );
            this.events.publish( 'register', res.data );
            successCallback( res );
        }, errorCallback);
    }

    login( u: wi.UserLogin, callback, error) {
        let url = this.serverUrl + "?xapi=user.login&user_login="+u.user_login+"&user_pass="+u.user_pass;
        console.log('Xforum::login()', url);
        return this.get( url, ( res : wi.LoginResponse ) => {
            this.saveLoginData( res.data );
            this.events.publish( 'login', res.data );
            callback( res );
        }, error );
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
    get_categories( args: wi.CategoryQueryArgument, successCallback: (res: wi.Categories) => void, errorCallback ) {
        let url = this.serverUrl + 'categories?' + lib.http_build_query( args );
        return this.get( url, (x: wi.Categories) => successCallback( <wi.Categories>x ), errorCallback);
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
    get_posts( arg: wi.PostQuery, callback, serverError ) {
        let params = Object.keys( arg )
                        .map( k => k + '=' + arg[k] )
                        .join( '&' );
        let url = this.serverUrl + '?' + params;
        return this.get( url, callback, serverError );
    }

post_insert( data: wi.PostEdit, callback, serverError ) {
        // console.log('Xforum::post_insert()', data);

        /* TEST
        let url = this.serverUrl + '?xapi=post.insert&' + this.buildQuery( data );
        return this.get( url, callback, serverError );
        */
        return this.post( this.serverUrl + '?xapi=post.insert',
                data,
                callback,
                serverError );
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
    private json( str ) {
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
     * 사용자 정보를 콜백으로 리턴한다.
     * 만약, 사용자 정보가 없거나 올바르지 않으면 콜백 함수가 호출되지 않는다.
     * 따라서 콜백 함수가 호출되면 제대로 정보가 전달되는 것이다.
     */
    getLoginData(callback) {
        this.storage.get('login').then(x => {
            try {
                // debugger;
                if ( x ) {
                    let info = JSON.parse( x );
                    if ( info && info.session_id ) {
                        callback( info );
                    }
                }
            }
            catch( e ) {
                this.error("Failed on loading user login information. Please login again.");
                //this.error("getLoginData() -> JSON.parse() error");
            }
        });
    }
    private saveLoginData( loginResponse ) {
        try {
            this.storage.set('login', JSON.stringify( loginResponse ) );
        }
        catch ( e ) {
            this.error("setLoginData() -> JSON.stringify() error");
        }
    }
    logout() {
        this.storage.remove('login');
        this.events.publish('logout');
    }

}