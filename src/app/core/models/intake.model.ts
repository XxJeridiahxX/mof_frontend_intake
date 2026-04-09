export interface PatientBasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  preferredAppointmentTime?: string;
  organizationCode?: string;
}

export interface MagicLinkVerification {
  token: string;
  dateOfBirth: string; // YYYY-MM-DD
}

export interface IntakeFormData {
  // Demographics
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Insurance
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberName?: string;
    subscriberDob?: string;
  };

  // Medical History
  medicalHistory: {
    allergies: string[];
    medications: string[];
    diagnoses: string[];
    procedures: string[];
    familyHistory: string[];
    socialHistory: {
      smoking?: string;
      alcohol?: string;
      exercise?: string;
    };
  };

  // Consent
  consentSigned: boolean;
  consentTimestamp?: string;
}

export interface IntakeFormStatus {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  status: 'link_sent' | 'in_progress' | 'submitted' | 'reviewed' | 'converted';
  createdAt: string;
  updatedAt: string;
  assignedStaff?: string;
}
