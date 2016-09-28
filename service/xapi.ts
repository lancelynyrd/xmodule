import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Library as lib } from './library';
import { AlertController } from 'ionic-angular';
import * as wi from '../interface/wordpress';
import * as xc from '../../xapi-config';
import { Data } from './data';

@Injectable()
export class Xapi {
    private serverUrl: string;
    private uploadUrl: string;
    constructor(
        private http: Http,
        private alertCtrl: AlertController ) {
        //

        this.serverUrl = xc.serverUrl;
        this.uploadUrl = this.serverUrl + "?xapi=file.upload&type=primary-photo";
    } 


    /**
     * @param errorCallback - is error callback. It is usually called on server fault.
     */
    private get( url: string, successCallback, errorCallback? ) {
        console.log("WordPress::get : " + url );
        if ( ! this.serverUrl ) return this.error("No server url");
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
        /*
        let e = encodeURIComponent;
        let q = Object.keys( data )
            .map( k => e(k) + '=' + e( data[k] ) )
            .join( '&' );
            */
        let url = this.serverUrl + '?xapi=user.register&' + lib.http_build_query( data );
        console.log('Xforum::register() : ' + url);
        this.get( url, (x:wi.RegisterResponse) => {
            console.log("WordPress::register() -> success: ", x);
            this.setLoginData( x.data );
            successCallback(x);
        }, errorCallback);
    }

    login(user_login: string, user_pass: string, callback, error) {
        console.log('Xforum::login()');
        let url = this.serverUrl + "?xapi=user.login&user_login="+user_login+"&user_pass="+user_pass;
        return this.get( url, ( res : wi.LoginResponse ) => callback( res ), error );
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
        new Data().get('login', x => {
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
    private setLoginData( loginResponse ) {
        try {
            new Data().set('login', JSON.stringify( loginResponse ) );
        }
        catch ( e ) {
            this.error("setLoginData() -> JSON.stringify() error");
        }
    }
    logout() {
        new Data().db.remove('login');
    }

}