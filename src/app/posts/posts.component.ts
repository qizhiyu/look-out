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
  posts: Post[];

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.getPosts();
  }
  selectedPost: Post;

  onSelect(post: Post): void {
    this.selectedPost = post;
  }

  getPosts(): void {
    //TODO: can it be async?
    this.postService.getPostsAsync().then(posts => this.posts = posts);
  }
}
