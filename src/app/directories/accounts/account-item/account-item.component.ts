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

  private account: Account;
  private activatedRouteParamsSubscription: Subscription;

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.account = new Account(null, null, null, null, null, null);
    this.activatedRouteParamsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.accountService.get(+params['id']).subscribe((account: Account) => this.account = account);
    });
  }

  public ngOnDestroy(): void {
    this.activatedRouteParamsSubscription.unsubscribe();
  }

  public doOnBtEditClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

  public doOnBtDeleteClick(): void {
    this.accountService.delete(this.account.id).subscribe(() => {
      this.accountService.accountsChangedSubject.next();
      this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    });
  }

}
