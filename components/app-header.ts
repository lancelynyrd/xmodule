/**
 * app-header.ts
 * 
 * 이 컴포넌트는 각 프로젝트 마다 커스터마이징을 해야한다.
 * 
 */
import { Component, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Login } from '../../pages/login/login';
import { Xapi } from '../providers/xapi';

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
                <button ion-button color="primary" login *ngIf="loggedIn " (click)="onClickLogout()">Logout</button>
                <button ion-button color="primary" login *ngIf=" ! loggedIn " (click)="onClickLogin()">Login</button>
                <button ion-button (click)="onClickPostEdit()" *ngIf="!hideCreateButton"><ion-icon name="create"></ion-icon></button>
                <button ion-button (click)="onClickSearch()"><ion-icon name="search"></ion-icon></button>
            </ion-buttons>

            <button menuToggle right>
                <ion-icon name="menu"></ion-icon>
            </button>
        </ion-navbar>
    `
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
    initialize() {
        this.x.getLoginData( x => this.loggedIn = true );
        this.events.subscribe( 'login', ( u ) => {
            console.log('AppHeader::constructor::event login');
            this.login(u);
        } );
        this.events.subscribe( 'logout', () => {
            console.log('AppHeader::constructor::event logout');
            this.logout();
        } );
    }
    login(u) {
        this.loggedIn = true;
    }
    logout() {
        this.loggedIn = false;
    }

    onClickLogin() {
        console.log('app-header::onClickLogin() : ');
        this.navCtrl.push( Login );       
    }
    onClickLogout() {
        this.x.logout();
        this.x.alert("로그아웃", "로그아웃하였습니다.");
        this.loggedIn = false;
    }
    onClickPostEdit() {

    }

    onClickSearch () {

    }
}
