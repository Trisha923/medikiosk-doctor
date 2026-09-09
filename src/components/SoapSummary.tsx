import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  Pill,
  ShieldAlert,
  Save,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Clock,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';
import { PatientRecord, Doctor, PatientSOAP } from '../types';
import { updatePatientSoapNotes } from '../services/firebase';

interface SoapSummaryProps {
  patient: PatientRecord;
  doctor: Doctor;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SoapSummary: React.FC<SoapSummaryProps> = ({
  patient,
  doctor,
  onToast,
}) => {
  const currentSoap: PatientSOAP = patient.soap_notes || {
    chiefComplaint: 'Dry persistent nocturnal cough and throat dryness for 4 days.',
    hpi: 'Patient reports sudden onset of tickling sensation in larynx triggering coughing spasms, primarily after lying down at night.',
    assessment: 'Post-viral bronchial hyper-reactivity / Allergic upper respiratory tract irritation.',
    triageLevel: 'Moderate',
    currentMedications: 'Tab. Multivitamin OD',
    allergies: 'Sensitive to house dust and pollen.',
  };

  const [chiefComplaint, setChiefComplaint] = useState(currentSoap.chiefComplaint);
  const [hpi, setHpi] = useState(currentSoap.hpi);
  const [assessment, setAssessment] = useState(currentSoap.assessment);
  const [triageLevel, setTriageLevel] = useState<PatientSOAP['triageLevel']>(currentSoap.triageLevel);
  const [allergies, setAllergies] = useState(currentSoap.allergies);
  const [currentMedications, setCurrentMedications] = useState(currentSoap.currentMedications);
  const [doctorNotes, setDoctorNotes] = useState(currentSoap.doctor_notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient.soap_notes) {
      setChiefComplaint(patient.soap_notes.chiefComplaint);
      setHpi(patient.soap_notes.hpi);
      setAssessment(patient.soap_notes.assessment);
      setTriageLevel(patient.soap_notes.triageLevel);
      setAllergies(patient.soap_notes.allergies);
      setCurrentMedications(patient.soap_notes.currentMedications);
      setDoctorNotes(patient.soap_notes.doctor_notes || '');
    }
  }, [patient.soap_notes]);

  const getTriageBadge = (level: string) => {
    switch (level) {
      case 'Emergency':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  const handleSaveSoap = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePatientSoapNotes(
        patient.uid,
        {
          chiefComplaint: chiefComplaint.trim(),
          hpi: hpi.trim(),
          assessment: assessment.trim(),
          triageLevel,
          allergies: allergies.trim(),
          currentMedications: currentMedications.trim(),
          doctor_notes: doctorNotes.trim(),
        },
        doctor,
        patient
      );
      onToast('Clinical SOAP Note updated in users collection and synced.', 'success');
    } catch (err) {
      console.error('SOAP note update notice:', err);
      onToast('Failed to save SOAP note: ' + (err instanceof Error ? err.message : 'Please check connection'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (patient.soap_notes) {
      setChiefComplaint(patient.soap_notes.chiefComplaint);
      setHpi(patient.soap_notes.hpi);
      setAssessment(patient.soap_notes.assessment);
      setTriageLevel(patient.soap_notes.triageLevel);
      setAllergies(patient.soap_notes.allergies);
      setCurrentMedications(patient.soap_notes.currentMedications);
      setDoctorNotes(patient.soap_notes.doctor_notes || '');
    }
    onToast('Reset to original intake values.', 'info');
  };

  return (
    <div id="soap-summary-container" className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FFE6E2] text-[#E6533C]">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AI Pre-Consultation SOAP Summary
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Kiosk patient-intake synthesis. Editable clinical fields sync to <code className="text-[#E6533C] font-mono">users/{patient.uid || 'patient_id'}.soap_notes</code> and <code className="text-[#E6533C] font-mono">latest_summary</code>.
          </p>
        </div>

        {/* Triage Urgency Level Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Triage Level:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getTriageBadge(triageLevel)}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {triageLevel} Priority
          </span>
        </div>
      </div>

      {/* Overview Cards: Current Medications & Known Allergies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Pill className="w-4 h-4 text-blue-600" />
            Reported Current Medications
          </div>
          <input
            type="text"
            value={currentMedications}
            onChange={(e) => setCurrentMedications(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
            placeholder="e.g. Tab. Multivitamin OD, Syp. Honey-Tulsi Herbal"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Reported by patient at kiosk touch terminal prior to doctor consultation.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Known Drug &amp; Environmental Allergies
          </div>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
            placeholder="e.g. NKDA (No Known Drug Allergies). Sensitive to house dust and pollen."
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Critical for prescription safety check during medication dispatch.
          </p>
        </div>
      </div>

      {/* Editable SOAP Fields Form */}
      <form onSubmit={handleSaveSoap} className="space-y-4">
        {/* S: Subjective - Chief Complaint & Onset */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-[#FFE6E2] text-[#E6533C] flex items-center justify-center font-mono font-bold text-xs">S</span>
              Chief Complaint &amp; Onset Duration *
            </label>
            <span className="text-[11px] text-slate-400">Subjective History</span>
          </div>

          <textarea
            id="soap-chief-complaint"
            rows={2}
            required
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E6533C] leading-relaxed"
            placeholder="e.g. Dry cough with nocturnal wheeze for 4 days..."
          />
        </div>

        {/* HPI: History of Present Illness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-xs">O</span>
              History of Present Illness (HPI) &amp; Progression *
            </label>
            <span className="text-[11px] text-slate-400">Chronological Progression</span>
          </div>

          <textarea
            id="soap-hpi"
            rows={3}
            required
            value={hpi}
            onChange={(e) => setHpi(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E6533C] leading-relaxed"
            placeholder="e.g. Sudden tickling in larynx triggering coughing spasms primarily when lying down..."
          />
        </div>

        {/* A: Assessment / Diagnosis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs">A</span>
              Clinical Assessment &amp; Working Diagnosis *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Priority:</span>
              <select
                value={triageLevel}
                onChange={(e) => setTriageLevel(e.target.value as PatientSOAP['triageLevel'])}
                className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
              >
                <option value="Low">Low Priority</option>
                <option value="Moderate">Moderate Priority</option>
                <option value="High">High Priority</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <textarea
            id="soap-assessment"
            rows={2}
            required
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E6533C] leading-relaxed"
            placeholder="e.g. Post-viral bronchial hyper-reactivity / Allergic upper respiratory tract irritation..."
          />
        </div>

        {/* P: Plan / Additional Physician Remarks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-mono font-bold text-xs">P</span>
              Physician Plan &amp; Counseling Caveats
            </label>
            <span className="text-[11px] text-slate-400">Action Plan</span>
          </div>

          <textarea
            id="soap-doctor-notes"
            rows={2}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E6533C] leading-relaxed"
            placeholder="e.g. Advised steam inhalation twice daily and avoidance of refrigerated beverages..."
          />
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#E6533C]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Authoring Physician: {doctor.name}
              </p>
              <p className="text-[11px] text-slate-500">
                Saves to <code className="text-[#E6533C] font-mono">users/{patient.uid}.soap_notes</code> and refreshes clinical dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              id="save-clinical-soap-note-btn"
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-[#E6533C] hover:bg-[#CE3E29] text-white font-bold text-xs shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Writing to Firebase...' : 'Save Clinical SOAP Note'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
