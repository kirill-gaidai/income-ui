import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateUtil} from '../../../utils/date.util';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SummaryService} from '../../../services/summary.service';
import {Subscription} from 'rxjs/Subscription';
import {Balance} from '../../../models/balance.model';
import {BalanceService} from '../../../services/balance.service';

@Component({
  selector: 'app-balance-edit',
  templateUrl: './balance-edit.component.html',
  styleUrls: ['./balance-edit.component.css']
})
export class BalanceEditComponent implements OnInit, OnDestroy {

  private day: Date;
  private accountId: number;
  private accuracy: number;
  private pattern: string;
  private activatedRouteQueryParamsSubscription: Subscription;

  public balanceEditForm: FormGroup;

  constructor(private balanceService: BalanceService,
              private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.accuracy = this.summaryService.accuracy;
    this.pattern = '^[-+]?([0-9]{0,10}\\.[0-9]{0,' + this.accuracy + '}|[0-9]{0,10})$';

    this.balanceEditForm = new FormGroup({
      'accountTitle': new FormControl(null,
        []),
      'day': new FormControl(null,
        []),
      'amount': new FormControl(null,
        [Validators.required, Validators.pattern(this.pattern)]),
      'manual': new FormControl(false,
        [])
    });

    this.day = DateUtil.strToDate(this.activatedRoute.snapshot.queryParams['day']);
    this.accountId = +this.activatedRoute.snapshot.queryParams['account_id'];
    this.initForm();

    this.activatedRouteQueryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.day = DateUtil.strToDate(params['day']);
      this.accountId = +params['account_id'];
      this.initForm();
    });
  }

  private initForm(): void {
    this.balanceService.get(this.day, this.accountId).subscribe((balance: Balance) => {
      this.balanceEditForm = new FormGroup({
        'accountTitle': new FormControl(balance.accountTitle,
          []),
        'day': new FormControl(DateUtil.dateToStr(balance.day),
          []),
        'amount': new FormControl(balance.amount,
          [Validators.required, Validators.pattern(this.pattern)]),
        'manual': new FormControl(balance.manual,
          [])
      });
    });
  }

  public ngOnDestroy(): void {
    this.activatedRouteQueryParamsSubscription.unsubscribe();
  }

  public doOnBtSaveClick(): void {
      this.balanceService.save(new Balance(
        this.accountId,
        null,
        this.day,
        +this.balanceEditForm.get('amount').value,
        this.balanceEditForm.get('manual').value
      )).subscribe((balance: Balance) => {
        this.summaryService.summariesChangedObservable.next();
        this.router.navigate(['/summaries']);
      });
  }

  public doOnBtCancelClick(): void {
    this.router.navigate(['/summaries']);
  }

}
