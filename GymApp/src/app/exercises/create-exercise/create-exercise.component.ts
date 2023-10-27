import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { catchError, finalize, throwError } from 'rxjs';
import { GlobalModule } from 'src/app/global/global.module';
import { Exercise } from 'src/app/global/models/exercise.model';
import { User } from 'src/app/global/models/user.model';
import { AuthService } from 'src/app/global/services/auth.service';
import { ExerciseService } from 'src/app/global/services/exercise.service';

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
  exercisesArray?: Array<Exercise>

  constructor(
    private authService: AuthService,
    private exerciseService: ExerciseService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
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
        validators: [Validators.required]
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

    this.exerciseService.getCategories().subscribe(cat =>{
      this.categories = cat
    })
    this.route.queryParams.subscribe(params => {
       this.exercisesArray= JSON.parse(params['exercises']);
       console.log(this.exercisesArray)
    });
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

    this.loadingCtrl
      .create({
        message: 'Creating Exercise...'
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
