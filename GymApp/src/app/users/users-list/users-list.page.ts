import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/global/models/user.model';
import { UserService } from '../../global/services/User/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class UsersListPage implements OnInit,OnDestroy {
  users: User[]=[];
  id: number = this.users.length;
  isLoading = false;
  isUpdate: boolean = false;
  updatedId: number = 0;
  private userSub?: Subscription;
  imagePath="https://ionicframework.com/docs/img/demos/avatar.svg"


  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userSub=this.userService.users.subscribe(users => {
      this.users = users;
    });
  }

    ionViewWillEnter() {
    this.isLoading = true;
    this.userService.fetchUser().subscribe(() => {
      this.isLoading = false;
    });
  }

  updateSession(userId: number){
    this.updatedId === 0 ? this.updatedId = userId : this.updatedId = 0;
    this.isUpdate ? this.isUpdate = false : this.isUpdate = true;
    this.router.navigate(['/users', userId]);
  }


  userProfile(userId: number){
    this.router.navigate(['/users', userId]);
  }

  ngOnDestroy(){
    if(this.userSub){
    this.userSub?.unsubscribe();
    }
  }

}
