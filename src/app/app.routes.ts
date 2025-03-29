import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', // assure que la racine '/' charge bien HomeComponent
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'page',
    loadComponent: () =>
      import('./pages/page/page.component').then((m) => m.PageComponent),
  },
];
