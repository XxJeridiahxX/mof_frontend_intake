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
  selector: 'app-landing-page',
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
    <div class="landing-container">
      <div class="landing-hero">
        <h1>Welcome to Patient Intake</h1>
        <p class="subtitle">
          Complete your registration to get started with Medical Office Force.
          We'll send you a secure link to fill out your medical information.
        </p>
      </div>

      <mat-card class="intake-card">
        @if (submitted()) {
          <div class="check-phone">
            <mat-icon class="check-icon">mark_email_read</mat-icon>
            <h2>Check Your Phone</h2>
            <p>
              We've sent a secure link to
              <strong>{{ maskedPhone() }}</strong
              >. Click the link and verify your date of birth to continue your
              intake form.
            </p>
            <p class="helper-text">
              Didn't receive it?
              <button
                class="btn-compact"
                (click)="resendLink()"
                [disabled]="resending()"
              >
                Resend Link
              </button>
            </p>
          </div>
        } @else {
          @if (loading()) {
            <mat-progress-bar mode="indeterminate" />
          }
          <h2 class="form-title">Basic Information</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" />
                @if (form.get('firstName')?.hasError('required') && form.get('firstName')?.touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" />
                @if (form.get('lastName')?.hasError('required') && form.get('lastName')?.touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" />
                @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
                  <mat-error>Enter a valid email</mat-error>
                }
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput type="tel" formControlName="phone" />
                @if (form.get('phone')?.hasError('required') && form.get('phone')?.touched) {
                  <mat-error>Phone number is required</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <input matInput type="date" formControlName="dateOfBirth" />
                @if (form.get('dateOfBirth')?.hasError('required') && form.get('dateOfBirth')?.touched) {
                  <mat-error>Date of birth is required</mat-error>
                }
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Preferred Appointment Time</mat-label>
                <input
                  matInput
                  type="datetime-local"
                  formControlName="preferredTime"
                />
              </mat-form-field>
            </div>

            <button
              class="btn btn-primary btn-submit layout-1"
              type="submit"
              [disabled]="form.invalid || loading()"
            >
              Submit & Get Secure Link
            </button>
          </form>
        }
      </mat-card>
    </div>
  `,
  styles: `
    .landing-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .landing-hero {
      text-align: center;
      margin-bottom: 24px;
    }

    .landing-hero h1 {
      font-size: 32px;
      font-weight: 600;
      color: #094997;
      margin: 0 0 8px;
    }

    .subtitle {
      color: #646464;
      font-size: 16px;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.5;
    }

    @media (max-width: 550px) {
      .landing-hero h1 { font-size: 24px; }
      .subtitle { font-size: 14px; }
    }

    .intake-card {
      width: 100%;
      max-width: 680px;
      padding: 32px;
      border-radius: 4px;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
    }

    @media (max-width: 550px) {
      .intake-card { padding: 20px 16px; }
    }

    .form-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 4px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    @media (max-width: 599px) {
      .form-row {
        flex-direction: column;
        gap: 4px;
      }
    }

    .btn-submit.layout-1 {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      margin-top: 8px;
    }

    .check-phone {
      text-align: center;
      padding: 24px 0;
    }

    .check-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #089bab;
      margin-bottom: 16px;
    }

    .check-phone h2 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 12px;
    }

    .check-phone p {
      color: #646464;
      font-size: 15px;
      line-height: 1.5;
    }

    .helper-text {
      margin-top: 20px;
      font-size: 14px;
    }
  `,
})
export class LandingPageComponent {
  form: FormGroup;
  loading = signal(false);
  submitted = signal(false);
  resending = signal(false);
  maskedPhone = signal('');

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      preferredTime: [''],
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const payload = this.form.value;
    const phone = payload.phone;
    this.maskedPhone.set(
      phone.replace(/(\d{3})\d{4}(\d{3,4})/, '$1****$2')
    );

    try {
      const response = await fetch('/api/requestIntakeLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to initiate intake');
      
      this.loading.set(false);
      this.submitted.set(true);
    } catch (err) {
      console.error('Error initiating form:', err);
      this.loading.set(false);
      alert('There was an issue processing your request. Please try again.');
    }
  }

  resendLink() {
    this.resending.set(true);
    setTimeout(() => this.resending.set(false), 3000);
  }
}
