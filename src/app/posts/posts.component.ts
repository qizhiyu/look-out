import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { POSTS } from '../mock-posts';
import { PostService } from '../post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  post: Post = {
    id: 1,
    author: 'Andy'
  };
  posts:Post[];
  
  constructor(private postService: PostService) { }

  ngOnInit() {
  	this.getPosts();
  }
	selectedPost: Post;
	
	onSelect(Post: Post): void {
	  this.selectedPost = Post;
	}
	
	getPosts(): void {
	this.postService.getPosts()
        .subscribe(posts => this.posts = posts);
}
}
