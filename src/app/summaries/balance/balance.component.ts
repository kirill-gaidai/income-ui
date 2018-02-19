import {Component, OnDestroy, OnInit} from '@angular/core';
import {BalanceService} from '../../services/balance.service';
import {SummaryService} from '../../services/summary.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DateUtil} from '../../utils/date.util';
import {Subscription} from 'rxjs/Subscription';
import {FormControl, FormGroup} from '@angular/forms';
import {Balance} from '../../models/balance.model';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit, OnDestroy {

  private day: Date;
  private accountId: number;

  private queryParamsSubscription: Subscription;

  private balanceEditForm: FormGroup;

  constructor(private balanceService: BalanceService,
              private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.balanceEditForm = new FormGroup({
      'accountTitle': new FormControl(null),
      'day': new FormControl(null),
      'amount': new FormControl(null),
      'manual': new FormControl(false)
    });

    this.day = DateUtil.strToDate(this.activatedRoute.snapshot.queryParams['day']);
    this.accountId = +this.activatedRoute.snapshot.queryParams['account_id'];
    this.initForm();

    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.day = DateUtil.strToDate(params['day']);
      this.accountId = +params['account_id'];
      this.initForm();
    });
  }

  private initForm(): void {
    this.balanceService.get(this.day, this.accountId).subscribe((balance: Balance) => {
      this.balanceEditForm = new FormGroup({
        'accountTitle': new FormControl(balance.accountTitle),
        'day': new FormControl(DateUtil.dateToStr(balance.day)),
        'amount': new FormControl(balance.amount),
        'manual': new FormControl(balance.manual)
      });
    });
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  public doOnBtSaveClick(): void {

  }

}
