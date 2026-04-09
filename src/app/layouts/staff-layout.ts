import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  template: `
    <div class="staff-shell">

      <!-- ═══ Top Info Bar ═══════════════════════════════════ -->
      <header class="top-bar">
        <div class="top-bar-left">
          <div class="brand">
            <img src="/logo.png" alt="Medical Office Force Logo" class="main-logo-img" />
          </div>

          <div class="top-divider"></div>

          <div class="group-info">
            <span class="group-label">Group name: <strong>Athens Heart Center and Specialty Group</strong></span>
            <div class="group-dropdown-wrapper">
              <mat-form-field appearance="outline" class="compact-field">
                <mat-select value="athens">
                  <mat-option value="athens">Athens Heart Center</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </div>

        <div class="top-bar-center">
          <div class="connection-badge">
            <div class="conn-col top-aligned">
              <span class="header-label" style="color: rgb(80, 207, 171);">Excellent Connection <mat-icon class="refresh-icon">refresh</mat-icon></span>
              <div class="conn-stats-row">
                <div class="conn-block">
                  <span class="conn-label">ONLINE</span>
                  <div class="online-stats">
                    <mat-icon class="small-call-icon">call_received</mat-icon> <span class="conn-val">0</span>
                    <span class="pipe">|</span>
                    <mat-icon class="small-call-icon">call_made</mat-icon> <span class="conn-val">0</span>
                  </div>
                </div>
                
                <div class="conn-block">
                  <span class="conn-label">VOICE MAILS</span>
                  <span class="conn-val">0</span>
                </div>
                
                <div class="conn-block">
                  <span class="conn-label">MISSED CALLS</span>
                  <span class="conn-val">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="top-bar-right">
          <div class="action-icons">
            <button mat-icon-button class="top-icon-btn" title="TTY">
              <mat-icon>tty</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Call Offline">
              <mat-icon>phone_paused</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Add Patient">
              <mat-icon>person_add</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn custom-green" title="Notifications">
              <mat-icon>notifications</mat-icon>
            </button>
          </div>

          <button class="user-chip" [matMenuTriggerFor]="userMenu" mat-button>
            <!-- Using account_circle as placeholder for assets/images/user.png -->
            <mat-icon class="user-avatar-icon">account_circle</mat-icon>
            <div class="user-info">
              <span class="user-role">General Care Manager</span>
              <span class="user-handle">(gmanager81530)</span>
            </div>
            <mat-icon class="user-dropdown-icon">keyboard_arrow_down</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>person</mat-icon>
              <span>My Profile</span>
            </button>
            <button mat-menu-item>
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            <mat-divider />
            <button mat-menu-item class="signout-item">
              <mat-icon>logout</mat-icon>
              <span>Sign Out</span>
            </button>
          </mat-menu>
        </div>
      </header>

      <!-- ═══ Horizontal Nav Bar ══════════════════════════════ -->
      <nav class="top-nav">
        <div class="nav-tabs">
          <a class="nav-tab" routerLink="/staff" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <mat-icon>home</mat-icon>
            <span>Dashboard</span>
          </a>
          <a class="nav-tab">
            <mat-icon>schedule</mat-icon>
            <span>Schedule</span>
          </a>
          <a class="nav-tab">
            <mat-icon>person</mat-icon>
            <span>Patient</span>
          </a>
          <a class="nav-tab">
            <mat-icon>receipt</mat-icon>
            <span>Billing</span>
          </a>
          <a class="nav-tab">
            <mat-icon>bar_chart</mat-icon>
            <span>Reports</span>
          </a>
          <a class="nav-tab">
            <mat-icon>people</mat-icon>
            <span>Staff</span>
          </a>
          <a class="nav-tab">
            <mat-icon>chat</mat-icon>
            <span>Messaging</span>
          </a>
          <!-- Applications Dropdown Menu -->
          <a class="nav-tab cp" [class.active]="isAppsActive" [matMenuTriggerFor]="appsMenu">
            <mat-icon>apps</mat-icon>
            <span>Applications</span>
            <mat-icon style="font-size: 16px; margin-left: -5px; width: 16px;">arrow_drop_down</mat-icon>
          </a>
          <mat-menu #appsMenu="matMenu">
            <a mat-menu-item routerLink="/staff/patients" routerLinkActive="active-menu">
              <mat-icon>people</mat-icon>
              <span>Population Dashboard</span>
            </a>
            <a mat-menu-item routerLink="/staff/intakes" routerLinkActive="active-menu">
              <mat-icon>assignment</mat-icon>
              <span>Intake Forms</span>
            </a>
          </mat-menu>

          <a class="nav-tab">
            <mat-icon>record_voice_over</mat-icon>
            <span>Voice Call</span>
          </a>
          <a class="nav-tab">
            <mat-icon>launch</mat-icon>
            <span>External Link</span>
          </a>
          <a class="nav-tab">
            <mat-icon>build</mat-icon>
            <span>External Tools</span>
          </a>
        </div>
        <div class="nav-meta">
          <span>Medical Office Force (Ver 1.0)</span>
          <span class="red-a">"A"</span>
        </div>
      </nav>

      <!-- ═══ Page Content ════════════════════════════════════ -->
      <main class="staff-content">
        @if (isAppsActive) {
          <div class="page-breadcrumbs">
            <span class="bc-app">Applications</span> <span class="bc-sep">|</span> 
            <span class="bc-page">{{ router.url.includes('patients') ? 'Population Dashboard' : 'Intake Forms' }}</span>
          </div>
        }
        <router-outlet />
      </main>

    </div>
  `,
  styles: `
    /* ─── Shell ──────────────────────────────────────────────── */
    .staff-shell {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #fdfdfd;
      font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .cp { cursor: pointer; }

    /* ─── Top Info Bar ───────────────────────────────────────── */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-bottom: 2px solid #eaebed;
      height: 60px;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 200;
      flex-shrink: 0;
    }

    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 20px;
      overflow: hidden;
      flex: 1;
    }

    .main-logo-img {
      height: 48px;
      width: auto;
      object-fit: contain;
    }

    .top-divider {
      width: 1px;
      height: 30px;
      background: #e0e4ea;
      flex-shrink: 0;
      margin: 0 10px;
    }

    .group-info {
      display: flex;
      flex-direction: column;
      line-height: 1.4;
      overflow: hidden;
    }

    .group-label {
      font-size: 11px;
      color: #777;
      white-space: nowrap;

      strong {
        color: #333;
        font-weight: 600;
      }
    }

    .group-dropdown-wrapper {
      margin-top: 2px;
    }

    ::ng-deep .compact-field .mat-mdc-form-field-flex {
      padding: 0 10px;
      height: 32px;
      align-items: center;
      background: #fff;
    }
    
    ::ng-deep .compact-field .mat-mdc-text-field-wrapper {
      height: 32px;
      padding-bottom: 0;
    }

    ::ng-deep .compact-field .mat-mdc-form-field-infix {
      padding: 0;
      min-height: auto;
      width: 150px;
    }

    ::ng-deep .compact-field .mat-mdc-select-value {
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }

    /* Center Middle (Connection Stats) */
    .top-bar-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .connection-badge {
      display: inline-block;
      text-align: center;
    }

    .header-label {
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-bottom: 2px;
    }

    .refresh-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      cursor: pointer;
    }

    .conn-stats-row {
      display: flex;
      align-items: stretch;
      gap: 20px;
    }

    .conn-block {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .conn-label {
      font-size: 10px;
      color: rgb(80, 207, 171);
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }

    .conn-val {
      font-size: 14px;
      font-weight: 700;
      color: #333;
    }

    .online-stats {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .small-call-icon {
      font-size: 13px;
      width: 13px;
      height: 13px;
      color: rgb(80, 207, 171);
    }

    .pipe {
      color: #ccc;
      margin: 0 2px;
      font-size: 12px;
    }

    /* Right side */
    .top-bar-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      flex-shrink: 0;
      flex: 1;
    }

    .action-icons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .top-icon-btn {
      color: #2196f3;
      width: 32px;
      height: 32px;

      mat-icon { font-size: 18px; }
      &:hover { background: rgba(33, 150, 243, 0.1); }
    }

    /* User chip */
    .user-chip {
      display: flex !important;
      align-items: center;
      gap: 8px;
      padding: 4px 12px !important;
      border-radius: 8px !important;
      border: 1px solid #e0e4ea !important;
      background: #fafbfc !important;
      cursor: pointer;
      height: auto !important;

      &:hover {
        background: #f0f4f8 !important;
      }
    }

    .user-avatar-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #222;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      text-align: left;
    }

    .user-role {
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    .user-handle {
      font-size: 11px;
      color: #888;
    }

    .user-dropdown-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #555;
    }

    .signout-item mat-icon,
    .signout-item span { color: #e53935; }


    /* ─── Navigation Bar ─────────────────────────────────────── */
    .top-nav {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      background: #ffffff;
      height: 38px;
      padding: 0 16px;
      position: sticky;
      top: 60px;
      z-index: 199;
      flex-shrink: 0;
      border-bottom: 1px solid #eaebed;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .nav-tabs {
      display: flex;
      align-items: stretch;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .nav-tabs::-webkit-scrollbar { display: none; }

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 14px;
      color: #444;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
      white-space: nowrap;

      mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
        color: #777;
      }

      &:hover {
        color: #111;
        background: #f8f9fa;
        mat-icon { color: #555; }
      }

      &.active {
        color: #111;
        font-weight: 600;
        background: #f5f6f8;
        border-bottom-color: #ddd;

        mat-icon { color: #333; }
      }
    }

    .nav-meta {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: #888;
      font-weight: 500;
      gap: 6px;
    }

    .red-a {
      color: #d32f2f;
      font-weight: 700;
      font-size: 13px;
    }

    /* ─── Main Content ───────────────────────────────────────── */
    .staff-content {
      flex: 1;
      padding: 16px 24px;
      box-sizing: border-box;
      background: #ffffff;
      max-width: 100vw;
      overflow-x: auto;
    }
    
    .page-breadcrumbs {
      font-size: 14px;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .page-breadcrumbs .bc-app {
      color: #333;
    }

    .page-breadcrumbs .bc-sep {
      color: #ccc;
      margin: 0 6px;
    }

    .page-breadcrumbs .bc-page {
      color: #444;
      font-weight: 600;
    }

    /* ─── Responsive ─────────────────────────────────────────── */
    @media (max-width: 1100px) {
      .top-bar-center { display: none; }
    }

    @media (max-width: 900px) {
      .group-info { display: none; }
      .top-divider { display: none; }
    }

    @media (max-width: 768px) {
      .top-bar { height: 50px; padding: 0 14px; }
      .top-nav { top: 50px; padding: 0 4px; }
      .nav-meta { display: none; }
      .action-icons { display: none; }

      .nav-tab {
        padding: 0 10px;
        font-size: 11px;
        gap: 4px;
      }
      .staff-content { padding: 16px; }
    }
  `,
})
export class StaffLayoutComponent {
  router = inject(Router);

  get isAppsActive(): boolean {
    return this.router.url.includes('/staff/patients') || this.router.url.includes('/staff/intakes');
  }
}
