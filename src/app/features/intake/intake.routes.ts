import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../../layouts/patient-layout';

export const INTAKE_ROUTES: Routes = [
  // Full-screen pages — own shell, no shared layout
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.page').then((m) => m.LandingPageComponent),
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./pages/verify/verify.page').then((m) => m.VerifyPageComponent),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./pages/intake-form/intake-form.page').then((m) => m.IntakeFormPageComponent),
  },
  // Confirmation still uses the patient layout (simple success page)
  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./pages/confirmation/confirmation.page').then((m) => m.ConfirmationPageComponent),
      },
    ],
  },
];
