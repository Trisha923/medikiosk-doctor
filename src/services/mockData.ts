import { PatientRecord, Doctor } from '../types';

// High-fidelity SVG medical scan for Prescription Page 1
export const SAMPLE_PRESCRIPTION_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="100%" height="100%">
  <defs>
    <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feDiffuseLighting in="noise" lighting-color="#fffdf8" surfaceScale="1.2" result="light">
        <feDistantLight azimuth="45" elevation="60" />
      </feDiffuseLighting>
      <feBlend mode="multiply" in="SourceGraphic" in2="light" />
    </filter>
  </defs>
  <rect width="800" height="1100" fill="#FCFAF6"/>
  <rect x="25" y="25" width="750" height="1050" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="4"/>
  
  <!-- Hospital Header -->
  <g transform="translate(60, 60)">
    <circle cx="35" cy="35" r="30" fill="#E6533C" opacity="0.1"/>
    <path d="M35 15 v40 M15 35 h40" stroke="#E6533C" stroke-width="6" stroke-linecap="round"/>
    <text x="85" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="bold" fill="#1E293B">CIVIL HOSPITAL AHMEDABAD</text>
    <text x="85" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" fill="#64748B">DEPARTMENT OF PULMONOLOGY &amp; GENERAL MEDICINE</text>
    <text x="85" y="70" font-family="sans-serif" font-size="11" fill="#94A3B8">Asarwa, Ahmedabad, Gujarat 380016 | NABH Accredited</text>
  </g>
  
  <line x1="60" y1="155" x2="740" y2="155" stroke="#E6533C" stroke-width="2.5"/>
  
  <!-- Patient Bar -->
  <g transform="translate(60, 180)">
    <rect width="680" height="75" fill="#F8FAFC" stroke="#E2E8F0" rx="6"/>
    <text x="20" y="28" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">PATIENT NAME:</text>
    <text x="125" y="28" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">Ms. Riya Patel</text>
    <text x="290" y="28" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">AGE/SEX:</text>
    <text x="360" y="28" font-family="sans-serif" font-size="13" fill="#0F172A">24 Yrs / Female</text>
    <text x="490" y="28" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">DATE:</text>
    <text x="540" y="28" font-family="sans-serif" font-size="13" fill="#0F172A">09-Sep-2026</text>
    
    <text x="20" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">MRN / ABHA:</text>
    <text x="125" y="55" font-family="'JetBrains Mono', monospace" font-size="12" fill="#E6533C" font-weight="600">MRN-AHM-9941 / 91-4820-1940-2810</text>
    <text x="490" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">CABIN:</text>
    <text x="545" y="55" font-family="sans-serif" font-size="13" fill="#0F172A">OPD #4</text>
  </g>

  <!-- Clinical Rx section -->
  <g transform="translate(60, 290)">
    <!-- Rx symbol -->
    <text x="20" y="45" font-family="Georgia, serif" font-size="44" font-weight="bold" font-style="italic" fill="#E6533C">℞</text>
    <text x="80" y="40" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">CHIEF DIAGNOSIS: Acute Bronchial Irritation with Nocturnal Dry Cough (Post-Viral)</text>

    <!-- Medicine List -->
    <g transform="translate(40, 80)">
      <circle cx="0" cy="5" r="4" fill="#0284C7"/>
      <text x="15" y="10" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0F172A">1. Tab. Azithromycin 500 mg</text>
      <text x="15" y="32" font-family="sans-serif" font-size="13" fill="#475569">Dosage: 1 Tablet Once Daily (OD) after dinner — 5 Days</text>
      <text x="15" y="50" font-family="sans-serif" font-size="12" font-style="italic" fill="#0284C7">[Antibiotic Course - Do not skip dosage]</text>
    </g>

    <g transform="translate(40, 165)">
      <circle cx="0" cy="5" r="4" fill="#0284C7"/>
      <text x="15" y="10" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0F172A">2. Tab. Levocetirizine 5 mg + Montelukast 10 mg</text>
      <text x="15" y="32" font-family="sans-serif" font-size="13" fill="#475569">Dosage: 1 Tablet at Bedtime (HS) — 7 Days</text>
      <text x="15" y="50" font-family="sans-serif" font-size="12" font-style="italic" fill="#64748B">[Antihistamine / Anti-Allergic Relief]</text>
    </g>

    <g transform="translate(40, 250)">
      <circle cx="0" cy="5" r="4" fill="#0284C7"/>
      <text x="15" y="10" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0F172A">3. Syp. Ambroxol + Levosalbutamol (Ascoril-LS)</text>
      <text x="15" y="32" font-family="sans-serif" font-size="13" fill="#475569">Dosage: 10 ml Thrice Daily (TDS) with lukewarm water — 5 Days</text>
      <text x="15" y="50" font-family="sans-serif" font-size="12" font-style="italic" fill="#64748B">[Bronchodilator Expectorant]</text>
    </g>

    <g transform="translate(40, 335)">
      <circle cx="0" cy="5" r="4" fill="#0284C7"/>
      <text x="15" y="10" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0F172A">4. Steam Inhalation with Karvol Plus Drops</text>
      <text x="15" y="32" font-family="sans-serif" font-size="13" fill="#475569">Dosage: Twice Daily (Morning &amp; Night) for 10 minutes</text>
    </g>
  </g>

  <!-- Handwritten clinical note simulation -->
  <g transform="translate(90, 750)">
    <rect width="620" height="90" fill="#FEF3C7" opacity="0.6" stroke="#FDE68A" rx="6"/>
    <text x="20" y="28" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="bold" fill="#92400E">DOCTOR CLINICAL OBSERVATION &amp; ADVICE:</text>
    <text x="20" y="50" font-family="cursive, sans-serif" font-size="15" fill="#1E3A8A">"Throat erythematous, no exudates. Chest B/L clear. Avoid cold fluids &amp; dust exposure.</text>
    <text x="20" y="70" font-family="cursive, sans-serif" font-size="15" fill="#1E3A8A">Review in OPD after 5 days if cough persists or fever &gt; 100°F."</text>
  </g>

  <!-- Hospital Stamp & Signature -->
  <g transform="translate(470, 890)">
    <circle cx="80" cy="70" r="48" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-dasharray="4,2" opacity="0.8"/>
    <text x="44" y="60" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1D4ED8">CIVIL HOSPITAL</text>
    <text x="48" y="74" font-family="sans-serif" font-size="9" fill="#1D4ED8">OPD VERIFIED</text>
    <text x="50" y="88" font-family="sans-serif" font-size="9" fill="#1D4ED8">09 SEP 2026</text>
    
    <!-- Doctor signature curve -->
    <path d="M 50 25 Q 90 -10 120 20 T 170 15 T 210 35" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>
    <text x="60" y="45" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1E293B">Dr. Priya Sharma</text>
    <text x="60" y="60" font-family="sans-serif" font-size="11" fill="#64748B">MBBS, MD (Cardiology &amp; Gen Med)</text>
    <text x="60" y="75" font-family="'JetBrains Mono', monospace" font-size="10" fill="#64748B">Reg: MCI-GUJ-2015-8492</text>
  </g>

  <!-- MediKiosk OCR watermark footer -->
  <g transform="translate(60, 1020)">
    <line x1="0" y1="0" x2="680" y2="0" stroke="#E2E8F0" stroke-width="1"/>
    <text x="0" y="22" font-family="sans-serif" font-size="10" fill="#94A3B8">MediKiosk High-Precision OCR Engine v4.2 • Scanned Document ID: MED-OCR-20260909-7718 • Timestamp: 2026-09-09T05:20:00Z</text>
  </g>
