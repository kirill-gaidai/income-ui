import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Credentials} from '../../models/credentials.model';
import {Subscription} from 'rxjs/Subscription';
import {Authentication} from '../../models/authentication.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public loginForm: FormGroup;

  private authenticationSubjectSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'login': new FormControl('', []),
      'password': new FormControl('', [])
    });
    this.authenticationSubjectSubscription = this.authService.authenticationSubject.subscribe((authentication: Authentication) => {
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy(): void {
    this.authenticationSubjectSubscription.unsubscribe();
  }

  doOnBtLoginClick(): void {
    this.authService.login(new Credentials(
      this.loginForm.get('login').value,
      this.loginForm.get('password').value
    ));
  }

}
