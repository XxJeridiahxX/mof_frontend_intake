import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <h1 class="page-title">Patients</h1>
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
    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 20px;
    }

    .placeholder-card {
      padding: 40px;
      box-shadow: rgb(221, 221, 221) 0px 0px 10px 0px;
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
