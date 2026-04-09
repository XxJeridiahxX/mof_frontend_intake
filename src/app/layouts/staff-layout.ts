import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

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
  ],
  template: `
    <div class="staff-shell">

      <!-- ═══ Top Info Bar ═══════════════════════════════════ -->
      <header class="top-bar">
        <div class="top-bar-left">
          <div class="brand">
            <div class="brand-logo">
              <!-- Placeholder for the green logo seen in the screenshot -->
              <mat-icon class="logo-icon">psychology</mat-icon>
            </div>
            <div class="brand-text">
              <span class="brand-name">Medical Office Force, LLC</span>
            </div>
          </div>

          <div class="top-divider"></div>

          <div class="group-info">
            <span class="group-label">Group name: <strong>Athens Heart Center and Specialty Group</strong></span>
            <div class="group-dropdown cp">
              <span class="group-name">Athens Heart Center</span>
              <mat-icon class="dropdown-icon">arrow_drop_down</mat-icon>
            </div>
          </div>
        </div>

        <div class="top-bar-center">
          <div class="connection-badge">
            <mat-icon class="watermark-icon">health_and_safety</mat-icon>
            <div class="conn-col">
              <span class="conn-label">ONLINE</span>
              <span class="conn-val pulse-text">0</span>
            </div>
            <div class="conn-col">
              <span class="conn-label header-label">Excellent Connection</span>
              <span class="conn-val">0</span>
              <span class="conn-sublabel">VOICE MAILS</span>
            </div>
            <div class="conn-col">
              <span class="conn-label">&nbsp;</span>
              <span class="conn-val">0</span>
              <span class="conn-sublabel">MISSED CALLS</span>
            </div>
            <mat-icon class="refresh-icon">autorenew</mat-icon>
          </div>
        </div>

        <div class="top-bar-right">
          <div class="action-icons">
            <button mat-icon-button class="top-icon-btn" title="Phone">
              <mat-icon>phone</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Voice Call">
              <mat-icon>phone_in_talk</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Add Patient">
              <mat-icon>person_add</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Notifications">
              <mat-icon>notifications</mat-icon>
            </button>
          </div>

          <button class="user-chip" [matMenuTriggerFor]="userMenu" mat-button>
            <mat-icon class="user-avatar-icon">account_circle</mat-icon>
            <div class="user-info">
              <span class="user-role">General Care Manager</span>
              <span class="user-handle">(gmanager81530)</span>
            </div>
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
          <a class="nav-tab" routerLink="/staff/patients" routerLinkActive="active">
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
          <a class="nav-tab active">
            <mat-icon>people</mat-icon>
            <span>Staff</span>
          </a>
          <a class="nav-tab">
            <mat-icon>chat</mat-icon>
            <span>Messaging</span>
          </a>
          <a class="nav-tab" routerLink="/staff/intakes" routerLinkActive="active">
            <mat-icon>apps</mat-icon>
            <span>Applications</span>
          </a>
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
        <div class="page-breadcrumbs">
          <span class="bc-app">Applications</span> <span class="bc-sep">|</span> <span class="bc-page">Population Dashboard</span>
        </div>
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

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #158b3c;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
    }

    .logo-icon {
      color: #fff;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-name {
      font-size: 16px;
      font-weight: 700;
      color: #333;
      letter-spacing: -0.2px;
      white-space: nowrap;
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

    .group-dropdown {
      display: flex;
      align-items: center;
      color: #444;
      font-weight: 500;
      font-size: 13px;

      &:hover { color: #089bab; }
    }

    .dropdown-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Center Middle (Connection Stats) */
    .top-bar-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .connection-badge {
      display: flex;
      align-items: stretch;
      border: 1px solid #7ed5b8;
      border-radius: 6px;
      background: #fafffa;
      padding: 4px 16px;
      gap: 20px;
      position: relative;
      overflow: hidden;
      min-width: 280px;
    }

    .watermark-icon {
      position: absolute;
      top: -5px;
      right: 15px;
      font-size: 45px;
      width: 45px;
      height: 45px;
      color: rgba(126, 213, 184, 0.15);
      z-index: 0;
    }

    .conn-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      z-index: 1;
      position: relative;
      padding-top: 5px;
    }

    .conn-label {
      font-size: 9px;
      color: #089bab;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-label {
      color: #43a047;
      font-size: 8px;
      white-space: nowrap;
      position: absolute;
      top: -4px;
    }

    .conn-val {
      font-size: 18px;
      font-weight: 700;
      color: #089bab;
      line-height: 1;
      margin: 4px 0;
    }

    .pulse-text {
      color: #43a047;
    }

    .conn-sublabel {
      font-size: 8px;
      color: #089bab;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .refresh-icon {
      position: absolute;
      top: 4px;
      right: 4px;
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #089bab;
      cursor: pointer;
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
export class StaffLayoutComponent {}
