import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { Xapi } from '../providers/xapi';
import { HeaderComponent } from '../components/header';
import { LoginComponent } from '../components/login';
import { RegisterComponent } from '../components/register';
import { Storage } from '@ionic/storage';
@NgModule({
    declarations: [
        HeaderComponent,
        LoginComponent,
        RegisterComponent
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
        HeaderComponent,
        LoginComponent,
        RegisterComponent
    ]
})
export class XModule { }