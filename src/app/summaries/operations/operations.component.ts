import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {OperationService} from '../../services/operation.service';
import {SummaryService} from '../../services/summary.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DateUtil} from '../../utils/date.util';
import {Operation} from '../../models/operation.model';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit, OnDestroy {

  private day: Date;
  private accountIds: number[];
  private categoryIds: number[];
  private queryParamsSubscription: Subscription;

  public operations: Operation[];
  public numberFormat: string;

  constructor(private operationService: OperationService,
              private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.numberFormat = '1.' + this.summaryService.accuracy + '-' + this.summaryService.accuracy;
    this.operations = [];
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => this.init(params));
  }

  private init(queryParams: Params): void {
    if (!queryParams['day'] || !queryParams['account_id']) {
      return;
    }
    this.day = DateUtil.strToDate(this.activatedRoute.snapshot.queryParams['day']);
    this.accountIds = this.getIdsParam(this.activatedRoute.snapshot.queryParams['account_id']);
    this.categoryIds = this.getIdsParam(this.activatedRoute.snapshot.queryParams['category_id']);
    this.operationService.getList(this.day, this.day, this.accountIds, this.categoryIds)
      .subscribe((operations: Operation[]) => this.operations = operations);
  }

  public ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  private getIdsParam(idsParam): number[] {
    if (!idsParam) {
      return [];
    }
    if (idsParam instanceof Array) {
      return idsParam.reduce((result: number[], value: string) => {
        result.push(+value);
        return result;
      }, []);
    }
    return [+idsParam];
  }

  public doOnBtAddClick(): void {
    this.router.navigate(['new'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        account_id: this.accountIds,
        category_id: this.categoryIds,
        day: DateUtil.dateToStr(this.day)
      }
    });
  }

  public doOnBtRefreshClick(): void {
    this.operationService.getList(this.day, this.day, this.accountIds, this.categoryIds)
      .subscribe((operations: Operation[]) => this.operations = operations);
  }

}
