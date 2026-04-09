import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../../layouts/patient-layout';

export const INTAKE_ROUTES: Routes = [
  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landing/landing.page').then(
            (m) => m.LandingPageComponent
          ),
      },
      {
        path: 'verify',
        loadComponent: () =>
          import('./pages/verify/verify.page').then(
            (m) => m.VerifyPageComponent
          ),
      },
      {
        path: 'form',
        loadComponent: () =>
          import('./pages/intake-form/intake-form.page').then(
            (m) => m.IntakeFormPageComponent
          ),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./pages/confirmation/confirmation.page').then(
            (m) => m.ConfirmationPageComponent
          ),
      },
    ],
  },
];
