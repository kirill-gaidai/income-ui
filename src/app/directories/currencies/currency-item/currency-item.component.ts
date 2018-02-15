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

  private id: number;
  private currency: Currency;
  private activatedRouteParamsSubscription: Subscription;

  constructor(private currencyService: CurrencyService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.params['id'];
    this.currency = this.currencyService.get(this.id);
    this.activatedRouteParamsSubscription = this.activatedRoute.params.subscribe((params => {
      this.id = +params['id'];
      this.currency = this.currencyService.get(this.id);
    }));
  }

  public ngOnDestroy(): void {
    this.activatedRouteParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  public doOnBtDeleteClick() {
    this.currencyService.delete(this.id);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }
}
