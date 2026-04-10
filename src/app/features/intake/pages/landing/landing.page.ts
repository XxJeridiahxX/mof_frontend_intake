import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  template: `
<div class="app-shell">

  <!-- ══ UNIFIED HEADER ══ -->
  <div class="unified-header">
    <div class="unified-header-inner">
      <div class="unified-brand">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="white" fill-opacity="0.2"/>
          <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="unified-brand-name">MOF Patient Intake</span>
      </div>
    </div>
    <mat-progress-bar mode="determinate" [value]="0" color="accent" style="opacity:0"></mat-progress-bar>
  </div>

  <!-- ══ SCROLLABLE CONTENT ══ -->
  <div class="shell-scroll">
    <div class="shell-inner">

      @if (submitted()) {
        <!-- ══ CHECK PHONE STATE ══ -->
        <div class="section-card check-phone-card">
          <div class="check-icon-wrap">
            <mat-icon class="check-icon">mark_email_read</mat-icon>
          </div>
          <h2 class="check-title">Check Your Phone</h2>
          <p class="check-desc">
            We've sent a secure link to <strong>{{ maskedPhone() }}</strong>.
            Click the link and verify your date of birth to continue your intake form.
          </p>
          <p class="check-helper">
            Didn't receive it?
            <button class="btn-compact" (click)="resendLink()" [disabled]="resending()">Resend Link</button>
          </p>
          <div class="proto-link-row">
            <span class="proto-label">Prototype Direct Link</span>
            <a [routerLink]="['/verify']" [queryParams]="{ token: intakeToken() }" class="proto-link">
              Proceed to Verification &rarr;
            </a>
          </div>
        </div>
      } @else {

        <!-- ══ INTRO ══ -->
        <div class="page-intro">
          <h1 class="page-title">Welcome to Patient Intake</h1>
          <p class="page-subtitle">Complete your registration to get started with Medical Office Force. We'll send you a secure link to fill out your medical information.</p>
        </div>

        <!-- ══ FORM CARD ══ -->
        <div class="section-card">
          @if (loading()) {
            <mat-progress-bar mode="indeterminate" class="card-loader" />
          }
          <div class="form-section-title">Basic Information</div>
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
                <input matInput type="datetime-local" formControlName="preferredTime" />
              </mat-form-field>
            </div>
          </form>
        </div>

        <!-- ══ CHIEF COMPLAINT CARD ══ -->
        <div class="section-card">
          <div class="form-section-title">Reason for Visit</div>
          <form [formGroup]="form">
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline" style="flex:1">
                <mat-label>Primary Reason for Visit / Chief Complaint</mat-label>
                <textarea matInput rows="3" formControlName="chiefComplaint"></textarea>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline" style="flex:1">
                <mat-label>Current Symptoms</mat-label>
                <textarea matInput rows="3" formControlName="currentSymptoms"></textarea>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>When did these symptoms begin?</mat-label>
                <input matInput formControlName="symptomOnset" />
              </mat-form-field>
            </div>
          </form>
        </div>
      }

    </div>
  </div>

  <!-- ══ STICKY FOOTER ══ -->
  @if (!submitted()) {
    <div class="sticky-footer">
      <div class="sticky-footer-inner">
        <div class="footer-dot-row">
          <div class="footer-dot active"></div>
          <div class="footer-dot"></div>
        </div>
        <button
          class="footer-btn footer-btn-primary"
          (click)="onSubmit()"
          [disabled]="form.invalid || loading()"
        >
          <span>Continue</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  }

</div>
  `,
  styles: `
    :host { display: block; height: 100dvh; overflow: hidden; }

    .app-shell { display: flex; flex-direction: column; height: 100dvh; overflow: hidden; background: #f4f6f9; }

    /* ═══ UNIFIED HEADER ═══ */
    .unified-header {
      flex-shrink: 0; z-index: 100;
      background-color: #094997;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    }
    .unified-header-inner {
      display: flex; align-items: center;
      padding: 0 16px; height: 56px;
      max-width: 960px; margin: 0 auto; gap: 12px;
    }
    .unified-brand { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }
    .unified-brand-name {
      font-size: 15px; font-weight: 700; color: white;
      letter-spacing: -0.1px; white-space: nowrap;
    }
    @media (max-width: 380px) { .unified-brand-name { display: none; } }

    /* ═══ SCROLL AREA ═══ */
    .shell-scroll { flex: 1; overflow-y: auto; }
    .shell-inner { max-width: 960px; margin: 0 auto; padding: 24px 20px 100px; }
    @media (max-width: 599px) { .shell-inner { padding: 16px 16px 100px; } }

    /* ═══ INTRO ═══ */
    .page-intro { margin-bottom: 20px; }
    .page-title { font-size: 26px; font-weight: 700; color: #094997; margin: 0 0 6px; }
    .page-subtitle { font-size: 14px; color: #646464; margin: 0; line-height: 1.6; max-width: 600px; }
    @media (max-width: 550px) { .page-title { font-size: 22px; } }

    /* ═══ SECTION CARD ═══ */
    .section-card {
      background: white; border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
      padding: 24px; margin-bottom: 16px; position: relative; overflow: hidden;
    }
    @media (max-width: 599px) { .section-card { padding: 16px; } }

    .card-loader { position: absolute; top: 0; left: 0; right: 0; }

    .form-section-title {
      font-size: 15px; font-weight: 600; color: #333;
      margin: 0 0 16px; padding-bottom: 10px; border-bottom: 1px solid #eee;
    }

    .form-row { display: flex; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
    .form-row > mat-form-field { flex: 1; min-width: 220px; }
    @media (max-width: 599px) { .form-row { flex-direction: column; gap: 0; } }

    /* ═══ CHECK PHONE ═══ */
    .check-phone-card { text-align: center; padding: 40px 24px; }
    .check-icon-wrap { margin-bottom: 16px; }
    .check-icon { font-size: 64px; width: 64px; height: 64px; color: #089bab; }
    .check-title { font-size: 24px; font-weight: 700; color: #1a1a2e; margin: 0 0 12px; }
    .check-desc { font-size: 15px; color: #646464; line-height: 1.6; margin: 0 0 20px; }
    .check-helper { font-size: 14px; color: #888; margin: 0 0 28px; }
    .proto-link-row {
      border-top: 1px solid #eee; padding-top: 20px; margin-top: 4px;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .proto-label { font-size: 12px; color: #aaa; }
    .proto-link { font-size: 14px; font-weight: 500; color: #2196f3; text-decoration: none; }
    .proto-link:hover { text-decoration: underline; }

    /* ═══ STICKY FOOTER ═══ */
    .sticky-footer {
      flex-shrink: 0; z-index: 100; background: white;
      border-top: 1px solid #e8eaed; box-shadow: 0 -2px 8px rgba(0,0,0,0.09);
    }
    .sticky-footer-inner {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px; max-width: 960px; margin: 0 auto; gap: 12px;
    }
    .footer-dot-row { display: flex; gap: 7px; align-items: center; }
    .footer-dot { width: 8px; height: 8px; border-radius: 50%; background: #d0d5dd; transition: background 0.2s, transform 0.2s; }
    .footer-dot.active { background: #094997; transform: scale(1.4); }

    .footer-btn {
      display: flex; align-items: center; gap: 6px;
      min-height: 48px; min-width: 130px; font-size: 15px; font-weight: 600;
      padding: 0 20px; border-radius: 8px; cursor: pointer; border: none;
      transition: background 0.15s, transform 0.1s;
    }
    .footer-btn:active { transform: scale(0.97); }
    .footer-btn-primary { background: #094997; color: white; }
    .footer-btn-primary:hover:not(:disabled) { background: #0a3f7f; }
    .footer-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class LandingPageComponent {
  form: FormGroup;
  loading = signal(false);
  submitted = signal(false);
  resending = signal(false);
  maskedPhone = signal('');
  intakeToken = signal<string>('');

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      preferredTime: [''],
      chiefComplaint: [''],
      currentSymptoms: [''],
      symptomOnset: [''],
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const payload = this.form.value;
    const phone = payload.phone;
    this.maskedPhone.set(phone.replace(/(\d{3})\d{4}(\d{3,4})/, '$1****$2'));

    try {
      const response = await fetch('/api/requestIntakeLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to initiate intake');
      const data = await response.json();
      if (data.token) this.intakeToken.set(data.token);
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
