import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { upload } from '@vercel/blob/client';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FHIR_CONSTANTS, RequireMatchValidator } from '../../../../core/constants/fhir-constants';

@Component({
  selector: 'app-intake-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    AsyncPipe
  ],
  template: `
<div class="app-shell">

  <!-- ══ UNIFIED HEADER ══ -->
  <div class="unified-header">
    <div class="unified-header-inner">
      <div class="unified-brand">
        <img src="/mof logo.png" alt="Medical Office Force" class="brand-logo" />
        <span class="brand-name">Medical Office Force Patient Intake Form</span>
      </div>
      <div class="unified-step-info">
        <span class="unified-step-counter">Step {{ (stepper?.selectedIndex || 0) + 1 }} of 6</span>
        <span class="unified-step-name">{{ stepLabels[(stepper?.selectedIndex || 0)] }}</span>
      </div>
      <button class="hamburger-btn" (click)="sidenav.open()" aria-label="Open navigation menu">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="4" width="24" height="2.5" rx="1.25" fill="white"/>
          <rect y="10.75" width="24" height="2.5" rx="1.25" fill="white"/>
          <rect y="17.5" width="24" height="2.5" rx="1.25" fill="white"/>
        </svg>
      </button>
    </div>
    <mat-progress-bar mode="determinate" [value]="(((stepper?.selectedIndex || 0) + 1) / 6) * 100" color="accent"></mat-progress-bar>
  </div>

  <!-- ══ SIDENAV + SCROLL CONTENT ══ -->
  <mat-sidenav-container class="sidenav-flex-container">
    <mat-sidenav #sidenav mode="over" position="end" class="intake-sidenav">
      <div class="sidenav-header">
        <span class="sidenav-title">Navigate Form</span>
        <button class="sidenav-close-btn" (click)="sidenav.close()" aria-label="Close menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <mat-nav-list>
        <a mat-list-item (click)="stepper.selectedIndex = 0; sidenav.close()">1. Patient Profile</a>
        <a mat-list-item (click)="stepper.selectedIndex = 1; sidenav.close()">2. Coverage</a>
        <a mat-list-item (click)="stepper.selectedIndex = 2; sidenav.close()">3. Chief Complaint</a>
        <a mat-list-item (click)="stepper.selectedIndex = 3; sidenav.close()">4. Active Clinicals</a>
        <a mat-list-item (click)="stepper.selectedIndex = 4; sidenav.close()">5. Health History</a>
        <a mat-list-item (click)="stepper.selectedIndex = 5; sidenav.close()">6. Signatures</a>
      </mat-nav-list>
    </mat-sidenav>

    <mat-sidenav-content>
    <div class="intake-form-container">
      <h1 class="page-title">Comprehensive Medical Intake Form</h1>
      <p class="page-subtitle">
        Please complete all 6 sections. Your information is encrypted and securely stored.
      </p>

      @if (submitting()) {
        <mat-progress-bar mode="indeterminate" />
      }

      <mat-stepper [linear]="false" #stepper class="intake-stepper">
        
        <!-- STEP 1: Patient Profile -->
        <mat-step label="1. Patient Profile" [completed]="false">
          <div class="super-step-wrapper">
            
          <form [formGroup]="demographicsForm" class="step-form">

            <div class="form-section-title">Patient Name</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Middle Name / Initial</mat-label>
                <input matInput formControlName="middleName" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Suffix (e.g. Jr., Sr., III)</mat-label>
                <input matInput formControlName="suffix" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <input matInput type="date" formControlName="dateOfBirth" />
              </mat-form-field>
            </div>

            <div class="form-section-title">Identity & Profile</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Sex Assigned at Birth</mat-label>
                <input matInput type="text" formControlName="sexAssigned" [matAutocomplete]="autoSex" />
                <mat-autocomplete #autoSex="matAutocomplete">
                  @for (option of filteredSexes | async; track option) {
                    <mat-option [value]="option">{{option}}</mat-option>
                  }
                </mat-autocomplete>
                @if (demographicsForm.get('sexAssigned')?.hasError('requireMatch')) {
                  <mat-error>Please select a valid option from the dropdown</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Gender Identity</mat-label>
                <input matInput formControlName="genderIdentity" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Social Security Number</mat-label>
                <input matInput formControlName="ssn" placeholder="XXX-XX-XXXX"/>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Race</mat-label>
                <input matInput type="text" formControlName="race" [matAutocomplete]="autoRace" />
                <mat-autocomplete #autoRace="matAutocomplete">
                  @for (option of filteredRaces | async; track option) {
                    <mat-option [value]="option">{{option}}</mat-option>
                  }
                </mat-autocomplete>
                @if (demographicsForm.get('race')?.hasError('requireMatch')) {
                  <mat-error>Please select a valid option from the dropdown</mat-error>
                }
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Ethnicity</mat-label>
                <input matInput type="text" formControlName="ethnicity" [matAutocomplete]="autoEthnicity" />
                <mat-autocomplete #autoEthnicity="matAutocomplete">
                  @for (option of filteredEthnicities | async; track option) {
                    <mat-option [value]="option">{{option}}</mat-option>
                  }
                </mat-autocomplete>
                @if (demographicsForm.get('ethnicity')?.hasError('requireMatch')) {
                  <mat-error>Please select a valid option from the dropdown</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Marital Status</mat-label>
                <input matInput type="text" formControlName="maritalStatus" [matAutocomplete]="autoMarital" />
                <mat-autocomplete #autoMarital="matAutocomplete">
                  @for (option of filteredMarital | async; track option) {
                    <mat-option [value]="option">{{option}}</mat-option>
                  }
                </mat-autocomplete>
                @if (demographicsForm.get('maritalStatus')?.hasError('requireMatch')) {
                  <mat-error>Please select a valid option from the dropdown</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-section-title">Status & Accommodations</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Type of Housing</mat-label>
                <input matInput formControlName="housingType" placeholder="e.g. House, Apartment, Homeless" />
              </mat-form-field>
            </div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you have any communication difficulties (hearing, speech, language)?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="demographicsForm.get('communicationDiff')?.value === 'Yes'" (click)="demographicsForm.get('communicationDiff')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="demographicsForm.get('communicationDiff')?.value === 'No'" (click)="demographicsForm.get('communicationDiff')?.setValue('No')">No</button>
              </div>
            </div>
            @if (demographicsForm.value.communicationDiff === 'Yes') {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Please describe</mat-label>
                  <input matInput formControlName="communicationDesc" placeholder="e.g., hearing impaired" />
                </mat-form-field>
              </div>
            }

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Employment Status</mat-label>
                <mat-select formControlName="employmentStatus">
                  <mat-option value="Employed">Employed</mat-option>
                  <mat-option value="Unemployed">Unemployed</mat-option>
                  <mat-option value="Retired">Retired</mat-option>
                  <mat-option value="Student">Student</mat-option>
                </mat-select>
              </mat-form-field>
              @if (demographicsForm.value.employmentStatus === 'Employed') {
                <mat-form-field appearance="outline">
                  <mat-label>Employer Name</mat-label>
                  <input matInput formControlName="employerName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Employer Phone Number</mat-label>
                  <input matInput formControlName="employerPhone" />
                </mat-form-field>
              }
            </div>

            
          
          </form>

          <hr class="super-step-divider" />

          <form [formGroup]="contactForm" class="step-form">

            <div class="form-section-title">Mailing Address</div>
            <div class="form-row">
              <mat-form-field appearance="outline" style="flex:2">
                <mat-label>Street Address</mat-label>
                <input matInput formControlName="mailingStreet" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Apartment / Suite / Unit</mat-label>
                <input matInput formControlName="mailingApt" />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="mailingCity" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="mailingState" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>ZIP Code</mat-label>
                <input matInput formControlName="mailingZip" />
              </mat-form-field>
            </div>

            <div class="form-section-title">Billing Address</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Is your billing address the same as your mailing address?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="contactForm.get('billingSame')?.value === 'Yes'" (click)="contactForm.get('billingSame')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="contactForm.get('billingSame')?.value === 'No'" (click)="contactForm.get('billingSame')?.setValue('No')">No</button>
              </div>
            </div>
            @if (contactForm.value.billingSame === 'No') {
              <div class="form-row">
                <mat-form-field appearance="outline" style="flex:2">
                  <mat-label>Billing Street Address</mat-label>
                  <input matInput formControlName="billingStreet" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Apartment / Suite / Unit</mat-label>
                  <input matInput formControlName="billingApt" />
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Billing City</mat-label>
                  <input matInput formControlName="billingCity" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Billing State</mat-label>
                  <input matInput formControlName="billingState" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Billing ZIP</mat-label>
                  <input matInput formControlName="billingZip" />
                </mat-form-field>
              </div>
            }

            <div class="form-section-title">Contact Numbers</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Cell Phone Number</mat-label>
                <input matInput type="tel" formControlName="cellPhone" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Home Phone Number</mat-label>
                <input matInput type="tel" formControlName="homePhone" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Work Phone Number</mat-label>
                <input matInput type="tel" formControlName="workPhone" />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Primary Contact Number</mat-label>
                <mat-select formControlName="primaryContactNum">
                  <mat-option value="Cell">Cell</mat-option>
                  <mat-option value="Home">Home</mat-option>
                  <mat-option value="Work">Work</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Best Contact Method</mat-label>
                <mat-select formControlName="bestContactMethod">
                  <mat-option value="Phone Call">Phone Call</mat-option>
                  <mat-option value="Text">Text</mat-option>
                  <mat-option value="Email">Email</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="emailAddress" />
              </mat-form-field>
            </div>

            
          
          </form>

          <hr class="super-step-divider" />

          <form [formGroup]="careTeamForm" class="step-form">

            <div class="form-section-title">Emergency Contact</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="emergFirst" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="emergLast" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Relationship to Patient</mat-label>
                <input matInput formControlName="emergRel" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Contact Number</mat-label>
                <input matInput type="tel" formControlName="emergPhone" />
              </mat-form-field>
            </div>

            <div class="form-section-title">Family / Friends Involved in Care</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Is a family member or friend involved in your care?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="careTeamForm.get('hasFamilyCare')?.value === true" (click)="careTeamForm.get('hasFamilyCare')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="careTeamForm.get('hasFamilyCare')?.value === false" (click)="careTeamForm.get('hasFamilyCare')?.setValue(false)">No</button>
              </div>
            </div>
            @if (careTeamForm.get('hasFamilyCare')?.value) {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="familyFirst" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="familyLast" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Relationship</mat-label>
                  <input matInput formControlName="familyRel" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Contact Number</mat-label>
                  <input matInput type="tel" formControlName="familyPhone" />
                </mat-form-field>
              </div>
            }

            <div class="form-section-title">Primary Care Physician (PCP)</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you have a Primary Care Physician?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="careTeamForm.get('hasPcp')?.value === true" (click)="careTeamForm.get('hasPcp')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="careTeamForm.get('hasPcp')?.value === false" (click)="careTeamForm.get('hasPcp')?.setValue(false)">No</button>
              </div>
            </div>
            @if (careTeamForm.get('hasPcp')?.value) {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="pcpFirst" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="pcpLast" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Practice Name</mat-label>
                  <input matInput formControlName="pcpPractice" />
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Practice Phone Number</mat-label>
                  <input matInput formControlName="pcpPhone" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Practice Fax Number</mat-label>
                  <input matInput formControlName="pcpFax" />
                </mat-form-field>
              </div>
            }

            <div class="form-section-title">Referring Physician</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Were you referred by a physician?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="careTeamForm.get('hasReferring')?.value === true" (click)="careTeamForm.get('hasReferring')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="careTeamForm.get('hasReferring')?.value === false" (click)="careTeamForm.get('hasReferring')?.setValue(false)">No</button>
              </div>
            </div>
            @if (careTeamForm.get('hasReferring')?.value) {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>First Name</mat-label>
                  <input matInput formControlName="refFirst" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Last Name</mat-label>
                  <input matInput formControlName="refLast" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Specialty</mat-label>
                  <input matInput formControlName="refSpecialty" />
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Practice Name</mat-label>
                  <input matInput formControlName="refPractice" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Practice Phone</mat-label>
                  <input matInput formControlName="refPhone" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Practice Fax</mat-label>
                  <input matInput formControlName="refFax" />
                </mat-form-field>
              </div>
            }

            
          
          </form></div>
        </mat-step>

        <!-- STEP 2: Coverage -->
        <mat-step label="2. Coverage" [completed]="false">
          <div class="super-step-wrapper">
            
          <form [formGroup]="insuranceForm" class="step-form">

            <div class="form-section-title">Insurance Coverage</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you have health insurance?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="insuranceForm.get('hasInsurance')?.value === true" (click)="insuranceForm.get('hasInsurance')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="insuranceForm.get('hasInsurance')?.value === false" (click)="insuranceForm.get('hasInsurance')?.setValue(false)">No</button>
              </div>
            </div>

            @if (insuranceForm.get('hasInsurance')?.value === true) {
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Insurance Carrier</mat-label>
                <input matInput formControlName="primaryCarrier" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Subscriber ID / Member Number</mat-label>
                <input matInput formControlName="subscriberId" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Group Number</mat-label>
                <input matInput formControlName="groupNumber" />
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Relationship to Policy Holder</mat-label>
                <input matInput type="text" formControlName="relationship" [matAutocomplete]="autoRel" />
                <mat-autocomplete #autoRel="matAutocomplete">
                  @for (option of filteredRelationships | async; track option) {
                    <mat-option [value]="option">{{option}}</mat-option>
                  }
                </mat-autocomplete>
                @if (insuranceForm.get('relationship')?.hasError('requireMatch')) {
                  <mat-error>Please select a valid option from the dropdown</mat-error>
                }
              </mat-form-field>
            </div>

            @if (insuranceForm.value.relationship && insuranceForm.value.relationship !== 'Self') {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Policy Holder First Name</mat-label>
                  <input matInput formControlName="policyHolderFirstName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Policy Holder Last Name</mat-label>
                  <input matInput formControlName="policyHolderLastName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Policy Holder Date of Birth</mat-label>
                  <input matInput type="date" formControlName="policyHolderDob" />
                </mat-form-field>
              </div>
            }

            <!-- Insurance Card Upload -->
            <div class="form-section-title" style="margin-top: 20px;">Insurance Card Photos</div>
            <p class="upload-hint">Upload a photo of the front and back of your insurance card. Accepted: JPG, PNG, WEBP, HEIC (max 10MB each).</p>
            <div class="card-upload-row">
              <!-- Front -->
              <div class="card-upload-zone"
                   [class.has-file]="insuranceCardFront()"
                   [class.uploading]="uploadingFront()"
                   (click)="frontInput.click()"
                   (dragover)="$event.preventDefault()"
                   (drop)="onDrop($event, 'front')">
                <input #frontInput type="file" accept="image/*" hidden (change)="onFileSelected($event, 'front')" />
                @if (uploadingFront()) {
                  <mat-progress-bar mode="indeterminate" style="position:absolute;top:0;left:0;right:0;border-radius:8px 8px 0 0"></mat-progress-bar>
                }
                @if (insuranceCardFront()) {
                  <img [src]="insuranceCardFront()" class="card-preview" alt="Insurance card front" />
                  <div class="card-overlay">
                    <mat-icon>check_circle</mat-icon>
                    <span>Front uploaded</span>
                    <button class="remove-card-btn" (click)="$event.stopPropagation(); removeCard('front')">Remove</button>
                  </div>
                } @else {
                  <mat-icon class="upload-icon">photo_camera</mat-icon>
                  <span class="upload-label">Front of Card</span>
                  <span class="upload-sub">Tap or drag to upload</span>
                }
              </div>
              <!-- Back -->
              <div class="card-upload-zone"
                   [class.has-file]="insuranceCardBack()"
                   [class.uploading]="uploadingBack()"
                   (click)="backInput.click()"
                   (dragover)="$event.preventDefault()"
                   (drop)="onDrop($event, 'back')">
                <input #backInput type="file" accept="image/*" hidden (change)="onFileSelected($event, 'back')" />
                @if (uploadingBack()) {
                  <mat-progress-bar mode="indeterminate" style="position:absolute;top:0;left:0;right:0;border-radius:8px 8px 0 0"></mat-progress-bar>
                }
                @if (insuranceCardBack()) {
                  <img [src]="insuranceCardBack()" class="card-preview" alt="Insurance card back" />
                  <div class="card-overlay">
                    <mat-icon>check_circle</mat-icon>
                    <span>Back uploaded</span>
                    <button class="remove-card-btn" (click)="$event.stopPropagation(); removeCard('back')">Remove</button>
                  </div>
                } @else {
                  <mat-icon class="upload-icon">photo_camera</mat-icon>
                  <span class="upload-label">Back of Card</span>
                  <span class="upload-sub">Tap or drag to upload</span>
                }
              </div>
            </div>
            @if (uploadError()) {
              <div class="upload-error-banner">
                <mat-icon>error_outline</mat-icon>
                <span>{{ uploadError() }}</span>
              </div>
            }

            <!-- Secondary Insurance -->
            <div class="form-section-title" style="margin-top:20px">Secondary Insurance</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you have secondary insurance?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="insuranceForm.get('hasSecondary')?.value === true" (click)="insuranceForm.get('hasSecondary')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="insuranceForm.get('hasSecondary')?.value === false" (click)="insuranceForm.get('hasSecondary')?.setValue(false)">No</button>
              </div>
            </div>
            @if (insuranceForm.get('hasSecondary')?.value === true) {
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>Insurance Carrier</mat-label><input matInput formControlName="secCarrier" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Subscriber ID / Member Number</mat-label><input matInput formControlName="secSubscriberId" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Group Number</mat-label><input matInput formControlName="secGroupNumber" /></mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline"><mat-label>Relationship to Policy Holder</mat-label><input matInput formControlName="secRelationship" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Policy Holder First Name</mat-label><input matInput formControlName="secPolicyHolderFirstName" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Policy Holder Last Name</mat-label><input matInput formControlName="secPolicyHolderLastName" /></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>Policy Holder DOB</mat-label><input matInput type="date" formControlName="secPolicyHolderDob" /></mat-form-field>
              </div>
              <div class="card-upload-row" style="margin-top:8px">
                <div class="card-upload-zone" [class.has-file]="insuranceCardFront2()" [class.uploading]="uploadingFront2()" (click)="front2Input.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event,'front2')">
                  <input #front2Input type="file" accept="image/*" hidden (change)="onFileSelected($event,'front2')" />
                  @if (insuranceCardFront2()) { <img [src]="insuranceCardFront2()" class="card-preview" alt="Secondary card front" /><div class="card-overlay"><mat-icon>check_circle</mat-icon><span>Front uploaded</span><button class="remove-card-btn" (click)="$event.stopPropagation();removeCard('front2')">Remove</button></div> }
                  @else { <mat-icon class="upload-icon">photo_camera</mat-icon><span class="upload-label">Front of Card</span><span class="upload-sub">Tap or drag to upload</span> }
                </div>
                <div class="card-upload-zone" [class.has-file]="insuranceCardBack2()" [class.uploading]="uploadingBack2()" (click)="back2Input.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event,'back2')">
                  <input #back2Input type="file" accept="image/*" hidden (change)="onFileSelected($event,'back2')" />
                  @if (insuranceCardBack2()) { <img [src]="insuranceCardBack2()" class="card-preview" alt="Secondary card back" /><div class="card-overlay"><mat-icon>check_circle</mat-icon><span>Back uploaded</span><button class="remove-card-btn" (click)="$event.stopPropagation();removeCard('back2')">Remove</button></div> }
                  @else { <mat-icon class="upload-icon">photo_camera</mat-icon><span class="upload-label">Back of Card</span><span class="upload-sub">Tap or drag to upload</span> }
                </div>
              </div>

              <!-- Tertiary Insurance — only shown after secondary is confirmed -->
              <div class="form-section-title" style="margin-top:20px">Tertiary Insurance</div>
              <div class="conditional-toggle-row">
                <span class="conditional-question">Do you have tertiary (third) insurance?</span>
                <div class="toggle-btn-group">
                  <button type="button" class="toggle-btn" [class.active]="insuranceForm.get('hasTertiary')?.value === true" (click)="insuranceForm.get('hasTertiary')?.setValue(true)">Yes</button>
                  <button type="button" class="toggle-btn" [class.active]="insuranceForm.get('hasTertiary')?.value === false" (click)="insuranceForm.get('hasTertiary')?.setValue(false)">No</button>
                </div>
              </div>
              @if (insuranceForm.get('hasTertiary')?.value === true) {
                <div class="form-row">
                  <mat-form-field appearance="outline"><mat-label>Insurance Carrier</mat-label><input matInput formControlName="terCarrier" /></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Subscriber ID / Member Number</mat-label><input matInput formControlName="terSubscriberId" /></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Group Number</mat-label><input matInput formControlName="terGroupNumber" /></mat-form-field>
                </div>
                <div class="form-row">
                  <mat-form-field appearance="outline"><mat-label>Relationship to Policy Holder</mat-label><input matInput formControlName="terRelationship" /></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Policy Holder First Name</mat-label><input matInput formControlName="terPolicyHolderFirstName" /></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Policy Holder Last Name</mat-label><input matInput formControlName="terPolicyHolderLastName" /></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Policy Holder DOB</mat-label><input matInput type="date" formControlName="terPolicyHolderDob" /></mat-form-field>
                </div>
                <div class="card-upload-row" style="margin-top:8px">
                  <div class="card-upload-zone" [class.has-file]="insuranceCardFront3()" [class.uploading]="uploadingFront3()" (click)="front3Input.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event,'front3')">
                    <input #front3Input type="file" accept="image/*" hidden (change)="onFileSelected($event,'front3')" />
                    @if (insuranceCardFront3()) { <img [src]="insuranceCardFront3()" class="card-preview" alt="Tertiary card front" /><div class="card-overlay"><mat-icon>check_circle</mat-icon><span>Front uploaded</span><button class="remove-card-btn" (click)="$event.stopPropagation();removeCard('front3')">Remove</button></div> }
                    @else { <mat-icon class="upload-icon">photo_camera</mat-icon><span class="upload-label">Front of Card</span><span class="upload-sub">Tap or drag to upload</span> }
                  </div>
                  <div class="card-upload-zone" [class.has-file]="insuranceCardBack3()" [class.uploading]="uploadingBack3()" (click)="back3Input.click()" (dragover)="$event.preventDefault()" (drop)="onDrop($event,'back3')">
                    <input #back3Input type="file" accept="image/*" hidden (change)="onFileSelected($event,'back3')" />
                    @if (insuranceCardBack3()) { <img [src]="insuranceCardBack3()" class="card-preview" alt="Tertiary card back" /><div class="card-overlay"><mat-icon>check_circle</mat-icon><span>Back uploaded</span><button class="remove-card-btn" (click)="$event.stopPropagation();removeCard('back3')">Remove</button></div> }
                    @else { <mat-icon class="upload-icon">photo_camera</mat-icon><span class="upload-label">Back of Card</span><span class="upload-sub">Tap or drag to upload</span> }
                  </div>
                </div>
              }
            }
            } <!-- end @if hasInsurance -->

            @if (insuranceForm.get('hasInsurance')?.value === false) {
              <div class="oop-notice">
                <div class="oop-notice-header">
                  <mat-icon>account_balance_wallet</mat-icon>
                  <strong>Self-Pay / Out-of-Pocket Agreement</strong>
                </div>
                <p>
                  Since you have indicated that you do not have health insurance, your services will be billed as
                  <strong>self-pay</strong>. By acknowledging below, you agree to the following:
                </p>
                <ul class="oop-terms">
                  <li>Payment in full is due at the time of service unless prior arrangements have been made.</li>
                  <li>You will receive an itemized statement for all services rendered.</li>
                  <li>A discount may be available — please ask our billing team about our self-pay fee schedule.</li>
                  <li>Failure to pay may result in referral to a collections agency.</li>
                  <li>This practice does not accept financial responsibility for services rendered without prior payment arrangements.</li>
                </ul>
                <label class="oop-check-row">
                  <input type="checkbox" formControlName="oopAcknowledged" class="oop-checkbox" />
                  <span>I understand and agree that I am responsible for all charges related to my care as a self-pay patient.</span>
                </label>
              </div>
            }

          </form>

          <hr class="super-step-divider" />

          <form [formGroup]="pharmacyForm" class="step-form">

            <div class="form-section-title">Preferred Local Pharmacy</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you have a preferred local pharmacy?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="pharmacyForm.get('hasLocalPharmacy')?.value === true" (click)="pharmacyForm.get('hasLocalPharmacy')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="pharmacyForm.get('hasLocalPharmacy')?.value === false" (click)="pharmacyForm.get('hasLocalPharmacy')?.setValue(false)">No</button>
              </div>
            </div>
            @if (pharmacyForm.get('hasLocalPharmacy')?.value) {
              <div class="form-row">
                <mat-form-field appearance="outline" style="flex:2">
                  <mat-label>Pharmacy Name</mat-label>
                  <input matInput formControlName="localName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Phone Number</mat-label>
                  <input matInput type="tel" formControlName="localPhone" />
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" style="flex:2">
                  <mat-label>Street Address</mat-label>
                  <input matInput formControlName="localStreet" />
                </mat-form-field>
                <mat-form-field appearance="outline" style="flex:2">
                  <mat-label>City, State, ZIP Code</mat-label>
                  <input matInput formControlName="localCityStateZip" />
                </mat-form-field>
              </div>
            }

            <div class="form-section-title">Preferred Mail-In Pharmacy</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you use a mail-in pharmacy?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="pharmacyForm.get('hasMailPharmacy')?.value === true" (click)="pharmacyForm.get('hasMailPharmacy')?.setValue(true)">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="pharmacyForm.get('hasMailPharmacy')?.value === false" (click)="pharmacyForm.get('hasMailPharmacy')?.setValue(false)">No</button>
              </div>
            </div>
            @if (pharmacyForm.get('hasMailPharmacy')?.value) {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Mail-in Pharmacy Name</mat-label>
                  <input matInput formControlName="mailName" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Account / Phone Number</mat-label>
                  <input matInput formControlName="mailAccount" />
                </mat-form-field>
              </div>
            }

            
          
          </form></div>
        </mat-step>

        <!-- STEP 3: Current Visit -->
        <mat-step label="3. Chief Complaint" [completed]="false">
          <div class="super-step-wrapper">
            
          <form [formGroup]="visitForm" class="step-form">

            <div class="form-section-title">Current Health</div>
            <div class="form-row">
              <mat-form-field appearance="outline" style="flex: 1">
                <mat-label>Primary Reason for Visit / Chief Complaint</mat-label>
                <textarea matInput rows="3" formControlName="chiefComplaint"></textarea>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline" style="flex: 1">
                <mat-label>Current Symptoms</mat-label>
                <textarea matInput rows="3" formControlName="currentSymptoms"></textarea>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>When did these symptoms begin? (Date or duration)</mat-label>
                <input matInput formControlName="symptomOnset" />
              </mat-form-field>
            </div>
            
          
          </form></div>
        </mat-step>

        <!-- STEP 4: Active Clinicals -->
        <mat-step label="4. Allergies & Meds" [completed]="false">
          <div class="super-step-wrapper">
            
          <form [formGroup]="allergiesMedicationsForm" class="step-form">

            <div class="form-section-title">Allergies</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you have any known allergies (medications, food, environmental, latex)?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="allergiesMedicationsForm.get('hasAllergies')?.value === 'Yes'" (click)="allergiesMedicationsForm.get('hasAllergies')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="allergiesMedicationsForm.get('hasAllergies')?.value === 'No'" (click)="allergiesMedicationsForm.get('hasAllergies')?.setValue('No')">No</button>
              </div>
            </div>
            
            @if (allergiesMedicationsForm.value.hasAllergies === 'Yes') {
              <div formArrayName="allergies">
                @for (al of allergies.controls; track $index) {
                  <div [formGroupName]="$index" class="array-item-box">
                    <mat-form-field appearance="outline">
                      <mat-label>Allergy Name</mat-label>
                      <input matInput formControlName="name" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Reaction Type / Severity</mat-label>
                      <input matInput formControlName="reaction" />
                    </mat-form-field>
                    <button class="btn-compact-warn" (click)="removeAllergy($index)">Drop</button>
                  </div>
                }
              </div>
              <button mat-button class="array-add-btn" (click)="addAllergy()">
                <mat-icon>add</mat-icon> Add Additional Allergy
              </button>
            }

            <div class="form-section-title" style="margin-top:24px;">Current Medications</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Are you currently taking any prescription medications, OTC medications, or supplements?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="allergiesMedicationsForm.get('hasMedications')?.value === 'Yes'" (click)="allergiesMedicationsForm.get('hasMedications')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="allergiesMedicationsForm.get('hasMedications')?.value === 'No'" (click)="allergiesMedicationsForm.get('hasMedications')?.setValue('No')">No</button>
              </div>
            </div>

            @if (allergiesMedicationsForm.value.hasMedications === 'Yes') {
              <div formArrayName="medications">
                @for (m of medications.controls; track $index) {
                  <div [formGroupName]="$index" class="array-item-box">
                    <mat-form-field appearance="outline">
                      <mat-label>Medication Name</mat-label>
                      <input matInput formControlName="name" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Dosage (e.g. mg)</mat-label>
                      <input matInput formControlName="dosage" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Frequency</mat-label>
                      <input matInput formControlName="frequency" />
                    </mat-form-field>
                    <button class="btn-compact-warn" (click)="removeMedication($index)">Drop</button>
                  </div>
                }
              </div>
              <button mat-button class="array-add-btn" (click)="addMedication()">
                <mat-icon>add</mat-icon> Add Additional Medication
              </button>
            }

            
          
          </form></div>
        </mat-step>

        <!-- STEP 5: Past History -->
        <mat-step label="5. Health History" [completed]="false">
          <div class="super-step-wrapper">
            
          <form [formGroup]="medicalHistoryForm" class="step-form">

            <div class="form-section-title">Past Surgical History</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Have you had any past procedures or surgeries?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="medicalHistoryForm.get('hasSurgeries')?.value === 'Yes'" (click)="medicalHistoryForm.get('hasSurgeries')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="medicalHistoryForm.get('hasSurgeries')?.value === 'No'" (click)="medicalHistoryForm.get('hasSurgeries')?.setValue('No')">No</button>
              </div>
            </div>
            
            @if (medicalHistoryForm.value.hasSurgeries === 'Yes') {
              <div formArrayName="surgeries">
                @for (s of surgeries.controls; track $index) {
                  <div [formGroupName]="$index" class="array-item-box">
                    <mat-form-field appearance="outline" style="flex:2">
                      <mat-label>Type of Surgery/Procedure</mat-label>
                      <input matInput formControlName="type" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Approximate Date/Year</mat-label>
                      <input matInput formControlName="date" />
                    </mat-form-field>
                    <button class="btn-compact-warn" (click)="removeSurgery($index)">Drop</button>
                  </div>
                }
              </div>
              <button mat-button class="array-add-btn" (click)="addSurgery()">
                <mat-icon>add</mat-icon> Add Additional Procedure
              </button>
            }
            
          
          </form>

          <hr class="super-step-divider" />

          <form [formGroup]="socialHistoryForm" class="step-form">

            <div class="form-section-title">Alcohol</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you drink alcohol?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('drinksAlcohol')?.value === 'Yes'" (click)="socialHistoryForm.get('drinksAlcohol')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('drinksAlcohol')?.value === 'No'" (click)="socialHistoryForm.get('drinksAlcohol')?.setValue('No')">No</button>
              </div>
            </div>
            @if (socialHistoryForm.value.drinksAlcohol === 'Yes') {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>How often?</mat-label>
                  <mat-select formControlName="alcoholFrequency">
                    <mat-option value="Daily">Daily</mat-option>
                    <mat-option value="Weekly">Weekly</mat-option>
                    <mat-option value="Monthly">Monthly</mat-option>
                    <mat-option value="Socially">Socially</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Drinks at a time?</mat-label>
                  <input matInput formControlName="alcoholDrinks" />
                </mat-form-field>
              </div>
            }

            <div class="form-section-title">Tobacco / Nicotine</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you currently use tobacco or nicotine products?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usesTobacco')?.value === 'Yes'" (click)="socialHistoryForm.get('usesTobacco')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usesTobacco')?.value === 'No'" (click)="socialHistoryForm.get('usesTobacco')?.setValue('No')">No</button>
              </div>
            </div>
            @if (socialHistoryForm.value.usesTobacco === 'Yes') {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Types</mat-label>
                  <mat-select formControlName="tobaccoTypes" multiple>
                    <mat-option value="Cigarettes">Cigarettes</mat-option>
                    <mat-option value="Cigars">Cigars</mat-option>
                    <mat-option value="Smokeless">Smokeless</mat-option>
                    <mat-option value="Vapes">Vapes</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Frequency / Day</mat-label>
                  <input matInput formControlName="tobaccoFrequency" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Start Year</mat-label>
                  <input matInput formControlName="tobaccoStartYear" />
                </mat-form-field>
              </div>
            }
            @if (socialHistoryForm.value.usesTobacco === 'No') {
              <div class="conditional-toggle-row">
                <span class="conditional-question">Have you used tobacco or nicotine products in the past?</span>
                <div class="toggle-btn-group">
                  <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usedTobaccoPast')?.value === 'Yes'" (click)="socialHistoryForm.get('usedTobaccoPast')?.setValue('Yes')">Yes</button>
                  <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usedTobaccoPast')?.value === 'No'" (click)="socialHistoryForm.get('usedTobaccoPast')?.setValue('No')">No</button>
                </div>
              </div>
              @if (socialHistoryForm.value.usedTobaccoPast === 'Yes') {
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Start Year</mat-label>
                    <input matInput formControlName="tobaccoPastStart" />
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Stop Year</mat-label>
                    <input matInput formControlName="tobaccoPastStop" />
                  </mat-form-field>
                </div>
              }
            }

            <div class="form-section-title">Recreational Drugs</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you currently use recreational drugs?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usesDrugs')?.value === 'Yes'" (click)="socialHistoryForm.get('usesDrugs')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usesDrugs')?.value === 'No'" (click)="socialHistoryForm.get('usesDrugs')?.setValue('No')">No</button>
              </div>
            </div>
            @if (socialHistoryForm.value.usesDrugs === 'Yes') {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Types</mat-label>
                  <input matInput formControlName="drugsTypes" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Start Year</mat-label>
                  <input matInput formControlName="drugsStartYear" />
                </mat-form-field>
              </div>
            }
            @if (socialHistoryForm.value.usesDrugs === 'No') {
              <div class="conditional-toggle-row">
                <span class="conditional-question">Have you used recreational drugs in the past?</span>
                <div class="toggle-btn-group">
                  <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usedDrugsPast')?.value === 'Yes'" (click)="socialHistoryForm.get('usedDrugsPast')?.setValue('Yes')">Yes</button>
                  <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('usedDrugsPast')?.value === 'No'" (click)="socialHistoryForm.get('usedDrugsPast')?.setValue('No')">No</button>
                </div>
              </div>
              @if (socialHistoryForm.value.usedDrugsPast === 'Yes') {
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Start Year</mat-label>
                    <input matInput formControlName="drugsPastStart" />
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Stop Year</mat-label>
                    <input matInput formControlName="drugsPastStop" />
                  </mat-form-field>
                </div>
              }
            }

            <div class="form-section-title">Exercise & Diet</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Do you exercise regularly?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('exercises')?.value === 'Yes'" (click)="socialHistoryForm.get('exercises')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="socialHistoryForm.get('exercises')?.value === 'No'" (click)="socialHistoryForm.get('exercises')?.setValue('No')">No</button>
              </div>
            </div>
            @if (socialHistoryForm.value.exercises === 'Yes') {
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Type</mat-label>
                  <input matInput formControlName="exerciseType" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Frequency</mat-label>
                  <input matInput formControlName="exerciseFrequency" placeholder="Days per week" />
                </mat-form-field>
              </div>
            }
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Diet Rating</mat-label>
                <mat-select formControlName="dietRating">
                  <mat-option value="Excellent">Excellent</mat-option>
                  <mat-option value="Good">Good</mat-option>
                  <mat-option value="Fair">Fair</mat-option>
                  <mat-option value="Poor">Poor</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            
          
          </form>

          <hr class="super-step-divider" />

          <form [formGroup]="familyHistoryForm" class="step-form">

            <div class="form-section-title">Family History</div>
            <div class="conditional-toggle-row">
              <span class="conditional-question">Is there significant family history of medical conditions?</span>
              <div class="toggle-btn-group">
                <button type="button" class="toggle-btn" [class.active]="familyHistoryForm.get('hasFamilyHistory')?.value === 'Yes'" (click)="familyHistoryForm.get('hasFamilyHistory')?.setValue('Yes')">Yes</button>
                <button type="button" class="toggle-btn" [class.active]="familyHistoryForm.get('hasFamilyHistory')?.value === 'No'" (click)="familyHistoryForm.get('hasFamilyHistory')?.setValue('No')">No</button>
              </div>
            </div>
            
            @if (familyHistoryForm.value.hasFamilyHistory === 'Yes') {
              <div formArrayName="familyConditions">
                @for (c of familyConditions.controls; track $index) {
                  <div [formGroupName]="$index" class="array-item-box">
                    <mat-form-field appearance="outline">
                      <mat-label>Diagnosis</mat-label>
                      <input matInput formControlName="diagnosis" />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Affected Family Member</mat-label>
                      <input matInput formControlName="member" />
                    </mat-form-field>
                    <button class="btn-compact-warn" (click)="removeFamilyCondition($index)">Drop</button>
                  </div>
                }
              </div>
              <button mat-button class="array-add-btn" (click)="addFamilyCondition()">
                <mat-icon>add</mat-icon> Add Additional History
              </button>
            }
            
          
          </form></div>
        </mat-step>

        <!-- STEP 6: Consents -->
        <mat-step label="6. Signatures" [completed]="false">
          <div class="super-step-wrapper">
            
          <form [formGroup]="consentForm" class="step-form">

            <div class="form-section-title">Legal Agreements & Signatures</div>
            <div class="consent-box">
              <p>Please review and acknowledge the following mandatory practice agreements.</p>
            </div>
            
            <div class="consent-check-row">
              <mat-checkbox formControlName="consentTreat" color="primary">
                <b>Consent to Treat:</b> I authorize the providers to perform necessary medical treatments.
              </mat-checkbox>
            </div>
            <div class="consent-check-row">
              <mat-checkbox formControlName="consentFinancial" color="primary">
                <b>Financial Responsibility & Assignment of Benefits:</b> I agree to assume full financial responsibility for services rendered.
              </mat-checkbox>
            </div>
            <div class="consent-check-row">
              <mat-checkbox formControlName="consentPrivacy" color="primary">
                <b>HIPAA Acknowledgment:</b> I acknowledge receipt of the Notice of Privacy Practices.
              </mat-checkbox>
            </div>

            
          
          </form></div>
        </mat-step>
      </mat-stepper>
    </div>
    </mat-sidenav-content>
  </mat-sidenav-container>

  <!-- ══ UNIVERSAL STICKY FOOTER ══ -->
  <div class="sticky-footer">
    <div class="sticky-footer-inner">
      <button class="btn btn-secondary footer-btn"
              [style.visibility]="(stepper?.selectedIndex || 0) === 0 ? 'hidden' : 'visible'"
              (click)="stepper.previous()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back
      </button>

      <div class="footer-step-dots">
        @for (label of stepLabels; track $index) {
          <span class="footer-dot" [class.active]="(stepper?.selectedIndex || 0) === $index"></span>
        }
      </div>

      @if ((stepper?.selectedIndex || 0) < 5) {
        <button class="btn btn-primary footer-btn" (click)="stepper.next()">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      } @else {
        <button class="btn btn-success footer-btn" (click)="onSubmit()" [disabled]="consentForm.invalid || submitting()">
          <mat-icon style="font-size:18px;line-height:18px;margin-right:4px;">send</mat-icon>
          Submit
        </button>
      }
    </div>
  </div>

</div>
  `,
  styles: `
    ::ng-deep .mat-step-header .mat-step-label {
      white-space: normal !important;
      text-align: center;
      max-width: 90px;
      line-height: 1.2;
    }
    ::ng-deep .mat-horizontal-stepper-header-container {
      padding-bottom: 12px;
    }
    .super-step-divider {
      border: 0;
      height: 1px;
      background: #e0e0e0;
      margin: 32px 0;
    }
    .super-step-wrapper .step-form {
      padding: 0;
    }
    /* ═══ APP SHELL LAYOUT ═══ */
    :host {
      display: block;
      height: 100dvh;
      overflow: hidden;
    }
    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      overflow: hidden;
    }
    .sidenav-flex-container {
      flex: 1;
      min-height: 0; /* critical: allows flex child to shrink below content size */
    }
    ::ng-deep .sidenav-flex-container .mat-sidenav-content {
      overflow-y: auto;
    }

    /* ═══ UNIFIED HEADER ═══ */
    .unified-header {
      flex-shrink: 0;
      z-index: 100;
      background-color: #094997;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    }
    .unified-header-inner {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 48px;
      max-width: 960px;
      margin: 0 auto;
      gap: 12px;
    }
    .unified-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .brand-logo { height: 40px; width: auto; display: block; }
    .brand-name { font-size: 14px; font-weight: 600; color: white; white-space: nowrap; }
    @media (max-width: 500px) { .brand-name { display: none; } }
    .unified-step-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
      min-width: 0;
    }
    .unified-step-counter {
      font-size: 13px;
      font-weight: 700;
      color: white;
      line-height: 1.2;
    }
    .unified-step-name {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    /* On very small screens hide the brand text to save space */
    @media (max-width: 380px) {
      .unified-brand-name { display: none; }
    }

    /* ═══ UNIVERSAL STICKY FOOTER ═══ */
    .sticky-footer {
      flex-shrink: 0;
      z-index: 100;
      background: white;
      border-top: 1px solid #e8eaed;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.09);
    }
    .sticky-footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      max-width: 960px;
      margin: 0 auto;
      gap: 12px;
    }
    .footer-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 48px !important;
      min-width: 100px;
      font-size: 15px;
      font-weight: 600;
      padding: 0 20px;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: background 0.15s, transform 0.1s;
    }
    .footer-btn:active { transform: scale(0.97); }
    .footer-step-dots {
      display: flex;
      gap: 7px;
      align-items: center;
    }
    .footer-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d0d5dd;
      transition: background 0.2s, transform 0.2s;
    }
    .footer-dot.active {
      background: #094997;
      transform: scale(1.4);
    }

    /* intake-form-container bottom padding for safety */
    .intake-form-container {
      padding-bottom: 20px;
    }


    /* ------- Sidenav Header ------- */
    .sidenav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #094997;
      padding: 0 12px;
      height: 56px;
    }
    .sidenav-title {
      font-size: 17px;
      font-weight: 600;
      color: white;
    }
    .sidenav-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 10px;
      min-width: 44px;
      min-height: 44px;
      border-radius: 50%;
    }
    .sidenav-close-btn:hover { background: rgba(255,255,255,0.15); }

    .intake-form-container { max-width: 960px; margin: 0 auto; }
    .page-title { font-size: 28px; font-weight: 700; color: #094997; margin: 0 0 6px; }
    .page-subtitle { color: #555; font-size: 15px; line-height: 1.65; margin: 0 0 24px; }
    .intake-stepper { background: transparent; }
    
    .step-form { padding: 16px 0; }
    .form-section-title {
      font-size: 16px; font-weight: 600; color: #333; margin: 24px 0 16px;
      padding-bottom: 6px; border-bottom: 1px solid #eee;
    }
    .form-section-title:first-child { margin-top: 0; }
    
    .form-row { display: flex; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
    .form-row > * { flex: 1; min-width: 220px; }
    
    .array-item-box {
      display: flex; gap: 12px; align-items: center;
      background: #fafbfc; border-radius: 6px; padding: 12px;
      margin-bottom: 12px; border: 1px solid #e1e4e8; flex-wrap: wrap;
    }
    .array-item-box > mat-form-field { flex: 1; min-width: 180px; margin-bottom: -16px; }
    .btn-compact-warn {
      background: #fee; border: 1px solid #fcc; color: #d32f2f;
      border-radius: 4px; cursor: pointer; padding: 6px 12px;
      height: 38px; font-size: 14px; margin-top: 4px;
    }
    .array-add-btn { color: #2196f3; margin-top: 8px; margin-bottom: 24px; }

    /* Conditional yes/no toggles */
    .conditional-toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      gap: 12px; flex-wrap: wrap;
      background: #f8fafc; border: 1px solid #e8eaed; border-radius: 8px;
      padding: 14px 16px; margin-bottom: 14px;
    }
    .conditional-question { font-size: 14px; color: #444; font-weight: 500; flex: 1; min-width: 0; }
    .toggle-btn-group { display: flex; gap: 0; border-radius: 6px; overflow: hidden; border: 1px solid #d0d5dd; flex-shrink: 0; }
    .toggle-btn {
      padding: 10px 28px; font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; background: #fff; color: #666; transition: background 0.15s, color 0.15s;
      font-family: inherit; min-height: 44px; line-height: 1;
    }
    .toggle-btn:not(:last-child) { border-right: 1px solid #d0d5dd; }
    .toggle-btn.active { background: #094997; color: white; }
    @media (max-width: 480px) {
      .conditional-toggle-row { flex-direction: column; align-items: stretch; }
      .toggle-btn-group { width: 100%; }
      .toggle-btn { flex: 1; }
    }

    /* Out-of-pocket acknowledgment */
    .oop-notice {
      background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px;
      padding: 18px 20px; margin-top: 4px;
    }
    .oop-notice-header {
      display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
      mat-icon { color: #c95817; font-size: 20px; width: 20px; height: 20px; }
      strong { font-size: 15px; color: #7a3e00; }
    }
    .oop-notice p { font-size: 14px; color: #5a3e00; line-height: 1.6; margin: 0 0 10px; }
    .oop-terms {
      font-size: 13px; color: #5a3e00; line-height: 1.7; margin: 0 0 14px; padding-left: 18px;
    }
    .oop-check-row {
      display: flex; align-items: flex-start; gap: 10px; cursor: pointer;
      font-size: 14px; color: #3e2700; font-weight: 500; line-height: 1.5;
    }
    .oop-checkbox { margin-top: 2px; width: 16px; height: 16px; flex-shrink: 0; accent-color: #094997; cursor: pointer; }

    .consent-box { background: #eef5fd; border: 1px solid #d9edf7; padding: 16px; margin-bottom: 24px; }
    .consent-check-row { margin-bottom: 16px; }

    .step-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; }
    .step-actions .btn { display: flex; align-items: center; gap: 4px; }
  
    .upload-hint { font-size: 14px; color: #555; margin: -8px 0 16px; line-height: 1.5; }
    .card-upload-row { display: flex; gap: 16px; flex-wrap: wrap; }
    .card-upload-zone {
      flex: 1; min-width: 200px; min-height: 140px; border: 2px dashed #c0c8d4;
      border-radius: 10px; display: flex; flex-direction: column; align-items: center;
      justify-content: center; cursor: pointer; position: relative; overflow: hidden;
      transition: border-color 0.2s, background 0.2s; background: #f8fafc;
    }
    .card-upload-zone:hover { border-color: #089bab; background: #f0fafb; }
    .card-upload-zone.has-file { border-style: solid; border-color: #089bab; }
    .card-upload-zone.uploading { pointer-events: none; opacity: 0.8; }
    .upload-icon { font-size: 40px; width: 40px; height: 40px; color: #b0bec5; margin-bottom: 8px; }
    .upload-label { font-size: 15px; font-weight: 600; color: #444; }
    .upload-sub { font-size: 13px; color: #888; margin-top: 4px; }
    .card-preview { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
    .card-overlay {
      position: absolute; inset: 0; background: rgba(8,155,171,0.75);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: white; gap: 4px;
    }
    .card-overlay mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .card-overlay span { font-size: 13px; font-weight: 600; }
    .remove-card-btn {
      margin-top: 8px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.5);
      color: white; border-radius: 4px; padding: 4px 12px; cursor: pointer; font-size: 12px;
    }
    .upload-error-banner {
      display: flex; align-items: center; gap: 8px; background: #fff0f0;
      border: 1px solid #f44336; border-radius: 4px; padding: 10px 14px;
      margin-top: 12px; color: #f44336; font-size: 14px;
    }
    .upload-error-banner mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .mobile-sidenav-wrapper { min-height: 100vh; }
    .intake-sidenav { width: 280px; }
    /* NNg Fitts Law 48px tap targets */
    .step-actions button { min-height: 48px !important; font-size: 16px; padding: 0 24px; }
    .mobile-top-toolbar { position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    @media (max-width: 768px) {
      ::ng-deep .mat-horizontal-stepper-header-container {
        display: none !important;
      }
      .intake-form-container {
         padding: 0 16px;
      }
      .page-title { font-size: 24px; margin-top: 16px; }
      /* Prevent iOS from zooming on input focus (requires font-size >= 16px) */
      ::ng-deep input, ::ng-deep textarea, ::ng-deep select { font-size: 16px !important; }
    }
    @media (max-width: 380px) {
      .page-title { font-size: 20px; }
    }
`
})
export class IntakeFormPageComponent implements OnInit {
  submitting = signal(false);
  isMobile = false;
  token: string | null = null;

