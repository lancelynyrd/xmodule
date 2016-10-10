import { Component } from '@angular/core';


@Component({
    selector: 'xapi-post-edit',
    templateUrl: 'post-edit.html'
})
export class PostEditComponent {
    urlPhoto = 'assets/img/photo.png';
    
    name;
    address;
    password;
    mobile;
    post_title;
    post_content;

}
