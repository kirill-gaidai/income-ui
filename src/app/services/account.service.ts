import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {CurrencyService} from './currency.service';
import {Account} from '../models/account.model';

@Injectable()
export class AccountService implements OnInit, OnDestroy {

  public accountsChangedSubject: Subject<Account[]> = new Subject<Account[]>();
  private accounts: Account[] = [
    new Account(1, 1, 'BYN', 'Белорусский рубль', '01', 'Кошелек'),
    new Account(2, 1, 'BYN', 'Белорусский рубль', '02', 'Карточка'),
    new Account(3, 2, 'USD', 'Доллар США', '03', 'Кошелек')
  ];

  constructor(private currencyService: CurrencyService) {
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  public getList(): Account[] {
    return this.accounts.slice();
  }

  public get(id: number): Account {
    for (const account of this.accounts) {
      if (id === account.id) {
        return account;
      }
    }
    return null;
  }

  public create(account: Account): Account {
    account.id = this.getNextId();
    this.currencyService.fillInfo(account);
    this.accounts.push(account);
    this.accountsChangedSubject.next(this.accounts);
    return account;
  }

  public update(account: Account): void {
    for (let index = 0; index < this.accounts.length; index++) {
      if (this.accounts[index].id === account.id) {
        this.accounts[index] = account;
        this.accountsChangedSubject.next(this.accounts);
        return;
      }
    }
  }

  public delete(id: number): void {
    for (let index = 0; index < this.accounts.length; index++) {
      if (this.accounts[index].id === id) {
        this.accounts.splice(index, 1);
        this.accountsChangedSubject.next(this.accounts);
        return;
      }
    }
  }

  private getNextId(): number {
    let max = 0;
    for (const account of this.accounts) {
      if (max < account.id) {
        max = account.id;
      }
    }
    return max + 1;
  }

}