  insuranceCardFront = signal<string | null>(null);
  insuranceCardBack  = signal<string | null>(null);
  insuranceCardFront2 = signal<string | null>(null);
  insuranceCardBack2  = signal<string | null>(null);
  insuranceCardFront3 = signal<string | null>(null);
  insuranceCardBack3  = signal<string | null>(null);
  uploadingFront = signal(false);
  uploadingBack  = signal(false);
  uploadingFront2 = signal(false);
  uploadingBack2  = signal(false);
  uploadingFront3 = signal(false);
  uploadingBack3  = signal(false);
  uploadError = signal('');
  insuranceCardFrontUrl: string | null = null;
  insuranceCardBackUrl:  string | null = null;
  insuranceCardFrontUrl2: string | null = null;
  insuranceCardBackUrl2:  string | null = null;
  insuranceCardFrontUrl3: string | null = null;
  insuranceCardBackUrl3:  string | null = null;

  stepLabels = [
    'Patient Profile',
    'Coverage',
    'Chief Complaint',
    'Active Clinicals',
    'Health History',
    'Signatures'
  ];

  demographicsForm: FormGroup;
  contactForm: FormGroup;
  insuranceForm: FormGroup;
  careTeamForm: FormGroup;
  pharmacyForm: FormGroup;
  visitForm: FormGroup;
  allergiesMedicationsForm: FormGroup;
  medicalHistoryForm: FormGroup;
  socialHistoryForm: FormGroup;
  familyHistoryForm: FormGroup;
  consentForm: FormGroup;

  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;
  step4Form!: FormGroup;
  step5Form!: FormGroup;
  step6Form!: FormGroup;

