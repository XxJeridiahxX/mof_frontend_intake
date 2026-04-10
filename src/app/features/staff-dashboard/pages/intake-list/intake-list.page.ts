import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface IntakeRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  statusLabel: string;
  submitted: string;
}

interface SectionDef {
  key: string;
  label: string;
  icon: string;
  fields: FieldDef[];
}
interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'select';
  span?: 'full';
  options?: string[];
}

const SECTIONS: SectionDef[] = [
  {
    key: 'demographicsForm', label: 'Patient Profile', icon: 'person',
    fields: [
      { key: 'firstName', label: 'First Name' }, { key: 'middleName', label: 'Middle' },
      { key: 'lastName', label: 'Last Name' },   { key: 'suffix', label: 'Suffix' },
      { key: 'dateOfBirth', label: 'DOB', type: 'date' },
      { key: 'sexAssigned', label: 'Sex', type: 'select', options: ['Male','Female','Intersex','Unknown','Prefer not to say'] },
      { key: 'genderIdentity', label: 'Gender ID', type: 'select', options: ['Man','Woman','Non-binary','Transgender man','Transgender woman','Genderqueer','Other','Prefer not to say'] },
      { key: 'ssn', label: 'SSN' },
      { key: 'race', label: 'Race', type: 'select', options: ['American Indian/Alaska Native','Asian','Black/African American','Native Hawaiian/Pacific Islander','White','Multiracial','Other','Unknown'] },
      { key: 'ethnicity', label: 'Ethnicity', type: 'select', options: ['Hispanic/Latino','Not Hispanic/Latino','Unknown'] },
      { key: 'maritalStatus', label: 'Marital', type: 'select', options: ['Single','Married','Divorced','Widowed','Separated','Domestic partner'] },
      { key: 'employmentStatus', label: 'Employment', type: 'select', options: ['Full-time','Part-time','Self-employed','Unemployed','Retired','Student','Disabled'] },
      { key: 'employerName', label: 'Employer' },
    ]
  },
  {
    key: 'contactForm', label: 'Contact', icon: 'contact_phone',
    fields: [
      { key: 'cellPhone', label: 'Cell' },   { key: 'homePhone', label: 'Home' },
      { key: 'workPhone', label: 'Work' },   { key: 'emailAddress', label: 'Email' },
      { key: 'mailingStreet', label: 'Street' }, { key: 'mailingCity', label: 'City' },
      { key: 'mailingState', label: 'State' },   { key: 'mailingZip', label: 'ZIP' },
      { key: 'bestContactMethod', label: 'Best Contact', type: 'select', options: ['Cell','Home','Work','Email','Text'] },
    ]
  },
  {
    key: 'insuranceForm', label: 'Insurance', icon: 'health_and_safety',
    fields: [
      { key: 'primaryCarrier', label: 'Carrier' },   { key: 'subscriberId', label: 'Member ID' },
      { key: 'groupNumber', label: 'Group #' },       { key: 'relationship', label: 'Relationship', type: 'select', options: ['Self','Spouse','Child','Other'] },
      { key: 'policyHolderFirstName', label: 'Holder First' },
      { key: 'policyHolderLastName',  label: 'Holder Last' },
      { key: 'policyHolderDob', label: 'Holder DOB', type: 'date' },
    ]
  },
  {
    key: 'visitForm', label: 'Chief Complaint', icon: 'medical_services',
    fields: [
      { key: 'chiefComplaint',  label: 'Chief Complaint',  type: 'textarea', span: 'full' },
      { key: 'currentSymptoms', label: 'Current Symptoms', type: 'textarea', span: 'full' },
      { key: 'symptomOnset',    label: 'Symptom Onset' },
    ]
  },
  {
    key: 'pharmacyForm', label: 'Pharmacy', icon: 'local_pharmacy',
    fields: [
      { key: 'localName', label: 'Name' },   { key: 'localPhone', label: 'Phone' },
      { key: 'localStreet', label: 'Street' }, { key: 'localCity', label: 'City' },
      { key: 'localState', label: 'State' },   { key: 'localZip', label: 'ZIP' },
    ]
  },
  {
    key: 'socialHistoryForm', label: 'Social History', icon: 'diversity_3',
    fields: [
      { key: 'usesTobacco', label: 'Tobacco', type: 'select', options: ['Yes','No','Former'] },
      { key: 'tobaccoFrequency', label: 'Frequency' },
      { key: 'usesDrugs', label: 'Drug Use', type: 'select', options: ['Yes','No','Former'] },
      { key: 'drugsTypes', label: 'Drug Types' },
      { key: 'exercises', label: 'Exercise', type: 'select', options: ['Yes','No','Sometimes'] },
      { key: 'exerciseType', label: 'Type' },
      { key: 'dietRating', label: 'Diet Rating', type: 'select', options: ['Poor','Fair','Good','Excellent'] },
    ]
  },
];

