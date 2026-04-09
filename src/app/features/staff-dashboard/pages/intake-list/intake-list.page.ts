import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';

interface IntakeRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  statusLabel: string;
  submitted: string;
}

@Component({
  selector: 'app-intake-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatMenuModule,
  ],
  template: `
    <div class="list-header">
      <h1 class="page-title">Intake Forms</h1>
      <button mat-button class="action-add-btn">
        <mat-icon style="margin-right: 6px;">send</mat-icon> Send New Intake
      </button>
    </div>

    <div class="cust-div-header">
      <div class="filter-controls-row">
        <div class="search-field">
          <mat-icon style="color: #777; margin-right: 4px; font-size: 20px; width: 20px; height: 20px; display:flex; align-items:center;">search</mat-icon>
          <input type="text" [(ngModel)]="searchTerm" placeholder="Name, email, phone">
        </div>

        <mat-form-field appearance="outline" class="toolbar-select">
          <mat-select placeholder="Status" [(ngModel)]="statusFilter">
            <mat-option value="all">All</mat-option>
            <mat-option value="link_sent">Link Sent</mat-option>
            <mat-option value="in_progress">In Progress</mat-option>
            <mat-option value="submitted">Submitted</mat-option>
            <mat-option value="reviewed">Reviewed</mat-option>
            <mat-option value="converted">Converted</mat-option>
          </mat-select>
        </mat-form-field>
        
        <div class="icon-group">
          <button mat-icon-button class="toolbar-icon-btn"><mat-icon>refresh</mat-icon></button>
        </div>
      </div>
    </div>

    <mat-card class="table-card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (row of filteredRows(); track row.id) {
              <tr>
                <td class="fw6">{{ row.name }}</td>
                <td>{{ row.phone }}</td>
                <td>{{ row.email }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + row.status">
                    {{ row.statusLabel }}
                  </span>
                </td>
                <td>{{ row.submitted }}</td>
                <td>
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item>
                      <mat-icon>visibility</mat-icon> View Details
                    </button>
                    <button mat-menu-item>
                      <mat-icon>check_circle</mat-icon> Mark Reviewed
                    </button>
                    <button mat-menu-item>
                      <mat-icon>person_add</mat-icon> Convert to Patient
                    </button>
                    <button mat-menu-item>
                      <mat-icon>refresh</mat-icon> Resend Link
                    </button>
                  </mat-menu>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="no-data">No intake forms found.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </mat-card>
  `,
  styles: `
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .list-header .btn {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cust-div-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 24px;
      box-sizing: border-box;
      width: 100%;
    }

    .filter-controls-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    /* Target Material MDC form fields to match the provided styling */
    ::ng-deep .toolbar-select {
      width: 130px;
    }

    ::ng-deep .toolbar-select .mat-mdc-text-field-wrapper {
      background: #fff;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
      border-radius: 4px;
      height: 38px;
    }

    /* Hide the standard MDC outline border so shadow stands out */
    ::ng-deep .toolbar-select .mdc-notched-outline {
      display: none;
    }

    ::ng-deep .toolbar-select .mat-mdc-form-field-flex {
      padding: 0 10px;
      align-items: center;
      height: 100%;
    }

    ::ng-deep .toolbar-select .mat-mdc-select-value-text {
      font-size: 12px;
      color: #333;
    }

    /* The search box matching the exact size */
    .search-field {
      height: 38px;
      width: 220px;
      background: #fff;
      border-radius: 20px;
      box-shadow: inset 0 0 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      padding: 0 16px;

      input {
        border: none;
        outline: none;
        background: transparent;
        font-size: 13px;
        width: 100%;
      }
    }

    .icon-group {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .toolbar-icon-btn {
      color: #2196f3;
      width: 36px;
      height: 36px;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      
      &.dial-icon {
        color: #ff9800;
      }
    }

    .action-add-btn {
      color: #2196f3;
      font-weight: 500;
      font-size: 13px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background: #fafbfc;
      min-width: unset;
      padding: 0 16px;
      display: flex;
      align-items: center;
      height: 36px;
      
      mat-icon { font-size: 16px; width: 16px; height: 16px; display:flex; align-items:center; }
    }

    .table-card {
      padding: 0;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
      overflow: hidden;
    }

    .table-responsive { overflow-x: auto; }

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
      padding: 12px 16px;
      border-bottom: 2px solid #eee;
      white-space: nowrap;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 10;
    }

    .table td {
      padding: 12px 16px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #f2f2f2;
    }

    .table tbody tr:hover { background: #f7f7f7; }

    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-submitted { background: #e1f0ff; color: #094997; }
    .status-in_progress { background: #fef3c7; color: #c95817; }
    .status-reviewed { background: #e8fff5; color: #2da41a; }
    .status-link_sent { background: #f2f2f2; color: #646464; }
    .status-converted { background: #e1f3f5; color: #089bab; }
  `,
})
export class IntakeListPageComponent {
  searchTerm = '';
  statusFilter = 'all';

  rows: IntakeRow[] = [
    { id: '1', name: 'Jane Smith', phone: '(555) 123-4567', email: 'jane@example.com', status: 'submitted', statusLabel: 'Submitted', submitted: 'Apr 8, 2026' },
    { id: '2', name: 'Robert Johnson', phone: '(555) 234-5678', email: 'robert@example.com', status: 'in_progress', statusLabel: 'In Progress', submitted: 'Apr 8, 2026' },
    { id: '3', name: 'Maria Garcia', phone: '(555) 345-6789', email: 'maria@example.com', status: 'reviewed', statusLabel: 'Reviewed', submitted: 'Apr 7, 2026' },
    { id: '4', name: 'David Lee', phone: '(555) 456-7890', email: 'david@example.com', status: 'link_sent', statusLabel: 'Link Sent', submitted: 'Apr 7, 2026' },
    { id: '5', name: 'Sarah Williams', phone: '(555) 567-8901', email: 'sarah@example.com', status: 'converted', statusLabel: 'Converted', submitted: 'Apr 6, 2026' },
    { id: '6', name: 'Michael Brown', phone: '(555) 678-9012', email: 'michael@example.com', status: 'submitted', statusLabel: 'Submitted', submitted: 'Apr 6, 2026' },
    { id: '7', name: 'Emily Davis', phone: '(555) 789-0123', email: 'emily@example.com', status: 'reviewed', statusLabel: 'Reviewed', submitted: 'Apr 5, 2026' },
  ];

  filteredRows() {
    return this.rows.filter((r) => {
      const matchesStatus =
        this.statusFilter === 'all' || r.status === this.statusFilter;
      const term = this.searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        r.name.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term) ||
        r.phone.includes(term);
      return matchesStatus && matchesSearch;
    });
  }
}
