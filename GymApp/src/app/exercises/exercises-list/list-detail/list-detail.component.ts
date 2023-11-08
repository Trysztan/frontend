import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GlobalModule } from 'src/app/global/global.module';
import { Exercise } from 'src/app/global/models/exercise.model';
import { ExerciseListService } from 'src/app/global/services/Exercise/exercise-list.service';
import { ExerciseService } from 'src/app/global/services/Exercise/exercise.service';

@Component({
  standalone:true,
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss'],
  imports:[
    IonicModule,
    CommonModule,
    GlobalModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ListDetailComponent  implements OnInit {
  selectedList?: any;
  isNameUpdate?: boolean = false;
  isListUpdated?: boolean = false;
  name?: string;
  isSwitchFirstCategory?: boolean = false;
  isSwitchSecondCategory? :boolean = false;
  isCardio: boolean = false;
  buttontext="Select Category"
  buttontext2="Select Second Category"
  secondcategories?: Array<string> =[];
  firstcategories?: Array<string> =[];
  categories?: Array<string> =[];


  constructor(
    private route: ActivatedRoute,
    private exerciseListService: ExerciseListService,
    private exerciseService: ExerciseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let selectedList = +params['id'];
        this.exerciseListService.getMyList(selectedList).subscribe(list=>{
          this.selectedList = list;
        })
    })

}
  switchFirstCategory(){
    this.isSwitchFirstCategory? this.isSwitchFirstCategory= false : this.isSwitchFirstCategory= true;
    this.exerciseService.getCategories().subscribe(cat =>{
      this.categories = cat
    })
  }
  switchSecondCategory(){
    if(!this.isSwitchFirstCategory){
    this.isSwitchSecondCategory? this.isSwitchSecondCategory= false : this.isSwitchSecondCategory= true;
    }
  }

  isUpdateListName(){
    this.isNameUpdate ? this.isNameUpdate = false : this.isNameUpdate = true 
  }

  updateListName(){
    this.isListUpdated=true;
    this.selectedList.name = this.name
    this.isNameUpdate=false;
  }

  onOKButtonClicked(){
    this.router.navigate(["exercises", "list"])
  }

  exerciseUpdate(exercise: Exercise){
    if(this.isListUpdated){
    this.exerciseListService.updateExerciseList(this.selectedList)
    .subscribe(() => {
      this.isListUpdated=false;
      this.router.navigate(["exercises", "detail", exercise.id]);
    });
  }
  this.router.navigate(["exercises", "detail", exercise.id]);
  }

  exerciseRemove(exercise: Exercise){
    this.isListUpdated=true;
    const index = this.selectedList.exercises.indexOf(exercise);

    this.selectedList.exercises.splice(index,1)
    this.exerciseService.deleteExercise(exercise.id)
    .subscribe(() => {
    });

    if(this.selectedList.exercises.lenght){
    this.exerciseListService.updateExerciseList(this.selectedList)
    .subscribe(() => {
    });
  }else{
    this.exerciseListService.updateExerciseList(this.selectedList)
    .subscribe(() => {
      this.router.navigate(["exercises", "list"]);
    });
  }
  }

  onSelectedCategory(category: string) {
    if(category === "Cardio"){
      this.isCardio=true
    }else{
      this.isCardio=false
    }
    this.selectedList.first_category = category;
    this.exerciseService.getSecondCategories(category).subscribe(seccat =>{
      this.secondcategories = seccat
    })
    this.isSwitchFirstCategory ? this.isSwitchFirstCategory=false : this.isSwitchFirstCategory= true;
    this.isListUpdated=true;
  }

  onSelectedSecondCategory(category: string) {
    this.selectedList.second_category = category;
    this.isSwitchSecondCategory ?  this.isSwitchSecondCategory=false : this.isSwitchSecondCategory=true;
    this.isListUpdated=true;
  }
  saveExerciseList(){
    if(this.isListUpdated){
      this.exerciseListService.updateExerciseList(this.selectedList)
      .subscribe(() => {
        this.isListUpdated=false;
        this.router.navigate(["exercises", "list"]);
      });
    }
    this.router.navigate(["exercises", "list"]);
  }

  addNewExercise(){
    if(this.isListUpdated){
      this.exerciseListService.updateExerciseList(this.selectedList)
      .subscribe(() => {
        this.isListUpdated=false;
        this.router.navigate(["exercises", "create", this.selectedList.id]);
      });
    }
    this.router.navigate(["exercises", "create", this.selectedList.id]);
  }

  deletExerciseList(){
    this.exerciseListService.deletExerciseList(this.selectedList.id)
    .subscribe(() => {
      this.isListUpdated=false;
      this.router.navigate(["exercises", "list"]);
    });
  }
}
