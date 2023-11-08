import { Routes, RouterModule } from '@angular/router';
import { ExercisesListComponent } from './exercises-list.component';
import { ExercisesListItemComponent } from './exercises-list-item/exercises-list-item.component';

export const exercise_list_routes: Routes = [
  {
    path: '',
    component: ExercisesListItemComponent,
  },
  {
    path: 'create',
    loadComponent: () => 
    import('./create-exercises-list/create-exercises-list.component').then((m) => m.CreateExercisesListComponent)
  },
  {
    path: 'detail',
    loadChildren: () => 
    import('./list-detail/list-detail.route').then((m) => m.exercise_list_detail_routes)
  },
];