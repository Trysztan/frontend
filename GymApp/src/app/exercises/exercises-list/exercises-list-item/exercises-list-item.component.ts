import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonAccordionGroup, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ExerciseList } from 'src/app/global/models/exercise-list.model';
import { ExerciseListService } from 'src/app/global/services/Exercise/exercise-list.service';
import { ExerciseItemComponent } from "../exercise-item/exercise-item.component";

@Component({
    standalone: true,
    selector: 'app-exercises-list-item',
    templateUrl: './exercises-list-item.component.html',
    styleUrls: ['./exercises-list-item.component.scss'],
    imports: [
        IonicModule,
        CommonModule,
        ExerciseItemComponent
    ]
})
export class ExercisesListItemComponent  implements OnInit,OnDestroy {
  exerciseListFetch?: Array<ExerciseList>;
  isLoading?: boolean=false;
  private exerciseLSub?: Subscription;
  @ViewChild('exerciseList', { static: true }) exerciseList?: IonAccordionGroup;



  constructor(
    private router: Router,
    private exerciseListService: ExerciseListService
  ) 
  {
   }

  ngOnInit() {
    this.exerciseLSub = this.exerciseListService.exerciseList.subscribe(exerciseListFecth =>{
      this.exerciseListFetch=exerciseListFecth
    })
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.exerciseListService.fetchExerciseList().subscribe(() => {
      this.isLoading = false;
    });
  }
  
  toCreateNewExerciseList(){
    this.router.navigateByUrl("/exercises/list/create")
  }

  toListDetail(exerciseList: ExerciseList){
    this.router.navigate(["exercises", "list" ,"detail", exerciseList.id])
  }

  ngOnDestroy(){
    this.exerciseLSub?.unsubscribe()
  }

}
