import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'marketplace',
    loadComponent: () => import('./features/marketplace/marketplace.component').then(m => m.MarketplaceComponent),
  },
  {
    path: 'skills/:slug',
    loadComponent: () => import('./features/skill-detail/skill-detail.component').then(m => m.SkillDetailComponent),
  },
  {
    path: 'playground',
    loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent),
  },
  {
    path: 'playground/:slug',
    loadComponent: () => import('./features/playground/playground.component').then(m => m.PlaygroundComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account.component').then(m => m.AccountComponent),
  },
  {
    path: 'publish',
    canActivate: [authGuard],
    loadComponent: () => import('./features/publish/publish.component').then(m => m.PublishComponent),
  },
  { path: '**', redirectTo: '' },
];
