import { Routes, RouterModule } from '@angular/router';
import { ExercisesComponent } from './exercises.component';

export const exercises_routes: Routes = [
  {
    path: '',
    component: ExercisesComponent,
     children: [
      {
        path: 'create',
       loadComponent: () => 
        import('./create-exercise/create-exercise.component').then((m) => m.CreateExerciseComponent)
      },
      {
        path: 'list',
        loadChildren: () =>
        import('./exercises-list/exercise-list.route').then(
          (m) => m.exercise_list_routes
        ),
     }

     ]
  },
];

