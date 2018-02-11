import {EventEmitter, Injectable, OnInit} from '@angular/core';
import {Currency} from '../models/currency.model';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class CurrencyService implements OnInit {

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

  public create(currency: Currency): void {
    this.currencies.push(currency);
  }

  public update(currency: Currency): void {
    let index = 0;
    while (index < this.currencies.length && this.currencies[index].id !== currency.id) {
      index++;
    }
    if (index !== this.currencies.length) {
      this.currencies[index] = currency;
    }
  }

  public delete(index: number): void {
    if (index >= 0 && index < this.currencies.length) {
      this.currencies.splice(index, 1);
    }
  }

}
