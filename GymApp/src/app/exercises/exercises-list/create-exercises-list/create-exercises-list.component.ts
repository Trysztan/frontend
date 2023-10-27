  import { CommonModule } from '@angular/common';
  import { Component, OnInit } from '@angular/core';
  import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router } from '@angular/router';
  import { IonicModule, LoadingController } from '@ionic/angular';
  import { catchError, finalize, throwError } from 'rxjs';
  import { GlobalModule } from 'src/app/global/global.module';
  import { Exercise } from 'src/app/global/models/exercise.model';
  import { User } from 'src/app/global/models/user.model';
  import { AuthService } from 'src/app/global/services/auth.service';
  import { ExerciseService } from 'src/app/global/services/exercise.service';
import { ExerciseItemComponent } from '../exercise-item/exercise-item.component';
  
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
    exercises?: Array<any>
    name?: string;

  
    constructor(
      private authService: AuthService,
      private exerciseService: ExerciseService,
      private router: Router,
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
          console.log(this.loginedUser)
        })
  
      this.exerciseService.getCategories().subscribe(cat =>{
        this.categories = cat
      })
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
      this.router.navigate(['/exercise/create'], { queryParams: { exercises: JSON.stringify(this.exercises) } });
    }
    
    onCreateExercise(){
      this.isCardio=false;
      if (!this.form?.valid) {
        return;
      }
      
      const exercise = new Exercise(
        this.form?.value.name,
        this.selectedCategory===undefined ? "": this.selectedCategory,
        this.form?.value.pr,
        this.loginedUser ? this.loginedUser.id : 58,
        this.selectedSecondCategory===undefined ? "": this.selectedSecondCategory,
        this.form?.value.rep,
        this.form?.value.set,
        this.form?.value.weight,
        this.form?.value.distance,
      );
        console.log(exercise)
      this.loadingCtrl
        .create({
          message: 'Creating exercise...'
        })
        .then(loadingEl => {
          loadingEl.present();
          this.exerciseService
            .createExercise(exercise)
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
              this.selectedCategory= undefined;
              this.selectedSecondCategory= undefined;
              this.form?.reset();
              this.form?.disable();
              this.router.navigate(['/exercise/list/create']);
            });
        });
    }
    
    
  }
  