import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExercisesListComponent } from './exercises-list/exercises-list.component';


@Component({
  standalone: true,
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
  imports: [
    IonicModule,
  ],
})
export class ExercisesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
