import { Routes, RouterModule } from '@angular/router';
import { ExercisesComponent } from './exercises.component';

export const exercises_routes: Routes = [
  {
    path: '',
    component: ExercisesComponent,
     children: [
      {
        path: 'create',
       loadChildren: () => 
        import('./create-exercise/create-exercise.route').then((m) => m.create_exercise_routes)
      },
      {
        path: 'detail',
        loadChildren: () => 
        import('./exercise-detail/exercise-detail.route').then((m) => m.exercise_detail_routes)
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

