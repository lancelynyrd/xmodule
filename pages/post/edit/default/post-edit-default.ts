/**
 * Post eidt ( new & update ) page.
 * 
 * @todo if the user has not logged in, POST CRUD with password.
 * 
 * 회원 로그인을 안 했으면, 비밀번호를 통해서 글 생성,수정,삭제를 한다.
 * 
 */
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { PostEditService } from '../../../../providers/post-edit-service';
/** -------------------------------------------------------------
 * Post data interface & var
 * This should be customized on your need post data strucure.
 * Cannot find a simple way not to write interface or data type
 * @note Data Structure
 *  - When the post data is saved, unknown data will be saved into meta.
 *  - When the post data arrived from server, all meta data will be saved in 'meta' property as object.
 * 서버에 저장하는 데이터 포멧과 폼 양식의 데이터 포멧이 틀려서 맞추는 과정 
 *///------------------------------------------------------------
export const category: string = 'housemaid';
export interface POST { // post data basic strucure
  ID?: number;
  category: string;
  post_title: string;
  post_content: string;
  name: string;
  mobile: string;
  password: string;
}
export interface POST_DATA extends POST { // post data from server ( to be displayed )
  images?: {};
}
export interface POST_SUBMIT extends POST { // post data to send to server
  fid?: Array< string >;
}
export let postData: () => POST_DATA = () : POST_DATA => { 
  return {
    category: category, post_title : '', post_content : '',
    name: '', mobile: '', password: '',
    images: {}};
}
/**
 * Returns trimed post data from server to display as user input.
 */
export let trimPostDataForForm: (x) => POST_DATA = (x) : POST_DATA => {
  let p: POST_DATA = <POST_DATA> {};
  p.ID = x.ID;
  p.category = category;
  p.post_title = x.post_title;
  p.post_content = x.post_content;
  p.mobile = x.meta.mobile;
  p.name = x.meta.name;
  p.password = x.meta.password;
  if ( x.images ) p.images = x.images;
  else p.images = {};
  return p;
}

  /**
   * Returns trimed post data for Posting from the user input
   * 
   * This method creates a new memory place and copy post data into it.
   * 
   * More importantly, when it converts user input data, images of fid and url object is removed and create a new array of fid, it doesn not hurt the image object of user input post data.
   * 
   * 글을 포스팅 할 때, 업로드된 데이터에는 fid 와 url 이 있는 객체인데,
   * 
   * 이 값을 그대로 놔 두고, 새로운 객체를 생성해서 그 객체에서 fid 값만 서버로 전송한다.
   * 
   * 만약 서버에서 실패를 해도, 기존의 업로드된 이미지 정보 값은 변하지 않으므로 에러 난 부분을 고쳐서 그대로 활용하면 된다.
   * 
   * 
   */
export let trimPostDataForSubmit: (x) => POST_SUBMIT = (x) : POST_SUBMIT => {
    let post = JSON.parse( JSON.stringify( x ) ); // Soft copy on new object ( new placeholder )
    if ( post.images ) post.fid = Object.keys( post.images ); // get images to send to server
    delete post['images']; // delete images of display
    return post;
  }
// This is not needed.
//export let postSubmit: POST_SUBMIT = { category: 'housemaid', post_title : '', post_content : '', meta: { name: '', mobile: '', password: '' }, fid: [] };
// EO Post data interface & var




@Component({
  selector: 'page-post-edit-default',
  templateUrl: 'post-edit-default.html'
})
export class PostEditDefaultPage {

  userLogin: boolean = false; // Becomes TRUE if user has logged in
  userInfo; // user information
  urlPhoto: string;
  post: POST_DATA = postData();
  post_ID;
  get imageKeys() {
    if ( this.post.images ) {
      return Object.keys( this.post.images );
    }
  }
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public postEditService: PostEditService,
    private events: Events
    ) {
      this.post = postData();
      this.urlPhoto = postEditService.urlPhoto;
      this.post_ID = navParams.get( 'post_ID' );
      if ( this.post_ID ) {
        postEditService.load( this.post_ID, (p:POST_DATA) => {
          this.post = trimPostDataForForm( p );
        });
      }
      events.subscribe('file-upload-success', x => this.onSuccessFileUpload(x[0]));
      events.subscribe('user-login', ( re ) => {
        this.userLogin = true;
        this.userInfo = re[0];
        console.log("userInfo: ", this.userInfo);
      } );
  }

  onClickPost() {
    this.postEditService.submit( trimPostDataForSubmit( this.post ), x => this.onClickPostComplete( x ) );
  }

  onClickPostComplete( data ) {
    console.log("PostEditPage::onClickPostComplete()", data);
    this.post = postData(); // clear user input post data after submit success.
    alert("Post upload success");
  }

  onChangeFileBrowser( $event ) {
      this.postEditService.upload( $event.target.files );
  }

  // Displays image.
  // This method is called on file-upload-success event.
  private onSuccessFileUpload( file ) {
    this.post.images[ file.id ] = file.url ;
  }


  // Deletes uploaded file.
  onDelete( id ) {
      this.postEditService.deleteUpload( id, id => {
        delete this.post.images[ id ];
      });
  }
}
