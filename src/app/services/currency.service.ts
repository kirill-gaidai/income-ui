import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../models/currency.model';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';

@Injectable()
export class CurrencyService implements OnInit, OnDestroy {

  public currenciesChangedSubject: Subject<void> = new Subject<void>();

  private CURRENCIES_URL = 'http://192.168.56.1:8080/income-dev/rest/currencies';

  constructor(private http: Http) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Observable<Currency[]> {
    return this.http.get(this.CURRENCIES_URL)
      .map((response: Response) => response.json());
  }

  public get(id: number): Observable<Currency> {
    return this.http.get(this.CURRENCIES_URL + '/' + id)
      .map((response: Response) => response.json());
  }

  public create(currency: Currency): Observable<Currency> {
    return this.http.post(this.CURRENCIES_URL, currency)
      .map((response: Response) => response.json());
  }

  public update(currency: Currency): Observable<Currency> {
    return this.http.put(this.CURRENCIES_URL, currency)
      .map((response: Response) => response.json());
  }

  public delete(id: number): Observable<void> {
    return this.http.delete(this.CURRENCIES_URL + '/' + id)
      .map((response: Response) => {});
  }

}
