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
  Sliders,
  Volume2,
  VolumeX,
  Subtitles,
  Flame,
  Star,
  Play,
  Copy,
  Eye,
  Sun,
  Wand2
} from 'lucide-react';

interface FullScreenStudioProps {
  onBackToApp: () => void;
}

export type FrameLayout = 
  | 'square'           // 1:1 Carré universel
  | 'vertical'         // 9:16 Vertical plein écran
  | 'landscape'        // 16:9 Format large
  | 'portrait'         // 4:5 Portrait vertical
  | 'split_h'          // 2 photos côte à côte
  | 'split_v'          // 2 photos haut/bas
  | 'grid_4'           // 2x2 collage
  | 'triptych'         // 3 colonnes
  | 'smartphone';      // Mockup smartphone

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
    id: 'vertical',
    title: 'Format Mobile Plein Écran (9:16)',
    ratioLabel: 'Vertical HD (1080×1920)',
    aspectClass: 'aspect-[9/16] w-full max-w-[340px]',
    slotsCount: 1,
    description: 'Format immersif pour téléphones et vidéos verticales.'
  },
  {
    id: 'square',
    title: 'Format Carré Universel (1:1)',
    ratioLabel: 'Carré HD (1080×1080)',
    aspectClass: 'aspect-square w-full max-w-[480px]',
    slotsCount: 1,
    description: 'Format polyvalent pour publications, carrousels et fiches produit.'
  },
  {
    id: 'portrait',
    title: 'Format Portrait Élargi (4:5)',
    ratioLabel: 'Portrait HD (1080×1350)',
    aspectClass: 'aspect-[4/5] w-full max-w-[400px]',
    slotsCount: 1,
    description: 'Occupe un espace optimal sur le fil de lecture sans défilement excessif.'
  },
  {
    id: 'landscape',
    title: 'Format Grand Écran (16:9)',
    ratioLabel: 'Panoramique HD (1920×1080)',
    aspectClass: 'aspect-video w-full max-w-[620px]',
    slotsCount: 1,
    description: 'Format large idéal pour présentations, bannières et vidéos horizontales.'
  },
  {
    id: 'split_h',
    title: 'Duo 2 Photos (Gauche / Droite)',
    ratioLabel: 'Comparatif 1:1',
    aspectClass: 'aspect-square w-full max-w-[480px]',
    slotsCount: 2,
    description: 'Deux images côte à côte pour les comparatifs avant / après ou duo de styles.'
  },
  {
    id: 'split_v',
    title: 'Duo 2 Photos (Haut / Bas)',
    ratioLabel: 'Duo Vertical 9:16',
    aspectClass: 'aspect-[9/16] w-full max-w-[340px]',
    slotsCount: 2,
    description: 'Deux séquences superposées pour réagir, contraster ou raconter deux étapes.'
  },
  {
    id: 'grid_4',
    title: 'Grille 4 Photos (2×2)',
    ratioLabel: 'Collage 1:1',
    aspectClass: 'aspect-square w-full max-w-[480px]',
    slotsCount: 4,
    description: 'Quatre cadrages symétriques pour résumer une collection ou un événement.'
  },
  {
    id: 'triptych',
    title: 'Triptyque 3 Colonnes',
    ratioLabel: 'Panoramique 16:9',
    aspectClass: 'aspect-video w-full max-w-[620px]',
    slotsCount: 3,
    description: 'Trois panneaux verticaux pour raconter une progression pas à pas.'
  },
  {
    id: 'smartphone',
    title: 'Mockup Smartphone Réaliste',
    ratioLabel: 'Écran Mobile Intégré',
    aspectClass: 'aspect-[9/18] w-full max-w-[300px]',
    slotsCount: 1,
    description: 'Cadre smartphone avec contour métallique et encoche d\'écran.'
  },
];

