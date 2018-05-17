import { Injectable } from '@angular/core';
import { Post } from './post';
import { POSTS } from './mock-posts';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url = 'http://zyq.westus2.cloudapp.azure.com:9200/sky2/post/_search';
  private request = {
    "size": 10,
    "sort": [{ "id": "desc" }], "query": { "multi_match": { "type": "most_fields", "query": "apple", "fields": ["title.cn", "content.cn"] } }
  };

  constructor(private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  search(): Observable<any> {
    return this.http.post<any>(this.url, this.request);
  }

  processBook(item: any): Post {
    let post: Post = new Post();
    if (item == null)
      return post;

    var source = item._source;
    post.id = source.id;
    post.published = source.pdate;
    post.authorId = source.authorId;
    post.author = source.author;
    post.type = source.type;
    post.title = source.title;

    var content = (source.content == null) ? '' : source.content.replace('.pcb{margin-right:0}', '');
    post.content = content;
    return post;
  }

  convert(data: any): Post[] {
    let items: Post[] = [];
    let response = data;
    if (response.hits == null || response.hits.total == 0) {
      return items;
    }
    for (let i = 0; i < response.hits.total; i++) {
      items.push(this.processBook(response.hits.hits[i]));
    }
    return items;
  }

  getPosts(): Observable<Post[]> {

    //return of(POSTS);
    return this.search()
      .pipe(
      map(data => this.convert(data)),
      tap(data => this.log('fetched posts')),
      catchError(this.handleError('getPosts', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
