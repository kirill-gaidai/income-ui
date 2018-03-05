import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Credentials} from '../models/credentials.model';
import {Authentication} from '../models/authentication.model';
import {Headers, Http, Response} from '@angular/http';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class AuthService implements OnInit, OnDestroy {

  private LOGIN_URL = 'http://192.168.56.1:8080/login';
  private LOGOUT_URL = 'http://192.168.56.1:8080/logout';

  public authentication: Authentication = new Authentication(null, null, null);

  public authenticationSubject: Subject<Authentication> = new Subject<Authentication>();

  constructor(private http: Http) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  login(credentials: Credentials): void {
    this.http.post(this.LOGIN_URL, credentials).subscribe((response: Response) => {
      const result = response.json();
      result.expires = new Date(result.expires);
      this.authentication = result;
      this.authentication.login = credentials.login;
      this.authenticationSubject.next(this.authentication);
    });
  }

  logout(): void {
    const headers: Headers = new Headers();
    if (this.authentication.token) {
      headers.append('token', this.authentication.token);
    }
    this.http.get(this.LOGOUT_URL, {
      headers: headers
    }).subscribe((response: Response) => {
      this.authentication = new Authentication(null, null, null);
      this.authenticationSubject.next(this.authentication);
    });
  }

  isAuthenticated(): boolean {
    const now: Date = new Date();
    return this.authentication.expires !== null && now < this.authentication.expires
      && this.authentication.token !== null && this.authentication.token !== '';
  }

}