</svg>
`)}`;

// High-fidelity SVG medical scan for Pulmonology Lab / Case Paper
export const SAMPLE_CASE_PAPER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="100%" height="100%">
  <rect width="800" height="1100" fill="#FCFAF6"/>
  <rect x="25" y="25" width="750" height="1050" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="4"/>
  
  <g transform="translate(60, 60)">
    <rect width="680" height="80" fill="#F1F5F9" rx="6"/>
    <text x="20" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="bold" fill="#0F172A">APEX CLINICAL PATHOLOGY &amp; PULMONOLOGY SLIP</text>
    <text x="20" y="52" font-family="sans-serif" font-size="12" fill="#475569">Accredited Diagnostic Wing • Civil Hospital Campus • Ph: +91 79 2268 0074</text>
    <text x="20" y="68" font-family="'JetBrains Mono', monospace" font-size="11" fill="#E6533C">CASE PAPER REF: APX-PUL-88219 • PATIENT: RIYA PATEL (F/24)</text>
  </g>

  <g transform="translate(60, 170)">
    <text x="0" y="20" font-family="sans-serif" font-size="15" font-weight="bold" fill="#1E293B">INVESTIGATION SUMMARY &amp; SPIROMETRY SCREENING</text>
    
    <!-- Table Header -->
    <rect x="0" y="40" width="680" height="35" fill="#E6533C" rx="4"/>
    <text x="20" y="63" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">TEST PARAMETER</text>
    <text x="260" y="63" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">OBSERVED VALUE</text>
    <text x="440" y="63" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">BIOLOGICAL REFERENCE</text>
    <text x="610" y="63" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">STATUS</text>

    <!-- Row 1 -->
    <rect x="0" y="80" width="680" height="40" fill="#F8FAFC"/>
    <text x="20" y="105" font-family="sans-serif" font-size="13" fill="#334155">Peak Expiratory Flow Rate (PEFR)</text>
    <text x="260" y="105" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">380 L/min</text>
    <text x="440" y="105" font-family="sans-serif" font-size="13" fill="#64748B">350 - 450 L/min</text>
    <text x="610" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16A34A">NORMAL</text>

    <!-- Row 2 -->
    <rect x="0" y="125" width="680" height="40" fill="#FFFFFF"/>
    <text x="20" y="150" font-family="sans-serif" font-size="13" fill="#334155">Total Leucocyte Count (TLC)</text>
    <text x="260" y="150" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">7,200 /cu.mm</text>
    <text x="440" y="150" font-family="sans-serif" font-size="13" fill="#64748B">4,000 - 11,000 /cu.mm</text>
    <text x="610" y="150" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16A34A">NORMAL</text>

    <!-- Row 3 -->
    <rect x="0" y="170" width="680" height="40" fill="#F8FAFC"/>
    <text x="20" y="195" font-family="sans-serif" font-size="13" fill="#334155">Absolute Eosinophil Count (AEC)</text>
    <text x="260" y="195" font-family="sans-serif" font-size="13" font-weight="bold" fill="#DC2626">490 /cu.mm</text>
    <text x="440" y="195" font-family="sans-serif" font-size="13" fill="#64748B">40 - 440 /cu.mm</text>
    <text x="610" y="195" font-family="sans-serif" font-size="12" font-weight="bold" fill="#EA580C">SLIGHT HIGH</text>

    <!-- Row 4 -->
    <rect x="0" y="215" width="680" height="40" fill="#FFFFFF"/>
    <text x="20" y="240" font-family="sans-serif" font-size="13" fill="#334155">C-Reactive Protein (CRP) Quantitative</text>
    <text x="260" y="240" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">3.2 mg/L</text>
    <text x="440" y="240" font-family="sans-serif" font-size="13" fill="#64748B">&lt; 5.0 mg/L</text>
    <text x="610" y="240" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16A34A">NORMAL</text>
  </g>

  <!-- Clinical Impression -->
  <g transform="translate(60, 480)">
    <rect width="680" height="120" fill="#EFF6FF" stroke="#BFDBFE" rx="6"/>
    <text x="20" y="30" font-family="sans-serif" font-size="13" font-weight="bold" fill="#1E40AF">PATHOLOGIST CLINICAL IMPRESSION:</text>
    <text x="20" y="55" font-family="sans-serif" font-size="13" fill="#1E293B">Mild eosinophilia consistent with allergic bronchial airway hyper-reactivity.</text>
    <text x="20" y="75" font-family="sans-serif" font-size="13" fill="#1E293B">No acute bacterial pyogenic shift in leucocyte differential. Inflammatory marker CRP normal.</text>
    <text x="20" y="95" font-family="sans-serif" font-size="12" font-style="italic" fill="#3B82F6">Correlate clinically with patient symptoms and spirometry response.</text>
  </g>

  <!-- Stamped Signatures -->
  <g transform="translate(460, 850)">
    <circle cx="80" cy="70" r="44" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="6,3" opacity="0.8"/>
    <text x="42" y="66" font-family="sans-serif" font-size="10" font-weight="bold" fill="#B91C1C">APEX LABS</text>
    <text x="45" y="78" font-family="sans-serif" font-size="9" fill="#B91C1C">VALIDATED</text>
    <text x="50" y="35" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0F172A">Dr. N. K. Mehta</text>
    <text x="50" y="50" font-family="sans-serif" font-size="11" fill="#64748B">MD Pathologist (Lab Director)</text>
  </g>
