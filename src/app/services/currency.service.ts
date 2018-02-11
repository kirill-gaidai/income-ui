import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Currency} from '../models/currency.model';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class CurrencyService implements OnInit {

  private currenciesChangedSubscription: Subscription;

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
    const index: number = this.getIndex(id);
    return index !== -1 ? this.currencies[index] : null;
  }

  public getIndex(id: number): number {
    for (let index = 0; index < this.currencies.length; index++) {
      if (id === this.currencies[index].id) {
        return index;
      }
    }
    return -1;
  }

  public create(currency: Currency): void {
    this.currencies.push(currency);
  }

  public update(currency: Currency): void {
    const index = this.getIndex(currency.id);
    if (index !== -1) {
      this.currencies[index] = currency;
    }
  }

  public delete(index: number): void {
    if (index >= 0 && index < this.currencies.length) {
      this.currencies.splice(index, 1);
    }
  }

}