@Component({
  selector: 'app-intake-list-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatIconModule, MatButtonModule, MatMenuModule, MatProgressBarModule, MatTooltipModule,
  ],
  template: `
<div class="page-wrapper">

  <!-- ══ LIST PANEL ══ -->
  <div class="list-panel" [class.panel-shrunk]="!!reviewIntake()">

    <div class="list-header">
      <h1 class="page-title">Intake Forms</h1>
      <button mat-button class="action-add-btn">
        <mat-icon>send</mat-icon> Send New Intake
      </button>
    </div>

    <div class="cust-div-header">
      <div class="filter-controls-row">
        <div class="search-field">
          <mat-icon class="search-icon">search</mat-icon>
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
          <button mat-icon-button class="toolbar-icon-btn" (click)="fetchIntakes()" matTooltip="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </div>
    </div>

    <mat-card class="table-card">
      @if (loading()) { <mat-progress-bar mode="indeterminate" /> }
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Patient</th>
              <th class="hide-sm">Phone</th>
              <th class="hide-md">Email</th>
              <th>Status</th>
              <th class="hide-sm">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            @for (row of filteredRows(); track row.id) {
              <tr [class.row-active]="reviewIntake()?.id === row.id" (click)="openReview(row)">
                <td class="fw6">{{ row.name }}</td>
                <td class="hide-sm">{{ row.phone }}</td>
                <td class="hide-md">{{ row.email }}</td>
                <td>
                  <span class="status-badge status-{{ row.status }}">{{ row.statusLabel }}</span>
                </td>
                <td class="hide-sm muted">{{ row.submitted }}</td>
                <td class="action-col" (click)="$event.stopPropagation()">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="openReview(row)">
                      <mat-icon>assignment</mat-icon> Review Intake
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
              <tr><td colspan="6" class="no-data">No intake forms found.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </mat-card>
  </div>

  <!-- ══ CLOSE CONFIRMATION ══ -->
  @if (showCloseConfirm()) {
    <div class="confirm-backdrop">
      <div class="confirm-dialog">
        <div class="confirm-icon"><mat-icon>warning_amber</mat-icon></div>
        <h3 class="confirm-title">Close without saving?</h3>
        <p class="confirm-body">You have unsaved changes to this intake record. They will be lost if you close now.</p>
        <div class="confirm-actions">
          <button class="confirm-btn confirm-cancel" (click)="showCloseConfirm.set(false)">Keep Editing</button>
          <button class="confirm-btn confirm-discard" (click)="forceClose()">Discard &amp; Close</button>
        </div>
      </div>
    </div>
  }

  <!-- ══ REVIEW OVERLAY ══ -->
  @if (reviewIntake()) {
    <div class="overlay-backdrop" (click)="confirmClose()"></div>
    <div class="overlay-shell" role="dialog">

      <!-- ── Top bar ── -->
      <div class="ov-topbar">
        <div class="ov-patient">
          <span class="ov-name">{{ reviewIntake()!.name }}</span>
          <span class="ov-meta">ID #{{ reviewIntake()!.id }} &nbsp;·&nbsp; {{ reviewIntake()!.submitted }}</span>
        </div>
        <div class="ov-topbar-right">
          <span class="status-badge status-{{ rpStatus() }}">{{ rpStatusLabel() }}</span>
          @if (dirty()) { <span class="unsaved-dot" matTooltip="Unsaved changes">●</span> }
          <button class="ov-action-btn ov-btn-secondary" (click)="rpSave('in_progress', 'In Progress')" [disabled]="rpSaving()">
            <mat-icon>save</mat-icon> Save
          </button>
          <button class="ov-action-btn ov-btn-primary" (click)="rpSave('reviewed', 'Reviewed')" [disabled]="rpSaving()">
            <mat-icon>task_alt</mat-icon> Complete Review
          </button>
          <button class="ov-close-btn" (click)="confirmClose()" matTooltip="Close"><mat-icon>close</mat-icon></button>
        </div>
      </div>

      @if (rpLoading()) { <mat-progress-bar mode="indeterminate" color="accent" style="flex-shrink:0" /> }
      @if (rpError()) {
        <div class="ov-error-bar"><mat-icon>error_outline</mat-icon> {{ rpError() }}</div>
      }

      <!-- ── Body: nav sidebar + scrolling content ── -->
      <div class="ov-body">

        <!-- Section nav sidebar -->
        <nav class="ov-sidenav">
          @for (section of allNavSections; track section.key) {
            <button class="nav-item" [class.nav-active]="activeSection() === section.key" (click)="scrollToSection(section.key)">
              <mat-icon class="nav-icon">{{ section.icon }}</mat-icon>
              <span class="nav-label">{{ section.label }}</span>
              @if (sectionFillCount(section.key) > 0) {
                <span class="nav-badge">{{ sectionFillCount(section.key) }}</span>
              }
            </button>
          }
        </nav>

        <!-- Long scrolling content -->
        <div class="ov-content" id="ov-scroll-container" (scroll)="onContentScroll($event)">

          @for (section of sections; track section.key) {
            <div class="content-section" [id]="'section-' + section.key">
              <div class="content-section-header">
                <mat-icon class="cs-icon">{{ section.icon }}</mat-icon>
                <span class="cs-title">{{ section.label }}</span>
              </div>
              <div class="fields-grid">
                @for (field of section.fields; track field.key) {
                  <div class="field-cell" [class.span-full]="field.span === 'full'" [class.field-empty]="!getVal(section.key, field.key)">
                    <label class="field-label">{{ field.label }}</label>
                    @if (field.type === 'textarea') {
                      <textarea class="field-input field-textarea" rows="3"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)" placeholder="—"></textarea>
                    } @else if (field.type === 'select' && field.options) {
                      <input class="field-input field-search"
                        [attr.list]="'opts-' + section.key + '-' + field.key"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)" placeholder="—" autocomplete="off" />
                      <datalist [id]="'opts-' + section.key + '-' + field.key">
                        @for (opt of field.options; track opt) {
                          <option [value]="opt"></option>
                        }
                      </datalist>
                    } @else {
                      <input class="field-input"
                        [type]="field.type === 'date' ? 'date' : 'text'"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)" placeholder="—" />
                    }
                  </div>
                }
              </div>
              @if (section.key === 'insuranceForm' && (cardFrontUrl() || cardBackUrl())) {
                <div class="insurance-cards-row">
                  <span class="insurance-cards-label">Insurance Card Photos</span>
                  <div class="insurance-card-thumbs">
                    @if (cardFrontUrl()) {
                      <a [href]="cardFrontUrl()!" target="_blank" class="ins-card-link">
                        <div class="ins-card-wrap">
                          <img [src]="cardFrontUrl()!" class="ins-card-img" alt="Card front" />
                          <span class="ins-card-caption">Front</span>
                        </div>
                      </a>
                    }
                    @if (cardBackUrl()) {
                      <a [href]="cardBackUrl()!" target="_blank" class="ins-card-link">
                        <div class="ins-card-wrap">
                          <img [src]="cardBackUrl()!" class="ins-card-img" alt="Card back" />
                          <span class="ins-card-caption">Back</span>
                        </div>
                      </a>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- Clinicals always at bottom -->
          <div class="content-section" id="section-clinicals">
            <div class="content-section-header">
              <mat-icon class="cs-icon">biotech</mat-icon>
              <span class="cs-title">Clinicals</span>
            </div>
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>warning_amber</mat-icon> Allergies</div>
              @if (allergies().length) {
                <div class="chip-list">
                  @for (a of allergies(); track $index) {
                    <div class="chip chip-allergy"><span class="chip-name">{{ a.name }}</span>@if(a.reaction){<span class="chip-sub">→ {{ a.reaction }}</span>}</div>
                  }
                </div>
              } @else { <p class="clinical-empty">None recorded</p> }
            </div>
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>medication</mat-icon> Medications</div>
              @if (medications().length) {
                <div class="chip-list">
                  @for (m of medications(); track $index) {
                    <div class="chip chip-med"><span class="chip-name">{{ m.name }}</span>@if(m.dosage){<span class="chip-sub">{{ m.dosage }}</span>}@if(m.frequency){<span class="chip-sub">{{ m.frequency }}</span>}</div>
                  }
                </div>
              } @else { <p class="clinical-empty">None recorded</p> }
            </div>
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>cut</mat-icon> Surgical History</div>
              @if (surgeries().length) {
                <div class="chip-list">
                  @for (s of surgeries(); track $index) {
                    <div class="chip chip-surgery"><span class="chip-name">{{ s.type }}</span>@if(s.date){<span class="chip-sub">{{ s.date }}</span>}</div>
                  }
                </div>
              } @else { <p class="clinical-empty">None recorded</p> }
            </div>
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>family_restroom</mat-icon> Family History</div>
              @if (familyConditions().length) {
                <div class="chip-list">
                  @for (f of familyConditions(); track $index) {
                    <div class="chip chip-family"><span class="chip-name">{{ f.diagnosis }}</span>@if(f.member){<span class="chip-sub">{{ f.member }}</span>}</div>
                  }
                </div>
              } @else { <p class="clinical-empty">None recorded</p> }
            </div>
          </div>

          <div style="height: 40px"></div>
        </div>

      </div>
    </div>
  }

</div>
  `,
  styles: `
    .page-wrapper { display: flex; height: 100%; overflow: hidden; position: relative; }

    /* ══ LIST PANEL ══ */
    .list-panel { flex: 1; overflow-y: auto; padding: 0; }

    .list-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px; flex-wrap: wrap; gap: 12px;
    }
    .page-title { font-size: 24px; font-weight: 600; color: #333; margin: 0; }

    .cust-div-header { display: flex; flex-direction: column; margin-bottom: 16px; }
    .filter-controls-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }

    ::ng-deep .toolbar-select { width: 130px; }
    ::ng-deep .toolbar-select .mat-mdc-text-field-wrapper {
      background: #fff; box-shadow: rgb(221,221,221) 0 0 10px 0; border-radius: 4px; height: 38px;
    }
    ::ng-deep .toolbar-select .mdc-notched-outline { display: none; }
    ::ng-deep .toolbar-select .mat-mdc-form-field-flex { padding: 0 10px; align-items: center; height: 100%; }
    ::ng-deep .toolbar-select .mat-mdc-select-value-text { font-size: 12px; color: #333; }

    .search-field {
      height: 38px; width: 220px; background: #fff; border-radius: 20px;
      box-shadow: inset 0 0 4px rgba(0,0,0,0.1); display: flex; align-items: center;
      border: 1px solid #ccc; padding: 0 16px; gap: 4px;
      input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; }
    }
    .search-icon { color: #777; font-size: 20px; width: 20px; height: 20px; }

    .icon-group { display: flex; align-items: center; gap: 4px; }
    .toolbar-icon-btn { color: #2196f3; width: 36px; height: 36px; mat-icon { font-size: 20px; width: 20px; height: 20px; } }

    .action-add-btn {
      color: #2196f3; font-weight: 500; font-size: 13px;
      border: 1px solid #e0e0e0; border-radius: 4px; background: #fafbfc;
      min-width: unset; padding: 0 16px; display: flex; align-items: center; height: 36px;
      mat-icon { font-size: 16px; width: 16px; height: 16px; margin-right: 6px; }
    }

    .table-card { padding: 0; box-shadow: rgb(221,221,221) 0 0 10px 0; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    .table { width: 100%; border-collapse: collapse; }
    .table th {
      text-align: left; font-size: 11px; font-weight: 700; color: #757575;
      text-transform: uppercase; padding: 10px 14px; border-bottom: 2px solid #eee;
      white-space: nowrap; background: #fff; z-index: 10;
    }
    .table td { padding: 10px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #f2f2f2; }
    .table tbody tr { cursor: pointer; transition: background 0.1s; }
    .table tbody tr:hover { background: #f0f4ff; }
    .table tbody tr.row-active { background: #e8f0ff; }
    .muted { color: #999; font-size: 12px; }
    .action-col { width: 40px; }

    @media (max-width: 900px) { .hide-md { display: none; } }
    @media (max-width: 600px) { .hide-sm { display: none; } }

    .status-badge {
      display: inline-block; padding: 2px 8px; border-radius: 12px;
      font-size: 11px; font-weight: 600; white-space: nowrap;
    }
    .status-submitted   { background: #e1f0ff; color: #094997; }
    .status-in_progress { background: #fef3c7; color: #c95817; }
    .status-reviewed    { background: #e8fff5; color: #2da41a; }
    .status-link_sent   { background: #f2f2f2; color: #646464; }
    .status-converted   { background: #e1f3f5; color: #089bab; }
    .no-data { text-align: center; color: #999; padding: 40px; }

    /* ══ CLOSE CONFIRMATION ══ */
    .confirm-backdrop {
      position: fixed; inset: 0; z-index: 300;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.55); animation: fadeIn 0.15s ease;
    }
    .confirm-dialog {
      background: white; border-radius: 10px; padding: 28px 28px 20px;
      max-width: 380px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center; animation: popIn 0.18s ease;
    }
    .confirm-icon mat-icon { font-size: 40px; width: 40px; height: 40px; color: #f59e0b; }
    .confirm-title { font-size: 17px; font-weight: 700; color: #1a1a2e; margin: 10px 0 6px; }
    .confirm-body { font-size: 13px; color: #646464; line-height: 1.5; margin: 0 0 20px; }
    .confirm-actions { display: flex; gap: 10px; }
    .confirm-btn {
      flex: 1; height: 38px; border-radius: 6px; font-size: 13px; font-weight: 600;
      cursor: pointer; border: none; transition: background 0.15s; font-family: inherit;
    }
    .confirm-cancel { background: #f0f4ff; color: #094997; border: 1px solid #c7d6f5; }
    .confirm-cancel:hover { background: #dce8ff; }
    .confirm-discard { background: #d32f2f; color: white; }
    .confirm-discard:hover { background: #b71c1c; }

    /* ══ OVERLAY ══ */
    .overlay-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 200; animation: fadeIn 0.18s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .overlay-shell {
      position: fixed; inset: 24px; z-index: 201;
      background: #f4f6f9; border-radius: 12px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.35);
      display: flex; flex-direction: column; overflow: hidden;
      animation: popIn 0.2s ease;
    }
    @keyframes popIn { from { transform: scale(0.97); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @media (max-width: 640px) { .overlay-shell { inset: 0; border-radius: 0; } }

    /* Top bar */
    .ov-topbar {
      display: flex; align-items: center; justify-content: space-between;
      background: white; border-bottom: 1px solid #e8eaed;
      padding: 10px 18px; gap: 12px; flex-shrink: 0;
    }
    .ov-patient { min-width: 0; }
    .ov-name { font-size: 16px; font-weight: 700; color: #1a1a2e; display: block; }
    .ov-meta { font-size: 11px; color: #888; display: block; margin-top: 1px; }
    .ov-topbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
    .unsaved-dot { color: #f59e0b; font-size: 20px; line-height: 1; }

    .ov-action-btn {
      display: flex; align-items: center; gap: 5px; padding: 0 14px; height: 34px;
      border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; border: none;
      transition: background 0.15s; white-space: nowrap;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .ov-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .ov-btn-secondary { background: #f0f4ff; color: #094997; border: 1px solid #c7d6f5; }
    .ov-btn-secondary:hover:not(:disabled) { background: #dce8ff; }
    .ov-btn-primary { background: #094997; color: white; }
    .ov-btn-primary:hover:not(:disabled) { background: #0a3f7f; }
    .ov-close-btn {
      display: flex; align-items: center; justify-content: center;
      background: none; border: none; cursor: pointer; border-radius: 50%;
      width: 34px; height: 34px; color: #555; transition: background 0.15s;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
    .ov-close-btn:hover { background: #f0f0f0; }

    .ov-error-bar {
      background: #fff0f0; border-bottom: 1px solid #f44336; color: #d32f2f;
      font-size: 12px; padding: 7px 18px; display: flex; align-items: center; gap: 6px; flex-shrink: 0;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    /* Body: sidenav + content */
    .ov-body { display: flex; flex: 1; min-height: 0; }

    /* Section sidenav */
    .ov-sidenav {
      width: 188px; flex-shrink: 0; background: #1e2a3b;
      overflow-y: auto; display: flex; flex-direction: column; padding: 8px 0;
    }
    @media (max-width: 640px) { .ov-sidenav { display: none; } }

    .nav-item {
      display: flex; align-items: center; gap: 9px; width: 100%;
      padding: 9px 14px; background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,0.62); text-align: left; transition: background 0.12s, color 0.12s;
      border-left: 3px solid transparent; font-family: inherit;
    }
    .nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
    .nav-item.nav-active { background: rgba(8,155,171,0.18); color: white; border-left-color: #089bab; }
    .nav-icon { font-size: 17px; width: 17px; height: 17px; flex-shrink: 0; }
    .nav-label { font-size: 12px; font-weight: 500; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .nav-badge {
      background: #089bab; color: white; font-size: 10px; font-weight: 700;
      border-radius: 10px; padding: 1px 6px; min-width: 18px; text-align: center;
    }

    /* Content area */
    .ov-content { flex: 1; overflow-y: auto; min-width: 0; scroll-behavior: smooth; }
    .content-section { padding: 16px 16px 8px; }
    .content-section-header {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #e8eaed;
    }
    .cs-icon { font-size: 18px; width: 18px; height: 18px; color: #089bab; }
    .cs-title { font-size: 13px; font-weight: 700; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.5px; }

    .fields-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1px; background: #e0e4ea; border-radius: 8px; overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .field-cell { background: white; padding: 8px 12px; display: flex; flex-direction: column; gap: 3px; }
    .field-cell.span-full { grid-column: 1 / -1; }
    .field-cell.field-empty { background: #f9fafb; }
    .field-cell.field-empty .field-input { color: #c0c8d4; }
    .field-label { font-size: 9px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px; }
    .field-input {
      font-size: 13px; color: #1a1a2e; font-weight: 500; border: none; outline: none;
      background: transparent; width: 100%; border-bottom: 1px solid transparent;
      transition: border-color 0.15s; padding: 2px 0; font-family: inherit;
    }
    .field-input:focus { border-bottom-color: #089bab; }
    .field-textarea { resize: vertical; min-height: 48px; }
    .field-search { cursor: pointer; }
    .field-search::-webkit-calendar-picker-indicator { opacity: 0; }

    /* Insurance card inline */
    .insurance-cards-row {
      margin-top: 10px; padding: 10px 12px; background: #f8f9fb;
      border-radius: 8px; border: 1px solid #e0e4ea;
    }
    .insurance-cards-label { font-size: 9px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px; display: block; margin-bottom: 8px; }
    .insurance-card-thumbs { display: flex; gap: 14px; flex-wrap: wrap; }
    .ins-card-link { text-decoration: none; }
    .ins-card-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .ins-card-img { height: 80px; width: auto; max-width: 140px; border-radius: 6px; border: 1px solid #ddd; object-fit: cover; display: block; box-shadow: 0 2px 6px rgba(0,0,0,0.1); transition: transform 0.15s; }
    .ins-card-img:hover { transform: scale(1.03); }
    .ins-card-caption { font-size: 10px; color: #666; font-weight: 500; }

    /* Clinicals */
    .clinical-block { background: white; border-radius: 8px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .clinical-block-title {
      display: flex; align-items: center; gap: 7px; padding: 8px 14px;
      font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;
      letter-spacing: 0.5px; background: #f8f9fb; border-bottom: 1px solid #eee;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #089bab; }
    }
    .clinical-empty { color: #bbb; font-size: 12px; padding: 10px 14px; margin: 0; font-style: italic; }
    .chip-list { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; }
    .chip { display: flex; align-items: center; gap: 5px; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 500; }
    .chip-allergy { background: #fff0f0; color: #d32f2f; border: 1px solid #fcc; }
    .chip-med     { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
    .chip-surgery { background: #fff8e1; color: #c95817; border: 1px solid #ffe082; }
    .chip-family  { background: #f3e5f5; color: #6a1b9a; border: 1px solid #ce93d8; }
    .chip-name { font-weight: 600; }
    .chip-sub  { opacity: 0.75; font-size: 11px; }
  `,
})
export class IntakeListPageComponent implements OnInit {
  sections = SECTIONS;

