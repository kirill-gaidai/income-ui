import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {Account} from '../../../models/account.model';

@Component({
  selector: 'app-account-item',
  templateUrl: './account-item.component.html',
  styleUrls: ['./account-item.component.css']
})
export class AccountItemComponent implements OnInit, OnDestroy {

  private id: number;
  private account: Account;
  private activatedRouteParamsSubscription: Subscription;

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.id = +this.activatedRoute.snapshot.params['id'];
    this.account = this.accountService.get(this.id);
    this.activatedRouteParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.account = this.accountService.get(this.id);
    });
  }

  public ngOnDestroy(): void {
    this.activatedRouteParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  public doOnBtDeleteClick(): void {
    this.accountService.delete(this.id);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

}
