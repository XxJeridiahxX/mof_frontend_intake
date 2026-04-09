import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
    
<mat-sidenav-container class="mobile-sidenav-wrapper" [class.is-mobile]="isMobile">
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
    @if (isMobile) {
      <div class="mobile-top-toolbar">
        <div class="mobile-toolbar-inner">
          <span class="mobile-step-label">Step {{ (stepper?.selectedIndex || 0) + 1 }} of 6</span>
          <span class="mobile-step-name">{{ stepLabels[(stepper?.selectedIndex || 0)] }}</span>
          <button class="hamburger-btn" (click)="sidenav.open()" aria-label="Open navigation menu">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="4" width="24" height="2.5" rx="1.25" fill="white"/>
              <rect y="10.75" width="24" height="2.5" rx="1.25" fill="white"/>
              <rect y="17.5" width="24" height="2.5" rx="1.25" fill="white"/>
            </svg>
          </button>
        </div>
        <mat-progress-bar mode="determinate" [value]="(((stepper?.selectedIndex || 0) + 1) / 6) * 100" color="accent"></mat-progress-bar>
      </div>
    }

    <div class="intake-form-container">
      <h1 class="page-title">Comprehensive Medical Intake Form</h1>
      <p class="page-subtitle">
        Please complete all 11 sections. Your information is encrypted and securely stored.
      </p>

      @if (submitting()) {
        <mat-progress-bar mode="indeterminate" />
      }

      <mat-stepper [linear]="false" #stepper class="intake-stepper">
        
        <!-- STEP 1: Patient Profile -->
        <mat-step [stepControl]="step1Form" label="1. Patient Profile">
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
              <mat-form-field appearance="outline">
                <mat-label>Communication Difficulties?</mat-label>
                <mat-select formControlName="communicationDiff">
                  <mat-option value="Yes">Yes</mat-option>
                  <mat-option value="No">No</mat-option>
                </mat-select>
              </mat-form-field>
              @if (demographicsForm.value.communicationDiff === 'Yes') {
                <mat-form-field appearance="outline">
                  <mat-label>Please describe</mat-label>
                  <input matInput formControlName="communicationDesc" placeholder="e.g., hearing impaired" />
                </mat-form-field>
              }
            </div>

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
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Billing Address Same as Mailing?</mat-label>
                <mat-select formControlName="billingSame">
                  <mat-option value="Yes">Yes</mat-option>
                  <mat-option value="No">No</mat-option>
                </mat-select>
              </mat-form-field>
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

            <div class="form-section-title">Primary Care Physician (PCP)</div>
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

            <div class="form-section-title">Referring Physician</div>
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

            
          
          </form>

            
            <div class="step-actions">
              
              <button class="btn btn-primary" matStepperNext>Next &rarr;</button>
              
            </div>
          </div>
        </mat-step>

        <!-- STEP 2: Coverage -->
        <mat-step [stepControl]="step2Form" label="2. Coverage">
          <div class="super-step-wrapper">
            
          <form [formGroup]="insuranceForm" class="step-form">

            <div class="form-section-title">Primary Insurance</div>
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

            
          
          </form>

          <hr class="super-step-divider" />

          <form [formGroup]="pharmacyForm" class="step-form">

            <div class="form-section-title">Preferred Local Pharmacy</div>
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

            <div class="form-section-title">Preferred Mail-In Pharmacy (Optional)</div>
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

            
          
          </form>

            
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>&larr; Back</button>
              <button class="btn btn-primary" matStepperNext>Next &rarr;</button>
              
            </div>
          </div>
        </mat-step>

        <!-- STEP 3: Current Visit -->
        <mat-step [stepControl]="step3Form" label="3. Chief Complaint">
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
            
          
          </form>

            
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>&larr; Back</button>
              <button class="btn btn-primary" matStepperNext>Next &rarr;</button>
              
            </div>
          </div>
        </mat-step>

        <!-- STEP 4: Active Clinicals -->
        <mat-step [stepControl]="step4Form" label="4. Allergies & Meds">
          <div class="super-step-wrapper">
            
          <form [formGroup]="allergiesMedicationsForm" class="step-form">

            <div class="form-section-title">Allergies</div>
            <div class="form-row">
              <p style="margin:0 0 8px;">Do you have any known allergies (Medications, Food, Environmental, Latex)?</p>
              <mat-radio-group formControlName="hasAllergies" color="primary">
                <mat-radio-button value="Yes">Yes</mat-radio-button>
                <mat-radio-button value="No">No</mat-radio-button>
              </mat-radio-group>
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
            <div class="form-row">
              <p style="margin:0 0 8px;">Are you currently taking any prescription medications, OTC medications, or supplements?</p>
              <mat-radio-group formControlName="hasMedications" color="primary">
                <mat-radio-button value="Yes">Yes</mat-radio-button>
                <mat-radio-button value="No">No</mat-radio-button>
              </mat-radio-group>
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

            
          
          </form>

            
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>&larr; Back</button>
              <button class="btn btn-primary" matStepperNext>Next &rarr;</button>
              
            </div>
          </div>
        </mat-step>

        <!-- STEP 5: Past History -->
        <mat-step [stepControl]="step5Form" label="5. Health History">
          <div class="super-step-wrapper">
            
          <form [formGroup]="medicalHistoryForm" class="step-form">

            <div class="form-section-title">Past Surgical History</div>
            <div class="form-row">
              <p style="margin:0 0 8px;">Have you had any past procedures or surgeries?</p>
              <mat-radio-group formControlName="hasSurgeries" color="primary">
                <mat-radio-button value="Yes">Yes</mat-radio-button>
                <mat-radio-button value="No">No</mat-radio-button>
              </mat-radio-group>
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
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Do you drink alcohol?</mat-label>
                <mat-select formControlName="drinksAlcohol">
                  <mat-option value="Yes">Yes</mat-option>
                  <mat-option value="No">No</mat-option>
                </mat-select>
              </mat-form-field>
              @if (socialHistoryForm.value.drinksAlcohol === 'Yes') {
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
              }
            </div>

            <div class="form-section-title">Tobacco / Nicotine</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Current use?</mat-label>
                <mat-select formControlName="usesTobacco">
                  <mat-option value="Yes">Yes</mat-option>
                  <mat-option value="No">No</mat-option>
                </mat-select>
              </mat-form-field>
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
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Used in the past?</mat-label>
                  <mat-select formControlName="usedTobaccoPast">
                    <mat-option value="Yes">Yes</mat-option>
                    <mat-option value="No">No</mat-option>
                  </mat-select>
                </mat-form-field>
                @if (socialHistoryForm.value.usedTobaccoPast === 'Yes') {
                  <mat-form-field appearance="outline">
                    <mat-label>Start Year</mat-label>
                    <input matInput formControlName="tobaccoPastStart" />
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Stop Year</mat-label>
                    <input matInput formControlName="tobaccoPastStop" />
                  </mat-form-field>
                }
              </div>
            }

            <div class="form-section-title">Recreational Drugs</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Current use?</mat-label>
                <mat-select formControlName="usesDrugs">
                  <mat-option value="Yes">Yes</mat-option>
                  <mat-option value="No">No</mat-option>
                </mat-select>
              </mat-form-field>
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
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Used in the past?</mat-label>
                  <mat-select formControlName="usedDrugsPast">
                    <mat-option value="Yes">Yes</mat-option>
                    <mat-option value="No">No</mat-option>
                  </mat-select>
                </mat-form-field>
                @if (socialHistoryForm.value.usedDrugsPast === 'Yes') {
                  <mat-form-field appearance="outline">
                    <mat-label>Start Year</mat-label>
                    <input matInput formControlName="drugsPastStart" />
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Stop Year</mat-label>
                    <input matInput formControlName="drugsPastStop" />
                  </mat-form-field>
                }
              </div>
            }

            <div class="form-section-title">Exercise & Diet</div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Regular Exercise?</mat-label>
                <mat-select formControlName="exercises">
                  <mat-option value="Yes">Yes</mat-option>
                  <mat-option value="No">No</mat-option>
                </mat-select>
              </mat-form-field>
              @if (socialHistoryForm.value.exercises === 'Yes') {
                <mat-form-field appearance="outline">
                  <mat-label>Type</mat-label>
                  <input matInput formControlName="exerciseType" />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Frequency</mat-label>
                  <input matInput formControlName="exerciseFrequency" placeholder="Days per week" />
                </mat-form-field>
              }
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
            <div class="form-row">
              <p style="margin:0 0 8px;">Significant family history of medical conditions?</p>
              <mat-radio-group formControlName="hasFamilyHistory" color="primary">
                <mat-radio-button value="Yes">Yes</mat-radio-button>
                <mat-radio-button value="No">No</mat-radio-button>
              </mat-radio-group>
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
            
          
          </form>

            
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>&larr; Back</button>
              <button class="btn btn-primary" matStepperNext>Next &rarr;</button>
              
            </div>
          </div>
        </mat-step>

        <!-- STEP 6: Consents -->
        <mat-step [stepControl]="step6Form" label="6. Signatures">
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

            
          
          </form>

            
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>&larr; Back</button>
              
              <button class="btn btn-success btn-submit layout-1" (click)="onSubmit()" [disabled]="consentForm.invalid || submitting()"><mat-icon>send</mat-icon> Submit Complete Intake</button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  </mat-sidenav-content>
