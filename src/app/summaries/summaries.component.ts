import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
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

@Component({
  selector: 'app-summaries',
  templateUrl: './summaries.component.html',
  styleUrls: ['./summaries.component.css']
})
export class SummariesComponent implements OnInit, OnDestroy {

  private summaryChangedSubscription: Subscription;
  private accounts: Account[];
  private categories: Category[];

  public summaryParamsForm: FormGroup;
  public accountsFilterForm: FormGroup;
  public categoriesFilterForm: FormGroup;
  public currencies: Currency[];
  public summaryTable: SummaryTable;
  public numberFormat: string;

  constructor(private summaryService: SummaryService,
              private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.summaryChangedSubscription = this.summaryService.summariesChangedObservable.subscribe(this.doOnBtSearchClick.bind(this));

    const day: Date = new Date();
    const lastDay: string = DateUtil.dateToStr(day);
    day.setDate(day.getDate() - 10);
    const firstDay: string = DateUtil.dateToStr(day);

    this.summaryParamsForm = new FormGroup({
      'firstDay': new FormControl(firstDay, [Validators.required, this.isValidFirstDay.bind(this)]),
      'lastDay': new FormControl(lastDay, [Validators.required, this.isValidLastDay.bind(this)]),
      'currencyId': new FormControl(null, [Validators.required])
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

      // Запоминаем, с каких счетов были сняты отметки
      const uncheckedAccountIds: Set<number> = new Set<number>(this.getFilterIds('accounts', false));
      // Запоминаем, с каких категорий были сняты отметки
      const uncheckedCategoryIds: Set<number> = new Set<number>(this.getFilterIds('categories', false));

      // Категории, которых нет в операциях и которые не отображены сейчас, не должны быть отмечены
      const missingCategoryIds: Set<number> = new Set<number>();
      // Заполняем сначала всеми категориями
      summary.categories.forEach((category: Category) => missingCategoryIds.add(category.id));
      // Удаляем те, которые отображены
      this.categories.forEach((category: Category) => missingCategoryIds.delete(category.id));
      // Удаляем те, которые есть в операциях
      summary.operations.forEach((operation: Operation) => missingCategoryIds.delete(operation.categoryId));

      // Очищаем фильтр счетов
      const accountsFilterFormArray: FormArray = <FormArray>this.accountsFilterForm.get('accounts');
      while (accountsFilterFormArray.length !== 0) {
        accountsFilterFormArray.removeAt(0);
      }

      // Очищаем фильтр категорий
      const categoriesFilterFormArray: FormArray = <FormArray>this.categoriesFilterForm.get('categories');
      while (categoriesFilterFormArray.length !== 0) {
        categoriesFilterFormArray.removeAt(0);
      }

      // Заполняем фильтр счетов заново
      this.accounts = summary.accounts;
      for (const account of this.accounts) {
        // Попутно снимаем отметку, если ее там не было
        accountsFilterFormArray.push(new FormControl(!uncheckedAccountIds.has(account.id)));
      }

      // Заполняем фильтр категорий заново
      this.categories = summary.categories;
      for (const category of this.categories) {
        // Попутно снимаем отметку, если ее там не было или категория новая и отсутствует в списке операций
        categoriesFilterFormArray.push(new FormControl(!uncheckedCategoryIds.has(category.id) && !missingCategoryIds.has(category.id)));
      }

      this.summaryTable = this.summaryService
        .transform(summary, this.getFilterIds('accounts', true), this.getFilterIds('categories', true));

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

  public doOnBtDownloadClick(): void {
    this.summaryService.saveToXLSXFile(this.summaryService.transformSummaryTableToArrays(this.summaryTable));
  }

  private isValidFirstDay(formControl: FormControl): {[str: string]: boolean} {
    // Summary search parameters form is not initialized
    if (!this.summaryParamsForm) {
      return null;
    }

    const firstDay: string = formControl.value;
    if (!firstDay) {
      return null;
    }

    const lastDay: string = this.summaryParamsForm.get('lastDay').value;
    if (!lastDay) {
      return null;
    }

    if (DateUtil.strToDate(lastDay) >= DateUtil.strToDate(firstDay)) {
      return null;
    }
    return {'firstDayGreaterThanLastDay': true};
  }

  private isValidLastDay(formControl: FormControl) {
    // Summary search parameters form is not initialized
    if (!this.summaryParamsForm) {
      return null;
    }

    const firstDay: string = this.summaryParamsForm.get('firstDay').value;
    if (!firstDay) {
      return null;
    }

    const lastDay: string = formControl.value;
    if (!lastDay) {
      return null;
    }

    if (DateUtil.strToDate(lastDay) >= DateUtil.strToDate(firstDay)) {
      return null;
    }
    return {'lastDayLessThanFirstDay': true};
  }

}
