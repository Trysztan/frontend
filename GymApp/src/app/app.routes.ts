import { Routes } from "@angular/router";

export const routes: Routes= [{
    path: 'login',
    loadComponent: () => 
    import('./auth/auth.component').then((m) => m.AuthComponent),
},
{
    path: 'regist',
    loadComponent: () => 
    import('./regist/regist.page').then((m) => m.RegistPage),

},
 {
     path: 'users',
     loadChildren: () =>
     import('./users/users.routes').then(
       (m) => m.users_routes
     ),
 },
 {
    path: 'exercises',
    loadChildren: () =>
    import('./exercises/exercise.routes').then(
      (m) => m.exercises_routes
    ),
 }

]