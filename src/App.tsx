import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  LogOut,
  User,
  Building2,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  Search,
  ExternalLink,
  CloudUpload,
  Database,
  Radio
} from 'lucide-react';
import { Doctor, PatientRecord } from './types';
import {
  getCurrentDoctorSession,
  clearDoctorSession,
  getPatientByEmail,
  resetDemoData,
  seedSampleDataToFirestore,
  getFirebaseStatus
} from './services/firebase';
import { DoctorAuth } from './components/DoctorAuth';
import { PatientSearch } from './components/PatientSearch';
import { OtpModal } from './components/OtpModal';
import { PatientDossier } from './components/PatientDossier';

interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

export default function App() {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [unlockedPatient, setUnlockedPatient] = useState<PatientRecord | null>(null);

  // OTP Modal State
  const [otpModalEmail, setOtpModalEmail] = useState<string | null>(null);
  const [otpModalCode, setOtpModalCode] = useState<string | undefined>(undefined);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [seedingLoading, setSeedingLoading] = useState(false);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Restore doctor session on mount if any
  useEffect(() => {
    const session = getCurrentDoctorSession();
    if (session) {
      setCurrentDoctor(session);
    }
  }, []);

  const handleLoginSuccess = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    addToast(`Welcome ${doctor.name}. Clinical session established.`, 'success');
  };

  const handleLogout = () => {
    clearDoctorSession();
    setCurrentDoctor(null);
    setUnlockedPatient(null);
    setOtpModalEmail(null);
    addToast('Signed out of doctor clinical session.', 'info');
  };

  const handleOtpTriggered = (patientEmail: string, generatedOtp?: string) => {
    setOtpModalEmail(patientEmail);
    setOtpModalCode(generatedOtp);
  };

  const handleOtpVerified = async () => {
    if (!otpModalEmail || !currentDoctor) return;
    try {
      const patient = await getPatientByEmail(otpModalEmail, currentDoctor);
      if (patient) {
        setUnlockedPatient(patient);
        setOtpModalEmail(null);
        setOtpModalCode(undefined);
        addToast(`Clinical dossier unlocked for ${patient.name} (${patient.mrn})`, 'success');
      } else {
        addToast('Patient record not found in MediKiosk database.', 'error');
      }
    } catch {
      addToast('Error accessing patient dossier from Firestore.', 'error');
    }
  };

  const handleResetData = () => {
    resetDemoData();
    setUnlockedPatient(null);
    setOtpModalEmail(null);
    addToast('Demo database reset to default MediKiosk records (Riya Patel, Dr. Priya Sharma).', 'info');
  };

  const handleSeedToFirestore = async () => {
    setSeedingLoading(true);
    addToast('Syncing benchmark patient and doctor records to Firestore...', 'info');
    try {
      const res = await seedSampleDataToFirestore();
      if (res.success) {
        addToast(res.message, 'success');
      } else {
        addToast(`Firestore sync notice: ${res.message}`, 'info');
      }
    } catch (e) {
      addToast('Failed to seed records to Firestore.', 'error');
    } finally {
      setSeedingLoading(false);
    }
  };

  const fbStatus = getFirebaseStatus();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#E6533C] selection:text-white">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border text-xs sm:text-sm font-semibold flex items-start justify-between gap-2.5 transition-all animate-in slide-in-from-top-3 ${
              t.type === 'success'
                ? 'bg-slate-900 text-white border-emerald-500/50 shadow-emerald-950/20'
                : t.type === 'error'
                ? 'bg-rose-950 text-white border-rose-600/50 shadow-rose-950/20'
                : 'bg-slate-900 text-white border-slate-700 shadow-slate-950/20'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-[#FF7A66] shrink-0 mt-0.5" />}
              <span className="leading-snug">{t.text}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/60 hover:text-white shrink-0 text-xs font-mono cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* When Doctor is NOT logged in: Show Doctor Auth Screen */}
      {!currentDoctor ? (
        <DoctorAuth onLoginSuccess={handleLoginSuccess} />
      ) : (
        /* When Doctor IS logged in: Show Main Doctor Portal Layout */
        <div className="flex-1 flex flex-col">
          {/* Sticky Navigation Header */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
              
              {/* Left Brand */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E6533C] to-[#FF7A66] text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      MediKiosk
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE6E2] text-[#E6533C] border border-[#FFCDC5]">
                      Doctor Portal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                    Civil Hospital Ahmedabad • Clinical Network
                  </p>
                </div>
              </div>

              {/* Center: Live Firebase Status & Active Patient Pill */}
              <div className="hidden md:flex items-center gap-2.5">
                {/* Firebase Status Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900">Firestore:</span>
                  <span className="font-mono text-[#E6533C]">{fbStatus.projectId}</span>
                </div>

                {/* Center: Active Patient Badge if open */}
                {unlockedPatient && (
                  <div className="flex items-center gap-2 bg-[#FFF5F3] border border-[#FFCDC5] px-3.5 py-1 rounded-full shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800">
                      Dossier: {unlockedPatient.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#E6533C] bg-white px-1.5 py-0.2 rounded border border-[#FFCDC5]">
                      {unlockedPatient.mrn}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Doctor Profile & Actions */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Cloud Sync Button */}
                <button
                  id="sync-firestore-btn"
                  onClick={handleSeedToFirestore}
                  disabled={seedingLoading}
                  title="Sync Benchmark Patient & Doctor to Cloud Firestore"
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-[#E6533C] text-slate-700 hover:text-[#E6533C] bg-slate-50 hover:bg-[#FFF5F3] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <CloudUpload className={`w-4 h-4 text-[#E6533C] ${seedingLoading ? 'animate-bounce' : ''}`} />
                  <span className="hidden xl:inline">Sync to Cloud</span>
                </button>

                {/* Doctor Identity */}
                <div className="text-right hidden sm:block">
                  <div className="flex items-center justify-end gap-1.5">
                    <p className="text-xs font-extrabold text-slate-900">{currentDoctor.name}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {currentDoctor.license} • {currentDoctor.department}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2.5">
                  <button
                    onClick={handleResetData}
                    title="Reset Sample Records"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden 2xl:inline text-xs font-medium">Reset Demo</span>
                  </button>

                  <button
                    id="doctor-logout-btn"
                    onClick={handleLogout}
                    title="Sign Out of Doctor Session"
                    className="py-1.5 px-3 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5 border border-transparent hover:border-red-200"
                  >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Portal Body */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* If NO patient dossier is currently open: Show Patient Search */}
            {!unlockedPatient ? (
              <div>
                <PatientSearch
                  doctor={currentDoctor}
                  onOtpTriggered={handleOtpTriggered}
                  onToast={addToast}
                />
              </div>
            ) : (
              /* If patient dossier IS unlocked: Show Patient Dossier */
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setUnlockedPatient(null)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#E6533C] hover:text-[#CE3E29] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-[#E6533C] transition-all cursor-pointer"
                  >
                    <span>&larr;</span> Switch / Search Another Patient
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>Live Bi-Directional Firestore Channel</span>
                  </div>
                </div>

                <PatientDossier
                  initialPatient={unlockedPatient}
                  doctor={currentDoctor}
                  onLockDossier={() => {
                    setUnlockedPatient(null);
                    addToast('Patient clinical dossier locked.', 'info');
                  }}
                  onToast={addToast}
                />
              </div>
            )}
          </main>

          {/* OTP Verification Modal */}
          {otpModalEmail && (
            <OtpModal
              patientEmail={otpModalEmail}
              doctor={currentDoctor}
              initialGeneratedOtp={otpModalCode}
              onVerified={handleOtpVerified}
              onClose={() => {
                setOtpModalEmail(null);
                setOtpModalCode(undefined);
              }}
              onToast={addToast}
            />
          )}

          {/* Clinical Footer */}
          <footer className="bg-white border-t border-slate-200/90 py-5 px-4 sm:px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>MediKiosk Health Systems • HIPAA &amp; ABDM Consent-Gated Architecture</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-[#E6533C]" />
                  <span>Firestore Project: <strong>{fbStatus.projectId}</strong></span>
                </span>
                <span>•</span>
                <span>Collections: users, doctors, pending_doctors, access_otps</span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
