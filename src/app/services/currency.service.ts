import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

import {Currency} from '../models/currency.model';
import {AuthService} from './auth.service';

@Injectable()
export class CurrencyService implements OnInit, OnDestroy {

  public currenciesChangedSubject: Subject<void> = new Subject<void>();

  private CURRENCIES_URL = 'http://192.168.56.1:8080/rest/currencies';

  // private CURRENCIES_URL = '/rest/currencies';

  constructor(private http: Http,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Observable<Currency[]> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.CURRENCIES_URL, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public get(id: number): Observable<Currency> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.CURRENCIES_URL + '/' + id, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public create(currency: Currency): Observable<Currency> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.post(this.CURRENCIES_URL, currency, {
      headers: headers
    }).map((response: Response) => response.json());
  }
  public update(currency: Currency): Observable<Currency> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.put(this.CURRENCIES_URL, currency, {
      headers: headers
    }).map((response: Response) => response.json());
  }

  public delete(id: number): Observable<void> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.delete(this.CURRENCIES_URL + '/' + id, {
      headers: headers
    }).map((response: Response) => {
    });
  }

}