const FONTS = [
  { name: 'Impact / Moderne', family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { name: 'Géométrique (Sans)', family: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Élégant / Serif', family: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { name: 'Code / Monospace', family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
];

const BG_GRADIENTS = [
  { name: 'Nuit Violette', val: 'linear-gradient(135deg, #16112e 0%, #0d0a1a 100%)' },
  { name: 'Électrique Andrea', val: 'linear-gradient(135deg, #1E1B8C 0%, #5A33FF 100%)' },
  { name: 'Noir Pur & Charbon', val: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)' },
  { name: 'Néon Cyan', val: 'linear-gradient(135deg, #0e7490 0%, #1e1b4b 100%)' },
  { name: 'Lumière Ambre', val: 'linear-gradient(135deg, #b45309 0%, #311005 100%)' },
  { name: 'Émeraude Sombre', val: 'linear-gradient(135deg, #065f46 0%, #022c22 100%)' },
  { name: 'Blanc Minimal', val: '#ffffff' },
  { name: 'Gris Studio', val: '#1e293b' },
];

// Subtitle styles
type SubtitleStyle = 'impact_yellow' | 'black_box' | 'neon_cyber' | 'gradient_sunset' | 'minimal_white';

// Hook generator presets
const VIRAL_HOOKS = [
  "Personne ne vous dit ça sur...",
  "Arrêtez de faire cette erreur en 2026 !",
  "3 astuces méconnues qui changent tout :",
  "Voici exactement comment j'ai réussi à...",
  "Le secret que la plupart ignorent :",
  "Avant / Après résultat concret :"
];

// Sticker options
const STICKER_PRESETS = [
  { label: '🔥 100% GRATUIT', color: 'from-amber-500 to-red-600' },
  { label: '⚡ NOUVEAU', color: 'from-blue-600 to-indigo-700' },
  { label: '👉 SWIPE ➔', color: 'from-purple-600 to-pink-600' },
  { label: '⭐ RECOMMANDÉ', color: 'from-emerald-600 to-teal-800' },
  { label: '🚨 OFFRE DU JOUR', color: 'from-rose-600 to-red-700' },
  { label: '🎧 ÉCOUTER L\'ÉPISODE', color: 'from-violet-600 to-purple-800' },
  { label: '💡 ASTUCE DU JOUR', color: 'from-cyan-600 to-blue-700' },
  { label: '💬 DONNE TON AVIS', color: 'from-zinc-700 to-zinc-900' }
];

export const FullScreenStudio: React.FC<FullScreenStudioProps> = ({ onBackToApp }) => {
  // Navigation & Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'frames' | 'captions' | 'filters' | 'stickers' | 'audio' | 'text' | 'media' | 'background'>('frames');

  // Frame selection
  const [activeFrame, setActiveFrame] = useState<FrameLayout>('vertical');

  // Text formatting controls (EN HAUT)
  const [selectedFont, setSelectedFont] = useState(FONTS[0].family);
  const [fontSize, setFontSize] = useState(28);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textPosition, setTextPosition] = useState<'top' | 'middle' | 'bottom'>('bottom');
  
  // Text contents
  const [titleText, setTitleText] = useState('Comment doubler votre clarté mentale');
  const [subtitleText, setSubtitleText] = useState('3 règles psychologiques appliquées au quotidien');
  const [showSubtitle, setShowSubtitle] = useState(true);

  // Captions / Subtitles (CapCut style)
  const [captionStyle, setCaptionStyle] = useState<SubtitleStyle>('impact_yellow');
  const [captionHighlight, setCaptionHighlight] = useState<'none' | 'word' | 'pulse' | 'box'>('word');
  const [captionText, setCaptionText] = useState('LE SECRET QUE PERSONNE NE PARTAGE');
  const [showCaption, setShowCaption] = useState(true);

  // Filters & Adjustments (CapCut style)
  const [brightness, setBrightness] = useState(100); // 50 to 150
  const [contrast, setContrast] = useState(105);   // 50 to 150
  const [saturation, setSaturation] = useState(115); // 0 to 200
  const [blurAmount, setBlurAmount] = useState(0);    // 0 to 10
  const [temperature, setTemperature] = useState(0);  // -50 (cold cyan) to +50 (warm amber)
  const [vignette, setVignette] = useState(25);       // 0 to 80%

  // Stickers & Overlays
  const [selectedStickers, setSelectedStickers] = useState<string[]>(['🔥 100% GRATUIT']);
  const [stickerPosition, setStickerPosition] = useState<'top-left' | 'top-right' | 'bottom-center' | 'center'>('top-right');

  // Background and appearance
  const [activeBg, setActiveBg] = useState(BG_GRADIENTS[0].val);
  const [borderRadius, setBorderRadius] = useState(24);

  // Photos loaded into the frame slots
  const [slotImages, setSlotImages] = useState<Record<number, string>>({
    0: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
  });
  
  // Gallery of uploaded / preset images
  const [uploadedMedias, setUploadedMedias] = useState<string[]>([
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80'
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [audioFeedback, setAudioFeedback] = useState<string | null>(null);

  // Current frame config
  const currentFrameConfig = FRAME_OPTIONS.find(f => f.id === activeFrame) || FRAME_OPTIONS[0];

  // Synthesize Web Audio SFX (Zero external network dependencies, instant)
  const playSfx = (type: 'whoosh' | 'pop' | 'click' | 'ding' | 'boom') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      if (type === 'whoosh') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.28);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        setAudioFeedback('Effet Whoosh joué');
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        setAudioFeedback('Effet Pop joué');
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        setAudioFeedback('Effet Clic joué');
      } else if (type === 'ding') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now); // C6
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
        setAudioFeedback('Effet Ding Succès joué');
      } else if (type === 'boom') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        setAudioFeedback('Effet Impact Boom joué');
      }
      setTimeout(() => setAudioFeedback(null), 2000);
    } catch {
      // Audio not permitted or supported
    }
  };

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
    setSlotImages(prev => ({
      ...prev,
      [slotIndex]: imgUrl
    }));
    playSfx('pop');
  };

  // Remove photo from slot
  const removeSlotImage = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlotImages(prev => {
      const copy = { ...prev };
      delete copy[slotIndex];
      return copy;
    });
  };

  // Reset visual adjustments
  const resetFilters = () => {
    setBrightness(100);
    setContrast(105);
    setSaturation(115);
    setBlurAmount(0);
    setTemperature(0);
    setVignette(25);
  };

  // Apply one-click filter preset
  const applyFilterPreset = (preset: 'cinema' | 'bw' | 'cyber' | 'warm' | 'cool') => {
    if (preset === 'cinema') {
      setBrightness(95);
      setContrast(120);
      setSaturation(110);
      setTemperature(15);
      setVignette(45);
    } else if (preset === 'bw') {
      setBrightness(105);
      setContrast(140);
      setSaturation(0);
      setTemperature(0);
      setVignette(30);
    } else if (preset === 'cyber') {
      setBrightness(100);
      setContrast(130);
      setSaturation(160);
      setTemperature(-25);
      setVignette(35);
    } else if (preset === 'warm') {
      setBrightness(105);
      setContrast(110);
      setSaturation(125);
      setTemperature(35);
      setVignette(20);
    } else if (preset === 'cool') {
      setBrightness(100);
      setContrast(115);
      setSaturation(90);
      setTemperature(-40);
      setVignette(25);
    }
    playSfx('click');
  };

  // Toggle a sticker overlay
  const toggleSticker = (label: string) => {
    setSelectedStickers(prev => 
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
    playSfx('pop');
  };

  // High-Resolution PNG Download
  const handleExportHD = async () => {
    try {
      const canvas = document.createElement('canvas');
      let width = 1080;
      let height = 1080;

      if (activeFrame === 'vertical') {
        width = 1080;
        height = 1920;
      } else if (activeFrame === 'landscape') {
        width = 1920;
        height = 1080;
      } else if (activeFrame === 'portrait') {
        width = 1080;
        height = 1350;
      } else if (activeFrame === 'smartphone') {
        width = 1080;
        height = 2160;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#0f0c20';
      ctx.fillRect(0, 0, width, height);

      // Draw active background gradient or color
      if (activeBg.startsWith('linear-gradient')) {
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (activeBg.includes('#1E1B8C')) {
          grad.addColorStop(0, '#1E1B8C');
          grad.addColorStop(1, '#5A33FF');
        } else if (activeBg.includes('#09090b')) {
          grad.addColorStop(0, '#09090b');
          grad.addColorStop(1, '#18181b');
        } else if (activeBg.includes('#b45309')) {
          grad.addColorStop(0, '#b45309');
          grad.addColorStop(1, '#311005');
        } else {
          grad.addColorStop(0, '#16112e');
          grad.addColorStop(1, '#0d0a1a');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = activeBg;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw first slot image if available
      const primaryImgSrc = slotImages[0];
      if (primaryImgSrc) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = primaryImgSrc;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          // Draw scaled
          ctx.drawImage(img, 0, 0, width, height * 0.78);
        } catch {
          // Continue if image fails crossOrigin
        }
      }

      // Dark bottom gradient for readable text
      const darkGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      darkGrad.addColorStop(0, 'rgba(0,0,0,0)');
      darkGrad.addColorStop(1, 'rgba(0,0,0,0.92)');
      ctx.fillStyle = darkGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.55);

      // Vignette effect if enabled
      if (vignette > 0) {
        const vigGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.7);
        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vigGrad.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Subtitle / Dynamic Caption
      if (showCaption && captionText) {
        ctx.textAlign = 'center';
        if (captionStyle === 'impact_yellow') {
          ctx.font = `900 ${Math.round(width * 0.045)}px Impact, system-ui, sans-serif`;
          ctx.fillStyle = '#000000';
          ctx.fillText(captionText.toUpperCase(), width / 2 + 3, height * 0.65 + 3);
          ctx.fillStyle = '#facc15';
          ctx.fillText(captionText.toUpperCase(), width / 2, height * 0.65);
        } else {
          ctx.font = `bold ${Math.round(width * 0.04)}px system-ui, sans-serif`;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(captionText, width / 2, height * 0.65);
        }
      }

      // Draw Main Title
      ctx.font = `${isBold ? 'bold' : 'normal'} ${Math.round(width * (fontSize / 700))}px system-ui, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign;
      const targetX = textAlign === 'center' ? width / 2 : (textAlign === 'left' ? width * 0.08 : width * 0.92);
      ctx.fillText(isUppercase ? titleText.toUpperCase() : titleText, targetX, height * 0.82);

      // Draw Subtitle Text
      if (showSubtitle && subtitleText) {
        ctx.font = `normal ${Math.round(width * 0.026)}px system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(subtitleText, targetX, height * 0.88);
      }

      // Draw Stickers / Badges
      if (selectedStickers.length > 0) {
        const badge = selectedStickers[0];
        ctx.font = `bold ${Math.round(width * 0.028)}px system-ui, sans-serif`;
        ctx.fillStyle = '#5A33FF';
        const badgeWidth = ctx.measureText(badge).width + 36;
        const badgeX = width * 0.08;
        const badgeY = height * 0.06;
        ctx.fillRect(badgeX, badgeY - 24, badgeWidth, 40);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(badge, badgeX + 18, badgeY + 4);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `andrea-creation-${activeFrame}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      playSfx('ding');
    } catch {
      // Export failed
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090714] text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. TOP HEADER TOOLBAR: TYPOGRAPHY & CONTROLS */}
      <header className="h-16 bg-[#110d24] border-b border-[#5A33FF33] px-3 sm:px-6 flex items-center justify-between gap-2 z-30 shrink-0 shadow-lg">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#201844] hover:bg-[#2e2363] text-[#c4b5fd] hover:text-white transition text-xs font-semibold"
            title="Revenir sur l'application Andrea"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Quitter Studio</span>
          </button>
          
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#1E1B8C] to-[#5A33FF] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-bold leading-tight">Studio Créateur Plein Écran</div>
              <div className="text-[10px] text-purple-300">Outils de composition & sous-titres visuels</div>
            </div>
          </div>
        </div>

        {/* Center: Top Typography & Text Editing Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 px-2 bg-[#171131] rounded-xl border border-white/5 max-w-full">
          {/* Font selector */}
          <select
            value={selectedFont}
            onChange={e => setSelectedFont(e.target.value)}
            className="bg-[#241a4d] text-white text-xs rounded-lg px-2 py-1.5 border border-purple-500/30 focus:outline-none focus:border-purple-400"
            title="Police de caractères"
          >
            {FONTS.map(f => (
              <option key={f.name} value={f.family}>{f.name}</option>
            ))}
          </select>

          {/* Font size */}
          <div className="flex items-center gap-1 bg-[#241a4d] rounded-lg px-1.5 py-0.5 border border-purple-500/30">
            <button
              onClick={() => setFontSize(s => Math.max(14, s - 2))}
              className="px-1.5 text-xs text-purple-200 hover:text-white font-bold"
              title="Réduire la taille"
            >
              -
            </button>
            <span className="text-xs font-mono w-6 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(s => Math.min(64, s + 2))}
              className="px-1.5 text-xs text-purple-200 hover:text-white font-bold"
              title="Agrandir la taille"
            >
              +
            </button>
          </div>

          <div className="h-5 w-px bg-white/10" />

          {/* Bold, Italic, Underline */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsBold(b => !b)}
              className={`p-1.5 rounded-lg text-xs transition ${isBold ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="Gras"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsItalic(i => !i)}
              className={`p-1.5 rounded-lg text-xs transition ${isItalic ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="Italique"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsUnderline(u => !u)}
              className={`p-1.5 rounded-lg text-xs transition ${isUnderline ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="Souligné"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsUppercase(u => !u)}
              className={`px-1.5 py-1 rounded-lg text-[10px] font-bold transition ${isUppercase ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="MAJUSCULES"
            >
              AA
            </button>
          </div>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Alignment */}
          <div className="hidden sm:flex items-center gap-0.5">
            <button
              onClick={() => setTextAlign('left')}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'left' ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="Aligner à gauche"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'center' ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="Centrer"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'right' ? 'bg-[#5A33FF] text-white' : 'text-purple-300 hover:bg-white/5'}`}
              title="Aligner à droite"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="color"
              value={textColor}
              onChange={e => setTextColor(e.target.value)}
              className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0"
              title="Couleur du texte"
            />
          </div>
        </div>

        {/* Right: Zoom, Fullscreen & Export */}
        <div className="flex items-center gap-2 shrink-0">
          {audioFeedback && (
            <span className="hidden lg:inline text-[11px] text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-500/30">
              {audioFeedback}
            </span>
          )}

          <div className="hidden xl:flex items-center gap-1 bg-[#1c153b] rounded-lg p-0.5 border border-white/5">
            <button
              onClick={() => setZoomScale(z => Math.max(0.6, z - 0.1))}
              className="p-1.5 text-purple-200 hover:text-white"
              title="Dézoomer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale(z => Math.min(1.4, z + 0.1))}
              className="p-1.5 text-purple-200 hover:text-white"
              title="Zoomer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#201844] hover:bg-[#2e2363] text-purple-300 hover:text-white transition"
            title={isFullscreen ? 'Quitter plein écran' : 'Passer en plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportHD}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2e2363] hover:to-[#744ffc] text-white text-xs font-bold shadow-lg transition"
            title="Télécharger l'image en haute résolution PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter PNG HD</span>
          </button>
        </div>
      </header>

      {/* 2. BODY AREA: LEFT TOOLBAR TABS + SIDEBAR CONTROLS + CENTER CANVAS */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT TOOLBAR TABS (CAPCUT & STUDIO STYLE) */}
        <aside className="w-16 sm:w-20 bg-[#110d24] border-r border-[#5A33FF22] flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          <button
            onClick={() => setActiveTab('frames')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'frames'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Modèles de cadres où glisser vos photos"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[9px] font-bold">Cadres</span>
          </button>

          <button
            onClick={() => setActiveTab('captions')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'captions'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Sous-titres dynamiques & Accroches rapides"
          >
            <Subtitles className="w-4 h-4" />
            <span className="text-[9px] font-bold">Sous-titres</span>
          </button>

          <button
            onClick={() => setActiveTab('filters')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'filters'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Filtres, luminosité, contraste et effets cinéma"
          >
            <Sliders className="w-4 h-4" />
            <span className="text-[9px] font-bold">Filtres</span>
          </button>

          <button
            onClick={() => setActiveTab('stickers')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'stickers'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Badges d'urgence et stickers graphiques"
          >
            <Flame className="w-4 h-4" />
            <span className="text-[9px] font-bold">Éléments</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'audio'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Effets sonores (SFX) & transitions audio"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-[9px] font-bold">Audio SFX</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'text'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Titre et descriptions textuelles"
          >
            <Type className="w-4 h-4" />
            <span className="text-[9px] font-bold">Texte</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'media'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Importer ou glisser des photos"
          >
            <Upload className="w-4 h-4" />
            <span className="text-[9px] font-bold">Médias</span>
          </button>

          <button
            onClick={() => setActiveTab('background')}
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'background'
                ? 'bg-gradient-to-b from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
            title="Fonds et ambiance"
          >
            <Palette className="w-4 h-4" />
            <span className="text-[9px] font-bold">Fond</span>
          </button>
        </aside>

        {/* EXPANDABLE LEFT PANEL - COMMANDES CONTEXTUELLES */}
        <aside className="w-72 sm:w-80 bg-[#16112e] border-r border-[#5A33FF33] flex flex-col overflow-y-auto shrink-0 z-20 shadow-xl">
          
          {/* TAB 1: MODÈLES DE CADRES (SANS NOMS DE MARQUES) */}
          {activeTab === 'frames' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Modèles de Cadres
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Choisissez la disposition puis glissez vos photos dans les cases.
                </p>
              </div>

              <div className="space-y-2">
                {FRAME_OPTIONS.map(frame => {
                  const isSelected = activeFrame === frame.id;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => {
                        setActiveFrame(frame.id);
                        playSfx('click');
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#291f58] border-[#5A33FF] shadow-md ring-1 ring-[#5A33FF]'
                          : 'bg-[#1b143a] border-white/5 hover:border-purple-500/40 hover:bg-[#211846]'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#110d24] flex items-center justify-center shrink-0 border border-white/10 text-purple-300">
                        {frame.id === 'vertical' && <Smartphone className="w-5 h-5 text-amber-400" />}
                        {frame.id === 'square' && <Square className="w-4 h-4 text-purple-400" />}
                        {frame.id === 'portrait' && <Columns className="w-4 h-4 text-blue-400 rotate-90" />}
                        {frame.id === 'landscape' && <Columns className="w-4 h-4 text-emerald-400" />}
                        {frame.id === 'split_h' && <Columns className="w-4 h-4 text-pink-400" />}
                        {frame.id === 'split_v' && <Columns className="w-4 h-4 text-cyan-400 rotate-90" />}
                        {frame.id === 'grid_4' && <LayoutGrid className="w-4 h-4 text-yellow-400" />}
                        {frame.id === 'triptych' && <Columns className="w-4 h-4 text-indigo-400" />}
                        {frame.id === 'smartphone' && <Smartphone className="w-5 h-5 text-purple-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{frame.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-purple-300 font-semibold mt-0.5">{frame.ratioLabel}</div>
                        <div className="text-[10px] text-zinc-400 leading-tight mt-1">{frame.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SOUS-TITRES & LÉGENDES DYNAMIQUES */}
          {activeTab === 'captions' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <Subtitles className="w-3.5 h-3.5" />
                  Sous-titres & Accroches
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Styles de sous-titres à fort taux de rétention visuelle.
                </p>
              </div>

              {/* Toggle caption display */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1b143a] border border-white/5">
                <span className="text-xs font-medium">Afficher le sous-titre dynamique</span>
                <input
                  type="checkbox"
                  checked={showCaption}
                  onChange={e => setShowCaption(e.target.checked)}
                  className="rounded accent-[#5A33FF] w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Caption text */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Texte du sous-titre / Punchline</label>
                <textarea
                  value={captionText}
                  onChange={e => setCaptionText(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1b143a] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#5A33FF]"
                  placeholder="Écrivez le mot clé ou la phrase choc..."
                />
              </div>

              {/* Style Presets */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-2">Style Visuel de la Légende</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { setCaptionStyle('impact_yellow'); playSfx('pop'); }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      captionStyle === 'impact_yellow' ? 'bg-[#291f58] border-yellow-400' : 'bg-[#1b143a] border-white/5'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-yellow-400 uppercase tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        JAUNE IMPACT
                      </div>
                      <div className="text-[10px] text-zinc-400">Police grasse, contraste maximal</div>
                    </div>
                    {captionStyle === 'impact_yellow' && <Check className="w-4 h-4 text-yellow-400" />}
                  </button>

                  <button
                    onClick={() => { setCaptionStyle('black_box'); playSfx('pop'); }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      captionStyle === 'black_box' ? 'bg-[#291f58] border-purple-400' : 'bg-[#1b143a] border-white/5'
                    }`}
                  >
                    <div>
                      <div className="inline-block bg-black/90 text-white font-bold text-xs px-2 py-0.5 rounded border border-white/20">
                        BOÎTE NOIRE ÉLÉGANTE
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1">Bandeau sombre très lisible</div>
                    </div>
                    {captionStyle === 'black_box' && <Check className="w-4 h-4 text-purple-400" />}
                  </button>

                  <button
                    onClick={() => { setCaptionStyle('neon_cyber'); playSfx('pop'); }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      captionStyle === 'neon_cyber' ? 'bg-[#291f58] border-cyan-400' : 'bg-[#1b143a] border-white/5'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-cyan-300 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                        NÉON CYBER
                      </div>
                      <div className="text-[10px] text-zinc-400">Halo lumineux percutant</div>
                    </div>
                    {captionStyle === 'neon_cyber' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <button
                    onClick={() => { setCaptionStyle('gradient_sunset'); playSfx('pop'); }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      captionStyle === 'gradient_sunset' ? 'bg-[#291f58] border-rose-400' : 'bg-[#1b143a] border-white/5'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                        DÉGRADÉ SUNSET
                      </div>
                      <div className="text-[10px] text-zinc-400">Ambiance moderne et chaleureuse</div>
                    </div>
                    {captionStyle === 'gradient_sunset' && <Check className="w-4 h-4 text-rose-400" />}
                  </button>
                </div>
              </div>

              {/* 1-Click Viral Hook Presets */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-2 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  Accroches Rapides (1 Clic)
                </label>
                <div className="space-y-1.5">
                  {VIRAL_HOOKS.map((hook, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCaptionText(hook);
                        playSfx('pop');
                      }}
                      className="w-full text-left p-2 rounded-lg bg-[#1b143a] hover:bg-[#251a50] border border-white/5 text-[11px] text-purple-200 hover:text-white transition truncate"
                      title="Insérer cette accroche"
                    >
                      "{hook}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FILTRES & RÉGLAGES D'IMAGE */}
          {activeTab === 'filters' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                    <Sliders className="w-3.5 h-3.5" />
                    Filtres & Ajustements
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Ajustez l'éclairage et la colorimétrie en direct.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="p-1.5 rounded-lg bg-[#1b143a] hover:bg-[#2a1e5a] text-zinc-400 hover:text-white text-[10px]"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 1-Click Presets */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1.5">Presets Colorimétriques</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => applyFilterPreset('cinema')}
                    className="p-2 rounded-lg bg-[#1b143a] hover:bg-[#281d54] border border-white/5 text-[10px] font-bold text-amber-300"
                  >
                    🎬 Cinéma Contrasté
                  </button>
                  <button
                    onClick={() => applyFilterPreset('bw')}
                    className="p-2 rounded-lg bg-[#1b143a] hover:bg-[#281d54] border border-white/5 text-[10px] font-bold text-zinc-200"
                  >
                    🖤 Noir & Blanc Pur
                  </button>
                  <button
                    onClick={() => applyFilterPreset('cyber')}
                    className="p-2 rounded-lg bg-[#1b143a] hover:bg-[#281d54] border border-white/5 text-[10px] font-bold text-cyan-300"
                  >
                    ⚡ Cyber Néon
                  </button>
                  <button
                    onClick={() => applyFilterPreset('warm')}
                    className="p-2 rounded-lg bg-[#1b143a] hover:bg-[#281d54] border border-white/5 text-[10px] font-bold text-orange-300"
                  >
                    ☀️ Chaleur Dorée
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-300">Luminosité</span>
                    <span className="font-mono text-purple-300">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={e => setBrightness(Number(e.target.value))}
                    className="w-full accent-[#5A33FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-300">Contraste</span>
                    <span className="font-mono text-purple-300">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={contrast}
                    onChange={e => setContrast(Number(e.target.value))}
                    className="w-full accent-[#5A33FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-300">Saturation des Couleurs</span>
                    <span className="font-mono text-purple-300">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={e => setSaturation(Number(e.target.value))}
                    className="w-full accent-[#5A33FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-300">Flou d'Arrière-Plan</span>
                    <span className="font-mono text-purple-300">{blurAmount} px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={blurAmount}
                    onChange={e => setBlurAmount(Number(e.target.value))}
                    className="w-full accent-[#5A33FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-300">Température (Chaud / Froid)</span>
                    <span className="font-mono text-purple-300">{temperature > 0 ? `+${temperature}` : temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={temperature}
                    onChange={e => setTemperature(Number(e.target.value))}
                    className="w-full accent-[#5A33FF] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-300">Vignettage Bords Sombres</span>
                    <span className="font-mono text-purple-300">{vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={vignette}
                    onChange={e => setVignette(Number(e.target.value))}
                    className="w-full accent-[#5A33FF] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STICKERS & BADGES D'URGENCE */}
          {activeTab === 'stickers' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  Badges & Éléments
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Cliquez sur un élément pour l'insérer sur votre composition.
                </p>
              </div>

              {/* Sticker Position */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Emplacement du badge</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setStickerPosition('top-left')}
                    className={`p-2 rounded-lg text-[10px] font-semibold border ${stickerPosition === 'top-left' ? 'bg-[#291f58] border-purple-400' : 'bg-[#1b143a] border-white/5'}`}
                  >
                    Haut Gauche
                  </button>
                  <button
                    onClick={() => setStickerPosition('top-right')}
                    className={`p-2 rounded-lg text-[10px] font-semibold border ${stickerPosition === 'top-right' ? 'bg-[#291f58] border-purple-400' : 'bg-[#1b143a] border-white/5'}`}
                  >
                    Haut Droite
                  </button>
                  <button
                    onClick={() => setStickerPosition('center')}
                    className={`p-2 rounded-lg text-[10px] font-semibold border ${stickerPosition === 'center' ? 'bg-[#291f58] border-purple-400' : 'bg-[#1b143a] border-white/5'}`}
                  >
                    Centre
                  </button>
                  <button
                    onClick={() => setStickerPosition('bottom-center')}
                    className={`p-2 rounded-lg text-[10px] font-semibold border ${stickerPosition === 'bottom-center' ? 'bg-[#291f58] border-purple-400' : 'bg-[#1b143a] border-white/5'}`}
                  >
                    Bas Centre
                  </button>
                </div>
              </div>

              {/* Badges List */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Badges prêts à l'emploi</label>
                {STICKER_PRESETS.map((sticker, idx) => {
                  const isActive = selectedStickers.includes(sticker.label);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleSticker(sticker.label)}
                      className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                        isActive
                          ? 'bg-[#291f58] border-purple-400 shadow'
                          : 'bg-[#1b143a] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{sticker.label}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sticker.color}`} />
                        {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: AUDIO SFX & TRANSITIONS SONORES */}
          {activeTab === 'audio' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <Volume2 className="w-3.5 h-3.5" />
                  Effets Sonores (SFX)
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Sons synthétisés en direct pour vos repères de montage et transitions.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#1b143a] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Whoosh / Transition Rapide</div>
                    <div className="text-[10px] text-zinc-400">Idéal lors des apparitions de texte</div>
                  </div>
                  <button
                    onClick={() => playSfx('whoosh')}
                    className="p-2.5 rounded-xl bg-[#5A33FF] hover:bg-[#6c48ff] text-white shadow-md transition"
                    title="Écouter le son"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#1b143a] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Bulle Pop / Nouveau Badge</div>
                    <div className="text-[10px] text-zinc-400">Bruit sec et satisfaisant d'apparition</div>
                  </div>
                  <button
                    onClick={() => playSfx('pop')}
                    className="p-2.5 rounded-xl bg-[#5A33FF] hover:bg-[#6c48ff] text-white shadow-md transition"
                    title="Écouter le son"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#1b143a] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Clic Clavier / Machine à écrire</div>
                    <div className="text-[10px] text-zinc-400">Rythme d'écriture lettre par lettre</div>
                  </div>
                  <button
                    onClick={() => playSfx('click')}
                    className="p-2.5 rounded-xl bg-[#5A33FF] hover:bg-[#6c48ff] text-white shadow-md transition"
                    title="Écouter le son"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#1b143a] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Ding Cloche / Succès</div>
                    <div className="text-[10px] text-zinc-400">Validation d'astuce ou révélation clé</div>
                  </div>
                  <button
                    onClick={() => playSfx('ding')}
                    className="p-2.5 rounded-xl bg-[#5A33FF] hover:bg-[#6c48ff] text-white shadow-md transition"
                    title="Écouter le son"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#1b143a] border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Impact Sub-Bass Boom</div>
                    <div className="text-[10px] text-zinc-400">Pour marquer une phrase cruciale</div>
                  </div>
                  <button
                    onClick={() => playSfx('boom')}
                    className="p-2.5 rounded-xl bg-[#5A33FF] hover:bg-[#6c48ff] text-white shadow-md transition"
                    title="Écouter le son"
                  >
                    <Play className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-300">
                💡 <strong>Conseil Créateur :</strong> Placez un son "Whoosh" à chaque changement de plan et un "Ding" sur le mot-clé principal de votre vidéo pour maximiser le taux de visionnage complet.
              </div>
            </div>
          )}

          {/* TAB 6: TEXTE */}
          {activeTab === 'text' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <Type className="w-3.5 h-3.5" />
                  Textes de la Création
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Modifiez le titre et la description affichés sur le visuel.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Titre Principal</label>
                <textarea
                  value={titleText}
                  onChange={e => setTitleText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1b143a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#5A33FF]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-zinc-300">Sous-titre explicatif</label>
                  <input
                    type="checkbox"
                    checked={showSubtitle}
                    onChange={e => setShowSubtitle(e.target.checked)}
                    className="rounded accent-[#5A33FF] cursor-pointer"
                  />
                </div>
                {showSubtitle && (
                  <textarea
                    value={subtitleText}
                    onChange={e => setSubtitleText(e.target.value)}
                    rows={2}
                    className="w-full bg-[#1b143a] border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#5A33FF]"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Position du bloc de texte</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setTextPosition('top')}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${textPosition === 'top' ? 'bg-[#5A33FF] border-[#5A33FF]' : 'bg-[#1b143a] border-white/10'}`}
                  >
                    Haut
                  </button>
                  <button
                    onClick={() => setTextPosition('middle')}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${textPosition === 'middle' ? 'bg-[#5A33FF] border-[#5A33FF]' : 'bg-[#1b143a] border-white/10'}`}
                  >
                    Milieu
                  </button>
                  <button
                    onClick={() => setTextPosition('bottom')}
                    className={`py-1.5 rounded-lg text-xs font-medium border ${textPosition === 'bottom' ? 'bg-[#5A33FF] border-[#5A33FF]' : 'bg-[#1b143a] border-white/10'}`}
                  >
                    Bas
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MÉDIAS & PHOTOS */}
          {activeTab === 'media' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <Upload className="w-3.5 h-3.5" />
                  Vos Médias & Photos
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Importez vos propres photos puis glissez-les dans les cases du cadre au centre.
                </p>
              </div>

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a27a8] hover:to-[#6c48ff] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                Importer depuis votre appareil
              </button>

              {/* Gallery of Available Media */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-2">
                  Galerie (Cliquez ou Glissez sur une case)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedMedias.map((url, idx) => (
                    <div
                      key={idx}
                      draggable
                      onDragStart={e => {
                        e.dataTransfer.setData('text/plain', url);
                      }}
                      onClick={() => {
                        // Click to place in active empty slot or slot 0
                        const emptyIndex = Array.from({ length: currentFrameConfig.slotsCount }).findIndex((_, sIdx) => !slotImages[sIdx]);
                        const target = emptyIndex !== -1 ? emptyIndex : 0;
                        assignImageToSlot(target, url);
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 cursor-grab active:cursor-grabbing hover:border-[#5A33FF] transition shadow"
                    >
                      <img src={url} alt={`media-${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-white text-center p-1">
                        Glisser ou Cliquer
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: FOND & DÉGRADÉS */}
          {activeTab === 'background' && (
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5 mb-1">
                  <Palette className="w-3.5 h-3.5" />
                  Couleur & Dégradé de Fond
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Définissez l'ambiance globale de votre composition.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BG_GRADIENTS.map(bg => (
                  <button
                    key={bg.name}
                    onClick={() => {
                      setActiveBg(bg.val);
                      playSfx('click');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      activeBg === bg.val ? 'border-[#5A33FF] ring-2 ring-[#5A33FF]/50' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-white/20 shrink-0"
                      style={{ background: bg.val }}
                    />
                    <span className="text-[11px] font-medium text-white truncate">{bg.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Arrondi des Angles</span>
                  <span className="font-mono text-purple-300">{borderRadius} px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={borderRadius}
                  onChange={e => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-[#5A33FF] cursor-pointer"
                />
              </div>
            </div>
          )}
        </aside>

        {/* 3. CENTER WORKSPACE CANVAS (INTERACTIVE PREVIEW) */}
        <main className="flex-1 bg-[#090714] p-4 sm:p-8 flex items-center justify-center overflow-auto relative">
          {/* Subtle background grid pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, #5A33FF 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} 
          />

          {/* Scale wrapper */}
          <div 
            className="transition-transform duration-200 flex items-center justify-center"
            style={{ transform: `scale(${zoomScale})` }}
          >
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
                            className="w-full h-full object-cover select-none transition-all duration-300"
                            style={{
                              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blurAmount}px)`
                            }}
                          />

                          {/* Color Temperature Tint */}
                          {temperature !== 0 && (
                            <div 
                              className="absolute inset-0 pointer-events-none mix-blend-color"
                              style={{
                                backgroundColor: temperature > 0 
                                  ? `rgba(245, 158, 11, ${Math.abs(temperature) * 0.007})` 
                                  : `rgba(6, 182, 212, ${Math.abs(temperature) * 0.007})`
                              }}
                            />
                          )}

                          {/* Delete Slot Button */}
                          <button
                            onClick={e => removeSlotImage(slotIdx, e)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                            title="Supprimer la photo de cet emplacement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center p-3">
                          <ImageIcon className="w-6 h-6 mx-auto text-purple-400/60 mb-1" />
                          <div className="text-[10px] text-zinc-300 font-semibold">Glissez une photo ici</div>
                          <div className="text-[9px] text-purple-400">ou cliquez pour importer</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dark Vignette Overlay */}
              {vignette > 0 && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10 transition-opacity"
                  style={{
                    boxShadow: `inset 0 0 ${vignette * 1.8}px rgba(0,0,0,${vignette / 100})`
                  }}
                />
              )}

              {/* OVERLAY: STICKERS & BADGES */}
              {selectedStickers.length > 0 && (
                <div className={`absolute z-20 pointer-events-none flex flex-wrap gap-1.5 p-3 ${
                  stickerPosition === 'top-left' ? 'top-2 left-2 items-start' :
                  stickerPosition === 'top-right' ? 'top-2 right-2 items-end' :
                  stickerPosition === 'bottom-center' ? 'bottom-16 left-1/2 -translate-x-1/2 justify-center' :
                  'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center'
                }`}>
                  {selectedStickers.map((sticker, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white text-[10px] font-black tracking-wide uppercase shadow-lg border border-white/20 animate-pulse"
                    >
                      {sticker}
                    </span>
                  ))}
                </div>
              )}

              {/* OVERLAY: DYNAMIC CAPTIONS / SOUS-TITRES (CapCut style) */}
              {showCaption && captionText && (
                <div className="absolute inset-x-3 bottom-24 z-20 pointer-events-none flex justify-center">
                  {captionStyle === 'impact_yellow' && (
                    <div className="text-center">
                      <span className="font-black text-xs sm:text-sm text-yellow-300 uppercase tracking-wider px-2 py-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/60 rounded">
                        {captionText}
                      </span>
                    </div>
                  )}

                  {captionStyle === 'black_box' && (
                    <div className="bg-black/90 text-white font-bold text-[11px] sm:text-xs px-3 py-1 rounded-lg border border-white/20 shadow-xl max-w-[90%] text-center">
                      {captionText}
                    </div>
                  )}

                  {captionStyle === 'neon_cyber' && (
                    <div className="text-center">
                      <span className="font-black text-xs sm:text-sm text-cyan-300 uppercase tracking-widest px-2 py-0.5 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] bg-black/40 rounded">
                        {captionText}
                      </span>
                    </div>
                  )}

                  {captionStyle === 'gradient_sunset' && (
                    <div className="text-center bg-black/70 px-3 py-1 rounded-xl">
                      <span className="font-black text-xs sm:text-sm bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wide">
                        {captionText}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* OVERLAY: TEXT BLOCKS (TITRE & SOUS-TITRE) */}
              <div 
                className={`absolute inset-x-0 p-4 sm:p-6 z-20 pointer-events-none flex flex-col ${
                  textPosition === 'top' ? 'top-0 justify-start pt-8' :
                  textPosition === 'middle' ? 'top-1/2 -translate-y-1/2 justify-center' :
                  'bottom-0 justify-end pb-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent'
                }`}
                style={{ textAlign }}
              >
                {/* Main Title */}
                <h2
                  className="leading-tight transition-all"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize}px`,
                    fontWeight: isBold ? 800 : 400,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textDecoration: isUnderline ? 'underline' : 'none',
                    textTransform: isUppercase ? 'uppercase' : 'none',
                    color: textColor,
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                  }}
                >
                  {titleText}
                </h2>

                {/* Subtitle */}
                {showSubtitle && subtitleText && (
                  <p 
                    className="mt-1 text-xs sm:text-sm opacity-90 leading-snug drop-shadow"
                    style={{ fontFamily: selectedFont }}
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
