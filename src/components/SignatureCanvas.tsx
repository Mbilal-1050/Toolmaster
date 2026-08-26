import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Type, Pen, Upload, RotateCcw } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureConfirmed: (dataUrl: string) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSignatureConfirmed }) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState<'cursive' | 'serif' | 'signature'>('cursive');
  const [inkColor, setInkColor] = useState('#0f172a');
  const [hasSignature, setHasSignature] = useState(false);

  // Setup canvas
  useEffect(() => {
    if (tab === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = inkColor;
      }
    }
  }, [tab, inkColor]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleConfirmDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSignatureConfirmed(dataUrl);
  };

  const handleConfirmType = () => {
    if (!typedName.trim()) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = inkColor;
    let fontStyle = 'italic 36px "Brush Script MT", cursive, sans-serif';
    if (selectedFont === 'serif') fontStyle = 'italic 32px "Times New Roman", serif';
    if (selectedFont === 'signature') fontStyle = 'italic 38px "Snell Roundhand", cursive, sans-serif';

    ctx.font = fontStyle;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName, 200, 80);

    const dataUrl = canvas.toDataURL('image/png');
    onSignatureConfirmed(dataUrl);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSignatureConfirmed(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6 max-w-sm">
        <button
          type="button"
          onClick={() => setTab('draw')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            tab === 'draw'
              ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Pen className="w-3.5 h-3.5" /> Draw
        </button>
        <button
          type="button"
          onClick={() => setTab('type')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            tab === 'type'
              ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" /> Type
        </button>
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
            tab === 'upload'
              ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload
        </button>
      </div>

      {/* Color Picker */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Ink Color:</span>
        {[
          { color: '#0f172a', label: 'Black' },
          { color: '#1e3a8a', label: 'Navy' },
          { color: '#2563eb', label: 'Blue' },
          { color: '#dc2626', label: 'Red' },
        ].map((c) => (
          <button
            key={c.color}
            type="button"
            onClick={() => setInkColor(c.color)}
            style={{ backgroundColor: c.color }}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              inkColor === c.color ? 'border-rose-500 scale-110 shadow-xs' : 'border-transparent'
            }`}
            title={c.label}
          />
        ))}
      </div>

      {/* Mode Content */}
      {tab === 'draw' && (
        <div>
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={500}
              height={180}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[180px] cursor-crosshair touch-none"
            />
            <div className="absolute bottom-3 left-4 text-[11px] text-slate-400 font-mono pointer-events-none select-none">
              Sign above the line ────────────────
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={clearCanvas}
              className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Pad
            </button>
            <button
              type="button"
              onClick={handleConfirmDraw}
              disabled={!hasSignature}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Check className="w-4 h-4" /> Use Drawn Signature
            </button>
          </div>
        </div>
      )}

      {tab === 'type' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Type your full legal name:
            </label>
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="e.g. Johnathan Doe"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'cursive', label: 'Cursive', font: 'font-serif italic' },
              { id: 'signature', label: 'Elegant', font: 'font-mono italic' },
              { id: 'serif', label: 'Classic', font: 'font-serif' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFont(f.id as any)}
                className={`p-3 border rounded-xl text-center text-sm transition ${
                  selectedFont === f.id
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                } ${f.font}`}
              >
                {typedName || f.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleConfirmType}
              disabled={!typedName.trim()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <Check className="w-4 h-4" /> Use Typed Signature
            </button>
          </div>
        </div>
      )}

      {tab === 'upload' && (
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUploadImage}
            className="hidden"
            id="signature-upload-input"
          />
          <label
            htmlFor="signature-upload-input"
            className="cursor-pointer inline-flex flex-col items-center justify-center gap-2"
          >
            <div className="p-3 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Upload signature image
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              PNG format with transparent background recommended
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
