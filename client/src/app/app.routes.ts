import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Register } from './register/register';
import { authGuard } from './auth-guard';
import { Notes } from './notes/notes';
import { Watchlist } from './watchlist/watchlist';
import { Books } from './books/books';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard], 
  },
  {
    path: 'notes',
    component: Notes,
    canActivate: [authGuard], 
  },

  {
    path: 'watchlist',
    component: Watchlist,
    canActivate: [authGuard],
  },

  {
    path: 'books',
    component: Books,
    canActivate: [authGuard],
  },
  
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
