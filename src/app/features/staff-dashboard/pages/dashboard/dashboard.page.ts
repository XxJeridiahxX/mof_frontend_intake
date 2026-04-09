import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <h1 class="page-title">Dashboard</h1>

    <div class="stats-grid">
      @for (stat of stats; track stat.label) {
        <mat-card class="stat-card">
          <div class="stat-icon-wrap" [style.background]="stat.bg">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </mat-card>
      }
    </div>

    <div class="section-row">
      <mat-card class="section-card">
        <div class="section-header">
          <h2>Recent Intake Forms</h2>
          <a routerLink="/staff/intakes" class="btn-compact">View All</a>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            @for (row of recentIntakes; track row.name) {
              <tr>
                <td>{{ row.name }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + row.status">
                    {{ row.statusLabel }}
                  </span>
                </td>
                <td>{{ row.date }}</td>
              </tr>
            }
          </tbody>
        </table>
      </mat-card>
    </div>
  `,
  styles: `
    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
    }

    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-wrap mat-icon { color: #fff; }

    .stat-number {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      display: block;
      line-height: 1;
    }

    .stat-label {
      font-size: 13px;
      color: #757575;
    }

    .section-card {
      padding: 20px;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table th {
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #757575;
      text-transform: uppercase;
      padding: 8px 12px;
      border-bottom: 2px solid #eee;
    }

    .table td {
      padding: 12px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #f2f2f2;
    }

    .table tbody tr:hover {
      background: #f7f7f7;
    }

    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-submitted { background: #e1f0ff; color: #094997; }
    .status-in_progress { background: #fef3c7; color: #c95817; }
    .status-reviewed { background: #e8fff5; color: #2da41a; }
    .status-link_sent { background: #f2f2f2; color: #646464; }
    .status-converted { background: #e1f3f5; color: #089bab; }
  `,
})
export class DashboardPageComponent {
  stats = [
    { label: 'Link Sent', value: 12, icon: 'send', bg: '#757575' },
    { label: 'In Progress', value: 5, icon: 'edit_note', bg: '#fbc647' },
    { label: 'Submitted', value: 8, icon: 'assignment_turned_in', bg: '#2196f3' },
    { label: 'Reviewed', value: 23, icon: 'fact_check', bg: '#27b345' },
  ];

  recentIntakes = [
    { name: 'Jane Smith', status: 'submitted', statusLabel: 'Submitted', date: 'Apr 8, 2026' },
    { name: 'Robert Johnson', status: 'in_progress', statusLabel: 'In Progress', date: 'Apr 8, 2026' },
    { name: 'Maria Garcia', status: 'reviewed', statusLabel: 'Reviewed', date: 'Apr 7, 2026' },
    { name: 'David Lee', status: 'link_sent', statusLabel: 'Link Sent', date: 'Apr 7, 2026' },
    { name: 'Sarah Williams', status: 'converted', statusLabel: 'Converted', date: 'Apr 6, 2026' },
  ];
}
