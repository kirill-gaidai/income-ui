import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyService} from '../../../services/currency.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Currency} from '../../../models/currency.model';

@Component({
  selector: 'app-currency-edit',
  templateUrl: './currency-edit.component.html',
  styleUrls: ['./currency-edit.component.css']
})
export class CurrencyEditComponent implements OnInit, OnDestroy {

  private id: number;
  private currencyEditForm: FormGroup;

  constructor(private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'] ? +this.activatedRoute.snapshot.params['id'] : null;
    if (this.id !== null) {
      const currency: Currency = this.currencyService.get(this.id);
      this.currencyEditForm = new FormGroup({
        'id': new FormControl(currency.id),
        'code': new FormControl(currency.code, [Validators.required, Validators.pattern('[A-Z]{3}')]),
        'title': new FormControl(currency.title, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
        'accuracy': new FormControl(currency.accuracy, [Validators.required, Validators.pattern('[0-4]{1}')])
      });
    } else {
      this.currencyEditForm = new FormGroup({
        'id': new FormControl(null),
        'code': new FormControl(null, [Validators.required, Validators.pattern('[A-Z]{3}')]),
        'title': new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
        'accuracy': new FormControl(null, [Validators.required, Validators.pattern('[0-4]{1}')])
      });
    }
  }

  public ngOnDestroy(): void {
  }

  public doOnBtSaveClick(): void {
    if (this.id === null) {
      const currency: Currency = this.currencyService.create(new Currency(
        +this.currencyEditForm.get('id').value,
        this.currencyEditForm.get('code').value,
        this.currencyEditForm.get('title').value,
        +this.currencyEditForm.get('accuracy').value
      ));
      this.router.navigate(['../', currency.id], {relativeTo: this.activatedRoute});
    } else {
      this.currencyService.update(new Currency(
        +this.currencyEditForm.get('id').value,
        this.currencyEditForm.get('code').value,
        this.currencyEditForm.get('title').value,
        +this.currencyEditForm.get('accuracy').value
      ));
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }
  }

}
