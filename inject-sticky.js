const fs = require('fs');
let file = fs.readFileSync('src/app/features/intake/pages/intake-form/intake-form.page.ts', 'utf8');

// ─── 1. REMOVE ALL step-actions divs from inside steps ───────────────────────
// They come in two flavours: first step (Next only), mid-steps (Back + Next), last step (Back + Submit)
// We'll strip all of them — navigation moves to the sticky footer.
file = file.replace(
  /\s*<div class="step-actions">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/mat-step>|<\/form>)/g,
  ''
);

// ─── 2. ADD a desktop sticky header above the sidenav-content ─────────────────
// Insert after the opening <mat-sidenav-content>
file = file.replace(
  `  <mat-sidenav-content>`,
  `  <mat-sidenav-content>
    <!-- ══ DESKTOP STICKY HEADER ══ -->
    <div class="desktop-sticky-header">
      <div class="desktop-header-inner">
        <div class="desktop-header-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#094997"/>
            <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span class="desktop-header-title">MOF Patient Intake</span>
        </div>
        <div class="desktop-header-progress">
          <span class="desktop-step-label">Step {{ (stepper?.selectedIndex || 0) + 1 }} of 6</span>
          <span class="desktop-step-name">{{ stepLabels[(stepper?.selectedIndex || 0)] }}</span>
        </div>
      </div>
      <mat-progress-bar mode="determinate" [value]="(((stepper?.selectedIndex || 0) + 1) / 6) * 100" color="accent" style="height:3px;"></mat-progress-bar>
    </div>`
);

// ─── 3. INJECT sticky footer just before </mat-sidenav-content> ───────────────
file = file.replace(
  `  </mat-sidenav-content>`,
  `    <!-- ══ UNIVERSAL STICKY FOOTER ══ -->
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
  </mat-sidenav-content>`
);

// ─── 4. INJECT CSS for sticky header, sticky footer, and safe scroll area ─────
const footerCSS = `
    /* ═══ DESKTOP STICKY HEADER ═══ */
    .desktop-sticky-header {
      position: sticky;
      top: 0;
      z-index: 900;
      background: white;
      border-bottom: 1px solid #e8eaed;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .desktop-header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 60px;
      max-width: 960px;
      margin: 0 auto;
    }
    .desktop-header-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .desktop-header-title {
      font-size: 17px;
      font-weight: 700;
      color: #094997;
      letter-spacing: -0.2px;
    }
    .desktop-header-progress {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .desktop-step-label {
      font-size: 13px;
      font-weight: 600;
      color: #094997;
    }
    .desktop-step-name {
      font-size: 12px;
      color: #888;
    }
    @media (max-width: 800px) {
      .desktop-sticky-header { display: none; }
    }

    /* ═══ UNIVERSAL STICKY FOOTER ═══ */
    .sticky-footer {
      position: sticky;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 900;
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

    /* Ensure scrollable content has bottom padding so footer never covers fields */
    .intake-form-container {
      padding-bottom: 90px !important;
    }
`;

file = file.replace(
  `    /* ------- Custom Mobile Toolbar ------- */`,
  footerCSS + `\n    /* ------- Custom Mobile Toolbar ------- */`
);

fs.writeFileSync('src/app/features/intake/pages/intake-form/intake-form.page.ts', file);
console.log('Sticky header + footer injected successfully.');
