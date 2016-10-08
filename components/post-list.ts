import { Component, Input } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as xi from '../interfaces/xapi';
@Component({
    selector: 'xapi-post-list',
    template: `
    <h2>Post List</h2>
    {{ slug }}
    `
})
export class PostListComponent {
    @Input() slug: string;
    constructor() {
        console.log('PostListComponent::constructor()', this.slug);
    }
}