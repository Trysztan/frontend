import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'abc';

  constructor(
    private http: HttpClient,
  ) { }

  get userIsAuthenticated(){
    return this._userIsAuthenticated;
  }

  get userId(){
    return this._userId;
  }

  login(username: string, password: string): Observable<any> {
    this._userIsAuthenticated = true;

    return this.http.get<User>(`${environment.baseUrl}/users/login/${username}/${password}`);
}

  logout() {
    this._userIsAuthenticated = false;
  }
}
