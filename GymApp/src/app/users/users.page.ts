import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserServiceService } from '../global/services/user-service.service';
import { User } from '../global/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
  users: User[]=[];
  id: number = this.users.length;
  isLoading = false;
  isUpdate: boolean = false;
  updatedId: number = 0;
  private userSub?: Subscription;
  
  constructor(
    private userService: UserServiceService
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
  }

  updateUser(form: NgForm,user: User){
    if (!form.valid) {
      return;
    }
    const username = form.value.Username;
    const newuser = new User(user.id,username);
    this.userService.updateUser(newuser).subscribe(
      ()=>{
        this.isUpdate=false;
        console.log("User updated:", newuser)
      },
      (error) =>{
        console.log("Update error: ", error);
      }
      );
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.Username;
    const newuser = new User(this.id++,username);
      this.userService.createUser(newuser).subscribe(
        () => {
          console.log("User created:", newuser);
        },
        (error) => {
          console.error("Error creating user:", error);
        }
      );    
  }
  deleteUser(userId: number){
    this.userService.deleteUser(userId).subscribe(
      ()=>{
        console.log("User deleted!");
    },
    () =>{
      console.error("Error!");
    }
    )
  }

  ngOnDestroy(){
    if(this.userSub){
    this.userSub?.unsubscribe();
    }
  }
}
