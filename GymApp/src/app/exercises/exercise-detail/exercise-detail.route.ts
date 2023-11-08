import { Routes } from '@angular/router';
import { ExerciseDetailComponent } from './exercise-detail.component';

export const exercise_detail_routes: Routes = [
  {
    path: '',
    component: ExerciseDetailComponent,
  },
  {
    path: ':id',
    loadComponent: () => 
    import('./exercise-detail.component').then((m) => m.ExerciseDetailComponent)
  },
];