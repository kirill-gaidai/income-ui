import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Account} from '../models/account.model';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AuthService} from './auth.service';

@Injectable()
export class AccountService implements OnInit, OnDestroy {

  public accountsChangedSubject: Subject<void> = new Subject<void>();

  private ACCOUNTS_URL = 'http://192.168.56.1:8080/rest/accounts';

  // private ACCOUNTS_URL = '/rest/accounts';

  constructor(private http: Http,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Observable<Account[]> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.ACCOUNTS_URL, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public get(id: number): Observable<Account> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.ACCOUNTS_URL + '/' + id, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public create(account: Account): Observable<Account> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.post(this.ACCOUNTS_URL, account, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public update(account: Account): Observable<Account> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.put(this.ACCOUNTS_URL, account, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public delete(id: number): Observable<void> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.delete(this.ACCOUNTS_URL + '/' + id, {
      headers: headers
    }).map((response: Response) => {
    });
  }

}
