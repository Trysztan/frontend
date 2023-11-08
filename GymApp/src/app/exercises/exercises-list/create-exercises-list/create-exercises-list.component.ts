  import { CommonModule } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { IonicModule, LoadingController } from '@ionic/angular';
  import { catchError, finalize, of, throwError } from 'rxjs';
  import { GlobalModule } from 'src/app/global/global.module';
  import { Exercise } from 'src/app/global/models/exercise.model';
  import { User } from 'src/app/global/models/user.model';
  import { AuthService } from 'src/app/global/services/User/auth.service';
  import { ExerciseService } from 'src/app/global/services/Exercise/exercise.service';
import { ExerciseItemComponent } from '../exercise-item/exercise-item.component';
import { ExerciseListService } from 'src/app/global/services/Exercise/exercise-list.service';
import { ExerciseList } from 'src/app/global/models/exercise-list.model';
  
  @Component({
    standalone: true,
    selector: 'app-create-exercises-list',
    templateUrl: './create-exercises-list.component.html',
    styleUrls: ['./create-exercises-list.component.scss'],
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      ReactiveFormsModule,
      GlobalModule,
      ExerciseItemComponent
    ],
  })
  export class CreateExercisesListComponent  implements OnInit {
    selectedCategory?: string ;
    selectedSecondCategory?: string ;
    isSelectedCategory: boolean = false;
    isSelectedSecondCategory: boolean = false;
    buttontext="Select Category"
    buttontext2="Select Second Category"
    categories: Array<string> =[]
    secondcategories: Array<string> =[]
    form!: FormGroup<any>;
    isCardio: boolean = false;
    loginedUser?: User ;
    exercises?: Array<Exercise>=[];
    name?: string;
    creatingList?: ExerciseList

  
    constructor(
      private authService: AuthService,
      private exerciseService: ExerciseService,
      private router: Router,
      private exerciseListService: ExerciseListService,      
      private loadingCtrl: LoadingController
      ) { }
  
    ngOnInit() {
      this.form = new FormGroup({
        name: new FormControl( null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(3)]
        }),
      });
      this.form.disable();
  
      this.authService.loginedUser.subscribe(user=>
        {
          if(user)
          this.loginedUser = user;
        })
  
      this.exerciseService.getCategories().subscribe(cat =>{
        this.categories = cat
      })
      this.exercises = this.exerciseListService.getExercises()
      this.creatingList = this.exerciseListService.getCreatingList()
    }
  
    onSelectedCategory(category: string) {
      this.selectedCategory = category;
      if(this.selectedCategory === "Cardio"){
        this.isCardio=true
        this.form.enable()
      }else{
        this.isCardio=false
      }
      this.exerciseService.getSecondCategories(category).subscribe(seccat =>{
        this.secondcategories = seccat
      })
      this.isSelectedCategory ? this.isSelectedCategory=false : this.isSelectedCategory= true;
    }
  
    onSelectedSecondCategory(category: string) {
      this.selectedSecondCategory = category;
      this.isSelectedSecondCategory ?  this.isSelectedSecondCategory=false : this.isSelectedSecondCategory=true;
      this.form.enable()
    }
  
    switchUpdate(){
      this.isSelectedCategory ? this.isSelectedCategory=false : this.isSelectedCategory= true;
      this.selectedSecondCategory = undefined
    }
  
    switchSecondUpdate(){
      this.isSelectedSecondCategory ?  this.isSelectedSecondCategory=false : this.isSelectedSecondCategory=true;
    }
  
    addNewExercise(){
      if(this.loginedUser?.id){
        const id = Math.floor(Math.random() * (100000000 - 1 + 1)) + 1;

      var list = new ExerciseList(
        this.creatingList?.id ?  this.creatingList?.id:id,
        this.creatingList?.name || this.name || "" ,
        this.creatingList?.first_category || this.selectedCategory || "",
        this.creatingList?.second_category || this.selectedSecondCategory || "",
        this.loginedUser,
        this.exercises ? this.exercises : [],
        )
        console.log(list)
        this.exerciseListService.createListSession(list)
      }
      this.router.navigate(['/exercises/create']);
    }

    onCreateExerciseList(){
      this.isCardio=false;
      if (!this.form?.valid && !this.creatingList && !this.loginedUser) {
        return;
      }
       let exerciseList : any;
      const id = Math.floor(Math.random() * (100000000 - 1 + 1)) + 1;
      if(this.loginedUser){
       exerciseList = new ExerciseList(
        this.creatingList?.id ? this.creatingList?.id : id,
        this.creatingList?.name || this.name || "",
        this.creatingList?.first_category || this.selectedCategory || "",
        this.creatingList?.second_category || this.selectedSecondCategory || "",
        this.loginedUser,
        this.exercises ? this.exercises: [],
      );
      console.log(exerciseList)
      }
      this.loadingCtrl
        .create({
          message: 'Creating Exercise List...'
        })
        .then(loadingEl => {
          loadingEl.present();
          this.exerciseListService
            .saveExerciseList(exerciseList)
            .pipe(
              catchError(error => {
                console.error('Hiba történt:', error);
                return throwError(error);
              }),
              finalize(() => {
                loadingEl.dismiss();
              })
            )
            .subscribe(() => {
              this.createListReset()
              this.router.navigate(['/exercises/list']);
            });
        });
    }

    createListReset(){
      this.form?.reset();
      this.form?.disable();
      this.exerciseListService.deleteSession();
      this.exercises=[];
      this.creatingList= undefined;
      this.selectedCategory=undefined;
      this.selectedSecondCategory = undefined;
      this.isSelectedCategory = false;
      this.isSelectedSecondCategory = false;
    }
    
    onOKButtonClicked() {
      this.exercises=[];
      this.creatingList=undefined;
    }
  }
  