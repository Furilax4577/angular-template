import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'page',
    loadComponent: () =>
      import('./pages/page/page.component').then((m) => m.PageComponent),
  },
];
