import { Injectable, Injector } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInUserSubject:  BehaviorSubject<User | null>;
  private localStorageKey = 'loggedInUser';

  constructor(
    private http: HttpClient
  ) 
  {
    const storedUser = localStorage.getItem(this.localStorageKey);
    this.loggedInUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
  }


    get loginedUser():Observable<User | null>{
      return this.loggedInUserSubject?.asObservable();
      
    }


//   login(username: string, password: string){

//   this.http.get<User>(`${environment.baseUrl}/users/login/${username}/${password}`)
//   .subscribe(logined =>{
//     this.loggedInUserSubject?.next(logined);
//     localStorage.setItem(this.localStorageKey, JSON.stringify(logined));
//   })
// }

login(username: string, password: string): Observable<boolean> {
  return this.http.get<User>(`${environment.baseUrl}/users/login/${username}/${password}`)
    .pipe(map(user => {
      this.loggedInUserSubject?.next(user);
      localStorage.setItem(this.localStorageKey, JSON.stringify(user));
      return true; // A bejelentkezés sikeres volt
    }))
    .pipe(catchError(() => {
      return of(false); // A bejelentkezés sikertelen volt
    }));
}

  logout() {
    this.loggedInUserSubject?.next(null);
    localStorage.removeItem(this.localStorageKey);

  }
}