  searchTerm = '';
  statusFilter = 'all';
  rows = signal<IntakeRow[]>([]);
  loading = signal(true);

  // Review overlay state
  reviewIntake = signal<IntakeRow | null>(null);
  activeSection = signal<string>('basic');
  rpLoading = signal(false);
  rpSaving  = signal(false);
  rpError   = signal('');
  rpStatus  = signal('submitted');
  rpStatusLabel = signal('Submitted');
  dirty = signal(false);
  cardFrontUrl = signal<string | null>(null);
  cardBackUrl  = signal<string | null>(null);
  editState: Record<string, any> = {};
  rawData: any = {};
  allergies        = signal<any[]>([]);
  medications      = signal<any[]>([]);
  surgeries        = signal<any[]>([]);
  familyConditions = signal<any[]>([]);

  // All nav entries including the clinicals catch-all
  allNavSections = [
    ...SECTIONS,
    { key: 'clinicals', label: 'Clinicals', icon: 'biotech', fields: [] },
  ];

  scrollToSection(key: string) {
    this.activeSection.set(key);
    // Small delay lets Angular render if content just loaded
    setTimeout(() => {
      const el = document.getElementById(`section-${key}`);
      const container = document.getElementById('ov-scroll-container');
      if (el && container) {
        container.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
      }
    }, 50);
  }

  onContentScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollTop = container.scrollTop;
    const keys = [...this.sections.map(s => s.key), 'clinicals'];
    let current = keys[0];
    for (const key of keys) {
      const el = document.getElementById(`section-${key}`);
      if (el && el.offsetTop - 32 <= scrollTop) current = key;
    }
    this.activeSection.set(current);
  }

  sectionFillCount(sectionKey: string): number {
    if (sectionKey === 'clinicals') {
      return this.allergies().length + this.medications().length + this.surgeries().length + this.familyConditions().length;
    }
    const section = SECTIONS.find(s => s.key === sectionKey);
    if (!section) return 0;
    return section.fields.filter(f => {
      const v = this.editState[`${sectionKey}.${f.key}`];
      return v !== null && v !== undefined && v !== '';
    }).length;
  }

  ngOnInit() { this.fetchIntakes(); }

  async fetchIntakes() {
    this.loading.set(true);
    try {
      const res = await fetch('/api/getIntakes');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      this.rows.set((data.intakes || []).map((i: any) => ({
        id: i.id?.toString() ?? Math.random().toString(),
        name: `${i.first_name} ${i.last_name}`,
        phone: i.phone, email: i.email,
        status: i.status || 'submitted',
        statusLabel: i.status_label || 'Submitted',
        submitted: new Date(i.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })));
    } catch { /* silent */ }
    finally { this.loading.set(false); }
  }

  filteredRows() {
    return this.rows().filter(r => {
      const matchStatus = this.statusFilter === 'all' || r.status === this.statusFilter;
      const term = this.searchTerm.toLowerCase();
      const matchSearch = !term || r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term) || r.phone.includes(term);
      return matchStatus && matchSearch;
    });
  }

  async openReview(row: IntakeRow) {
    this.reviewIntake.set(row);
    this.activeSection.set('demographicsForm');
    setTimeout(() => {
      const c = document.getElementById('ov-scroll-container');
      if (c) c.scrollTop = 0;
    }, 50);
    this.dirty.set(false);
    this.rpError.set('');
    this.editState = {};
    this.rpLoading.set(true);

    try {
      const res = await fetch(`/api/getIntakeById?id=${row.id}`);
      if (!res.ok) throw new Error('Not found');
      const { intake } = await res.json();

      this.rpStatus.set(intake.status || 'submitted');
      this.rpStatusLabel.set(intake.status_label || 'Submitted');
      this.rawData = intake.raw_data || {};

      this.cardFrontUrl.set(intake.raw_data?.insuranceCardFrontUrl || null);
      this.cardBackUrl.set(intake.raw_data?.insuranceCardBackUrl   || null);
      this.allergies.set(intake.raw_data?.allergiesMedicationsForm?.allergies || []);
      this.medications.set(intake.raw_data?.allergiesMedicationsForm?.medications || []);
      this.surgeries.set(intake.raw_data?.medicalHistoryForm?.surgeries || []);
      this.familyConditions.set(intake.raw_data?.familyHistoryForm?.familyConditions || []);

      SECTIONS.forEach(section => {
        const src = section.key === 'basic' ? intake.raw_data : (intake.raw_data?.[section.key] || {});
        section.fields.forEach(f => {
          this.editState[`${section.key}.${f.key}`] = src?.[f.key] ?? '';
        });
      });
    } catch {
      this.rpError.set('Failed to load intake details.');
    } finally {
      this.rpLoading.set(false);
    }
  }

  showCloseConfirm = signal(false);

  confirmClose() {
    if (this.dirty()) {
      this.showCloseConfirm.set(true);
    } else {
      this.closeReview();
    }
  }

  forceClose() {
    this.showCloseConfirm.set(false);
    this.closeReview();
  }

  closeReview() { this.reviewIntake.set(null); this.dirty.set(false); }

  getVal(sectionKey: string, fieldKey: string): any {
    return this.editState[`${sectionKey}.${fieldKey}`];
  }

  hasData(section: SectionDef): boolean {
    return section.fields.some(f => {
      const v = this.editState[`${section.key}.${f.key}`];
      return v !== null && v !== undefined && v !== '';
    });
  }

  async rpSave(status: string, statusLabel: string) {
    this.rpSaving.set(true);
    this.rpError.set('');

    const updatedRaw = { ...this.rawData };
    SECTIONS.forEach(section => {
      if (section.key === 'basic') {
        section.fields.forEach(f => { updatedRaw[f.key] = this.editState[`${section.key}.${f.key}`]; });
      } else {
        if (!updatedRaw[section.key]) updatedRaw[section.key] = {};
        section.fields.forEach(f => { updatedRaw[section.key][f.key] = this.editState[`${section.key}.${f.key}`]; });
      }
    });

    try {
      const res = await fetch('/api/updateIntake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: this.reviewIntake()!.id, status, status_label: statusLabel, raw_data: updatedRaw }),
      });
      if (!res.ok) throw new Error('Save failed');

      this.rpStatus.set(status);
      this.rpStatusLabel.set(statusLabel);
      this.dirty.set(false);

      // Update the row in the list
      this.rows.update(rows => rows.map(r =>
        r.id === this.reviewIntake()!.id ? { ...r, status, statusLabel } : r
      ));

      if (status === 'reviewed') this.closeReview();
    } catch {
      this.rpError.set('Could not save. Please try again.');
    } finally {
      this.rpSaving.set(false);
    }
  }
}
