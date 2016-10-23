import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PostEditService } from '../../../../providers/post-edit-service';

/*
  Generated class for the PostEditDefault page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-post-edit-default',
  templateUrl: 'post-edit-default.html'
})
export class PostEditDefault {

  constructor(
    public navCtrl: NavController,
    private postEdit: PostEditService
  ) {
    //postEdit.init();
    //x.post.edit.init();
    //x.initPostEdit();
  }

  ionViewDidLoad() {
    console.log('Hello PostEditDefault Page');
  }



}
