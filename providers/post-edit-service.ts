/**
 * 
 * 
 * Events
 *  'file-upload-success' on file upload success
 * 
 * 
 */
import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { FileUploader } from 'ng2-file-upload/components/file-upload/file-uploader.class';
import { Xapi } from './xapi';
import * as xi from '../interfaces/xapi';
@Injectable()
export class PostEditService {
    private uploader;
    private result:xi.FileUploadResponse = <xi.FileUploadResponse> {};
    isCordova = false;
    urlPhoto = 'x-assets/img/photo.png';
    constructor(
        private platform: Platform,
        private events: Events,
        public x: Xapi
    ) {
        this.uploader = new FileUploader({ url: x.uploadUrl });
        this.platform.ready().then( () => {
            if ( this.platform.is('cordova') ) {
                //console.log("Yes, you are on cordova");
                this.isCordova = true;
            }
            else {
                //console.log("No, you are NOT on cordova");
                this.initBrowserUpload();
            }
        });
    }



    initBrowserUpload() {
        //console.log("initBrowserUpload()");

      this.uploader.onSuccessItem = (item, response, status, headers) => {
        this.result = {
          "success": true,
          "item": item,
          "response": response,
          "status": status,
          "headers": headers
        };
        //console.log( 'onSuccessItem : ', this.result );
      };
      this.uploader.onErrorItem = (item, response, status, headers) => {
        this.result = {
          "success": false,
          "item": item,
          "response": response,
          "status": status,
          "headers": headers
        };
        //console.log( 'onErrorItem : ', this.result );
      };
      this.uploader.onCompleteAll = () => {
          this.onBrowserUploadComplete();
      };
      this.uploader.onAfterAddingFile = ( fileItem ) => {
        //console.log('onAfterAddingFile: ', fileItem);
        fileItem.withCredentials = false; // remove credentials
        fileItem.upload(); // upload file.
    }
  }

   private onBrowserUploadComplete() {
    let response = this.result.response;
    console.log(response);
    if ( response ) {

      // try {
      //   re = JSON.parse( response );
      // }
      // catch ( e ) {
      //   return this.x.error( "Failed on JSON.parse() try in onBrowserUploadComplete(). Please show this message to admin.", e);
      // }

      let re = this.x.json( response );
      if ( re.success ) this.events.publish( 'file-upload-success', re.data );
      else return this.x.error( re.data );
    }
    else return this.errorMaybeServerError();
  }

  
  errorMaybeServerError() {
    return this.x.error("Please check if file server is alive and check if the photo size is too big.");
  }



  submit( post, successCallback, failureCallback?, serverErrorCallback? ) {
      //console.log("PostEditService::submit()", post, callback);
    this.x.post_insert( post,
        res => this.onPostInsertComplete( res, successCallback, failureCallback ),
        res => this.onPostInsertServerError( res, serverErrorCallback ) );
  }

  onPostInsertComplete( res, successCallback, failureCallback? ) {
    console.log( res );
    if ( res.success ) {
        successCallback( res.data );
    }
    else {
        if ( failureCallback ) failureCallback( res.data );
      alert(res.data);
    }
  }


  onPostInsertServerError( res, serverErrorCallback? ) {
    console.log( res );
    if ( serverErrorCallback ) serverErrorCallback();
    this.x.error( "Error on Post. Please check if the backend server is alive.", res );
  }
  upload( files ) {
    //console.log("PostEditService::upload()");
    try {
        this.uploader.addToQueue( files );
    }
    catch ( e ) {
        this.x.error( "Failed to addToQueue() onBrowserUpload()" );
    }
  }



  /**
   * 
   * Deletes uploaded file.
   * 
   * callback() will be called after the file is deleted.
   * If there is an error, it handles itself.
   */
  deleteUpload( id, callback ) {
      this.x.delete_attachment( id, (res: xi.Response ) => {
          if ( res.success ) {
              callback( res.data );
          }
          else {
              this.x.error( res.data.message );
          }
      }, e => {
          this.x.error( e );
      })
  }


  load( post_ID, callback ) {
        this.x.get_post( post_ID, re => {
            //console.log('PostEditComponent::ionViewDidLoad() => get_post():',re);
            if ( re.success ) callback( <xi.Post> re.data );
        });

  }

}