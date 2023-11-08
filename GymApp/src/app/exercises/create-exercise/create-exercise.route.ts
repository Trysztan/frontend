import { Routes } from '@angular/router';
import { CreateExerciseComponent } from './create-exercise.component';

export const create_exercise_routes: Routes = [
  {
    path: '',
    component: CreateExerciseComponent,
  },
  {
    path: ':id',
    loadComponent: () => 
    import('./create-exercise.component').then((m) => m.CreateExerciseComponent)
  },
];