import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-exercises-list-item',
  templateUrl: './exercises-list-item.component.html',
  styleUrls: ['./exercises-list-item.component.scss'],
  imports:[
    IonicModule
  ]
})
export class ExercisesListItemComponent  implements OnInit {

  constructor(
    private router: Router
  ) 
  { }

  ngOnInit() {}
  
  toCreateNewExerciseList(){
    this.router.navigateByUrl("/exercises/list/create")
  }

}
