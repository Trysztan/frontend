import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { catchError, finalize, throwError } from 'rxjs';
import { GlobalModule } from 'src/app/global/global.module';
import { Exercise } from 'src/app/global/models/exercise.model';
import { ExerciseService } from 'src/app/global/services/Exercise/exercise.service';

@Component({
  standalone: true,
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss'],
  imports:[
    IonicModule,
    CommonModule,
    GlobalModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ExerciseDetailComponent  implements OnInit {
  selectedExercise?: Exercise

  isNameUpdate?: boolean = false;
  isExerciseUpdated?: boolean = false;
  name?: string;
  isSwitchFirstCategory?: boolean = false;
  isSwitchSecondCategory? :boolean = false;
  isCardio: boolean = false;
  buttontext="Select Category"
  buttontext2="Select Second Category"
  secondcategories?: Array<string> =[];
  firstcategories?: Array<string> =[];
  categories?: Array<string> =[];
  form!: FormGroup<any>;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private exerciseService: ExerciseService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let selectedExerciseId = +params['id'];
        this.exerciseService.getExercise(selectedExerciseId).subscribe(exercise =>{
          this.selectedExercise = exercise;
        })
    })

    this.form = new FormGroup({
      distance: new FormControl(this.selectedExercise?.distance, {
        updateOn: 'blur',
      }),
      weight: new FormControl(this.selectedExercise?.weight, {
        updateOn: 'blur',
      }),
      rep: new FormControl(this.selectedExercise?.repetitions, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      set: new FormControl(this.selectedExercise?.sets, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  saveExercise(){
    console.log(this.selectedExercise)
    if(this.form.valid && this.isCardio && this.selectedExercise){
      this.selectedExercise.repetitions = this.form.value.rep
      this.selectedExercise.sets = this.form.value.set
      this.selectedExercise.distance = this.form.value.distance

    }else if(this.form.valid && !this.isCardio && this.selectedExercise){
      this.selectedExercise.repetitions = this.form.value.rep
      this.selectedExercise.sets = this.form.value.set
      this.selectedExercise.weight = this.form.value.weight
    }
    this.loadingCtrl
    .create({
      message: 'Updating exercise...'
    })
    .then(loadingEl => {
      loadingEl.present();
      if(this.selectedExercise)
       this.exerciseService.updateExercise(this.selectedExercise).subscribe(()=>{
        this.router.navigate(['/exercises/list']);
        loadingEl.dismiss();
      })
    });
  }

  deleteExercise(){
    this.loadingCtrl
    .create({
      message: 'Delete exercise...'
    })
    .then(loadingEl => {
      loadingEl.present();
      if(this.selectedExercise)
       this.exerciseService.deleteExercise(this.selectedExercise.id).subscribe(()=>{
        this.router.navigate(['/exercises/list']);
        loadingEl.dismiss();
      })
    });
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

  isUpdateExerciseName(){
    this.isNameUpdate ? this.isNameUpdate = false : this.isNameUpdate = true 
  }

  updateExerciseName(){
    this.isExerciseUpdated=true;
    if(this.selectedExercise && this.name){
      this.selectedExercise.name = this.name;
    this.isNameUpdate=false;
    }
  }

  onSelectedCategory(category: string) {
    if(category === "Cardio"){
      this.isCardio=true
    }else{
      this.isCardio=false
    }
    if(this.selectedExercise)
    this.selectedExercise.first_category = category;
    this.exerciseService.getSecondCategories(category).subscribe(seccat =>{
      this.secondcategories = seccat
    })
    this.isSwitchFirstCategory ? this.isSwitchFirstCategory=false : this.isSwitchFirstCategory= true;
    this.isExerciseUpdated=true;
  }

  onSelectedSecondCategory(category: string) {
    if(this.selectedExercise)
    this.selectedExercise.second_category = category;
    this.isSwitchSecondCategory ?  this.isSwitchSecondCategory=false : this.isSwitchSecondCategory=true;
    this.isExerciseUpdated=true;
  }
}
