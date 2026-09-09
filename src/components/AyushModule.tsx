import React, { useState, useEffect } from 'react';
import {
  Leaf,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Stethoscope,
  Info,
  Flame,
  Droplets,
  CloudSun
} from 'lucide-react';
import { PatientRecord, Doctor, AyushEvaluation } from '../types';
import { updatePatientAyush } from '../services/firebase';

interface AyushModuleProps {
  patient: PatientRecord;
  doctor: Doctor;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AyushModule: React.FC<AyushModuleProps> = ({
  patient,
  doctor,
  onToast,
}) => {
  const initialAyush: AyushEvaluation = patient.ayush || {
    vata: 50,
    pitta: 30,
    kapha: 20,
    dominantPrakriti: 'Vata-Pitta',
    aharaVihara: 'Ahara: Warm nourishing soups, herbal tea with ginger and holy basil. Avoid refrigerated foods.\nVihara: Regular sleep schedule, warm oil application (Abhyanga), gentle breathing exercises.',
  };

  const [vata, setVata] = useState<number>(initialAyush.vata);
  const [pitta, setPitta] = useState<number>(initialAyush.pitta);
  const [kapha, setKapha] = useState<number>(initialAyush.kapha);
  const [aharaVihara, setAharaVihara] = useState<string>(initialAyush.aharaVihara);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient.ayush) {
      setVata(patient.ayush.vata);
      setPitta(patient.ayush.pitta);
      setKapha(patient.ayush.kapha);
      setAharaVihara(patient.ayush.aharaVihara);
    }
  }, [patient.ayush]);

  // Compute normalized dominant Prakriti dynamically
  const calculateDominantPrakriti = (v: number, p: number, k: number) => {
    const total = v + p + k || 1;
    const vPct = Math.round((v / total) * 100);
    const pPct = Math.round((p / total) * 100);
    const kPct = Math.round((k / total) * 100);

    const doshas = [
      { name: 'Vata', val: vPct, element: 'Ether & Air' },
      { name: 'Pitta', val: pPct, element: 'Fire & Water' },
      { name: 'Kapha', val: kPct, element: 'Water & Earth' },
    ].sort((a, b) => b.val - a.val);

    if (Math.abs(doshas[0].val - doshas[1].val) <= 5 && Math.abs(doshas[1].val - doshas[2].val) <= 5) {
      return {
        title: 'Sama Prakriti (Tridoshic Balanced)',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        summary: 'Equal distribution of bio-energies. Optimal homeostasis.',
      };
    }

    if (Math.abs(doshas[0].val - doshas[1].val) <= 10) {
      return {
        title: `${doshas[0].name}-${doshas[1].name} Dwandwaja`,
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        summary: `Dual-dominant Constitution (${doshas[0].name} primary with significant ${doshas[1].name} traits).`,
      };
    }

    return {
      title: `${doshas[0].name} Pradhana (Single Dominant)`,
      badgeColor: 'bg-[#FFE6E2] text-[#E6533C] border-[#FFCDC5]',
      summary: `High ${doshas[0].name} influence (${doshas[0].val}% of metabolic energy). Needs balancing Ahara & Vihara.`,
    };
  };

  const totalSum = vata + pitta + kapha;
  const prakritiInfo = calculateDominantPrakriti(vata, pitta, kapha);

  const handleSaveAyush = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const evaluation: AyushEvaluation = {
        vata,
        pitta,
        kapha,
        dominantPrakriti: prakritiInfo.title,
        aharaVihara: aharaVihara.trim(),
      };

      await updatePatientAyush(patient.uid, evaluation, doctor);
      onToast('AYUSH Tridosha assessment saved and synchronized in Firestore.', 'success');
    } catch {
      onToast('Failed to save AYUSH evaluation.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (patient.ayush) {
      setVata(patient.ayush.vata);
      setPitta(patient.ayush.pitta);
      setKapha(patient.ayush.kapha);
      setAharaVihara(patient.ayush.aharaVihara);
    } else {
      setVata(50);
      setPitta(30);
      setKapha(20);
    }
    onToast('Reset sliders to previous saved evaluation.', 'info');
  };

  return (
    <div id="ayush-module-container" className="space-y-6">
      {/* Header card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Leaf className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              AYUSH Tridosha Module (Doctor Ayurvedic Calibration)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Standardized clinical Ayur-genomics and Prakriti profiling integrated with MediKiosk health stations.
          </p>
        </div>

        {/* Real-Time Dominant Prakriti Badge */}
        <div className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 text-xs font-bold ${prakritiInfo.badgeColor}`}>
          <Sparkles className="w-4 h-4" />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-75">Dominant Prakriti</p>
            <p className="text-xs font-extrabold">{prakritiInfo.title}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAyush} className="space-y-6">
        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Vata Slider */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                    <CloudSun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Vata Dosha</h4>
                    <p className="text-[11px] text-slate-500">Ether &amp; Air (Mobility / Nerves)</p>
                  </div>
                </div>
                <span className="text-lg font-mono font-bold text-sky-700">{vata}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-150"
                  style={{ width: `${Math.min(vata, 100)}%` }}
                />
              </div>

              {/* Range Slider */}
              <input
                id="slider-vata"
                type="range"
                min="0"
                max="100"
                value={vata}
                onChange={(e) => setVata(parseInt(e.target.value, 10))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Signs: Dry skin, rapid speech, variable appetite, nocturnal cough or insomnia.
            </div>
          </div>

          {/* Pitta Slider */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pitta Dosha</h4>
                    <p className="text-[11px] text-slate-500">Fire &amp; Water (Digestion / Heat)</p>
                  </div>
                </div>
                <span className="text-lg font-mono font-bold text-amber-700">{pitta}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-150"
                  style={{ width: `${Math.min(pitta, 100)}%` }}
                />
              </div>

              {/* Range Slider */}
              <input
                id="slider-pitta"
                type="range"
                min="0"
                max="100"
                value={pitta}
                onChange={(e) => setPitta(parseInt(e.target.value, 10))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Signs: Sharp hunger, heat intolerance, acidity, inflammatory tendencies.
            </div>
          </div>

          {/* Kapha Slider */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Kapha Dosha</h4>
                    <p className="text-[11px] text-slate-500">Water &amp; Earth (Structure / Fluid)</p>
                  </div>
                </div>
                <span className="text-lg font-mono font-bold text-emerald-800">{kapha}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-150"
                  style={{ width: `${Math.min(kapha, 100)}%` }}
                />
              </div>

              {/* Range Slider */}
              <input
                id="slider-kapha"
                type="range"
                min="0"
                max="100"
                value={kapha}
                onChange={(e) => setKapha(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              Signs: Calm demeanor, sluggish metabolism, mucosal congestion, stamina.
            </div>
          </div>
        </div>

        {/* Doctor's Ahara-Vihara Prescription */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Doctor's Ahara-Vihara (Dietary &amp; Lifestyle Regimen) *
            </label>
            <span className="text-[11px] text-slate-400">
              Recommended for {prakritiInfo.title}
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Provide customized botanical infusions, dietary dos &amp; don'ts, Dinacharya (daily rituals), and seasonal Ritucharya guidance.
          </p>

          <textarea
            id="ahara-vihara-textarea"
            rows={4}
            required
            value={aharaVihara}
            onChange={(e) => setAharaVihara(e.target.value)}
            placeholder="e.g. Ahara: Warm cooked foods, ginger-tulsi tea, avoid cold dairy and stale preparations. Vihara: Sesame oil nasal drops (Pratimarsha Nasya), steam inhalation..."
            className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E6533C] leading-relaxed"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Evaluating Physician: {doctor.name}
              </p>
              <p className="text-[11px] text-slate-500">
                Writes to <code className="text-[#E6533C] font-mono">users/{patient.uid}.ayush</code> with calibrated Prakriti metrics.
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
              Reset Sliders
            </button>

            <button
              id="save-ayush-evaluation-btn"
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Writing to Firebase...' : 'Save AYUSH Evaluation'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
