const fs = require('fs');

let file = fs.readFileSync('src/app/features/intake/pages/intake-form/intake-form.page.ts', 'utf8');

// The typescript changes
file = file.replace(/consentForm: FormGroup;/g, 
  'consentForm: FormGroup;\n\n  step1Form!: FormGroup;\n  step2Form!: FormGroup;\n  step3Form!: FormGroup;\n  step4Form!: FormGroup;\n  step5Form!: FormGroup;\n  step6Form!: FormGroup;');

file = file.replace(/this\.consentForm = this\.fb\.group\(\{\n\s*consentTreat: \[false, Validators\.requiredTrue\],\n\s*consentFinancial: \[false, Validators\.requiredTrue\],\n\s*consentPrivacy: \[false, Validators\.requiredTrue\]\n\s*\}\);/g, 
`this.consentForm = this.fb.group({
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
    });`);

// We are going to split the file by <mat-step>
const stepRegex = /<!-- STEP \d+: [^-]+ -->\s*<mat-step \[stepControl\]="[^"]+" label="[^"]+">\s*<form \[formGroup\]="([^"]+)" class="step-form">([\s\S]*?)<\/form>\s*<\/mat-step>/g;

let forms = {};
let match;
while ((match = stepRegex.exec(file)) !== null) {
  let formName = match[1];
  let formHTML = match[2];
  
  // Cut out the step-actions, we will put them only at the end of the super-step wrapper
  formHTML = formHTML.replace(/<div class="step-actions">[\s\S]*?<\/div>/, '');
  forms[formName] = formHTML;
}

// Ensure all 11 forms are found
if(Object.keys(forms).length !== 11) {
  console.log("Error: Didn't find all 11 forms! Found: " + Object.keys(forms).length);
  process.exit(1);
}

// Build new stepper HTML
const wrapForm = (formName, html) => `\n          <form [formGroup]="${formName}" class="step-form">\n${html}\n          </form>\n`;
const divider = `\n          <hr class="super-step-divider" />\n`;

const s1Content = wrapForm('demographicsForm', forms['demographicsForm']) + divider + wrapForm('contactForm', forms['contactForm']) + divider + wrapForm('careTeamForm', forms['careTeamForm']);
const s2Content = wrapForm('insuranceForm', forms['insuranceForm']) + divider + wrapForm('pharmacyForm', forms['pharmacyForm']);
const s3Content = wrapForm('visitForm', forms['visitForm']);
const s4Content = wrapForm('allergiesMedicationsForm', forms['allergiesMedicationsForm']);
const s5Content = wrapForm('medicalHistoryForm', forms['medicalHistoryForm']) + divider + wrapForm('socialHistoryForm', forms['socialHistoryForm']) + divider + wrapForm('familyHistoryForm', forms['familyHistoryForm']);
const s6Content = wrapForm('consentForm', forms['consentForm']);

const stepActions = (prev, next, submit=false) => `
            <div class="step-actions">
              ${prev ? '<button class="btn btn-secondary" matStepperPrevious>&larr; Back</button>' : ''}
              ${next ? '<button class="btn btn-primary" matStepperNext>Next &rarr;</button>' : ''}
              ${submit ? '<button class="btn btn-success btn-submit layout-1" (click)="onSubmit()" [disabled]="consentForm.invalid || submitting()"><mat-icon>send</mat-icon> Submit Complete Intake</button>' : ''}
            </div>`;

const fullStepperHTML = `<mat-stepper [linear]="false" #stepper class="intake-stepper">
        
        <!-- STEP 1: Patient Profile -->
        <mat-step [stepControl]="step1Form" label="1. Patient Profile">
          <div class="super-step-wrapper">
            ${s1Content}
            ${stepActions(false, true)}
          </div>
        </mat-step>

        <!-- STEP 2: Coverage -->
        <mat-step [stepControl]="step2Form" label="2. Coverage">
          <div class="super-step-wrapper">
            ${s2Content}
            ${stepActions(true, true)}
          </div>
        </mat-step>

        <!-- STEP 3: Current Visit -->
        <mat-step [stepControl]="step3Form" label="3. Chief Complaint">
          <div class="super-step-wrapper">
            ${s3Content}
            ${stepActions(true, true)}
          </div>
        </mat-step>

        <!-- STEP 4: Active Clinicals -->
        <mat-step [stepControl]="step4Form" label="4. Allergies & Meds">
          <div class="super-step-wrapper">
            ${s4Content}
            ${stepActions(true, true)}
          </div>
        </mat-step>

        <!-- STEP 5: Past History -->
        <mat-step [stepControl]="step5Form" label="5. Health History">
          <div class="super-step-wrapper">
            ${s5Content}
            ${stepActions(true, true)}
          </div>
        </mat-step>

        <!-- STEP 6: Consents -->
        <mat-step [stepControl]="step6Form" label="6. Signatures">
          <div class="super-step-wrapper">
            ${s6Content}
            ${stepActions(true, false, true)}
          </div>
        </mat-step>
      </mat-stepper>`;

// Replace old stepper with new stepper
const oldStepperRegex = /<mat-stepper \[linear\]="false" #stepper class="intake-stepper">[\s\S]*?<\/mat-stepper>/;
file = file.replace(oldStepperRegex, fullStepperHTML);

// Also add our custom CSS to fix the mobile stepper wrapper
file = file.replace(/styles: \`/, `styles: \`
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
`);

fs.writeFileSync('src/app/features/intake/pages/intake-form/intake-form.page.ts', file);
console.log("Successfully rebuilt components.");
