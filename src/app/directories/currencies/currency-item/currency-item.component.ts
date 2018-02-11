import {Component, OnDestroy, OnInit} from '@angular/core';
import {Currency} from '../../../models/currency.model';
import {CurrencyService} from '../../../services/currency.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-currency-item',
  templateUrl: './currency-item.component.html',
  styleUrls: ['./currency-item.component.css']
})
export class CurrencyItemComponent implements OnInit, OnDestroy {

  private currency: Currency;
  private subscription: Subscription;

  constructor(private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currency = this.currencyService.get(+this.activatedRoute.snapshot.params['id']);
    this.subscription = this.activatedRoute.params.subscribe((params => {
      this.currency = this.currencyService.get(+params['id']);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

}
