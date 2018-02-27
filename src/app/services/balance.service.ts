import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Balance} from '../models/balance.model';
import {DateUtil} from '../utils/date.util';

@Injectable()
export class BalanceService implements OnInit, OnDestroy {

  // private BALANCES_URL = 'http://192.168.56.1:8080/income-dev/rest/balances';
  private BALANCES_URL = '/rest/balances';

  constructor(private http: Http) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public get(day: Date, accountId: number): Observable<Balance> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('day', DateUtil.dateToStr(day));
    urlSearchParams.append('account_id', accountId.toString());
    return this.http.get(this.BALANCES_URL, {
      params: urlSearchParams
    }).map((response: Response) => {
      const result = response.json();
      result['day'] = DateUtil.strToDate(result['day']);
      return result;
    });
  }

  public save(balance: Balance): Observable<Balance> {
    const body = {
      day: DateUtil.dateToStr(balance.day),
      accountId: balance.accountId,
      amount: balance.amount,
      manual: balance.manual
    };
    return this.http.post(this.BALANCES_URL + '/save', body).map((response: Response) => {
      const result = response.json();
      result['day'] = DateUtil.strToDate(result['day']);
      return result;
    });
  }

  public delete(day: Date, accountId: number): Observable<void> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('day', DateUtil.dateToStr(day));
    urlSearchParams.append('account_id', accountId.toString());
    return this.http.delete(this.BALANCES_URL, {
      params: urlSearchParams
    }).map((response: Response) => {});
  }

}
