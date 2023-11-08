import { Routes } from '@angular/router';
import { ListDetailComponent } from './list-detail.component';

export const exercise_list_detail_routes: Routes = [
  {
    path: '',
    component: ListDetailComponent,
  },
  {
    path: ':id',
    loadComponent: () => 
    import('./list-detail.component').then((m) => m.ListDetailComponent)
  },
];