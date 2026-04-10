import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

const TEAL  = '#089bab';
const NAVY  = '#094997';
const GRAY  = '#646464';
const LGRAY = '#f4f6f9';
const DKGRAY = '#333333';

@Injectable({ providedIn: 'root' })
export class IntakePdfService {

  async generate(intake: any, rawData: any, options: {
    allergies: any[], medications: any[], surgeries: any[], familyConditions: any[],
    cardFrontUrl: string | null, cardBackUrl: string | null,
  }): Promise<void> {
    const d = rawData || {};
    const dem  = d.demographicsForm  || {};
    const con  = d.contactForm       || {};
    const ins  = d.insuranceForm     || {};
    const vis  = d.visitForm         || {};
    const pha  = d.pharmacyForm      || {};
    const soc  = d.socialHistoryForm || {};
    const care = d.careTeamForm      || {};

    const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const patientName = `${dem.firstName || ''} ${dem.lastName || ''}`.trim() || intake.name || '—';
    const dob = dem.dateOfBirth || '—';

    // Pre-fetch insurance card images as base64 for embedding
    const [cardFrontB64, cardBackB64] = await Promise.all([
      options.cardFrontUrl ? this.toBase64(options.cardFrontUrl) : Promise.resolve(null),
      options.cardBackUrl  ? this.toBase64(options.cardBackUrl)  : Promise.resolve(null),
    ]);

    const docDef: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 50],
      defaultStyle: { font: 'Roboto', fontSize: 9, color: DKGRAY },

      header: (page: number, pages: number) => ({
        columns: [
          { text: 'Medical Office Force', bold: true, fontSize: 11, color: NAVY, margin: [40, 16, 0, 0] },
          { text: `Page ${page} of ${pages}`, alignment: 'right', fontSize: 8, color: GRAY, margin: [0, 18, 40, 0] },
        ],
      }),

      footer: () => ({
        columns: [
          { text: `Generated ${now} · CONFIDENTIAL — FOR CLINICAL USE ONLY`, fontSize: 7, color: '#aaa', margin: [40, 0, 40, 0] },
        ],
      }),

