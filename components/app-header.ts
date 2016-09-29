import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Xapi } from '../service/xapi';
//import {SearchPage} from '../pages/search/search';


@Component({
    selector: 'xapi-header',
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
                {{ subTitle }}
            </ion-title>
            
            <ion-buttons right>
                <button primary login *ngIf="loggedIn " (click)="onClickLogout()">Logout</button>
                <button primary login *ngIf=" ! loggedIn " (click)="onClickLogin()">Login</button>
                <button (click)="onClickPostEdit()" *ngIf="!hideCreateButton"><ion-icon name="create"></ion-icon></button>
                <button (click)="onClickSearch()"><ion-icon name="search"></ion-icon></button>
            </ion-buttons>

            <button menuToggle right>
                <ion-icon name="menu"></ion-icon>
            </button>
        </ion-navbar>
    `,
    providers: [ Xapi ],
    directives: [ ]
})
export class AppHeader {
    @Input() appTitle: string = "AppTitle";
    @Input() hideCreateButton: boolean;
    static initialized: boolean;
    private loggedIn: boolean = false;
    public subTitle: string = '';
    constructor(
        private navCtrl: NavController,
        private events: Events,
        private x: Xapi
    ) {
        this.initialize();
    }
    initialize() : boolean {

        this.x.getLoginData( x => this.userLoggedIn() );
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

    userLoggedIn() {
        this.loggedIn = true;
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
    onClickLogout() {
        this.x.logout();
        this.x.alert("로그아웃", "로그아웃하였습니다.");
        this.navCtrl.pop();
    }
    onClickPostEdit() {
        this.events.publish('app', { code:'showComponent', 'component': 'POST'} );
        // this.navCtrl.push( PostEditPage );
    }

    onClickSearch () {
//      this.navCtrl.push( SearchPage );
    }
}
