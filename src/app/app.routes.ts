import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/intake/intake.routes').then((m) => m.INTAKE_ROUTES),
  },
  {
    path: 'staff',
    loadChildren: () =>
      import('./features/staff-dashboard/staff.routes').then(
        (m) => m.STAFF_ROUTES
      ),
  },
  { path: '**', redirectTo: '' },
];
