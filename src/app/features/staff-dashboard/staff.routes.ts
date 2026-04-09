import { Routes } from '@angular/router';
import { StaffLayoutComponent } from '../../layouts/staff-layout';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    component: StaffLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPageComponent
          ),
      },
      {
        path: 'intakes',
        loadComponent: () =>
          import('./pages/intake-list/intake-list.page').then(
            (m) => m.IntakeListPageComponent
          ),
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./pages/patients/patients.page').then(
            (m) => m.PatientsPageComponent
          ),
      },
    ],
  },
];
