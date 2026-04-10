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
  type?: 'text' | 'date' | 'textarea';
  span?: 'full';
}

const SECTIONS: SectionDef[] = [
  {
    key: 'basic', label: 'Initial Intake', icon: 'assignment_ind',
    fields: [
      { key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },           { key: 'phone', label: 'Phone' },
      { key: 'dateOfBirth', label: 'DOB', type: 'date' },
      { key: 'preferredTime', label: 'Preferred Appt' },
      { key: 'chiefComplaint',  label: 'Chief Complaint',  type: 'textarea', span: 'full' },
      { key: 'currentSymptoms', label: 'Current Symptoms', type: 'textarea', span: 'full' },
      { key: 'symptomOnset',    label: 'Symptom Onset' },
    ]
  },
  {
    key: 'demographicsForm', label: 'Patient Profile', icon: 'person',
    fields: [
      { key: 'firstName', label: 'First Name' }, { key: 'middleName', label: 'Middle' },
      { key: 'lastName', label: 'Last Name' },   { key: 'suffix', label: 'Suffix' },
      { key: 'dateOfBirth', label: 'DOB', type: 'date' },
      { key: 'sexAssigned', label: 'Sex' },      { key: 'genderIdentity', label: 'Gender ID' },
      { key: 'ssn', label: 'SSN' },              { key: 'race', label: 'Race' },
      { key: 'ethnicity', label: 'Ethnicity' },  { key: 'maritalStatus', label: 'Marital' },
      { key: 'employmentStatus', label: 'Employment' }, { key: 'employerName', label: 'Employer' },
    ]
  },
  {
    key: 'contactForm', label: 'Contact', icon: 'contact_phone',
    fields: [
      { key: 'cellPhone', label: 'Cell' },   { key: 'homePhone', label: 'Home' },
      { key: 'workPhone', label: 'Work' },   { key: 'emailAddress', label: 'Email' },
      { key: 'mailingStreet', label: 'Street' }, { key: 'mailingCity', label: 'City' },
      { key: 'mailingState', label: 'State' },   { key: 'mailingZip', label: 'ZIP' },
      { key: 'bestContactMethod', label: 'Best Contact' },
    ]
  },
  {
    key: 'insuranceForm', label: 'Insurance', icon: 'health_and_safety',
    fields: [
      { key: 'primaryCarrier', label: 'Carrier' },   { key: 'subscriberId', label: 'Member ID' },
      { key: 'groupNumber', label: 'Group #' },       { key: 'relationship', label: 'Relationship' },
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
      { key: 'usesTobacco', label: 'Tobacco' },    { key: 'tobaccoFrequency', label: 'Frequency' },
      { key: 'usesDrugs', label: 'Drug Use' },     { key: 'drugsTypes', label: 'Drug Types' },
      { key: 'exercises', label: 'Exercise' },     { key: 'exerciseType', label: 'Type' },
      { key: 'dietRating', label: 'Diet Rating' },
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

  <!-- ══ REVIEW PANEL ══ -->
  @if (reviewIntake()) {
    <div class="review-panel">

      <!-- Panel header -->
      <div class="rp-header">
        <div class="rp-title-block">
          <span class="rp-name">{{ reviewIntake()!.name }}</span>
          <span class="rp-meta">ID #{{ reviewIntake()!.id }} &nbsp;·&nbsp; {{ reviewIntake()!.submitted }}</span>
        </div>
        <div class="rp-header-right">
          <span class="status-badge status-{{ rpStatus() }}">{{ rpStatusLabel() }}</span>
          @if (dirty()) { <span class="unsaved-dot" matTooltip="Unsaved changes">●</span> }
          <button class="rp-close-btn" (click)="closeReview()" matTooltip="Close"><mat-icon>close</mat-icon></button>
        </div>
      </div>

      @if (rpLoading()) { <mat-progress-bar mode="indeterminate" color="accent" /> }

      @if (rpError()) {
        <div class="rp-error-bar"><mat-icon>error_outline</mat-icon> {{ rpError() }}</div>
      }

      <!-- Insurance card thumbnails -->
      @if (cardFrontUrl() || cardBackUrl()) {
        <div class="card-images-bar">
          @if (cardFrontUrl()) {
            <a [href]="cardFrontUrl()!" target="_blank" class="card-thumb-link">
              <img [src]="cardFrontUrl()!" class="card-thumb" alt="Card front" />
              <span class="card-thumb-label">Front</span>
            </a>
          }
          @if (cardBackUrl()) {
            <a [href]="cardBackUrl()!" target="_blank" class="card-thumb-link">
              <img [src]="cardBackUrl()!" class="card-thumb" alt="Card back" />
              <span class="card-thumb-label">Back</span>
            </a>
          }
        </div>
      }

      <!-- Sections -->
      <div class="rp-scroll">
        @for (section of sections; track section.key) {
          <div class="section-block">
            <div class="section-header">
              <mat-icon class="section-icon">{{ section.icon }}</mat-icon>
              <span class="section-label">{{ section.label }}</span>
            </div>
              <div class="fields-grid">
                @for (field of section.fields; track field.key) {
                  <div class="field-cell" [class.span-full]="field.span === 'full'" [class.field-empty]="!getVal(section.key, field.key)">
                    <label class="field-label">{{ field.label }}</label>
                    @if (field.type === 'textarea') {
                      <textarea class="field-input field-textarea" rows="2"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)"
                        placeholder="—"></textarea>
                    } @else {
                      <input class="field-input"
                        [type]="field.type === 'date' ? 'date' : 'text'"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)"
                        placeholder="—" />
                    }
                  </div>
                }
            </div>
          </div>
        }

        @if (allergies().length) {
          <div class="section-block">
            <div class="section-header"><mat-icon class="section-icon">warning_amber</mat-icon><span class="section-label">Allergies</span></div>
            <div class="chip-list">
              @for (a of allergies(); track $index) {
                <div class="chip chip-allergy"><span class="chip-name">{{ a.name }}</span>@if(a.reaction){<span class="chip-sub">→ {{ a.reaction }}</span>}</div>
              }
            </div>
          </div>
        }
        @if (medications().length) {
          <div class="section-block">
            <div class="section-header"><mat-icon class="section-icon">medication</mat-icon><span class="section-label">Medications</span></div>
            <div class="chip-list">
              @for (m of medications(); track $index) {
                <div class="chip chip-med"><span class="chip-name">{{ m.name }}</span>@if(m.dosage){<span class="chip-sub">{{ m.dosage }}</span>}@if(m.frequency){<span class="chip-sub">{{ m.frequency }}</span>}</div>
              }
            </div>
          </div>
        }
        @if (surgeries().length) {
          <div class="section-block">
            <div class="section-header"><mat-icon class="section-icon">cut</mat-icon><span class="section-label">Surgical History</span></div>
            <div class="chip-list">
              @for (s of surgeries(); track $index) {
                <div class="chip chip-surgery"><span class="chip-name">{{ s.type }}</span>@if(s.date){<span class="chip-sub">{{ s.date }}</span>}</div>
              }
            </div>
          </div>
        }
        @if (familyConditions().length) {
          <div class="section-block">
            <div class="section-header"><mat-icon class="section-icon">family_restroom</mat-icon><span class="section-label">Family History</span></div>
            <div class="chip-list">
              @for (f of familyConditions(); track $index) {
                <div class="chip chip-family"><span class="chip-name">{{ f.diagnosis }}</span>@if(f.member){<span class="chip-sub">{{ f.member }}</span>}</div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Panel footer actions -->
      <div class="rp-footer">
        <button class="rp-btn rp-btn-secondary" (click)="rpSave('in_progress', 'In Progress')" [disabled]="rpSaving()">
          <mat-icon>save</mat-icon> Save for Later
        </button>
        <button class="rp-btn rp-btn-primary" (click)="rpSave('reviewed', 'Reviewed')" [disabled]="rpSaving()">
          <mat-icon>task_alt</mat-icon> Complete Review
        </button>
      </div>

    </div>
  }

</div>
  `,
  styles: `
    .page-wrapper { display: flex; height: 100%; overflow: hidden; }

    /* ══ LIST PANEL ══ */
    .list-panel {
      flex: 1; overflow-y: auto; padding: 0;
      transition: flex 0.25s ease; min-width: 0;
    }
    .list-panel.panel-shrunk { flex: 0 0 420px; }
    @media (max-width: 900px) {
      .list-panel.panel-shrunk { display: none; }
    }

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

    /* ══ REVIEW PANEL ══ */
    .review-panel {
      width: 520px; flex-shrink: 0; border-left: 1px solid #e0e4ea;
      background: #f4f6f9; display: flex; flex-direction: column;
      height: 100%; overflow: hidden; animation: slideIn 0.22s ease;
    }
    @media (max-width: 900px) { .review-panel { width: 100%; border-left: none; } }
    @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    /* Panel header */
    .rp-header {
      display: flex; align-items: center; justify-content: space-between;
      background: white; border-bottom: 1px solid #e8eaed;
      padding: 10px 14px; gap: 8px; flex-shrink: 0;
    }
    .rp-title-block { min-width: 0; }
    .rp-name { font-size: 15px; font-weight: 700; color: #1a1a2e; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rp-meta { font-size: 11px; color: #888; display: block; margin-top: 1px; }
    .rp-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .unsaved-dot { color: #f59e0b; font-size: 18px; }
    .rp-close-btn {
      display: flex; align-items: center; justify-content: center;
      background: none; border: none; cursor: pointer; border-radius: 50%;
      width: 32px; height: 32px; color: #555; transition: background 0.15s;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }
    .rp-close-btn:hover { background: #f0f0f0; }

    .rp-error-bar {
      background: #fff0f0; border-bottom: 1px solid #f44336; color: #d32f2f;
      font-size: 12px; padding: 7px 14px; display: flex; align-items: center; gap: 6px; flex-shrink: 0;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }

    /* Insurance card images */
    .card-images-bar {
      display: flex; gap: 10px; padding: 8px 14px;
      background: white; border-bottom: 1px solid #eee; flex-shrink: 0;
    }
    .card-thumb-link { display: flex; flex-direction: column; align-items: center; gap: 3px; text-decoration: none; }
    .card-thumb { height: 52px; width: auto; max-width: 90px; border-radius: 4px; border: 1px solid #ddd; object-fit: cover; }
    .card-thumb-label { font-size: 10px; color: #777; }

    /* Scroll area */
    .rp-scroll { flex: 1; overflow-y: auto; padding: 10px 12px 16px; }

    .section-block {
      background: white; border-radius: 7px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 8px; overflow: hidden;
    }
    .section-header {
      display: flex; align-items: center; gap: 7px;
      padding: 6px 12px; background: #f8f9fb; border-bottom: 1px solid #eee;
    }
    .section-icon { font-size: 15px; width: 15px; height: 15px; color: #089bab; }
    .section-label { font-size: 11px; font-weight: 700; color: #333; text-transform: uppercase; letter-spacing: 0.5px; }

    .fields-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1px; background: #eee;
    }
    .field-cell { background: white; padding: 6px 10px; display: flex; flex-direction: column; gap: 2px; }
    .field-cell.span-full { grid-column: 1 / -1; }
    .field-cell.field-empty { background: #fafafa; }
    .field-cell.field-empty .field-input { color: #bbb; }
    .field-label { font-size: 9px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.5px; }
    .field-input {
      font-size: 12px; color: #1a1a2e; font-weight: 500; border: none; outline: none;
      background: transparent; width: 100%; border-bottom: 1px solid transparent;
      transition: border-color 0.15s; padding: 1px 0; font-family: inherit;
    }
    .field-input:focus { border-bottom-color: #089bab; }
    .field-textarea { resize: vertical; min-height: 40px; }

    .chip-list { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 12px; }
    .chip {
      display: flex; align-items: center; gap: 5px; border-radius: 20px;
      padding: 3px 10px; font-size: 11px; font-weight: 500;
    }
    .chip-allergy { background: #fff0f0; color: #d32f2f; border: 1px solid #fcc; }
    .chip-med     { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
    .chip-surgery { background: #fff8e1; color: #c95817; border: 1px solid #ffe082; }
    .chip-family  { background: #f3e5f5; color: #6a1b9a; border: 1px solid #ce93d8; }
    .chip-name { font-weight: 600; }
    .chip-sub  { opacity: 0.75; }

    /* Panel footer */
    .rp-footer {
      display: flex; gap: 10px; padding: 12px 14px;
      background: white; border-top: 1px solid #e8eaed; flex-shrink: 0;
    }
    .rp-btn {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
      height: 38px; border-radius: 6px; font-size: 13px; font-weight: 600;
      cursor: pointer; border: none; transition: background 0.15s;
      mat-icon { font-size: 17px; width: 17px; height: 17px; }
    }
    .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .rp-btn-secondary { background: #f0f4ff; color: #094997; border: 1px solid #c7d6f5; }
    .rp-btn-secondary:hover:not(:disabled) { background: #dce8ff; }
    .rp-btn-primary { background: #094997; color: white; }
    .rp-btn-primary:hover:not(:disabled) { background: #0a3f7f; }
  `,
})
export class IntakeListPageComponent implements OnInit {
  sections = SECTIONS;

  searchTerm = '';
  statusFilter = 'all';
  rows = signal<IntakeRow[]>([]);
  loading = signal(true);

  // Review panel state
  reviewIntake = signal<IntakeRow | null>(null);
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

  closeReview() { this.reviewIntake.set(null); }

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
