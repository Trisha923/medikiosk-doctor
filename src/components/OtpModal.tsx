import React, { useState, useEffect, useRef } from 'react';
import {
  KeyRound,
  MailCheck,
  Clock,
  AlertCircle,
  RotateCw,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Doctor } from '../types';
import { verifyPatientOtp, sendPatientOtp, SendOtpResult } from '../services/firebase';

interface OtpModalProps {
  patientEmail: string;
  doctor: Doctor;
  initialGeneratedOtp?: string;
  onVerified: () => void;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  patientEmail,
  doctor,
  initialGeneratedOtp,
  onVerified,
  onClose,
  onToast,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [latestOtpDebug, setLatestOtpDebug] = useState<string | undefined>(initialGeneratedOtp);

  // 10-minute countdown (600 seconds) matching Cloudflare Worker KV TTL
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask patient email e.g. riya@gmail.com -> r***a@gmail.com
  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const user = parts[0];
    const domain = parts[1];
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${'*'.repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}@${domain}`;
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Pasted content
      const clean = value.replace(/\D/g, '').slice(0, 6);
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = clean[i] || '';
      }
      setDigits(newDigits);
      const nextIdx = Math.min(clean.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const char = value.replace(/\D/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the patient authorization code.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await verifyPatientOtp(patientEmail, fullCode);
      if (result.verified) {
        onToast('Patient consent verified! Unlocking clinical dossier...', 'success');
        onVerified();
      } else {
        setError(result.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setError(null);

    try {
      const result: SendOtpResult = await sendPatientOtp(patientEmail, doctor);
      setLatestOtpDebug(result.otp);
      setTimeLeft(600);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      onToast(`New OTP dispatched to ${patientEmail}`, 'info');
    } catch {
      setError('Failed to resend authorization code. Please check network connection.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      id="patient-otp-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFE6E2] to-[#FFF5F3] border border-[#FFCDC5] text-[#E6533C] flex items-center justify-center mx-auto mb-3.5 shadow-md shadow-red-100">
            <KeyRound className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Cloudflare Worker &amp; KV Gated
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Doctor OTP Verification
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 px-2 leading-relaxed">
            Enter the 6-digit authorization code sent to the patient's registered email (
            <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              {maskEmail(patientEmail)}
            </span>
            ) to unlock their clinical dossier.
          </p>
        </div>

        {/* Development Helper Badge if test OTP exists */}
        {latestOtpDebug && (
          <div className="mb-5 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">Test Authorization Code:</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const codeArr = latestOtpDebug.split('').slice(0, 6);
                setDigits(codeArr);
                inputRefs.current[5]?.focus();
              }}
              className="font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-300 hover:bg-amber-100 text-amber-900 transition-colors shadow-xs cursor-pointer text-xs"
            >
              {latestOtpDebug} <span className="text-[10px] text-amber-700 font-sans font-normal">(Click to Fill)</span>
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* 6-box OTP input */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              id={`otp-box-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black font-mono text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[#E6533C] focus:ring-4 focus:ring-[#E6533C]/15 focus:outline-none transition-all shadow-inner"
            />
          ))}
        </div>

        {/* Expiry Countdown & Resend */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Valid for:</span>
            <span
              className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {formatCountdown(timeLeft)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-1 text-[#E6533C] hover:text-[#CE3E29] font-bold hover:underline cursor-pointer disabled:opacity-50 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            {resending ? 'Sending Code...' : 'Resend Code'}
          </button>
        </div>

        {/* Submit Button */}
        <div className="space-y-2.5">
          <button
            id="verify-unlock-dossier-btn"
            type="button"
            onClick={handleVerify}
            disabled={loading || timeLeft === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E6533C] to-[#CE3E29] hover:from-[#CE3E29] hover:to-[#A82E1C] text-white font-bold text-sm sm:text-base shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Validating Patient Consent...</span>
              </>
            ) : (
              <>
                <MailCheck className="w-5 h-5" />
                <span>Verify &amp; Unlock Dossier</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel Request
          </button>
        </div>
      </div>
    </div>
  );
};
