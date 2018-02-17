import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../models/currency.model';
import {Subject} from 'rxjs/Subject';
import {Account} from '../models/account.model';

@Injectable()
export class CurrencyService implements OnInit, OnDestroy {

  public currenciesChangedSubject: Subject<Currency[]> = new Subject<Currency[]>();

  private currencies: Currency[] = [
    new Currency(1, 'BYN', 'Белорусский рубль', 2),
    new Currency(2, 'USD', 'Доллар США', 0),
    new Currency(3, 'EUR', 'Евро', 2),
    new Currency(4, 'RUR', 'Российский рубль', 2)
  ];

  constructor() {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
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

  public fillInfo(account: Account): Account {
    for (const currency of this.currencies) {
      if (currency.id === account.currencyId) {
        account.currencyCode = currency.code;
        account.currencyTitle = currency.title;
        return account;
      }
    }
  }

}
