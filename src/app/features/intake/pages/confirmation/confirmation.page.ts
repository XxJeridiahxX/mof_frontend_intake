import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="confirmation-container">
      <mat-card class="confirmation-card">
        <div class="success-icon-wrap">
          <mat-icon class="success-icon">check_circle</mat-icon>
        </div>
        <h1>Intake Form Submitted</h1>
        <p>
          Thank you for completing your intake form. Our team will review your
          information and contact you shortly.
        </p>

        <div class="edit-notice">
          <mat-icon>edit_note</mat-icon>
          <p>Need to make changes? You can return to this form at any time using the secure link we sent to your phone or email.</p>
        </div>

        <div class="next-steps">
          <div class="step-item">
            <mat-icon>rate_review</mat-icon>
            <div>
              <strong>Review</strong>
              <p>Our staff will review your medical information.</p>
            </div>
          </div>
          <div class="step-item">
            <mat-icon>phone_iphone</mat-icon>
            <div>
              <strong>Mobile App</strong>
              <p>You'll receive a text with download links for the patient app and your login credentials.</p>
            </div>
          </div>
          <div class="step-item">
            <mat-icon>event</mat-icon>
            <div>
              <strong>Appointment</strong>
              <p>We'll confirm your preferred appointment time or suggest alternatives.</p>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: `
    .confirmation-container {
      display: flex;
      justify-content: center;
      min-height: 60vh;
      align-items: flex-start;
      padding-top: 24px;
    }

    .confirmation-card {
      max-width: 560px;
      width: 100%;
      padding: 40px 32px;
      text-align: center;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
    }

    @media (max-width: 550px) {
      .confirmation-card { padding: 28px 20px; }
    }

    .success-icon-wrap { margin-bottom: 12px; }

    .success-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #27b345;
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px;
    }

    p {
      color: #555;
      font-size: 15px;
      line-height: 1.65;
    }

    .edit-notice {
      display: flex; align-items: flex-start; gap: 10px;
      background: #f0f7ff; border: 1px solid #c7ddf8; border-radius: 8px;
      padding: 12px 16px; margin-top: 20px; text-align: left;
    }
    .edit-notice mat-icon { color: #094997; flex-shrink: 0; margin-top: 1px; }
    .edit-notice p { margin: 0; font-size: 14px; color: #444; line-height: 1.6; }

    .next-steps {
      text-align: left;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .step-item {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .step-item mat-icon {
      color: #089bab;
      margin-top: 2px;
    }

    .step-item strong {
      font-size: 15px;
      color: #333;
    }

    .step-item p {
      margin: 2px 0 0;
      font-size: 14px;
      line-height: 1.5;
    }
  `,
})
export class ConfirmationPageComponent {}
