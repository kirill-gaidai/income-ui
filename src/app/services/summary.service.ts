import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {DateUtil} from '../utils/date.util';
import 'rxjs/Rx';
import {Summary} from '../models/summary.model';
import {Observable} from 'rxjs/Observable';
import {SummaryTable} from '../models/summary-table.model';
import {SummaryRow} from '../models/summary-row.model';
import {Balance} from '../models/balance.model';
import {Operation} from '../models/operation.model';
import {Account} from '../models/account.model';
import {Category} from '../models/category.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SummaryService implements OnInit, OnDestroy {

  public summariesChangedObservable: Subject<void> = new Subject<void>();

  /**
   * Преобразует JSON, который вернул сервер в отображаемую таблицу
   * @param {Summary} summary - JSON
   * @param {number[]} checkedAccountIds счета, которые нужно отобразить
   * @param {number[]} checkedCategoryIds категории, которые нужно отобразить
   * @returns {SummaryTable} объект, по которому строится таблица
   */
  public static transform(summary: Summary, checkedAccountIds: number[], checkedCategoryIds: number[]): SummaryTable {
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

  private static buildRow(day: Date, initialAccountAmounts: number[],
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

  private static balanceListToMap(balances: Balance[]): Map<number, Map<number, Balance>> {
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

  private static operationListToMap(operations: Operation[]): Map<number, Map<number, Operation[]>> {
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

  public static initializeAccountAmounts(initialBalances: Balance[], checkedAccountIds: number[]): number[] {
    return initialBalances.reduce((result: number[], balance: Balance) => {
      const index = checkedAccountIds.indexOf(balance.accountId);
      if (index !== -1) {
        result[index] = balance.amount;
      }
      return result;
    }, new Array(checkedAccountIds.length).fill(0));
  }

  constructor(private http: Http) {
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
    return this.http.get('http://192.168.56.1:8080/income-dev/rest/summaries', {
      params: urlSearchParams
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
