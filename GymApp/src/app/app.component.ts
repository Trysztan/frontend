import { Component, OnInit } from '@angular/core';
import { AuthComponent } from './auth/auth.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './global/services/auth.service';
import { User } from './global/models/user.model';
import { UserServiceService } from './global/services/user-service.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    HttpClientModule,
    AuthComponent, 
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent implements OnInit{
  loginedUser?: User;
  profilePic: any;

  constructor(
    private authService: AuthService,
    private userService: UserServiceService,
    private router: Router
  ){}

  ngOnInit(){
    this.authService.loginedUser.subscribe(user=>{
      if(user)
      this.loginedUser = user;
      this.getUserPic()
    })
  }

  getUserPic(){
    if (this.loginedUser) {
      this.userService.profilePic(this.loginedUser.id).subscribe((image) => {
        this.profilePic = URL.createObjectURL(image);
        console.log(this.profilePic)
      });
    }
  }
  onLogin(){
    this.router.navigateByUrl('/login');
  }
  toUsersPage(){
    this.router.navigateByUrl('/users');

  }

  toExercise(){
    this.router.navigateByUrl('/exercises');

  }
  onLogout(){
    this.authService.logout();
    this.loginedUser = undefined
    this.profilePic = undefined
    this.router.navigateByUrl('/login');
  }
}
