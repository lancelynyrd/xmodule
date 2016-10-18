/**
 * 
 * 
 * 
 * home 페이지는 필수로 입력해야 한다. 그래야 PageContorller.push() 가 동작한다.
 */
export interface PAGES {
    home: any;
    login: any;
    password: any;
    resign: any;
    register: any;
    postEdit: any;
}
import { Injectable } from '@angular/core';
@Injectable()
export class PageController {
    static page: PAGES = <PAGES> {};
    
    /**
     * HomePage 의 navCtrl 을 이용해서 페이지를 이동한다.
     * 따라서, 두번째 인자에 this 를 전달 할 필요가 없다.
     */
    static push( page, params? ) {
        let home = PageController.page[ 'home' ]; 
        let newPage = PageController.page[ page ];
        home.navCtrl.push( newPage, params );
        //container.navCtrl.push( PageController.page[ page ] );
    }
}
