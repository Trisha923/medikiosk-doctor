import React, { useState } from 'react';
import {
  Search,
  Send,
  User,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Fingerprint,
  Zap,
  Mail
} from 'lucide-react';
import { Doctor } from '../types';
import { sendPatientOtp, SendOtpResult } from '../services/firebase';

interface PatientSearchProps {
  doctor: Doctor;
  onOtpTriggered: (patientEmail: string, generatedOtp?: string) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  doctor,
  onOtpTriggered,
  onToast,
}) => {
  const [patientEmail, setPatientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const samplePatients = [
    {
      name: 'Ms. Riya Patel',
      email: 'riya@gmail.com',
      age: 24,
      gender: 'Female',
      condition: 'Acute Bronchial Irritation (OPD #4)',
      mrn: 'MRN-AHM-9941',
      abha: '91-4820-1940-2810',
      badge: 'Benchmark OPD Patient',
      vitalsPreview: 'BP: 118/78 • SpO2: 99%',
    },
    {
      name: 'Mr. Amit K. Shah',
      email: 'amit.shah@gmail.com',
      age: 48,
      gender: 'Male',
      condition: 'Stage 1 Hypertension Follow-up',
      mrn: 'MRN-AHM-8190',
      abha: '91-1120-9482-6019',
      badge: 'Follow-up Case',
      vitalsPreview: 'BP: 134/86 • SpO2: 98%',
    },
    {
      name: 'Resend Test Sandbox Patient',
      email: 'delivered@resend.dev',
      age: 30,
      gender: 'Other',
      condition: 'Live Email Inbox Delivery Test',
      mrn: 'MRN-TST-0001',
      abha: '91-0000-0000-0001',
      badge: 'Live Resend Inbox Test',
      vitalsPreview: 'BP: 120/80 • SpO2: 100%',
    },
  ];

  const handleSendOtp = async (e?: React.FormEvent, overrideEmail?: string) => {
    if (e) e.preventDefault();
    setSearchError(null);

    const targetEmail = (overrideEmail || patientEmail).trim().toLowerCase();

    if (!targetEmail || !targetEmail.includes('@')) {
      setSearchError("Please provide a valid patient's registered email address.");
      return;
    }

    setLoading(true);

    try {
      const res: SendOtpResult = await sendPatientOtp(targetEmail, doctor);
      onToast(res.message, 'success');
      onOtpTriggered(targetEmail, res.otp);
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : 'Unable to dispatch OTP request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="patient-search-card" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFE6E2] text-[#E6533C] border border-[#FFCDC5]">
                <ShieldCheck className="w-3.5 h-3.5" />
                ABDM Consent-Gated Access
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Step 1 of 2</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Patient Clinical Dossier Search
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
              In accordance with medical privacy standards, doctors cannot browse patient records without explicit patient OTP authorization.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs text-slate-600 max-w-sm shrink-0 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#E6533C]" />
                Cloudflare Worker &amp; KV
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Dispatches encrypted 6-digit authorization code via Resend API to patient's inbox with a 10-minute validity.
            </p>
          </div>
        </div>

        {/* Workflow Steps Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="w-7 h-7 rounded-lg bg-[#E6533C] text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Search Email</p>
              <p className="text-[11px] text-slate-400">Enter patient ID</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Trigger OTP</p>
              <p className="text-[11px] text-slate-400">Worker sends code</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <div>
              <p className="text-xs font-bold text-slate-800">Unlock Dossier</p>
              <p className="text-[11px] text-slate-400">Sync with Firestore</p>
            </div>
          </div>
        </div>

        {searchError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Request Error</p>
              <p className="font-medium text-xs mt-0.5">{searchError}</p>
            </div>
          </div>
        )}

        {/* Search Input Bar */}
        <form onSubmit={handleSendOtp} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="patient-email-search-input"
                type="email"
                required
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="Enter Patient's Registered Email ID (e.g. riya@gmail.com)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-900 bg-slate-50/70 placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:border-[#E6533C] focus:bg-white transition-all shadow-inner"
              />
            </div>

            <button
              id="request-access-send-otp-btn"
              type="submit"
              disabled={loading}
              className="py-3.5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-[#E6533C] to-[#CE3E29] hover:from-[#CE3E29] hover:to-[#A82E1C] text-white font-bold text-sm sm:text-base shadow-md shadow-red-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Requesting Consent...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Access / Send OTP</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Active Kiosk Patients List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active MediKiosk Waiting Room Patients:
            </p>
            <span className="text-[11px] text-slate-400 font-medium">Click card to instant-request OTP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {samplePatients.map((pat) => (
              <button
                key={pat.email}
                type="button"
                onClick={() => {
                  setPatientEmail(pat.email);
                  handleSendOtp(undefined, pat.email);
                }}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-[#E6533C] hover:bg-[#FFF5F3]/50 transition-all text-left flex flex-col justify-between group cursor-pointer bg-white shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#FFE6E2] text-slate-600 group-hover:text-[#E6533C] flex items-center justify-center transition-colors shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 group-hover:bg-[#FFE6E2] text-slate-600 group-hover:text-[#E6533C] transition-colors">
                      {pat.badge}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 group-hover:text-[#E6533C] transition-colors">
                    {pat.name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{pat.email}</p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <p className="font-semibold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" />
                      {pat.condition}
                    </p>
                    <p className="font-mono text-[10px] text-[#E6533C]">
                      {pat.vitalsPreview}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-dashed border-slate-100 flex items-center justify-between text-xs font-bold text-[#E6533C]">
                  <span>Send Consent OTP</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
