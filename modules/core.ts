import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeader } from '../components/app-header';
import { Xapi } from '../providers/xapi';


@NgModule({
    imports: [ CommonModule, AppHeader, Xapi ],
    declarations: [],
    exports: [ CommonModule, AppHeader, Xapi ]
})
export class SharedModule { }