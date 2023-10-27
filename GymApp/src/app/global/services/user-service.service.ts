import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private _users = new BehaviorSubject<User[]>([]);


  get users() {
    return this._users.asObservable();
  }

  constructor(
    private http: HttpClient,
    ) {

   }


  fetchUser(){
    return this.http
    .get<{[key: number]:User}>(`${environment.baseUrl}/users/list`)
    .pipe(
      map(respData=>{
        const users: any[] = [];
        for(const key in respData){
          if(respData.hasOwnProperty(key)){
            users.push(
              new User(
                respData[key].id,
                respData[key].username,
                respData[key].email,
                respData[key].password,
                respData[key].height,
                respData[key].weight,
                respData[key].imagePath,
                ))
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


  updateUser(newuser: any,selectedUser: any,file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', selectedUser.id);
    
    formData.append('username', newuser.username ? newuser.username : selectedUser.username);
  
    formData.append('email', newuser.email ? newuser.email : selectedUser.email);
  
    formData.append('password', newuser.password ? newuser.password : selectedUser.password);
  
    formData.append('height', newuser.height ? newuser.height.toString() : selectedUser.height.toString());
  
    formData.append('weight', newuser.weight ? newuser.weight.toString() : selectedUser.weight.toString());

    formData.append('imagePath', selectedUser.imagePath);

  

  return this.http.put(`${environment.baseUrl}/users`,formData)
  .pipe(
    tap(() => {
      this.fetchUser().subscribe();
    })
  );
}
  
  createUser(newuser: any,file: File) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', newuser.id);
      formData.append('username', newuser.username);
      formData.append('email', newuser.email);
      formData.append('password', newuser.password);
      formData.append('height', newuser.height.toString());
      formData.append('weight', newuser.weight.toString());
  
    return this.http
    .post(`${environment.baseUrl}/users/regist`, formData)
    .pipe(
      tap(() => {
        this.fetchUser().subscribe();
      })
    );
  }

  profilePic(userID: number): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/users/${userID}/profilepic`, { responseType: 'blob' });
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

