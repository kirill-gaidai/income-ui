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

@Component({
  selector: 'app-summaries',
  templateUrl: './summaries.component.html',
  styleUrls: ['./summaries.component.css']
})
export class SummariesComponent implements OnInit, OnDestroy {

  private summaryParamsForm: FormGroup;
  private accountsFilterForm: FormGroup;
  private categoriesFilterForm: FormGroup;

  private currencies: Currency[];
  private accounts: Account[];
  private categories: Category[];
  private summaryTable: SummaryTable;

  constructor(private summaryService: SummaryService,
              private currencyService: CurrencyService) {
  }

  public ngOnInit(): void {
    this.currencies = this.currencyService.getList();
    this.accounts = [];
    this.categories = [];
    this.summaryTable = new SummaryTable([], [], []);

    this.summaryParamsForm = new FormGroup({
      'firstDay': new FormControl('2017-12-01'),
      'lastDay': new FormControl('2017-12-05'),
      'currencyId': new FormControl(this.currencies[0].id)
    });
    this.accountsFilterForm = new FormGroup({
      'accounts': new FormArray([])
    });
    this.categoriesFilterForm = new FormGroup({
      'categories': new FormArray([])
    });
  }

  public ngOnDestroy(): void {
  }

  public doOnBtSearchClick(): void {
    const firstDay: Date = DateUtil.strToDate(this.summaryParamsForm.value['firstDay']);
    const lastDay: Date = DateUtil.strToDate(this.summaryParamsForm.value['lastDay']);
    const currencyId: number = +this.summaryParamsForm.value['currencyId'];
    this.summaryService.get(currencyId, firstDay, lastDay).subscribe((summary: Summary) => {
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

      this.summaryTable = SummaryService.transform(summary, this.getFilterIds('accounts', true), this.getFilterIds('categories', true));
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

}
