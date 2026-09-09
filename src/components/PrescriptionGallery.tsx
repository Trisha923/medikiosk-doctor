import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  ZoomIn,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Save,
  Pencil,
  AlertCircle,
  FileCheck,
  Stethoscope,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { PrescriptionItem, Doctor, PatientRecord } from '../types';
import { updatePatientPrescription } from '../services/firebase';
import { PrescriptionLightbox } from './PrescriptionLightbox';

interface PrescriptionGalleryProps {
  patient: PatientRecord;
  doctor: Doctor;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PrescriptionGallery: React.FC<PrescriptionGalleryProps> = ({
  patient,
  doctor,
  onToast,
}) => {
  const [selectedItemForLightbox, setSelectedItemForLightbox] = useState<PrescriptionItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'prescriptions' | 'case_papers'>('all');

  // Edit notes state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [savingItem, setSavingItem] = useState(false);

  // Combine prescriptions & case papers
  const allDocuments: PrescriptionItem[] = [
    ...(patient.prescriptions || []),
    ...(patient.case_papers || []),
  ];

  const filteredDocs = allDocuments.filter((doc) => {
    if (activeTab === 'prescriptions') return doc.doc_type === 'prescription';
    if (activeTab === 'case_papers') return doc.doc_type === 'case_paper';
    return true;
  });

  const handleStartEditNotes = (item: PrescriptionItem) => {
    setEditingItemId(item.id);
    setEditedNotes(item.doctor_notes || '');
  };

  const handleSaveNotes = async (item: PrescriptionItem) => {
    setSavingItem(true);
    try {
      await updatePatientPrescription(
        patient.uid,
        item.id,
        { doctor_notes: editedNotes.trim() },
        doctor
      );
      setEditingItemId(null);
      onToast('Clinical doctor notes updated and synced with Firebase.', 'success');
    } catch {
      onToast('Failed to save prescription notes.', 'error');
    } finally {
      setSavingItem(false);
    }
  };

  const handleToggleMedStatus = async (
    item: PrescriptionItem,
    medIndex: number,
    newStatus: 'VERIFIED' | 'DISCONTINUED'
  ) => {
    if (!item.verified_medications) return;

    const updatedMeds = item.verified_medications.map((m, idx) => {
      if (idx === medIndex) {
        return { ...m, status: newStatus };
      }
      return m;
    });

    try {
      await updatePatientPrescription(
        patient.uid,
        item.id,
        { verified_medications: updatedMeds },
        doctor
      );
      onToast(
        `Medication marked as ${newStatus} in patient record.`,
        newStatus === 'VERIFIED' ? 'success' : 'info'
      );
    } catch {
      onToast('Failed to update medication status.', 'error');
    }
  };

  return (
    <div id="prescription-gallery-container" className="space-y-6">
      {/* Header bar with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#FFE6E2] text-[#E6533C]">
              <FileCheck className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              OCR Scanned Prescriptions &amp; Clinical Case Papers
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Ingested via MediKiosk hardware scanner with AI optical character recognition and medication extraction.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Documents ({allDocuments.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'prescriptions'
                ? 'bg-white text-[#E6533C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prescriptions ({patient.prescriptions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('case_papers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'case_papers'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Case Papers ({patient.case_papers?.length || 0})
          </button>
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="font-bold text-slate-700">No scanned documents in this category</p>
          <p className="text-xs text-slate-400 mt-1">
            Documents scanned at the physical kiosk terminal appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Card Top / Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    onClick={() => setSelectedItemForLightbox(doc)}
                    className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 cursor-pointer relative group flex items-center justify-center"
                  >
                    {(() => {
                      const rawSrc = doc.image_url_or_base64 || (doc as any).image_url || (doc as any).url || (doc as any).imageUrl;
                      const isValidSrc = rawSrc && (rawSrc.startsWith('data:image') || rawSrc.startsWith('http') || rawSrc.startsWith('blob:'));
                      
                      if (isValidSrc) {
                        return (
                          <img
                            src={rawSrc}
                            alt={doc.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              // Hide broken image icon and show fallback styling
                              (e.target as HTMLElement).style.display = 'none';
                              const parent = (e.target as HTMLElement).parentElement;
                              if (parent) {
                                parent.classList.add('bg-amber-50');
                              }
                            }}
                          />
                        );
                      }
                      return (
                        <div className="flex flex-col items-center justify-center p-1 text-center">
                          <FileText className="w-6 h-6 text-[#E6533C] mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-600 line-clamp-1">DOC</span>
                        </div>
                      );
                    })()}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <ZoomIn className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          (doc.doc_type || (doc as any).docType) === 'prescription'
                            ? 'bg-[#FFE6E2] text-[#E6533C]'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {doc.doc_type || (doc as any).docType || 'prescription'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {(() => {
                        const raw = doc.captured_at || (doc as any).uploaded_at || (doc as any).createdAt;
                        if (!raw) return 'Recently Scanned';
                        const d = new Date(raw);
                        if (isNaN(d.getTime())) return 'Recently Scanned';
                        return d.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                      })()}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedItemForLightbox(doc)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#E6533C] hover:underline mt-2 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      Open Fullscreen Lightbox &amp; Zoom
                    </button>
                  </div>
                </div>

                {doc.doctor_verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Reviewed
                  </span>
                )}
              </div>

              {/* Card Middle: AI OCR Extracted Clinical Data */}
              <div className="p-5 bg-slate-50/60 border-b border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E6533C]" />
                    AI OCR Extracted Clinical Data
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Kiosk OCR Engine v4.2
                  </span>
                </div>

                {/* Raw OCR Text snippet */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed">
                  {doc.ocr_extraction}
                </div>

                {/* Parsed Verified Medications if prescription */}
                {doc.verified_medications && doc.verified_medications.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <p className="text-xs font-bold text-slate-800">
                      Parsed Prescription Items &amp; Clinical Verification:
                    </p>
                    <div className="space-y-2">
                      {doc.verified_medications.map((med, medIdx) => (
                        <div
                          key={medIdx}
                          className={`p-2.5 rounded-xl border transition-colors flex items-center justify-between gap-3 text-xs ${
                            med.status === 'DISCONTINUED'
                              ? 'bg-slate-100 border-slate-200 text-slate-500 line-through'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{med.name}</span>
                              <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                                {med.dosage}
                              </span>
                              <span className="text-slate-500 font-medium">({med.frequency})</span>
                            </div>
                            {med.instructions && (
                              <p className="text-[11px] text-slate-400 mt-0.5">{med.instructions}</p>
                            )}
                          </div>

                          {/* Action toggles: Verified vs Discontinued */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleMedStatus(doc, medIdx, 'VERIFIED')}
                              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                                med.status === 'VERIFIED'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleMedStatus(doc, medIdx, 'DISCONTINUED')}
                              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                                med.status === 'DISCONTINUED'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              <XCircle className="w-3 h-3" />
                              Discontinue
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Bottom: Doctor Clinical Notes */}
              <div className="p-5 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-[#E6533C]" />
                    Doctor Clinical Notes &amp; Observations:
                  </span>
                  {editingItemId !== doc.id && (
                    <button
                      type="button"
                      onClick={() => handleStartEditNotes(doc)}
                      className="text-xs font-bold text-[#E6533C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit Notes
                    </button>
                  )}
                </div>

                {editingItemId === doc.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add physician remarks, compliance instructions, or follow-up caveats..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E6533C]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItemId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingItem}
                        onClick={() => handleSaveNotes(doc)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#E6533C] hover:bg-[#CE3E29] text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {savingItem ? 'Saving...' : 'Save to Firebase'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 italic">
                    {doc.doctor_notes || 'No doctor remarks recorded yet. Click Edit Notes to annotate.'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItemForLightbox && (
        <PrescriptionLightbox
          item={selectedItemForLightbox}
          onClose={() => setSelectedItemForLightbox(null)}
        />
      )}
    </div>
  );
};
