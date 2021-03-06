import {Component, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../../models/currency.model';
import {CurrencyService} from '../../services/currency.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.css']
})
export class CurrenciesComponent implements OnInit, OnDestroy {

  private currenciesChangedSubscription: Subscription;

  public currencies: Currency[];

  constructor(private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.currencies = [];
    this.currencyService.getList().subscribe((currencies: Currency[]) => this.currencies = currencies);
    this.currenciesChangedSubscription = this.currencyService.currenciesChangedSubject.subscribe(() => {
      this.currencyService.getList().subscribe((currencies: Currency[]) => this.currencies = currencies);
    });
  }

  public ngOnDestroy(): void {
    this.currenciesChangedSubscription.unsubscribe();
  }

  public doOnBtAddClick(): void {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute});
  }

  public doOnBtRefreshClick(): void {
    this.currencyService.getList().subscribe((currencies: Currency[]) => this.currencies = currencies);
  }

}
