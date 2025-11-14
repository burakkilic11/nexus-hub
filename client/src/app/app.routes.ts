// client/src/app/app.routes.ts

import { Routes } from '@angular/router';
import { Login } from './login/login'; 
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth-guard';
import { Register } from './register/register';
import { Notes } from './notes/notes';

export const routes: Routes = [
  
  // Rota 1: /login URL'ine gidildiğinde
  {
    path: 'login',
    component: Login,
  },
  
  // Rota 2: /dashboard URL'ine gidildiğinde
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  
  // Rota 3: Ana URL'e (localhost:4200/) gidildiğinde
  // kullanıcıyı otomatik olarak /login sayfasına yönlendir.
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full', // 'tam' eşleşme olmalı
  },

  // Rota 4: /register'a gidildiğinde
  {
    path:'register',
    component: Register,
  },

  {
    path: 'notes',
    component: Notes,
    canActivate: [authGuard], // Korumalı (Dashboard gibi)
  },
];
