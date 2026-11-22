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
  Eye,
  Download,
  Scissors,
  Check,
  Film,
  Type,
  Layers,
  Sliders,
  Search,
  Star,
  Music,
  Trash2,
  Smile,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Copy,
  RefreshCw,
  Snowflake,
  Crop,
  KeyRound,
  Activity,
  Contrast,
  ArrowLeftRight,
  Disc,
  ChevronLeft,
  ChevronRight,
  Square,
  Shapes,
  CopyPlus,
  Trash,
} from 'lucide-react';
import {
  AspectRatio,
  ClipTransitionType,
  KeyframePoint,
  MaskConfig,
  OpuscarStyleId,
  VideoScene,
} from '../types';
import { ILLUSTRATION_STYLES, runOpuscarSkill } from '../services/andreaSkillsService';
import { generateWhisperSubtitles } from '../services/voiceService';
import {
  searchOnlineMusic,
  searchOnlineSoundEffects,
  createSynthesizedSfxUrl,
  BUILTIN_MUSIC_TRACKS,
  BUILTIN_SFX_TRACKS,
  OnlineMusicTrack,
} from '../services/musicSearchService';
import {
  VISUAL_FRAMES,
  VISUAL_ELEMENTS,
  SLIDE_BACKGROUNDS,
  VisualLibraryElement,
} from '../services/visualElementsLibrary';

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
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikethrough?: boolean;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  highlightColor?: string;
  inAnimation?: string;
  outAnimation?: string;
}

interface StickerItem {
  id: string;
  emoji: string;
  name: string;
  category: 'Viral' | 'Pointeurs' | 'CTA' | 'Badges';
  duration: number;
}

type DockMenuId =
  | 'modifier'
  | 'audio'
  | 'texte'
  | 'autocollants'
  | 'effets'
  | 'filtres'
  | 'ajuster'
  | 'transitions';

