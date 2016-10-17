import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Xapi } from '../../providers/xapi';
import * as xi from '../../interfaces/xapi';
import { FileUploader } from 'ng2-file-upload/components/file-upload/file-uploader.class';
import { Config } from '../../providers/config'

export interface PostRequest {
    category: string;
    name: string;
    password: string;
    mobile: string;
    post_title: string;
    post_content: string;
    fid: Array<string>;
}
@Component({
    selector: 'xapi-post-edit',
    templateUrl: 'post-edit.html'
})
export class PostEditComponent {
    urlPhoto = 'x-assets/img/photo.png';
    
    isCordova = false;

    post: PostRequest = <PostRequest> {};
    images = {};
    
    
    
    private uploader = new FileUploader({ url: Config.uploadUrl });
    private result:xi.FileUploadResponse = <xi.FileUploadResponse> {};

    constructor( private platform: Platform, private x: Xapi ) {
        this.platform.ready().then( () => {
            if ( this.platform.is('cordova') ) {
                console.log("Yes, you are on cordova");
                this.isCordova = true;
            }
            else {
                console.log("No, you are NOT on cordova");
                this.initBrowserUpload();
            }
        });
    }
    
    
    get imageKeys() {
        return Object.keys( this.images );
    }
    
    
    initBrowserUpload() {
        console.log("initBrowserUpload()");

      this.uploader.onSuccessItem = (item, response, status, headers) => {
        this.result = {
          "success": true,
          "item": item,
          "response": response,
          "status": status,
          "headers": headers
        };
        console.log( 'onSuccessItem : ', this.result );
      };
      this.uploader.onErrorItem = (item, response, status, headers) => {
        this.result = {
          "success": false,
          "item": item,
          "response": response,
          "status": status,
          "headers": headers
        };
        console.log( 'onErrorItem : ', this.result );
      };
      this.uploader.onCompleteAll = () => {
          this.onBrowserUploadComplete();
      };
      this.uploader.onAfterAddingFile = ( fileItem ) => {
        console.log('onAfterAddingFile: ', fileItem);
        fileItem.withCredentials = false; // remove credentials
        fileItem.upload(); // upload file.
    }
  }


    
    onChangeFileBrowser( $event ) {
        console.log("onChangeFileBrowser()");
        try {
            this.uploader.addToQueue( $event.target.files );
        }
        catch ( e ) {
            this.x.error( "Failed to addToQueue() onBrowserUpload()" );
        }
        finally {
            // this.removeUploadIcon();
        }
    }
   
   private onBrowserUploadComplete() {
    let response = this.result.response;
    if ( response ) {

      // try {
      //   re = JSON.parse( response );
      // }
      // catch ( e ) {
      //   return this.x.error( "Failed on JSON.parse() try in onBrowserUploadComplete(). Please show this message to admin.", e);
      // }

      let re = this.x.json( response );
      if ( re.success ) this.onSuccessFileUpload( re.data );
      else return this.x.error( re.data );
    }
    else return this.errorMaybeServerError();
  }
  
  /**
   * @note this method is called on file upload success.
   *
   * @todo let mobile upload to call this method.
   */
  private onSuccessFileUpload( file: xi.FileUpload ) {
    this.images[ file.id ] = file.url ;
    //this.post.file_id = file.id;
  }
  
  errorMaybeServerError() {
    return this.x.error("Please check if file server is alive and check if the photo size is too big.");
  }


  onDelete( id ) {
      console.log('PostEditComponent::onDelete(), id: ' + id );
      this.x.delete_attachment( id, (res: xi.Response ) => {
          if ( res.success ) {
            delete this.images[ res.data ];            
          }
          else {
              this.x.error( res.data.message );
          }
      }, e => {
          this.x.error( e );
      })
  }
  
  onClickPost() {
    console.log( this.post );
    this.post.category = 'housemaid';
    this.post.fid = this.imageKeys;
    this.x.post_insert( this.post,
        (res) => this.onClickPostComplete(res),
        (res) => this.onClickPostServerError( res ) );
  }
  
  onClickPostComplete( res ) {
    console.log( res );
    if ( res.success ) {
      this.x.alert("SUCCESS", "Post upload success");
      //this.navCtrl.pop();
    }
    else {
      this.x.alert("ERROR", res.data);
    }
  }

  onClickPostServerError( res ) {
    this.x.error( "Error on Post. Please check if the backend server is alive.", res );
    console.log( res );
  }




}
