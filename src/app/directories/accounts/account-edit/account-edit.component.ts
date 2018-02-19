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
    this.initForm(null);
    this.id = this.activatedRoute.snapshot.params['id'] ? +this.activatedRoute.snapshot.params['id'] : null;
    if (this.id != null) {
      this.accountService.get(this.id).subscribe((account: Account) => this.initForm(account));
    }
    this.currencies = [];
    this.currencyService.getList().subscribe((currencies: Currency[]) => this.currencies = currencies);
  }

  private initForm(account: Account): void {
    this.accountEditForm = new FormGroup({
      'id': new FormControl(account == null ? null : account.id,
        []),
      'currencyId': new FormControl(account == null ? null : account.currencyId,
        [Validators.required]),
      'sort': new FormControl(account == null ? null : account.sort,
        [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
      'title': new FormControl(account == null ? null : account.title,
        [Validators.required, Validators.minLength(1), Validators.maxLength(250)])
    });
  }

  public ngOnDestroy(): void {
  }

  public doOnBtSaveClick(): void {
    if (this.id === null) {
      this.accountService.create(new Account(
        +this.accountEditForm.get('id').value,
        +this.accountEditForm.get('currencyId').value, null, null,
        this.accountEditForm.get('sort').value,
        this.accountEditForm.get('title').value
      )).subscribe((account: Account) => {
        this.accountService.accountsChangedSubject.next();
        this.router.navigate(['../', account.id], {relativeTo: this.activatedRoute});
      });
    } else {
      this.accountService.update(new Account(
        +this.accountEditForm.get('id').value,
        +this.accountEditForm.get('currencyId').value, null, null,
        this.accountEditForm.get('sort').value,
        this.accountEditForm.get('title').value
      )).subscribe((account: Account) => {
        this.accountService.accountsChangedSubject.next();
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
      });
    }
  }

}
