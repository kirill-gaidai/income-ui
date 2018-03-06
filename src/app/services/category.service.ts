import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {Category} from '../models/category.model';
import {AuthService} from './auth.service';

@Injectable()
export class CategoryService implements OnInit, OnDestroy {

  public categoriesChangedSubject: Subject<void> = new Subject<void>();

  private CATEGORIES_URL = 'http://192.168.56.1:8080/rest/categories';

  // private CATEGORIES_URL = '/rest/categories';

  constructor(private http: Http,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Observable<Category[]> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.CATEGORIES_URL, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public get(id: number): Observable<Category> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.CATEGORIES_URL + '/' + id, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public create(category: Category): Observable<Category> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.post(this.CATEGORIES_URL, category, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public update(category: Category): Observable<Category> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.put(this.CATEGORIES_URL, category, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public delete(id: number): Observable<void> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.delete(this.CATEGORIES_URL + '/' + id, {
      headers: headers
    }).map((response: Response) => {
    });
  }

}
