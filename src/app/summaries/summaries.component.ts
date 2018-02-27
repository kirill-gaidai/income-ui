import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {SummaryService} from '../services/summary.service';
import {CurrencyService} from '../services/currency.service';
import {Currency} from '../models/currency.model';
import {Account} from '../models/account.model';
import {DateUtil} from '../utils/date.util';
import {Summary} from '../models/summary.model';
import {Category} from '../models/category.model';
import {SummaryTable} from '../models/summary-table.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Operation} from '../models/operation.model';
import {Balance} from '../models/balance.model';
import {SummaryRow} from '../models/summary-row.model';

@Component({
  selector: 'app-summaries',
  templateUrl: './summaries.component.html',
  styleUrls: ['./summaries.component.css']
})
export class SummariesComponent implements OnInit, OnDestroy {

  private summaryChangedSubscription: Subscription;
  private accounts: Account[];
  private categories: Category[];
  private numberFormat: string;

  public summaryParamsForm: FormGroup;
  public accountsFilterForm: FormGroup;
  public categoriesFilterForm: FormGroup;
  public currencies: Currency[];
  public summaryTable: SummaryTable;

  constructor(private summaryService: SummaryService,
              private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.summaryChangedSubscription = this.summaryService.summariesChangedObservable.subscribe(this.doOnBtSearchClick.bind(this));

    this.summaryParamsForm = new FormGroup({
      'firstDay': new FormControl('2017-12-01'),
      'lastDay': new FormControl('2017-12-05'),
      'currencyId': new FormControl(null)
    });
    this.accountsFilterForm = new FormGroup({
      'accounts': new FormArray([])
    });
    this.categoriesFilterForm = new FormGroup({
      'categories': new FormArray([])
    });

    this.currencies = [];
    this.currencyService.getList().subscribe((currencies: Currency[]) => {
      this.currencies = currencies;
      if (this.currencies.length > 0) {
        this.summaryParamsForm.patchValue({
          'currencyId': this.currencies[0].id
        });
      }
    });

    this.accounts = [];
    this.categories = [];
    this.summaryTable = new SummaryTable([], [], [], [], [], [], 0);

  }

  public ngOnDestroy(): void {
  }

  public doOnBtSearchClick(): void {
    const firstDay: Date = DateUtil.strToDate(this.summaryParamsForm.value['firstDay']);
    const lastDay: Date = DateUtil.strToDate(this.summaryParamsForm.value['lastDay']);
    const currencyId: number = +this.summaryParamsForm.value['currencyId'];
    this.summaryService.get(currencyId, firstDay, lastDay).subscribe((summary: Summary) => {
      this.summaryService.accuracy = summary.currency.accuracy;
      this.numberFormat = '1.' + summary.currency.accuracy + '-' + summary.currency.accuracy;
      const uncheckedAccountIds: Set<number> = new Set<number>(this.getFilterIds('accounts', false));
      const uncheckedCategoryIds: Set<number> = new Set<number>(this.getFilterIds('categories', false));

      const accountsFilterFormArray: FormArray = <FormArray>this.accountsFilterForm.get('accounts');
      while (accountsFilterFormArray.length !== 0) {
        accountsFilterFormArray.removeAt(0);
      }

      const categoriesFilterFormArray: FormArray = <FormArray>this.categoriesFilterForm.get('categories');
      while (categoriesFilterFormArray.length !== 0) {
        categoriesFilterFormArray.removeAt(0);
      }

      this.accounts = summary.accounts;
      for (const account of this.accounts) {
        accountsFilterFormArray.push(new FormControl(!uncheckedAccountIds.has(account.id)));
      }

      this.categories = summary.categories;
      for (const category of this.categories) {
        categoriesFilterFormArray.push(new FormControl(!uncheckedCategoryIds.has(category.id)));
      }

      this.summaryTable = this.transform(summary, this.getFilterIds('accounts', true), this.getFilterIds('categories', true));

      this.router.navigate(['summaries']);
    });
  }

  private getFilterIds(filterName: string, checked: boolean) {
    const ids: boolean[] = filterName === 'accounts'
      ? this.accountsFilterForm.value['accounts']
      : this.categoriesFilterForm.value['categories'];
    const list: any[] = filterName === 'accounts' ? this.accounts : this.categories;
    return ids.reduce((result: number[], isChecked: boolean, index: number) => {
      if ((isChecked && checked) || (!isChecked && !checked)) {
        result.push(list[index].id);
      }
      return result;
    }, []);
  }

