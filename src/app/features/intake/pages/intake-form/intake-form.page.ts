import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatChipsModule } from '@angular/material/chips';

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
    MatChipsModule,
  ],
  template: `
    <div class="intake-form-container">
      <h1 class="page-title">Medical Intake Form</h1>
      <p class="page-subtitle">
        Please complete all sections. Your information is encrypted and secure.
      </p>

      @if (submitting()) {
        <mat-progress-bar mode="indeterminate" />
      }

      <mat-stepper
        [linear]="false"
        #stepper
        class="intake-stepper"
      >
        <!-- Step 1: Demographics -->
        <mat-step [stepControl]="demographicsForm" label="Demographics">
          <form [formGroup]="demographicsForm" class="step-form">
            <div class="form-section-title">Personal Information</div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Middle Name</mat-label>
                <input matInput formControlName="middleName" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <input matInput type="date" formControlName="dateOfBirth" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Gender</mat-label>
                <mat-select formControlName="gender">
                  <mat-option value="male">Male</mat-option>
                  <mat-option value="female">Female</mat-option>
                  <mat-option value="other">Other</mat-option>
                  <mat-option value="prefer_not">Prefer not to say</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Marital Status</mat-label>
                <mat-select formControlName="maritalStatus">
                  <mat-option value="single">Single</mat-option>
                  <mat-option value="married">Married</mat-option>
                  <mat-option value="divorced">Divorced</mat-option>
                  <mat-option value="widowed">Widowed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput type="tel" formControlName="phone" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Preferred Language</mat-label>
                <mat-select formControlName="language">
                  <mat-option value="en">English</mat-option>
                  <mat-option value="es">Spanish</mat-option>
                  <mat-option value="hi">Hindi</mat-option>
                  <mat-option value="zh">Chinese</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-section-title">Address</div>
            <div formGroupName="address">
              <div class="form-row">
                <mat-form-field
                  class="dont-apply"
                  appearance="outline"
                  style="flex: 2"
                >
                  <mat-label>Street Address</mat-label>
                  <input matInput formControlName="street" />
                </mat-form-field>
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>City</mat-label>
                  <input matInput formControlName="city" />
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>State</mat-label>
                  <input matInput formControlName="state" />
                </mat-form-field>
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>ZIP Code</mat-label>
                  <input matInput formControlName="zip" />
                </mat-form-field>
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>Country</mat-label>
                  <mat-select formControlName="country">
                    <mat-option value="US">United States</mat-option>
                    <mat-option value="other">Other</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
            <div class="step-actions">
              <button class="btn btn-primary" matStepperNext>
                Next <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Emergency Contact -->
        <mat-step
          [stepControl]="emergencyForm"
          label="Emergency Contact"
        >
          <form [formGroup]="emergencyForm" class="step-form">
            <div class="form-section-title">Emergency Contact</div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Contact Name</mat-label>
                <input matInput formControlName="name" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Relationship</mat-label>
                <mat-select formControlName="relationship">
                  <mat-option value="spouse">Spouse</mat-option>
                  <mat-option value="parent">Parent</mat-option>
                  <mat-option value="child">Child</mat-option>
                  <mat-option value="sibling">Sibling</mat-option>
                  <mat-option value="friend">Friend</mat-option>
                  <mat-option value="other">Other</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput type="tel" formControlName="phone" />
              </mat-form-field>
            </div>
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Back
              </button>
              <button class="btn btn-primary" matStepperNext>
                Next <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3: Insurance -->
        <mat-step [stepControl]="insuranceForm" label="Insurance">
          <form [formGroup]="insuranceForm" class="step-form">
            <div class="form-section-title">Insurance Information</div>
            <p class="form-helper">
              If you don't have insurance, you can skip this section.
            </p>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Insurance Provider</mat-label>
                <input matInput formControlName="provider" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Policy Number</mat-label>
                <input matInput formControlName="policyNumber" />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Group Number</mat-label>
                <input matInput formControlName="groupNumber" />
              </mat-form-field>
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Subscriber Name</mat-label>
                <input matInput formControlName="subscriberName" />
              </mat-form-field>
            </div>
            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Back
              </button>
              <button class="btn btn-primary" matStepperNext>
                Next <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 4: Medical History -->
        <mat-step label="Medical History">
          <form [formGroup]="medicalForm" class="step-form">
            <div class="form-section-title">Allergies</div>
            <div class="chip-input-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Add an allergy</mat-label>
                <input
                  matInput
                  #allergyInput
                  (keydown.enter)="addChip('allergies', allergyInput); $event.preventDefault()"
                />
                <button
                  matSuffix
                  mat-icon-button
                  (click)="addChip('allergies', allergyInput)"
                >
                  <mat-icon>add</mat-icon>
                </button>
              </mat-form-field>
              <div class="chip-list">
                @for (item of getAllergies(); track item) {
                  <span class="chip chip-cyan">
                    {{ item }}
                    <mat-icon class="chip-remove" (click)="removeChip('allergies', item)">close</mat-icon>
                  </span>
                }
              </div>
            </div>

            <div class="form-section-title">Current Medications</div>
            <div class="chip-input-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Add a medication</mat-label>
                <input
                  matInput
                  #medInput
                  (keydown.enter)="addChip('medications', medInput); $event.preventDefault()"
                />
                <button
                  matSuffix
                  mat-icon-button
                  (click)="addChip('medications', medInput)"
                >
                  <mat-icon>add</mat-icon>
                </button>
              </mat-form-field>
              <div class="chip-list">
                @for (item of getMedications(); track item) {
                  <span class="chip chip-teal">
                    {{ item }}
                    <mat-icon class="chip-remove" (click)="removeChip('medications', item)">close</mat-icon>
                  </span>
                }
              </div>
            </div>

            <div class="form-section-title">Existing Conditions / Diagnoses</div>
            <div class="chip-input-row">
              <mat-form-field class="dont-apply" appearance="outline">
                <mat-label>Add a condition</mat-label>
                <input
                  matInput
                  #condInput
                  (keydown.enter)="addChip('conditions', condInput); $event.preventDefault()"
                />
                <button
                  matSuffix
                  mat-icon-button
                  (click)="addChip('conditions', condInput)"
                >
                  <mat-icon>add</mat-icon>
                </button>
              </mat-form-field>
              <div class="chip-list">
                @for (item of getConditions(); track item) {
                  <span class="chip chip-orange">
                    {{ item }}
                    <mat-icon class="chip-remove" (click)="removeChip('conditions', item)">close</mat-icon>
                  </span>
                }
              </div>
            </div>

            <div class="form-section-title">Social History</div>
            <div formGroupName="socialHistory">
              <div class="form-row">
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>Smoking Status</mat-label>
                  <mat-select formControlName="smoking">
                    <mat-option value="never">Never</mat-option>
                    <mat-option value="former">Former Smoker</mat-option>
                    <mat-option value="current">Current Smoker</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>Alcohol Use</mat-label>
                  <mat-select formControlName="alcohol">
                    <mat-option value="none">None</mat-option>
                    <mat-option value="occasional">Occasional</mat-option>
                    <mat-option value="moderate">Moderate</mat-option>
                    <mat-option value="heavy">Heavy</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field class="dont-apply" appearance="outline">
                  <mat-label>Exercise Frequency</mat-label>
                  <mat-select formControlName="exercise">
                    <mat-option value="none">None</mat-option>
                    <mat-option value="light">1-2 days/week</mat-option>
                    <mat-option value="moderate">3-4 days/week</mat-option>
                    <mat-option value="active">5+ days/week</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Back
              </button>
              <button class="btn btn-primary" matStepperNext>
                Next <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 5: Consent & Submit -->
        <mat-step label="Consent & Submit">
          <form [formGroup]="consentForm" class="step-form">
            <div class="form-section-title">Consent</div>
            <div class="consent-box">
              <p>
                By checking the box below, I acknowledge that the information
                provided is accurate and complete to the best of my knowledge.
                I consent to the collection and use of my health information
                for treatment purposes in accordance with HIPAA regulations.
              </p>
              <p>
                I understand that my data will be securely stored and only
                accessed by authorized medical personnel.
              </p>
            </div>
            <mat-checkbox formControlName="consentSigned" color="primary">
              I agree to the terms and consent to treatment
            </mat-checkbox>

            <div class="step-actions">
              <button class="btn btn-secondary" matStepperPrevious>
                <mat-icon>arrow_back</mat-icon> Back
              </button>
              <button
                class="btn btn-success btn-submit layout-1"
                (click)="onSubmit()"
                [disabled]="!consentForm.value.consentSigned || submitting()"
              >
                <mat-icon>send</mat-icon> Submit Intake Form
              </button>
            </div>
          </form>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: `
    .intake-form-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: #094997;
      margin: 0 0 4px;
    }

    .page-subtitle {
      color: #646464;
      font-size: 14px;
      margin: 0 0 24px;
    }

    @media (max-width: 550px) {
      .page-title { font-size: 22px; }
    }

    .intake-stepper {
      background: transparent;
    }

    .step-form {
      padding: 16px 0;
    }

    .form-section-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 20px 0 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #eee;
    }

    .form-section-title:first-child {
      margin-top: 0;
    }

    .form-helper {
      color: #757575;
      font-size: 13px;
      margin: -4px 0 16px;
    }

    .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 4px;
    }

    .form-row mat-form-field { flex: 1; }

    @media (max-width: 599px) {
      .form-row {
        flex-direction: column;
        gap: 4px;
      }
    }

    .chip-input-row {
      margin-bottom: 8px;
    }

    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
      min-height: 24px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 13px;
      color: #fff;
    }

    .chip-cyan { background: rgb(0, 208, 255); }
    .chip-teal { background: #089bab; }
    .chip-orange { background: rgb(255, 177, 119); }

    .chip-remove {
      font-size: 16px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      opacity: 0.8;
    }

    .chip-remove:hover { opacity: 1; }

    .consent-box {
      background: #eef5fd;
      border: 1px solid #d9edf7;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 16px;
      color: #333;
      font-size: 14px;
      line-height: 1.6;
    }

    .consent-box p { margin: 0 0 8px; }
    .consent-box p:last-child { margin-bottom: 0; }

    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .step-actions .btn {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .btn-submit.layout-1 mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `,
})
export class IntakeFormPageComponent {
  demographicsForm: FormGroup;
  emergencyForm: FormGroup;
  insuranceForm: FormGroup;
  medicalForm: FormGroup;
  consentForm: FormGroup;
  submitting = signal(false);
  token: string | null = null;

  private allergies = signal<string[]>([]);
  private medications = signal<string[]>([]);
  private conditions = signal<string[]>([]);

  getAllergies = this.allergies.asReadonly();
  getMedications = this.medications.asReadonly();
  getConditions = this.conditions.asReadonly();

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
    });

    this.demographicsForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      language: ['en'],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required],
        country: ['US'],
      }),
    });

    this.emergencyForm = this.fb.group({
      name: ['', Validators.required],
      relationship: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.insuranceForm = this.fb.group({
      provider: [''],
      policyNumber: [''],
      groupNumber: [''],
      subscriberName: [''],
    });

    this.medicalForm = this.fb.group({
      socialHistory: this.fb.group({
        smoking: ['never'],
        alcohol: ['none'],
        exercise: ['none'],
      }),
    });

    this.consentForm = this.fb.group({
      consentSigned: [false, Validators.requiredTrue],
    });
  }

  addChip(
    list: 'allergies' | 'medications' | 'conditions',
    input: HTMLInputElement
  ) {
    const value = input.value.trim();
    if (!value) return;
    const sig =
      list === 'allergies'
        ? this.allergies
        : list === 'medications'
          ? this.medications
          : this.conditions;
    if (!sig().includes(value)) {
      sig.update((arr) => [...arr, value]);
    }
    input.value = '';
  }

  removeChip(list: 'allergies' | 'medications' | 'conditions', item: string) {
    const sig =
      list === 'allergies'
        ? this.allergies
        : list === 'medications'
          ? this.medications
          : this.conditions;
    sig.update((arr) => arr.filter((i) => i !== item));
  }

  async onSubmit() {
    this.submitting.set(true);
    
    // Construct full data payload payload
    const payload: any = {
      demographicsForm: this.demographicsForm.value,
      emergencyForm: this.emergencyForm.value,
      insuranceForm: this.insuranceForm.value,
      medicalForm: {
        ...this.medicalForm.value,
        allergies: this.allergies(),
        medications: this.medications(),
        conditions: this.conditions()
      },
      consentForm: this.consentForm.value
    };

    if (this.token) {
        payload.token = this.token;
    }

    try {
      const response = await fetch('/api/submitIntake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      this.submitting.set(false);
      this.router.navigate(['/confirmation']);
    } catch (err) {
      console.error('Error submitting form:', err);
      this.submitting.set(false);
      alert('There was an issue submitting your form. Please try again.');
    }
  }
}
