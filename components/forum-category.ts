import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as xi from '../interfaces/xapi';
export type AC = Array < xi.Category >;
@Component({
    selector: 'xapi-forum-category',
    template: `
    <div *ngIf="message">{{ message }}</div>
    <ion-list *ngIf="categories">
        <ion-item *ngFor="let cat of categories; let i = index" (click)="onClickForum( cat.slug )">
            {{ i }}
            {{ cat.cat_name }}
        </ion-item>
    </ion-list>
    `
})
export class ForumCategoryComponent {
    message: string;
    categories: AC;
    @Output() open = new EventEmitter<string>();
    constructor( private x: Xapi ) {            
        this.loadForumCategory();
    }
    loadForumCategory() {
        let args: xi.CategoryQueryArgument = <xi.CategoryQueryArgument> {};
        this.x.get_categories( args,
            (res:xi.CategoryResponse) => {
                console.log( res );
                if ( res.success ) {
                    console.log( res.data );
                    this.categories = <AC> res.data;
                }
                else {
                    this.message = <string> res.data;
                }
            },
            e => console.log(e)
        )
    }
    onClickForum( slug ) {
        console.log("ForumCategoryComponent::onClickForum()", slug);
        this.open.emit( slug );       
    }
}