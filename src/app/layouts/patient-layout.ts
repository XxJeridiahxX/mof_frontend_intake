import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatIconModule],
  template: `
    <div class="patient-shell">
      <mat-toolbar class="patient-toolbar">
        <a routerLink="/" class="brand">
          <mat-icon>local_hospital</mat-icon>
          <span class="brand-text">Medical Office Force</span>
        </a>
      </mat-toolbar>
      <main class="patient-content">
        <router-outlet />
      </main>
      <footer class="patient-footer">
        <p>&copy; 2026 Medical Office Force. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: `
    .patient-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f9f9f9;
    }

    .patient-toolbar {
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      height: 64px;
      padding: 0 24px;
      z-index: 4;
    }

    @media (max-width: 599px) {
      .patient-toolbar {
        height: 56px;
        padding: 0 16px;
      }
    }

    .brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #094997;
      gap: 8px;
    }

    .brand mat-icon {
      color: #089bab;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .brand-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }

    @media (max-width: 550px) {
      .brand-text { font-size: 16px; }
    }

    .patient-content {
      flex: 1;
      padding: 24px;
      max-width: 960px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    @media (max-width: 599px) {
      .patient-content { padding: 16px; }
    }

    .patient-footer {
      text-align: center;
      padding: 16px;
      color: #757575;
      font-size: 12px;
      border-top: 1px solid #eee;
      background: #fff;
    }
  `,
})
export class PatientLayoutComponent {}
