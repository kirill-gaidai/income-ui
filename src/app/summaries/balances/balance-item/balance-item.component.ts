import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SummaryService} from '../../../services/summary.service';
import {BalanceService} from '../../../services/balance.service';
import {Subscription} from 'rxjs/Subscription';
import {Balance} from '../../../models/balance.model';
import {DateUtil} from '../../../utils/date.util';

@Component({
  selector: 'app-balance-item',
  templateUrl: './balance-item.component.html',
  styleUrls: ['./balance-item.component.css']
})
export class BalanceItemComponent implements OnInit, OnDestroy {

  private activatedRouteQueryParamsSubscription: Subscription;

  public balance: Balance;
  public numberFormat: string;

  constructor(private balanceService: BalanceService,
              private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }


  public ngOnInit(): void {
    this.numberFormat = '1.' + this.summaryService.accuracy + '-' + this.summaryService.accuracy;
    this.balance = new Balance(null, null, null, null, null);
    this.balanceService.get(
      DateUtil.strToDate(this.activatedRoute.snapshot.queryParams['day']),
      +this.activatedRoute.snapshot.queryParams['account_id'])
      .subscribe((balance: Balance) => this.balance = balance);
    this.activatedRouteQueryParamsSubscription = this.activatedRoute.queryParams
      .subscribe((params: Params) => {
        this.balanceService.get(
          DateUtil.strToDate(this.activatedRoute.snapshot.queryParams['day']),
          +this.activatedRoute.snapshot.queryParams['account_id'])
          .subscribe((balance: Balance) => this.balance = balance);
      });
  }

  public ngOnDestroy(): void {
    this.activatedRouteQueryParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['../', 'edit'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        day: DateUtil.dateToStr(this.balance.day),
        account_id: this.balance.accountId
      }
    });
  }

  public doOnBtDeleteClick(): void {
    this.balanceService.delete(this.balance.day, this.balance.accountId).subscribe(() => {
      this.summaryService.summariesChangedObservable.next();
      this.router.navigate(['/summaries']);
    });
  }

}