</svg>
`)}`;

export const INITIAL_DEMO_DOCTOR: Doctor = {
  uid: "doc_priya_sharma_001",
  name: "Dr. Priya Sharma",
  email: "dr.priya.sharma@medikiosk.in",
  role: "doctor",
  status: "APPROVED",
  hospital: "Civil Hospital Ahmedabad (Apex OPD)",
  department: "Cardiology & General Medicine (OPD Cabin #4)",
  license: "MCI-GUJ-2015-8492"
};

export const INITIAL_PATIENT: PatientRecord = {
  uid: "usr_riya_patel_1092",
  name: "Riya Patel",
  email: "riya@gmail.com",
  gender: "Female",
  age: 24,
  dob: "15/08/2002",
  bloodGroup: "O+",
  abha: "91-4820-1940-2810",
  abhaVerified: true,
  mrn: "MRN-AHM-9941",
  mrnVerified: true,
  vitals: {
    bp: "118/78",
    pulse: "74 bpm",
    spo2: "99%",
    temp: "98.4 °F",
    last_checkup: "Today, 09 Sep",
    calibrated_by: "MediKiosk Station #2 (OPD Cabin #4)",
    calibrated_at: "2026-09-09T05:15:00Z"
  },
  latest_summary: "Chief Complaint: Dry cough with nocturnal wheeze for 4 days. Mild throat irritation post seasonal weather change. No fever or hemoptysis.",
  soap_notes: {
    chiefComplaint: "Dry persistent nocturnal cough and throat dryness for 4 days.",
    hpi: "Patient reports sudden onset of tickling sensation in larynx triggering coughing spasms, primarily after lying down at night. Aggravated by AC draft. Self-administered hot ginger tea with transient relief. No shortness of breath or chest tightness.",
    assessment: "Post-viral bronchial hyper-reactivity / Allergic upper respiratory tract irritation.",
    triageLevel: "Moderate",
    currentMedications: "Tab. Multivitamin OD, Syp. Honey-Tulsi Herbal PRN",
    allergies: "NKDA (No Known Drug Allergies). Sensitive to house dust and pollen.",
    doctor_notes: "Advised steam inhalation twice daily and avoidance of refrigerated beverages. Continue prescribed bronchodilator syrup for 5 days.",
    updated_at: "2026-09-09T05:22:00Z",
    updated_by: "Dr. Priya Sharma"
  },
  prescriptions: [
    {
      id: "doc_17258392",
      name: "Prescription_Page_1.jpg",
      image_url_or_base64: SAMPLE_PRESCRIPTION_IMG,
      captured_at: "2026-09-09T05:20:00Z",
      doc_type: "prescription",
      ocr_extraction: "Rx: Tab. Azithromycin 500mg OD (5 days), Tab. Levocetirizine 5mg + Montelukast 10mg HS (7 days), Syp. Ambroxol + Levosalbutamol TDS. Notes: Avoid cold fluids and dust exposure.",
      doctor_notes: "Antibiotic regimen active. Advised patient to complete full 5-day course.",
      doctor_verified: true,
      verified_medications: [
        {
          name: "Azithromycin",
          dosage: "500 mg",
          frequency: "Once Daily (OD) after dinner",
          status: "VERIFIED",
          instructions: "Take with warm water. Complete all 5 days."
        },
        {
          name: "Levocetirizine + Montelukast",
          dosage: "5 mg + 10 mg",
          frequency: "Bedtime (HS)",
          status: "VERIFIED",
          instructions: "May cause slight drowsiness."
        },
        {
          name: "Ambroxol + Levosalbutamol Syrup",
          dosage: "10 ml",
          frequency: "Thrice Daily (TDS)",
          status: "VERIFIED",
          instructions: "Take with lukewarm water."
        }
      ]
    }
  ],
  case_papers: [
    {
      id: "doc_17258399",
      name: "Apex_Pulmonology_Slip.jpg",
      image_url_or_base64: SAMPLE_CASE_PAPER_IMG,
      captured_at: "2026-09-09T05:18:00Z",
      doc_type: "case_paper",
      ocr_extraction: "Investigation: PEFR 380 L/min (Normal), TLC 7200 /cu.mm (Normal), AEC 490 /cu.mm (Mild Eosinophilia), CRP 3.2 mg/L. Impression: Allergic airway irritation.",
      doctor_notes: "Spirometry and PEFR within normal limits. Mild eosinophil count explains nocturnal allergy component.",
      doctor_verified: true
    }
  ],
  ayush: {
    vata: 55,
    pitta: 28,
    kapha: 17,
    dominantPrakriti: "Vata-Pitta (Vata Pradhana)",
    aharaVihara: "Ahara: Warm nourishing soups, stewed apples, turmeric milk (Haldi Doodh) with pinch of Pippali. Avoid cold, dry, fermented foods.\nVihara: Warm sesame oil gargles (Gandusha), steam inhalation with eucalyptus, gentle Pranayama (Anulom Vilom), maintain warm room temperature.",
    updated_at: "2026-09-09T05:25:00Z",
    doctor_signature: "Dr. Priya Sharma (Cardiology & Clinical AYUSH Observer)"
  }
};

