import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
//import {SearchPage} from '../pages/search/search';

@Component({
    selector: 'app-header',
    template: `
        <ion-navbar>
            <!--
            <ion-buttons left>
                <button (click)="onClickHome()">
                    <ion-icon name="home"></ion-icon>
                </button>
            </ion-buttons>
            -->

            <ion-title>
                {{ appTitle }}
            </ion-title>
            
            <ion-buttons right>
                <button primary login *ngIf=" ! loggedIn " (click)="onClickLogin()">Login</button>
                <button (click)="onClickPostEdit()" *ngIf="!hideCreateButton"><ion-icon name="create"></ion-icon></button>
                <button (click)="onClickSearch()"><ion-icon name="search"></ion-icon></button>
            </ion-buttons>

            <button menuToggle right>
                <ion-icon name="menu"></ion-icon>
            </button>
        </ion-navbar>
    `,
    providers: [ ],
    directives: [ ]
})
export class AppHeader {
    @Input() appTitle: string = "AppTitle";
    @Input() hideCreateButton: boolean;
    static initialized: boolean;
    private loggedIn: boolean;
    constructor(
        private navCtrl: NavController,
        private events: Events
    ) {
        this.initialize();
    }
    initialize() : boolean {

        if ( AppHeader.initialized ) {
            // console.log('AppHeader::constructor() : already initialized !');
            return true;
        }
        else {
            AppHeader.initialized = true;
            // console.log('AppHeader::constructor() : initializing');
            return false;
        }
    }

    onClickHome() {
        console.log("AppHeader::onClickHome");
    }

    onClickLogin() {
        console.log('app-header::onClickLogin() : ');
        // console.log( LoginPage );
        // this.navCtrl.setRoot( LoginPage );
        // app.showLoginPage();

        // this.events.publish('app', { code:'showComponent', 'component': 'LOGIN'} );
    }
    onClickPostEdit() {
        this.events.publish('app', { code:'showComponent', 'component': 'POST'} );
        // this.navCtrl.push( PostEditPage );
    }

    onClickSearch () {
//      this.navCtrl.push( SearchPage );
    }
}
