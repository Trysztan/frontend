import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './users.page';
import { UserProfilePage } from './user-profile/user-profile.page';

export const users_routes: Routes = [
  {
    path: '',
    component: UsersPage,
    children: [
      {
        path: 'list',
        loadComponent: () => 
        import('./users-list/users-list.page').then((m) => m.UsersListPage)
      },
      {
         path: ':id',
        loadComponent: () => 
        import('./user-profile/user-profile.page').then((m) => m.UserProfilePage),       
    },
    
    ]
  },
];

