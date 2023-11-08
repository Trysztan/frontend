import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ExerciseList } from 'src/app/global/models/exercise-list.model';
import { Exercise } from 'src/app/global/models/exercise.model';
import { ExerciseListService } from 'src/app/global/services/Exercise/exercise-list.service';
import { ExerciseService } from 'src/app/global/services/Exercise/exercise.service';

@Component({
  standalone: true,
  selector: 'app-exercise-item',
  templateUrl: './exercise-item.component.html',
  styleUrls: ['./exercise-item.component.scss'],
  imports:[
    IonicModule,
    CommonModule
  ]
})
export class ExerciseItemComponent  implements OnInit {
  @Input() exercise?: Exercise
  @Input() selectedList?: ExerciseList


  constructor(
    private exerciseListService: ExerciseListService,
    private router: Router,
    private exerciseService: ExerciseService
  ) { }

  ngOnInit() {
  }

  exerciseUpdate(exercise: Exercise,selectedList: ExerciseList){

    this.exerciseListService.updateExerciseList(selectedList)
    .subscribe(() => {
      this.router.navigate(["exercises", "detail", exercise.id]);
    });
  
  this.router.navigate(["exercises", "detail", exercise.id]);
  }

  exerciseRemove(exercise: Exercise,selectedList: ExerciseList){
    const index = selectedList.exercises.indexOf(exercise);

    selectedList.exercises.splice(index,1)
    this.exerciseService.deleteExercise(exercise.id)
    .subscribe(() => {
    });

    if(selectedList.exercises.length){
    this.exerciseListService.updateExerciseList(selectedList)
    .subscribe(() => {
    });
  }else{
    this.exerciseListService.updateExerciseList(selectedList)
    .subscribe(() => {
      this.router.navigate(["exercises", "list"]);
    });
  }
  }

}
