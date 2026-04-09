import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-verify-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="verify-container">
      <mat-card class="verify-card">
        @if (loading()) {
          <mat-progress-bar mode="indeterminate" />
        }
        <div class="verify-icon-wrap">
          <mat-icon class="verify-icon">verified_user</mat-icon>
        </div>
        <h2>Verify Your Identity</h2>
        <p class="verify-desc">
          Please enter your date of birth to access your intake form.
        </p>

        @if (error()) {
          <div class="error-banner">
            <mat-icon>error_outline</mat-icon>
            <span>{{ error() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onVerify()">
          <mat-form-field
            class="dont-apply full-width"
            appearance="outline"
          >
            <mat-label>Date of Birth</mat-label>
            <input matInput type="date" formControlName="dateOfBirth" />
            @if (form.get('dateOfBirth')?.hasError('required') && form.get('dateOfBirth')?.touched) {
              <mat-error>Date of birth is required</mat-error>
            }
          </mat-form-field>

          <button
            class="btn btn-primary btn-submit layout-1"
            type="submit"
            [disabled]="form.invalid || loading()"
          >
            Verify & Continue
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: `
    .verify-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .verify-card {
      width: 100%;
      max-width: 420px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
    }

    @media (max-width: 550px) {
      .verify-card { padding: 28px 20px; }
    }

    .verify-icon-wrap {
      margin-bottom: 16px;
    }

    .verify-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #089bab;
    }

    h2 {
      font-size: 22px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px;
    }

    .verify-desc {
      color: #646464;
      font-size: 14px;
      margin-bottom: 24px;
    }

    .full-width { width: 100%; }

    .btn-submit.layout-1 {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      margin-top: 4px;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff0f0;
      border: 1px solid #f44336;
      border-radius: 4px;
      padding: 10px 14px;
      margin-bottom: 16px;
      color: #f44336;
      font-size: 13px;
    }

    .error-banner mat-icon { font-size: 20px; width: 20px; height: 20px; }
  `,
})
export class VerifyPageComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      dateOfBirth: ['', Validators.required],
    });
  }

  onVerify() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    // TODO: Replace with API call to verifyIntakeToken
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/form']);
    }, 1000);
  }
}
