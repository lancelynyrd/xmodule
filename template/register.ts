
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
@Component({
  selector: 'xapi-register',
  template: `
    <h1>This is register page</h1>
  `
})
export class RegisterTemplate {

  constructor(
    private navCtrl: NavController
  ) {
    console.log('RegisterPage::constructor()');
  }




  onClickRegister() {
  }


}
