import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Activity,
  FileText,
  FileSpreadsheet,
  Leaf,
  Calendar,
  Heart,
  Droplet,
  Lock,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ExternalLink,
  ChevronRight,
  Radio,
  Clock
} from 'lucide-react';
import { PatientRecord, Doctor } from '../types';
import { subscribeToPatient } from '../services/firebase';
import { PrescriptionGallery } from './PrescriptionGallery';
import { VitalsCalibration } from './VitalsCalibration';
import { AyushModule } from './AyushModule';
import { SoapSummary } from './SoapSummary';

interface PatientDossierProps {
  initialPatient: PatientRecord;
  doctor: Doctor;
  onLockDossier: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PatientDossier: React.FC<PatientDossierProps> = ({
  initialPatient,
  doctor,
  onLockDossier,
  onToast,
}) => {
  const [patient, setPatient] = useState<PatientRecord>(initialPatient);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'vitals' | 'soap' | 'ayush'>('prescriptions');

  // Set up real-time live sync with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToPatient(initialPatient.uid, (updatedRecord) => {
      setPatient(updatedRecord);
    });

    return () => {
      unsubscribe();
    };
  }, [initialPatient.uid]);

  return (
    <div id="patient-dossier-root" className="space-y-6">
      
      {/* Top Banner: Patient Consent Verified & Live Sync Status */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{patient.name}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                OTP Consent Verified
              </span>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {patient.email}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Two-Way Firestore Live Sync: <code className="text-slate-800 font-mono font-bold">users/{patient.uid}</code></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">Attending: {doctor.name}</p>
            <p className="text-[11px] text-slate-500">{doctor.department}</p>
          </div>

          <button
            id="lock-dossier-btn"
            type="button"
            onClick={onLockDossier}
            className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 hover:border-rose-200"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
            <span>Lock Dossier &amp; End Session</span>
          </button>
        </div>
      </div>

      {/* A. General Patient Details Card */}
      <div id="general-patient-details-card" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Item 1: Gender & Age */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gender / Age</span>
            <p className="text-sm font-black text-slate-900">{patient.gender}, {patient.age} Yrs</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              DOB: {patient.dob}
            </p>
          </div>

          {/* Item 2: Blood Group */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Blood Group</span>
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded bg-red-50 text-red-600">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-black text-slate-900">{patient.bloodGroup}</span>
            </div>
            <p className="text-[11px] text-slate-500">Universal Donor/Acceptor</p>
          </div>

          {/* Item 3: ABHA ID with Verified Checkmark */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ABHA Health ID</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 tracking-tight">
                {patient.abha}
              </span>
              {patient.abhaVerified && (
                <span title="National Health Authority ABHA Verified" className="text-emerald-600 bg-emerald-50 p-0.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">NHA ABHA Verified</p>
          </div>

          {/* Item 4: Medical Record Number (MRN Badge) */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hospital MRN</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-mono font-bold text-[#E6533C]">
                {patient.mrn}
              </span>
              {patient.mrnVerified && (
                <span title="Hospital Registry Validated" className="text-emerald-600 bg-emerald-50 p-0.5 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Civil Hospital Ahmedabad</p>
          </div>

          {/* Item 5: Current Vitals Snapshot */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vitals (Kiosk)</span>
            <p className="text-xs font-mono font-bold text-slate-800">
              BP: {patient.vitals?.bp} • SpO2: {patient.vitals?.spo2}
            </p>
            <p className="text-[11px] text-slate-500">
              Pulse: {patient.vitals?.pulse} • Temp: {patient.vitals?.temp}
            </p>
          </div>

          {/* Item 6: Dominant Prakriti (AYUSH) */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prakriti (AYUSH)</span>
            <p className="text-xs font-bold text-emerald-800 truncate">
              {patient.ayush?.dominantPrakriti || 'Vata-Pitta'}
            </p>
            <p className="text-[11px] text-slate-500">
              V:{patient.ayush?.vata || 50}% P:{patient.ayush?.pitta || 30}% K:{patient.ayush?.kapha || 20}%
            </p>
          </div>
        </div>

        {/* Latest Clinical Intake Summary Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs bg-slate-50/80 p-3.5 rounded-2xl">
          <div className="flex items-start sm:items-center gap-2">
            <span className="font-extrabold text-slate-900 shrink-0">Intake Summary:</span>
            <span className="text-slate-600 italic leading-relaxed">{patient.latest_summary}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('soap')}
            className="text-[#E6533C] font-bold hover:underline shrink-0 text-xs flex items-center gap-1 cursor-pointer"
          >
            Review SOAP Note &rarr;
          </button>
        </div>
      </div>

      {/* Clinical Dossier Navigation Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          id="tab-prescriptions"
          type="button"
          onClick={() => setActiveTab('prescriptions')}
          className={`py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'bg-[#E6533C] text-white shadow-md shadow-red-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>OCR Scanned Prescriptions &amp; Reports</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'prescriptions' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {(patient.prescriptions?.length || 0) + (patient.case_papers?.length || 0)}
          </span>
        </button>

        <button
          id="tab-vitals"
          type="button"
          onClick={() => setActiveTab('vitals')}
          className={`py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
            activeTab === 'vitals'
              ? 'bg-[#E6533C] text-white shadow-md shadow-red-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Vitals Station (Doctor Calibration)</span>
        </button>

        <button
          id="tab-soap"
          type="button"
          onClick={() => setActiveTab('soap')}
          className={`py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
            activeTab === 'soap'
              ? 'bg-[#E6533C] text-white shadow-md shadow-red-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>AI Pre-Consultation SOAP Summary</span>
        </button>

        <button
          id="tab-ayush"
          type="button"
          onClick={() => setActiveTab('ayush')}
          className={`py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
            activeTab === 'ayush'
              ? 'bg-[#E6533C] text-white shadow-md shadow-red-200'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>AYUSH Tridosha Module</span>
        </button>
      </div>

      {/* Dynamic Tab Body */}
      <div>
        {activeTab === 'prescriptions' && (
          <PrescriptionGallery patient={patient} doctor={doctor} onToast={onToast} />
        )}

        {activeTab === 'vitals' && (
          <VitalsCalibration patient={patient} doctor={doctor} onToast={onToast} />
        )}

        {activeTab === 'soap' && (
          <SoapSummary patient={patient} doctor={doctor} onToast={onToast} />
        )}

        {activeTab === 'ayush' && (
          <AyushModule patient={patient} doctor={doctor} onToast={onToast} />
        )}
      </div>
    </div>
  );
};