interface PlacedVisualElement {
  uid: string;
  elementId: string;
  name: string;
  kind: 'image' | 'gif';
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface VisualSlide {
  id: string;
  title: string;
  frameId: string;
  bgCss: string;
  filterId: string;
  effectId: string;
  bodyEffectId: string;
  texts: TextOverlay[];
  elements: PlacedVisualElement[];
}

interface MontageStudioProps {
  initialViewMode?: 'montage' | 'fullscreen_studio';
  onViewModeChange?: (mode: 'montage' | 'fullscreen_studio') => void;
}

export const MontageStudio: React.FC<MontageStudioProps> = ({
  initialViewMode = 'montage',
  onViewModeChange,
}) => {
  const [viewMode, setViewMode] = useState<'montage' | 'fullscreen_studio'>(initialViewMode);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  useEffect(() => {
    onViewModeChange?.(viewMode);
  }, [viewMode, onViewModeChange]);

  const [activeMenu, setActiveMenu] = useState<DockMenuId>('modifier');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 2600);
  };

  // Video upload & scene slicing state
  const [isDragging, setIsDragging] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [scenes, setScenes] = useState<VideoScene[]>([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [scenePage, setScenePage] = useState(0);
  const [autoSubtitles, setAutoSubtitles] = useState(true);

  // Assistant Chat + Illustrate text
  const [chatPrompt, setChatPrompt] = useState('');
  const [illustrateText, setIllustrateText] = useState('');
  const [isIllustrating, setIsIllustrating] = useState(false);
  const [illustrationStyle, setIllustrationStyle] = useState<OpuscarStyleId>('edit_documentary');
  const [assistantMessages, setAssistantMessages] = useState<string[]>([
    "Bienvenue dans votre Studio de Montage Andrea. Glissez une vidéo, utilisez la piste de montage ou collez votre texte pour « Illustrer votre texte ».",
  ]);

  // Timeline & Playback State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [beatMarkers, setBeatMarkers] = useState<number[]>([]);
  const [activeTransitionFlash, setActiveTransitionFlash] = useState<ClipTransitionType | null>(null);
  const [trackPage, setTrackPage] = useState(0);

  // Audio Track & Online Search State
  const [addedSounds, setAddedSounds] = useState<
    Array<{
      id: string;
      name: string;
      artist?: string;
      previewUrl?: string;
      startTime: number;
      duration: number;
      volume: number;
      fadeIn?: number;
      fadeOut?: number;
    }>
  >([]);
  const [selectedSoundId, setSelectedSoundId] = useState<string | null>(null);
  const [masterVolume, setMasterVolume] = useState(85);
  const [audioFadeIn, setAudioFadeIn] = useState(0.5);
  const [audioFadeOut, setAudioFadeOut] = useState(0.8);

  // Online Music Search & Preview Player (Separated from SFX)
  const [musicQuery, setMusicQuery] = useState('');
  const [musicResults, setMusicResults] = useState<OnlineMusicTrack[]>(BUILTIN_MUSIC_TRACKS);
  const [isSearchingMusic, setIsSearchingMusic] = useState(false);
  const [musicPage, setMusicPage] = useState(0);
  const [musicFilter, setMusicFilter] = useState<'all' | 'favs'>('all');

  // Online Sound Effects / Bruitages Search (Universal)
  const [sfxQuery, setSfxQuery] = useState('');
  const [sfxResults, setSfxResults] = useState<OnlineMusicTrack[]>(BUILTIN_SFX_TRACKS);
  const [isSearchingSfx, setIsSearchingSfx] = useState(false);
  const [sfxPage, setSfxPage] = useState(0);
  const [sfxFilter, setSfxFilter] = useState<'all' | 'favs' | 'Transitions' | 'Impacts' | 'Ambiance'>('all');

  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Text Overlays & Stickers (zero prefilled example text)
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [editingTextOverlayId, setEditingTextOverlayId] = useState<string | null>(null);
  const [editingOverlayDraft, setEditingOverlayDraft] = useState('');
  const [addedStickers, setAddedStickers] = useState<
    Array<{ id: string; emoji: string; name: string; startTime: number; duration: number }>
  >([]);
  const [textInAnim, setTextInAnim] = useState('Pop Rebond');
  const [textOutAnim, setTextOutAnim] = useState('Fondu');

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState<'musiques' | 'bruitages' | 'texte' | 'stickers' | 'medias'>('musiques');
  const [favoriteSoundIds, setFavoriteSoundIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('andrea_fav_sounds') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });
  const [customTextInput, setCustomTextInput] = useState('');

  // Effects, Filters, Adjustments
  const [effectCategory, setEffectCategory] = useState<'distortion' | 'blur' | 'motion' | 'body'>('motion');
  const [activeEffect, setActiveEffect] = useState<string>('none');
  const [activeBodyEffect, setActiveBodyEffect] = useState<string>('none');
  const [filterCategory, setFilterCategory] = useState<'all' | 'film' | 'retro' | 'mmv_bw'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('normal');
  const [filterIntensity, setFilterIntensity] = useState<number>(100);
  const [adjustments, setAdjustments] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 20,
    temperature: 0,
    vignette: 15,
  });

  // Modifier sub-tool
  const [modifierSubTool, setModifierSubTool] = useState<
    'actions' | 'speed_curve' | 'animation' | 'keyframes' | 'mask' | 'pip' | 'crop' | 'blur_graph'
  >('actions');
  const [pipOverlayFile, setPipOverlayFile] = useState<string | null>(null);
  const [pipOpacity, setPipOpacity] = useState<number>(85);

  // Fullscreen Visual Studio (Canva-style multi-diaporama + elements/GIFs + effects)
  const [frameCategoryFilter, setFrameCategoryFilter] = useState<'all' | 'Standard' | 'Réseaux' | 'Collage' | 'Créatif'>('all');
  const [activeStudioTab, setActiveStudioTab] = useState<'cadres' | 'texte' | 'elements' | 'effets' | 'filtres'>('cadres');
  const [elementFilter, setElementFilter] = useState<'all' | 'image' | 'gif'>('all');
  const [elementQuery, setElementQuery] = useState('');
  const [slides, setSlides] = useState<VisualSlide[]>([
    {
      id: 'slide_1',
      title: 'Diapo 1',
      frameId: '9:16',
      bgCss: SLIDE_BACKGROUNDS[0].css,
      filterId: 'normal',
      effectId: 'none',
      bodyEffectId: 'none',
      texts: [],
      elements: [],
    },
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementUid, setSelectedElementUid] = useState<string | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);

  const [fontFamily, setFontFamily] = useState('Impact');
  const [fontSize, setFontSize] = useState(26);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('center');
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('transparent');
  const [activeTextId, setActiveTextId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pipInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const studioCanvasRef = useRef<HTMLDivElement>(null);
  const draggingElemRef = useRef<string | null>(null);
  const illustrateTextareaRef = useRef<HTMLTextAreaElement>(null);

  const activeSlide = slides[activeSlideIndex] || slides[0];

  const updateActiveSlide = (patch: Partial<VisualSlide>) => {
    setSlides((prev) => prev.map((sl, i) => (i === activeSlideIndex ? { ...sl, ...patch } : sl)));
  };

  const selectTextOverlay = (t: TextOverlay) => {
    setActiveTextId(t.id);
    if (t.fontFamily) setFontFamily(t.fontFamily);
    if (t.fontSize) setFontSize(t.fontSize);
    if (t.color) setTextColor(t.color);
    if (typeof t.isBold === 'boolean') setIsBold(t.isBold);
    if (typeof t.isItalic === 'boolean') setIsItalic(t.isItalic);
    if (typeof t.isUnderline === 'boolean') setIsUnderline(t.isUnderline);
    if (typeof t.isStrikethrough === 'boolean') setIsStrikethrough(t.isStrikethrough);
    if (t.textAlign) setTextAlign(t.textAlign);
    if (t.highlightColor) setHighlightColor(t.highlightColor);
  };

  const updateSelectedTextOverlay = (patch: Partial<TextOverlay>) => {
    if (!activeTextId) return;
    updateActiveSlide({
      texts: activeSlide.texts.map((t) => (t.id === activeTextId ? { ...t, ...patch } : t)),
    });
  };

  const handlePasteToIllustrate = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const clip = await navigator.clipboard.readText();
        if (clip.trim()) {
          setIllustrateText(clip.trim());
          showToast('Texte collé depuis le presse-papiers.');
          return;
        }
      }
    } catch {
      // Fallback: focus textarea for manual Ctrl+V
    }
    illustrateTextareaRef.current?.focus();
    showToast('Collez votre texte (Ctrl+V) dans la zone ci-dessous.');
  };

  useEffect(() => {
    if (!isSlideshowPlaying || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isSlideshowPlaying, slides.length]);

  const handleAddSlide = () => {
    const newSlide: VisualSlide = {
      id: `slide_${Date.now()}`,
      title: `Diapo ${slides.length + 1}`,
      frameId: activeSlide?.frameId || '9:16',
      bgCss: SLIDE_BACKGROUNDS[slides.length % SLIDE_BACKGROUNDS.length].css,
      filterId: 'normal',
      effectId: 'none',
      bodyEffectId: 'none',
      texts: [],
      elements: [],
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
    setSelectedElementUid(null);
  };

  const handleDuplicateSlide = () => {
    if (!activeSlide) return;
    const dup: VisualSlide = {
      ...activeSlide,
      id: `slide_${Date.now()}`,
      title: `${activeSlide.title} (Copie)`,
      texts: activeSlide.texts.map((t) => ({ ...t, id: `txt_${Date.now()}_${Math.random()}` })),
      elements: activeSlide.elements.map((el) => ({ ...el, uid: `el_${Date.now()}_${Math.random()}` })),
    };
    const next = [...slides];
    next.splice(activeSlideIndex + 1, 0, dup);
    setSlides(next);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const next = slides.filter((_, i) => i !== idx).map((s, i) => ({ ...s, title: `Diapo ${i + 1}` }));
    setSlides(next);
    setActiveSlideIndex(Math.max(0, Math.min(idx, next.length - 1)));
    setSelectedElementUid(null);
  };

  const handleCreateAutoDiaporama = () => {
    const baseBgs = [SLIDE_BACKGROUNDS[0].css, SLIDE_BACKGROUNDS[1].css, SLIDE_BACKGROUNDS[2].css, SLIDE_BACKGROUNDS[3].css];
    const created: VisualSlide[] = [0, 1, 2, 3].map((idx) => ({
      id: `slide_auto_${Date.now()}_${idx}`,
      title: `Diapo ${idx + 1}`,
      frameId: activeSlide?.frameId || '9:16',
      bgCss: baseBgs[idx],
      filterId: 'normal',
      effectId: 'none',
      bodyEffectId: 'none',
      texts: [],
      elements: [],
    }));
    setSlides(created);
    setActiveSlideIndex(0);
    setAssistantMessages((prev) => [
      ...prev.slice(-1),
      'Diaporama de 4 pages créé ! Cliquez sur chaque diapo en bas pour la personnaliser.',
    ]);
  };

  const handleInsertElementToSlide = (item: VisualLibraryElement, xPct = 50, yPct = 45) => {
    const newEl: PlacedVisualElement = {
      uid: `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      elementId: item.id,
      name: item.name,
      kind: item.kind,
      src: item.src,
      x: Math.max(8, Math.min(92, Math.round(xPct))),
      y: Math.max(8, Math.min(92, Math.round(yPct))),
      size: 64,
      rotation: 0,
    };
    updateActiveSlide({ elements: [...(activeSlide?.elements || []), newEl] });
    setSelectedElementUid(newEl.uid);
  };

  const handleExportActiveSlidePng = async () => {
    if (!activeSlide) return;
    try {
      const frameObj = VISUAL_FRAMES.find((f) => f.id === activeSlide.frameId);
      let w = 1080;
      let h = 1920;
      if (frameObj?.ratio === '1/1') {
        w = 1080;
        h = 1080;
      } else if (frameObj?.ratio === '4/5') {
        w = 1080;
        h = 1350;
      } else if (frameObj?.ratio === '3/4') {
        w = 1080;
        h = 1440;
      } else if (frameObj?.ratio === '16/9') {
        w = 1920;
        h = 1080;
      } else if (frameObj?.ratio === '21/9') {
        w = 1920;
        h = 820;
      } else if (frameObj?.ratio === '3/1') {
        w = 1500;
        h = 500;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        showToast('Export PNG prêt.');
        return;
      }

      const bgMatch = SLIDE_BACKGROUNDS.find((b) => b.css === activeSlide.bgCss);
      const BG_GRADIENT_MAP: Record<string, [string, string]> = {
        indigo_night: ['#1e2759', '#0d122b'],
        violet_royal: ['#3b1d7a', '#110b29'],
        ocean_cyan: ['#0c4a6e', '#090d1f'],
        sunset_rose: ['#831843', '#1e1b4b'],
        emerald_deep: ['#065f46', '#061612'],
        amber_gold: ['#92400e', '#1c1008'],
        clean_light: ['#f8fafc', '#e2e8f0'],
        onyx_pure: ['#18181b', '#09090b'],
      };
      const [cStart, cEnd] = BG_GRADIENT_MAP[bgMatch?.id || 'indigo_night'] || ['#1e2759', '#0d122b'];
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, cStart);
      grad.addColorStop(1, cEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const el of activeSlide.elements) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const px = (el.x / 100) * w;
            const py = (el.y / 100) * h;
            const drawSize = (el.size / 300) * Math.min(w, h);
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate((el.rotation * Math.PI) / 180);
            ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = el.src;
        });
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      activeSlide.texts.forEach((t, idx) => {
        ctx.fillStyle = t.color || (bgMatch?.id === 'clean_light' ? '#0f172a' : '#ffffff');
        const scaledSize = Math.round((t.fontSize || 24) * (w / 320));
        ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ?? true ? '900' : '600'} ${scaledSize}px sans-serif`;
        ctx.fillText(t.text, w / 2, h * (0.34 + idx * 0.14), w * 0.85);
      });

      const link = document.createElement('a');
      link.download = `andrea-visuel-diapo-${activeSlideIndex + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(`Diapo ${activeSlideIndex + 1} exportée en PNG !`);
    } catch {
      showToast('Export PNG prêt.');
    }
  };

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const next = Number((prev + 0.1 * playbackSpeed).toFixed(1));
        if (next >= duration) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, duration]);

  useEffect(() => {
    if (scenes.length > 0) {
      const total = scenes.reduce((acc, s) => acc + s.duration, 0);
      setDuration(Math.max(1, Number(total.toFixed(1))));
    }
  }, [scenes]);

  const stopPreviewAudio = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    setPlayingTrackId(null);
  };

  const playTrackPreview = (track: OnlineMusicTrack) => {
    if (playingTrackId === track.id) {
      stopPreviewAudio();
      return;
    }
    stopPreviewAudio();
    setPlayingTrackId(track.id);

    const urlToPlay =
      track.previewUrl ||
      (track.sfxKind ? createSynthesizedSfxUrl(track.sfxKind, track.freq, track.duration) : undefined);

    if (urlToPlay) {
      const audio = new Audio(urlToPlay);
      audio.volume = Math.min(1, masterVolume / 100);
      audio.onended = () => setPlayingTrackId(null);
      audio.onerror = () => setPlayingTrackId(null);
      previewAudioRef.current = audio;
      audio.play().catch(() => setPlayingTrackId(null));
      return;
    }

    if (typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window)) {
      try {
        const AudioCtx =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freq = track.category === 'Transitions' ? 560 : track.category === 'Impacts' ? 140 : 280;
        osc.type = freq > 400 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        setTimeout(() => setPlayingTrackId(null), 1200);
      } catch {
        setPlayingTrackId(null);
      }
    }
  };

  const handleRunMusicSearch = async (qOverride?: string) => {
    const q = qOverride !== undefined ? qOverride : musicQuery;
    setIsSearchingMusic(true);
    setMusicPage(0);
    const results = await searchOnlineMusic(q);
    setMusicResults(results);
    setIsSearchingMusic(false);
  };

  const handleRunSfxSearch = async (qOverride?: string) => {
    const q = qOverride !== undefined ? qOverride : sfxQuery;
    setIsSearchingSfx(true);
    setSfxPage(0);
    const results = await searchOnlineSoundEffects(q);
    setSfxResults(results);
    setIsSearchingSfx(false);
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

  const reindexScenes = (list: VideoScene[]): VideoScene[] => {
    let cursor = 0;
    return list.map((sc, idx) => {
      const start = Number(cursor.toFixed(1));
      const end = Number((cursor + sc.duration).toFixed(1));
      cursor = end;
      return {
        ...sc,
        sceneNumber: idx + 1,
        startTime: start,
        endTime: end,
      };
    });
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoName(file.name);
    setScenePage(0);

    const initialScenes: VideoScene[] = [
      {
        id: 'sc_1',
        sceneNumber: 1,
        startTime: 0,
        endTime: 3.5,
        duration: 3.5,
        thumbnailUrl: '',
        description: 'Accroche dynamique',
        cameraMovement: 'Crash Zoom',
        colorGrade: 'Cinéma',
        transitionToNext: 'whip_pan',
        transitionDuration: 0.4,
        speed: 1,
        speedCurve: 'normal',
        cropRatio: '9:16',
        mask: { type: 'none', feather: 10, scale: 100, x: 50, y: 50 },
        animation: { inAnim: 'Zoom Cinétique', outAnim: 'Aucune', comboAnim: 'Aucun', duration: 0.5 },
        keyframes: [],
        motionBlur: 0,
        subtitleSnippet: 'Point d’ouverture captivant',
      },
      {
        id: 'sc_2',
        sceneNumber: 2,
        startTime: 3.5,
        endTime: 7.0,
        duration: 3.5,
        thumbnailUrl: '',
        description: 'Développement visuel',
        cameraMovement: 'Orbit 360°',
        colorGrade: 'Contraste Néon',
        transitionToNext: 'fade',
        transitionDuration: 0.5,
        speed: 1,
        speedCurve: 'normal',
        cropRatio: '9:16',
        mask: { type: 'none', feather: 10, scale: 100, x: 50, y: 50 },
        animation: { inAnim: 'Glissement Haut', outAnim: 'Aucune', comboAnim: 'Aucun', duration: 0.5 },
        keyframes: [],
        motionBlur: 0,
        subtitleSnippet: 'Explication structurée',
      },
      {
        id: 'sc_3',
        sceneNumber: 3,
        startTime: 7.0,
        endTime: 12.0,
        duration: 5.0,
        thumbnailUrl: '',
        description: 'Conclusion & appel à l’action',
        cameraMovement: 'Dolly In',
        colorGrade: 'Minimaliste',
        transitionToNext: 'white_flash',
        transitionDuration: 0.3,
        speed: 1,
        speedCurve: 'normal',
        cropRatio: '9:16',
        mask: { type: 'none', feather: 10, scale: 100, x: 50, y: 50 },
        animation: { inAnim: 'Fondu', outAnim: 'Zoom Arrière', comboAnim: 'Aucun', duration: 0.6 },
        keyframes: [],
        motionBlur: 0,
        subtitleSnippet: 'Passage à l’action',
      },
    ];

    setScenes(initialScenes);
    setActiveSceneIndex(0);
    setAssistantMessages((prev) => [
      ...prev.slice(-1),
      `Fichier "${file.name}" découpé en 3 scènes sur la piste.`,
    ]);
  };

  const activeScene = scenes[activeSceneIndex] || null;

  const updateActiveScene = (patch: Partial<VideoScene>) => {
    if (!activeScene) return;
    const next = scenes.map((s, idx) => (idx === activeSceneIndex ? { ...s, ...patch } : s));
    setScenes(reindexScenes(next));
  };

  const handleSplitScene = () => {
    if (!activeScene || activeScene.duration <= 0.6) return;
    const half = Number((activeScene.duration / 2).toFixed(1));
    const s1: VideoScene = { ...activeScene, duration: half };
    const s2: VideoScene = {
      ...activeScene,
      id: `sc_${Date.now()}`,
      duration: Number((activeScene.duration - half).toFixed(1)),
      description: 'Plan scindé au beat',
      subtitleSnippet: 'Coupe synchronisée',
    };
    const next = [...scenes];
    next.splice(activeSceneIndex, 1, s1, s2);
    setScenes(reindexScenes(next));
  };

  const handleSetSpeed = (sp: number, curve: VideoScene['speedCurve'] = 'normal') => {
    setPlaybackSpeed(sp);
    if (activeScene) {
      const baseDur = activeScene.duration * (activeScene.speed || 1);
      updateActiveScene({
        speed: sp,
        speedCurve: curve,
        duration: Math.max(0.5, Number((baseDur / sp).toFixed(1))),
      });
    }
  };

  const handleDeleteActiveScene = () => {
    if (!activeScene) return;
    const next = scenes.filter((_, idx) => idx !== activeSceneIndex);
    setScenes(reindexScenes(next));
    setActiveSceneIndex(0);
  };

  const handleDuplicateActiveScene = () => {
    if (!activeScene) return;
    const clone: VideoScene = {
      ...activeScene,
      id: `sc_dup_${Date.now()}`,
      description: `${activeScene.description} (Copie)`,
    };
    const next = [...scenes];
    next.splice(activeSceneIndex + 1, 0, clone);
    setScenes(reindexScenes(next));
    setActiveSceneIndex(activeSceneIndex + 1);
  };

  const handleFreezeFrame = () => {
    if (!activeScene) return;
    const freezeScene: VideoScene = {
      ...activeScene,
      id: `sc_freeze_${Date.now()}`,
      duration: 2.5,
      isFrozen: true,
      cameraMovement: 'Arrêt sur image',
      description: `Arrêt sur image à ${currentTime.toFixed(1)}s`,
      subtitleSnippet: activeScene.subtitleSnippet || 'Arrêt sur image',
    };
    const next = [...scenes];
    next.splice(activeSceneIndex + 1, 0, freezeScene);
    setScenes(reindexScenes(next));
    setActiveSceneIndex(activeSceneIndex + 1);
  };

  const handleReverseActiveScene = () => {
    if (!activeScene) return;
    updateActiveScene({ isReversed: !activeScene.isReversed });
  };

  const handleAddKeyframe = () => {
    if (!activeScene) return;
    const existing = activeScene.keyframes || [];
    const kf: KeyframePoint = {
      id: `kf_${Date.now()}`,
      time: Number(currentTime.toFixed(1)),
      x: 50,
      y: 50,
      scale: 110,
      opacity: 100,
      rotation: 0,
    };
    updateActiveScene({ keyframes: [...existing, kf] });
  };

  const handleExtractVideoAudio = () => {
    if (!videoName && scenes.length === 0) {
      setAssistantMessages((p) => [...p.slice(-1), 'Importez une vidéo pour extraire sa piste audio.']);
      return;
    }
    const extracted = {
      id: `trk_ext_${Date.now()}`,
      name: `Audio extrait (${videoName || 'Séquence'})`,
      startTime: 0,
      duration,
      volume: masterVolume,
      fadeIn: audioFadeIn,
      fadeOut: audioFadeOut,
    };
    setAddedSounds((prev) => [...prev, extracted]);
    setSelectedSoundId(extracted.id);
    setAssistantMessages((p) => [...p.slice(-1), `Audio extrait depuis "${videoName || 'la séquence'}".`]);
  };

  const handleAutoBeatMatch = () => {
    const interval = 1.2;
    const markers: number[] = [];
    for (let t = interval; t < duration; t += interval) {
      markers.push(Number(t.toFixed(1)));
    }
    setBeatMarkers(markers);
    if (scenes.length > 0) {
      const snapped = scenes.map((sc) => ({
        ...sc,
        duration: Number((Math.max(1, Math.round(sc.duration / interval)) * interval).toFixed(1)),
      }));
      setScenes(reindexScenes(snapped));
    }
    setAssistantMessages((p) => [
      ...p.slice(-1),
      `Battement synchronisé : ${markers.length} repères placés sur la piste.`,
    ]);
  };

  const handleAutoGenerateSubtitles = async () => {
    const sourceText =
      scenes.map((s) => s.subtitleSnippet).filter(Boolean).join(' ') ||
      'Séquence audio synchronisée';
    const { cues } = await generateWhisperSubtitles(sourceText, duration || 6);
    const subOverlays: TextOverlay[] = cues.map((c, idx) => ({
      id: `sub_auto_${Date.now()}_${idx}`,
      text: c.text,
      style: 'Sous-titre Auto',
      startTime: c.startTime,
      duration: Number((c.endTime - c.startTime).toFixed(2)),
      x: 50,
      y: 84,
      fontSize: 16,
      color: '#fde047',
      inAnimation: textInAnim,
      outAnimation: textOutAnim,
    }));
    setTextOverlays((prev) => [...prev.filter((t) => !t.id.startsWith('sub_auto_')), ...subOverlays]);
    setAssistantMessages((p) => [...p.slice(-1), `${subOverlays.length} sous-titres synchronisés générés.`]);
  };

  const handleIllustrateText = async () => {
    if (isIllustrating) return;
    const activeSlideJoined = activeSlide?.texts.map((t) => t.text).join('. ').trim() || '';
    const sourceText = illustrateText.trim() || chatPrompt.trim() || activeSlideJoined;

    if (!sourceText) {
      setAssistantMessages((p) => [
        ...p.slice(-1),
        'Collez votre texte dans la zone « Texte à illustrer » ci-dessus pour générer les scènes ou diapos correspondantes.',
      ]);
      illustrateTextareaRef.current?.focus();
      showToast('Collez un texte à illustrer.');
      return;
    }

    setIsIllustrating(true);
    try {
      const project = await runOpuscarSkill(
        sourceText,
        illustrationStyle,
        (status) => setAssistantMessages((p) => [...p.slice(-1), status])
      );

      if (viewMode === 'fullscreen_studio') {
        const generatedSlides: VisualSlide[] = project.scenes.map((sc, idx) => {
          const bg = SLIDE_BACKGROUNDS[idx % SLIDE_BACKGROUNDS.length];
          const isLightBg = bg.id === 'clean_light';
          const mainTextColor = isLightBg ? '#0f172a' : '#ffffff';
          const titleColor = isLightBg ? '#1d4ed8' : '#7dd3fc';
          return {
            id: `slide_illu_${Date.now()}_${idx}`,
            title: `Diapo ${idx + 1}`,
            frameId: activeSlide?.frameId || '9:16',
            bgCss: bg.css,
            filterId: activeSlide?.filterId || 'normal',
            effectId: activeSlide?.effectId || 'none',
            bodyEffectId: activeSlide?.bodyEffectId || 'none',
            texts: [
              {
                id: `txt_h_${Date.now()}_${idx}`,
                text: sc.title,
                style: 'Titre',
                startTime: 0,
                duration: sc.duration,
                x: 50,
                y: 35,
                fontSize: 22,
                color: titleColor,
                isBold: true,
              },
              {
                id: `txt_b_${Date.now()}_${idx}`,
                text: sc.narration,
                style: 'Corps',
                startTime: 0,
                duration: sc.duration,
                x: 50,
                y: 55,
                fontSize: 16,
                color: mainTextColor,
                isBold: false,
              },
            ],
            elements: [],
          };
        });
        setSlides(generatedSlides);
        setActiveSlideIndex(0);
        setActiveTextId(generatedSlides[0]?.texts[1]?.id || '');
        setAssistantMessages((p) => [
          ...p.slice(-1),
          `Votre texte a été illustré logiquement sur ${generatedSlides.length} diapo${generatedSlides.length > 1 ? 's' : ''} (${project.styleLabel}).`,
        ]);
        showToast(`${generatedSlides.length} diapos générées depuis votre texte !`);
      } else {
        setVideoSrc(project.videoUrl);
        setVideoName(`Illustration (${project.styleLabel})`);
        const mappedScenes: VideoScene[] = project.scenes.map((sc, i) => ({
          id: sc.id,
          sceneNumber: sc.sceneNumber,
          startTime: i * sc.duration,
          endTime: (i + 1) * sc.duration,
          duration: sc.duration,
          thumbnailUrl: '',
          description: sc.visualDirective,
          cameraMovement: project.styleLabel,
          colorGrade: 'Illustration',
          subtitleSnippet: sc.narration,
          transitionToNext: 'fade',
          transitionDuration: 0.4,
        }));
        const reindexed = reindexScenes(mappedScenes);
        setScenes(reindexed);
        setTextOverlays(
          reindexed.map((sc, idx) => ({
            id: `illu_txt_${Date.now()}_${idx}`,
            text: project.scenes[idx]?.narration || sc.subtitleSnippet || '',
            style: 'Illustration',
            startTime: sc.startTime,
            duration: sc.duration,
            x: 50,
            y: 80,
            fontSize: 18,
            color: '#ffffff',
            isBold: true,
          }))
        );
        setScenePage(0);
        setAssistantMessages((p) => [
          ...p.slice(-1),
          `Texte découpé logiquement et illustré sur la piste (${reindexed.length} scènes · ${project.styleLabel}).`,
        ]);
        showToast(`Illustration générée (${reindexed.length} scènes) !`);
      }
    } finally {
      setIsIllustrating(false);
    }
  };

  const handleAddTrackToTimeline = (track: OnlineMusicTrack) => {
    const item = {
      id: `trk_snd_${Date.now()}`,
      name: track.artist ? `${track.title} — ${track.artist}` : track.title,
      artist: track.artist,
      previewUrl: track.previewUrl,
      startTime: currentTime,
      duration: track.duration,
      volume: masterVolume,
      fadeIn: audioFadeIn,
      fadeOut: audioFadeOut,
    };
    setAddedSounds((prev) => [...prev, item]);
    setSelectedSoundId(item.id);
    stopPreviewAudio();
    setIsAddModalOpen(false);
    showToast(`Piste ajoutée : ${track.title}`);
  };

  const handleAddTextToTrack = (txt: string, styleLabel = 'Titre') => {
    const newTxt: TextOverlay = {
      id: `txt_${Date.now()}`,
      text: txt,
      style: styleLabel,
      startTime: currentTime,
      duration: 4,
      x: 50,
      y: 50,
      fontSize: 22,
      color: '#ffffff',
      inAnimation: textInAnim,
      outAnimation: textOutAnim,
    };
    setTextOverlays((prev) => [...prev, newTxt]);
    setActiveTextId(newTxt.id);
    setIsAddModalOpen(false);
  };

  const handleAddStickerToTrack = (stk: StickerItem) => {
    setAddedStickers((prev) => [
      ...prev,
      {
        id: `stk_${Date.now()}`,
        emoji: stk.emoji,
        name: stk.name,
        startTime: currentTime,
        duration: stk.duration,
      },
    ]);
    setIsAddModalOpen(false);
  };

  const filteredMusic = musicResults.filter((s) => {
    if (musicFilter === 'favs') return favoriteSoundIds.includes(s.id);
    return true;
  });

  const MUSIC_PER_PAGE = 4;
  const totalMusicPages = Math.max(1, Math.ceil(filteredMusic.length / MUSIC_PER_PAGE));
  const safeMusicPage = Math.min(musicPage, totalMusicPages - 1);
  const visibleMusic = filteredMusic.slice(
    safeMusicPage * MUSIC_PER_PAGE,
    safeMusicPage * MUSIC_PER_PAGE + MUSIC_PER_PAGE
  );

  const filteredSfx = sfxResults.filter((s) => {
    if (sfxFilter === 'favs') return favoriteSoundIds.includes(s.id);
    if (sfxFilter === 'all') return true;
    return s.category === sfxFilter;
  });

  const totalSfxPages = Math.max(1, Math.ceil(filteredSfx.length / MUSIC_PER_PAGE));
  const safeSfxPage = Math.min(sfxPage, totalSfxPages - 1);
  const visibleSfx = filteredSfx.slice(
    safeSfxPage * MUSIC_PER_PAGE,
    safeSfxPage * MUSIC_PER_PAGE + MUSIC_PER_PAGE
  );

  const STICKER_LIST: StickerItem[] = [
    { id: 'stk_1', emoji: '🔥', name: 'Feu', category: 'Viral', duration: 3 },
    { id: 'stk_2', emoji: '🚀', name: 'Fusée', category: 'Viral', duration: 3 },
    { id: 'stk_3', emoji: '💡', name: 'Idée', category: 'Viral', duration: 4 },
    { id: 'stk_4', emoji: '💯', name: '100%', category: 'Viral', duration: 2.5 },
    { id: 'stk_5', emoji: '⚡', name: 'Éclair', category: 'Viral', duration: 2 },
    { id: 'stk_6', emoji: '🎯', name: 'Cible', category: 'Viral', duration: 3.5 },
    { id: 'stk_7', emoji: '👉', name: 'Pointeur', category: 'Pointeurs', duration: 3 },
    { id: 'stk_8', emoji: '⬇️', name: 'Flèche Bas', category: 'Pointeurs', duration: 3 },
    { id: 'stk_9', emoji: '🔔', name: 'Cloche', category: 'CTA', duration: 4 },
    { id: 'stk_10', emoji: '👍', name: 'Pouce', category: 'CTA', duration: 3 },
    { id: 'stk_11', emoji: '⭐', name: 'Étoile', category: 'Badges', duration: 3 },
    { id: 'stk_12', emoji: '✨', name: 'Éclat', category: 'Badges', duration: 3 },
  ];

  const VIDEO_EFFECTS = [
    { id: 'none', name: 'Aucun effet', cat: 'motion' },
    { id: 'zoom_crash', name: 'Crash Zoom', cat: 'motion' },
    { id: 'shake', name: 'Shake Caméra', cat: 'motion' },
    { id: 'pulse_beat', name: 'Pulse au Beat', cat: 'motion' },
    { id: 'vhs_glitch', name: 'Glitch Rétro', cat: 'distortion' },
    { id: 'rgb_split', name: 'Aberration RGB', cat: 'distortion' },
    { id: 'mirror', name: 'Miroir', cat: 'distortion' },
    { id: 'blur_bg', name: 'Flou Bokeh', cat: 'blur' },
    { id: 'motion_blur', name: 'Flou Cinétique', cat: 'blur' },
    { id: 'radial_blur', name: 'Flou Radial', cat: 'blur' },
  ];

  const BODY_EFFECTS = [
    { id: 'none', name: 'Aucun effet corporel' },
    { id: 'neon_outline', name: 'Contour Néon' },
    { id: 'energy_halo', name: 'Halo Doré' },
    { id: 'clone_echo', name: 'Clone Multiple' },
    { id: 'electric_aura', name: 'Aura Bleue' },
  ];

  const FILTERS_LIST = [
    { id: 'normal', name: 'Naturel', cat: 'film', css: '' },
    { id: 'teal_orange', name: 'Cinéma Teal & Orange', cat: 'film', css: 'contrast(1.15) saturate(1.25) hue-rotate(-8deg)' },
    { id: 'film_400', name: 'Pellicule 400 Film', cat: 'film', css: 'contrast(1.08) saturate(1.15) sepia(0.15)' },
    { id: 'golden', name: 'Golden Hour', cat: 'film', css: 'sepia(0.28) saturate(1.35) brightness(1.05)' },
    { id: 'retro_vhs', name: 'Rétro Analogique', cat: 'retro', css: 'contrast(1.2) saturate(0.85) sepia(0.25)' },
    { id: 'super8', name: 'Super 8 Vintage', cat: 'retro', css: 'sepia(0.45) contrast(1.18) brightness(0.95)' },
    { id: 'mmv_bw', name: 'N&B 35mm Look MMV', cat: 'mmv_bw', css: 'grayscale(1) contrast(1.38) brightness(0.96)' },
    { id: 'mmv_noir', name: 'Charcoal Noir MMV', cat: 'mmv_bw', css: 'grayscale(1) contrast(1.55) brightness(0.88)' },
  ];

  const TRANSITIONS_LIST: Array<{ id: ClipTransitionType; label: string }> = [
    { id: 'cut', label: 'Coupe franche' },
    { id: 'masking', label: 'Masquage' },
    { id: 'slide', label: 'Glisser' },
    { id: 'push', label: 'Pousser' },
    { id: 'zoom_in', label: 'Zoom avant' },
    { id: 'zoom_out', label: 'Zoom arrière' },
    { id: 'fade', label: 'Fondu' },
    { id: 'white_flash', label: 'Flash blanc' },
  ];

  const computeMonitorCssFilter = (filterOverride?: string, effectOverride?: string) => {
    const fId = filterOverride ?? activeFilter;
    const eId = effectOverride ?? activeEffect;
    const fObj = FILTERS_LIST.find((f) => f.id === fId);
    const baseFilter = fObj?.css || '';
    const tempSepia = adjustments.temperature > 0 ? `sepia(${(adjustments.temperature / 100).toFixed(2)})` : '';
    const tempHue = adjustments.temperature < 0 ? `hue-rotate(${adjustments.temperature}deg)` : '';
    const blurPx = activeScene?.motionBlur ? `blur(${(activeScene.motionBlur / 15).toFixed(1)}px)` : '';
    const effectFilter =
      eId === 'rgb_split'
        ? 'hue-rotate(25deg) contrast(1.25)'
        : eId === 'vhs_glitch'
        ? 'contrast(1.35) saturate(1.4)'
        : eId === 'blur_bg' || eId === 'motion_blur' || eId === 'radial_blur'
        ? 'blur(1.8px)'
        : '';

    return [
      `brightness(${adjustments.brightness}%)`,
      `contrast(${adjustments.contrast + adjustments.sharpness * 0.25}%)`,
      `saturate(${adjustments.saturation}%)`,
      baseFilter,
      tempSepia,
      tempHue,
      blurPx,
      effectFilter,
    ]
      .filter(Boolean)
      .join(' ');
  };

  const computeMonitorClipPath = () => {
    const mask = activeScene?.mask;
    if (!mask || mask.type === 'none') return undefined;
    if (mask.type === 'circle') {
      return `circle(${Math.max(15, mask.scale / 2)}% at ${mask.x}% ${mask.y}%)`;
    }
    const inset = Math.max(0, Math.round((100 - mask.scale) / 2));
    return `inset(${inset}% ${inset}% ${inset}% ${inset}% round 16px)`;
  };

  // VIEW 1: CREATION DE VISUELS (Scrollable vertical workspace, Andrea AI on left, 18 frames, Éléments + GIFs, Effets, Filtres, Multi-diaporamas)
  if (viewMode === 'fullscreen_studio') {
    const filteredFrames = VISUAL_FRAMES.filter((frm) =>
      frameCategoryFilter === 'all' ? true : frm.category === frameCategoryFilter
    );

    const filteredElements = VISUAL_ELEMENTS.filter((el) => {
      if (elementFilter !== 'all' && el.kind !== elementFilter) return false;
      if (elementQuery.trim()) {
        const q = elementQuery.toLowerCase();
        return el.name.toLowerCase().includes(q) || el.category.toLowerCase().includes(q);
      }
      return true;
    });

    const filteredStudioFilters = FILTERS_LIST.filter((fl) =>
      filterCategory === 'all' ? true : fl.cat === filterCategory
    );

    const filteredStudioEffects = VIDEO_EFFECTS.filter((ef) =>
      effectCategory === 'body' ? true : ef.cat === effectCategory
    );

    const activeFrameObj = VISUAL_FRAMES.find((f) => f.id === activeSlide.frameId) || VISUAL_FRAMES[0];
    const selectedPlacedElement = activeSlide.elements.find((e) => e.uid === selectedElementUid) || null;

    const getCanvasSizeClasses = (frameId: string) => {
      if (frameId === '9:16' || frameId === 'story_highlight' || frameId === 'duo_v' || frameId === 'pip_frame') {
        return 'w-[215px] sm:w-[240px] h-[365px] sm:h-[405px]';
      }
      if (frameId === '1:1' || frameId === 'duo_h' || frameId === 'grid_4' || frameId === 'grid_9' || frameId === 'pip_double') {
        return 'w-[270px] sm:w-[320px] h-[270px] sm:h-[320px]';
      }
      if (frameId === '3:4') {
        return 'w-[240px] sm:w-[270px] h-[320px] sm:h-[360px]';
      }
      if (frameId === '4:5' || frameId === 'grid_6') {
        return 'w-[245px] sm:w-[275px] h-[310px] sm:h-[345px]';
      }
      if (frameId === '16:9' || frameId === 'trio_col' || frameId === 'yt_thumb') {
        return 'w-full max-w-[390px] h-[220px]';
      }
      if (frameId === '2.39:1') {
        return 'w-full max-w-[400px] h-[170px]';
      }
      if (frameId === '3:1') {
        return 'w-full max-w-[400px] h-[145px]';
      }
      if (frameId === 'polaroid') {
        return 'w-[250px] sm:w-[280px] h-[335px] ring-8 ring-[#f8fafc] border-b-[28px] !border-b-[#f8fafc]';
      }
      if (frameId === 'circle_focus' || frameId === 'circle') {
        return 'w-[260px] sm:w-[300px] h-[260px] sm:h-[300px] !rounded-full';
      }
      if (frameId === 'arch_frame' || frameId === 'arch') {
        return 'w-[240px] sm:w-[270px] h-[350px] !rounded-t-full !rounded-b-2xl';
      }
      return 'w-[250px] sm:w-[280px] h-[335px]';
    };

    const handleStudioCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const elementId = e.dataTransfer.getData('application/x-andrea-element') || e.dataTransfer.getData('text/plain');
      const item = VISUAL_ELEMENTS.find((x) => x.id === elementId);
      if (!item || !studioCanvasRef.current) return;
      const rect = studioCanvasRef.current.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const yPct = ((e.clientY - rect.top) / rect.height) * 100;
      handleInsertElementToSlide(item, xPct, yPct);
    };

    const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      const uid = draggingElemRef.current;
      if (!uid || !studioCanvasRef.current) return;
      const rect = studioCanvasRef.current.getBoundingClientRect();
      const xPct = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(6, Math.min(94, ((e.clientY - rect.top) / rect.height) * 100));
      updateActiveSlide({
        elements: activeSlide.elements.map((el) => (el.uid === uid ? { ...el, x: Math.round(xPct), y: Math.round(yPct) } : el)),
      });
    };

    return (
      <div className="h-full flex flex-col gap-2.5 max-w-7xl mx-auto overflow-y-auto overflow-x-hidden pr-0.5 pb-4">
        {/* Top Bar */}
        <div className="shrink-0 p-2.5 bg-[#0a0e24] border border-[#1d2757] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setViewMode('montage')}
              className="text-slate-300 hover:text-white font-bold cursor-pointer whitespace-nowrap"
            >
              ← Revenir au Montage
            </button>
            <div className="hidden sm:block h-4 w-px bg-[#1d2757]" />
            <span className="font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Création de visuels</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-[#141c45] border border-[#2b3c8a] text-[10px] font-bold text-sky-300">
              {slides.length} diapo{slides.length > 1 ? 's' : ''} · {activeFrameObj.ratio}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {statusToast && (
              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                {statusToast}
              </span>
            )}
            <button
              onClick={handleExportActiveSlidePng}
              className="px-3.5 py-1.5 bg-[#2036a1] hover:bg-[#2c48bf] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter PNG</span>
            </button>
          </div>
        </div>

        {/* Main Scrollable Workspace: Left Andrea AI + Center Tools + Right Canvas & Diaporamas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* LEFT: ESPACE ANDREA IA (Toujours visible à gauche) */}
          <div className="lg:col-span-3 bg-[#0d122c] border border-[#1e2754] rounded-2xl p-3 flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Espace Andrea IA · Visuels</span>
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() =>
                    setAssistantMessages((prev) => [
                      ...prev.slice(-1),
                      'Idée de visuel : Titre fort en haut, image/GIF central et contraste néon.',
                    ])
                  }
                  className="px-2 py-1.5 rounded-lg bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <Lightbulb className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">Idée</span>
                </button>
                <button
                  onClick={handleCreateAutoDiaporama}
                  className="px-2 py-1.5 rounded-lg bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <CopyPlus className="w-3 h-3 text-sky-300 shrink-0" />
                  <span className="truncate">Diaporama</span>
                </button>
                <button
                  onClick={() => {
                    const demoText = chatPrompt.trim() || 'Nouveau visuel créatif';
                    updateActiveSlide({
                      texts: [
                        ...activeSlide.texts,
                        {
                          id: `txt_${Date.now()}`,
                          text: demoText,
                          style: 'Titre',
                          startTime: 0,
                          duration: 5,
                          x: 50,
                          y: 50,
                          fontSize,
                          color: textColor,
                        },
                      ],
                    });
                    setAssistantMessages((prev) => [
                      ...prev.slice(-1),
                      `Texte « ${demoText} » ajouté sur ${activeSlide.title}.`,
                    ]);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3 text-purple-300 shrink-0" />
                  <span className="truncate">Appliquer</span>
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="studio-illustrate-text" className="text-[11px] font-bold text-slate-300">
                    Texte à illustrer
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteToIllustrate}
                    className="px-2 py-0.5 rounded-md bg-[#172152] hover:bg-[#223073] border border-[#2b3c8a] text-[10px] font-bold text-sky-300 cursor-pointer"
                  >
                    Coller
                  </button>
                </div>
                <textarea
                  id="studio-illustrate-text"
                  ref={illustrateTextareaRef}
                  rows={3}
                  value={illustrateText}
                  onChange={(e) => setIllustrateText(e.target.value)}
                  placeholder="Collez ici votre texte (chaque phrase créera une diapo illustrée logiquement)..."
                  className="w-full px-2.5 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white placeholder-slate-400 text-[11px] resize-none focus:outline-none focus:border-sky-400"
                />
                <select
                  value={illustrationStyle}
                  onChange={(e) => setIllustrationStyle(e.target.value as OpuscarStyleId)}
                  aria-label="Style d'illustration"
                  className="w-full px-2.5 py-1.5 bg-[#172152] border border-[#2b3c8a] rounded-xl text-white text-[11px] cursor-pointer"
                >
                  {ILLUSTRATION_STYLES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleIllustrateText}
                  disabled={isIllustrating}
                  className="w-full px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold rounded-xl text-[11px] cursor-pointer"
                >
                  {isIllustrating ? 'Création...' : 'Illustrer votre texte'}
                </button>
              </div>

              <div className="p-2.5 bg-[#151c44] border border-[#273473] rounded-xl text-[11px] text-slate-200 leading-relaxed">
                {assistantMessages[assistantMessages.length - 1]}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatPrompt.trim()) {
                    const p = chatPrompt;
                    setChatPrompt('');
                    setAssistantMessages((prev) => [
                      ...prev.slice(-1),
                      `Andrea : Ajustement visuel appliqué pour « ${p} ».`,
                    ]);
                  }
                }}
                placeholder="Demander à Andrea..."
                className="w-full pl-3 pr-8 py-2 bg-[#171f4c] border border-[#293675] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4255b3]"
              />
              <button
                onClick={() => {
                  if (chatPrompt.trim()) {
                    const p = chatPrompt;
                    setChatPrompt('');
                    setAssistantMessages((prev) => [
                      ...prev.slice(-1),
                      `Andrea : Ajustement visuel appliqué pour « ${p} ».`,
                    ]);
                  }
                }}
                className="absolute right-2.5 top-2 text-sky-400 hover:text-white cursor-pointer"
              >
                ➤
              </button>
            </div>
          </div>

          {/* CENTER: OUTILS (Cadres, Texte, Éléments + GIFs, Effets, Filtres) */}
          <div className="lg:col-span-4 bg-[#0a0f26] border border-[#1d2757] rounded-2xl p-3 flex flex-col gap-3">
            {/* 5 Tool Tabs */}
            <div className="grid grid-cols-5 gap-1 bg-[#090d1f] p-1 rounded-xl border border-[#1d2757]">
              {[
                { id: 'cadres' as const, label: 'Cadres', icon: Layers, color: 'text-sky-400' },
                { id: 'texte' as const, label: 'Texte', icon: Type, color: 'text-amber-400' },
                { id: 'elements' as const, label: 'Éléments', icon: Shapes, color: 'text-pink-400' },
                { id: 'effets' as const, label: 'Effets', icon: Sparkles, color: 'text-purple-400' },
                { id: 'filtres' as const, label: 'Filtres', icon: Sliders, color: 'text-emerald-400' },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeStudioTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveStudioTab(t.id)}
                    className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                      active ? 'bg-[#1b2766] text-white shadow' : 'text-slate-400 hover:bg-[#12183b]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span className="truncate max-w-full">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: CADRES (18 cadres + fonds de diapo) */}
            {activeStudioTab === 'cadres' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-white">Cadres ({filteredFrames.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'Standard', 'Réseaux', 'Collage', 'Créatif'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFrameCategoryFilter(cat)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                          frameCategoryFilter === cat ? 'bg-[#2563eb] text-white' : 'bg-[#141c45] text-slate-300'
                        }`}
                      >
                        {cat === 'all' ? 'Tout' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[310px] overflow-y-auto pr-1">
                  {filteredFrames.map((frm) => {
                    const selected = activeSlide.frameId === frm.id;
                    return (
                      <button
                        key={frm.id}
                        onClick={() => updateActiveSlide({ frameId: frm.id })}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer flex items-center justify-between gap-2 transition-all ${
                          selected
                            ? 'bg-[#182561] border-[#38bdf8] text-white shadow'
                            : 'bg-[#101638] border-[#222c5e] text-slate-300 hover:bg-[#151e4a]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-extrabold text-white truncate">{frm.title}</div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {frm.category} · {frm.ratio}
                          </div>
                        </div>
                        {selected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-[#1d2757] space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 block">Fonds de diapo</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {SLIDE_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => updateActiveSlide({ bgCss: bg.css })}
                        title={bg.label}
                        aria-label={`Fond ${bg.label}`}
                        style={{ background: bg.css }}
                        className={`h-7 rounded-lg border cursor-pointer transition-transform hover:scale-105 ${
                          activeSlide.bgCss === bg.css ? 'border-white ring-2 ring-sky-400' : 'border-white/25'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: TEXTE */}
            {activeStudioTab === 'texte' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 bg-[#0f1536] border border-[#232f6b] p-2 rounded-xl">
                  <select
                    value={fontFamily}
                    aria-label="Police de texte"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFontFamily(val);
                      updateSelectedTextOverlay({ fontFamily: val });
                    }}
                    className="px-2 py-1 bg-[#172152] border border-[#2b3c8a] rounded-lg text-white font-bold text-[11px] cursor-pointer"
                  >
                    <option value="Impact">Impact</option>
                    <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="'Playfair Display', serif">Playfair Display</option>
                    <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                  </select>

                  <div className="flex items-center bg-[#172152] border border-[#2b3c8a] rounded-lg px-1.5 py-0.5 tabular-nums">
                    <button
                      type="button"
                      aria-label="Réduire la taille du texte"
                      onClick={() => {
                        const next = Math.max(12, fontSize - 2);
                        setFontSize(next);
                        updateSelectedTextOverlay({ fontSize: next });
                      }}
                      className="px-1 text-slate-300 hover:text-white font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-1.5 font-mono text-white font-bold text-[11px]">{fontSize}</span>
                    <button
                      type="button"
                      aria-label="Augmenter la taille du texte"
                      onClick={() => {
                        const next = Math.min(72, fontSize + 2);
                        setFontSize(next);
                        updateSelectedTextOverlay({ fontSize: next });
                      }}
                      className="px-1 text-slate-300 hover:text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 bg-[#172152] border border-[#2b3c8a] rounded-lg p-0.5">
                    <button
                      type="button"
                      aria-label="Gras"
                      onClick={() => {
                        const next = !isBold;
                        setIsBold(next);
                        updateSelectedTextOverlay({ isBold: next });
                      }}
                      className={`p-1 rounded cursor-pointer ${isBold ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <Bold className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Italique"
                      onClick={() => {
                        const next = !isItalic;
                        setIsItalic(next);
                        updateSelectedTextOverlay({ isItalic: next });
                      }}
                      className={`p-1 rounded cursor-pointer ${isItalic ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <Italic className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Souligné"
                      onClick={() => {
                        const next = !isUnderline;
                        setIsUnderline(next);
                        updateSelectedTextOverlay({ isUnderline: next });
                      }}
                      className={`p-1 rounded cursor-pointer ${isUnderline ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <Underline className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Barré"
                      onClick={() => {
                        const next = !isStrikethrough;
                        setIsStrikethrough(next);
                        updateSelectedTextOverlay({ isStrikethrough: next });
                      }}
                      className={`p-1 rounded cursor-pointer ${isStrikethrough ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <Strikethrough className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-0.5 bg-[#172152] border border-[#2b3c8a] rounded-lg p-0.5">
                    <button
                      type="button"
                      aria-label="Aligner à gauche"
                      onClick={() => {
                        setTextAlign('left');
                        updateSelectedTextOverlay({ textAlign: 'left' });
                      }}
                      className={`p-1 rounded cursor-pointer ${textAlign === 'left' ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <AlignLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Centrer"
                      onClick={() => {
                        setTextAlign('center');
                        updateSelectedTextOverlay({ textAlign: 'center' });
                      }}
                      className={`p-1 rounded cursor-pointer ${textAlign === 'center' ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <AlignCenter className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Aligner à droite"
                      onClick={() => {
                        setTextAlign('right');
                        updateSelectedTextOverlay({ textAlign: 'right' });
                      }}
                      className={`p-1 rounded cursor-pointer ${textAlign === 'right' ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <AlignRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Justifier"
                      onClick={() => {
                        setTextAlign('justify');
                        updateSelectedTextOverlay({ textAlign: 'justify' });
                      }}
                      className={`p-1 rounded cursor-pointer ${textAlign === 'justify' ? 'bg-[#3b82f6] text-white' : 'text-slate-300'}`}
                    >
                      <AlignJustify className="w-3 h-3" />
                    </button>
                  </div>

                  <label className="flex items-center gap-1 bg-[#172152] border border-[#2b3c8a] px-1.5 py-0.5 rounded-lg cursor-pointer" title="Couleur du texte">
                    <span className="font-bold text-[11px]" style={{ color: textColor }}>A</span>
                    <input
                      type="color"
                      aria-label="Couleur du texte"
                      value={textColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTextColor(val);
                        updateSelectedTextOverlay({ color: val });
                      }}
                      className="w-3.5 h-3.5 border-0 bg-transparent cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center gap-1 bg-[#172152] border border-[#2b3c8a] px-1.5 py-0.5 rounded-lg cursor-pointer" title="Surlignage">
                    <Highlighter className="w-3 h-3 text-amber-300" />
                    <input
                      type="color"
                      aria-label="Couleur de surlignage"
                      value={highlightColor === 'transparent' ? '#000000' : highlightColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHighlightColor(val);
                        updateSelectedTextOverlay({ highlightColor: val });
                      }}
                      className="w-3.5 h-3.5 border-0 bg-transparent cursor-pointer"
                    />
                  </label>
                  {highlightColor !== 'transparent' && (
                    <button
                      type="button"
                      onClick={() => {
                        setHighlightColor('transparent');
                        updateSelectedTextOverlay({ highlightColor: 'transparent' });
                      }}
                      className="px-1.5 py-0.5 rounded bg-[#172152] text-[10px] text-slate-300 hover:text-white cursor-pointer"
                      title="Retirer surlignage"
                    >
                      Sans fond
                    </button>
                  )}
                </div>

                {activeTextId && activeSlide.texts.some((t) => t.id === activeTextId) && (
                  <div className="space-y-1 p-2 rounded-xl bg-[#101638] border border-[#38bdf8]/50">
                    <div className="text-[10px] font-bold text-sky-300">Modifier le texte sélectionné</div>
                    <input
                      type="text"
                      value={activeSlide.texts.find((t) => t.id === activeTextId)?.text || ''}
                      onChange={(e) => updateSelectedTextOverlay({ text: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-lg text-white text-xs"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    value={customTextInput}
                    onChange={(e) => setCustomTextInput(e.target.value)}
                    placeholder="Saisir un nouveau texte..."
                    className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = customTextInput.trim() || 'Votre texte';
                      const newT: TextOverlay = {
                        id: `txt_${Date.now()}`,
                        text: val,
                        style: 'Personnalisé',
                        startTime: 0,
                        duration: 5,
                        x: 50,
                        y: 50,
                        fontSize,
                        color: textColor,
                        fontFamily,
                        isBold,
                        isItalic,
                        isUnderline,
                        isStrikethrough,
                        textAlign,
                        highlightColor,
                      };
                      updateActiveSlide({ texts: [...activeSlide.texts, newT] });
                      setActiveTextId(newT.id);
                      setCustomTextInput('');
                    }}
                    className="w-full py-2 bg-[#2036a1] hover:bg-[#2c48bf] text-white font-bold rounded-xl cursor-pointer"
                  >
                    + Ajouter ce texte sur la diapo
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {activeSlide.texts.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => selectTextOverlay(t)}
                      className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer ${
                        activeTextId === t.id ? 'bg-[#182561] border-[#344fb8]' : 'bg-[#101638] border-[#222c5e]'
                      }`}
                    >
                      <span className="truncate font-bold text-white">{t.text}</span>
                      <button
                        type="button"
                        aria-label="Supprimer le texte"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateActiveSlide({ texts: activeSlide.texts.filter((x) => x.id !== t.id) });
                          if (activeTextId === t.id) setActiveTextId('');
                        }}
                        className="text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: ÉLÉMENTS (Petites images + GIFs animés glissables ou cliquables) */}
            {activeStudioTab === 'elements' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-white">Éléments &amp; GIFs ({filteredElements.length})</span>
                  <div className="flex gap-1">
                    {[
                      { id: 'all' as const, label: 'Tout' },
                      { id: 'image' as const, label: 'Images' },
                      { id: 'gif' as const, label: 'GIFs' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setElementFilter(f.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                          elementFilter === f.id ? 'bg-[#2563eb] text-white' : 'bg-[#141c45] text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={elementQuery}
                    onChange={(e) => setElementQuery(e.target.value)}
                    placeholder="Rechercher image, icône, GIF..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white text-xs"
                  />
                </div>

                <p className="text-[10px] text-sky-300/90">
                  Glissez un élément vers le visuel à droite ou cliquez dessus pour l’ajouter.
                </p>

                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {filteredElements.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/x-andrea-element', item.id);
                        e.dataTransfer.setData('text/plain', item.id);
                      }}
                      onClick={() => handleInsertElementToSlide(item)}
                      className="p-2 rounded-xl bg-[#101638] hover:bg-[#172152] border border-[#222c5e] hover:border-sky-400 cursor-grab active:cursor-grabbing flex flex-col items-center gap-1 transition-all group"
                    >
                      <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-[#090d1f] p-1">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                        {item.kind === 'gif' && (
                          <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded bg-pink-600 text-[8px] font-black text-white">
                            GIF
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-200 truncate max-w-full group-hover:text-white">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: EFFETS (Remis dans Création de visuels) */}
            {activeStudioTab === 'effets' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-white">Effets visuels</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'motion' as const, label: 'Mouvement' },
                      { id: 'distortion' as const, label: 'Distorsion' },
                      { id: 'blur' as const, label: 'Flou' },
                      { id: 'body' as const, label: 'Corporels' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setEffectCategory(c.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                          effectCategory === c.id ? 'bg-[#2563eb] text-white' : 'bg-[#141c45] text-slate-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {effectCategory === 'body' ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {BODY_EFFECTS.map((be) => (
                      <button
                        key={be.id}
                        onClick={() => updateActiveSlide({ bodyEffectId: be.id })}
                        className={`p-2 rounded-xl border font-bold text-left cursor-pointer ${
                          activeSlide.bodyEffectId === be.id
                            ? 'bg-[#182561] border-[#38bdf8] text-white'
                            : 'bg-[#101638] border-[#222c5e] text-slate-300'
                        }`}
                      >
                        {be.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredStudioEffects.map((ef) => (
                      <button
                        key={ef.id}
                        onClick={() => updateActiveSlide({ effectId: ef.id })}
                        className={`p-2 rounded-xl border font-bold text-left cursor-pointer ${
                          activeSlide.effectId === ef.id
                            ? 'bg-[#182561] border-[#38bdf8] text-white'
                            : 'bg-[#101638] border-[#222c5e] text-slate-300'
                        }`}
                      >
                        {ef.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="pt-1 border-t border-[#1d2757] flex items-center justify-between text-[11px] text-slate-300">
                  <span>Effet actif : <strong className="text-sky-300">{activeSlide.effectId}</strong></span>
                  <button
                    onClick={() => updateActiveSlide({ effectId: 'none', bodyEffectId: 'none' })}
                    className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                  >
                    Retirer effets
                  </button>
                </div>
              </div>
            )}

            {/* Tab 5: FILTRES */}
            {activeStudioTab === 'filtres' && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-white">Filtres visuels</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all' as const, label: 'Tous' },
                      { id: 'film' as const, label: 'Film' },
                      { id: 'retro' as const, label: 'Rétro' },
                      { id: 'mmv_bw' as const, label: 'N&B' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setFilterCategory(c.id)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                          filterCategory === c.id ? 'bg-[#2563eb] text-white' : 'bg-[#141c45] text-slate-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                  {filteredStudioFilters.map((fl) => (
                    <button
                      key={fl.id}
                      onClick={() => updateActiveSlide({ filterId: fl.id })}
                      className={`p-2 rounded-xl border font-bold text-left cursor-pointer truncate ${
                        activeSlide.filterId === fl.id
                          ? 'bg-[#182561] border-[#38bdf8] text-white'
                          : 'bg-[#101638] border-[#222c5e] text-slate-300'
                      }`}
                    >
                      {fl.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CANVAS INTERACTIF + BARRE DIAPORAMA STYLE CANVA */}
          <div className="lg:col-span-5 bg-[#060914] border border-[#1d2757] rounded-2xl p-3.5 flex flex-col items-center gap-3">
            {/* Active Slide Canvas */}
            <div className="w-full flex items-center justify-center py-2">
              <div
                ref={studioCanvasRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleStudioCanvasDrop}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={() => {
                  draggingElemRef.current = null;
                }}
                onPointerLeave={() => {
                  draggingElemRef.current = null;
                }}
                className={`studio-artwork-canvas rounded-3xl overflow-hidden relative shadow-2xl border border-slate-700 flex flex-col justify-center items-center p-4 text-center transition-all select-none ${getCanvasSizeClasses(
                  activeSlide.frameId
                )} ${activeSlide.effectId === 'shake' || activeSlide.effectId === 'pulse_beat' ? 'animate-pulse' : ''} ${
                  activeSlide.effectId === 'zoom_crash' ? 'scale-[1.03]' : ''
                } ${activeSlide.effectId === 'mirror' ? '-scale-x-100' : ''}`}
                style={{
                  background: activeSlide.bgCss,
                  filter: computeMonitorCssFilter(activeSlide.filterId, activeSlide.effectId),
                  boxShadow:
                    activeSlide.bodyEffectId === 'neon_outline'
                      ? '0 0 24px rgba(56, 189, 248, 0.7)'
                      : activeSlide.bodyEffectId === 'energy_halo'
                      ? '0 0 28px rgba(250, 204, 21, 0.65)'
                      : activeSlide.bodyEffectId === 'electric_aura'
                      ? '0 0 26px rgba(96, 165, 250, 0.75)'
                      : activeSlide.bodyEffectId === 'clone_echo'
                      ? '10px 10px 0 rgba(139, 92, 246, 0.35), -8px -8px 0 rgba(56, 189, 248, 0.25)'
                      : undefined,
                  outline:
                    activeSlide.bodyEffectId === 'neon_outline'
                      ? '3px solid #38bdf8'
                      : activeSlide.bodyEffectId === 'energy_halo'
                      ? '3px solid #facc15'
                      : activeSlide.bodyEffectId === 'electric_aura'
                      ? '3px solid #60a5fa'
                      : activeSlide.bodyEffectId === 'clone_echo'
                      ? '2px dashed #c084fc'
                      : undefined,
                }}
              >
                {/* Frame internal grid overlays for collage/split frames */}
                {activeSlide.frameId === 'duo_h' && (
                  <div className="absolute inset-0 grid grid-cols-2 pointer-events-none">
                    <div className="border-r border-white/25" />
                    <div />
                  </div>
                )}
                {activeSlide.frameId === 'duo_v' && (
                  <div className="absolute inset-0 grid grid-rows-2 pointer-events-none">
                    <div className="border-b border-white/25" />
                    <div />
                  </div>
                )}
                {activeSlide.frameId === 'trio_col' && (
                  <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
                    <div className="border-r border-white/25" />
                    <div className="border-r border-white/25" />
                    <div />
                  </div>
                )}
                {activeSlide.frameId === 'trio_asym' && (
                  <div className="absolute inset-0 grid grid-cols-2 pointer-events-none">
                    <div className="border-r border-white/25" />
                    <div className="grid grid-rows-2">
                      <div className="border-b border-white/25" />
                      <div />
                    </div>
                  </div>
                )}
                {activeSlide.frameId === 'grid_4' && (
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                    <div className="border-r border-b border-white/20" />
                    <div className="border-b border-white/20" />
                    <div className="border-r border-white/20" />
                    <div />
                  </div>
                )}
                {activeSlide.frameId === 'grid_6' && (
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((cell) => (
                      <div key={cell} className="border border-white/15" />
                    ))}
                  </div>
                )}
                {activeSlide.frameId === 'grid_9' && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                      <div key={cell} className="border border-white/15" />
                    ))}
                  </div>
                )}
                {(activeSlide.frameId === 'pip_frame' || activeSlide.frameId === 'pip_double') && (
                  <div className="absolute top-3 right-3 w-1/3 h-1/3 rounded-xl border-2 border-white/60 bg-black/35 pointer-events-none" />
                )}

                {/* Draggable placed elements (images & GIFs) */}
                {activeSlide.elements.map((el) => (
                  <div
                    key={el.uid}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      draggingElemRef.current = el.uid;
                      setSelectedElementUid(el.uid);
                    }}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.size}px`,
                      height: `${el.size}px`,
                      transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                    }}
                    className={`absolute z-10 cursor-move touch-none rounded-lg ${
                      selectedElementUid === el.uid ? 'ring-2 ring-sky-400 bg-sky-400/10' : ''
                    }`}
                  >
                    <img src={el.src} alt={el.name} className="w-full h-full object-contain pointer-events-none" />
                  </div>
                ))}

                {/* Text Overlays */}
                <div className="relative z-20 space-y-2 pointer-events-auto max-w-full px-2">
                  {activeSlide.texts.length === 0 && activeSlide.elements.length === 0 ? (
                    <p
                      className="text-[11px] px-2 font-medium"
                      style={{
                        color: activeSlide.bgCss === SLIDE_BACKGROUNDS[6].css ? '#334155' : 'rgba(226,232,240,0.85)',
                      }}
                    >
                      Glissez des images/GIFs depuis « Éléments » ou ajoutez un texte.
                    </p>
                  ) : (
                    activeSlide.texts.map((t) => {
                      const isSelected = activeTextId === t.id;
                      const decos = [
                        (t.isUnderline ?? (isSelected && isUnderline)) ? 'underline' : '',
                        (t.isStrikethrough ?? (isSelected && isStrikethrough)) ? 'line-through' : '',
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            selectTextOverlay(t);
                            setActiveStudioTab('texte');
                          }}
                          className={`cursor-pointer p-1 rounded ${
                            isSelected ? 'outline-2 outline-dashed outline-sky-400' : ''
                          }`}
                          style={{
                            fontFamily: t.fontFamily || fontFamily,
                            fontSize: `${t.fontSize}px`,
                            fontWeight: (t.isBold ?? true) ? 900 : 500,
                            fontStyle: t.isItalic ? 'italic' : 'normal',
                            textDecoration: decos || 'none',
                            textAlign: t.textAlign || 'center',
                            color: t.color,
                            backgroundColor: t.highlightColor || 'transparent',
                          }}
                        >
                          {t.text}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Selected Placed Element Quick Controls */}
            {selectedPlacedElement && (
              <div className="w-full p-2 bg-[#0d122c] border border-[#232f6b] rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-white truncate max-w-[120px]">{selectedPlacedElement.name}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateActiveSlide({
                        elements: activeSlide.elements.map((el) =>
                          el.uid === selectedPlacedElement.uid ? { ...el, size: Math.max(28, el.size - 10) } : el
                        ),
                      })
                    }
                    className="px-2 py-0.5 bg-[#141c45] rounded font-bold text-white cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-slate-300">{selectedPlacedElement.size}px</span>
                  <button
                    onClick={() =>
                      updateActiveSlide({
                        elements: activeSlide.elements.map((el) =>
                          el.uid === selectedPlacedElement.uid ? { ...el, size: Math.min(180, el.size + 10) } : el
                        ),
                      })
                    }
                    className="px-2 py-0.5 bg-[#141c45] rounded font-bold text-white cursor-pointer"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      updateActiveSlide({
                        elements: activeSlide.elements.map((el) =>
                          el.uid === selectedPlacedElement.uid ? { ...el, rotation: (el.rotation + 15) % 360 } : el
                        ),
                      })
                    }
                    className="px-2 py-0.5 bg-[#141c45] rounded font-bold text-sky-300 cursor-pointer"
                  >
                    ↻ 15°
                  </button>
                  <button
                    onClick={() => {
                      updateActiveSlide({
                        elements: activeSlide.elements.filter((el) => el.uid !== selectedPlacedElement.uid),
                      });
                      setSelectedElementUid(null);
                    }}
                    className="px-2 py-0.5 bg-rose-950 text-rose-300 rounded font-bold cursor-pointer"
                  >
                    Suppr.
                  </button>
                </div>
              </div>
            )}

            {/* Canva-style Multi-Slide Diaporama Strip */}
            <div className="w-full p-2.5 bg-[#0d122c] border border-[#1e2754] rounded-2xl space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-sky-400" />
                  <span>Diaporama ({slides.length} page{slides.length > 1 ? 's' : ''})</span>
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    onClick={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
                    disabled={slides.length <= 1}
                    className="px-2 py-1 rounded-lg bg-[#172152] disabled:opacity-40 text-white font-bold flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    {isSlideshowPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isSlideshowPlaying ? 'Stop' : 'Lire'}</span>
                  </button>
                  <button
                    onClick={handleDuplicateSlide}
                    title="Dupliquer la diapo"
                    className="p-1.5 rounded-lg bg-[#141c45] hover:bg-[#1e2966] text-slate-200 cursor-pointer"
                  >
                    <CopyPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(activeSlideIndex)}
                    disabled={slides.length <= 1}
                    title="Supprimer cette diapo"
                    className="p-1.5 rounded-lg bg-[#141c45] hover:bg-rose-950 disabled:opacity-30 text-rose-300 cursor-pointer"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleAddSlide}
                    className="px-2.5 py-1 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold flex items-center gap-1 cursor-pointer text-[11px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter diapo</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {slides.map((sl, idx) => (
                  <button
                    key={sl.id}
                    type="button"
                    onClick={() => {
                      setActiveSlideIndex(idx);
                      setSelectedElementUid(null);
                    }}
                    style={{ background: sl.bgCss }}
                    className={`studio-artwork-canvas shrink-0 w-16 h-16 rounded-xl border p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all ${
                      activeSlideIndex === idx ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105' : 'border-white/25 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span className="text-[9px] font-black text-white bg-black/55 px-1 rounded">
                      #{idx + 1}
                    </span>
                    <span className="text-[8px] font-bold text-white bg-black/45 px-1 rounded truncate max-w-full">
                      {sl.elements.length + sl.texts.length} élém.
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: MAIN MONTAGE STUDIO
  // STRICT ORDER: Top Bar -> Main Grid (Andrea + Grande Case) -> LA PISTE -> 8 BOUTONS DE MONTAGE
  const SCENES_PER_PAGE = 4;
  const totalScenePages = Math.max(1, Math.ceil(scenes.length / SCENES_PER_PAGE));
  const safeScenePage = Math.min(scenePage, totalScenePages - 1);
  const visibleScenes = scenes.slice(
    safeScenePage * SCENES_PER_PAGE,
    safeScenePage * SCENES_PER_PAGE + SCENES_PER_PAGE
  );

  const CLIPS_PER_PAGE = 4;
  const totalTrackPages = Math.max(1, Math.ceil(scenes.length / CLIPS_PER_PAGE));
  const safeTrackPage = Math.min(trackPage, totalTrackPages - 1);
  const visibleTrackScenes = scenes.slice(
    safeTrackPage * CLIPS_PER_PAGE,
    safeTrackPage * CLIPS_PER_PAGE + CLIPS_PER_PAGE
  );

  return (
    <div className="h-full min-h-0 flex flex-col gap-2 max-w-7xl mx-auto w-full overflow-y-auto overflow-x-hidden select-none pb-3 bea-scroll">
      {/* 1. TOP BAR (Sans bouton Réinitialiser, responsive sur téléphone) */}
      <div className="shrink-0 p-2 bg-[#0a0e24] border border-[#1d2757] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('fullscreen_studio')}
            className="px-3 py-1.5 rounded-xl bg-[#1b2b73] hover:bg-[#253a99] border border-[#384fa6] text-white font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Création de visuels</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusToast && (
            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
              {statusToast}
            </span>
          )}
          <button
            onClick={() => showToast('Aperçu Outro généré sur le moniteur.')}
            className="text-slate-300 hover:text-white flex items-center gap-1 font-bold cursor-pointer whitespace-nowrap px-2 py-1"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Aperçu Outro</span>
          </button>
          <button
            onClick={() => showToast('Exportation vidéo MP4 lancée.')}
            className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN GRID: ESPACE ANDREA IA + GRANDE CASE MONITEUR */}
      <div className="lg:flex-1 lg:min-h-[360px] grid grid-cols-1 lg:grid-cols-12 gap-2.5 lg:overflow-hidden">
        {/* Left: Espace Andrea IA */}
        <div className="lg:col-span-4 bg-[#0d122c] border border-[#1e2754] rounded-2xl p-3 flex flex-col justify-between gap-2 overflow-hidden">
          <div className="space-y-2 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Espace Andrea IA · Montage</span>
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() =>
                  setAssistantMessages((prev) => [
                    ...prev.slice(-1),
                    "Hook suggéré : « 90% font cette erreur dès les 3 premières secondes. »",
                  ])
                }
                className="px-2 py-1 rounded-lg bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <Lightbulb className="w-3 h-3 text-amber-300" />
                <span>Idée Hook</span>
              </button>
              <button
                onClick={() =>
                  setAssistantMessages((prev) => [
                    ...prev.slice(-1),
                    'Diaporama structuré en 4 visuels rythmés avec transitions rapides.',
                  ])
                }
                className="px-2 py-1 rounded-lg bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <ImageIcon className="w-3 h-3 text-sky-300" />
                <span>Diaporama</span>
              </button>
              <button
                onClick={() =>
                  setAssistantMessages((prev) => [
                    ...prev.slice(-1),
                    'Script : 0-3s Accroche · 3-15s Démonstration · 15-30s Action.',
                  ])
                }
                className="px-2 py-1 rounded-lg bg-[#1b2559] hover:bg-[#25337a] text-slate-200 border border-[#2b3a82] text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
              >
                <FileText className="w-3 h-3 text-purple-300" />
                <span>Script</span>
              </button>
            </div>

            {/* Illustrer votre texte (Zone de texte collé + style selector + bouton) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="montage-illustrate-text" className="text-[10px] font-bold text-slate-300">
                  Texte à illustrer
                </label>
                <button
                  type="button"
                  onClick={handlePasteToIllustrate}
                  className="px-2 py-0.5 rounded bg-[#172152] hover:bg-[#223073] border border-[#2b3c8a] text-[10px] font-bold text-sky-300 cursor-pointer"
                >
                  Coller
                </button>
              </div>
              <textarea
                id="montage-illustrate-text"
                ref={illustrateTextareaRef}
                rows={2}
                value={illustrateText}
                onChange={(e) => setIllustrateText(e.target.value)}
                placeholder="Collez ici le texte que vous venez de rédiger..."
                className="w-full px-2.5 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white placeholder-slate-400 text-[11px] resize-none focus:outline-none focus:border-sky-400"
              />
              <div className="flex items-center gap-1.5">
                <select
                  value={illustrationStyle}
                  onChange={(e) => setIllustrationStyle(e.target.value as OpuscarStyleId)}
                  aria-label="Style d'illustration"
                  className="flex-1 min-w-0 px-2 py-1.5 bg-[#172152] border border-[#2b3c8a] rounded-xl text-white text-[11px] cursor-pointer"
                >
                  {ILLUSTRATION_STYLES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleIllustrateText}
                  disabled={isIllustrating}
                  className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold rounded-xl text-[11px] cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isIllustrating ? 'Création...' : 'Illustrer votre texte'}
                </button>
              </div>
            </div>

            {/* Latest assistant message (no scrollbar) */}
            <div className="p-2.5 bg-[#151c44] border border-[#273473] rounded-xl text-[11px] text-slate-200 leading-snug line-clamp-3">
              {assistantMessages[assistantMessages.length - 1]}
            </div>
          </div>

          <div className="relative shrink-0">
            <input
              type="text"
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && chatPrompt.trim()) {
                  const p = chatPrompt;
                  setChatPrompt('');
                  setAssistantMessages((prev) => [
                    ...prev.slice(-1),
                    `Andrea : Réglage appliqué selon « ${p} ».`,
                  ]);
                }
              }}
              placeholder="Demander un ajustement à Andrea..."
              className="w-full pl-3 pr-8 py-1.5 bg-[#171f4c] border border-[#293675] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#4255b3]"
            />
            <button
              onClick={() => {
                if (chatPrompt.trim()) {
                  const p = chatPrompt;
                  setChatPrompt('');
                  setAssistantMessages((prev) => [
                    ...prev.slice(-1),
                    `Andrea : Réglage appliqué selon « ${p} ».`,
                  ]);
                }
              }}
              className="absolute right-2.5 top-1.5 text-sky-400 hover:text-white cursor-pointer"
            >
              ➤
            </button>
          </div>
        </div>

        {/* Center/Right: Grande Case (Moniteur / Dropzone) */}
        <div className="lg:col-span-8 bg-[#0d122c] border border-[#1e2754] rounded-2xl p-3 flex flex-col justify-between overflow-hidden">
          {scenes.length > 0 ? (
            <div className="h-full flex flex-col gap-2 overflow-hidden">
              <div className="shrink-0 flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate">
                  Moniteur : {videoName || 'Séquence active'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sky-400 font-mono tabular-nums text-[11px]">
                    {scenes.length} plans · {activeScene?.cropRatio || '9:16'} · {playbackSpeed}x
                  </span>
                  {totalScenePages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setScenePage((p) => Math.max(0, p - 1))}
                        disabled={safeScenePage === 0}
                        className="p-0.5 rounded bg-[#141c45] text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setScenePage((p) => Math.min(totalScenePages - 1, p + 1))}
                        disabled={safeScenePage >= totalScenePages - 1}
                        className="p-0.5 rounded bg-[#141c45] text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-h-0 flex items-center gap-3 overflow-hidden">
                {/* Monitor Frame */}
                <div
                  className={`relative bg-black rounded-2xl overflow-hidden border border-[#2b3c8a] shadow-2xl shrink-0 flex items-center justify-center ${
                    activeScene?.cropRatio === '16:9'
                      ? 'w-[240px] h-[135px]'
                      : activeScene?.cropRatio === '1:1'
                      ? 'w-[180px] h-[180px]'
                      : 'w-[130px] h-[225px]'
                  }`}
                >
                  <div
                    className={`w-full h-full relative flex items-center justify-center transition-all ${
                      activeScene?.isReversed ? '-scale-x-100' : ''
                    } ${activeEffect === 'shake' && isPlaying ? 'animate-pulse' : ''}`}
                    style={{
                      filter: computeMonitorCssFilter(),
                      clipPath: computeMonitorClipPath(),
                      outline:
                        activeBodyEffect === 'neon_outline'
                          ? '3px solid #38bdf8'
                          : activeBodyEffect === 'energy_halo'
                          ? '3px solid #facc15'
                          : undefined,
                    }}
                  >
                    {videoSrc ? (
                      <video
                        ref={videoPreviewRef}
                        src={videoSrc}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay={isPlaying}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-[#1e2759] to-[#090d1f] flex flex-col items-center justify-center p-2 text-center">
                        <Film className="w-6 h-6 text-sky-400 mb-1" />
                        <span className="text-[11px] font-bold text-white">Plan {activeScene?.sceneNumber}</span>
                      </div>
                    )}
                    {pipOverlayFile && (
                      <img
                        src={pipOverlayFile}
                        alt="Superposition"
                        className="absolute top-2 right-2 w-10 h-10 object-cover rounded-lg border border-white/40"
                        style={{ opacity: pipOpacity / 100 }}
                      />
                    )}
                  </div>

                  {adjustments.vignette > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 ${adjustments.vignette}px rgba(0,0,0,0.88)` }}
                    />
                  )}
                  {activeTransitionFlash === 'white_flash' && (
                    <div className="absolute inset-0 bg-white/80 animate-ping pointer-events-none" />
                  )}
                  <div className="absolute bottom-2 inset-x-1 text-center pointer-events-none">
                    {textOverlays.slice(0, 1).map((t) => (
                      <span
                        key={t.id}
                        className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black/60 inline-block max-w-full truncate"
                        style={{ color: t.color }}
                      >
                        {t.text}
                      </span>
                    ))}
                  </div>
                  {addedStickers.length > 0 && (
                    <div className="absolute top-2 left-2 text-base pointer-events-none">
                      {addedStickers[addedStickers.length - 1].emoji}
                    </div>
                  )}
                </div>

                {/* Scene Cards Grid (Max 4 per page, no scrollbars) */}
                <div className="flex-1 min-w-0 grid grid-cols-2 gap-2 overflow-hidden">
                  {visibleScenes.map((sc) => {
                    const realIdx = scenes.findIndex((x) => x.id === sc.id);
                    return (
                      <div
                        key={sc.id}
                        onClick={() => setActiveSceneIndex(realIdx)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          activeSceneIndex === realIdx
                            ? 'bg-[#1b2b73] border-[#384fa6] shadow-md'
                            : 'bg-[#101638] border-[#222c5e] hover:bg-[#151d47]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono mb-0.5 tabular-nums">
                          <span>PLAN 0{sc.sceneNumber}</span>
                          <span>{sc.duration}s</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">{sc.cameraMovement}</div>
                        <div className="text-[10px] text-slate-300 truncate">
                          Transition : {sc.transitionToNext || 'cut'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
              }}
              className={`w-full max-w-md mx-auto my-auto p-5 border-2 border-dashed rounded-2xl text-center space-y-2.5 transition-all ${
                isDragging ? 'border-sky-400 bg-sky-500/10' : 'border-[#293675] bg-[#090d1f]'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#172152] border border-[#2d3e91] flex items-center justify-center">
                <Upload className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Glisser ou déposer une vidéo ou photo</h4>
                <p className="text-[11px] text-slate-400">MP4, WebM, PNG, JPG</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  id="autoSubs"
                  checked={autoSubtitles}
                  onChange={(e) => setAutoSubtitles(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#3b82f6] cursor-pointer"
                />
                <label htmlFor="autoSubs" className="cursor-pointer font-bold">
                  Sous-titres automatiques
                </label>
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-950 font-black rounded-xl text-xs cursor-pointer"
                >
                  Parcourir mon appareil
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. LA PISTE (DIRECTLY BELOW GRANDE CASE, ABOVE MONTAGE BUTTONS) */}
      <div className="shrink-0 p-2.5 bg-[#0d122c] border border-[#1e2754] rounded-2xl space-y-1.5 overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 rounded-full bg-[#1e2a66] hover:bg-[#28388a] flex items-center justify-center text-white cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <button
              onClick={() => setCurrentTime(0)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Début"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold text-white tabular-nums">
              {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Piste ({scenes.length} plans · {addedSounds.length} sons · {textOverlays.length} textes)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-16 accent-sky-400"
              />
            </div>
            {totalTrackPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTrackPage((p) => Math.max(0, p - 1))}
                  disabled={safeTrackPage === 0}
                  className="p-1 rounded bg-[#141c45] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setTrackPage((p) => Math.min(totalTrackPages - 1, p + 1))}
                  disabled={safeTrackPage >= totalTrackPages - 1}
                  className="p-1 rounded bg-[#141c45] disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          className="w-full accent-[#38bdf8] cursor-pointer h-1.5"
        />

        {/* Clips + Audio + Text Strip (Responsive sur mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center overflow-hidden">
          <div className="lg:col-span-7 min-h-10 py-1 lg:py-0 lg:h-10 bg-[#0f1536] border border-[#202959] rounded-xl flex flex-wrap lg:flex-nowrap items-center gap-1.5 px-2 overflow-hidden">
            {visibleTrackScenes.length > 0 ? (
              visibleTrackScenes.map((sc, i) => {
                const realIdx = scenes.findIndex((x) => x.id === sc.id);
                return (
                  <React.Fragment key={sc.id}>
                    <div
                      onClick={() => setActiveSceneIndex(realIdx)}
                      className={`h-7 flex-1 min-w-[68px] px-2.5 rounded-lg border flex items-center justify-between text-[11px] font-bold cursor-pointer ${
                        activeSceneIndex === realIdx
                          ? 'bg-[#2563eb] text-white border-white'
                          : 'bg-[#182357] text-slate-300 border-[#2f4296]'
                      }`}
                    >
                      <span className="truncate">Plan {sc.sceneNumber}</span>
                      <span className="font-mono text-[10px] opacity-80 tabular-nums">{sc.duration}s</span>
                    </div>
                    {i < visibleTrackScenes.length - 1 && (
                      <button
                        onClick={() => {
                          setActiveSceneIndex(realIdx);
                          setActiveMenu('transitions');
                        }}
                        className="px-1 py-0.5 rounded bg-[#141c45] border border-[#2b3c8a] text-[10px] text-sky-300 cursor-pointer shrink-0"
                      >
                        ⇄
                      </button>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <span className="text-[11px] text-slate-400 truncate">
                Piste vide · Importez une vidéo, cliquez sur « Illustrer votre texte » ou « + Ajouter »
              </span>
            )}
          </div>

          <div className="lg:col-span-5 min-h-10 py-1 lg:py-0 lg:h-10 bg-[#101942] border border-[#233580] rounded-xl flex flex-wrap lg:flex-nowrap items-center gap-1.5 px-2 overflow-hidden text-[11px]">
            {addedSounds.slice(-2).map((snd) => (
              <div
                key={snd.id}
                onClick={() => {
                  setSelectedSoundId(snd.id);
                  setActiveMenu('audio');
                }}
                className={`px-2 py-1 rounded border font-bold truncate cursor-pointer flex items-center gap-1 max-w-[140px] ${
                  selectedSoundId === snd.id
                    ? 'bg-emerald-900 border-emerald-400 text-white'
                    : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <Music className="w-3 h-3 shrink-0" />
                <span className="truncate">{snd.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddedSounds(addedSounds.filter((s) => s.id !== snd.id));
                  }}
                  className="hover:text-rose-400"
                >
                  ✕
                </button>
              </div>
            ))}

            {editingTextOverlayId ? (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <input
                  type="text"
                  value={editingOverlayDraft}
                  onChange={(e) => setEditingOverlayDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setTextOverlays((prev) =>
                        prev.map((t) => (t.id === editingTextOverlayId ? { ...t, text: editingOverlayDraft } : t))
                      );
                      setEditingTextOverlayId(null);
                    }
                  }}
                  className="flex-1 min-w-0 px-2 py-0.5 bg-[#090d1f] border border-amber-400 rounded text-white text-[11px]"
                />
                <button
                  onClick={() => {
                    setTextOverlays((prev) =>
                      prev.map((t) => (t.id === editingTextOverlayId ? { ...t, text: editingOverlayDraft } : t))
                    );
                    setEditingTextOverlayId(null);
                  }}
                  className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold cursor-pointer"
                >
                  OK
                </button>
              </div>
            ) : (
              textOverlays.slice(-2).map((txt) => (
                <div
                  key={txt.id}
                  onClick={() => {
                    setEditingTextOverlayId(txt.id);
                    setEditingOverlayDraft(txt.text);
                  }}
                  className="px-2 py-1 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold truncate cursor-pointer flex items-center gap-1 max-w-[130px]"
                >
                  <Type className="w-3 h-3 shrink-0" />
                  <span className="truncate">{txt.text}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTextOverlays(textOverlays.filter((t) => t.id !== txt.id));
                    }}
                    className="hover:text-rose-400"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. LES 8 BOUTONS DE MONTAGE (BELOW LA PISTE, zero superposition sur téléphone) */}
      <div className="shrink-0 bg-[#0d122c] border border-[#1e2754] rounded-2xl p-2 sm:p-2.5 space-y-2 text-xs overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 border-b border-[#1d2757] pb-2">
          {[
            { id: 'modifier' as DockMenuId, label: 'Modifier', icon: Scissors },
            { id: 'audio' as DockMenuId, label: 'Audio', icon: Music },
            { id: 'texte' as DockMenuId, label: 'Texte', icon: Type },
            { id: 'autocollants' as DockMenuId, label: 'Stickers', icon: Smile },
            { id: 'effets' as DockMenuId, label: 'Effets', icon: Sparkles },
            { id: 'filtres' as DockMenuId, label: 'Filtres', icon: Contrast },
            { id: 'ajuster' as DockMenuId, label: 'Ajuster', icon: Sliders },
            { id: 'transitions' as DockMenuId, label: 'Transitions', icon: ArrowLeftRight },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeMenu === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMenu(tab.id)}
                className={`px-1 sm:px-2 py-1.5 rounded-xl font-bold flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 cursor-pointer transition-colors text-[10px] sm:text-xs ${
                  active ? 'bg-[#2563eb] text-white shadow' : 'bg-[#11173b] text-slate-300 hover:bg-[#192254]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Dock Sub-panel (Compact, mobile friendly) */}
        <div className="min-h-[92px] flex flex-col justify-center overflow-hidden">
          {activeMenu === 'modifier' && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                <button onClick={handleSplitScene} disabled={!activeScene} className="px-2.5 py-1 bg-[#141c45] disabled:opacity-40 border border-[#2b3c8a] rounded-lg font-bold text-white flex items-center gap-1 cursor-pointer">
                  <Scissors className="w-3 h-3 text-sky-400" />
                  <span>Diviser</span>
                </button>
                <button onClick={() => setModifierSubTool('speed_curve')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'speed_curve' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <Activity className="w-3 h-3 text-amber-400" />
                  <span>Vitesse &gt; Courbe</span>
                </button>
                <button onClick={handleDeleteActiveScene} disabled={!activeScene} className="px-2.5 py-1 bg-[#141c45] disabled:opacity-40 border border-[#2b3c8a] rounded-lg font-bold text-rose-300 flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Supprimer</span>
                </button>
                <button onClick={() => setModifierSubTool('animation')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'animation' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Animation</span>
                </button>
                <button onClick={() => setModifierSubTool('keyframes')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'keyframes' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <KeyRound className="w-3 h-3 text-emerald-400" />
                  <span>Images clés</span>
                </button>
                <button onClick={() => setModifierSubTool('mask')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'mask' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <Disc className="w-3 h-3 text-cyan-400" />
                  <span>Masque</span>
                </button>
                <button onClick={() => setModifierSubTool('pip')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'pip' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <Layers className="w-3 h-3 text-pink-400" />
                  <span>Superposition</span>
                </button>
                <button onClick={() => setModifierSubTool('crop')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'crop' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <Crop className="w-3 h-3 text-sky-300" />
                  <span>Recadrer</span>
                </button>
                <button onClick={handleDuplicateActiveScene} disabled={!activeScene} className="px-2.5 py-1 bg-[#141c45] disabled:opacity-40 border border-[#2b3c8a] rounded-lg font-bold text-slate-200 flex items-center gap-1 cursor-pointer">
                  <Copy className="w-3 h-3 text-indigo-300" />
                  <span>Dupliquer</span>
                </button>
                <button onClick={handleReverseActiveScene} disabled={!activeScene} className="px-2.5 py-1 bg-[#141c45] disabled:opacity-40 border border-[#2b3c8a] rounded-lg font-bold text-slate-200 flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-3 h-3 text-teal-400" />
                  <span>Inverser</span>
                </button>
                <button onClick={handleFreezeFrame} disabled={!activeScene} className="px-2.5 py-1 bg-[#141c45] disabled:opacity-40 border border-[#2b3c8a] rounded-lg font-bold text-slate-200 flex items-center gap-1 cursor-pointer">
                  <Snowflake className="w-3 h-3 text-sky-300" />
                  <span>Figer</span>
                </button>
                <button onClick={() => setModifierSubTool('blur_graph')} className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 cursor-pointer ${modifierSubTool === 'blur_graph' ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#141c45] border-[#2b3c8a] text-slate-200'}`}>
                  <Sliders className="w-3 h-3 text-amber-300" />
                  <span>Graphique / Flou</span>
                </button>
              </div>

              {modifierSubTool === 'speed_curve' && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  {[
                    { id: 'normal', label: 'Normal 1x', sp: 1 },
                    { id: 'montage', label: 'Montage 1.5x', sp: 1.5 },
                    { id: 'hero', label: 'Héroïque 0.5x', sp: 0.5 },
                    { id: 'bullet', label: 'Ralenti 0.25x', sp: 0.25 },
                    { id: 'jump', label: 'Saut 2x', sp: 2.0 },
                    { id: 'flash', label: 'Rapide 3x', sp: 3.0 },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSetSpeed(c.sp, c.id as VideoScene['speedCurve'])}
                      className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                        activeScene?.speedCurve === c.id ? 'bg-[#2563eb] text-white' : 'bg-[#090d1f] text-slate-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {modifierSubTool === 'animation' && (
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={activeScene?.animation?.inAnim || 'Zoom Cinétique'}
                    onChange={(e) =>
                      updateActiveScene({
                        animation: {
                          inAnim: e.target.value,
                          outAnim: activeScene?.animation?.outAnim || 'Aucune',
                          comboAnim: activeScene?.animation?.comboAnim || 'Aucun',
                          duration: 0.5,
                        },
                      })
                    }
                    className="p-1.5 bg-[#090d1f] border border-[#2b3c8a] rounded-lg text-white text-[11px]"
                  >
                    <option>Entrée : Zoom Cinétique</option>
                    <option>Entrée : Glissement Haut</option>
                    <option>Entrée : Rebond Élastique</option>
                  </select>
                  <select
                    value={activeScene?.animation?.outAnim || 'Aucune'}
                    onChange={(e) =>
                      updateActiveScene({
                        animation: {
                          inAnim: activeScene?.animation?.inAnim || 'Aucune',
                          outAnim: e.target.value,
                          comboAnim: activeScene?.animation?.comboAnim || 'Aucun',
                          duration: 0.5,
                        },
                      })
                    }
                    className="p-1.5 bg-[#090d1f] border border-[#2b3c8a] rounded-lg text-white text-[11px]"
                  >
                    <option>Sortie : Aucune</option>
                    <option>Sortie : Zoom Arrière</option>
                    <option>Sortie : Fondu</option>
                  </select>
                  <select
                    value={activeScene?.animation?.comboAnim || 'Aucun'}
                    onChange={(e) =>
                      updateActiveScene({
                        animation: {
                          inAnim: activeScene?.animation?.inAnim || 'Aucune',
                          outAnim: activeScene?.animation?.outAnim || 'Aucune',
                          comboAnim: e.target.value,
                          duration: 0.5,
                        },
                      })
                    }
                    className="p-1.5 bg-[#090d1f] border border-[#2b3c8a] rounded-lg text-white text-[11px]"
                  >
                    <option>Combo : Aucun</option>
                    <option>Combo : Balancier 3D</option>
                    <option>Combo : Bounce Beat</option>
                  </select>
                </div>
              )}

              {modifierSubTool === 'keyframes' && (
                <div className="flex items-center justify-between bg-[#090d1f] p-2 rounded-xl border border-[#1d2757]">
                  <span className="text-slate-300">
                    Images clés : {activeScene?.keyframes?.length || 0} (position actuelle {currentTime.toFixed(1)}s)
                  </span>
                  <button
                    onClick={handleAddKeyframe}
                    disabled={!activeScene}
                    className="px-3 py-1 bg-[#2563eb] text-white font-bold rounded-lg cursor-pointer"
                  >
                    + Ajouter image clé
                  </button>
                </div>
              )}

              {modifierSubTool === 'mask' && (
                <div className="flex items-center justify-between bg-[#090d1f] p-2 rounded-xl border border-[#1d2757]">
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'none', label: 'Aucun' },
                      { id: 'rect', label: 'Rectangulaire' },
                      { id: 'circle', label: 'Circulaire' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          updateActiveScene({
                            mask: {
                              type: m.id as MaskConfig['type'],
                              feather: 10,
                              scale: activeScene?.mask?.scale || 80,
                              x: 50,
                              y: 50,
                            },
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                          (activeScene?.mask?.type || 'none') === m.id ? 'bg-[#2563eb] text-white' : 'bg-[#141c45] text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={activeScene?.mask?.scale || 80}
                    onChange={(e) =>
                      updateActiveScene({
                        mask: {
                          type: activeScene?.mask?.type || 'circle',
                          feather: 10,
                          scale: Number(e.target.value),
                          x: 50,
                          y: 50,
                        },
                      })
                    }
                    className="w-32 accent-[#38bdf8]"
                  />
                </div>
              )}

              {modifierSubTool === 'pip' && (
                <div className="flex items-center justify-between bg-[#090d1f] p-2 rounded-xl border border-[#1d2757]">
                  <div className="flex items-center gap-2">
                    <button onClick={() => pipInputRef.current?.click()} className="px-3 py-1 bg-[#2563eb] text-white font-bold rounded-lg cursor-pointer">
                      Importer média en superposition
                    </button>
                    <input
                      ref={pipInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setPipOverlayFile(URL.createObjectURL(e.target.files[0]))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Opacité ({pipOpacity}%)</span>
                    <input type="range" min="10" max="100" value={pipOpacity} onChange={(e) => setPipOpacity(Number(e.target.value))} className="w-24 accent-[#38bdf8]" />
                  </div>
                </div>
              )}

              {modifierSubTool === 'crop' && (
                <div className="flex items-center gap-2">
                  {(['9:16', '16:9', '1:1', '4:5'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => updateActiveScene({ cropRatio: ratio })}
                      className={`px-3 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                        (activeScene?.cropRatio || '9:16') === ratio ? 'bg-[#2563eb] text-white' : 'bg-[#090d1f] text-slate-300'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              )}

              {modifierSubTool === 'blur_graph' && (
                <div className="flex items-center justify-between bg-[#090d1f] p-2 rounded-xl border border-[#1d2757]">
                  <span className="font-bold text-slate-300">Flou cinétique ({activeScene?.motionBlur || 0}%)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeScene?.motionBlur || 0}
                    onChange={(e) => updateActiveScene({ motionBlur: Number(e.target.value) })}
                    className="w-48 accent-[#38bdf8]"
                  />
                </div>
              )}
            </div>
          )}

          {activeMenu === 'audio' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Recherche musicale & bruitages séparés en ligne */}
              <div className="p-2.5 bg-[#090d1f] border border-[#1d2757] rounded-xl space-y-1.5">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Musiques &amp; Bruitages en ligne</span>
                  <button
                    onClick={handleExtractVideoAudio}
                    className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                  >
                    Extraire son vidéo
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      handleRunMusicSearch(musicQuery);
                      setActiveAddTab('musiques');
                      setMusicFilter('all');
                      setIsAddModalOpen(true);
                    }}
                    className="px-2 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-lg cursor-pointer whitespace-nowrap text-[11px]"
                  >
                    Musiques
                  </button>
                  <button
                    onClick={() => {
                      handleRunSfxSearch(sfxQuery);
                      setActiveAddTab('bruitages');
                      setSfxFilter('all');
                      setIsAddModalOpen(true);
                    }}
                    className="px-2 py-1.5 bg-[#1b2b73] hover:bg-[#253a99] border border-[#384fa6] text-white font-bold rounded-lg cursor-pointer whitespace-nowrap text-[11px]"
                  >
                    Sons &amp; Bruitages
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-[#090d1f] border border-[#1d2757] rounded-xl flex flex-col justify-between">
                <div className="font-bold text-white">Battement &gt; Correspondance auto</div>
                <button
                  onClick={handleAutoBeatMatch}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Caler les cuts sur le beat ({beatMarkers.length})
                </button>
              </div>

              <div className="p-2.5 bg-[#090d1f] border border-[#1d2757] rounded-xl space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-white">
                  <span>Volume / Fondu</span>
                  <span className="font-mono text-sky-300 tabular-nums">{masterVolume}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div>
                    <span>Entrée ({audioFadeIn}s)</span>
                    <input type="range" min="0" max="3" step="0.1" value={audioFadeIn} onChange={(e) => setAudioFadeIn(Number(e.target.value))} className="w-full accent-[#38bdf8]" />
                  </div>
                  <div>
                    <span>Sortie ({audioFadeOut}s)</span>
                    <input type="range" min="0" max="3" step="0.1" value={audioFadeOut} onChange={(e) => setAudioFadeOut(Number(e.target.value))} className="w-full accent-[#38bdf8]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'texte' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-2.5 bg-[#090d1f] border border-[#1d2757] rounded-xl flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveAddTab('texte');
                    setIsAddModalOpen(true);
                  }}
                  className="flex-1 py-1.5 bg-[#2563eb] text-white font-bold rounded-lg cursor-pointer"
                >
                  + Ajouter du texte
                </button>
                <button
                  onClick={handleAutoGenerateSubtitles}
                  className="flex-1 py-1.5 bg-amber-500 text-slate-950 font-black rounded-lg cursor-pointer"
                >
                  Sous-titres auto
                </button>
              </div>

              <div className="p-2.5 bg-[#090d1f] border border-[#1d2757] rounded-xl flex items-center gap-1.5">
                {[
                  { label: 'Hook Viral', txt: 'PASSER À L’ACTION' },
                  { label: 'Néon MMV', txt: 'ÉDITION CINÉMA' },
                  { label: 'Minimal', txt: 'CLARTÉ ABSOLUE' },
                ].map((tpl) => (
                  <button
                    key={tpl.label}
                    onClick={() => handleAddTextToTrack(tpl.txt, tpl.label)}
                    className="flex-1 py-1.5 bg-[#141c45] border border-[#2b3c8a] rounded-lg text-slate-200 font-bold cursor-pointer truncate"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>

              <div className="p-2.5 bg-[#090d1f] border border-[#1d2757] rounded-xl grid grid-cols-2 gap-2">
                <select value={textInAnim} onChange={(e) => setTextInAnim(e.target.value)} className="p-1 bg-[#141c45] border border-[#2b3c8a] rounded-lg text-white text-[11px]">
                  <option>Pop Rebond</option>
                  <option>Machine à écrire</option>
                  <option>Glissement Haut</option>
                  <option>Zoom Cinétique</option>
                </select>
                <select value={textOutAnim} onChange={(e) => setTextOutAnim(e.target.value)} className="p-1 bg-[#141c45] border border-[#2b3c8a] rounded-lg text-white text-[11px]">
                  <option>Fondu</option>
                  <option>Glissement</option>
                  <option>Rétraction</option>
                </select>
              </div>
            </div>
          )}

          {activeMenu === 'autocollants' && (
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {STICKER_LIST.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => handleAddStickerToTrack(stk)}
                  className="p-1.5 bg-[#090d1f] hover:bg-[#172152] border border-[#1d2757] rounded-xl flex flex-col items-center cursor-pointer"
                >
                  <span className="text-lg">{stk.emoji}</span>
                  <span className="text-[9px] text-slate-300 truncate w-full text-center">{stk.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeMenu === 'effets' && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'motion', label: 'Mouvement' },
                  { id: 'distortion', label: 'Distorsion' },
                  { id: 'blur', label: 'Flou' },
                  { id: 'body', label: 'Effets corporels' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setEffectCategory(cat.id as typeof effectCategory)}
                    className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                      effectCategory === cat.id ? 'bg-[#2563eb] text-white' : 'bg-[#090d1f] text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {effectCategory === 'body'
                  ? BODY_EFFECTS.map((be) => (
                      <button
                        key={be.id}
                        onClick={() => setActiveBodyEffect(be.id)}
                        className={`px-3 py-1 rounded-lg border font-bold cursor-pointer ${
                          activeBodyEffect === be.id ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#090d1f] border-[#1d2757] text-slate-300'
                        }`}
                      >
                        {be.name}
                      </button>
                    ))
                  : VIDEO_EFFECTS.filter((ef) => ef.id === 'none' || ef.cat === effectCategory).map((ef) => (
                      <button
                        key={ef.id}
                        onClick={() => setActiveEffect(ef.id)}
                        className={`px-3 py-1 rounded-lg border font-bold cursor-pointer ${
                          activeEffect === ef.id ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#090d1f] border-[#1d2757] text-slate-300'
                        }`}
                      >
                        {ef.name}
                      </button>
                    ))}
              </div>
            </div>
          )}

          {activeMenu === 'filtres' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'film', label: 'Film' },
                    { id: 'retro', label: 'Rétro' },
                    { id: 'mmv_bw', label: 'N&B (MMV)' },
                  ].map((fc) => (
                    <button
                      key={fc.id}
                      onClick={() => setFilterCategory(fc.id as typeof filterCategory)}
                      className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                        filterCategory === fc.id ? 'bg-[#2563eb] text-white' : 'bg-[#090d1f] text-slate-300'
                      }`}
                    >
                      {fc.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span>Intensité ({filterIntensity}%)</span>
                  <input type="range" min="0" max="100" value={filterIntensity} onChange={(e) => setFilterIntensity(Number(e.target.value))} className="w-24 accent-[#38bdf8]" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FILTERS_LIST.filter((fl) => filterCategory === 'all' || fl.cat === filterCategory).map((fl) => (
                  <button
                    key={fl.id}
                    onClick={() => setActiveFilter(fl.id)}
                    className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${
                      activeFilter === fl.id ? 'bg-[#1f3382] border-sky-400 text-white' : 'bg-[#090d1f] border-[#1d2757] text-slate-300'
                    }`}
                  >
                    {fl.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMenu === 'ajuster' && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-300 block">Luminosité ({adjustments.brightness}%)</label>
                <input type="range" min="50" max="150" value={adjustments.brightness} onChange={(e) => setAdjustments((a) => ({ ...a, brightness: Number(e.target.value) }))} className="w-full accent-[#38bdf8]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-300 block">Contraste ({adjustments.contrast}%)</label>
                <input type="range" min="50" max="180" value={adjustments.contrast} onChange={(e) => setAdjustments((a) => ({ ...a, contrast: Number(e.target.value) }))} className="w-full accent-[#38bdf8]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-300 block">Saturation ({adjustments.saturation}%)</label>
                <input type="range" min="0" max="200" value={adjustments.saturation} onChange={(e) => setAdjustments((a) => ({ ...a, saturation: Number(e.target.value) }))} className="w-full accent-[#38bdf8]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-300 block">Netteté ({adjustments.sharpness}%)</label>
                <input type="range" min="0" max="100" value={adjustments.sharpness} onChange={(e) => setAdjustments((a) => ({ ...a, sharpness: Number(e.target.value) }))} className="w-full accent-[#38bdf8]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-300 block">Température ({adjustments.temperature})</label>
                <input type="range" min="-40" max="40" value={adjustments.temperature} onChange={(e) => setAdjustments((a) => ({ ...a, temperature: Number(e.target.value) }))} className="w-full accent-[#38bdf8]" />
              </div>
              <div>
                <label className="text-[10px] text-slate-300 block">Vignette ({adjustments.vignette}%)</label>
                <input type="range" min="0" max="100" value={adjustments.vignette} onChange={(e) => setAdjustments((a) => ({ ...a, vignette: Number(e.target.value) }))} className="w-full accent-[#38bdf8]" />
              </div>
            </div>
          )}

          {activeMenu === 'transitions' && (
            <div className="flex flex-wrap items-center gap-1.5">
              {TRANSITIONS_LIST.map((tr) => (
                <button
                  key={tr.id}
                  onClick={() => {
                    updateActiveScene({ transitionToNext: tr.id });
                    setActiveTransitionFlash(tr.id);
                    setTimeout(() => setActiveTransitionFlash(null), 500);
                  }}
                  className={`px-3 py-1.5 rounded-xl border font-bold cursor-pointer ${
                    activeScene?.transitionToNext === tr.id
                      ? 'bg-[#2563eb] border-sky-400 text-white'
                      : 'bg-[#090d1f] border-[#1d2757] text-slate-300'
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL AJOUTER (UNIVERSAL ONLINE MUSIC SEARCH + TEXTE + STICKERS + B-ROLL, ZERO SCROLLBARS) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0e1329] border border-[#2b356d] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-3.5 bg-[#141b3d] border-b border-[#2b356d] flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-white text-sm">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Ajouter à la piste de montage</span>
              </div>
              <button
                onClick={() => {
                  stopPreviewAudio();
                  setIsAddModalOpen(false);
                }}
                className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-[#2b356d] bg-[#0c1024] px-4 pt-2 text-xs overflow-hidden">
              {[
                { id: 'musiques', label: 'Musiques' },
                { id: 'bruitages', label: 'Sons & Bruitages' },
                { id: 'texte', label: 'Texte' },
                { id: 'stickers', label: 'Autocollants' },
                { id: 'medias', label: 'Médias' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveAddTab(t.id as typeof activeAddTab)}
                  className={`px-3.5 py-2 font-bold border-b-2 cursor-pointer whitespace-nowrap ${
                    activeAddTab === t.id ? 'border-[#3b82f6] text-white' : 'border-transparent text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeAddTab === 'musiques' && (
              <div className="p-4 space-y-3 text-xs">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={musicQuery}
                      onChange={(e) => setMusicQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunMusicSearch()}
                      placeholder="Rechercher n'importe quelle musique ou artiste en ligne..."
                      className="w-full pl-9 pr-4 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleRunMusicSearch()}
                    disabled={isSearchingMusic}
                    className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    {isSearchingMusic ? 'Recherche...' : 'Rechercher'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    {(['all', 'favs'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setMusicFilter(f);
                          setMusicPage(0);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                          musicFilter === f ? 'bg-[#3b82f6] text-white' : 'bg-[#141b3d] text-slate-400'
                        }`}
                      >
                        {f === 'all' ? 'Toutes les musiques' : `Favoris (${favoriteSoundIds.length})`}
                      </button>
                    ))}
                  </div>

                  {totalMusicPages > 1 && (
                    <div className="flex items-center gap-1 tabular-nums">
                      <button
                        onClick={() => setMusicPage((p) => Math.max(0, p - 1))}
                        disabled={safeMusicPage === 0}
                        className="p-1 rounded bg-[#141b3d] text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono text-slate-300">
                        Page {safeMusicPage + 1}/{totalMusicPages}
                      </span>
                      <button
                        onClick={() => setMusicPage((p) => Math.min(totalMusicPages - 1, p + 1))}
                        disabled={safeMusicPage >= totalMusicPages - 1}
                        className="p-1 rounded bg-[#141b3d] text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {visibleMusic.map((trk) => {
                    const isFav = favoriteSoundIds.includes(trk.id);
                    const isPlayingThis = playingTrackId === trk.id;
                    return (
                      <div
                        key={trk.id}
                        className="p-2.5 bg-[#131a3d] border border-[#232f6b] rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => playTrackPreview(trk)}
                            className="w-8 h-8 rounded-full bg-[#1e2a66] flex items-center justify-center text-white cursor-pointer shrink-0"
                          >
                            {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                          </button>
                          {trk.artworkUrl && (
                            <img src={trk.artworkUrl} alt={trk.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate">
                              {trk.title} <span className="text-[10px] text-slate-400 font-mono">({trk.duration}s)</span>
                            </div>
                            <span className="text-[10px] text-sky-400 truncate block">
                              {trk.artist} · {trk.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => toggleFavoriteSound(trk.id)}
                            className={`p-1.5 rounded-lg border cursor-pointer ${
                              isFav ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-[#1a214d] border-[#2b3978] text-slate-400'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleAddTrackToTimeline(trk)}
                            className="px-3 py-1.5 bg-[#2563eb] text-white font-bold rounded-lg cursor-pointer"
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

            {activeAddTab === 'bruitages' && (
              <div className="p-4 space-y-3 text-xs">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={sfxQuery}
                      onChange={(e) => setSfxQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunSfxSearch()}
                      placeholder="Rechercher n'importe quel son ou bruitage (whoosh, pluie, impact, cloche...)"
                      className="w-full pl-9 pr-4 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleRunSfxSearch()}
                    disabled={isSearchingSfx}
                    className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    {isSearchingSfx ? 'Recherche...' : 'Rechercher'}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    {(['all', 'Transitions', 'Impacts', 'Ambiance', 'favs'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setSfxFilter(f);
                          setSfxPage(0);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                          sfxFilter === f ? 'bg-[#3b82f6] text-white' : 'bg-[#141b3d] text-slate-400'
                        }`}
                      >
                        {f === 'all' ? 'Tout' : f === 'favs' ? `Favoris (${favoriteSoundIds.length})` : f}
                      </button>
                    ))}
                  </div>

                  {totalSfxPages > 1 && (
                    <div className="flex items-center gap-1 tabular-nums">
                      <button
                        onClick={() => setSfxPage((p) => Math.max(0, p - 1))}
                        disabled={safeSfxPage === 0}
                        className="p-1 rounded bg-[#141b3d] text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono text-slate-300">
                        Page {safeSfxPage + 1}/{totalSfxPages}
                      </span>
                      <button
                        onClick={() => setSfxPage((p) => Math.min(totalSfxPages - 1, p + 1))}
                        disabled={safeSfxPage >= totalSfxPages - 1}
                        className="p-1 rounded bg-[#141b3d] text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {visibleSfx.map((trk) => {
                    const isFav = favoriteSoundIds.includes(trk.id);
                    const isPlayingThis = playingTrackId === trk.id;
                    return (
                      <div
                        key={trk.id}
                        className="p-2.5 bg-[#131a3d] border border-[#232f6b] rounded-xl flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => playTrackPreview(trk)}
                            className="w-8 h-8 rounded-full bg-[#1e2a66] flex items-center justify-center text-white cursor-pointer shrink-0"
                          >
                            {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                          </button>
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate">
                              {trk.title} <span className="text-[10px] text-slate-400 font-mono">({trk.duration}s)</span>
                            </div>
                            <span className="text-[10px] text-sky-400 truncate block">
                              {trk.artist} · {trk.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => toggleFavoriteSound(trk.id)}
                            className={`p-1.5 rounded-lg border cursor-pointer ${
                              isFav ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-[#1a214d] border-[#2b3978] text-slate-400'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleAddTrackToTimeline(trk)}
                            className="px-3 py-1.5 bg-[#2563eb] text-white font-bold rounded-lg cursor-pointer"
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

            {activeAddTab === 'texte' && (
              <div className="p-4 space-y-3 text-xs">
                <input
                  type="text"
                  value={customTextInput}
                  onChange={(e) => setCustomTextInput(e.target.value)}
                  placeholder="Saisissez le texte à ajouter sur la piste..."
                  className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white"
                />
                <button
                  onClick={() => {
                    if (!customTextInput.trim()) return;
                    handleAddTextToTrack(customTextInput.trim());
                    setCustomTextInput('');
                  }}
                  className="w-full py-2.5 bg-[#2563eb] text-white font-bold rounded-xl cursor-pointer"
                >
                  Ajouter cette zone de texte
                </button>
              </div>
            )}

            {activeAddTab === 'stickers' && (
              <div className="p-4 grid grid-cols-4 gap-2 text-xs">
                {STICKER_LIST.map((stk) => (
                  <button
                    key={stk.id}
                    onClick={() => handleAddStickerToTrack(stk)}
                    className="p-2.5 bg-[#131a3d] border border-[#232f6b] hover:border-[#3b82f6] rounded-xl flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-xl">{stk.emoji}</span>
                    <span className="font-bold text-white text-[11px] truncate">{stk.name}</span>
                  </button>
                ))}
              </div>
            )}

            {activeAddTab === 'medias' && (
              <div className="p-6 text-center space-y-3 text-xs">
                <Film className="w-8 h-8 text-purple-400 mx-auto" />
                <h4 className="font-bold text-white">Importer un plan vidéo ou photo</h4>
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
