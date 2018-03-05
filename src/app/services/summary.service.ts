import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import {DateUtil} from '../utils/date.util';
import 'rxjs/Rx';
import {Summary} from '../models/summary.model';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AuthService} from './auth.service';

@Injectable()
export class SummaryService implements OnInit, OnDestroy {

  public summariesChangedObservable: Subject<void> = new Subject<void>();
  public accuracy = 2;

  private SUMMARIES_URL = 'http://192.168.56.1:8080/rest/summaries';
  // private SUMMARIES_URL = '/rest/summaries';

  constructor(private http: Http,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public get(currencyId: number, firstDay: Date, lastDay: Date): Observable<Summary> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('currency_id', currencyId.toString());
    urlSearchParams.append('first_day', DateUtil.dateToStr(firstDay));
    urlSearchParams.append('last_day', DateUtil.dateToStr(lastDay));

    const headers: Headers = new Headers();
    if (this.authService.authentication.token) {
      headers.append('token', this.authService.authentication.token);
    }

    return this.http.get(this.SUMMARIES_URL, {
      params: urlSearchParams,
      headers: headers
    }).map((response: Response) => {
      const result = response.json();
      result.firstDay = DateUtil.strToDate(result.firstDay);
      result.lastDay = DateUtil.strToDate(result.lastDay);
      result.balances.forEach(balance => balance.day = DateUtil.strToDate(balance.day));
      result.operations.forEach(operation => operation.day = DateUtil.strToDate(operation.day));
      return result;
    });
  }

}
