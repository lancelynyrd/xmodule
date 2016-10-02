import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { AppHeader } from '../components/app-header';
import { Xapi } from '../providers/xapi';
import { LoginTemplate } from '../components/login';
import { RegisterTemplate } from '../components/register';
import { Storage } from '@ionic/storage';
@NgModule({
    declarations: [
        AppHeader,
        LoginTemplate,
        RegisterTemplate
    ],
    imports: [
        CommonModule,
        IonicModule
     ],
    providers: [
        Xapi,
        Storage
    ],
    exports: [
        CommonModule,
        AppHeader,
        LoginTemplate,
        RegisterTemplate
    ]
})
export class XapiModule { }