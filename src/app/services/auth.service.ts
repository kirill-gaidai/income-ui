import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';

import {Subject} from 'rxjs/Subject';
import 'rxjs/Rx';

import {Credentials} from '../models/credentials.model';
import {Authentication} from '../models/authentication.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit, OnDestroy {

  private LOGIN_URL = 'http://192.168.56.1:8080/login';
  private LOGOUT_URL = 'http://192.168.56.1:8080/logout';

  // private LOGIN_URL = '/login';
  // private LOGOUT_URL = '/logout';

  public authentication: Authentication = new Authentication(null, null, null);

  public authenticationSubject: Subject<Authentication> = new Subject<Authentication>();

  constructor(private http: Http) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  login(credentials: Credentials): Observable<void> {
    return this.http.post(this.LOGIN_URL, credentials).map((response: Response) => {
      const result = response.json();
      result.expires = new Date(result.expires);
      this.authentication = result;
      this.authentication.login = credentials.login;
      this.authenticationSubject.next(this.authentication);
    });
  }

  logout(): Observable<void> {
    const headers: Headers = new Headers();
    if (this.authentication.token) {
      headers.append('token', this.authentication.token);
    }
    return this.http.get(this.LOGOUT_URL, {
      headers: headers
    }).map((response: Response) => {
      this.authentication = new Authentication(null, null, null);
      this.authenticationSubject.next(this.authentication);
    });
  }

}
