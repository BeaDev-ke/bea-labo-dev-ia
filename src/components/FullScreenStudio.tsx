import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Maximize2, 
  Minimize2, 
  Type, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Image as ImageIcon, 
  Layers, 
  Palette, 
  Upload, 
  Trash2, 
  Plus, 
  Check, 
  Sparkles,
  Smartphone,
  Square,
  LayoutGrid,
  Columns,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2
} from 'lucide-react';

interface FullScreenStudioProps {
  onBackToApp: () => void;
}

type FrameLayout = 
  | 'square'           // 1:1
  | 'vertical'         // 9:16 Reel / Story
  | 'landscape'        // 16:9 YouTube / Video
  | 'split_h'          // 2 photos côte à côte
  | 'split_v'          // 2 photos haut/bas
  | 'grid_4'           // 2x2
  | 'triptych'         // 3 photos verticales
  | 'smartphone'       // Mockup iPhone
  | 'polaroid';        // Style photo polaroid

interface FrameOption {
  id: FrameLayout;
  title: string;
  ratioLabel: string;
  aspectClass: string;
  slotsCount: number;
  description: string;
}

const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'square',
    title: 'Carré (1:1)',
    ratioLabel: 'Instagram & LinkedIn',
    aspectClass: 'aspect-square w-full max-w-[500px]',
    slotsCount: 1,
    description: 'Format standard universel pour publications et carrousels.'
  },
  {
    id: 'vertical',
    title: 'Vertical (9:16)',
    ratioLabel: 'TikTok, Reel & Short',
    aspectClass: 'aspect-[9/16] w-full max-w-[340px]',
    slotsCount: 1,
    description: 'Format plein écran smartphone pour vidéos et stories virales.'
  },
  {
    id: 'landscape',
    title: 'Paysage (16:9)',
    ratioLabel: 'YouTube & Bannière',
    aspectClass: 'aspect-video w-full max-w-[620px]',
    slotsCount: 1,
    description: 'Format panoramique idéal pour miniatures et présentations.'
  },
  {
    id: 'split_h',
    title: 'Split 2 Photos (Gauche / Droite)',
    ratioLabel: 'Comparatif 1:1',
    aspectClass: 'aspect-square w-full max-w-[500px]',
    slotsCount: 2,
    description: 'Deux images côte à côte pour les avant/après ou duos.'
  },
  {
    id: 'split_v',
    title: 'Split 2 Photos (Haut / Bas)',
    ratioLabel: 'Duo 9:16',
    aspectClass: 'aspect-[9/16] w-full max-w-[340px]',
    slotsCount: 2,
    description: 'Deux séquences superposées pour réagir ou comparer.'
  },
  {
    id: 'grid_4',
    title: 'Grille 4 Photos (2×2)',
    ratioLabel: 'Collage 1:1',
    aspectClass: 'aspect-square w-full max-w-[500px]',
    slotsCount: 4,
    description: 'Quatre cadrages symétriques pour résumer une collection.'
  },
  {
    id: 'triptych',
    title: 'Triptyque 3 Photos',
    ratioLabel: '3 Colonnes 16:9',
    aspectClass: 'aspect-video w-full max-w-[620px]',
    slotsCount: 3,
    description: 'Trois panneaux verticaux pour raconter une progression.'
  },
  {
    id: 'smartphone',
    title: 'Mockup Smartphone',
    ratioLabel: 'Écran Mobile',
    aspectClass: 'aspect-[9/18] w-full max-w-[300px]',
    slotsCount: 1,
    description: 'Cadre iPhone réaliste avec encoche dynamique.'
  },
  {
    id: 'polaroid',
    title: 'Polaroid Rétro',
    ratioLabel: 'Vintage Photo',
    aspectClass: 'aspect-[4/5] w-full max-w-[420px]',
    slotsCount: 1,
    description: 'Photo argentique avec bordure blanche épaisse en bas.'
  }
];

const FONTS = [
  { name: 'Inter (Moderne)', family: 'Inter, sans-serif' },
  { name: 'Montserrat (Gras & Impact)', family: 'Montserrat, sans-serif' },
  { name: 'Playfair Display (Élégant & Luxe)', family: 'Playfair Display, serif' },
  { name: 'Anton (Titre Fort)', family: 'Anton, sans-serif' },
  { name: 'Bebas Neue (Viral & Sport)', family: 'Bebas Neue, sans-serif' },
  { name: 'Poppins (Clair & Tech)', family: 'Poppins, sans-serif' },
  { name: 'Courier Prime (Machine à écrire)', family: 'Courier Prime, monospace' },
];

