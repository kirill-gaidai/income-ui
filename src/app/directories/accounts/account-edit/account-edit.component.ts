import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Currency} from '../../../models/currency.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {Account} from '../../../models/account.model';
import {CurrencyService} from '../../../services/currency.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit, OnDestroy {

  private id: number;
  private accountEditForm: FormGroup;
  private currencies: Currency[];

  constructor(private accountService: AccountService,
              private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'] ? +this.activatedRoute.snapshot.params['id'] : null;
    if (this.id != null) {
      const account: Account = this.accountService.get(this.id);
      this.accountEditForm = new FormGroup({
        'id': new FormControl(account.id),
        'currencyId': new FormControl(account.currencyId, [Validators.required]),
        'sort': new FormControl(account.sort, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
        'title': new FormControl(account.title, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
      });
    } else {
      this.accountEditForm = new FormGroup({
        'id': new FormControl(null),
        'currencyId': new FormControl(null, [Validators.required]),
        'sort': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
        'title': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
      });
    }
    this.currencies = this.currencyService.getList();
  }

  public ngOnDestroy(): void {
  }

  public doOnBtSaveClick(): void {
    if (this.id === null) {
      const account: Account = this.accountService.create(this.currencyService.fillInfo(new Account(
        +this.accountEditForm.get('id').value,
        +this.accountEditForm.get('currencyId').value, null, null,
        this.accountEditForm.get('sort').value,
        this.accountEditForm.get('title').value
      )));
      this.router.navigate(['../', account.id], {relativeTo: this.activatedRoute});
    } else {
      this.accountService.update(this.currencyService.fillInfo(new Account(
        +this.accountEditForm.get('id').value,
        +this.accountEditForm.get('currencyId').value, null, null,
        this.accountEditForm.get('sort').value,
        this.accountEditForm.get('title').value
      )));
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }
  }

}
