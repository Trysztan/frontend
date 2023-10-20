import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './users.page';

const routes: Routes = [
  {
    path: '',
    component: UsersPage,
    children: [
      {
        path: 'list',
        loadChildren: () => import('./users-list/users-list.module').then( m => m.UsersListPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
      },
    
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