const QUICK_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#e2e8f0',
  '#cbd5e1',
  '#fbbf24',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#000000'
];

const BG_GRADIENTS = [
  { name: 'Violet Sombre Andrea', val: 'linear-gradient(135deg, #181135 0%, #201844 100%)' },
  { name: 'Nuit Noire Profonde', val: 'linear-gradient(180deg, #0f0d1a 0%, #151128 100%)' },
  { name: 'Émeraude & Nuit', val: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' },
  { name: 'Sunset Orange', val: 'linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)' },
  { name: 'Bleu Royal', val: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' },
  { name: 'Blanc Minimal', val: '#ffffff' },
  { name: 'Gris Studio', val: '#1e293b' },
];

export const FullScreenStudio: React.FC<FullScreenStudioProps> = ({ onBackToApp }) => {
  // Navigation & Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'frames' | 'text' | 'media' | 'background'>('frames');

  // Frame selection
  const [activeFrame, setActiveFrame] = useState<FrameLayout>('square');

  // Text formatting controls (EN HAUT)
  const [selectedFont, setSelectedFont] = useState(FONTS[0].family);
  const [fontSize, setFontSize] = useState(32);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState<'top' | 'middle' | 'bottom'>('bottom');
  
  // Text contents
  const [titleText, setTitleText] = useState('Votre grand titre ici');
  const [subtitleText, setSubtitleText] = useState('Ajoutez un sous-titre percutant pour accompagner votre visuel');
  const [badgeText, setBadgeText] = useState('NOUVEAU');
  const [showBadge, setShowBadge] = useState(true);
  const [showSubtitle, setShowSubtitle] = useState(true);

  // Background and appearance
  const [activeBg, setActiveBg] = useState(BG_GRADIENTS[0].val);
  const [borderRadius, setBorderRadius] = useState(20);
  const [overlayDarkness, setOverlayDarkness] = useState(40); // 0 to 100%

  // Photos loaded into the frame slots
  const [slotImages, setSlotImages] = useState<Record<number, string>>({});
  
  // Gallery of uploaded / preset images ready to drag or click
  const [uploadedMedias, setUploadedMedias] = useState<string[]>([
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Current frame config
  const currentFrameConfig = FRAME_OPTIONS.find(f => f.id === activeFrame) || FRAME_OPTIONS[0];

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Upload custom photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const url = loadEvt.target?.result as string;
        if (url) {
          setUploadedMedias(prev => [url, ...prev]);
          // Automatically assign to first empty slot
          setSlotImages(slots => {
            const emptyIndex = Array.from({ length: currentFrameConfig.slotsCount }).findIndex((_, idx) => !slots[idx]);
            const targetIdx = emptyIndex !== -1 ? emptyIndex : 0;
            return { ...slots, [targetIdx]: url };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Assign image to a specific slot
  const assignImageToSlot = (slotIndex: number, imgUrl: string) => {
    setSlotImages(prev => ({ ...prev, [slotIndex]: imgUrl }));
  };

  // Remove image from slot
  const removeSlotImage = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlotImages(prev => {
      const next = { ...prev };
      delete next[slotIndex];
      return next;
    });
  };

  // Trigger high resolution download
  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    let width = 1080;
    let height = 1080;

    if (activeFrame === 'vertical' || activeFrame === 'split_v') {
      width = 1080;
      height = 1920;
    } else if (activeFrame === 'landscape' || activeFrame === 'triptych') {
      width = 1920;
      height = 1080;
    } else if (activeFrame === 'smartphone') {
      width = 1080;
      height = 2160;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#181135';
    ctx.fillRect(0, 0, width, height);

    // If slot 0 has an image, render it
    const drawSlotImage = (imgSrc: string, x: number, y: number, w: number, h: number) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgSrc;
      img.onload = () => {
        ctx.drawImage(img, x, y, w, h);
        finalizeExport();
      };
      img.onerror = () => {
        finalizeExport();
      };
    };

    const finalizeExport = () => {
      // Draw text overlay
      ctx.fillStyle = `rgba(0,0,0,${overlayDarkness / 100})`;
      ctx.fillRect(0, 0, width, height);

      // Title
      ctx.fillStyle = textColor;
      ctx.font = `${isBold ? 'bold ' : ''}${isItalic ? 'italic ' : ''}${fontSize * 2}px ${selectedFont}`;
      ctx.textAlign = textAlign;

      const textX = textAlign === 'center' ? width / 2 : textAlign === 'left' ? 60 : width - 60;
      const textY = textPosition === 'top' ? 180 : textPosition === 'middle' ? height / 2 : height - 160;

      const renderedTitle = isUppercase ? titleText.toUpperCase() : titleText;
      ctx.fillText(renderedTitle, textX, textY);

      if (showSubtitle && subtitleText) {
        ctx.font = `normal ${Math.round(fontSize * 1.1)}px ${selectedFont}`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(subtitleText, textX, textY + 60);
      }

      // Download link
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `andrea_studio_${activeFrame}_${Date.now()}.png`;
      a.click();
    };

    if (slotImages[0]) {
      drawSlotImage(slotImages[0], 0, 0, width, height);
    } else {
      finalizeExport();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0919] text-[#f5f3ff] flex flex-col font-sans select-none overflow-hidden">
      {/* 1. TOP TOOLBAR - POLICE, TAILLE, GRAS, COULEURS & EXPORT (EN HAUT) */}
      <header className="h-16 bg-[#15102a] border-b border-[#5A33FF33] px-4 flex items-center justify-between gap-3 shrink-0 z-30 shadow-md">
        {/* Left: Back button & Document Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToApp}
            className="px-3 py-1.5 rounded-xl bg-[#201844] hover:bg-[#2a2057] text-white text-xs font-semibold flex items-center gap-1.5 border border-[#5A33FF44] transition shadow-sm"
            title="Quitter le studio plein écran et retourner à Andrea"
          >
            <ArrowLeft className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Studio Créateur Plein Écran</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Mode Créateur HD
              </span>
            </span>
            <span className="text-[10px] text-[#c4b5fd]">Glissez vos photos dans le cadre et formatez vos textes</span>
          </div>
        </div>

        {/* Center: Formatting tools (Police, Gras, Italique, Taille, Alignement) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2 bg-[#100c22] rounded-xl border border-[#5A33FF22]">
          {/* Police Font Dropdown */}
          <div className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-purple-400 shrink-0 hidden sm:block" />
            <select
              value={selectedFont}
              onChange={e => setSelectedFont(e.target.value)}
              className="bg-[#1b143c] border border-[#5A33FF44] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-400 max-w-[130px] sm:max-w-[170px]"
              title="Police de caractères"
            >
              {FONTS.map(f => (
                <option key={f.name} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-5 w-px bg-zinc-700 mx-0.5" />

          {/* Font Size controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFontSize(s => Math.max(16, s - 2))}
              className="w-7 h-7 rounded-lg bg-[#201844] hover:bg-[#2a2057] text-white text-xs font-bold flex items-center justify-center transition"
              title="Diminuer la taille"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-mono font-bold text-white">
              {fontSize}
            </span>
            <button
              onClick={() => setFontSize(s => Math.min(84, s + 2))}
              className="w-7 h-7 rounded-lg bg-[#201844] hover:bg-[#2a2057] text-white text-xs font-bold flex items-center justify-center transition"
              title="Augmenter la taille"
            >
              +
            </button>
          </div>

          <div className="h-5 w-px bg-zinc-700 mx-0.5" />

          {/* Bold, Italic, Underline, Uppercase */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsBold(!isBold)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                isBold ? 'bg-purple-600 text-white font-bold' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Gras (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                isItalic ? 'bg-purple-600 text-white' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Italique (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                isUnderline ? 'bg-purple-600 text-white' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Souligné (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsUppercase(!isUppercase)}
              className={`px-1.5 h-7 rounded-lg text-[10px] font-bold transition ${
                isUppercase ? 'bg-purple-600 text-white' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Majuscules"
            >
              TT
            </button>
          </div>

          <div className="h-5 w-px bg-zinc-700 mx-0.5" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTextAlign('left')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                textAlign === 'left' ? 'bg-purple-600 text-white' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Aligner à gauche"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                textAlign === 'center' ? 'bg-purple-600 text-white' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Centrer le texte"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                textAlign === 'right' ? 'bg-purple-600 text-white' : 'bg-[#201844] text-[#c4b5fd] hover:text-white'
              }`}
              title="Aligner à droite"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-5 w-px bg-zinc-700 mx-0.5" />

          {/* Text Color Picker */}
          <div className="flex items-center gap-1" title="Couleur du texte">
            <input
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
          </div>
        </div>

        {/* Right: Fullscreen & Download buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-xl bg-[#201844] hover:bg-[#2a2057] text-[#c4b5fd] hover:text-white border border-[#5A33FF44] flex items-center justify-center transition"
            title={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white text-xs font-bold transition flex items-center gap-2 shadow-lg hover:scale-105"
            title="Télécharger l'image en haute résolution PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Télécharger PNG HD</span>
          </button>
        </div>
      </header>

      {/* 2. BODY AREA: LEFT SIDEBAR (CANVA STYLE) + CENTER CANVAS */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT TOOLBAR TABS (CANVA STYLE: CADRES, TEXTE, MÉDIAS, COULEURS) */}
        <aside className="w-16 bg-[#110d24] border-r border-[#5A33FF22] flex flex-col items-center py-4 gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('frames')}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'frames'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Modèles de cadres où glisser vos photos"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[9px] font-bold">Cadres</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'text'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Textes, titres et accroches"
          >
            <Type className="w-5 h-5" />
            <span className="text-[9px] font-bold">Texte</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'media'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Importer ou glisser des photos"
          >
            <Upload className="w-5 h-5" />
            <span className="text-[9px] font-bold">Médias</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'background'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Fonds et ambiance"
          >
            <Palette className="w-5 h-5" />
            <span className="text-[9px] font-bold">Fond</span>
          </button>
        </aside>

        {/* EXPANDABLE LEFT PANEL - CHOIX DU CADRE / MÉDIAS / TEXTES */}
        <aside className="w-72 sm:w-80 bg-[#16112e] border-r border-[#5A33FF33] flex flex-col overflow-y-auto shrink-0 z-20 shadow-xl">
          {/* TAB 1: MODÈLES DE CADRES (CANVA STYLE) */}
          {activeTab === 'frames' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-purple-400" />
                  <span>Modèles de Cadres</span>
                </h3>
                <p className="text-xs text-[#c4b5fd] mt-1">
                  Choisissez un cadre, puis glissez vos photos dans chaque emplacement.
                </p>
              </div>

              <div className="space-y-2.5">
                {FRAME_OPTIONS.map(opt => {
                  const isSelected = activeFrame === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setActiveFrame(opt.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#231a4a] border-[#5A33FF] shadow-lg ring-1 ring-purple-500'
                          : 'bg-[#1b143c] border-[#5A33FF22] hover:bg-[#22184c] text-zinc-300 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{opt.title}</span>
                          {isSelected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Actif
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#c4b5fd]/80">{opt.ratioLabel}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1">{opt.description}</div>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-[#100c22] border border-[#5A33FF44] flex items-center justify-center shrink-0">
                        {opt.id === 'square' && <Square className="w-5 h-5 text-purple-400" />}
                        {opt.id === 'vertical' && <Smartphone className="w-5 h-5 text-purple-400" />}
                        {opt.id === 'landscape' && <Columns className="w-5 h-5 text-purple-400 rotate-90" />}
                        {opt.id === 'split_h' && <Columns className="w-5 h-5 text-purple-400" />}
                        {opt.id === 'split_v' && <Columns className="w-5 h-5 text-purple-400 rotate-90" />}
                        {opt.id === 'grid_4' && <LayoutGrid className="w-5 h-5 text-purple-400" />}
                        {opt.id === 'triptych' && <Columns className="w-5 h-5 text-purple-400" />}
                        {opt.id === 'smartphone' && <Smartphone className="w-5 h-5 text-purple-400" />}
                        {opt.id === 'polaroid' && <Square className="w-5 h-5 text-purple-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEXTES & ACCROCHES */}
          {activeTab === 'text' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Type className="w-4 h-4 text-purple-400" />
                  <span>Personnaliser les Textes</span>
                </h3>
                <p className="text-xs text-[#c4b5fd] mt-1">
                  Les polices et styles sélectionnés en haut s'appliquent immédiatement.
                </p>
              </div>

              {/* Titre principal */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Titre principal</label>
                <textarea
                  rows={2}
                  value={titleText}
                  onChange={e => setTitleText(e.target.value)}
                  className="w-full bg-[#1b143c] border border-[#5A33FF44] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                  placeholder="Écrivez votre titre..."
                />
              </div>

              {/* Sous-titre */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white">Sous-titre explicatif</label>
                  <button
                    onClick={() => setShowSubtitle(!showSubtitle)}
                    className="text-[10px] text-purple-300 hover:underline"
                  >
                    {showSubtitle ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                {showSubtitle && (
                  <textarea
                    rows={2}
                    value={subtitleText}
                    onChange={e => setSubtitleText(e.target.value)}
                    className="w-full bg-[#1b143c] border border-[#5A33FF44] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                    placeholder="Écrivez votre sous-titre..."
                  />
                )}
              </div>

              {/* Badge d'accroche */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white">Badge d'accroche</label>
                  <button
                    onClick={() => setShowBadge(!showBadge)}
                    className="text-[10px] text-purple-300 hover:underline"
                  >
                    {showBadge ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                {showBadge && (
                  <input
                    type="text"
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    className="w-full bg-[#1b143c] border border-[#5A33FF44] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                    placeholder="NOUVEAU, VIRAL, GUIDE..."
                  />
                )}
              </div>

              {/* Position du texte dans le cadre */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Position verticale du texte</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['top', 'middle', 'bottom'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => setTextPosition(pos)}
                      className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                        textPosition === pos
                          ? 'bg-[#5A33FF] text-white shadow'
                          : 'bg-[#1b143c] text-[#c4b5fd] hover:bg-[#231a4a]'
                      }`}
                    >
                      {pos === 'top' ? 'Haut' : pos === 'middle' ? 'Centre' : 'Bas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MÉDIAS & GLISSER-DÉPOSER */}
          {activeTab === 'media' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-purple-400" />
                  <span>Mes Médias & Photos</span>
                </h3>
                <p className="text-xs text-[#c4b5fd] mt-1">
                  Glissez-déposez des photos ou importez vos visuels depuis votre appareil.
                </p>
              </div>

              {/* Import button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Importer des photos</span>
                </button>
              </div>

              {/* Photos Gallery */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#c4b5fd] uppercase tracking-wider">
                  Galerie (Cliquez pour insérer) :
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedMedias.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        // Assign to first empty or slot 0
                        const emptyIdx = Array.from({ length: currentFrameConfig.slotsCount }).findIndex((_, i) => !slotImages[i]);
                        const target = emptyIdx !== -1 ? emptyIdx : 0;
                        assignImageToSlot(target, url);
                      }}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-[#5A33FF44] hover:border-purple-400 cursor-pointer shadow-md transition-all hover:scale-105"
                    >
                      <img src={url} alt={`media-${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                        Insérer
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COULEURS ET FONDS */}
          {activeTab === 'background' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span>Ambiance & Fond du Cadre</span>
                </h3>
              </div>

              {/* Predefined gradients */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white">Thèmes de fond</label>
                <div className="space-y-2">
                  {BG_GRADIENTS.map((bg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBg(bg.val)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition ${
                        activeBg === bg.val
                          ? 'border-purple-400 bg-[#231a4a]'
                          : 'border-[#5A33FF22] bg-[#1b143c] hover:bg-[#22184c]'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg shadow-inner shrink-0 border border-white/20"
                        style={{ background: bg.val }}
                      />
                      <span className="text-xs font-semibold text-white">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voile sombre pour lisibilité du texte */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Opacité du filtre sombre</span>
                  <span className="text-[#c4b5fd] font-mono">{overlayDarkness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={overlayDarkness}
                  onChange={e => setOverlayDarkness(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Coins arrondis */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Rayon des coins</span>
                  <span className="text-[#c4b5fd] font-mono">{borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={borderRadius}
                  onChange={e => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          )}
        </aside>

        {/* 3. CENTER WORKSPACE CANVAS (CANVA-LIKE INTERACTIVE PREVIEW) */}
        <main className="flex-1 bg-[#090714] p-4 sm:p-8 flex items-center justify-center overflow-auto relative">
          {/* Subtle background grid pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #5A33FF 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }} 
          />

          {/* Frame Container */}
          <div
            className={`relative transition-all duration-300 shadow-2xl overflow-hidden border border-[#5A33FF44] ${currentFrameConfig.aspectClass}`}
            style={{
              background: activeBg,
              borderRadius: activeFrame === 'smartphone' ? '36px' : `${borderRadius}px`
            }}
          >
            {/* Smartphone Mockup Notch */}
            {activeFrame === 'smartphone' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ml-auto mr-3" />
              </div>
            )}

            {/* SLOTS GRID ACCORDING TO FRAME LAYOUT */}
            <div className={`w-full h-full grid ${
              activeFrame === 'split_h' ? 'grid-cols-2' : 
              activeFrame === 'split_v' ? 'grid-rows-2' : 
              activeFrame === 'grid_4' ? 'grid-cols-2 grid-rows-2' : 
              activeFrame === 'triptych' ? 'grid-cols-3' : 
              'grid-cols-1'
            } gap-1.5 p-1.5 relative`}>
              {Array.from({ length: currentFrameConfig.slotsCount }).map((_, slotIdx) => {
                const img = slotImages[slotIdx];
                return (
                  <div
                    key={slotIdx}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const droppedUrl = e.dataTransfer.getData('text/plain');
                      if (droppedUrl) {
                        assignImageToSlot(slotIdx, droppedUrl);
                      }
                    }}
                    onClick={() => {
                      if (!img) fileInputRef.current?.click();
                    }}
                    className={`relative w-full h-full overflow-hidden rounded-xl bg-black/30 border border-white/10 flex flex-col items-center justify-center group ${
                      !img ? 'cursor-pointer hover:bg-black/50 border-dashed border-purple-500/50' : ''
                    }`}
                  >
                    {img ? (
                      <>
                        <img
                          src={img}
                          alt={`slot-${slotIdx}`}
                          className="w-full h-full object-cover select-none"
                        />
                        <button
                          onClick={e => removeSlotImage(slotIdx, e)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                          title="Supprimer la photo de cet emplacement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-3 space-y-1">
                        <ImageIcon className="w-8 h-8 text-[#8B70FF] mx-auto opacity-70" />
                        <span className="text-[11px] font-bold text-white block">
                          Glissez une photo
                        </span>
                        <span className="text-[9px] text-[#c4b5fd]">ou cliquez pour parcourir</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DARK OVERLAY FOR TEXT READABILITY */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity"
              style={{ background: `rgba(0,0,0,${overlayDarkness / 100})` }}
            />

            {/* TEXT OVERLAY LAYER */}
            <div className={`absolute inset-0 p-6 flex flex-col pointer-events-none ${
              textPosition === 'top' ? 'justify-start' : 
              textPosition === 'middle' ? 'justify-center' : 
              'justify-end'
            }`}>
              <div 
                className="space-y-2 pointer-events-auto max-w-full"
                style={{ textAlign }}
              >
                {/* Badge */}
                {showBadge && badgeText && (
                  <div>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md border"
                      style={{ 
                        background: 'rgba(90, 51, 255, 0.4)', 
                        borderColor: '#8B70FF',
                        color: '#ffffff'
                      }}
                    >
                      {badgeText}
                    </span>
                  </div>
                )}

                {/* Main Title */}
                <h2
                  className="leading-tight drop-shadow-lg break-words transition-all"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize}px`,
                    fontWeight: isBold ? 800 : 400,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: isUnderline ? 'underline' : 'none',
                    color: textColor
                  }}
                >
                  {isUppercase ? titleText.toUpperCase() : titleText}
                </h2>

                {/* Subtitle */}
                {showSubtitle && subtitleText && (
                  <p 
                    className="text-white/90 drop-shadow break-words transition-all max-w-xl mx-auto"
                    style={{
                      fontFamily: selectedFont,
                      fontSize: `${Math.max(12, Math.round(fontSize * 0.45))}px`,
                      fontStyle: isItalic ? 'italic' : 'normal'
                    }}
                  >
                    {subtitleText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
