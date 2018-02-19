import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Account} from '../models/account.model';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AccountService implements OnInit, OnDestroy {

  public accountsChangedSubject: Subject<void> = new Subject<void>();

  private ACCOUNTS_URL = 'http://192.168.56.1:8080/income-dev/rest/accounts';

  constructor(private http: Http) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Observable<Account[]> {
    return this.http.get(this.ACCOUNTS_URL)
      .map((response: Response) => response.json());
  }

  public get(id: number): Observable<Account> {
    return this.http.get(this.ACCOUNTS_URL + '/' + id)
      .map((response: Response) => response.json());
  }

  public create(account: Account): Observable<Account> {
    return this.http.post(this.ACCOUNTS_URL, account)
      .map((response: Response) => response.json());
  }

  public update(account: Account): Observable<Account> {
    return this.http.put(this.ACCOUNTS_URL, account)
      .map((response: Response) => response.json());
  }

  public delete(id: number): Observable<void> {
    return this.http.delete(this.ACCOUNTS_URL + '/' + id)
      .map((response: Response) => {});
  }

}
