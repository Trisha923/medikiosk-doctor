import React, { useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  X,
  FileText,
  Calendar,
  Sparkles,
  Contrast,
  RotateCcw as ResetIcon
} from 'lucide-react';
import { PrescriptionItem } from '../types';

interface PrescriptionLightboxProps {
  item: PrescriptionItem;
  onClose: () => void;
}

export const PrescriptionLightbox: React.FC<PrescriptionLightboxProps> = ({ item, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === 'r' || e.key === 'R') handleRotateCw();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotateCw = () => setRotation((prev) => (prev + 90) % 360);
  const handleRotateCcw = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleReset = () => {
    setZoomLevel(1);
    setRotation(0);
    setHighContrast(false);
  };

  return (
    <div
      id="prescription-lightbox-overlay"
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between select-none"
    >
      {/* Lightbox Header Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#E6533C]/20 text-[#FF7A66]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide">{item.name}</h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                {item.doc_type}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Scanned: {new Date(item.captured_at).toLocaleString()} • Kiosk Optical Scanner
            </p>
          </div>
        </div>

        {/* Floating Tool Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/95 p-1.5 rounded-2xl border border-slate-700 shadow-xl">
          <button
            onClick={handleZoomIn}
            title="Zoom In (+)"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-[#FF7A66] px-2 min-w-[50px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button
            onClick={handleRotateCcw}
            title="Rotate Left 90°"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotateCw}
            title="Rotate Right 90° (R)"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Toggle High-Contrast Filter (For Faint Handwriting)"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              highContrast
                ? 'bg-[#E6533C] text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Contrast className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Zoom & Rotation"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Lightbox (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 cursor-grab active:cursor-grabbing">
        <div
          className="transition-transform duration-200 ease-out origin-center shadow-2xl rounded-xl overflow-hidden bg-white max-w-4xl"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            filter: highContrast ? 'contrast(160%) brightness(95%) grayscale(20%)' : 'none',
          }}
        >
          <img
            src={item.image_url_or_base64}
            alt={item.name}
            className="max-h-[75vh] w-auto object-contain block mx-auto pointer-events-none"
          />
        </div>
      </div>

      {/* Lightbox Footer Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FF7A66]" />
          <span className="font-bold text-slate-300">Doctor Clinical Lightbox:</span>
          <span>Inspect faint ballpoint ink, hospital seal stamps, and physical prescribers.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
          <span>Shortcuts: [+] / [-] Zoom • [R] Rotate • [Esc] Close</span>
        </div>
      </div>
    </div>
  );
};
