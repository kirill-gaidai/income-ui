import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/Rx';
import * as XLSX from 'xlsx';

import {Summary} from '../models/summary.model';
import {AuthService} from './auth.service';
import {SummaryRow} from '../models/summary-row.model';
import {SummaryTable} from '../models/summary-table.model';
import {DateUtil} from '../utils/date.util';
import {Operation} from '../models/operation.model';
import {Account} from '../models/account.model';
import {Category} from '../models/category.model';
import {Balance} from '../models/balance.model';

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

  public transformSummaryTableToArrays(summaryTable: SummaryTable): any[][] {
    const data: any[][] = [];
    const header: any[] = ['Дата', 'Разность'];
    const footer: any[] = [null, null];
    summaryTable.accountTitles.forEach((accountTitle: string, index: number) => {
      header.push(accountTitle);
      footer.push(null);
    });
    header.push('Сумма');
    footer.push(null);
    summaryTable.categoryTitles.forEach((categoryTitle: string, index: number) => {
      header.push(categoryTitle);
      footer.push(summaryTable.categoryAmounts[index]);
    });
    header.push('Сумма');
    footer.push(summaryTable.categoryAmountsSum);
    data.push(header);
    summaryTable.rows.forEach((summaryRow: SummaryRow) => {
      const row: any[] = [summaryRow.day, summaryRow.difference];
      summaryRow.accountAmounts.forEach((accountAmount: number) => {
        row.push(accountAmount);
      });
      row.push(summaryRow.accountAmountsSum);
      summaryRow.categoryAmounts.forEach((categoryAmount: number) => {
        row.push(categoryAmount);
      });
      row.push(summaryRow.categoryAmountsSum);
      data.push(row);
    });
    data.push(footer);
    return data;
  }

  public saveToXLSXFile(data: any[][]) {
    const workSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'BYN');
    XLSX.writeFile(workBook, 'income.xlsx');
  }

  /**
   * Преобразует JSON, который вернул сервер в отображаемую таблицу
   * @param {Summary} summary - JSON
   * @param {number[]} checkedAccountIds счета, которые нужно отобразить
   * @param {number[]} checkedCategoryIds категории, которые нужно отобразить
   * @returns {SummaryTable} объект, по которому строится таблица
   */
  public transform(summary: Summary, checkedAccountIds: number[], checkedCategoryIds: number[]): SummaryTable {
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
    checkedAccountIds.forEach((accountId, index) => {
      if (balanceDayMap.has(accountId)) {
        accountAmounts[index] = balanceDayMap.get(accountId).amount;
      }
    });
    const accountAmountsSum: number = accountAmounts.reduce((summ: number, value: number) => summ + value, 0);
    difference += accountAmountsSum;

    const categoryAmounts: number[] = (new Array(checkedCategoryIds.length)).fill(0);
    checkedCategoryIds.forEach((categoryId, index) => {
      if (operationDayMap.has(categoryId)) {
        categoryAmounts[index] = operationDayMap.get(categoryId)
          .filter((operation: Operation) => checkedAccountIds.indexOf(operation.accountId) !== -1)
          .reduce((summ: number, operation: Operation) => summ + operation.amount, 0);
      }
    });
    const operationAmountsSum = categoryAmounts.reduce((summ: number, value: number) => summ + value, 0);

    operationDayMap.forEach(((operationList: Operation[]) => {
      difference += operationList.reduce((sum: number, operation: Operation) => {
        return checkedAccountIds.indexOf(operation.accountId) === -1 ? sum : sum + operation.amount;
      }, 0);
    }));

    return new SummaryRow(day, difference, accountAmounts, accountAmountsSum, categoryAmounts, operationAmountsSum);
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
