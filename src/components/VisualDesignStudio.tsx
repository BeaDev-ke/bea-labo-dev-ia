import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  Type, 
  Palette, 
  Sparkles, 
  Layout, 
  Layers, 
  Image as ImageIcon,
  Check, 
  RotateCcw,
  Maximize2,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Share2
} from 'lucide-react';

interface VisualDesignStudioProps {
  onNotify?: (msg: string) => void;
}

const FONTS = [
  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Moderne & Tech)', font: "'Plus Jakarta Sans', sans-serif" },
  { id: 'Inter', label: 'Inter (Clarté & Neutralité)', font: "'Inter', sans-serif" },
  { id: 'Playfair Display', label: 'Playfair Display (Éditorial & Luxe)', font: "'Playfair Display', serif" },
  { id: 'Montserrat', label: 'Montserrat (Audacieux & Géométrique)', font: "'Montserrat', sans-serif" },
  { id: 'JetBrains Mono', label: 'JetBrains Mono (Code & Précision)', font: "'JetBrains Mono', monospace" },
  { id: 'Impact', label: 'Impact / Anton (Ultra Percutant & Viral)', font: "Impact, sans-serif" },
];

const THEMES = [
  { id: 'neon', name: 'Violet BehaviorLab', bg: '#0f0a1e', gradient: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 55%, #db2777 100%)', text: '#ffffff', accent: '#a855f7' },
  { id: 'cyber', name: 'Cyberpunk Bleu', bg: '#080d1a', gradient: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #6366f1 100%)', text: '#ffffff', accent: '#38bdf8' },
  { id: 'sunset', name: 'Soleil Couchant', bg: '#1c0d1b', gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 50%, #facc15 100%)', text: '#ffffff', accent: '#fb7185' },
  { id: 'emerald', name: 'Croissance Émeraude', bg: '#061612', gradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%)', text: '#ffffff', accent: '#34d399' },
  { id: 'minimal', name: 'Minimal Sombre Luxe', bg: '#09090b', gradient: 'linear-gradient(135deg, #27272a 0%, #18181b 100%)', text: '#ffffff', accent: '#e4e4e7' },
];

const FORMATS = [
  { id: 'vertical', name: 'Format Vertical (9:16)', ratio: '9:16', w: 1080, h: 1920, label: 'Vertical (9:16)' },
  { id: 'square', name: 'Format Carré (1:1)', ratio: '1:1', w: 1080, h: 1080, label: 'Carré (1:1)' },
  { id: 'landscape', name: 'Format Paysage (16:9)', ratio: '16:9', w: 1280, h: 720, label: 'Paysage (16:9)' },
];

const TEMPLATES = [
  {
    title: "J'ai arrêté de procrastiner en 7 jours",
    subtitle: "La méthode comportementale en 3 étapes validée par les neurosciences.",
    badge: "⚡ PROTOCOLE 7 JOURS",
    cta: "Découvrir la méthode",
  },
  {
    title: "95% des créateurs font cette erreur fatale",
    subtitle: "Pourquoi tes 3 premières secondes sabotent 80% de ton audience.",
    badge: "🚨 ERREUR CRITIQUE",
    cta: "Voir la solution",
  },
  {
    title: "Comment j'ai doublé mes prix sans perdre un client",
    subtitle: "Le biais d'ancrage et la preuve sociale expliqués simplement.",
    badge: "💼 BIAIS PSYCHOLOGIQUE",
    cta: "Lire l'analyse",
  },
];

export const VisualDesignStudio: React.FC<VisualDesignStudioProps> = () => {
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[2]); // Format paysage par défaut
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  
  // Content states
  const [badgeText, setBadgeText] = useState('⚡ MÉTHODE COMPORTEMENTALE');
  const [titleText, setTitleText] = useState("J'ai arrêté de procrastiner en 7 jours");
  const [subtitleText, setSubtitleText] = useState("Le protocole en 3 étapes pour débloquer sa productivité sans forcer.");
  const [ctaText, setCtaText] = useState('Découvrir le protocole');
  const [titleSize, setTitleSize] = useState(36);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [uppercaseTitle, setUppercaseTitle] = useState(true);
  const [showBadge, setShowBadge] = useState(true);
  const [showCta, setShowCta] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw canvas for PNG export
  const drawExportCanvas = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = selectedFormat.w;
    canvas.height = selectedFormat.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background
    ctx.fillStyle = selectedTheme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing subtle gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#1d4ed8');
    grad.addColorStop(0.6, '#7c3aed');
    grad.addColorStop(1, '#db2777');

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, canvas.width * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Card frame
    ctx.strokeStyle = selectedTheme.accent;
    ctx.lineWidth = Math.max(4, canvas.width * 0.005);
    const pad = canvas.width * 0.05;
    ctx.strokeRect(pad, pad, canvas.width - pad * 2, canvas.height - pad * 2);

    // Badge
    let cursorY = canvas.height * 0.25;
    const centerX = canvas.width / 2;

    if (showBadge && badgeText.trim()) {
      ctx.font = `bold ${Math.round(canvas.width * 0.024)}px ${selectedFont.id}`;
      ctx.fillStyle = selectedTheme.accent;
      ctx.textAlign = 'center';
      ctx.fillText(badgeText.toUpperCase(), centerX, cursorY);
      cursorY += canvas.height * 0.1;
    }

    // Title
    ctx.font = `900 ${Math.round(canvas.width * (titleSize / 700))}px ${selectedFont.id}`;
    ctx.fillStyle = selectedTheme.text;
    ctx.textAlign = textAlign;

    const targetX = textAlign === 'center' ? centerX : (textAlign === 'left' ? pad * 2 : canvas.width - pad * 2);
    const textToPrint = uppercaseTitle ? titleText.toUpperCase() : titleText;
    
    // Wrap title lines
    const words = textToPrint.split(' ');
    let line = '';
    const maxWidth = canvas.width * 0.8;
    const lineHeight = canvas.width * (titleSize / 600);

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, targetX, cursorY);
        line = words[n] + ' ';
        cursorY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, targetX, cursorY);
    cursorY += lineHeight * 0.8;

    // Subtitle
    if (subtitleText.trim()) {
      ctx.font = `normal ${Math.round(canvas.width * 0.025)}px ${selectedFont.id}`;
      ctx.fillStyle = '#c4b5fd';
      ctx.textAlign = textAlign;
      ctx.fillText(subtitleText, targetX, cursorY);
      cursorY += canvas.height * 0.12;
    }

    // CTA Button
    if (showCta && ctaText.trim()) {
      const btnW = canvas.width * 0.32;
      const btnH = canvas.height * 0.09;
      const btnX = centerX - btnW / 2;
      const btnY = Math.min(cursorY, canvas.height * 0.8);

      ctx.fillStyle = selectedTheme.accent;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 20);
      ctx.fill();

      ctx.font = `bold ${Math.round(btnH * 0.36)}px ${selectedFont.id}`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(ctaText, centerX, btnY + btnH * 0.62);
    }

    return canvas.toDataURL('image/png');
  };

  const handleDownload = () => {
    const dataUrl = drawExportCanvas();
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `bea_visuel_${selectedFormat.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleApplyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitleText(tpl.title);
    setSubtitleText(tpl.subtitle);
    setBadgeText(tpl.badge);
    setCtaText(tpl.cta);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#7c3aed]/30 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Studio de Design Visuel Bea
          </h2>
          <p className="text-xs text-[#c4b5fd]">
            Modifiez la typographie, les calques, les thèmes et exportez en PNG haute définition sans quitter Bea.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1d4ed8] via-[#7c3aed] to-[#c026d3] text-white text-xs font-bold hover:opacity-95 transition flex items-center gap-2 shadow-lg shadow-purple-900/40 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Télécharger le Visuel (PNG HD)
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Toolbar: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-[#15112a] border-2 border-[#7c3aed]/50 rounded-2xl p-5">
          {/* Formats */}
          <div>
            <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-cyan-400" />
              Format du média :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedFormat.id === f.id
                      ? 'bg-[#231a4a] border-[#a855f7] text-white font-bold shadow'
                      : 'bg-[#1a1535] border-[#7c3aed]/30 text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  <div className="text-[11px] font-bold">{f.name}</div>
                  <div className="text-[10px] text-[#a78bfa]">{f.ratio}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Modèles comportementaux prêts à l'emploi :
            </label>
            <div className="space-y-1.5">
              {TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="w-full text-left p-2.5 rounded-xl bg-[#1a1535] hover:bg-[#231a4a] border border-[#7c3aed]/30 text-xs text-[#f5f3ff] transition flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{tpl.title}</span>
                  <span className="text-[10px] text-purple-400 group-hover:text-purple-300 shrink-0 font-semibold">
                    Appliquer
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography Selector */}
          <div className="space-y-3 pt-2 border-t border-[#7c3aed]/20">
            <label className="block text-xs font-bold text-white flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-400" />
              Police de caractères (Typographie) :
            </label>
            <select
              value={selectedFont.id}
              onChange={e => {
                const found = FONTS.find(f => f.id === e.target.value);
                if (found) setSelectedFont(found);
              }}
              className="w-full bg-[#1a1535] border-2 border-[#7c3aed] text-white text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#a855f7]"
            >
              {FONTS.map(f => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>

            {/* Title size and text align */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-[#c4b5fd] mb-1">Taille du titre ({titleSize}px)</label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={titleSize}
                  onChange={e => setTitleSize(Number(e.target.value))}
                  className="w-full accent-[#7c3aed]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#c4b5fd] mb-1">Alignement</label>
                <div className="flex bg-[#1a1535] border border-[#7c3aed]/40 rounded-lg p-0.5">
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button
                      key={align}
                      onClick={() => setTextAlign(align)}
                      className={`flex-1 py-1 rounded flex items-center justify-center ${
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
          </div>

          {/* Theme Palette */}
          <div className="pt-2 border-t border-[#7c3aed]/20">
            <label className="block text-xs font-bold text-white mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              Palette & Ambiance de couleur :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                    selectedTheme.id === theme.id
                      ? 'bg-[#231a4a] border-[#a855f7] shadow'
                      : 'bg-[#1a1535] border-[#7c3aed]/30 hover:border-[#7c3aed]'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                    style={{ background: theme.accent }}
                  />
                  <span className="text-[11px] text-white font-medium truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Fields */}
          <div className="space-y-2.5 pt-2 border-t border-[#7c3aed]/20">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-white">Badge d'accroche</label>
                <input
                  type="checkbox"
                  checked={showBadge}
                  onChange={e => setShowBadge(e.target.checked)}
                  className="accent-[#7c3aed]"
                />
              </div>
              <input
                type="text"
                value={badgeText}
                onChange={e => setBadgeText(e.target.value)}
                disabled={!showBadge}
                className="w-full bg-[#1a1535] border border-[#7c3aed]/60 text-white text-xs rounded-xl p-2 disabled:opacity-40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-white">Titre Principal</label>
                <button
                  onClick={() => setUppercaseTitle(!uppercaseTitle)}
                  className="text-[10px] text-purple-300 hover:underline"
                >
                  {uppercaseTitle ? 'Majuscules : OUI' : 'Majuscules : NON'}
                </button>
              </div>
              <textarea
                value={titleText}
                onChange={e => setTitleText(e.target.value)}
                rows={2}
                className="w-full bg-[#1a1535] border-2 border-[#7c3aed] text-white text-xs font-bold rounded-xl p-2.5 focus:outline-none focus:border-[#a855f7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white mb-1">Sous-titre / Promesse</label>
              <textarea
                value={subtitleText}
                onChange={e => setSubtitleText(e.target.value)}
                rows={2}
                className="w-full bg-[#1a1535] border border-[#7c3aed]/60 text-white text-xs rounded-xl p-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-white">Bouton d'appel à l'action (CTA)</label>
                <input
                  type="checkbox"
                  checked={showCta}
                  onChange={e => setShowCta(e.target.checked)}
                  className="accent-[#7c3aed]"
                />
              </div>
              <input
                type="text"
                value={ctaText}
                onChange={e => setCtaText(e.target.value)}
                disabled={!showCta}
                className="w-full bg-[#1a1535] border border-[#7c3aed]/60 text-white text-xs rounded-xl p-2 disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* Right Canvas: Live Visual Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#0a0718] border-2 border-[#7c3aed]/40 rounded-2xl p-6 relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          {/* Interactive Canvas Rendering Box */}
          <div
            className="w-full max-w-lg rounded-2xl p-6 md:p-8 flex flex-col justify-between relative shadow-2xl transition-all duration-300 border-2"
            style={{
              backgroundColor: selectedTheme.bg,
              borderColor: selectedTheme.accent,
              aspectRatio: selectedFormat.id === 'vertical' ? '9/16' : (selectedFormat.id === 'square' ? '1/1' : '16/9'),
              maxHeight: '520px',
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: selectedTheme.accent }}
            />

            {/* Top Badge */}
            <div className="relative z-10 text-center">
              {showBadge && badgeText.trim() && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider border shadow-md"
                  style={{
                    backgroundColor: `${selectedTheme.accent}20`,
                    color: selectedTheme.accent,
                    borderColor: `${selectedTheme.accent}60`,
                    fontFamily: selectedFont.font,
                  }}
                >
                  {badgeText.toUpperCase()}
                </span>
              )}
            </div>

            {/* Middle Title & Subtitle */}
            <div
              className="relative z-10 space-y-3 my-auto"
              style={{ textAlign }}
            >
              <h1
                className="font-black leading-tight tracking-tight drop-shadow-md"
                style={{
                  fontSize: `${titleSize}px`,
                  color: selectedTheme.text,
                  fontFamily: selectedFont.font,
                }}
              >
                {uppercaseTitle ? titleText.toUpperCase() : titleText}
              </h1>

              {subtitleText.trim() && (
                <p
                  className="text-xs md:text-sm text-[#c4b5fd] max-w-md mx-auto leading-relaxed drop-shadow"
                  style={{ fontFamily: selectedFont.font }}
                >
                  {subtitleText}
                </p>
              )}
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 text-center pt-2">
              {showCta && ctaText.trim() && (
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xl hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: selectedTheme.accent,
                    fontFamily: selectedFont.font,
                  }}
                >
                  {ctaText}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-[#a78bfa] flex items-center gap-3">
            <span>Police active : <strong>{selectedFont.id}</strong></span>
            <span>·</span>
            <span>Format : <strong>{selectedFormat.name}</strong> ({selectedFormat.w}×{selectedFormat.h})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
