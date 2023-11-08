import { Injectable } from '@angular/core';
import { Exercise } from '../../models/exercise.model';
import { ExerciseList } from '../../models/exercise-list.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { AuthService } from '../User/auth.service';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseListService {
  private _exerciseList = new BehaviorSubject<ExerciseList[]>([]);
  private cexercises: Array<Exercise> = [];
  private cexerciseList?: ExerciseList;
  private _loginedUser?: User | null;

  get exerciseList() {
    return this._exerciseList.asObservable();
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    const savedList = localStorage.getItem('list');
    if (savedList) {
      this.cexerciseList = JSON.parse(savedList);
    }
    const savedArray = localStorage.getItem('exercises');
    if (savedArray) {
      this.cexercises = JSON.parse(savedArray);
    }
    console.log("contructor");
   }


  fetchExerciseList(){
    console.log("valami")
    return this.http
    .get<{[key: number]:ExerciseList}>(`${environment.baseUrl}/exercise_list/listmyexerciselist/${58}`)
    .pipe(
      map(respData=>{
        const exerciseList: any[] = [];
        for(const key in respData){
          if(respData.hasOwnProperty(key)){
            exerciseList.push(
              new ExerciseList(
                respData[key].id,
                respData[key].name,
                respData[key].first_category,
                respData[key].second_category,
                respData[key].creator,
                respData[key].exercises,
                ))
          }
        }
        return exerciseList;
      }),
      tap(exerciseListFecth =>{
        this._exerciseList.next(exerciseListFecth)
      })
    );
    }

    getMyList(exerciseListId: number){
      return this.http.
      get(`${environment.baseUrl}/exercise_list/getlist/${exerciseListId}`)
    }
  

  addExercise(exercise: Exercise) {
    this.cexercises.push(exercise);
    this.cexerciseList?.exercises.push(exercise)

  }

  getExercises() {
    return this.cexercises;
  }

  getCreatingList(){
    return this.cexerciseList
  }

  createListSession(list: ExerciseList){
    localStorage.removeItem('list');
    localStorage.setItem('list', JSON.stringify(list));
  }

  creatingArraySession(){
    localStorage.removeItem('exercises');
    localStorage.setItem('exercises', JSON.stringify(this.cexercises));
  }

  deleteSession(){
    localStorage.removeItem('exercises');
    localStorage.removeItem('list');
    this.cexerciseList = undefined;
    this.cexercises = []
  }

  dropExercise(exercise:Exercise){
    this.cexercises = this.cexercises.filter(e => e !== exercise);
    if(this.cexerciseList?.exercises){
    this.cexerciseList.exercises = this.cexerciseList?.exercises.filter(e=>e !== exercise)
    this.createListSession(this.cexerciseList)
    }
    this.creatingArraySession()
  }
  saveExerciseList(exerciseList: ExerciseList){
    localStorage.removeItem('list');
    return this.http
    .post(`${environment.baseUrl}/exercise_list/save/${exerciseList.creator.id}`, exerciseList)
    .pipe(
      tap(() => {
        this.fetchExerciseList().subscribe();
      })
    );
  }

  updateExerciseList(exerciseList: ExerciseList){
    return this.http
    .put(`${environment.baseUrl}/exercise_list/update/${exerciseList.creator.id}`, exerciseList)
  }

  deletExerciseList(exerciseListid: number){
    localStorage.removeItem('list');
    return this.http
    .delete(`${environment.baseUrl}/exercise_list/delete/${exerciseListid}`)
    .pipe(
      tap(() => {
        this.fetchExerciseList().subscribe();
      })
    );
  }
}