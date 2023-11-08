import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { catchError, finalize, throwError } from 'rxjs';
import { GlobalModule } from 'src/app/global/global.module';
import { ExerciseList } from 'src/app/global/models/exercise-list.model';
import { Exercise } from 'src/app/global/models/exercise.model';
import { User } from 'src/app/global/models/user.model';
import { AuthService } from 'src/app/global/services/User/auth.service';
import { ExerciseListService } from 'src/app/global/services/Exercise/exercise-list.service';
import { ExerciseService } from 'src/app/global/services/Exercise/exercise.service';

@Component({
  standalone: true,
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GlobalModule,
  ],
})
export class CreateExerciseComponent  implements OnInit {
  selectedExerciseList?: any;
  selectedCategory?: string ;
  selectedSecondCategory?: string; 
  isSelectedCategory: boolean = false;
  isSelectedSecondCategory: boolean = false;
  buttontext="Select Category";
  buttontext2="Select Second Category";
  categories: Array<string> =[];
  secondcategories: Array<string> =[];
  form!: FormGroup<any>;
  isCardio: boolean = false;
  loginedUser?: User ;
  name?: string;
  exercisesArray?: Array<Exercise>=[];

  @Output() udateList = new EventEmitter<ExerciseList>();


  constructor(
    private authService: AuthService,
    private exerciseService: ExerciseService,
    private router: Router,
    private route: ActivatedRoute,
    private exerciseListService: ExerciseListService,
    private loadingCtrl: LoadingController,
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(3)]
      }),
      pr: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      distance: new FormControl(null, {
        updateOn: 'blur',
      }),
      weight: new FormControl(null, {
        updateOn: 'blur',
      }),
      rep: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      set: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
    this.form.disable();

    this.authService.loginedUser.subscribe(user=>
      {
        if(user)
        this.loginedUser = user;
        console.log(this.loginedUser)
      })

      this.route.params.subscribe(params => {
        if(params){
        let selectedExerciseId = +params['id'];
          this.exerciseListService.getMyList(selectedExerciseId).subscribe(exerciseList =>{
            this.selectedExerciseList = exerciseList;
          })
        }
      })

    this.exerciseService.getCategories().subscribe(cat =>{
      this.categories = cat
    })
    this.exercisesArray = this.exerciseListService.getExercises()
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

  onCreateExercise(){
    this.isCardio=false;
    if (!this.form?.valid) {
      return;
    }
    if(this.loginedUser)
    {
    const id = Math.floor(Math.random() * (100000000 - 1 + 1)) + 1;
    const exercise = new Exercise(
      id,
      this.form?.value.name,
      this.selectedCategory===undefined ? "": this.selectedCategory,
      this.form?.value.pr,
      this.loginedUser,
      this.selectedSecondCategory===undefined ? "": this.selectedSecondCategory,
      this.form?.value.rep,
      this.form?.value.set,
      this.form?.value.weight,
      this.form?.value.distance,
    );
    this.loadingCtrl
      .create({
        message: 'Creating exercise...'
      })
      .then(loadingEl => {
        loadingEl.present();
         this.exerciseListService.addExercise(exercise)
        this.exerciseListService.creatingArraySession()

        this.clearTheFrom()

        this.router.navigate(['/exercises/list/create']);
        loadingEl.dismiss();
          });
        }
  }
  onCreateExerciseToList(){
    this.isCardio=false;
    if (!this.form?.valid) {
      return;
    }
    if(this.selectedExerciseList && this.selectedCategory && this.selectedSecondCategory){
    const id = Math.floor(Math.random() * (100000000 - 1 + 1)) + 1;
    const exercise = new Exercise(
      id,
      this.form?.value.name,
      this.selectedCategory,
      this.form?.value.pr,
      this.loginedUser ? this.loginedUser: this.selectedExerciseList.creator,
      this.selectedSecondCategory,
      this.form?.value.rep,
      this.form?.value.set,
      this.form?.value.weight,
      this.form?.value.distance,
    );
    this.loadingCtrl
      .create({
        message: 'Add exercise to list...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.selectedExerciseList.exercises.push(exercise)
        loadingEl.dismiss();
        this.exerciseListService.updateExerciseList(this.selectedExerciseList)
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
          this.router.navigate(['exercises','list','detail',this.selectedExerciseList.id]);
          this.clearTheFrom()
          console.log("Hozzáadva a listához")
        });
      });
    }
  }

  clearTheFrom(){
    this.selectedExerciseList=undefined;
    this.selectedCategory=undefined;
    this.selectedSecondCategory =undefined
    this.isSelectedCategory= false;
    this.isSelectedSecondCategory= false;
    this.form?.reset();
    this.form?.disable();
  }
}
