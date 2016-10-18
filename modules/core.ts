import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';
import { Xapi } from '../providers/xapi';
import { HeaderComponent } from '../components/header';
import { LoginComponent } from '../components/login';
import { RegisterComponent } from '../components/register';
import { PasswordComponent } from '../components/password';
import { ResignComponent } from '../components/resign';
import { ForumCategoryComponent } from '../components/forum-category';
import { PostListComponent } from '../components/post-list/post-list';
import { PostEditComponent } from '../components/post-edit/post-edit';
import { PageController } from '../providers/page-controller';
import { Storage } from '@ionic/storage';
import { Config } from '../providers/config';
@NgModule({
    declarations: [
        HeaderComponent,
        LoginComponent,
        RegisterComponent,
        PasswordComponent,
        ResignComponent,
        ForumCategoryComponent,
        PostListComponent,
        PostEditComponent
    ],
    imports: [
        CommonModule,
        IonicModule
     ],
    providers: [
        Xapi,
        PageController,
        Storage,
        Config
    ],
    exports: [
        CommonModule,
        HeaderComponent,
        LoginComponent,
        RegisterComponent,
        PasswordComponent,
        ResignComponent,
        ForumCategoryComponent,
        PostListComponent,
        PostEditComponent
    ]
})
export class XModule { }