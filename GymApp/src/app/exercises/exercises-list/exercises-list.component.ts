import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { User } from 'src/app/global/models/user.model';
import { AuthService } from 'src/app/global/services/User/auth.service';
import { ExercisesListItemComponent } from './exercises-list-item/exercises-list-item.component';
import { Router } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss'],
  imports :[
    IonicModule,
    ExercisesListItemComponent
  ]
})
export class ExercisesListComponent  implements OnInit {
  loginedUser?: User;

  constructor(
    private authService:AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.authService.loginedUser.subscribe(user=>
      {
        if(user)
        this.loginedUser = user;
        console.log(this.loginedUser)
      })
  }
}
