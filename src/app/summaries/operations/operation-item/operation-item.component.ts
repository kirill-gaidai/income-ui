import {Component, OnDestroy, OnInit} from '@angular/core';
import {OperationService} from '../../../services/operation.service';
import {SummaryService} from '../../../services/summary.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Operation} from '../../../models/operation.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-operation-item',
  templateUrl: './operation-item.component.html',
  styleUrls: ['./operation-item.component.css']
})
export class OperationItemComponent implements OnInit, OnDestroy {

  private activatedRouteParamsSubscription: Subscription;

  private operation: Operation;

  constructor(private operationService: OperationService,
              private summaryService: SummaryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.operation = new Operation(null, null, null, null, null, null, null, null);
    this.activatedRouteParamsSubscription = this.operationService.get(+this.activatedRoute.snapshot.params['id'])
      .subscribe((operation: Operation) => this.operation = operation);
    this.activatedRoute.params.subscribe((params: Params) => {
      this.operationService.get(+params['id']).subscribe((operation: Operation) => this.operation = operation);
    });
  }

  public ngOnDestroy(): void {
    this.activatedRouteParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  public doOnBtDeleteClick(): void {

  }

}
