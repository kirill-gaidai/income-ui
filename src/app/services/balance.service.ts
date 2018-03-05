import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Balance} from '../models/balance.model';
import {DateUtil} from '../utils/date.util';
import {AuthService} from './auth.service';

@Injectable()
export class BalanceService implements OnInit, OnDestroy {

  private BALANCES_URL = 'http://192.168.56.1:8080/rest/balances';

  // private BALANCES_URL = '/rest/balances';

  constructor(private http: Http,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public get(day: Date, accountId: number): Observable<Balance> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('day', DateUtil.dateToStr(day));
    urlSearchParams.append('account_id', accountId.toString());
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.get(this.BALANCES_URL, {
      params: urlSearchParams,
      headers: headers
    }).map((response: Response) => {
      const result = response.json();
      result['day'] = DateUtil.strToDate(result['day']);
      return result;
    });
  }

  public save(balance: Balance): Observable<Balance> {
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    const body = {
      day: DateUtil.dateToStr(balance.day),
      accountId: balance.accountId,
      amount: balance.amount,
      manual: balance.manual
    };
    return this.http.post(this.BALANCES_URL + '/save', body, {
      headers: headers
    }).map((response: Response) => {
      const result = response.json();
      result['day'] = DateUtil.strToDate(result['day']);
      return result;
    });
  }

  public delete(day: Date, accountId: number): Observable<void> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('day', DateUtil.dateToStr(day));
    urlSearchParams.append('account_id', accountId.toString());
    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }
    return this.http.delete(this.BALANCES_URL, {
      params: urlSearchParams,
      headers: headers
    }).map((response: Response) => {
    });
  }

}
