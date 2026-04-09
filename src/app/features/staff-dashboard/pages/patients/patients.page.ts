import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="cust-div-header">
      <div class="wdt-100 breadcrumb-container">
        <ol class="breadcrumb">
          <li>Applications &nbsp; | &nbsp;</li>
          <li class="active-page"> Population Dashboard </li>
        </ol>
      </div>

      <div class="filter-controls-row">
        <mat-form-field appearance="outline" class="toolbar-select">
          <mat-select placeholder="Care Managers">
            <mat-option value="all">All Care Managers</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="toolbar-select">
          <mat-select placeholder="Practitioners">
            <mat-option value="all">All Practitioners</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="toolbar-select clinic-input">
          <mat-select placeholder="Clinics">
            <mat-option value="all">All Clinics</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="toolbar-select">
          <mat-select placeholder="PODS">
            <mat-option value="all">All PODS</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="search-field">
          <input type="text" placeholder="Search Name">
        </div>

        <div class="icon-group">
          <button mat-icon-button class="toolbar-icon-btn"><mat-icon>person_search</mat-icon></button>
          <button mat-icon-button class="toolbar-icon-btn dial-icon"><mat-icon>dialpad</mat-icon></button>
          <button mat-icon-button class="toolbar-icon-btn"><mat-icon>refresh</mat-icon></button>
        </div>

        <mat-form-field appearance="outline" class="toolbar-select">
          <mat-select placeholder="Bulk Action" [disabled]="true">
            <mat-option value="bulk">Bulk Action</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="toolbar-select">
          <mat-select placeholder="Active" value="active">
            <mat-option value="active">Active</mat-option>
            <mat-option value="inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-button class="action-add-btn">
          Actions <mat-icon>add</mat-icon>
        </button>

        <button mat-icon-button class="menu-icon"><mat-icon>view_headline</mat-icon></button>
      </div>
    </div>

    <mat-card class="placeholder-card">
      <div class="no-data">
        <mat-icon>people</mat-icon>
        <p>
          Converted patients will appear here once intake forms are reviewed
          and processed. This view will connect to the main EMR patient
          records.
        </p>
      </div>
    </mat-card>
  `,
  styles: `
    .cust-div-header {
      display: flex;
      flex-direction: column;
      margin-bottom: 24px;
      box-sizing: border-box;
      width: 100%;
    }

    .breadcrumb-container {
      margin-bottom: 16px;
    }

    .breadcrumb {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      color: #666;
      font-size: 14px;
      font-weight: 400;
    }
    
    .active-page {
      color: #333;
      font-weight: 500;
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
      width: 180px;
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
      padding: 0 12px 0 16px;
      
      mat-icon { font-size: 16px; width: 16px; height: 16px; margin-left: 2px;}
    }

    .menu-icon {
      color: #777;
    }

    /* Placeholder styling */
    .placeholder-card {
      padding: 40px;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
      margin-top: 10px;
    }

    .no-data {
      text-align: center;
      color: #757575;
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #bababa;
      margin-bottom: 12px;
    }

    .no-data p {
      max-width: 400px;
      margin: 0 auto;
      line-height: 1.5;
    }
  `,
})
export class PatientsPageComponent {}