export const SECONDARY_PATIENT: PatientRecord = {
  uid: "usr_amit_shah_2041",
  name: "Amit K. Shah",
  email: "amit.shah@gmail.com",
  gender: "Male",
  age: 48,
  dob: "12/04/1978",
  bloodGroup: "B+",
  abha: "91-1120-9482-6019",
  abhaVerified: true,
  mrn: "MRN-AHM-8190",
  mrnVerified: true,
  vitals: {
    bp: "134/86",
    pulse: "82 bpm",
    spo2: "98%",
    temp: "98.6 °F",
    last_checkup: "Yesterday, 08 Sep",
    calibrated_by: "MediKiosk Station #1",
    calibrated_at: "2026-09-08T10:30:00Z"
  },
  latest_summary: "Routine hypertensive follow-up. Mild exertional fatigue. Adherent to Telmisartan 40mg OD.",
  soap_notes: {
    chiefComplaint: "Routine follow-up for Stage 1 Essential Hypertension. Complains of mild leg heaviness in evening.",
    hpi: "Diagnosed with hypertension 2 years ago. BP well maintained on Telmisartan. No headache, chest pain, or visual blurring.",
    assessment: "Essential Hypertension - Stable on monotherapy.",
    triageLevel: "Low",
    currentMedications: "Tab. Telmisartan 40mg OD morning",
    allergies: "No known drug allergies.",
    doctor_notes: "Continue current dosage. Recommended 30 minutes brisk walking daily and salt restriction.",
    updated_at: "2026-09-08T10:45:00Z",
    updated_by: "Dr. Priya Sharma"
  },
  prescriptions: [
    {
      id: "doc_17258410",
      name: "Cardio_Review_Prescription.jpg",
      image_url_or_base64: SAMPLE_PRESCRIPTION_IMG,
      captured_at: "2026-09-08T10:32:00Z",
      doc_type: "prescription",
      ocr_extraction: "Rx: Tab. Telmisartan 40mg OD morning before breakfast. Serum Creatinine & Electrolytes regular monitoring.",
      doctor_notes: "BP controlled. Serum potassium normal.",
      doctor_verified: true,
      verified_medications: [
        {
          name: "Telmisartan",
          dosage: "40 mg",
          frequency: "Once Daily (OD) Morning",
          status: "VERIFIED",
          instructions: "Take 30 mins before breakfast."
        }
      ]
    }
  ],
  case_papers: [],
  ayush: {
    vata: 30,
    pitta: 52,
    kapha: 18,
    dominantPrakriti: "Pitta-Vata",
    aharaVihara: "Ahara: Cooling foods, bottle gourd (Lauki), coriander infusion, avoid spicy, sour, fried preparations.\nVihara: Sheetali Pranayama, evening walks, adequate sleep, stress management through meditation.",
    updated_at: "2026-09-08T10:50:00Z",
    doctor_signature: "Dr. Priya Sharma"
  }
};
