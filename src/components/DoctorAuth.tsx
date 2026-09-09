import React, { useState } from 'react';
import {
  ShieldCheck,
  Stethoscope,
  Lock,
  Mail,
  Building2,
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  FileText,
  MapPin,
  GraduationCap,
  Activity,
  Leaf,
  Layers,
  Check
} from 'lucide-react';
import { Doctor } from '../types';
import { authenticateDoctor, submitDoctorApplication } from '../services/firebase';

interface DoctorAuthProps {
  onLoginSuccess: (doctor: Doctor) => void;
}

export const DoctorAuth: React.FC<DoctorAuthProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regHospitalName, setRegHospitalName] = useState('');
  const [regHospitalAddress, setRegHospitalAddress] = useState('');
  const [regCouncilNo, setRegCouncilNo] = useState('');
  const [regDegreeDetails, setRegDegreeDetails] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDocName, setRegDocName] = useState('');
  const [regDocPreview, setRegDocPreview] = useState<string | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedDoctorName, setSubmittedDoctorName] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Auto-fill Demo Doctor
  const handleFillDemoDoctor = () => {
    setLoginEmail('dr.priya.sharma@medikiosk.in');
    setLoginPassword('Doctor@123');
    setLoginError(null);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const doctor = await authenticateDoctor(loginEmail, loginPassword);
      onLoginSuccess(doctor);
    } catch (err: unknown) {
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          setLoginError(parsed.error || err.message);
        } catch {
          setLoginError(err.message);
        }
      } else {
        setLoginError('An unexpected authentication error occurred.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // File Upload Handlers (Drag & Drop + File input)
  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setRegError('Please upload an image (JPG, PNG) or PDF copy of your medical certificate.');
      return;
    }
    setRegDocName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRegDocPreview(reader.result as string);
      setRegError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // Validation
    if (
      !regFullName.trim() ||
      !regHospitalName.trim() ||
      !regHospitalAddress.trim() ||
      !regCouncilNo.trim() ||
      !regDegreeDetails.trim() ||
      !regEmail.trim() ||
      !regMobile.trim() ||
      !regPassword.trim()
    ) {
      setRegError('Please fill in all mandatory application fields.');
      return;
    }

    if (!regDocPreview) {
      setRegError('Please upload your Medical License or Degree Certificate for verification.');
      return;
    }

    setRegLoading(true);
    try {
      await submitDoctorApplication({
        fullName: regFullName.trim(),
        hospitalName: regHospitalName.trim(),
        hospitalAddress: regHospitalAddress.trim(),
        medicalCouncilRegNo: regCouncilNo.trim(),
        degreeDetails: regDegreeDetails.trim(),
        degreeDocName: regDocName || 'Medical_License.jpg',
        degreeDocPreview: regDocPreview,
        email: regEmail.trim(),
        mobile: regMobile.trim(),
      });

      setSubmittedDoctorName(regFullName.trim());
      setSubmittedEmail(regEmail.trim());
      setShowSuccessModal(true);

      // Reset form
      setRegFullName('');
      setRegHospitalName('');
      setRegHospitalAddress('');
      setRegCouncilNo('');
      setRegDegreeDetails('');
      setRegEmail('');
      setRegMobile('');
      setRegPassword('');
      setRegDocName('');
      setRegDocPreview(null);
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Application submission failed.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#E6533C] selection:text-white">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Clinical Showcase Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Brand Badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#E6533C]/15 border border-[#E6533C]/30 text-[#FF7A66] text-xs font-bold tracking-wide backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#E6533C] animate-pulse" />
            MediKiosk Clinical Network • Apollo &amp; Civil Hospital
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/medikiosk_logo.png"
                alt="MediKiosk Logo"
                className="w-13 h-13 rounded-2xl object-cover shadow-lg shadow-red-500/25 shrink-0 border border-slate-700/60"
              />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                MediKiosk <span className="text-[#FF7A66]">Doctor</span> Portal
              </h1>
            </div>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Real-time clinical administration and consent-governed patient dossier access. 
              Calibrate live kiosk vitals, review high-res OCR prescriptions, and administer AYUSH evaluations.
            </p>
          </div>

          {/* Feature Highlights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-[#E6533C]/40 transition-colors backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">Consent-Gated OTP Access</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Cloudflare Worker &amp; KV OTP dispatch ensures absolute patient data privacy.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-[#E6533C]/40 transition-colors backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2.5">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">Live Vitals Calibration</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Two-way sync with MediKiosk sensors for BP, SpO2, Pulse, and Temp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-[#E6533C]/40 transition-colors backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">AI OCR Prescription Zoom</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                High-resolution lightbox with rotation and high-contrast contrast mode.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-[#E6533C]/40 transition-colors backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5">
                <Leaf className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-200">AYUSH Tridosha Module</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Calculate dominant Prakriti and prescribe custom Ahara-Vihara regimens.
              </p>
            </div>
          </div>

          {/* Compliance & Cloud Sync Banner */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Firebase: medikiosk-trisha
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              ABDM &amp; HIPAA Ready
            </span>
          </div>
        </div>

        {/* Right Auth Forms Container */}
        <div className="lg:col-span-6">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 relative">
            
            {/* Tab Selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
              <button
                id="doctor-login-tab"
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setLoginError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-[#E6533C] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-4 h-4" />
                Doctor Sign In
              </button>

              <button
                id="doctor-register-tab"
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setRegError(null);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-[#E6533C] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Apply for Verification
              </button>
            </div>

            {/* TAB 1: DOCTOR LOGIN */}
            {activeTab === 'login' && (
              <div>
                {/* 1-Click Demo Doctor Banner */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#FFF5F3] to-[#FFE6E2] border-2 border-[#FFCDC5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E6533C]" />
                      <span className="text-xs font-extrabold text-[#E6533C] uppercase tracking-wider">
                        Pre-Configured Demo Doctor
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      Dr. Priya Sharma • Cardiology &amp; Gen Med (OPD #4)
                    </p>
                  </div>
                  <button
                    id="auto-fill-demo-doctor-btn"
                    type="button"
                    onClick={handleFillDemoDoctor}
                    className="py-2 px-3 rounded-xl bg-[#E6533C] hover:bg-[#CE3E29] text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    Quick Fill Credentials &rarr;
                  </button>
                </div>

                {loginError && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Access Denied</p>
                      <p className="font-medium text-xs mt-0.5">{loginError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Doctor Official Email ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="doctor-login-email"
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. dr.priya.sharma@medikiosk.in"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#E6533C] focus:ring-4 focus:ring-[#E6533C]/10 text-sm font-medium outline-none transition-all bg-slate-50/60 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Doctor Portal Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="doctor-login-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 focus:border-[#E6533C] focus:ring-4 focus:ring-[#E6533C]/10 text-sm font-medium outline-none transition-all bg-slate-50/60 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="doctor-login-submit-btn"
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E6533C] to-[#CE3E29] hover:from-[#CE3E29] hover:to-[#A82E1C] text-white font-bold text-sm shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loginLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying Clinical Credentials...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4" />
                        Enter Doctor Clinical Portal
                      </>
                    )}
                  </button>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-500">
                      Strict Role Isolation: Regular patient accounts cannot log into this clinical terminal.
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: DOCTOR REGISTRATION FLOW */}
            {activeTab === 'register' && (
              <div className="max-h-[600px] overflow-y-auto pr-1">
                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Doctor Registration &amp; Medical License Verification
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit your credentials to obtain clinical portal clearance within 24-48 hours.
                  </p>
                </div>

                {regError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="font-semibold">{regError}</p>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Field 1: Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      1. Full Name (with Title) *
                    </label>
                    <input
                      id="reg-full-name"
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Dr. Priya Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                    />
                  </div>

                  {/* Field 2 & 3: Hospital Name & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. Associated Hospital / Clinic *
                      </label>
                      <input
                        id="reg-hospital-name"
                        type="text"
                        required
                        value={regHospitalName}
                        onChange={(e) => setRegHospitalName(e.target.value)}
                        placeholder="e.g. Civil Hospital Ahmedabad (Apex OPD)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        3. Hospital Full Address *
                      </label>
                      <input
                        id="reg-hospital-address"
                        type="text"
                        required
                        value={regHospitalAddress}
                        onChange={(e) => setRegHospitalAddress(e.target.value)}
                        placeholder="e.g. Asarwa, Ahmedabad, Gujarat 380016"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 4 & 5: License & Degree */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        4. Medical Council Reg No (MCI / State) *
                      </label>
                      <input
                        id="reg-council-no"
                        type="text"
                        required
                        value={regCouncilNo}
                        onChange={(e) => setRegCouncilNo(e.target.value)}
                        placeholder="e.g. MCI-GUJ-2015-8492"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        5. Degree &amp; University Details *
                      </label>
                      <input
                        id="reg-degree-details"
                        type="text"
                        required
                        value={regDegreeDetails}
                        onChange={(e) => setRegDegreeDetails(e.target.value)}
                        placeholder="e.g. MBBS, MD (Cardiology) - BJ Medical College"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 6: Degree Certificate / License Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      6. Degree Certificate / Medical License Document *
                    </label>
                    
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-slate-200 hover:border-[#E6533C] rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-[#FFF5F3]/30 transition-all cursor-pointer relative"
                    >
                      <input
                        id="reg-doc-file-input"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelection(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />

                      {regDocPreview ? (
                        <div className="flex items-center justify-between gap-3 text-left">
                          <div className="flex items-center gap-3">
                            <img
                              src={regDocPreview}
                              alt="License Preview"
                              className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-xs"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                                {regDocName || 'Medical_License.jpg'}
                              </p>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Ready for Compliance Review
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#E6533C]">
                            Change File
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                          <p className="text-xs font-bold text-slate-700">
                            Drag &amp; drop License / Degree scan, or <span className="text-[#E6533C]">Browse</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Supports JPG, PNG, PDF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 7: Official Email & Contact Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        7. Official Email Address *
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. dr.name@hospital.in"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Mobile Number *
                      </label>
                      <input
                        id="reg-mobile"
                        type="tel"
                        required
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 8: Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      8. Set Secure Password *
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 8 characters with numbers & symbols"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#E6533C] focus:ring-2 focus:ring-[#E6533C]/10 outline-none font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit-doctor-application-btn"
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#E6533C] hover:bg-[#CE3E29] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-4"
                  >
                    {regLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting Application to Firestore...
                      </>
                    ) : (
                      <>
                        <FileCheck2 className="w-4 h-4" />
                        Submit Application for Verification
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compliance Success Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Application Submitted for Verification
            </h3>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 my-4 text-left space-y-2">
              <p className="text-xs text-slate-700 leading-relaxed">
                Thank you <strong className="text-slate-900">{submittedDoctorName}</strong>. Your clinical credentials and medical council license have been submitted for verification.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 border-t border-slate-200">
                <Clock className="w-4 h-4 text-[#E6533C] shrink-0" />
                <span>Our medical compliance team will review your application within <strong>24 to 48 hours</strong>.</span>
              </div>
              <p className="text-xs text-slate-600">
                We will contact you via email (
                <span className="font-mono font-semibold text-slate-900">{submittedEmail}</span>
                ) with your login approval.
              </p>
            </div>

            <button
              id="close-success-modal-btn"
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab('login');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#E6533C] hover:bg-[#CE3E29] text-white font-bold text-sm shadow-md shadow-red-200 transition-all cursor-pointer"
            >
              Understood &amp; Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
