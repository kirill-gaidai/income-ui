import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Category} from '../models/category.model';
import {Subject} from 'rxjs/Subject';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CategoryService implements OnInit, OnDestroy {

  public categoriesChangedSubject: Subject<void> = new Subject<void>();

  // private CATEGORIES_URL = 'http://192.168.56.1:8080/income-dev/rest/categories';
  private CATEGORIES_URL = '/rest/categories';

  constructor(private http: Http) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Observable<Category[]> {
    return this.http.get(this.CATEGORIES_URL)
      .map((response: Response) => response.json());
  }

  public get(id: number): Observable<Category> {
    return this.http.get(this.CATEGORIES_URL + '/' + id)
      .map((response: Response) => response.json());
  }

  public create(category: Category): Observable<Category> {
    return this.http.post(this.CATEGORIES_URL, category)
      .map((response: Response) => response.json());
  }

  public update(category: Category): Observable<Category> {
    return this.http.put(this.CATEGORIES_URL, category)
      .map((response: Response) => response.json());
  }

  public delete(id: number): Observable<void> {
    return this.http.delete(this.CATEGORIES_URL + '/' + id)
      .map((response: Response) => {});
  }

}
