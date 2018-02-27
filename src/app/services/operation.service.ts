import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Operation} from '../models/operation.model';
import {DateUtil} from '../utils/date.util';

@Injectable()
export class OperationService implements OnInit, OnDestroy {

  // private OPERATIONS_URL = 'http://192.168.56.1:8080/income-dev/rest/operations';
  private OPERATIONS_URL = '/rest/operations';

  constructor(private http: Http) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(firstDay: Date, lastDay: Date, accountIds: number[], categoryIds: number[]): Observable<Operation[]> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('');
    urlSearchParams.append('first_day', DateUtil.dateToStr(firstDay));
    urlSearchParams.append('last_day', DateUtil.dateToStr(lastDay));
    accountIds.forEach((value: number) => urlSearchParams.append('account_id', value.toString()));
    categoryIds.forEach((value: number) => urlSearchParams.append('category_id', value.toString()));
    return this.http.get(this.OPERATIONS_URL, {
      params: urlSearchParams
    }).map((response: Response) => {
      const result = response.json();
      result.forEach(operation => operation.day = DateUtil.strToDate(operation.day));
      return result;
    });
  }

  public get(id: number): Observable<Operation> {
    return this.http.get(this.OPERATIONS_URL + '/' + id).map((response: Response) => {
        const result = response.json();
        result.day = DateUtil.strToDate(result.day);
        return result;
      });
  }

  public create(operation: Operation): Observable<Operation> {
    const body = {
      accountId: operation.accountId,
      categoryId: operation.categoryId,
      day: DateUtil.dateToStr(operation.day),
      amount: operation.amount,
      note: operation.note
    };
    return this.http.post(this.OPERATIONS_URL, body).map((response: Response) => {
        const result = response.json();
        result.day = DateUtil.strToDate(result.day);
        return result;
      });
  }

  public update(operation: Operation): Observable<Operation> {
    const body = {
      id: operation.id,
      categoryId: operation.categoryId,
      day: DateUtil.dateToStr(operation.day),
      amount: operation.amount,
      note: operation.note
    };
    return this.http.put(this.OPERATIONS_URL, body).map((response: Response) => {
        const result = response.json();
        result.day = DateUtil.strToDate(result.day);
        return result;
      });
  }

  public delete(id: number): Observable<void> {
    return this.http.delete(this.OPERATIONS_URL + '/' + id).map((response: Response) => {});
  }

}
