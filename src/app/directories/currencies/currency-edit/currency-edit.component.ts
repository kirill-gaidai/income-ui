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

  private currency: Currency;
  private currencyEditForm: FormGroup;

  constructor(private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.currency = this.currencyService.get(+id);
      this.currencyEditForm = new FormGroup({
        'id': new FormControl(this.currency.id),
        'code': new FormControl(this.currency.code,
          [Validators.required, Validators.pattern('[A-Z]{3}')]),
        'title': new FormControl(this.currency.title,
          [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
        'accuracy': new FormControl(this.currency.accuracy,
          [Validators.required, Validators.pattern('[0-4]{1}')])
      });
    } else {
      this.currency = null;
      this.currencyEditForm = new FormGroup({
        'id': new FormControl(null),
        'code': new FormControl(null),
        'title': new FormControl(null),
        'accuracy': new FormControl(null)
      });
    }
  }

  ngOnDestroy(): void {
  }

  doOnBtSaveClick(): void {
    this.currencyService.update(new Currency(
      +this.currencyEditForm.get('id').value,
      this.currencyEditForm.get('code').value,
      this.currencyEditForm.get('title').value,
      +this.currencyEditForm.get('accuracy').value));
  }

}
