// client/src/app/app.routes.ts

import { Routes } from '@angular/router';

// YENİ EKLENDİ: Oluşturduğumuz iki component'i 'import' ediyoruz
import { Login } from './login/login'; 
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth-guard';

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
  
  // Gelecekte bir "404 Not Found" sayfası da ekleyeceğiz
];