      content: [
        // ── Title block ──
        {
          canvas: [{ type: 'rect', x: 0, y: 0, w: 515, h: 52, r: 6, color: NAVY }],
          margin: [0, 0, 0, 0],
        },
        {
          columns: [
            {
              stack: [
                { text: 'Patient Intake Form', fontSize: 16, bold: true, color: 'white' },
                { text: patientName, fontSize: 12, color: '#c8daff', margin: [0, 2, 0, 0] },
              ],
              margin: [12, -46, 0, 0],
            },
            {
              stack: [
                { text: `DOB: ${dob}`, fontSize: 9, color: '#c8daff', alignment: 'right' },
                { text: `Intake ID: #${intake.id}`, fontSize: 8, color: '#8aa8dd', alignment: 'right', margin: [0, 2, 0, 0] },
                { text: `Status: ${intake.statusLabel || intake.status}`, fontSize: 8, color: '#8aa8dd', alignment: 'right', margin: [0, 2, 0, 0] },
              ],
              margin: [0, -46, 12, 0],
            },
          ],
          margin: [0, 0, 0, 16],
        },

        // ── Demographics ──
        ...this.section('Patient Demographics', 'person', [
          this.row4([
            ['First Name',   dem.firstName   || '—'],
            ['Middle Name',  dem.middleName   || '—'],
            ['Last Name',    dem.lastName     || '—'],
            ['Suffix',       dem.suffix       || '—'],
          ]),
          this.row4([
            ['Date of Birth',      dem.dateOfBirth      || '—'],
            ['Sex at Birth',       dem.sexAssigned       || '—'],
            ['Gender Identity',    dem.genderIdentity    || '—'],
            ['SSN',               dem.ssn               || '—'],
          ]),
          this.row4([
            ['Race',             dem.race             || '—'],
            ['Ethnicity',        dem.ethnicity        || '—'],
            ['Marital Status',   dem.maritalStatus    || '—'],
            ['Employment',       dem.employmentStatus || '—'],
          ]),
          this.row2([
            ['Employer', dem.employerName || '—'],
            ['', ''],
          ]),
        ]),

        // ── Contact ──
        ...this.section('Contact Information', 'contact_phone', [
          this.row4([
            ['Cell Phone',  con.cellPhone  || '—'],
            ['Home Phone',  con.homePhone  || '—'],
            ['Work Phone',  con.workPhone  || '—'],
            ['Email',       con.emailAddress || '—'],
          ]),
          this.row4([
            ['Street',      con.mailingStreet || '—'],
            ['City',        con.mailingCity   || '—'],
            ['State',       con.mailingState  || '—'],
            ['ZIP',         con.mailingZip    || '—'],
          ]),
          this.row2([
            ['Preferred Contact Method', con.bestContactMethod || '—'],
            ['', ''],
          ]),
        ]),

        // ── Chief Complaint ──
        ...this.section('Chief Complaint & Visit Reason', 'medical_services', [
          this.rowFull('Chief Complaint',  vis.chiefComplaint  || '—'),
          this.rowFull('Current Symptoms', vis.currentSymptoms || '—'),
          this.row2([
            ['Symptom Onset', vis.symptomOnset || '—'],
            ['Appointment Requested', d.appointmentTime || '—'],
          ]),
        ]),

        // ── Insurance ──
        ...this.section('Insurance / Coverage', 'health_and_safety', [
          this.row4([
            ['Primary Carrier',    ins.primaryCarrier  || '—'],
            ['Member / Subscriber ID', ins.subscriberId || '—'],
            ['Group Number',       ins.groupNumber     || '—'],
            ['Relationship',       ins.relationship    || '—'],
          ]),
          this.row4([
            ['Policy Holder First', ins.policyHolderFirstName || '—'],
            ['Policy Holder Last',  ins.policyHolderLastName  || '—'],
            ['Holder DOB',          ins.policyHolderDob       || '—'],
            ['', ''],
          ]),
          ...(cardFrontB64 || cardBackB64 ? [
            { text: 'Insurance Card Photos', fontSize: 8, color: GRAY, bold: true, margin: [0, 8, 0, 4] } as Content,
            {
              columns: [
                cardFrontB64 ? {
                  stack: [
                    { text: 'Front', fontSize: 7, color: GRAY, bold: true, margin: [0, 0, 0, 2] },
                    { image: cardFrontB64, fit: [200, 120], margin: [0, 0, 0, 4] },
                  ],
                } : { text: '' },
                cardBackB64 ? {
                  stack: [
                    { text: 'Back', fontSize: 7, color: GRAY, bold: true, margin: [0, 0, 0, 2] },
                    { image: cardBackB64, fit: [200, 120], margin: [0, 0, 0, 4] },
                  ],
                } : { text: '' },
              ], columnGap: 16, margin: [0, 0, 0, 4],
            } as Content,
          ] : []),
        ]),

        // ── Care Team ──
        ...this.section('Care Team / Referral', 'groups', [
          this.row4([
            ['Referring Provider',  care.referringProvider  || '—'],
            ['Primary Care',        care.primaryCareProvider|| '—'],
            ['Specialist',          care.specialist         || '—'],
            ['Preferred Language',  care.preferredLanguage  || '—'],
          ]),
        ]),

        // ── Pharmacy ──
        ...this.section('Preferred Pharmacy', 'local_pharmacy', [
          this.row4([
            ['Name',   pha.localName   || '—'],
            ['Phone',  pha.localPhone  || '—'],
            ['Street', pha.localStreet || '—'],
            ['City',   pha.localCity   || '—'],
          ]),
          this.row2([
            ['State', pha.localState || '—'],
            ['ZIP',   pha.localZip   || '—'],
          ]),
        ]),

        // ── Social History ──
        ...this.section('Social History', 'diversity_3', [
          this.row4([
            ['Tobacco Use',     soc.usesTobacco       || '—'],
            ['Frequency',       soc.tobaccoFrequency  || '—'],
            ['Drug Use',        soc.usesDrugs         || '—'],
            ['Drug Types',      soc.drugsTypes        || '—'],
          ]),
          this.row4([
            ['Exercise',        soc.exercises         || '—'],
            ['Exercise Type',   soc.exerciseType      || '—'],
            ['Diet Rating',     soc.dietRating        || '—'],
            ['', ''],
          ]),
        ]),

        // ── Allergies ──
        ...this.clinicalSection('Allergies', options.allergies,
          ['Allergen', 'Reaction'],
          (a) => [a.name || '—', a.reaction || '—'],
          '#fff0f0', '#d32f2f'),

        // ── Medications ──
        ...this.clinicalSection('Current Medications', options.medications,
          ['Medication', 'Dosage', 'Frequency'],
          (m) => [m.name || '—', m.dosage || '—', m.frequency || '—'],
          '#e8f5e9', '#2e7d32'),

        // ── Surgical History ──
        ...this.clinicalSection('Surgical History', options.surgeries,
          ['Procedure', 'Date / Year'],
          (s) => [s.type || '—', s.date || '—'],
          '#fff8e1', '#c95817'),

        // ── Family History ──
        ...this.clinicalSection('Family History', options.familyConditions,
          ['Diagnosis / Condition', 'Family Member'],
          (f) => [f.diagnosis || '—', f.member || '—'],
          '#f3e5f5', '#6a1b9a'),

        // ── Signature block ──
        { text: '', margin: [0, 12, 0, 0] },
        {
          canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e0e4ea' }],
          margin: [0, 0, 0, 12],
        },
        {
          columns: [
            {
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1, lineColor: '#999' }] },
                { text: 'Patient Signature', fontSize: 8, color: GRAY, margin: [0, 3, 0, 0] },
              ],
            },
            {
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 140, y2: 0, lineWidth: 1, lineColor: '#999' }] },
                { text: 'Date', fontSize: 8, color: GRAY, margin: [0, 3, 0, 0] },
              ],
              margin: [20, 0, 0, 0],
            },
            {
              stack: [
                { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 1, lineColor: '#999' }] },
                { text: 'Staff Initials', fontSize: 8, color: GRAY, margin: [0, 3, 0, 0] },
              ],
              margin: [20, 0, 0, 0],
            },
          ],
        },
      ],
    };

    pdfMake.createPdf(docDef).open();
  }

  // ── Helpers ──

  private section(title: string, _icon: string, rows: Content[]): Content[] {
    return [
      {
        stack: [
          {
            canvas: [{ type: 'rect', x: 0, y: 0, w: 515, h: 20, color: LGRAY }],
          },
          {
            text: title.toUpperCase(),
            fontSize: 8, bold: true, color: NAVY, characterSpacing: 0.5,
            margin: [6, -14, 0, 0],
          },
        ],
        margin: [0, 10, 0, 4],
      },
      ...rows,
    ];
  }

  private row4(pairs: [string, string][]): Content {
    return {
      columns: pairs.map(([label, value]) => ({
        stack: [
          { text: label, fontSize: 7, color: GRAY, bold: true },
          { text: value, fontSize: 9, color: DKGRAY, margin: [0, 1, 0, 0] },
        ],
        width: '*',
      })),
      columnGap: 8,
      margin: [0, 0, 0, 6],
    };
  }

  private row2(pairs: [string, string][]): Content {
    return {
      columns: pairs.map(([label, value]) => ({
        stack: [
          { text: label, fontSize: 7, color: GRAY, bold: true },
          { text: value, fontSize: 9, color: DKGRAY, margin: [0, 1, 0, 0] },
        ],
        width: '50%',
      })),
      columnGap: 8,
      margin: [0, 0, 0, 6],
    };
  }

  private rowFull(label: string, value: string): Content {
    return {
      stack: [
        { text: label, fontSize: 7, color: GRAY, bold: true },
        { text: value, fontSize: 9, color: DKGRAY, margin: [0, 1, 0, 0] },
      ],
      margin: [0, 0, 0, 6],
    };
  }

  private clinicalSection(
    title: string, items: any[],
    headers: string[], rowFn: (item: any) => string[],
    bgColor: string, headColor: string,
  ): Content[] {
    const body: any[] = [
      headers.map(h => ({
        text: h, fontSize: 8, bold: true, color: headColor,
        fillColor: bgColor, border: [false, false, false, true],
        borderColor: ['', '', '', headColor],
      })),
    ];
    if (items.length) {
      items.forEach(item => {
        body.push(rowFn(item).map(cell => ({
          text: cell, fontSize: 9, border: [false, false, false, true],
          borderColor: ['', '', '', '#f0f0f0'],
        })));
      });
    } else {
      body.push([{
        text: 'None recorded', fontSize: 9, color: '#bbb', italics: true,
        colSpan: headers.length, border: [false, false, false, false],
      }, ...Array(headers.length - 1).fill({ text: '', border: [false, false, false, false] })]);
    }

    return [
      {
        stack: [
          { canvas: [{ type: 'rect', x: 0, y: 0, w: 515, h: 20, color: LGRAY }] },
          { text: title.toUpperCase(), fontSize: 8, bold: true, color: NAVY, characterSpacing: 0.5, margin: [6, -14, 0, 0] },
        ],
        margin: [0, 10, 0, 4],
      },
      {
        table: {
          headerRows: 1,
          widths: Array(headers.length).fill('*'),
          body,
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 4],
      },
    ];
  }

  private async toBase64(url: string): Promise<string | null> {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = () => reject(null);
        reader.readAsDataURL(blob);
      });
    } catch { return null; }
  }
}
