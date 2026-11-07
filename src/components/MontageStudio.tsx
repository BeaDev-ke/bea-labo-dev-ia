import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Plus,
  Sparkles,
  Lightbulb,
  Image as ImageIcon,
  FileText,
  ArrowLeft,
  Eye,
  Download,
  Scissors,
  Check,
  Film,
  Type,
  Layers,
  Sliders,
  Maximize2,
  Search,
  Star,
  Music,
  Trash2,
  Zap,
  Smile,
  Edit3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
  RotateCw,
  FolderPlus
} from 'lucide-react';
import { VideoScene } from '../types';

interface SoundItem {
  id: string;
  name: string;
  category: 'Transitions' | 'Impacts' | 'Musiques' | 'ASMR & Réactions';
  duration: number;
  freq: number;
}

interface TextOverlay {
  id: string;
  text: string;
  style: string;
  startTime: number;
  duration: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface StickerItem {
  id: string;
  emoji: string;
  name: string;
  category: 'Viral' | 'Pointeurs' | 'CTA' | 'Badges';
  duration: number;
}

export const MontageStudio: React.FC = () => {
  // Mode toggle: normal Montage Studio vs Création de visuels (previously Studio Créateur)
  const [viewMode, setViewMode] = useState<'montage' | 'fullscreen_studio'>('montage');

  // Drag & drop video state
  const [isDragging, setIsDragging] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [scenes, setScenes] = useState<VideoScene[]>([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [autoSubtitles, setAutoSubtitles] = useState(true);

  // Assistant Chat State
  const [chatPrompt, setChatPrompt] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<string[]>([
    "Bonjour ! Je suis Andrea dans votre Studio de Montage. L'agent IA est à votre gauche. Glissez une vidéo au centre, ajoutez des sons depuis le catalogue universel ou demandez-moi un script/diaporama."
  ]);

  // Timeline State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Inspector State (Click to edit any element)
  const [selectedItemType, setSelectedItemType] = useState<'scene' | 'sound' | 'text' | 'sticker' | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Tracks items
  const [addedSounds, setAddedSounds] = useState<Array<{ id: string; name: string; startTime: number; duration: number; volume: number }>>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    { id: 'txt_1', text: 'LE SECRET QUE PERSONNE NE PARTAGE', style: 'Impact', startTime: 0, duration: 4, x: 50, y: 72, fontSize: 13, color: '#facc15' },
    { id: 'txt_2', text: 'Comment doubler votre clarté mentale', style: 'Titre', startTime: 0, duration: 6, x: 50, y: 80, fontSize: 22, color: '#ffffff' },
    { id: 'txt_3', text: '3 règles psychologiques appliquées au quotidien', style: 'Sous-titre', startTime: 0, duration: 6, x: 50, y: 90, fontSize: 11, color: '#cbd5e1' }
  ]);
  const [addedStickers, setAddedStickers] = useState<Array<{ id: string; emoji: string; name: string; startTime: number; duration: number }>>([]);

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState<'son' | 'texte' | 'stickers' | 'medias'>('son');
  const [soundSearchQuery, setSoundSearchQuery] = useState('');
  const [soundFilter, setSoundFilter] = useState<'all' | 'favs' | 'Transitions' | 'Impacts' | 'Musiques' | 'ASMR & Réactions'>('all');
  const [favoriteSoundIds, setFavoriteSoundIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('andrea_fav_sounds') || '["snd_1", "snd_3", "snd_11"]');
      } catch {}
    }
    return ['snd_1', 'snd_3', 'snd_11'];
  });
  const [customTextInput, setCustomTextInput] = useState('Nouvelle accroche percutante');

  // Video Effects & Filters
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [activeEffect, setActiveEffect] = useState<string>('none');

  // Création de visuels State (LibreOffice Toolbar & Frames)
  const [selectedFrame, setSelectedFrame] = useState<string>('9:16');
  const [activeStudioTab, setActiveStudioTab] = useState<'cadres' | 'texte' | 'filtres' | 'elements' | 'fond'>('cadres');

  // LibreOffice Toolbar State
  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(28);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [activeTextId, setActiveTextId] = useState<string>('txt_2');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound Catalog with live synthesis preview
  const SOUND_CATALOG: SoundItem[] = [
    { id: 'snd_1', name: 'Whoosh cinématique d\'air rapide', category: 'Transitions', duration: 1.2, freq: 520 },
    { id: 'snd_2', name: 'Transition Swoosh dynamique', category: 'Transitions', duration: 0.8, freq: 640 },
    { id: 'snd_3', name: 'Impact basse lourde 808 sub', category: 'Impacts', duration: 2.0, freq: 110 },
    { id: 'snd_4', name: 'Ding notification clochette', category: 'Impacts', duration: 1.5, freq: 880 },
    { id: 'snd_5', name: 'Pop bulle de satisfaction', category: 'Impacts', duration: 0.5, freq: 720 },
    { id: 'snd_6', name: 'Cloche de ring de boxe (Hook)', category: 'Impacts', duration: 2.5, freq: 440 },
    { id: 'snd_7', name: 'Tonnerre dramatique & éclair', category: 'Impacts', duration: 3.5, freq: 140 },
    { id: 'snd_8', name: 'Cash register Ka-ching vente', category: 'Impacts', duration: 1.8, freq: 950 },
    { id: 'snd_9', name: 'Rire d\'audience comédie', category: 'ASMR & Réactions', duration: 3.0, freq: 350 },
    { id: 'snd_10', name: 'Clavier mécanique tapotement ASMR', category: 'ASMR & Réactions', duration: 4.0, freq: 480 },
    { id: 'snd_11', name: 'Musique Lofi Chill d\'ambiance', category: 'Musiques', duration: 15.0, freq: 220 },
    { id: 'snd_12', name: 'Beat Trap dynamique TikTok 9:16', category: 'Musiques', duration: 12.0, freq: 260 },
    { id: 'snd_13', name: 'Trailer cinéma épique cordes', category: 'Musiques', duration: 18.0, freq: 320 },
    { id: 'snd_14', name: 'Révélation magique scintillement', category: 'Transitions', duration: 2.2, freq: 780 },
    { id: 'snd_15', name: 'Glitch numérique électrique', category: 'Transitions', duration: 1.1, freq: 580 },
    { id: 'snd_16', name: 'Bip d\'alerte / Error tone', category: 'Impacts', duration: 0.9, freq: 800 }
  ];

  // Play synthetic tone preview
  const playSoundPreview = (freq: number, duration: number) => {
    if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = freq > 400 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + Math.min(duration, 1.5));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + Math.min(duration, 1.5));
      } catch {}
    }
  };

  const toggleFavoriteSound = (id: string) => {
    const next = favoriteSoundIds.includes(id)
      ? favoriteSoundIds.filter((fid) => fid !== id)
      : [...favoriteSoundIds, id];
    setFavoriteSoundIds(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('andrea_fav_sounds', JSON.stringify(next));
    }
  };

  // 12 Rich Frame Formats for Création de visuels with visual logo previews
  const FRAME_FORMATS = [
    {
      id: '9:16',
      title: 'Format Mobile Plein Écran (9:16)',
      desc: 'Vertical HD (1080×1920) pour TikTok, Shorts & Reels.',
      ratio: '9/16',
      iconBox: (
        <div className="w-4 h-7 border-2 border-sky-400 rounded-sm bg-sky-950/60 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-sky-400 rounded-full" />
        </div>
      )
    },
    {
      id: '1:1',
      title: 'Format Carré Universel (1:1)',
      desc: 'Carré HD (1080×1080) carrousels & posts réseaux sociaux.',
      ratio: '1/1',
      iconBox: (
        <div className="w-6 h-6 border-2 border-indigo-400 rounded-sm bg-indigo-950/60 flex items-center justify-center">
          <div className="w-3 h-3 border border-indigo-400/60" />
        </div>
      )
    },
    {
      id: '4:5',
      title: 'Format Portrait Élargi (4:5)',
      desc: 'Portrait HD (1080×1350) optimisé pour le feed Instagram.',
      ratio: '4/5',
      iconBox: (
        <div className="w-5 h-6.5 border-2 border-purple-400 rounded-sm bg-purple-950/60 flex items-center justify-center">
          <div className="w-2.5 h-3.5 border border-purple-400/60" />
        </div>
      )
    },
    {
      id: '16:9',
      title: 'Format Grand Écran (16:9)',
      desc: 'Panoramique HD (1920×1080) YouTube, TV & Desktop.',
      ratio: '16/9',
      iconBox: (
        <div className="w-7 h-4 border-2 border-amber-400 rounded-sm bg-amber-950/60 flex items-center justify-center">
          <div className="w-4 h-2 border border-amber-400/60" />
        </div>
      )
    },
    {
      id: '2.39:1',
      title: 'Format Cinéma Anamorphique (2.39:1)',
      desc: 'Format film 4K grand angle avec bandes noires cinématiques.',
      ratio: '21/9',
      iconBox: (
        <div className="w-8 h-3.5 border-2 border-rose-400 rounded-sm bg-rose-950/60 flex flex-col justify-between">
          <div className="w-full h-0.5 bg-rose-400" />
          <div className="w-full h-0.5 bg-rose-400" />
        </div>
      )
    },
    {
      id: 'duo_h',
      title: 'Duo 2 Photos (Gauche / Droite)',
      desc: 'Comparatif Avant / Après côte à côte (1:1 split).',
      ratio: '1/1',
      iconBox: (
        <div className="w-6 h-6 border-2 border-emerald-400 rounded-sm bg-emerald-950/60 flex">
          <div className="w-1/2 h-full border-r border-emerald-400/80" />
          <div className="w-1/2 h-full" />
        </div>
      )
    },
    {
      id: 'duo_v',
      title: 'Duo 2 Photos (Haut / Bas)',
      desc: 'Split vertical idéal pour réaction vidéo et gameplay.',
      ratio: '9/16',
      iconBox: (
        <div className="w-4 h-7 border-2 border-teal-400 rounded-sm bg-teal-950/60 flex flex-col">
          <div className="w-full h-1/2 border-b border-teal-400/80" />
          <div className="w-full h-1/2" />
        </div>
      )
    },
    {
      id: 'grid_4',
      title: 'Grille 4 Photos (2×2 Collage)',
      desc: 'Disposition 4 cadrans équilibrés pour showcases produits.',
      ratio: '1/1',
      iconBox: (
        <div className="w-6 h-6 border-2 border-pink-400 rounded-sm bg-pink-950/60 grid grid-cols-2 grid-rows-2 p-0.5 gap-0.5">
          <div className="bg-pink-400/50" />
          <div className="bg-pink-400/50" />
          <div className="bg-pink-400/50" />
          <div className="bg-pink-400/50" />
        </div>
      )
    },
    {
      id: 'triptych',
      title: 'Triptyque 3 Colonnes (1:1:1)',
      desc: 'Trois volets verticaux séquentiels style éditorial.',
      ratio: '16/9',
      iconBox: (
        <div className="w-7 h-4.5 border-2 border-cyan-400 rounded-sm bg-cyan-950/60 flex">
          <div className="w-1/3 h-full border-r border-cyan-400/80" />
          <div className="w-1/3 h-full border-r border-cyan-400/80" />
          <div className="w-1/3 h-full" />
        </div>
      )
    },
    {
      id: 'story',
      title: 'Format Story & Réel avec Safe Zone',
      desc: 'Cadrage 9:16 avec marges de sécurité réservées aux textes.',
      ratio: '9/16',
      iconBox: (
        <div className="w-4 h-7 border-2 border-yellow-400 rounded-sm bg-yellow-950/60 p-0.5 flex flex-col justify-between">
          <div className="w-full h-1 border-b border-dashed border-yellow-400" />
          <div className="w-full h-1 border-t border-dashed border-yellow-400" />
        </div>
      )
    },
    {
      id: 'youtube_thumb',
      title: 'Miniature YouTube 1280×720',
      desc: 'Format 16:9 accrocheur avec espace réservé au timer.',
      ratio: '16/9',
      iconBox: (
        <div className="w-7 h-4 border-2 border-red-500 rounded-sm bg-red-950/60 relative">
          <div className="absolute right-0.5 bottom-0.5 w-2 h-1 bg-black text-[5px] text-white" />
        </div>
      )
    },
    {
      id: 'banner',
      title: 'Bannière Twitter / X (3:1)',
      desc: 'Bandeau 1500×500 pour en-tête de profil ou site web.',
      ratio: '3/1',
      iconBox: (
        <div className="w-8 h-2.5 border-2 border-blue-400 rounded-sm bg-blue-950/60" />
      )
    }
  ];

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoName(file.name);

    const mockScenes: VideoScene[] = [
      {
        id: 'sc_1',
        sceneNumber: 1,
        startTime: 0,
        endTime: 3.5,
        duration: 3.5,
        thumbnailUrl: '',
        description: 'Accroche virale explosive avec Crash Zoom',
        cameraMovement: 'Crash Zoom',
        colorGrade: 'Teal & Orange Cinéma',
        transitionToNext: 'whip_pan',
        subtitleSnippet: 'LE SECRET QUE PERSONNE NE PARTAGE',
      },
      {
        id: 'sc_2',
        sceneNumber: 2,
        startTime: 3.5,
        endTime: 7.0,
        duration: 3.5,
        thumbnailUrl: '',
        description: 'Révélation du concept avec Orbite 360°',
        cameraMovement: 'Orbit 360°',
        colorGrade: 'Contraste Neon',
        transitionToNext: 'fade',
        subtitleSnippet: 'Comment doubler votre clarté mentale',
      },
      {
        id: 'sc_3',
        sceneNumber: 3,
        startTime: 7.0,
        endTime: 12.0,
        duration: 5.0,
        thumbnailUrl: '',
        description: 'Call to action final avec Travelling Avant',
        cameraMovement: 'Dolly In',
        colorGrade: 'Minimaliste Sombre',
        subtitleSnippet: '3 règles psychologiques appliquées au quotidien',
      },
    ];

    setScenes(mockScenes);
    setAssistantMessages((prev) => [
      ...prev,
      `Superbe ! J'ai découpé votre fichier "${file.name}" en 3 scènes distinctes avec détection des mouvements caméra et points de coupe optimisés.`
    ]);
  };

  // Cut/split scene at currentTime
  const handleSplitScene = () => {
    if (scenes.length === 0) return;
    const active = scenes[activeSceneIndex];
    if (!active || active.duration <= 1.0) return;

    const half = Number((active.duration / 2).toFixed(1));
    const newScene1: VideoScene = {
      ...active,
      duration: half,
      endTime: active.startTime + half,
    };
    const newScene2: VideoScene = {
      ...active,
      id: `sc_${Date.now()}`,
      sceneNumber: active.sceneNumber + 1,
      startTime: active.startTime + half,
      duration: Number((active.duration - half).toFixed(1)),
      description: 'Scène scindée',
      subtitleSnippet: 'Suite du plan...',
    };

    const newScenes = [...scenes];
    newScenes.splice(activeSceneIndex, 1, newScene1, newScene2);
    // Renumber
    newScenes.forEach((sc, i) => {
      sc.sceneNumber = i + 1;
    });
    setScenes(newScenes);
  };

  // Speed ramping
  const handleSetSpeed = (sp: number) => {
    setPlaybackSpeed(sp);
    if (scenes.length > 0) {
      const active = scenes[activeSceneIndex];
      if (active) {
        active.duration = Number((active.duration / sp).toFixed(1));
        setScenes([...scenes]);
      }
    }
  };

  // Update element duration from inspector
  const updateActiveSceneDuration = (newDur: number) => {
    if (scenes[activeSceneIndex]) {
      scenes[activeSceneIndex].duration = Math.max(0.5, Number(newDur.toFixed(1)));
      setScenes([...scenes]);
    }
  };

  // Add sound to track
  const handleAddSoundToTrack = (sound: SoundItem) => {
    setAddedSounds([
      ...addedSounds,
      {
        id: `trk_snd_${Date.now()}`,
        name: sound.name,
        startTime: currentTime,
        duration: sound.duration,
        volume: 80,
      }
    ]);
    setIsAddModalOpen(false);
  };

  // Add text to track
  const handleAddTextToTrack = (txt: string) => {
    const newTxt: TextOverlay = {
      id: `txt_${Date.now()}`,
      text: txt,
      style: 'Titre',
      startTime: currentTime,
      duration: 5,
      x: 50,
      y: 50,
      fontSize: 22,
      color: '#ffffff',
    };
    setTextOverlays([...textOverlays, newTxt]);
    setActiveTextId(newTxt.id);
    setIsAddModalOpen(false);
  };

  // Add sticker to track
  const handleAddStickerToTrack = (stk: StickerItem) => {
    setAddedStickers([
      ...addedStickers,
      {
        id: `stk_${Date.now()}`,
        emoji: stk.emoji,
        name: stk.name,
        startTime: currentTime,
        duration: stk.duration,
      }
    ]);
    setIsAddModalOpen(false);
  };

  // Filtered sounds
  const filteredSounds = SOUND_CATALOG.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(soundSearchQuery.toLowerCase());
    if (soundFilter === 'favs') return matchesSearch && favoriteSoundIds.includes(s.id);
    if (soundFilter === 'all') return matchesSearch;
    return matchesSearch && s.category === soundFilter;
  });

  const STICKER_LIST: StickerItem[] = [
    { id: 'stk_1', emoji: '🔥', name: 'Feu Viral', category: 'Viral', duration: 3 },
    { id: 'stk_2', emoji: '🚀', name: 'Fusée Momentum', category: 'Viral', duration: 3 },
    { id: 'stk_3', emoji: '💡', name: 'Idée Choc', category: 'Viral', duration: 4 },
    { id: 'stk_4', emoji: '💯', name: '100% Validé', category: 'Viral', duration: 2.5 },
    { id: 'stk_5', emoji: '⚡', name: 'Éclair Instant', category: 'Viral', duration: 2 },
    { id: 'stk_6', emoji: '🤯', name: 'Mind Blown', category: 'Viral', duration: 3 },
    { id: 'stk_7', emoji: '🎯', name: 'Cible Focus', category: 'Viral', duration: 3.5 },
    { id: 'stk_8', emoji: '👉', name: 'Pointeur Droite', category: 'Pointeurs', duration: 3 },
    { id: 'stk_9', emoji: '⬇️', name: 'Flèche Bas', category: 'Pointeurs', duration: 3 },
    { id: 'stk_10', emoji: '🔔', name: 'Abonne-toi & Cloche', category: 'CTA', duration: 4 },
    { id: 'stk_11', emoji: '👍', name: 'Pouce Like', category: 'CTA', duration: 3 },
    { id: 'stk_12', emoji: '⭐', name: 'Top 1 Star', category: 'Badges', duration: 3 }
  ];

  // VIEW 1: FULLSCREEN VISUAL CREATION ("Création de visuels", previously Studio Créateur)
  if (viewMode === 'fullscreen_studio') {
    return (
      <div className="space-y-3 max-w-7xl mx-auto animate-fadeIn">
        {/* Top Header matching user specifications */}
        <div className="p-3 bg-[#0a0e24] border border-[#1d2757] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('montage')}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
            >
              ← Quitter
            </button>
            <div className="h-4 w-px bg-[#1d2757]" />
            <button
              onClick={() => setViewMode('montage')}
              className="text-slate-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer"
            >
              ← Revenir au Montage
            </button>
            <div className="h-4 w-px bg-[#1d2757]" />
            <div>
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Création de visuels</span>
              </span>
              <span className="text-[10px] text-slate-400 block">Outils de composition, cadres multiples & sous-titres visuels</span>
            </div>
          </div>

          <button
            onClick={() => alert('Exportation PNG HD réussie')}
            className="px-4 py-2 bg-[#2036a1] hover:bg-[#2c48bf] text-white font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter PNG HD</span>
          </button>
        </div>

        {/* LibreOffice Writer Style Full Formatting Toolbar */}
        <div className="p-2.5 bg-[#0f1536] border border-[#232f6b] rounded-2xl flex flex-wrap items-center gap-2 text-xs select-none shadow-md">
          {/* Font Family Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">Police :</span>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-2.5 py-1.5 bg-[#172152] border border-[#2b3c8a] rounded-lg text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="Impact">Impact (Moderne)</option>
              <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
              <option value="Montserrat, sans-serif">Montserrat Black</option>
              <option value="Anton, sans-serif">Anton Cinéma</option>
              <option value="'Playfair Display', serif">Playfair Display (Luxe)</option>
              <option value="'JetBrains Mono', monospace">JetBrains Mono (Code)</option>
              <option value="Courier New, monospace">Courier Vintage</option>
            </select>
          </div>

          {/* Font Size with - and + */}
          <div className="flex items-center bg-[#172152] border border-[#2b3c8a] rounded-lg px-2 py-0.5">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="px-1 text-slate-300 hover:text-white font-bold cursor-pointer"
              title="Diminuer la taille"
            >
              -
            </button>
            <span className="px-2 font-mono text-white font-bold min-w-[28px] text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(72, fontSize + 2))}
              className="px-1 text-slate-300 hover:text-white font-bold cursor-pointer"
              title="Augmenter la taille"
            >
              +
            </button>
          </div>

          <div className="h-4 w-px bg-[#2b3c8a] hidden sm:block" />

          {/* Bold, Italic, Underline, Strikethrough (LibreOffice Writer style) */}
          <div className="flex items-center gap-0.5 bg-[#172152] border border-[#2b3c8a] rounded-lg p-0.5">
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${isBold ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Gras (Ctrl+G)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${isItalic ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Italique (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${isUnderline ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Souligné (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsStrikethrough(!isStrikethrough)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${isStrikethrough ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Barré"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Alignment (Left, Center, Right, Justify) */}
          <div className="flex items-center gap-0.5 bg-[#172152] border border-[#2b3c8a] rounded-lg p-0.5">
            <button
              onClick={() => setTextAlign('left')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${textAlign === 'left' ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Aligner à gauche"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${textAlign === 'center' ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Centrer"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${textAlign === 'right' ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Aligner à droite"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('justify')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${textAlign === 'justify' ? 'bg-[#3b82f6] text-white' : 'text-slate-300 hover:text-white'}`}
              title="Justifier"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color pickers */}
          <div className="flex items-center gap-1.5">
            <label className="flex items-center gap-1 bg-[#172152] border border-[#2b3c8a] px-2 py-1 rounded-lg cursor-pointer" title="Couleur du texte">
              <span className="font-bold text-xs" style={{ color: textColor }}>A</span>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="flex items-center gap-1 bg-[#172152] border border-[#2b3c8a] px-2 py-1 rounded-lg cursor-pointer" title="Surlignage / Couleur de fond">
              <Highlighter className="w-3.5 h-3.5 text-amber-300" />
              <input
                type="color"
                value={highlightColor === 'transparent' ? '#000000' : highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>
          </div>

          <div className="h-4 w-px bg-[#2b3c8a] hidden sm:block" />

          {/* Insertion buttons: Zone de texte, Forme */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const newT: TextOverlay = {
                  id: `txt_${Date.now()}`,
                  text: 'Zone de texte insérée',
                  style: 'Personnalisé',
                  startTime: 0,
                  duration: 5,
                  x: 50,
                  y: 50,
                  fontSize: fontSize,
                  color: textColor,
                };
                setTextOverlays([...textOverlays, newT]);
                setActiveTextId(newT.id);
              }}
              className="px-3 py-1.5 bg-[#2036a1] hover:bg-[#2c48bf] text-white font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              title="Insérer une zone de texte comme dans LibreOffice Writer"
            >
              <Type className="w-3.5 h-3.5" />
              <span>[T] Zone de texte</span>
            </button>

            <button
              onClick={() => alert('Forme rectangle insérée')}
              className="px-2.5 py-1.5 bg-[#172152] hover:bg-[#223073] border border-[#2b3c8a] text-slate-200 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
              title="Insérer une forme géométrique"
            >
              <span>▭ Forme</span>
            </button>
          </div>
        </div>

        {/* 3-Column Studio Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[580px]">
          {/* Left Vertical Tools */}
          <div className="md:col-span-1 bg-[#090d1f] border border-[#1d2757] rounded-2xl p-2 flex flex-col gap-2 items-center text-[10px] font-bold text-slate-400">
            <button
              onClick={() => setActiveStudioTab('cadres')}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeStudioTab === 'cadres' ? 'bg-[#1b2766] text-white border border-[#2e4299]' : 'hover:bg-[#12183b]'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Cadres</span>
            </button>
            <button
              onClick={() => setActiveStudioTab('texte')}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeStudioTab === 'texte' ? 'bg-[#1b2766] text-white border border-[#2e4299]' : 'hover:bg-[#12183b]'
              }`}
            >
              <Type className="w-4 h-4 text-amber-400" />
              <span>Texte</span>
            </button>
            <button
              onClick={() => setActiveStudioTab('filtres')}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeStudioTab === 'filtres' ? 'bg-[#1b2766] text-white border border-[#2e4299]' : 'hover:bg-[#12183b]'
              }`}
            >
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Filtres</span>
            </button>
            <button
              onClick={() => setActiveStudioTab('elements')}
              className={`w-full py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                activeStudioTab === 'elements' ? 'bg-[#1b2766] text-white border border-[#2e4299]' : 'hover:bg-[#12183b]'
              }`}
            >
              <Smile className="w-4 h-4 text-pink-400" />
              <span>Stickers</span>
            </button>
          </div>

          {/* Middle Models list with ALL FRAMES and MINIATURE PREVIEW LOGO */}
          <div className="md:col-span-4 bg-[#0a0f26] border border-[#1d2757] rounded-2xl p-4 space-y-3 overflow-y-auto max-h-[620px] no-scrollbar">
            <div className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between">
              <span>Modèles de Cadres ({FRAME_FORMATS.length})</span>
              <span className="text-[10px] text-emerald-400 font-mono">100% GRATUIT</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Sélectionnez un format pour adapter votre composition. Un aperçu visuel miniature est affiché sous chaque modèle.
            </p>

            <div className="space-y-2.5">
              {FRAME_FORMATS.map((frm) => {
                const isSelected = selectedFrame === frm.id;
                return (
                  <div
                    key={frm.id}
                    onClick={() => setSelectedFrame(frm.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#182561] border-[#344fb8] text-white shadow-lg shadow-indigo-950/60 ring-1 ring-sky-400/30'
                        : 'bg-[#101638] border-[#222c5e] text-slate-300 hover:bg-[#161e47]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-extrabold text-white">{frm.title}</div>
                      {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                    </div>

                    <div className="text-[10px] text-slate-400 leading-tight">
                      {frm.desc}
                    </div>

                    {/* Small logo / miniature layout preview underneath description */}
                    <div className="pt-1.5 border-t border-[#1d2757] flex items-center gap-3">
                      <div className="p-1.5 bg-[#0a0d1f] rounded-lg border border-[#222c5e] flex items-center justify-center">
                        {frm.iconBox}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-sky-300">
                        Ratio : {frm.ratio}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Center Visual Canvas */}
          <div className="md:col-span-7 bg-[#060914] border border-[#1d2757] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Aspect container */}
            <div
              className={`rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700 bg-gradient-to-b from-[#1e2759] to-[#0d122b] flex flex-col justify-end p-6 text-center transition-all ${
                selectedFrame === '9:16'
                  ? 'w-[280px] h-[500px]'
                  : selectedFrame === '1:1'
                  ? 'w-[360px] h-[360px]'
                  : selectedFrame === '4:5'
                  ? 'w-[300px] h-[380px]'
                  : selectedFrame === '16:9'
                  ? 'w-[480px] h-[270px]'
                  : 'w-[300px] h-[480px]'
              }`}
            >
              {/* Background gradient & Avatar placeholder */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400/30 via-indigo-900/40 to-slate-950" />
              <div className="w-28 h-28 rounded-full border-2 border-sky-400/30 mx-auto my-auto flex items-center justify-center relative z-10">
                <span className="text-4xl">👤</span>
              </div>

              {/* Dynamic Text Boxes Rendered on Canvas with LibreOffice formatting */}
              <div className="relative z-20 space-y-2">
                {textOverlays.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setActiveTextId(t.id)}
                    className={`cursor-pointer p-1 rounded transition-all ${
                      activeTextId === t.id ? 'outline-2 outline-dashed outline-sky-400' : ''
                    }`}
                    style={{
                      fontFamily: fontFamily,
                      fontSize: `${activeTextId === t.id ? fontSize : t.fontSize}px`,
                      fontWeight: isBold ? 900 : 400,
                      fontStyle: isItalic ? 'italic' : 'normal',
                      textDecoration: `${isUnderline ? 'underline' : ''} ${isStrikethrough ? 'line-through' : ''}`.trim() || 'none',
                      textAlign: textAlign,
                      color: activeTextId === t.id ? textColor : t.color,
                      backgroundColor: activeTextId === t.id ? highlightColor : 'transparent',
                    }}
                  >
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: NORMAL MONTAGE VIEW (Photo 7 with all montage effects & audio/text/stickers drawer)
  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-fadeIn">
      {/* Top Bar matching Photo 7 */}
      <div className="p-3 bg-[#0a0e24] border border-[#1d2757] rounded-2xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScenes([])}
            className="text-slate-400 hover:text-white font-bold cursor-pointer"
          >
            ← Retour
          </button>
          <div className="h-4 w-px bg-[#1d2757]" />
          <button
            onClick={() => setViewMode('fullscreen_studio')}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#d946ef] to-[#ec4899] text-white font-bold transition-all shadow-md hover:scale-105 cursor-pointer flex items-center gap-1.5"
            title="Ouvrir la Création de visuels (Plein Écran)"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Création de visuels</span>
          </button>
        </div>

        {/* Quick Montage Editing Toolbar */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Split / Cut */}
          <button
            onClick={handleSplitScene}
            disabled={scenes.length === 0}
            className="px-2.5 py-1 bg-[#172152] hover:bg-[#233178] border border-[#2b3c8a] rounded-lg text-slate-200 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            title="Scinder / Couper le plan à la position du curseur"
          >
            <Scissors className="w-3.5 h-3.5 text-sky-400" />
            <span>Scinder</span>
          </button>

          {/* Speed Ramping */}
          <div className="flex items-center gap-1 bg-[#172152] border border-[#2b3c8a] rounded-lg px-2 py-0.5 text-[11px] font-bold">
            <span className="text-slate-400">Vitesse :</span>
            {[0.5, 1.0, 1.5, 2.0].map((sp) => (
              <button
                key={sp}
                onClick={() => handleSetSpeed(sp)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === sp ? 'bg-[#3b82f6] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {sp}x
              </button>
            ))}
          </div>

          {/* Video Effects Dropdown */}
          <select
            value={activeEffect}
            onChange={(e) => setActiveEffect(e.target.value)}
            className="px-2.5 py-1 bg-[#172152] border border-[#2b3c8a] rounded-lg text-white font-bold text-xs cursor-pointer focus:outline-none"
          >
            <option value="none">Effet : Aucun</option>
            <option value="zoom_crash">⚡ Crash Zoom Impact</option>
            <option value="shake">💥 Shake Caméra</option>
            <option value="blur_bg">🌫️ Flou Bokeh Arrière-plan</option>
            <option value="flash">✨ Flash Blanc Transition</option>
            <option value="vhs">📼 Glitch VHS Rétro</option>
            <option value="mirror">🪞 Miroir Horizontal</option>
          </select>

          {/* Color Grade / Filters Dropdown */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-2.5 py-1 bg-[#172152] border border-[#2b3c8a] rounded-lg text-white font-bold text-xs cursor-pointer focus:outline-none"
          >
            <option value="normal">Filtre : Naturel</option>
            <option value="teal_orange">🎬 Teal & Orange Cinéma</option>
            <option value="neon">🔮 Cyber Neon 80s</option>
            <option value="bw">🎞️ Noir & Blanc 35mm</option>
            <option value="golden">🌅 Golden Hour Chaud</option>
            <option value="vintage">📸 Vintage Kodak Portra</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Aperçu de la transition Outro généré')}
            className="text-slate-300 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Aperçu Outro</span>
          </button>

          <button
            onClick={() => alert('Exportation de la séquence vidéo en MP4')}
            className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Andrea Assistant, Center Dropzone */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column matching Photo 7: Espace Andrea IA */}
        <div className="md:col-span-4 bg-[#0d122c] border border-[#1e2754] rounded-3xl p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Espace Andrea IA</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                🟢 Studio Assistant Actif
              </span>
            </div>

            {/* 3 Action Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setAssistantMessages((prev) => [
                    ...prev,
                    "💡 Idée Hook : '90% des créateurs font cette erreur à la 3ème seconde... Voici comment retenir 100% de votre audience.'"
                  ]);
                }}
                className="px-2.5 py-1 rounded-full bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Lightbulb className="w-3 h-3 text-amber-300" />
                <span>Idée Hook</span>
              </button>

              <button
                onClick={() => {
                  setAssistantMessages((prev) => [
                    ...prev,
                    "🖼️ Diaporama IA : Structure générée en 4 visuels séquentiels avec transitions whip-pan et musique énergique."
                  ]);
                }}
                className="px-2.5 py-1 rounded-full bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3 text-sky-300" />
                <span>Créer un diaporama</span>
              </button>

              <button
                onClick={() => {
                  setAssistantMessages((prev) => [
                    ...prev,
                    "🎬 Script vidéo virale :\n• 0-3s : Hook problème choc\n• 3-15s : Levier de neuro-productivité\n• 15-30s : Passage à l'action immédiat."
                  ]);
                }}
                className="px-2.5 py-1 rounded-full bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-3 h-3 text-purple-300" />
                <span>Script vidéo virale</span>
              </button>
            </div>

            {/* Assistant Speech Bubble */}
            <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
              {assistantMessages.map((msg, idx) => (
                <div key={idx} className="p-3 bg-[#151c44] border border-[#273473] rounded-2xl text-xs text-slate-200 leading-relaxed space-y-1">
                  <p className="whitespace-pre-wrap">{msg}</p>
                  <span className="text-[9px] text-slate-400 font-mono block">Maintenant</span>
                </div>
              ))}
            </div>
          </div>

          {/* Input field */}
          <div className="relative pt-2">
            <input
              type="text"
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && chatPrompt.trim()) {
                  const p = chatPrompt;
                  setChatPrompt('');
                  setAssistantMessages((prev) => [...prev, `Vous : ${p}`, `Andrea : J'ai adapté le montage selon votre consigne "${p}".`]);
                }
              }}
              placeholder="Demander à Andrea (diaporama, sons...)"
              className="w-full pl-3 pr-8 py-2 bg-[#171f4c] border border-[#293675] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4255b3]"
            />
            <button
              onClick={() => {
                if (chatPrompt.trim()) {
                  const p = chatPrompt;
                  setChatPrompt('');
                  setAssistantMessages((prev) => [...prev, `Vous : ${p}`, `Andrea : J'ai adapté le montage selon votre consigne "${p}".`]);
                }
              }}
              className="absolute right-2 top-3 text-sky-400 hover:text-white cursor-pointer"
            >
              ➤
            </button>
          </div>
        </div>

        {/* Center Dropzone / Scènes Découpées */}
        <div className="md:col-span-8 bg-[#0d122c] border border-[#1e2754] rounded-3xl p-6 flex flex-col items-center justify-center min-h-[360px]">
          {scenes.length > 0 ? (
            /* Decomposed scenes list */
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Vidéo découpée en scènes : {videoName}</span>
                <span className="text-sky-400 font-mono">{scenes.length} plans modifiables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scenes.map((sc, i) => (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setActiveSceneIndex(i);
                      setSelectedItemType('scene');
                      setSelectedItemId(sc.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      activeSceneIndex === i
                        ? 'bg-[#1b2b73] border-[#384fa6] shadow-lg ring-1 ring-sky-400/40'
                        : 'bg-[#101638] border-[#222c5e] hover:bg-[#151d47]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>PLAN 0{sc.sceneNumber}</span>
                      <span className="text-sky-300 font-bold bg-[#172152] px-1.5 py-0.5 rounded">
                        {sc.duration}s (Cliquer pour modifier)
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white truncate">{sc.cameraMovement}</div>
                    <div className="text-[11px] text-slate-300 mt-1 line-clamp-2 italic">
                      “{sc.subtitleSnippet}”
                    </div>
                  </div>
                ))}
              </div>

              {/* Inspector for selected scene */}
              {scenes[activeSceneIndex] && (
                <div className="p-4 bg-[#141b3d] border border-[#2b3978] rounded-2xl text-xs space-y-3">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>⚙️ Modifier le Plan #{scenes[activeSceneIndex].sceneNumber}</span>
                    <button
                      onClick={() => {
                        const next = scenes.filter((_, idx) => idx !== activeSceneIndex);
                        setScenes(next);
                        setActiveSceneIndex(0);
                      }}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer le plan</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Durée du plan :</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0.5"
                          max="30"
                          step="0.5"
                          value={scenes[activeSceneIndex].duration}
                          onChange={(e) => updateActiveSceneDuration(parseFloat(e.target.value) || 1)}
                          className="w-20 px-2 py-1 bg-[#1c2656] border border-[#2e3e87] rounded-lg text-white font-mono font-bold"
                        />
                        <span className="text-slate-400">secondes</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Transition de sortie :</label>
                      <select
                        value={scenes[activeSceneIndex].transitionToNext || 'cut'}
                        onChange={(e) => {
                          scenes[activeSceneIndex].transitionToNext = e.target.value as any;
                          setScenes([...scenes]);
                        }}
                        className="w-full px-2 py-1 bg-[#1c2656] border border-[#2e3e87] rounded-lg text-white font-bold cursor-pointer"
                      >
                        <option value="cut">Coupe franche (Cut net)</option>
                        <option value="whip_pan">Panoramique fouetté (Whip Pan)</option>
                        <option value="fade">Fondu enchaîné</option>
                        <option value="zoom_in">Zoom In transition</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Sous-titre / Hook :</label>
                      <input
                        type="text"
                        value={scenes[activeSceneIndex].subtitleSnippet || ''}
                        onChange={(e) => {
                          scenes[activeSceneIndex].subtitleSnippet = e.target.value;
                          setScenes([...scenes]);
                        }}
                        className="w-full px-2 py-1 bg-[#1c2656] border border-[#2e3e87] rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Dashed Box matching Photo 7 */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full max-w-lg p-8 border-2 border-dashed rounded-3xl text-center space-y-4 transition-all ${
                isDragging ? 'border-sky-400 bg-sky-500/10' : 'border-[#293675] bg-[#090d1f]'
              }`}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#172152] border border-[#2d3e91] flex items-center justify-center shadow-lg">
                <Upload className="w-6 h-6 text-sky-400" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-white">Glisser ou déposer des fichiers</h4>
                <p className="text-xs text-slate-400 mt-0.5">Vidéos (MP4, WebM) ou Photos (PNG, JPG)</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  id="autoSubs"
                  checked={autoSubtitles}
                  onChange={(e) => setAutoSubtitles(e.target.checked)}
                  className="w-4 h-4 accent-[#3b82f6] rounded cursor-pointer"
                />
                <label htmlFor="autoSubs" className="cursor-pointer font-bold flex items-center gap-1">
                  <span>🎙️ Sous-titres automatiques (IA)</span>
                </label>
              </div>

              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Parcourir mon appareil
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  onChange={(e) => e.target.files && e.target.files[0] && processFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Timeline Strip matching Photo 7 with + Ajouter menu */}
      <div className="p-4 bg-[#0d122c] border border-[#1e2754] rounded-3xl space-y-3">
        {/* Play controls and time display */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-[#1e2a66] hover:bg-[#28388a] flex items-center justify-center text-white cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Retour au début"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-white">
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input type="range" min="0" max="100" defaultValue="80" className="w-20 accent-sky-400" />
            </div>

            {/* Main + Ajouter Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajouter</span>
            </button>
          </div>
        </div>

        {/* Timeline Tracks matching Photo 7 */}
        <div className="p-3 bg-[#080b1a] border border-[#171f45] rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-slate-300">
              Piste de Montage Unique ({scenes.length + addedSounds.length + textOverlays.length + addedStickers.length} éléments)
            </span>
            <span className="font-mono">
              Curseur : {currentTime.toFixed(1)}s | Durée totale : {duration.toFixed(1)}s
            </span>
          </div>

          {/* Ruler */}
          <div className="flex justify-between text-[10px] text-slate-500 font-mono px-2 select-none">
            <span>0s</span>
            <span>5s</span>
            <span>10s</span>
            <span>15s</span>
            <span>20s</span>
            <span>25s</span>
            <span>30s</span>
          </div>

          {/* Main Visual Track Slot */}
          <div className="min-h-14 bg-[#0f1536] border border-[#202959] rounded-xl flex items-center gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
            {scenes.length > 0 ? (
              scenes.map((sc, i) => (
                <div
                  key={sc.id}
                  onClick={() => {
                    setActiveSceneIndex(i);
                    setSelectedItemType('scene');
                    setSelectedItemId(sc.id);
                  }}
                  className={`h-10 px-3 rounded-lg border flex items-center justify-between text-xs font-bold cursor-pointer shrink-0 transition-all ${
                    activeSceneIndex === i
                      ? 'bg-[#2563eb] text-white border-white shadow-md'
                      : 'bg-[#182357] text-slate-300 border-[#2f4296] hover:bg-[#202f73]'
                  }`}
                  style={{ width: `${Math.max(80, sc.duration * 28)}px` }}
                  title="Cliquer pour modifier la durée ou le plan"
                >
                  <span className="truncate">Plan {sc.sceneNumber}</span>
                  <span className="text-[10px] font-mono opacity-80">{sc.duration}s</span>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                Piste vide · Cliquez sur le bouton + à droite pour ajouter musique, sons, zone de texte, stickers ou vidéo
              </span>
            )}
          </div>

          {/* Secondary Audio & Text Overlays Strip if items exist */}
          {(addedSounds.length > 0 || textOverlays.length > 0 || addedStickers.length > 0) && (
            <div className="pt-1 space-y-1">
              {/* Audio Track */}
              {addedSounds.length > 0 && (
                <div className="h-8 bg-[#101942] border border-[#233580] rounded-lg flex items-center gap-2 px-3 overflow-x-auto no-scrollbar text-xs">
                  <Music className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {addedSounds.map((snd) => (
                    <div
                      key={snd.id}
                      onClick={() => alert(`Son : ${snd.name} (${snd.duration}s). Modifiable.`)}
                      className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] truncate cursor-pointer flex items-center gap-1.5"
                    >
                      <span>🎵 {snd.name}</span>
                      <span className="font-mono">({snd.duration}s)</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddedSounds(addedSounds.filter((s) => s.id !== snd.id));
                        }}
                        className="hover:text-rose-400 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Text & Stickers Track */}
              {(textOverlays.length > 0 || addedStickers.length > 0) && (
                <div className="h-8 bg-[#101942] border border-[#233580] rounded-lg flex items-center gap-2 px-3 overflow-x-auto no-scrollbar text-xs">
                  <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {textOverlays.map((txt) => (
                    <div
                      key={txt.id}
                      onClick={() => {
                        const newContent = prompt('Modifier le texte :', txt.text);
                        if (newContent !== null) {
                          txt.text = newContent;
                          setTextOverlays([...textOverlays]);
                        }
                      }}
                      className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-[10px] truncate cursor-pointer flex items-center gap-1.5"
                      title="Cliquer pour modifier le texte"
                    >
                      <span>✍️ {txt.text}</span>
                      <span className="font-mono">({txt.duration}s)</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTextOverlays(textOverlays.filter((t) => t.id !== txt.id));
                        }}
                        className="hover:text-rose-400 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {addedStickers.map((stk) => (
                    <div
                      key={stk.id}
                      className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-[10px] truncate flex items-center gap-1"
                    >
                      <span>{stk.emoji} {stk.name}</span>
                      <button
                        onClick={() => setAddedStickers(addedStickers.filter((s) => s.id !== stk.id))}
                        className="hover:text-rose-400 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL AJOUTER (Son universel, Zone de texte, GIFs & Stickers, B-Roll) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0e1329] border border-[#2b356d] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#141b3d] border-b border-[#2b356d] flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-white text-sm">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Ajouter à la piste de montage</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-[#2b356d] bg-[#0c1024] px-4 pt-2 text-xs">
              <button
                onClick={() => setActiveAddTab('son')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeAddTab === 'son' ? 'border-[#3b82f6] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5 text-emerald-400" />
                <span>🎵 Ajouter un son (Recherche universelle)</span>
              </button>
              <button
                onClick={() => setActiveAddTab('texte')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeAddTab === 'texte' ? 'border-[#3b82f6] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-amber-400" />
                <span>✍️ Zone de texte</span>
              </button>
              <button
                onClick={() => setActiveAddTab('stickers')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeAddTab === 'stickers' ? 'border-[#3b82f6] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Smile className="w-3.5 h-3.5 text-pink-400" />
                <span>✨ GIFs & Stickers</span>
              </button>
              <button
                onClick={() => setActiveAddTab('medias')}
                className={`px-4 py-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeAddTab === 'medias' ? 'border-[#3b82f6] text-white' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>🎞️ Médias B-Roll</span>
              </button>
            </div>

            {/* Tab 1: Son universel avec recherche Google et mise en favoris */}
            {activeAddTab === 'son' && (
              <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar text-xs">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={soundSearchQuery}
                    onChange={(e) => setSoundSearchQuery(e.target.value)}
                    placeholder="Recherche Google / Catalogue universel de sons (whoosh, basse, impact, rire, pluie, musique)..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSoundFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${soundFilter === 'all' ? 'bg-[#3b82f6] text-white' : 'bg-[#141b3d] text-slate-400'}`}
                  >
                    Tous les sons
                  </button>
                  <button
                    onClick={() => setSoundFilter('favs')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer flex items-center gap-1 ${soundFilter === 'favs' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-[#141b3d] text-amber-300'}`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>Mes Favoris ({favoriteSoundIds.length})</span>
                  </button>
                  <button
                    onClick={() => setSoundFilter('Transitions')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${soundFilter === 'Transitions' ? 'bg-[#3b82f6] text-white' : 'bg-[#141b3d] text-slate-400'}`}
                  >
                    Transitions
                  </button>
                  <button
                    onClick={() => setSoundFilter('Impacts')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${soundFilter === 'Impacts' ? 'bg-[#3b82f6] text-white' : 'bg-[#141b3d] text-slate-400'}`}
                  >
                    Impacts
                  </button>
                  <button
                    onClick={() => setSoundFilter('Musiques')}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${soundFilter === 'Musiques' ? 'bg-[#3b82f6] text-white' : 'bg-[#141b3d] text-slate-400'}`}
                  >
                    Musiques
                  </button>
                </div>

                {/* Sounds List */}
                <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                  {filteredSounds.map((snd) => {
                    const isFav = favoriteSoundIds.includes(snd.id);
                    return (
                      <div
                        key={snd.id}
                        className="p-3 bg-[#131a3d] border border-[#232f6b] rounded-xl flex items-center justify-between hover:border-[#3b82f6] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => playSoundPreview(snd.freq, snd.duration)}
                            className="w-8 h-8 rounded-full bg-[#1e2a66] hover:bg-[#2c3d94] flex items-center justify-center text-white cursor-pointer shadow"
                            title="Écouter l'aperçu"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                          </button>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{snd.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({snd.duration}s)</span>
                            </div>
                            <span className="text-[10px] text-sky-400 font-mono">{snd.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFavoriteSound(snd.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isFav
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                : 'bg-[#1a214d] border-[#2b3978] text-slate-400 hover:text-white'
                            }`}
                            title={isFav ? 'Retirer des favoris' : 'Mettre en favoris'}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleAddSoundToTrack(snd)}
                            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg cursor-pointer"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Zone de texte */}
            {activeAddTab === 'texte' && (
              <div className="p-4 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-white">Texte à incruster :</label>
                  <input
                    type="text"
                    value={customTextInput}
                    onChange={(e) => setCustomTextInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddTextToTrack("LE SECRET QUE PERSONNE NE PARTAGE")}
                    className="p-3 rounded-xl bg-[#131a3d] border border-[#232f6b] text-left hover:border-amber-400 cursor-pointer"
                  >
                    <span className="font-black text-amber-400 block text-xs">Accroche Virale (Hook)</span>
                    <span className="text-[11px] text-slate-300">Style jaune fluo impact</span>
                  </button>

                  <button
                    onClick={() => handleAddTextToTrack("Comment doubler votre clarté mentale")}
                    className="p-3 rounded-xl bg-[#131a3d] border border-[#232f6b] text-left hover:border-sky-400 cursor-pointer"
                  >
                    <span className="font-black text-white block text-xs">Titre Principal</span>
                    <span className="text-[11px] text-slate-300">Style blanc percutant</span>
                  </button>
                </div>

                <button
                  onClick={() => handleAddTextToTrack(customTextInput)}
                  className="w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl cursor-pointer"
                >
                  Ajouter cette zone de texte
                </button>
              </div>
            )}

            {/* Tab 3: GIFs & Stickers */}
            {activeAddTab === 'stickers' && (
              <div className="p-4 space-y-3 text-xs overflow-y-auto max-h-80 no-scrollbar">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {STICKER_LIST.map((stk) => (
                    <button
                      key={stk.id}
                      onClick={() => handleAddStickerToTrack(stk)}
                      className="p-3 bg-[#131a3d] border border-[#232f6b] hover:border-[#3b82f6] rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                    >
                      <span className="text-2xl">{stk.emoji}</span>
                      <span className="font-bold text-white text-[11px] truncate w-full text-center">{stk.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Médias B-Roll */}
            {activeAddTab === 'medias' && (
              <div className="p-6 text-center space-y-3 text-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#141b3d] border border-[#2b356d] mx-auto flex items-center justify-center">
                  <Film className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-bold text-white">Importer un plan de coupe (B-Roll)</h4>
                <p className="text-slate-400 text-[11px]">Insérez une vidéo d'illustration ou une photo par-dessus votre timeline.</p>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 bg-[#2563eb] text-white font-bold rounded-xl cursor-pointer"
                >
                  Sélectionner un fichier
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
