import {Component, OnDestroy, OnInit} from '@angular/core';
import {OperationService} from '../../../services/operation.service';
import {CategoryService} from '../../../services/category.service';
import {AccountService} from '../../../services/account.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {Category} from '../../../models/category.model';
import {Account} from '../../../models/account.model';
import {Operation} from '../../../models/operation.model';
import {DateUtil} from '../../../utils/date.util';

@Component({
  selector: 'app-operation-edit',
  templateUrl: './operation-edit.component.html',
  styleUrls: ['./operation-edit.component.css']
})
export class OperationEditComponent implements OnInit, OnDestroy {

  private id: number;
  private operationEditForm: FormGroup;
  private categories: Category[];
  private accounts: Account[];

  constructor(private operationService: OperationService,
              private categoryService: CategoryService,
              private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
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
          }
          // Если один счет, то заполняем и отключаем поле выбора счета
          if (this.accounts.length === 1) {
            this.operationEditForm.patchValue({
              'accountId': this.accounts[0].id
            });
          }
        });
      });
    }
  }

  private initForm(operation: Operation): void {
    this.operationEditForm = new FormGroup({
      'id': new FormControl(!operation ? null : operation.id),
      'accountId': new FormControl(!operation ? null : operation.accountId),
      'categoryId': new FormControl(!operation ? null : operation.categoryId),
      'day': new FormControl(!operation ? null : DateUtil.dateToStr(operation.day)),
      'amount': new FormControl(!operation ? null : operation.amount),
      'note': new FormControl(!operation ? null : operation.note)
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

}
