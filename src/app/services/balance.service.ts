import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Balance} from '../models/balance.model';
import {DateUtil} from '../utils/date.util';

@Injectable()
export class BalanceService implements OnInit, OnDestroy {



  constructor(private http: Http) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public save(day: Date, accounts: number[]) {
  }

  public get(day: Date, accountId: number): Observable<Balance> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('day', DateUtil.dateToStr(day));
    urlSearchParams.append('account_id', accountId.toString());
    return this.http.get('http://192.168.56.1:8080/income-dev/rest/balances', {
      params: urlSearchParams
    }).map((response: Response) => {
      const result = response.json();
      result['day'] = DateUtil.strToDate(result['day']);
      return result;
    });
  }

}
