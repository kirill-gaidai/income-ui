import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Currency} from '../models/currency.model';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CurrencyService implements OnInit {

  public currenciesChangedSubject: Subject<Currency[]> = new Subject<Currency[]>();

  private currencies: Currency[] = [
    new Currency(1, 'BYN', 'Belarussian rouble', 2),
    new Currency(2, 'USD', 'US Dollar', 0),
    new Currency(3, 'EUR', 'Euro', 2)
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

  public getList(): Currency[] {
    return this.currencies.slice();
  }

  public get(id: number): Currency {
    for (const currency of this.currencies) {
      if (id === currency.id) {
        return currency;
      }
    }
    return null;
  }

  public create(currency: Currency): Currency {
    currency.id = this.getNextId();
    this.currencies.push(currency);
    this.currenciesChangedSubject.next(this.currencies);
    return currency;
  }

  public update(currency: Currency): void {
    for (let index = 0; index < this.currencies.length; index++) {
      if (currency.id === this.currencies[index].id) {
        this.currencies[index] = currency;
        this.currenciesChangedSubject.next(this.currencies);
        return;
      }
    }
  }

  public delete(id: number): void {
    for (let index = 0; index < this.currencies.length; index++) {
      if (id === this.currencies[index].id) {
        this.currencies.splice(index, 1);
        this.currenciesChangedSubject.next(this.currencies);
        return;
      }
    }
  }

  private getNextId(): number {
    let max = 0;
    this.currencies.forEach((currency: Currency) => {
      if (max < currency.id) {
        max = currency.id;
      }
    });
    return max + 1;
  }

}