  /**
   * Преобразует JSON, который вернул сервер в отображаемую таблицу
   * @param {Summary} summary - JSON
   * @param {number[]} checkedAccountIds счета, которые нужно отобразить
   * @param {number[]} checkedCategoryIds категории, которые нужно отобразить
   * @returns {SummaryTable} объект, по которому строится таблица
   */
  private transform(summary: Summary, checkedAccountIds: number[], checkedCategoryIds: number[]): SummaryTable {
    const balanceMap: Map<number, Map<number, Balance>> = this.balanceListToMap(summary.balances);
    const operationMap: Map<number, Map<number, Operation[]>> = this.operationListToMap(summary.operations);
    let initialAccountAmounts: number[] = this.initializeAccountAmounts(summary.initialBalances, checkedAccountIds);
    const categoryAmounts: number[] = new Array(checkedCategoryIds.length).fill(0);
    let categoryAmountsSum = 0;

    const summaryRows: SummaryRow[] = [];
    for (let day = DateUtil.cloneDate(summary.firstDay); day <= summary.lastDay; day = DateUtil.incrementDay(day)) {
      const timestamp: number = +day;
      const summaryRow: SummaryRow = this.buildRow(day, initialAccountAmounts,
        balanceMap.has(timestamp) ? balanceMap.get(timestamp) : new Map<number, Balance>(),
        operationMap.has(timestamp) ? operationMap.get(timestamp) : new Map<number, Operation[]>(),
        checkedAccountIds, checkedCategoryIds);
      summaryRows.push(summaryRow);
      initialAccountAmounts = summaryRow.accountAmounts;
      summaryRow.categoryAmounts.forEach(((value, index) => categoryAmounts[index] += value));
      categoryAmountsSum += summaryRow.categoryAmountsSum;
    }

    const accountTitles: string[] = summary.accounts.reduce((result: string[], account: Account) => {
      const index: number = checkedAccountIds.indexOf(account.id);
      if (index !== -1) {
        result[index] = account.title;
      }
      return result;
    }, new Array(checkedAccountIds.length).fill(''));

    const categoryTitles: string[] = summary.categories.reduce((result: string[], category: Category) => {
      const index: number = checkedCategoryIds.indexOf(category.id);
      if (index !== -1) {
        result[index] = category.title;
      }
      return result;
    }, new Array(checkedCategoryIds.length).fill(''));

    return new SummaryTable(
      accountTitles, categoryTitles,
      checkedAccountIds, checkedCategoryIds,
      summaryRows,
      categoryAmounts, categoryAmountsSum);
  }

  private buildRow(day: Date, initialAccountAmounts: number[],
                   balanceDayMap: Map<number, Balance>, operationDayMap: Map<number, Operation[]>,
                   checkedAccountIds: number[], checkedCategoryIds: number[]): SummaryRow {
    let difference: number = -initialAccountAmounts.reduce((summ: number, value: number) => summ + value, 0);

    const accountAmounts: number[] = initialAccountAmounts.slice();
    const balances: Balance[] = (new Array(checkedAccountIds.length));
    checkedAccountIds.forEach((accountId, index) => {
      if (balanceDayMap.has(accountId)) {
        const balance: Balance = balanceDayMap.get(accountId);
        accountAmounts[index] = balance.amount;
        balances[index] = balance;
      } else {
        balances[index] = new Balance(accountId, '', day, accountAmounts[index], false);
      }
    });
    const accountAmountsSum: number = accountAmounts.reduce((summ: number, value: number) => summ + value, 0);
    difference += accountAmountsSum;

    const categoryAmounts: number[] = (new Array(checkedCategoryIds.length)).fill(0);
    const operations: Operation[][] = (new Array(checkedCategoryIds.length)).fill(null);
    checkedCategoryIds.forEach((categoryId, index) => {
      if (operationDayMap.has(categoryId)) {
        const operationList: Operation[] = operationDayMap.get(categoryId)
          .filter((operation: Operation) => checkedAccountIds.indexOf(operation.accountId) !== -1);
        categoryAmounts[index] = operationList.reduce((summ: number, operation: Operation) => summ + operation.amount, 0);
        operations[index] = operationList;
      } else {
        operations[index] = [];
      }
    });
    const operationAmountsSum = categoryAmounts.reduce((summ: number, value: number) => summ + value, 0);
    operationDayMap.forEach(((operationList: Operation[]) => {
      difference += operationList.reduce((sum: number, operation: Operation) => {
        return checkedAccountIds.indexOf(operation.accountId) === -1 ? sum : sum + operation.amount;
      }, 0);
    }));

    return new SummaryRow(day, difference,
      accountAmounts, balances, accountAmountsSum,
      categoryAmounts, operations, operationAmountsSum);
  }

  private balanceListToMap(balances: Balance[]): Map<number, Map<number, Balance>> {
    return balances.reduce((dayMap: Map<number, Map<number, Balance>>, balance: Balance) => {
      // storing day as a number because map uses '==='
      const day: number = +balance.day;
      let accountMap: Map<number, Balance>;
      if (!dayMap.has(day)) {
        accountMap = new Map<number, Balance>();
        dayMap.set(day, accountMap);
      } else {
        accountMap = dayMap.get(day);
      }

      accountMap.set(balance.accountId, balance);
      return dayMap;
    }, new Map<number, Map<number, Balance>>());
  }

  private operationListToMap(operations: Operation[]): Map<number, Map<number, Operation[]>> {
    return operations.reduce((dayMap: Map<number, Map<number, Operation[]>>, operation: Operation) => {
      // storing day as a number because map uses '==='
      const day: number = +operation.day;
      let categoryMap: Map<number, Operation[]>;
      if (!dayMap.has(day)) {
        categoryMap = new Map<number, Operation[]>();
        dayMap.set(day, categoryMap);
      } else {
        categoryMap = dayMap.get(day);
      }

      const categoryId: number = operation.categoryId;
      let operationArray: Operation[];
      if (!categoryMap.has(categoryId)) {
        operationArray = [];
        categoryMap.set(categoryId, operationArray);
      } else {
        operationArray = categoryMap.get(categoryId);
      }

      operationArray.push(operation);
      return dayMap;
    }, new Map<number, Map<number, Operation[]>>());
  }

  private initializeAccountAmounts(initialBalances: Balance[], checkedAccountIds: number[]): number[] {
    return initialBalances.reduce((result: number[], balance: Balance) => {
      const index = checkedAccountIds.indexOf(balance.accountId);
      if (index !== -1) {
        result[index] = balance.amount;
      }
      return result;
    }, new Array(checkedAccountIds.length).fill(0));
  }

}
