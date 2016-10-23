import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Xapi } from '../../providers/xapi';
import * as xi from '../../interfaces/xapi';

@Component({
    selector: 'xapi-post-list',
    templateUrl: 'post-list.html'
})
export class PostListComponent {
    @Input() slug: string;
    more = [];
    posts: xi.Posts = [];
    page: number = 0;
    featuredImage: string = "x-assets/img/sunset.jpg";
    
    @Output() edit = new EventEmitter<number>();
    @Output() delete = new EventEmitter<number>();
    @Output() report = new EventEmitter<number>();
    @Output() copy = new EventEmitter<number>();
    @Output() move = new EventEmitter<number>();
    @Output() blind = new EventEmitter<number>();
    @Output() block = new EventEmitter<number>();
    @Output() message = new EventEmitter<number>();
    @Output() userPosts = new EventEmitter<number>();
    constructor(
        private x: Xapi
        ) {
        console.log('PostListComponent::constructor()', this.slug);
    }
    ngOnInit() {
        console.log('PostListComponent::ngOnInit()', this.slug);
        this.loadMorePosts( re => console.log(re), ()=>{} );
    }
    loadMorePosts( successCallback, errorCallback ) {
        this.page ++;
        console.log('loadMorePosts()');
        let arg : xi.PostQuery = xi.postQuery;
        arg.category_name = this.slug;
        arg.paged = this.page;
        arg.per_page = 50;
        this.x.get_posts( arg, (res: xi.PostQueryResponse) => {
            // console.log( 'loadMorePosts()', res);
            if ( res.success ) {
                if ( res.data && res.data.length ) {
                    this.displayPosts( res.data );
                    successCallback( true );
                }
                else {
                    console.log('No more posts');
                    successCallback( false );
                }
            }
            else {
                if ( res.data ) alert( res.data );
                else alert("Error on post list");
                errorCallback();
            }
        },
        e => {

        } );
    }
    displayPosts( posts: xi.Posts ) {
        //console.log('displayPosts()', posts);
        for( let post of posts ) {
            /**
             * 서버에서 리턴되는 post 의 images 값은 fid 와 url 로 된 객체인데,
             * 실제로 필요한 값은 배열로 된 url 값이다.
             * 따라서 post.images 객체를 배열로 변경한다.
             */
            if ( post.images ) {
                let arr = [];
                for(var key in post.images ) {
                    arr.push ( post.images[key] );
                }
                post.images = arr;
            }
            this.posts.push( (<xi.Post> post) );
        }
    }

    doInfinite( callback ) {
        console.log('PostListComponent::doInfinite() begin');
        this.loadMorePosts( (re) => {
            console.log('doInfinite() end');
            callback(re);
        },
        () => {} );
    }
    onClickEdit( post_ID ) {
        console.log('onClickEdit()', post_ID);
        this.edit.emit( post_ID );
    }
    onClickDelete( post_ID ) {
        console.log('onClickDel()', post_ID);
        this.delete.emit( post_ID );
    }
    onClickReport( post_ID ) {
        console.log('onClickReport()', post_ID);
        this.report.emit( post_ID );
    }
    onClickCopy( post_ID ) {
        console.log('onClickCopy()', post_ID);
        this.copy.emit( post_ID );
    }
    onClickMove( post_ID ) {
        console.log('onClickMove()', post_ID);
        this.move.emit( post_ID );
    }
    onClickBlind( post_ID ) {
        console.log('onClickBlind()', post_ID);
        this.blind.emit( post_ID );
    }
    onClickMessage( post_ID ) {
        console.log('onClickMessage()', post_ID);
        this.message.emit( post_ID );
    }
    onClickPosts( post_ID ) {
        console.log('onClickPosts()', post_ID);
        this.userPosts.emit( post_ID );
    }
    onClickBlock( post_ID ) {
        console.log('onClickBlock()', post_ID);
        this.block.emit( post_ID );
    }
}