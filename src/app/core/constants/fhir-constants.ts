export const FHIR_CONSTANTS = {
  OMB_RACE: [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Other Race'
  ],
  OMB_ETHNICITY: [
    'Hispanic or Latino',
    'Not Hispanic or Latino'
  ],
  ADMIN_SEX: [
    'Male',
    'Female',
    'Other',
    'Unknown'
  ],
  MARITAL_STATUS: [
    'Annulled',
    'Divorced',
    'Domestic Partner',
    'Interlocutory',
    'Legally Separated',
    'Married',
    'Never Married',
    'Polygamous',
    'Widowed'
  ],
  RELATIONSHIPS: [
    'Self',
    'Spouse',
    'Child',
    'Common Law Spouse',
    'Other'
  ]
};

/**
 * Strict validator for autocomplete fields.
 * Forces the user's input to precisely match an existing string in the provided array.
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function RequireMatchValidator(options: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't block if empty (unless also marked as required natively)
    }
    const match = options.find((opt) => opt.toLowerCase() === control.value.toLowerCase());
    return match ? null : { requireMatch: true };
  };
}
