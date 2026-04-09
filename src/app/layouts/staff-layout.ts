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
              <mat-icon class="logo-icon">local_hospital</mat-icon>
            </div>
            <div class="brand-text">
              <span class="brand-name">Medical Office Force</span>
              <span class="brand-tagline">LLC</span>
            </div>
          </div>

          <div class="top-divider"></div>

          <div class="group-info">
            <span class="group-label">Group name</span>
            <span class="group-name">Athens Heart Center and Speciality Group</span>
          </div>
        </div>

        <div class="top-bar-right">
          <div class="connection-badge">
            <span class="conn-dot"></span>
            <div class="conn-stats">
              <span class="conn-label">ONLINE</span>
              <div class="stat-row">
                <span class="stat-item">
                  <mat-icon class="stat-icon">voicemail</mat-icon>
                  VOICE MAILS <strong>0</strong>
                </span>
                <span class="stat-item">
                  <mat-icon class="stat-icon">phone_missed</mat-icon>
                  MISSED CALLS <strong>0</strong>
                </span>
              </div>
            </div>
          </div>

          <div class="action-icons">
            <button mat-icon-button class="top-icon-btn" title="Phone">
              <mat-icon>phone</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Notifications">
              <mat-icon>notifications</mat-icon>
            </button>
            <button mat-icon-button class="top-icon-btn" title="Add Patient">
              <mat-icon>person_add</mat-icon>
            </button>
          </div>

          <button
            class="user-chip"
            [matMenuTriggerFor]="userMenu"
            mat-button
          >
            <mat-icon class="user-avatar-icon">account_circle</mat-icon>
            <div class="user-info">
              <span class="user-role">Staff Manager</span>
              <span class="user-handle">admin</span>
            </div>
            <mat-icon class="chevron">expand_more</mat-icon>
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
          <a
            class="nav-tab"
            routerLink="/staff"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a
            class="nav-tab"
            routerLink="/staff/intakes"
            routerLinkActive="active"
          >
            <mat-icon>assignment</mat-icon>
            <span>Intake Forms</span>
          </a>
          <a
            class="nav-tab"
            routerLink="/staff/patients"
            routerLinkActive="active"
          >
            <mat-icon>people</mat-icon>
            <span>Patients</span>
          </a>
        </div>
        <div class="nav-meta">
          <span>Medical Office Force (Ver 1.0)</span>
        </div>
      </nav>

      <!-- ═══ Page Content ════════════════════════════════════ -->
      <main class="staff-content">
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
      background: #f4f5f7;
    }

    /* ─── Top Info Bar ───────────────────────────────────────── */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-bottom: 1px solid #e0e4ea;
      height: 54px;
      padding: 0 20px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
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
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .brand-logo {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #089bab 0%, #06778a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(8, 155, 171, 0.35);
    }

    .logo-icon {
      color: #fff;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-name {
      font-size: 14px;
      font-weight: 700;
      color: #1a1f36;
      letter-spacing: -0.2px;
      white-space: nowrap;
    }

    .brand-tagline {
      font-size: 9px;
      color: #888;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    .top-divider {
      width: 1px;
      height: 30px;
      background: #e0e4ea;
      flex-shrink: 0;
    }

    .group-info {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
      overflow: hidden;
    }

    .group-label {
      font-size: 9px;
      color: #aaa;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .group-name {
      font-size: 12px;
      color: #444;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Right side */
    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .connection-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px;
      border: 1px solid #a5d6a7;
      border-radius: 6px;
      background: #f1fbf1;
    }

    .conn-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #43a047;
      box-shadow: 0 0 0 3px rgba(67, 160, 71, 0.2);
      animation: pulse 2s infinite;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(67, 160, 71, 0.35); }
      70% { box-shadow: 0 0 0 5px rgba(67, 160, 71, 0); }
      100% { box-shadow: 0 0 0 0 rgba(67, 160, 71, 0); }
    }

    .conn-stats {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .conn-label {
      font-size: 9px;
      font-weight: 700;
      color: #2e7d32;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .stat-row {
      display: flex;
      gap: 10px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      color: #555;
      font-weight: 500;

      strong { color: #1a1f36; font-weight: 700; }
    }

    .stat-icon {
      font-size: 11px;
      width: 11px;
      height: 11px;
      color: #089bab;
    }

    .action-icons {
      display: flex;
      align-items: center;
    }

    .top-icon-btn {
      color: #666;
      width: 34px;
      height: 34px;

      mat-icon { font-size: 20px; }

      &:hover { color: #089bab; }
    }

    /* User chip */
    .user-chip {
      display: flex !important;
      align-items: center;
      gap: 8px;
      padding: 5px 12px !important;
      border-radius: 8px !important;
      border: 1px solid #e0e4ea !important;
      background: #fafbfc !important;
      transition: background 0.2s, border-color 0.2s;
      cursor: pointer;
      height: auto !important;
      line-height: normal !important;

      &:hover {
        background: #f0f4f8 !important;
        border-color: #c5cdd8 !important;
      }
    }

    .user-avatar-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
      color: #089bab;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
      text-align: left;
    }

    .user-role {
      font-size: 12px;
      font-weight: 600;
      color: #1a1f36;
    }

    .user-handle {
      font-size: 10px;
      color: #888;
    }

    .chevron {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #aaa;
    }

    .signout-item mat-icon { color: #e53935; }
    .signout-item span { color: #e53935; }

    /* ─── Navigation Bar ─────────────────────────────────────── */
    .top-nav {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
      background: #2d323d;
      height: 42px;
      padding: 0 20px;
      position: sticky;
      top: 54px;
      z-index: 199;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .nav-tabs {
      display: flex;
      align-items: stretch;
    }

    .nav-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 18px;
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      border-top: 3px solid transparent;
      transition: color 0.15s, background 0.15s, border-color 0.15s;
      white-space: nowrap;
      letter-spacing: 0.1px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        opacity: 0.8;
      }

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        color: #fff;
        border-bottom-color: #089bab;
        background: rgba(8, 155, 171, 0.1);

        mat-icon { opacity: 1; }
      }
    }

    .nav-meta {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.3);
      letter-spacing: 0.3px;
      font-weight: 400;
      padding-right: 4px;
    }

    /* ─── Main Content ───────────────────────────────────────── */
    .staff-content {
      flex: 1;
      padding: 24px;
      box-sizing: border-box;
      background: #f4f5f7;
    }

    /* ─── Responsive ─────────────────────────────────────────── */
    @media (max-width: 900px) {
      .connection-badge { display: none; }
      .group-info { display: none; }
      .top-divider { display: none; }
    }

    @media (max-width: 768px) {
      .top-bar { height: 50px; padding: 0 14px; }
      .top-nav { top: 50px; padding: 0 14px; }
      .nav-meta { display: none; }
      .action-icons { display: none; }

      .nav-tab {
        padding: 0 12px;
        font-size: 12px;
        gap: 4px;

        mat-icon { display: none; }
      }

      .staff-content { padding: 16px; }
    }

    @media (max-width: 480px) {
      .brand-tagline { display: none; }
      .user-info { display: none; }
      .user-chip { padding: 5px 8px !important; }
    }
  `,
})
export class StaffLayoutComponent {}
