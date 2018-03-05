import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {Authentication} from '../models/authentication.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public login: string = null;

  private authenticationSubjectSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authenticationSubjectSubscription = this.authService.authenticationSubject.subscribe((authentication: Authentication) => {
      this.login = authentication.login;
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy(): void {
    this.authenticationSubjectSubscription.unsubscribe();
  }

  doOnBtLogoutClick(): void {
    this.authService.logout();
  }

}
