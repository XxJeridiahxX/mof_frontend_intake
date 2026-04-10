import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
      <div class="unified-step-info">
        <span class="unified-step-counter">Step 2 of 7</span>
        <span class="unified-step-name">Identity Verification</span>
      </div>
    </div>
    <mat-progress-bar mode="determinate" [value]="28" color="accent"></mat-progress-bar>
  </div>

  <!-- ══ SCROLLABLE CONTENT ══ -->
  <div class="shell-scroll">
    <div class="shell-inner">

      <div class="page-intro">
        <h1 class="page-title">Verify Your Identity</h1>
        <p class="page-subtitle">Enter your date of birth to access your secure intake form. This keeps your medical information protected.</p>
      </div>

      <div class="section-card">
        @if (loading()) {
          <mat-progress-bar mode="indeterminate" class="card-loader" />
        }

        <div class="verify-icon-wrap">
          <div class="verify-icon-circle">
            <mat-icon class="verify-icon">verified_user</mat-icon>
          </div>
        </div>

        @if (error()) {
          <div class="error-banner">
            <mat-icon>error_outline</mat-icon>
            <span>{{ error() }}</span>
          </div>
        }

        <div class="form-section-title">Date of Birth</div>
        <form [formGroup]="form" (ngSubmit)="onVerify()">
          <mat-form-field class="dont-apply full-width" appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matInput type="date" formControlName="dateOfBirth" />
            @if (form.get('dateOfBirth')?.hasError('required') && form.get('dateOfBirth')?.touched) {
              <mat-error>Date of birth is required</mat-error>
            }
          </mat-form-field>
        </form>
      </div>

    </div>
  </div>

  <!-- ══ STICKY FOOTER ══ -->
  <div class="sticky-footer">
    <div class="sticky-footer-inner">
      <div class="footer-dot-row">
        <div class="footer-dot"></div>
        <div class="footer-dot active"></div>
      </div>
      <button
        class="footer-btn footer-btn-primary"
        (click)="onVerify()"
        [disabled]="form.invalid || loading()"
      >
        <span>Verify &amp; Continue</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

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
    .unified-step-info {
      display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 0;
    }
    .unified-step-counter { font-size: 13px; font-weight: 600; color: white; line-height: 1.2; }
    .unified-step-name { font-size: 11px; color: rgba(255,255,255,0.75); white-space: nowrap; }
    @media (max-width: 380px) { .unified-brand-name { display: none; } }

    /* ═══ SCROLL AREA ═══ */
    .shell-scroll { flex: 1; overflow-y: auto; }
    .shell-inner { max-width: 640px; margin: 0 auto; padding: 24px 20px 100px; }
    @media (max-width: 599px) { .shell-inner { padding: 16px 16px 100px; } }

    /* ═══ INTRO ═══ */
    .page-intro { margin-bottom: 20px; }
    .page-title { font-size: 26px; font-weight: 700; color: #094997; margin: 0 0 6px; }
    .page-subtitle { font-size: 14px; color: #646464; margin: 0; line-height: 1.6; }
    @media (max-width: 550px) { .page-title { font-size: 22px; } }

    /* ═══ SECTION CARD ═══ */
    .section-card {
      background: white; border-radius: 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04);
      padding: 24px; position: relative; overflow: hidden;
    }
    @media (max-width: 599px) { .section-card { padding: 16px; } }
    .card-loader { position: absolute; top: 0; left: 0; right: 0; }

    /* ═══ VERIFY ICON ═══ */
    .verify-icon-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
    .verify-icon-circle {
      width: 72px; height: 72px; border-radius: 50%;
      background: linear-gradient(135deg, #e8f4fd 0%, #d0eaf8 100%);
      display: flex; align-items: center; justify-content: center;
    }
    .verify-icon { font-size: 38px; width: 38px; height: 38px; color: #089bab; }

    .form-section-title {
      font-size: 15px; font-weight: 600; color: #333;
      margin: 0 0 16px; padding-bottom: 10px; border-bottom: 1px solid #eee;
    }
    .full-width { width: 100%; }

    /* ═══ ERROR BANNER ═══ */
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #fff0f0; border: 1px solid #f44336; border-radius: 6px;
      padding: 10px 14px; margin-bottom: 16px; color: #d32f2f; font-size: 13px;
    }
    .error-banner mat-icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }

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
      min-height: 48px; min-width: 160px; font-size: 15px; font-weight: 600;
      padding: 0 20px; border-radius: 8px; cursor: pointer; border: none;
      transition: background 0.15s, transform 0.1s;
    }
    .footer-btn:active { transform: scale(0.97); }
    .footer-btn-primary { background: #094997; color: white; }
    .footer-btn-primary:hover:not(:disabled) { background: #0a3f7f; }
    .footer-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class VerifyPageComponent {
  form: FormGroup;
  loading = signal(false);
  error = signal('');
  token: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      dateOfBirth: ['', Validators.required],
    });
    this.route.queryParams.subscribe(params => {
      if (params['token']) this.token = params['token'];
    });
  }

  async onVerify() {
    if (this.form.invalid) return;
    if (!this.token) {
      this.error.set('No session token found. Please request a new link.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      const response = await fetch('/api/verifyDob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.token, dateOfBirth: this.form.value.dateOfBirth }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');
      this.loading.set(false);
      this.router.navigate(['/form'], { queryParams: { token: data.token } });
    } catch (err: any) {
      this.error.set(err.message || 'There was an issue verifying your identity.');
      this.loading.set(false);
    }
  }
}