</mat-sidenav-container>
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
    .super-step-wrapper form:first-child .form-section-title:first-child {
      margin-top: 0;
    }

    /* ------- Custom Mobile Toolbar ------- */
    .mobile-top-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #094997;
    }
    .mobile-toolbar-inner {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 56px;
      color: white;
    }
    .mobile-step-label {
      font-size: 18px;
      font-weight: 600;
      color: white;
      margin-right: 8px;
      white-space: nowrap;
    }
    .mobile-step-name {
      font-size: 13px;
      color: rgba(255,255,255,0.75);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hamburger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 10px;
      min-width: 48px;
      min-height: 48px;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .hamburger-btn:hover { background: rgba(255,255,255,0.15); }
    .hamburger-btn:active { background: rgba(255,255,255,0.25); }

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
    .page-title { font-size: 28px; font-weight: 600; color: #094997; margin: 0 0 4px; }
    .page-subtitle { color: #646464; font-size: 14px; margin: 0 0 24px; }
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
      height: 38px; font-size: 13px; margin-top: 4px;
    }
    .array-add-btn { color: #2196f3; margin-top: 8px; margin-bottom: 24px; }

    .consent-box { background: #eef5fd; border: 1px solid #d9edf7; padding: 16px; margin-bottom: 24px; }
    .consent-check-row { margin-bottom: 16px; }

    .step-actions { display: flex; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; }
    .step-actions .btn { display: flex; align-items: center; gap: 4px; }
  
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
    }
`
})
export class IntakeFormPageComponent implements OnInit {
  submitting = signal(false);
  isMobile = false;
  token: string | null = null;

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
      communicationDiff: ['No'], communicationDesc: [''], employmentStatus: [''], employerName: [''], employerPhone: ['']
    });

    this.contactForm = this.fb.group({
      mailingStreet: [''], mailingApt: [''], mailingCity: [''], mailingState: [''], mailingZip: [''],
      billingSame: ['Yes'], billingStreet: [''], billingApt: [''], billingCity: [''], billingState: [''], billingZip: [''],
      cellPhone: ['', Validators.required], homePhone: [''], workPhone: [''],
      primaryContactNum: ['Cell'], bestContactMethod: ['Phone Call'], emailAddress: ['', [Validators.required, Validators.email]]
    });

    this.insuranceForm = this.fb.group({
      primaryCarrier: [''], subscriberId: [''], groupNumber: [''],
      relationship: ['Self', RequireMatchValidator(FHIR_CONSTANTS.RELATIONSHIPS)], 
      policyHolderFirstName: [''], policyHolderLastName: [''], policyHolderDob: ['']
    });

    this.careTeamForm = this.fb.group({
      emergFirst: ['', Validators.required], emergLast: ['', Validators.required], emergRel: [''], emergPhone: ['', Validators.required],
      familyFirst: [''], familyLast: [''], familyRel: [''], familyPhone: [''],
      pcpFirst: [''], pcpLast: [''], pcpPractice: [''], pcpPhone: [''], pcpFax: [''],
      refFirst: [''], refLast: [''], refSpecialty: [''], refPractice: [''], refPhone: [''], refFax: ['']
    });

    this.pharmacyForm = this.fb.group({
      localName: [''], localStreet: [''], localCityStateZip: [''], localPhone: [''],
      mailName: [''], mailAccount: ['']
    });

    this.visitForm = this.fb.group({ chiefComplaint: [''], currentSymptoms: [''], symptomOnset: [''] });

    this.allergiesMedicationsForm = this.fb.group({
      hasAllergies: ['No'], allergies: this.fb.array([]),
      hasMedications: ['No'], medications: this.fb.array([])
    });

    this.medicalHistoryForm = this.fb.group({
      hasSurgeries: ['No'], surgeries: this.fb.array([])
    });

    this.socialHistoryForm = this.fb.group({
      drinksAlcohol: ['No'], alcoholFrequency: [''], alcoholDrinks: [''],
      usesTobacco: ['No'], tobaccoTypes: [[]], tobaccoFrequency: [''], tobaccoStartYear: [''],
      usedTobaccoPast: ['No'], tobaccoPastStart: [''], tobaccoPastStop: [''],
      usesDrugs: ['No'], drugsTypes: [''], drugsStartYear: [''],
      usedDrugsPast: ['No'], drugsPastStart: [''], drugsPastStop: [''],
      exercises: ['No'], exerciseType: [''], exerciseFrequency: [''], dietRating: ['Good']
    });

    this.familyHistoryForm = this.fb.group({
      hasFamilyHistory: ['No'], familyConditions: this.fb.array([])
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