  filteredRaces!: Observable<string[]>;
  filteredEthnicities!: Observable<string[]>;
  filteredMarital!: Observable<string[]>;
  filteredSexes!: Observable<string[]>;
  filteredRelationships!: Observable<string[]>;

  get allergies() { return this.allergiesMedicationsForm.get('allergies') as FormArray; }
  get medications() { return this.allergiesMedicationsForm.get('medications') as FormArray; }
  get surgeries() { return this.medicalHistoryForm.get('surgeries') as FormArray; }
  get familyConditions() { return this.familyHistoryForm.get('familyConditions') as FormArray; }

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver, private cdr: ChangeDetectorRef) {
    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe(result => {
      this.isMobile = result.matches;
      this.cdr.detectChanges();
    });
    this.route.queryParams.subscribe(params => {
      if (params['token']) this.token = params['token'];
    });

    this.demographicsForm = this.fb.group({
      firstName: ['', Validators.required], middleName: [''], lastName: ['', Validators.required], suffix: [''],
      dateOfBirth: ['', Validators.required], 
      sexAssigned: ['', RequireMatchValidator(FHIR_CONSTANTS.ADMIN_SEX)], 
      genderIdentity: [''], ssn: [''],
      race: ['', RequireMatchValidator(FHIR_CONSTANTS.OMB_RACE)], 
      ethnicity: ['', RequireMatchValidator(FHIR_CONSTANTS.OMB_ETHNICITY)], 
      maritalStatus: ['', RequireMatchValidator(FHIR_CONSTANTS.MARITAL_STATUS)], 
      housingType: [''],
      communicationDiff: [null], communicationDesc: [''], employmentStatus: [''], employerName: [''], employerPhone: ['']
    });

    this.contactForm = this.fb.group({
      mailingStreet: [''], mailingApt: [''], mailingCity: [''], mailingState: [''], mailingZip: [''],
      billingSame: [null], billingStreet: [''], billingApt: [''], billingCity: [''], billingState: [''], billingZip: [''],
      cellPhone: ['', Validators.required], homePhone: [''], workPhone: [''],
      primaryContactNum: ['Cell'], bestContactMethod: ['Phone Call'], emailAddress: ['', [Validators.required, Validators.email]]
    });

    this.insuranceForm = this.fb.group({
      hasInsurance: [null],
      oopAcknowledged: [false],
      primaryCarrier: [''], subscriberId: [''], groupNumber: [''],
      relationship: ['Self', RequireMatchValidator(FHIR_CONSTANTS.RELATIONSHIPS)],
      policyHolderFirstName: [''], policyHolderLastName: [''], policyHolderDob: [''],
      hasSecondary: [null],
      secCarrier: [''], secSubscriberId: [''], secGroupNumber: [''], secRelationship: ['Self'],
      secPolicyHolderFirstName: [''], secPolicyHolderLastName: [''], secPolicyHolderDob: [''],
      hasTertiary: [null],
      terCarrier: [''], terSubscriberId: [''], terGroupNumber: [''], terRelationship: ['Self'],
      terPolicyHolderFirstName: [''], terPolicyHolderLastName: [''], terPolicyHolderDob: [''],
    });

    this.careTeamForm = this.fb.group({
      emergFirst: ['', Validators.required], emergLast: ['', Validators.required], emergRel: [''], emergPhone: ['', Validators.required],
      hasFamilyCare: [null],
      familyFirst: [''], familyLast: [''], familyRel: [''], familyPhone: [''],
      hasPcp: [null],
      pcpFirst: [''], pcpLast: [''], pcpPractice: [''], pcpPhone: [''], pcpFax: [''],
      hasReferring: [null],
      refFirst: [''], refLast: [''], refSpecialty: [''], refPractice: [''], refPhone: [''], refFax: ['']
    });

    this.pharmacyForm = this.fb.group({
      hasLocalPharmacy: [null],
      localName: [''], localStreet: [''], localCityStateZip: [''], localPhone: [''],
      hasMailPharmacy: [null],
      mailName: [''], mailAccount: ['']
    });

    this.visitForm = this.fb.group({ chiefComplaint: [''], currentSymptoms: [''], symptomOnset: [''] });

    this.allergiesMedicationsForm = this.fb.group({
      hasAllergies: [null], allergies: this.fb.array([]),
      hasMedications: [null], medications: this.fb.array([])
    });

    this.medicalHistoryForm = this.fb.group({
      hasSurgeries: [null], surgeries: this.fb.array([])
    });

    this.socialHistoryForm = this.fb.group({
      drinksAlcohol: [null], alcoholFrequency: [''], alcoholDrinks: [''],
      usesTobacco: [null], tobaccoTypes: [[]], tobaccoFrequency: [''], tobaccoStartYear: [''],
      usedTobaccoPast: [null], tobaccoPastStart: [''], tobaccoPastStop: [''],
      usesDrugs: [null], drugsTypes: [''], drugsStartYear: [''],
      usedDrugsPast: [null], drugsPastStart: [''], drugsPastStop: [''],
      exercises: [null], exerciseType: [''], exerciseFrequency: [''], dietRating: ['']
    });

    this.familyHistoryForm = this.fb.group({
      hasFamilyHistory: [null], familyConditions: this.fb.array([])
    });

    this.consentForm = this.fb.group({
      consentTreat: [false, Validators.requiredTrue],
      consentFinancial: [false, Validators.requiredTrue],
      consentPrivacy: [false, Validators.requiredTrue]
    });

    this.step1Form = this.fb.group({
      demographicsForm: this.demographicsForm,
      contactForm: this.contactForm,
      careTeamForm: this.careTeamForm
    });
    this.step2Form = this.fb.group({
      insuranceForm: this.insuranceForm,
      pharmacyForm: this.pharmacyForm
    });
    this.step3Form = this.fb.group({
      visitForm: this.visitForm
    });
    this.step4Form = this.fb.group({
      allergiesMedicationsForm: this.allergiesMedicationsForm
    });
    this.step5Form = this.fb.group({
      medicalHistoryForm: this.medicalHistoryForm,
      socialHistoryForm: this.socialHistoryForm,
      familyHistoryForm: this.familyHistoryForm
    });
    this.step6Form = this.fb.group({
      consentForm: this.consentForm
    });
  }

  ngOnInit() {
    this.filteredRaces = this.demographicsForm.get('race')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val || '', FHIR_CONSTANTS.OMB_RACE))
    );

    this.filteredEthnicities = this.demographicsForm.get('ethnicity')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val || '', FHIR_CONSTANTS.OMB_ETHNICITY))
    );

    this.filteredMarital = this.demographicsForm.get('maritalStatus')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val || '', FHIR_CONSTANTS.MARITAL_STATUS))
    );

    this.filteredSexes = this.demographicsForm.get('sexAssigned')!.valueChanges.pipe(
      startWith(''),
      map(val => this._filter(val || '', FHIR_CONSTANTS.ADMIN_SEX))
    );

    this.filteredRelationships = this.insuranceForm.get('relationship')!.valueChanges.pipe(
      startWith('Self'), // Start with Default
      map(val => this._filter(val || '', FHIR_CONSTANTS.RELATIONSHIPS))
    );

    // Pre-populate from initial intake if token is present
    if (this.token) {
      this.prefillFromToken(this.token);
    }
  }

  async prefillFromToken(token: string) {
    try {
      const response = await fetch(`/api/getIntakeByToken?token=${encodeURIComponent(token)}`);
      if (!response.ok) return;
      const { data } = await response.json();
      if (!data) return;

      // If the patient previously completed the full form, restore all sections
      if (data.demographicsForm) {
        this.demographicsForm.patchValue(data.demographicsForm);
      } else {
        // Fall back to top-level fields from initial intake
        this.demographicsForm.patchValue({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          dateOfBirth: data.dateOfBirth || '',
        });
      }

      if (data.contactForm) {
        this.contactForm.patchValue(data.contactForm);
      } else {
        this.contactForm.patchValue({
          emailAddress: data.email || '',
          cellPhone: data.phone || '',
        });
      }

      if (data.insuranceForm)   this.insuranceForm.patchValue(data.insuranceForm);
      if (data.careTeamForm)    this.careTeamForm.patchValue(data.careTeamForm);
      if (data.pharmacyForm)    this.pharmacyForm.patchValue(data.pharmacyForm);
      if (data.socialHistoryForm) this.socialHistoryForm.patchValue(data.socialHistoryForm);
      if (data.familyHistoryForm) this.familyHistoryForm.patchValue({ hasFamilyHistory: data.familyHistoryForm.hasFamilyHistory });

      // Chief complaint — prefer visitForm section, fall back to top-level initial intake fields
      this.visitForm.patchValue({
        chiefComplaint:  data.visitForm?.chiefComplaint  || data.chiefComplaint  || '',
        currentSymptoms: data.visitForm?.currentSymptoms || data.currentSymptoms || '',
        symptomOnset:    data.visitForm?.symptomOnset    || data.symptomOnset    || '',
      });

      // Restore FormArrays
      if (data.allergiesMedicationsForm) {
        this.allergiesMedicationsForm.patchValue({
          hasAllergies: data.allergiesMedicationsForm.hasAllergies,
          hasMedications: data.allergiesMedicationsForm.hasMedications,
        });
        (data.allergiesMedicationsForm.allergies || []).forEach((a: any) => {
          this.allergies.push(this.fb.group({ name: [a.name || ''], reaction: [a.reaction || ''] }));
        });
        (data.allergiesMedicationsForm.medications || []).forEach((m: any) => {
          this.medications.push(this.fb.group({ name: [m.name || ''], dosage: [m.dosage || ''], frequency: [m.frequency || ''] }));
        });
      }

      if (data.medicalHistoryForm) {
        this.medicalHistoryForm.patchValue({ hasSurgeries: data.medicalHistoryForm.hasSurgeries });
        (data.medicalHistoryForm.surgeries || []).forEach((s: any) => {
          this.surgeries.push(this.fb.group({ type: [s.type || ''], date: [s.date || ''] }));
        });
      }

      if (data.familyHistoryForm) {
        (data.familyHistoryForm.familyConditions || []).forEach((f: any) => {
          this.familyConditions.push(this.fb.group({ diagnosis: [f.diagnosis || ''], member: [f.member || ''] }));
        });
      }

      // Restore insurance card preview URLs
      if (data.insuranceCardFrontUrl)  { this.insuranceCardFront.set(data.insuranceCardFrontUrl);   this.insuranceCardFrontUrl  = data.insuranceCardFrontUrl; }
      if (data.insuranceCardBackUrl)   { this.insuranceCardBack.set(data.insuranceCardBackUrl);     this.insuranceCardBackUrl   = data.insuranceCardBackUrl; }
      if (data.insuranceCardFrontUrl2) { this.insuranceCardFront2.set(data.insuranceCardFrontUrl2); this.insuranceCardFrontUrl2 = data.insuranceCardFrontUrl2; }
      if (data.insuranceCardBackUrl2)  { this.insuranceCardBack2.set(data.insuranceCardBackUrl2);   this.insuranceCardBackUrl2  = data.insuranceCardBackUrl2; }
      if (data.insuranceCardFrontUrl3) { this.insuranceCardFront3.set(data.insuranceCardFrontUrl3); this.insuranceCardFrontUrl3 = data.insuranceCardFrontUrl3; }
      if (data.insuranceCardBackUrl3)  { this.insuranceCardBack3.set(data.insuranceCardBackUrl3);   this.insuranceCardBackUrl3  = data.insuranceCardBackUrl3; }

    } catch (err) {
      console.warn('Could not prefill from token:', err);
    }
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addAllergy() { this.allergies.push(this.fb.group({ name: [''], reaction: [''] })); }
  removeAllergy(index: number) { this.allergies.removeAt(index); }

  addMedication() { this.medications.push(this.fb.group({ name: [''], dosage: [''], frequency: [''] })); }
  removeMedication(index: number) { this.medications.removeAt(index); }

  addSurgery() { this.surgeries.push(this.fb.group({ type: [''], date: [''] })); }
  removeSurgery(index: number) { this.surgeries.removeAt(index); }

  addFamilyCondition() { this.familyConditions.push(this.fb.group({ diagnosis: [''], member: [''] })); }
  removeFamilyCondition(index: number) { this.familyConditions.removeAt(index); }

  private cardSignals(): Record<string, { preview: any; uploading: any }> {
    return {
      front:  { preview: this.insuranceCardFront,  uploading: this.uploadingFront  },
      back:   { preview: this.insuranceCardBack,   uploading: this.uploadingBack   },
      front2: { preview: this.insuranceCardFront2, uploading: this.uploadingFront2 },
      back2:  { preview: this.insuranceCardBack2,  uploading: this.uploadingBack2  },
      front3: { preview: this.insuranceCardFront3, uploading: this.uploadingFront3 },
      back3:  { preview: this.insuranceCardBack3,  uploading: this.uploadingBack3  },
    };
  }

  onDrop(event: DragEvent, side: string) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.uploadCard(file, side);
  }

  onFileSelected(event: Event, side: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.uploadCard(file, side);
  }

  removeCard(side: string) {
    const s = this.cardSignals()[side];
    if (!s) return;
    s.preview.set(null);
    if (side === 'front')  this.insuranceCardFrontUrl  = null;
    if (side === 'back')   this.insuranceCardBackUrl   = null;
    if (side === 'front2') this.insuranceCardFrontUrl2 = null;
    if (side === 'back2')  this.insuranceCardBackUrl2  = null;
    if (side === 'front3') this.insuranceCardFrontUrl3 = null;
    if (side === 'back3')  this.insuranceCardBackUrl3  = null;
  }

  async uploadCard(file: File, side: string) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) { this.uploadError.set('Only JPG, PNG, WEBP, or HEIC images are accepted.'); return; }
    if (file.size > 10 * 1024 * 1024) { this.uploadError.set('File must be under 10MB.'); return; }
    this.uploadError.set('');

    const s = this.cardSignals()[side];
    if (!s) return;
    s.uploading.set(true);

    const reader = new FileReader();
    reader.onload = (e) => s.preview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const filename = `insurance-cards/${side}-${Date.now()}-${file.name}`;
      const blob = await upload(filename, file, { access: 'public', handleUploadUrl: '/api/getBlobUploadToken' });
      if (side === 'front')  this.insuranceCardFrontUrl  = blob.url;
      if (side === 'back')   this.insuranceCardBackUrl   = blob.url;
      if (side === 'front2') this.insuranceCardFrontUrl2 = blob.url;
      if (side === 'back2')  this.insuranceCardBackUrl2  = blob.url;
      if (side === 'front3') this.insuranceCardFrontUrl3 = blob.url;
      if (side === 'back3')  this.insuranceCardBackUrl3  = blob.url;
    } catch {
      this.uploadError.set('Upload failed. Please try again.');
      s.preview.set(null);
    } finally {
      s.uploading.set(false);
    }
  }

  async onSubmit() {
    this.submitting.set(true);

    const payload: any = {
      demographicsForm: this.demographicsForm.value,
      contactForm: this.contactForm.value,
      insuranceForm: this.insuranceForm.value,
      careTeamForm: this.careTeamForm.value,
      pharmacyForm: this.pharmacyForm.value,
      visitForm: this.visitForm.value,
      allergiesMedicationsForm: this.allergiesMedicationsForm.value,
      medicalHistoryForm: this.medicalHistoryForm.value,
      socialHistoryForm: this.socialHistoryForm.value,
      familyHistoryForm: this.familyHistoryForm.value,
      consentForm: this.consentForm.value
    };

    if (this.token) payload.token = this.token;
    payload.insuranceCardFrontUrl  = this.insuranceCardFrontUrl;
    payload.insuranceCardBackUrl   = this.insuranceCardBackUrl;
    payload.insuranceCardFrontUrl2 = this.insuranceCardFrontUrl2;
    payload.insuranceCardBackUrl2  = this.insuranceCardBackUrl2;
    payload.insuranceCardFrontUrl3 = this.insuranceCardFrontUrl3;
    payload.insuranceCardBackUrl3  = this.insuranceCardBackUrl3;

    try {
      const response = await fetch('/api/submitIntake', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to submit');
      this.submitting.set(false);
      this.router.navigate(['/confirmation']);
    } catch (err) {
      console.error(err);
      this.submitting.set(false);
      alert('There was an issue submitting your form.');
    }
  }
}
