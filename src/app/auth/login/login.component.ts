import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
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

  public errorMessage = '';
  public loginForm: FormGroup;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'login': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  ngOnDestroy(): void {
  }

  doOnBtLoginClick(): void {
    this.authService.login(new Credentials(
      this.loginForm.get('login').value,
      this.loginForm.get('password').value
    )).subscribe(() => {
      this.router.navigate(['/']);
    }, (response: Response) => {
      if (response.status === 403) {
        this.errorMessage = 'Неверный логин или пароль';
        return;
      }
      this.errorMessage = 'Неизвестная ошибка';
    });
  }

}
