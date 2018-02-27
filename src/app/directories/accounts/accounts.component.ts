import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Account} from '../../models/account.model';
import {AccountService} from '../../services/account.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

  private accountsChangedSubscription: Subscription;

  public accounts: Account[];

  constructor(private accountService: AccountService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.accounts = [];
    this.accountService.getList().subscribe((accounts: Account[]) => this.accounts = accounts);
    this.accountsChangedSubscription = this.accountService.accountsChangedSubject.subscribe(() => {
      this.accountService.getList().subscribe((accounts: Account[]) => this.accounts = accounts);
    });
  }

  public ngOnDestroy(): void {
    this.accountsChangedSubscription.unsubscribe();
  }

  public doOnBtAddClick(): void {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute});
  }

  public doOnBtRefreshClick(): void {
    this.accountService.getList().subscribe((accounts: Account[]) => this.accounts = accounts);
  }

}
