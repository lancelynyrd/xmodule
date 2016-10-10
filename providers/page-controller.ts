/**
 * 
 * 
 * 
 */
export interface PAGES {
    login: any;
    register: any;
    postEdit: any;
}
import { Injectable } from '@angular/core';
@Injectable()
export class PageController {
    static page: PAGES = <PAGES> {};
    static push( page, container ) {
        container.navCtrl.push( PageController.page[ page ] );
    }
}
