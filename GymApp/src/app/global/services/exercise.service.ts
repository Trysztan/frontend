import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercise.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(
    private http: HttpClient
  ) { }

  getCategories(){
    return this.http
    .get<string[]>(`${environment.baseUrl}/category/first_cat`)
  }

  getSecondCategories(fc: string){
    return this.http
    .get<string[]>(`${environment.baseUrl}/category/second_cat/${fc}`)
  }

  createExercise(exercise: Exercise){
    return this.http
    .post(`${environment.baseUrl}/exercise/save/${exercise.creator_id}`, exercise)
  }
  
}
