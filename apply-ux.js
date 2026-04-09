const fs = require('fs');

let file = fs.readFileSync('src/app/features/intake/pages/intake-form/intake-form.page.ts', 'utf8');

// 1. Add top-level imports
const topImports = `
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
`;
file = file.replace(/import { MatAutocompleteModule } from '@angular\/material\/autocomplete';/, "import { MatAutocompleteModule } from '@angular/material/autocomplete';" + topImports);

// 2. Add standalone imports
file = file.replace(/MatAutocompleteModule,/, "MatAutocompleteModule,\n    MatSidenavModule,\n    MatListModule,\n    MatToolbarModule,");

// 3. Template changes
const startWrapper = `
<mat-sidenav-container class="mobile-sidenav-wrapper" [class.is-mobile]="isMobile">
  <mat-sidenav #sidenav mode="over" position="end" class="intake-sidenav">
    <mat-toolbar color="primary" style="background-color: #094997; color: white;">
      <span style="font-size: 16px;">Form Navigation</span>
      <span style="flex: 1 1 auto;"></span>
      <button mat-icon-button (click)="sidenav.close()"><mat-icon>close</mat-icon></button>
    </mat-toolbar>
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
      <mat-toolbar style="background-color: #094997; color: white;" class="mobile-top-toolbar">
        <span style="font-size: 16px;">Step {{ (stepper?.selectedIndex || 0) + 1 }} of 6</span>
        <span style="flex: 1 1 auto;"></span>
        <button mat-icon-button (click)="sidenav.open()">
          <mat-icon>menu</mat-icon>
        </button>
      </mat-toolbar>
      <mat-progress-bar mode="determinate" [value]="(((stepper?.selectedIndex || 0) + 1) / 6) * 100" color="accent"></mat-progress-bar>
    }
`;

file = file.replace(/<div class="intake-form-container">/, startWrapper + `\n    <div class="intake-form-container">`);
file = file.replace(/<\/mat-stepper>\s*<\/div>\s*`/g, `</mat-stepper>\n    </div>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n  \``);

// 4. Styles Changes (NN/g 48px hit targets & hidden stepper)
const additionalStyles = `
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
`;
file = file.replace(/styles: \`([\s\S]*?)\`/g, (match, p1) => {
   return "styles: `" + p1 + additionalStyles + "`";
});

// 5. TS Class logic changes
file = file.replace(/submitting = signal\(false\);/, "submitting = signal(false);\n  isMobile = false;");

const constructorInject = `constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe(result => {
      this.isMobile = result.matches;
    });`;
file = file.replace(/constructor\(private fb: FormBuilder, private router: Router, private route: ActivatedRoute\) \{/g, constructorInject);

fs.writeFileSync('src/app/features/intake/pages/intake-form/intake-form.page.ts', file);
console.log("UX Sidenav successfully applied.");
