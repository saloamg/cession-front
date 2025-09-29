// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/landing.component').then(m => m.HomeLandingComponent) },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  { path: 'cesiones', canActivate: [authGuard], loadComponent: () => import('./cesiones/cesiones-page.component').then(m => m.CesionesPageComponent) },
  { path: '**', redirectTo: '' },
];
