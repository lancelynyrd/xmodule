/**
 * 
 * 
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
    
    static push( page, params? ) {
        let newPage = PageController.page[ page ];
        let home = PageController.page[ 'home' ];
        home.navCtrl.push( newPage, params );
    }
}
