export interface Doctor {
  uid: string;
  name: string;
  email: string;
  role: 'doctor';
  status: 'APPROVED' | 'PENDING' | 'SUSPENDED';
  hospital: string;
  department: string;
  license: string;
}

export interface DoctorApplication {
  id: string;
  fullName: string;
  hospitalName: string;
  hospitalAddress: string;
  medicalCouncilRegNo: string;
  degreeDetails: string;
  degreeDocName: string;
  degreeDocPreview: string;
  email: string;
  mobile: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface VerifiedMedication {
  name: string;
  dosage: string;
  frequency: string;
  status: 'VERIFIED' | 'DISCONTINUED' | 'PENDING';
  instructions?: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  image_url_or_base64: string;
  captured_at: string;
  doc_type: 'prescription' | 'case_paper' | 'lab_report';
  ocr_extraction: string;
  doctor_notes?: string;
  verified_medications?: VerifiedMedication[];
  doctor_verified?: boolean;
}

export interface PatientVitals {
  bp: string;
  pulse: string;
  spo2: string;
  temp: string;
  last_checkup: string;
  calibrated_by?: string;
  calibrated_at?: string;
}

export interface PatientSOAP {
  chiefComplaint: string;
  hpi: string;
  assessment: string;
  triageLevel: 'Low' | 'Moderate' | 'High' | 'Emergency';
  currentMedications: string;
  allergies: string;
  doctor_notes?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface AyushEvaluation {
  vata: number;
  pitta: number;
  kapha: number;
  dominantPrakriti: string;
  aharaVihara: string;
  updated_at?: string;
  doctor_signature?: string;
}

export interface PatientRecord {
  uid: string;
  name: string;
  email: string;
  gender: string;
  age: number;
  dob: string;
  bloodGroup: string;
  abha: string;
  abhaVerified: boolean;
  mrn: string;
  mrnVerified: boolean;
  vitals: PatientVitals;
  latest_summary: string;
  soap_notes?: PatientSOAP;
  prescriptions: PrescriptionItem[];
  case_papers: PrescriptionItem[];
  ayush?: AyushEvaluation;
}

export interface OtpSession {
  email: string;
  otp: string;
  doctorName: string;
  hospital: string;
  createdAt: number;
  expiresAt: number;
}
