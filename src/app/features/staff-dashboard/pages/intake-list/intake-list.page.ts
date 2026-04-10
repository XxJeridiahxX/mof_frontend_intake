import { Component, signal, OnInit } from '@angular/core';
import { upload } from '@vercel/blob/client';
import { IntakePdfService } from '../../../../core/services/intake-pdf.service';
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

    <h1 class="page-title">Intake Forms</h1>

    <div class="toolbar-row">
      <div class="search-field">
        <mat-icon class="search-icon">search</mat-icon>
        <input type="text" [(ngModel)]="searchTerm" placeholder="Name, email, phone">
      </div>

      <mat-form-field appearance="outline" class="toolbar-select">
        <mat-select placeholder="Status" [(ngModel)]="statusFilter">
          <mat-option value="all">All Statuses</mat-option>
          <mat-option value="link_sent">Link Sent</mat-option>
          <mat-option value="in_progress">In Progress</mat-option>
          <mat-option value="submitted">Submitted</mat-option>
          <mat-option value="reviewed">Reviewed</mat-option>
          <mat-option value="converted">Converted</mat-option>
        </mat-select>
      </mat-form-field>

      <button class="toolbar-icon-btn" (click)="fetchIntakes()" matTooltip="Refresh">
        <mat-icon>refresh</mat-icon>
      </button>

      <div class="toolbar-divider"></div>

      <button class="action-add-btn">
        <mat-icon>send</mat-icon> Send New Intake
      </button>
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
          <button class="ov-action-btn ov-btn-pdf" (click)="previewPdf()">
            <mat-icon>picture_as_pdf</mat-icon> Preview PDF
          </button>
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
                      <select class="field-input field-select"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)">
                        <option value="">—</option>
                        @for (opt of field.options; track opt) {
                          <option [value]="opt">{{ opt }}</option>
                        }
                      </select>
                    } @else {
                      <input class="field-input"
                        [type]="field.type === 'date' ? 'date' : 'text'"
                        [(ngModel)]="editState[section.key + '.' + field.key]"
                        (ngModelChange)="dirty.set(true)" placeholder="—" />
                    }
                  </div>
                }
              </div>
              @if (section.key === 'insuranceForm') {
                <!-- Hidden file inputs -->
                <input id="staff-card-front-input" type="file" accept="image/*" style="display:none" (change)="uploadCard('front', $event)" />
                <input id="staff-card-back-input"  type="file" accept="image/*" style="display:none" (change)="uploadCard('back', $event)" />

                <div class="insurance-cards-row">
                  <span class="insurance-cards-label">Insurance Card Photos</span>
                  <div class="insurance-card-thumbs">

                    <!-- Front -->
                    <div class="ins-card-slot">
                      @if (cardFrontUrl()) {
                        <a [href]="cardFrontUrl()!" target="_blank" class="ins-card-link">
                          <img [src]="cardFrontUrl()!" class="ins-card-img" alt="Card front" />
                        </a>
                      } @else {
                        <div class="ins-card-placeholder"><mat-icon>add_photo_alternate</mat-icon></div>
                      }
                      @if (cardFrontUploading()) {
                        <mat-progress-bar mode="determinate" [value]="cardFrontProgress()" class="ins-upload-bar"></mat-progress-bar>
                      }
                      <button class="ins-upload-btn" (click)="triggerCardUpload('front')" [disabled]="cardFrontUploading()">
                        <mat-icon>{{ cardFrontUrl() ? 'swap_horiz' : 'upload' }}</mat-icon>
                        {{ cardFrontUrl() ? 'Replace' : 'Upload' }} Front
                      </button>
                    </div>

                    <!-- Back -->
                    <div class="ins-card-slot">
                      @if (cardBackUrl()) {
                        <a [href]="cardBackUrl()!" target="_blank" class="ins-card-link">
                          <img [src]="cardBackUrl()!" class="ins-card-img" alt="Card back" />
                        </a>
                      } @else {
                        <div class="ins-card-placeholder"><mat-icon>add_photo_alternate</mat-icon></div>
                      }
                      @if (cardBackUploading()) {
                        <mat-progress-bar mode="determinate" [value]="cardBackProgress()" class="ins-upload-bar"></mat-progress-bar>
                      }
                      <button class="ins-upload-btn" (click)="triggerCardUpload('back')" [disabled]="cardBackUploading()">
                        <mat-icon>{{ cardBackUrl() ? 'swap_horiz' : 'upload' }}</mat-icon>
                        {{ cardBackUrl() ? 'Replace' : 'Upload' }} Back
                      </button>
                    </div>

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

            <!-- Allergies -->
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>warning_amber</mat-icon> Allergies</div>
              <div class="clin-rows">
                @for (a of allergies(); track $index; let i = $index) {
                  <div class="clin-row clin-allergy">
                    <input class="clin-input clin-name" placeholder="Allergen" [value]="a.name"
                      (input)="updateClinical('allergies', i, 'name', $any($event.target).value)" />
                    <input class="clin-input clin-sub" placeholder="Reaction" [value]="a.reaction || ''"
                      (input)="updateClinical('allergies', i, 'reaction', $any($event.target).value)" />
                    <button class="clin-remove-btn" (click)="removeClinical('allergies', i)" matTooltip="Remove">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
              <button class="clin-add-btn" (click)="addClinical('allergies', {name:'',reaction:''})">
                <mat-icon>add</mat-icon> Add Allergy
              </button>
            </div>

            <!-- Medications -->
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>medication</mat-icon> Medications</div>
              <div class="clin-rows">
                @for (m of medications(); track $index; let i = $index) {
                  <div class="clin-row clin-med">
                    <input class="clin-input clin-name" placeholder="Medication" [value]="m.name"
                      (input)="updateClinical('medications', i, 'name', $any($event.target).value)" />
                    <input class="clin-input clin-sub" placeholder="Dosage" [value]="m.dosage || ''"
                      (input)="updateClinical('medications', i, 'dosage', $any($event.target).value)" />
                    <input class="clin-input clin-sub" placeholder="Frequency" [value]="m.frequency || ''"
                      (input)="updateClinical('medications', i, 'frequency', $any($event.target).value)" />
                    <button class="clin-remove-btn" (click)="removeClinical('medications', i)" matTooltip="Remove">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
              <button class="clin-add-btn" (click)="addClinical('medications', {name:'',dosage:'',frequency:''})">
                <mat-icon>add</mat-icon> Add Medication
              </button>
            </div>

            <!-- Surgical History -->
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>cut</mat-icon> Surgical History</div>
              <div class="clin-rows">
                @for (s of surgeries(); track $index; let i = $index) {
                  <div class="clin-row clin-surgery">
                    <input class="clin-input clin-name" placeholder="Procedure" [value]="s.type"
                      (input)="updateClinical('surgeries', i, 'type', $any($event.target).value)" />
                    <input class="clin-input clin-sub" placeholder="Date / Year" [value]="s.date || ''"
                      (input)="updateClinical('surgeries', i, 'date', $any($event.target).value)" />
                    <button class="clin-remove-btn" (click)="removeClinical('surgeries', i)" matTooltip="Remove">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
              <button class="clin-add-btn" (click)="addClinical('surgeries', {type:'',date:''})">
                <mat-icon>add</mat-icon> Add Surgery
              </button>
            </div>

            <!-- Family History -->
            <div class="clinical-block">
              <div class="clinical-block-title"><mat-icon>family_restroom</mat-icon> Family History</div>
              <div class="clin-rows">
                @for (f of familyConditions(); track $index; let i = $index) {
                  <div class="clin-row clin-family">
                    <input class="clin-input clin-name" placeholder="Diagnosis / Condition" [value]="f.diagnosis"
                      (input)="updateClinical('familyConditions', i, 'diagnosis', $any($event.target).value)" />
                    <input class="clin-input clin-sub" placeholder="Family Member" [value]="f.member || ''"
                      (input)="updateClinical('familyConditions', i, 'member', $any($event.target).value)" />
                    <button class="clin-remove-btn" (click)="removeClinical('familyConditions', i)" matTooltip="Remove">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
              <button class="clin-add-btn" (click)="addClinical('familyConditions', {diagnosis:'',member:''})">
                <mat-icon>add</mat-icon> Add Condition
              </button>
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

    .page-title { font-size: 22px; font-weight: 600; color: #333; margin: 0 0 14px; }

    /* ── Unified toolbar ── */
    .toolbar-row {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 16px; flex-wrap: wrap;
      /* All direct children share the same 38px height */
      & > * { height: 38px; box-sizing: border-box; }
    }

    .search-field {
      display: flex; align-items: center; gap: 6px;
      background: #fff; border: 1px solid #d0d5dd; border-radius: 6px;
      padding: 0 12px; min-width: 200px; flex: 1; max-width: 280px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; line-height: 1; }
    }
    .search-icon { color: #9aa0ab; font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }

    ::ng-deep .toolbar-select {
      width: 140px;
      /* Reset Material field height to exactly 38px */
      .mat-mdc-text-field-wrapper {
        height: 38px !important; padding: 0 !important;
        background: #fff; border: 1px solid #d0d5dd; border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .mdc-notched-outline { display: none; }
      .mat-mdc-form-field-flex { height: 38px; padding: 0 12px; align-items: center; }
      .mat-mdc-form-field-infix { padding: 0 !important; border-top: 0 !important; min-height: unset !important; }
      .mat-mdc-select-value-text { font-size: 13px; color: #333; }
      .mat-mdc-form-field-subscript-wrapper { display: none; }
    }

    .toolbar-icon-btn {
      display: flex; align-items: center; justify-content: center;
      width: 38px; height: 38px; border-radius: 6px; flex-shrink: 0;
      background: #fff; border: 1px solid #d0d5dd; cursor: pointer; color: #555;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: background 0.15s;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .toolbar-icon-btn:hover { background: #f0f4ff; color: #094997; }

    .toolbar-divider { width: 1px; background: #e0e4ea; flex-shrink: 0; align-self: stretch; }

    .action-add-btn {
      display: flex; align-items: center; gap: 6px; flex-shrink: 0;
      background: #094997; color: white; border: none; border-radius: 6px;
      padding: 0 16px; font-size: 13px; font-weight: 600; cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12); transition: background 0.15s; white-space: nowrap;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .action-add-btn:hover { background: #0a3f7f; }

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
    .ov-btn-pdf { background: #fff4f0; color: #c0392b; border: 1px solid #f5c6c0; }
    .ov-btn-pdf:hover { background: #ffe8e3; }
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
    .field-select {
      cursor: pointer; appearance: auto; -webkit-appearance: auto;
      padding-right: 4px;
    }

    /* Insurance card inline */
    .insurance-cards-row {
      margin-top: 10px; padding: 10px 12px; background: #f8f9fb;
      border-radius: 8px; border: 1px solid #e0e4ea;
    }
    .insurance-cards-label { font-size: 9px; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 0.6px; display: block; margin-bottom: 10px; }
    .insurance-card-thumbs { display: flex; gap: 16px; flex-wrap: wrap; }
    .ins-card-slot { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
    .ins-card-link { text-decoration: none; display: block; }
    .ins-card-img { height: 80px; width: auto; max-width: 140px; border-radius: 6px; border: 1px solid #ddd; object-fit: cover; display: block; box-shadow: 0 2px 6px rgba(0,0,0,0.1); transition: transform 0.15s; }
    .ins-card-img:hover { transform: scale(1.03); }
    .ins-card-placeholder {
      height: 80px; width: 130px; border-radius: 6px; border: 2px dashed #c8d0da;
      display: flex; align-items: center; justify-content: center; background: #f0f2f5;
      mat-icon { color: #b0bac8; font-size: 28px; width: 28px; height: 28px; }
    }
    .ins-upload-bar { width: 130px; border-radius: 4px; }
    .ins-upload-btn {
      display: flex; align-items: center; gap: 4px; padding: 4px 10px; height: 28px;
      background: #f0f4ff; color: #094997; border: 1px solid #c7d6f5; border-radius: 5px;
      font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: background 0.15s; white-space: nowrap;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
    }
    .ins-upload-btn:hover:not(:disabled) { background: #dce8ff; }
    .ins-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Clinicals */
    .clinical-block { background: white; border-radius: 8px; margin-bottom: 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .clinical-block-title {
      display: flex; align-items: center; gap: 7px; padding: 8px 14px;
      font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;
      letter-spacing: 0.5px; background: #f8f9fb; border-bottom: 1px solid #eee;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #089bab; }
    }
    .clin-rows { display: flex; flex-direction: column; gap: 1px; background: #eee; }
    .clin-row {
      display: flex; align-items: center; gap: 0; background: white;
      padding: 0; border-bottom: 1px solid #f2f2f2;
    }
    .clin-input {
      flex: 1; border: none; outline: none; font-size: 13px; color: #1a1a2e;
      padding: 7px 10px; background: transparent; font-family: inherit;
      border-right: 1px solid #f0f0f0; min-width: 0;
    }
    .clin-input:focus { background: #f7fbff; }
    .clin-input.clin-name { flex: 2; font-weight: 500; }
    .clin-input.clin-sub  { flex: 1; color: #555; }
    .clin-remove-btn {
      background: none; border: none; cursor: pointer; padding: 6px 8px;
      color: #ccc; display: flex; align-items: center; flex-shrink: 0;
      transition: color 0.15s;
      mat-icon { font-size: 16px; width: 16px; height: 16px; }
    }
    .clin-remove-btn:hover { color: #d32f2f; }
    .clin-add-btn {
      display: flex; align-items: center; gap: 5px; margin: 8px 10px;
      background: none; border: 1px dashed #c0c8d4; border-radius: 5px;
      color: #089bab; font-size: 12px; font-weight: 600; cursor: pointer;
      padding: 5px 12px; font-family: inherit; transition: background 0.15s;
      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }
    .clin-add-btn:hover { background: #f0fdfe; border-color: #089bab; }
  `,
})
export class IntakeListPageComponent implements OnInit {
  private pdfService = new IntakePdfService();

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
  cardFrontUploading = signal(false);
  cardBackUploading  = signal(false);
  cardFrontProgress  = signal(0);
  cardBackProgress   = signal(0);
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

  triggerCardUpload(side: 'front' | 'back') {
    const id = side === 'front' ? 'staff-card-front-input' : 'staff-card-back-input';
    (document.getElementById(id) as HTMLInputElement)?.click();
  }

  async uploadCard(side: 'front' | 'back', event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const uploading = side === 'front' ? this.cardFrontUploading : this.cardBackUploading;
    const progress  = side === 'front' ? this.cardFrontProgress  : this.cardBackProgress;
    uploading.set(true); progress.set(0);
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/getBlobUploadToken',
        onUploadProgress: (e) => progress.set(Math.round(e.percentage)),
      });
      if (side === 'front') {
        this.cardFrontUrl.set(blob.url);
        this.rawData.insuranceCardFrontUrl = blob.url;
      } else {
        this.cardBackUrl.set(blob.url);
        this.rawData.insuranceCardBackUrl = blob.url;
      }
      this.dirty.set(true);
    } catch {
      this.rpError.set(`Failed to upload insurance card ${side}.`);
    } finally {
      uploading.set(false); progress.set(0);
      (event.target as HTMLInputElement).value = '';
    }
  }

  private clinicalSignal(list: string) {
    const map: Record<string, any> = {
      allergies: this.allergies, medications: this.medications,
      surgeries: this.surgeries, familyConditions: this.familyConditions,
    };
    return map[list];
  }

  addClinical(list: string, template: any) {
    const sig = this.clinicalSignal(list);
    sig.update((arr: any[]) => [...arr, { ...template }]);
    this.dirty.set(true);
  }

  removeClinical(list: string, index: number) {
    const sig = this.clinicalSignal(list);
    sig.update((arr: any[]) => arr.filter((_: any, i: number) => i !== index));
    this.dirty.set(true);
  }

  updateClinical(list: string, index: number, field: string, value: string) {
    const sig = this.clinicalSignal(list);
    sig.update((arr: any[]) => arr.map((item: any, i: number) => i === index ? { ...item, [field]: value } : item));
    this.dirty.set(true);
  }

  getVal(sectionKey: string, fieldKey: string): any {
    return this.editState[`${sectionKey}.${fieldKey}`];
  }

  previewPdf() {
    this.pdfService.generate(this.reviewIntake()!, this.rawData, {
      allergies: this.allergies(),
      medications: this.medications(),
      surgeries: this.surgeries(),
      familyConditions: this.familyConditions(),
      cardFrontUrl: this.cardFrontUrl(),
      cardBackUrl: this.cardBackUrl(),
    });
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
    // Persist clinical arrays
    if (!updatedRaw.allergiesMedicationsForm) updatedRaw.allergiesMedicationsForm = {};
    updatedRaw.allergiesMedicationsForm.allergies   = this.allergies();
    updatedRaw.allergiesMedicationsForm.medications = this.medications();
    if (!updatedRaw.medicalHistoryForm) updatedRaw.medicalHistoryForm = {};
    updatedRaw.medicalHistoryForm.surgeries = this.surgeries();
    if (!updatedRaw.familyHistoryForm) updatedRaw.familyHistoryForm = {};
    updatedRaw.familyHistoryForm.familyConditions = this.familyConditions();

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
