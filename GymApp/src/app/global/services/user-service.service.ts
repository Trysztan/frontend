import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  // private usersSubject = new BehaviorSubject<any[]>([]);
  // users$ = this.usersSubject.asObservable();
  private _users = new BehaviorSubject<User[]>([]);
  private deletedUser?: User | null = null;
  private deletionTimer: any;

  get users() {
    return this._users.asObservable();
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
    // this.getUsers().subscribe(users => {
    //   this.usersSubject.next(users);
    // });
   }


  //   getUsers(): Observable<any[]> {
  //   return this.http
  //     .get<any[]>(`${environment.baseUrl}/users`)
  //     .pipe(
  //       map(users => {
  //         return users.map(user => ({
  //           id: user.id,
  //           username: user.username
  //         }));
  //       })
  //     );
  // }

  fetchUser(){
    return this.http
    .get<{[key: number]:User}>(`${environment.baseUrl}/users`)
    .pipe(
      map(respData=>{
        const users = [];
        for(const key in respData){
          if(respData.hasOwnProperty(key)){
            users.push(new User(respData[key].id,respData[key].username))
          }
        }
        return users;
      }),
      tap(users =>{
        this._users.next(users)
      })
    );
  }

  getUserById(userId: number){
    return this.http.get(`${environment.baseUrl}/users/${userId}`);
  }

  updateUser(user: User){
    return this.http.put(`${environment.baseUrl}/users`,user,this.httpOptions)
    .pipe(
      tap(() => {
        this.fetchUser().subscribe();
      })
    );
  }
  
  createUser(newUser: any) {
    return this.http
    .post(`${environment.baseUrl}/users`, newUser,this.httpOptions)
    .pipe(
      tap(() => {
        this.fetchUser().subscribe();
      })
    );
  }

  deleteUser(userID: number){
    return this.http.delete(`${environment.baseUrl}/users/${userID}`)
    .pipe(
      tap(() => {
        this.fetchUser().subscribe();
      })
    );
  }
}

