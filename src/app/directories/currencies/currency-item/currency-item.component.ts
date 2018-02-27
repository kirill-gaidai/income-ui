import {Component, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../../../models/currency.model';
import {CurrencyService} from '../../../services/currency.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-currency-item',
  templateUrl: './currency-item.component.html',
  styleUrls: ['./currency-item.component.css']
})
export class CurrencyItemComponent implements OnInit, OnDestroy {

  private activatedRouteParamsSubscription: Subscription;

  public currency: Currency;

  constructor(private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.currency = new Currency(null, null, null, null);
    this.activatedRouteParamsSubscription = this.activatedRoute.params.subscribe(((params: Params) => {
      this.currencyService.get(+params['id']).subscribe((currency: Currency) => this.currency = currency);
    }));
  }

  public ngOnDestroy(): void {
    this.activatedRouteParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  public doOnBtDeleteClick() {
    this.currencyService.delete(this.currency.id).subscribe(() => {
      this.currencyService.currenciesChangedSubject.next();
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    });
  }

}
