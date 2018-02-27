import {Component, OnDestroy, OnInit} from '@angular/core';
import {OperationService} from '../../../services/operation.service';
import {CategoryService} from '../../../services/category.service';
import {AccountService} from '../../../services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../models/category.model';
import {Account} from '../../../models/account.model';
import {Operation} from '../../../models/operation.model';
import {DateUtil} from '../../../utils/date.util';
import {SummaryService} from '../../../services/summary.service';

@Component({
  selector: 'app-operation-edit',
  templateUrl: './operation-edit.component.html',
  styleUrls: ['./operation-edit.component.css']
})
export class OperationEditComponent implements OnInit, OnDestroy {

  private id: number;
  private accuracy: number;
  private pattern: string;

  public operationEditForm: FormGroup;
  public categories: Category[];
  public accounts: Account[];

  constructor(private operationService: OperationService,
              private categoryService: CategoryService,
              private accountService: AccountService,
              private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.accuracy = this.summaryService.accuracy;
    this.pattern = '^[-+]?([0-9]{0,10}\\.[0-9]{0,' + this.accuracy + '}|[0-9]{0,10})$';

    this.id = this.activatedRoute.snapshot.params['id'] ? +this.activatedRoute.snapshot.params['id'] : null;
    this.categories = [];
    this.accounts = [];
    this.initForm(null);

    if (this.id != null) {
      // Если редактируем существующую операцию, то просто получаем общий список счетов и категорий.
      // Счет операции изменить нельзя, а категория может быть изменена на любую из доступных
      this.categoryService.getList().subscribe((categories: Category[]) => this.categories = categories);
      this.accountService.getList().subscribe((accounts: Account[]) => this.accounts = accounts);
      this.operationService.get(this.id).subscribe((operation: Operation) => this.initForm(operation));
      // Запрещаем изменение счета существующей операции
      this.operationEditForm.get('accountId').disable();
    } else {
      // При открытии формы новой операции параметрами передаем:
      // - id счетов, для которых может быть сохранена операция;
      // - id категоий, которую может иметь операция
      // - дату операции (в форме не изменяется)
      this.categoryService.getList().subscribe((categories: Category[]) => {
        // Оставляем только те категории, которые использовались при выборке списка
        const categoryIds: number[] = this.getIdsParam(this.activatedRoute.snapshot.queryParams['category_id']);
        this.categories = categories.filter((category: Category) => categoryIds.indexOf(category.id) !== -1);

        this.accountService.getList().subscribe((accounts: Account[]) => {
          // Оставляем только те счета, которые использовались при выборке списка
          const accountIds: number[] = this.getIdsParam(this.activatedRoute.snapshot.queryParams['account_id']);
          this.accounts = accounts.filter((account: Account) => accountIds.indexOf(account.id) !== -1);

          this.operationEditForm.patchValue({
            'day': this.activatedRoute.snapshot.queryParams['day']
          });
          // Если одна категория, то заполняем и отключаем поле выбора категории
          if (this.categories.length === 1) {
            this.operationEditForm.patchValue({
              'categoryId': this.categories[0].id
            });
            this.operationEditForm.get('categoryId').disable();
          }
          // Если один счет, то заполняем и отключаем поле выбора счета
          if (this.accounts.length === 1) {
            this.operationEditForm.patchValue({
              'accountId': this.accounts[0].id
            });
            this.operationEditForm.get('accountId').disable();
          }
        });
      });
    }
  }

  private initForm(operation: Operation): void {
    this.operationEditForm = new FormGroup({
      'id': new FormControl(!operation ? null : operation.id,
        []),
      'accountId': new FormControl(!operation ? null : operation.accountId,
        [Validators.required]),
      'categoryId': new FormControl(!operation ? null : operation.categoryId,
        [Validators.required]),
      'day': new FormControl(!operation ? null : DateUtil.dateToStr(operation.day),
        [Validators.required]),
      'amount': new FormControl(!operation ? null : operation.amount,
        [Validators.required, Validators.pattern(this.pattern)]),
      'note': new FormControl(!operation ? '' : operation.note,
        [])
    });
  }

  public ngOnDestroy(): void {
  }

  private getIdsParam(idsParam): number[] {
    if (!idsParam) {
      return [];
    }
    if (idsParam instanceof Array) {
      return idsParam.reduce((result: number[], value: string) => {
        result.push(+value);
        return result;
      }, []);
    }
    return [+idsParam];
  }

  public doOnBtSaveClick(): void {
    if (this.id != null) {
      this.operationService.update(new Operation(
        +this.operationEditForm.get('id').value,
        +this.operationEditForm.get('accountId').value,
        null,
        +this.operationEditForm.get('categoryId').value,
        null,
        DateUtil.strToDate(this.operationEditForm.get('day').value),
        +this.operationEditForm.get('amount').value,
        this.operationEditForm.get('note').value
      )).subscribe((operation: Operation) => {
        this.summaryService.summariesChangedObservable.next();
        this.router.navigate(['/summaries']);
      });
    } else {
      this.operationService.create(new Operation(
        null,
        +this.operationEditForm.get('accountId').value,
        null,
        +this.operationEditForm.get('categoryId').value,
        null,
        DateUtil.strToDate(this.operationEditForm.get('day').value),
        +this.operationEditForm.get('amount').value,
        this.operationEditForm.get('note').value
      )).subscribe((operation: Operation) => {
        this.summaryService.summariesChangedObservable.next();
        this.router.navigate(['/summaries']);
      });
    }
  }

  public doOnBtCancelClick(): void {
    this.router.navigate(['/summaries']);
  }

}
