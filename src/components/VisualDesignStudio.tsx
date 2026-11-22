import React, { useState } from 'react';
import {
  Download,
  Type,
  Palette,
  Sparkles,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface VisualDesignStudioProps {
  onNotify?: (msg: string) => void;
}

const FONTS = [
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', font: "'Plus Jakarta Sans', sans-serif" },
  { id: 'Inter', label: 'Inter', font: "'Inter', sans-serif" },
  { id: 'Playfair Display', label: 'Playfair Display', font: "'Playfair Display', serif" },
  { id: 'Montserrat', label: 'Montserrat', font: "'Montserrat', sans-serif" },
  { id: 'JetBrains Mono', label: 'JetBrains Mono', font: "'JetBrains Mono', monospace" },
  { id: 'Impact', label: 'Impact', font: 'Impact, sans-serif' },
];

const THEMES = [
  { id: 'neon', name: 'Violet Andrea', bg: '#0f0a1e', text: '#ffffff', accent: '#a855f7' },
  { id: 'cyber', name: 'Bleu Nuit', bg: '#080d1a', text: '#ffffff', accent: '#38bdf8' },
  { id: 'sunset', name: 'Ambre', bg: '#1c0d1b', text: '#ffffff', accent: '#fb7185' },
  { id: 'emerald', name: 'Émeraude', bg: '#061612', text: '#ffffff', accent: '#34d399' },
  { id: 'minimal', name: 'Minimal Noir', bg: '#09090b', text: '#ffffff', accent: '#e4e4e7' },
];

const FORMATS = [
  { id: 'vertical', name: 'Vertical', ratio: '9:16', w: 1080, h: 1920 },
  { id: 'square', name: 'Carré', ratio: '1:1', w: 1080, h: 1080 },
  { id: 'landscape', name: 'Paysage', ratio: '16:9', w: 1280, h: 720 },
];

export const VisualDesignStudio: React.FC<VisualDesignStudioProps> = () => {
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[2]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);

  const [badgeText, setBadgeText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [titleSize, setTitleSize] = useState(32);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [uppercaseTitle, setUppercaseTitle] = useState(true);

  const drawExportCanvas = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = selectedFormat.w;
    canvas.height = selectedFormat.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.fillStyle = selectedTheme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = selectedTheme.accent;
    ctx.lineWidth = Math.max(4, canvas.width * 0.005);
    const pad = canvas.width * 0.05;
    ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);

    let cursorY = canvas.height * 0.25;
    const centerX = canvas.width / 2;

    if (badgeText.trim()) {
      ctx.font = `bold ${Math.round(canvas.width * 0.024)}px ${selectedFont.id}`;
      ctx.fillStyle = selectedTheme.accent;
      ctx.textAlign = 'center';
      ctx.fillText(badgeText.toUpperCase(), centerX, cursorY);
      cursorY += canvas.height * 0.1;
    }

    if (titleText.trim()) {
      ctx.font = `900 ${Math.round(canvas.width * (titleSize / 700))}px ${selectedFont.id}`;
      ctx.fillStyle = selectedTheme.text;
      ctx.textAlign = textAlign;
      const targetX = textAlign === 'center' ? centerX : textAlign === 'left' ? pad * 2 : canvas.width - pad * 2;
      ctx.fillText(uppercaseTitle ? titleText.toUpperCase() : titleText, targetX, cursorY);
    }

    if (subtitleText.trim()) {
      cursorY += canvas.height * 0.1;
      ctx.font = `normal ${Math.round(canvas.width * 0.024)}px ${selectedFont.id}`;
      ctx.fillStyle = '#c4b5fd';
      const targetX = textAlign === 'center' ? centerX : textAlign === 'left' ? pad * 2 : canvas.width - pad * 2;
      ctx.fillText(subtitleText, targetX, cursorY);
    }

    ctx.font = `bold ${Math.round(canvas.width * 0.02)}px system-ui, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('ANDREA STUDIO', canvas.width - pad * 1.5, canvas.height - pad * 1.2);

    return canvas.toDataURL('image/png');
  };

  const handleDownload = () => {
    const dataUrl = drawExportCanvas();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `andrea_visuel_${selectedFormat.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      <div className="shrink-0 flex items-center justify-between gap-3 border-b border-[#7c3aed]/30 pb-2.5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Studio de Design Visuel</span>
          </h2>
        </div>

        <button
          onClick={handleDownload}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1d4ed8] via-[#7c3aed] to-[#c026d3] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exporter PNG</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        <div className="lg:col-span-5 bg-[#15112a] border border-[#7c3aed]/50 rounded-2xl p-4 flex flex-col justify-between gap-2.5 overflow-hidden text-xs">
          <div>
            <label className="font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-cyan-400" />
              <span>Format :</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f)}
                  className={`p-2 rounded-xl border text-center cursor-pointer ${
                    selectedFormat.id === f.id
                      ? 'bg-[#231a4a] border-[#a855f7] text-white font-bold'
                      : 'bg-[#1a1535] border-[#7c3aed]/30 text-[#c4b5fd]'
                  }`}
                >
                  <div className="text-[11px] font-bold">{f.name}</div>
                  <div className="text-[10px] text-[#a78bfa]">{f.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-white mb-1 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-purple-400" />
                <span>Police :</span>
              </label>
              <select
                value={selectedFont.id}
                onChange={(e) => {
                  const found = FONTS.find((f) => f.id === e.target.value);
                  if (found) setSelectedFont(found);
                }}
                className="w-full bg-[#1a1535] border border-[#7c3aed] text-white text-xs rounded-xl p-2"
              >
                {FONTS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-white mb-1 block">Alignement :</label>
              <div className="flex bg-[#1a1535] border border-[#7c3aed]/40 rounded-xl p-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => setTextAlign(align)}
                    className={`flex-1 py-1 rounded flex items-center justify-center cursor-pointer ${
                      textAlign === align ? 'bg-[#7c3aed] text-white' : 'text-[#c4b5fd]'
                    }`}
                  >
                    {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
                    {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
                    {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-white mb-1 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>Palette :</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-1.5 rounded-xl border text-center cursor-pointer ${
                    selectedTheme.id === theme.id ? 'bg-[#231a4a] border-[#a855f7]' : 'bg-[#1a1535] border-[#7c3aed]/30'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ background: theme.accent }} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-white">Titre Principal ({titleSize}px)</label>
              <button onClick={() => setUppercaseTitle(!uppercaseTitle)} className="text-[10px] text-purple-300 cursor-pointer">
                {uppercaseTitle ? 'Majuscules : OUI' : 'Majuscules : NON'}
              </button>
            </div>
            <input
              type="range"
              min="20"
              max="52"
              value={titleSize}
              onChange={(e) => setTitleSize(Number(e.target.value))}
              className="w-full accent-[#7c3aed]"
            />
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full bg-[#1a1535] border border-[#7c3aed]/60 text-white rounded-xl p-2"
              placeholder="Saisir un badge..."
            />
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              className="w-full bg-[#1a1535] border border-[#7c3aed] text-white font-bold rounded-xl p-2"
              placeholder="Saisir votre titre..."
            />
            <input
              type="text"
              value={subtitleText}
              onChange={(e) => setSubtitleText(e.target.value)}
              className="w-full bg-[#1a1535] border border-[#7c3aed]/60 text-white rounded-xl p-2"
              placeholder="Saisir un sous-titre..."
            />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#0a0718] border border-[#7c3aed]/40 rounded-2xl p-4 overflow-hidden">
          <div
            className="w-full max-w-md rounded-2xl p-6 flex flex-col justify-between relative shadow-2xl border-2"
            style={{
              backgroundColor: selectedTheme.bg,
              borderColor: selectedTheme.accent,
              aspectRatio:
                selectedFormat.id === 'vertical' ? '9/16' : selectedFormat.id === 'square' ? '1/1' : '16/9',
              maxHeight: '380px',
            }}
          >
            <div className="text-center">
              {badgeText.trim() && (
                <span
                  className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold border"
                  style={{
                    backgroundColor: `${selectedTheme.accent}20`,
                    color: selectedTheme.accent,
                    borderColor: `${selectedTheme.accent}60`,
                  }}
                >
                  {badgeText.toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-2 my-auto" style={{ textAlign }}>
              {titleText.trim() ? (
                <h1
                  className="font-black leading-tight"
                  style={{ fontSize: `${titleSize}px`, color: selectedTheme.text, fontFamily: selectedFont.font }}
                >
                  {uppercaseTitle ? titleText.toUpperCase() : titleText}
                </h1>
              ) : (
                <p className="text-xs text-slate-400">Saisissez votre texte à gauche pour composer votre visuel</p>
              )}
              {subtitleText.trim() && (
                <p className="text-xs text-[#c4b5fd]" style={{ fontFamily: selectedFont.font }}>
                  {subtitleText}
                </p>
              )}
            </div>

            <div className="absolute bottom-2 right-3 text-[10px] font-bold text-white/60">ANDREA STUDIO</div>
          </div>
        </div>
      </div>
    </div>
  );
};
