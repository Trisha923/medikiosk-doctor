import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  Wind,
  Clock,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { PatientRecord, Doctor, PatientVitals } from '../types';
import { updatePatientVitals } from '../services/firebase';

interface VitalsCalibrationProps {
  patient: PatientRecord;
  doctor: Doctor;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VitalsCalibration: React.FC<VitalsCalibrationProps> = ({
  patient,
  doctor,
  onToast,
}) => {
  const currentVitals = patient.vitals || {
    bp: '120/80',
    pulse: '72 bpm',
    spo2: '98%',
    temp: '98.6 °F',
    last_checkup: 'Today',
  };

  // Calibration input states
  const [calibratedBp, setCalibratedBp] = useState(currentVitals.bp);
  const [calibratedPulse, setCalibratedPulse] = useState(currentVitals.pulse);
  const [calibratedSpo2, setCalibratedSpo2] = useState(currentVitals.spo2);
  const [calibratedTemp, setCalibratedTemp] = useState(currentVitals.temp);
  const [calibrationNotes, setCalibrationNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync state when patient changes
  useEffect(() => {
    setCalibratedBp(patient.vitals?.bp || '120/80');
    setCalibratedPulse(patient.vitals?.pulse || '72 bpm');
    setCalibratedSpo2(patient.vitals?.spo2 || '98%');
    setCalibratedTemp(patient.vitals?.temp || '98.6 °F');
  }, [patient.vitals]);

  // Evaluators
  const getBpStatus = (bp: string) => {
    const parts = bp.split('/');
    if (parts.length === 2) {
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      if (sys < 120 && dia < 80) return { label: 'Optimal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      if (sys <= 129 && dia < 80) return { label: 'Elevated', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      if (sys >= 130 || dia >= 80) return { label: 'Stage 1 High', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    }
    return { label: 'Recorded', color: 'text-slate-700 bg-slate-100 border-slate-200' };
  };

  const getSpo2Status = (spo2: string) => {
    const val = parseInt(spo2.replace(/\D/g, ''), 10);
    if (val >= 95) return { label: 'Healthy Oxygenation', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val >= 90) return { label: 'Mild Hypoxemia', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Critical', color: 'text-red-700 bg-red-50 border-red-200' };
  };

  const getPulseStatus = (pulse: string) => {
    const val = parseInt(pulse.replace(/\D/g, ''), 10);
    if (val >= 60 && val <= 100) return { label: 'Normal Sinus', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val > 100) return { label: 'Tachycardia', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    return { label: 'Bradycardia', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  };

  const getTempStatus = (temp: string) => {
    const val = parseFloat(temp.replace(/[^\d.]/g, ''));
    if (val >= 97.0 && val <= 99.0) return { label: 'Afebrile (Norm)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val > 99.0) return { label: 'Pyrexia / Fever', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    return { label: 'Hypothermia', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  };

  const handleResetToKiosk = () => {
    setCalibratedBp(patient.vitals?.bp || '120/80');
    setCalibratedPulse(patient.vitals?.pulse || '72 bpm');
    setCalibratedSpo2(patient.vitals?.spo2 || '98%');
    setCalibratedTemp(patient.vitals?.temp || '98.6 °F');
    onToast('Reverted adjustments to kiosk sensor readings.', 'info');
  };

  const handleUpdateVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedVitals: PatientVitals = {
        bp: calibratedBp.trim(),
        pulse: calibratedPulse.trim().endsWith('bpm') ? calibratedPulse.trim() : `${calibratedPulse.trim()} bpm`,
        spo2: calibratedSpo2.trim().endsWith('%') ? calibratedSpo2.trim() : `${calibratedSpo2.trim()}%`,
        temp: calibratedTemp.trim().endsWith('°F') ? calibratedTemp.trim() : `${calibratedTemp.trim()} °F`,
        last_checkup: `Calibrated by ${doctor.name} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      };

      await updatePatientVitals(patient.uid, updatedVitals, doctor);
      onToast('Vitals updated and synced directly with Firebase users collection.', 'success');
    } catch {
      onToast('Failed to update vitals in Firebase.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const bpStatus = getBpStatus(calibratedBp);
  const pulseStatus = getPulseStatus(calibratedPulse);
  const spo2Status = getSpo2Status(calibratedSpo2);
  const tempStatus = getTempStatus(calibratedTemp);

  return (
    <div id="vitals-calibration-container" className="space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FFE6E2] text-[#E6533C]">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">Live Vitals Station (Doctor Calibration)</h3>
          </div>
          <p className="text-xs text-slate-500">
            Automated sensor stream from physical MediKiosk. Doctors can verify, adjust, or re-measure parameters directly.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Recorded: <strong className="text-slate-800">{currentVitals.last_checkup}</strong></span>
        </div>
      </div>

      {/* 4 Vitals Display & Calibration Cards */}
      <form onSubmit={handleUpdateVitals}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Blood Pressure */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-red-50 text-red-600">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Blood Pressure</span>
                    <p className="text-[10px] text-slate-400">Systolic / Diastolic</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bpStatus.color}`}>
                  {bpStatus.label}
                </span>
              </div>

              <div className="my-3">
                <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {calibratedBp} <span className="text-xs font-normal text-slate-500 font-sans">mmHg</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Kiosk Reading: {currentVitals.bp} mmHg</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Doctor Calibration (mmHg)
              </label>
              <input
                id="calibrate-bp-input"
                type="text"
                value={calibratedBp}
                onChange={(e) => setCalibratedBp(e.target.value)}
                placeholder="e.g. 118/78"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
              />
            </div>
          </div>

          {/* Card 2: Pulse Rate */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pulse Rate</span>
                    <p className="text-[10px] text-slate-400">Heart Beats / Min</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pulseStatus.color}`}>
                  {pulseStatus.label}
                </span>
              </div>

              <div className="my-3">
                <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {calibratedPulse}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Kiosk Reading: {currentVitals.pulse}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Doctor Calibration (bpm)
              </label>
              <input
                id="calibrate-pulse-input"
                type="text"
                value={calibratedPulse}
                onChange={(e) => setCalibratedPulse(e.target.value)}
                placeholder="e.g. 74 bpm"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
              />
            </div>
          </div>

          {/* Card 3: SpO2 Oxygen Saturation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Blood Oxygen</span>
                    <p className="text-[10px] text-slate-400">SpO2 Percentage</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${spo2Status.color}`}>
                  {spo2Status.label}
                </span>
              </div>

              <div className="my-3">
                <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {calibratedSpo2}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Kiosk Reading: {currentVitals.spo2}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Doctor Calibration (%)
              </label>
              <input
                id="calibrate-spo2-input"
                type="text"
                value={calibratedSpo2}
                onChange={(e) => setCalibratedSpo2(e.target.value)}
                placeholder="e.g. 99%"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
              />
            </div>
          </div>

          {/* Card 4: Body Temperature */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Body Temp</span>
                    <p className="text-[10px] text-slate-400">Infrared Sensor</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tempStatus.color}`}>
                  {tempStatus.label}
                </span>
              </div>

              <div className="my-3">
                <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  {calibratedTemp}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Kiosk Reading: {currentVitals.temp}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                Doctor Calibration (°F)
              </label>
              <input
                id="calibrate-temp-input"
                type="text"
                value={calibratedTemp}
                onChange={(e) => setCalibratedTemp(e.target.value)}
                placeholder="e.g. 98.4 °F"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
              />
            </div>
          </div>
        </div>

        {/* Doctor Calibration Action Bar */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#E6533C]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Signing Physician: {doctor.name}
              </p>
              <p className="text-[11px] text-slate-500">
                Writes to <code className="text-[#E6533C] font-mono">users/{patient.uid}.vitals</code> with clinical timestamp and cryptographic sign-off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleResetToKiosk}
              className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Revert to Kiosk Readings
            </button>

            <button
              id="update-vitals-in-firebase-btn"
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-[#E6533C] hover:bg-[#CE3E29] text-white font-bold text-xs shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Writing to Firebase...' : 'Update Vitals in Firebase'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
