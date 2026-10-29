import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Upload, 
  Music, 
  Type, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  Wand2, 
  Check, 
  Eye, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ArrowLeft,
  Search,
  Star,
  Flame,
  X,
  Volume1,
  Film,
  Layers,
  Presentation,
  Send,
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { andreaVoice } from '../utils/speech';
import { andreaEngine } from '../utils/andreaRequestEngine';

// Modèles de cadres (Ratio d'aspect)
export type FrameModel = '9:16' | '1:1' | '16:9' | '4:5';

export interface FrameOption {
  id: FrameModel;
  label: string;
  sublabel: string;
  aspectClass: string;
  width: number;
  height: number;
}

export const FRAME_MODELS: FrameOption[] = [
  { id: '9:16', label: '9:16 (Story / Reel)', sublabel: '1080×1920', aspectClass: 'aspect-[9/16] max-w-[280px] sm:max-w-[320px]', width: 1080, height: 1920 },
  { id: '1:1', label: '1:1 (Post Carré)', sublabel: '1080×1080', aspectClass: 'aspect-square max-w-[340px] sm:max-w-[380px]', width: 1080, height: 1080 },
  { id: '16:9', label: '16:9 (Paysage / YouTube)', sublabel: '1920×1080', aspectClass: 'aspect-video max-w-[480px] sm:max-w-[540px]', width: 1920, height: 1080 },
  { id: '4:5', label: '4:5 (Portrait)', sublabel: '1080×1350', aspectClass: 'aspect-[4/5] max-w-[300px] sm:max-w-[340px]', width: 1080, height: 1350 },
];

// Polices typographiques style Canva & LibreOffice
export const FONT_OPTIONS = [
  { name: 'Inter (Moderne)', family: 'Inter, sans-serif' },
  { name: 'Plus Jakarta Sans (Élégant)', family: "'Plus Jakarta Sans', sans-serif" },
  { name: 'Montserrat (Gras & Net)', family: 'Montserrat, sans-serif' },
  { name: 'Impact (Viral & Punchy)', family: 'Impact, sans-serif' },
  { name: 'Playfair Display (Luxe & Titres)', family: "'Playfair Display', serif" },
  { name: 'JetBrains Mono (Tech & Code)', family: "'JetBrains Mono', monospace" },
  { name: 'Arial (Classique Universel)', family: 'Arial, sans-serif' },
  { name: 'Georgia (Édition & Roman)', family: 'Georgia, serif' },
];

// Modèles de fond / Arrière-plans
export const BACKGROUND_PRESETS = [
  { id: 'studio_dark', label: 'Noir Studio', bgClass: 'bg-[#0b0819]', color: '#0b0819' },
  { id: 'deep_night', label: 'Indigo Nuit', bgClass: 'bg-gradient-to-b from-[#181135] via-[#100b24] to-[#080514]', color: '#181135' },
  { id: 'neon_cyber', label: 'Gradient Néon', bgClass: 'bg-gradient-to-tr from-[#1E1B8C] via-[#3c1b8c] to-[#a855f7]', color: '#5A33FF' },
  { id: 'sunset_vibe', label: 'Crépuscule', bgClass: 'bg-gradient-to-br from-[#4c0519] via-[#831843] to-[#1e1b4b]', color: '#831843' },
  { id: 'gold_glow', label: 'Ambre Doré', bgClass: 'bg-gradient-to-tr from-[#451a03] via-[#78350f] to-[#172554]', color: '#78350f' },
  { id: 'studio_clean', label: 'Blanc Épuré', bgClass: 'bg-[#f8fafc]', color: '#f8fafc' },
];

export interface TextZone {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isUppercase: boolean;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  bgColor?: string;
  xPercent: number;
  yPercent: number;
  startTimeSec: number;
  endTimeSec: number;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  category: 'pop' | 'rap' | 'lofi' | 'electro' | 'cinema' | 'sfx';
  durationSec: number;
  durationLabel: string;
  isTrending?: boolean;
  color: string;
  synthType: string;
  badge: string;
}

export interface TimelineAudioClip {
  id: string;
  name: string;
  type: string;
  startTimeSec: number;
  durationSec: number;
  color: string;
  volume: number;
}

export interface OverlayImageGifClip {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'gif';
  startTimeSec: number;
  durationSec: number;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
}

export interface TimingTarget {
  kind: 'audio' | 'overlay' | 'text';
  id: string;
  name: string;
  startTimeSec: number;
  durationSec: number;
}

export const PRESET_GIFS = [
  { id: 'gif_flame', name: '🔥 Flamme Virale', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnE2Y3lzcXlxaGZ2M3B6cWl4NnRhZ3FmbzMyejB5Z3g4Z3R5Y3g3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKTDnUxE0g2fSE8/giphy.gif' },
  { id: 'gif_light', name: '💡 Ampoule Eurêka', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Zuc2ptczIxaHNyMWkxd2V1b203c2I5a2d1dnlmb3M2MHNtcXVqMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xUPGcJ9uOZS5eqlW80/giphy.gif' },
  { id: 'gif_rocket', name: '🚀 Fusée Décollage', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNudWZ5d2w2OXAzMWc2MnNocW14b29xMDR4cnM4Y3Y5d3g5d2NodyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/fem2uTTbZSnnW/giphy.gif' },
  { id: 'gif_success', name: '🎉 Victoire & Succès', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm40N2pnaDB4dHozMnhlMHkzaHBkczZkMXNsc3Vob2Z2eW03d2JleSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/artj92V8o75VPL7AeQ/giphy.gif' },
  { id: 'gif_check', name: '✅ Validation Verte', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXl2M3Juc2M0bXo0eWhuNG82Z2t4NGtjc3RvaG9mOG93c3BmbzhvMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13CoXDiaCcCoyk/giphy.gif' }
];

// Catalogue complet de chansons et sons disponibles sur Google & Web
export const GOOGLE_SONGS_CATALOGUE: SongItem[] = [
  // Tendances & Pop
  { id: 'g1', title: 'Blinding Lights', artist: 'The Weeknd', category: 'pop', durationSec: 3.5, durationLabel: '3:20', isTrending: true, color: 'bg-rose-600', synthType: 'beat_pop', badge: 'Hit Viral' },
  { id: 'g2', title: 'Levitating', artist: 'Dua Lipa', category: 'pop', durationSec: 4.0, durationLabel: '3:23', isTrending: true, color: 'bg-purple-600', synthType: 'beat_dance', badge: 'Tendance #1' },
  { id: 'g3', title: 'As It Was', artist: 'Harry Styles', category: 'pop', durationSec: 3.0, durationLabel: '2:47', isTrending: true, color: 'bg-amber-500', synthType: 'beat_indie', badge: 'Billboard' },
  { id: 'g4', title: 'Bad Guy', artist: 'Billie Eilish', category: 'pop', durationSec: 3.8, durationLabel: '3:14', isTrending: true, color: 'bg-emerald-600', synthType: 'drop', badge: 'Ultra Populaire' },
  { id: 'g5', title: 'Papaoutai', artist: 'Stromae', category: 'pop', durationSec: 4.0, durationLabel: '3:52', isTrending: true, color: 'bg-blue-600', synthType: 'beat_dance', badge: 'Classique' },
  { id: 'g6', title: 'Flowers', artist: 'Miley Cyrus', category: 'pop', durationSec: 3.2, durationLabel: '3:20', isTrending: true, color: 'bg-pink-500', synthType: 'beat_pop', badge: 'TikTok Top' },
  
  // Rap, Drill & Trap
  { id: 'g7', title: "God's Plan", artist: 'Drake', category: 'rap', durationSec: 4.5, durationLabel: '3:18', isTrending: true, color: 'bg-amber-600', synthType: 'beat_trap', badge: 'Rap US' },
  { id: 'g8', title: 'HUMBLE.', artist: 'Kendrick Lamar', category: 'rap', durationSec: 3.0, durationLabel: '2:57', isTrending: true, color: 'bg-red-600', synthType: 'drop', badge: 'Banger' },
  { id: 'g9', title: 'Bande Organisée', artist: '13 Organisé', category: 'rap', durationSec: 5.0, durationLabel: '5:53', isTrending: true, color: 'bg-sky-600', synthType: 'beat_trap', badge: 'Rap FR' },
  { id: 'g10', title: 'SICKO MODE', artist: 'Travis Scott', category: 'rap', durationSec: 5.2, durationLabel: '5:12', isTrending: true, color: 'bg-indigo-600', synthType: 'drop', badge: '808 Trap' },
  
  // Lo-Fi & Ambiance Détente
  { id: 'g11', title: 'Morning Coffee', artist: 'Lo-Fi Girl', category: 'lofi', durationSec: 6.0, durationLabel: '2:45', isTrending: true, color: 'bg-teal-500', synthType: 'beat_lofi', badge: 'Chill Study' },
  { id: 'g12', title: 'Rainy Thoughts', artist: 'ChilledCow', category: 'lofi', durationSec: 5.5, durationLabel: '3:05', isTrending: false, color: 'bg-cyan-600', synthType: 'beat_lofi', badge: 'Calme' },
  { id: 'g13', title: 'Sunset Melody', artist: 'Kina Beats', category: 'lofi', durationSec: 4.0, durationLabel: '2:30', isTrending: false, color: 'bg-violet-500', synthType: 'beat_lofi', badge: 'Détente' },

  // Électro & Synthwave
  { id: 'g14', title: 'One More Time', artist: 'Daft Punk', category: 'electro', durationSec: 4.2, durationLabel: '5:20', isTrending: true, color: 'bg-fuchsia-600', synthType: 'beat_dance', badge: 'Légende' },
  { id: 'g15', title: 'Tokyo Drift (Phonk)', artist: 'Teriyaki Boyz', category: 'electro', durationSec: 3.5, durationLabel: '2:15', isTrending: true, color: 'bg-red-500', synthType: 'drop', badge: 'Drift Phonk' },
  { id: 'g16', title: 'Midnight City', artist: 'M83', category: 'electro', durationSec: 4.0, durationLabel: '4:03', isTrending: true, color: 'bg-purple-500', synthType: 'beat_dance', badge: 'Synthwave' },

  // Cinéma & Épique
  { id: 'g17', title: 'Time (Inception)', artist: 'Hans Zimmer', category: 'cinema', durationSec: 6.0, durationLabel: '4:35', isTrending: true, color: 'bg-amber-700', synthType: 'ambient_pad', badge: 'Cinématique' },
  { id: 'g18', title: 'Interstellar Theme', artist: 'Hans Zimmer', category: 'cinema', durationSec: 5.5, durationLabel: '4:08', isTrending: true, color: 'bg-blue-700', synthType: 'ambient_pad', badge: 'Épique' },

  // SFX & Bruitages Professionnels
  { id: 'g19', title: '⚡ Whoosh Rapide Accroche', artist: 'Studio SFX', category: 'sfx', durationSec: 1.2, durationLabel: '0:01', isTrending: true, color: 'bg-amber-500', synthType: 'whoosh_fast', badge: 'Transition' },
  { id: 'g20', title: '🌪️ Whoosh Cinématique', artist: 'Studio SFX', category: 'sfx', durationSec: 1.8, durationLabel: '0:02', isTrending: false, color: 'bg-cyan-500', synthType: 'whoosh_cinema', badge: 'Cinéma' },
  { id: 'g21', title: '💥 808 Bass Drop Sub', artist: 'Studio SFX', category: 'sfx', durationSec: 2.0, durationLabel: '0:02', isTrending: true, color: 'bg-rose-500', synthType: 'drop', badge: 'Impact' },
  { id: 'g22', title: '🔔 Cloche Succès / Cash', artist: 'Studio SFX', category: 'sfx', durationSec: 1.5, durationLabel: '0:01', isTrending: true, color: 'bg-emerald-500', synthType: 'bell_cash', badge: 'Victoire' },
  { id: 'g23', title: '🛑 Glitch & Stop', artist: 'Studio SFX', category: 'sfx', durationSec: 0.8, durationLabel: '0:01', isTrending: false, color: 'bg-pink-600', synthType: 'glitch', badge: 'Cyber' },
  { id: 'g24', title: '📈 Riser Montée de Tension', artist: 'Studio SFX', category: 'sfx', durationSec: 2.5, durationLabel: '0:03', isTrending: true, color: 'bg-orange-600', synthType: 'riser', badge: 'Build-up' },
];

// Synthétiseur Web Audio API
class SynthesizerEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSound(soundType: string) {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      if (soundType.includes('whoosh') || soundType.includes('swish')) {
        const bufferSize = this.ctx.sampleRate * 0.45;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.exponentialRampToValueAtTime(3600, t + 0.2);
        filter.frequency.exponentialRampToValueAtTime(400, t + 0.45);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.65, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
      } else if (soundType.includes('drop') || soundType.includes('trap')) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(36, t + 0.65);
        gain.gain.setValueAtTime(0.85, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.8);
      } else if (soundType.includes('bell') || soundType.includes('cash')) {
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(1560, t);
        osc2.frequency.setValueAtTime(3120, t);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc2.start(t);
        osc.stop(t + 0.9);
        osc2.stop(t + 0.9);
      } else if (soundType.includes('glitch')) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.linearRampToValueAtTime(170, t + 0.12);
        osc.frequency.linearRampToValueAtTime(950, t + 0.25);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (soundType.includes('riser')) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 1.2);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 1.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 1.3);
      } else {
        // Mélodie rythmée agréable pour simuler les musiques populaires
        const freqs = [330, 392, 440, 523];
        freqs.forEach((f, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + idx * 0.12);
          gain.gain.setValueAtTime(0.01, t + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.3, t + idx * 0.12 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.12);
          osc.stop(t + idx * 0.12 + 0.42);
        });
      }
    } catch {
      // Audio fallback
    }
  }
}

const synthEngine = new SynthesizerEngine();

export const MusicStudioReels: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // Mode d'affichage en haut : Montage Vidéo ou Création de visuels
  const [studioMode, setStudioMode] = useState<'montage' | 'visuels'>('montage');

  // Modèle de cadre actif (Canva)
  const [activeFrame, setActiveFrame] = useState<FrameModel>('9:16');
  
  // Modèle de fond actif
  const [activeBackground, setActiveBackground] = useState<string>('deep_night');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);

  // Typographie active (Canva & LibreOffice)
  const [activeFontFamily, setActiveFontFamily] = useState<string>(FONT_OPTIONS[0].family);
  const [activeFontSize, setActiveFontSize] = useState<number>(32);
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');

  // Média importé (Vidéo ou Photo)
  const [mediaFile, setMediaFile] = useState<{ url: string; type: 'video' | 'image'; name: string } | null>(null);

  // Zones de texte sur le canvas : INITIALISÉES VIDES (pas de fausses cases imposées)
  const [textZones, setTextZones] = useState<TextZone[]>([]);
  const [selectedTextZoneId, setSelectedTextZoneId] = useState<string | null>(null);

  // Synchronisation de la barre du haut quand une zone de texte est sélectionnée
  useEffect(() => {
    if (selectedTextZoneId) {
      const zone = textZones.find(z => z.id === selectedTextZoneId);
      if (zone) {
        setActiveFontFamily(zone.fontFamily);
        setActiveFontSize(zone.fontSize);
        setIsBold(zone.isBold);
        setIsItalic(zone.isItalic);
        setIsUnderline(zone.isUnderline);
        setIsUppercase(zone.isUppercase);
        setTextAlign(zone.textAlign);
        setTextColor(zone.textColor);
      }
    }
  }, [selectedTextZoneId, textZones]);

  const updateSelectedZone = (props: Partial<TextZone>) => {
    if (!selectedTextZoneId) return;
    setTextZones(prev => prev.map(zone => {
      if (zone.id === selectedTextZoneId) {
        return { ...zone, ...props };
      }
      return zone;
    }));
  };

  // Timeline & Clips Audio : INITIALISÉS VIDES (aucune case de couleur superflue, seul le + a été demandé)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const maxDurationSec = 30; // 30s Reel standard
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previewOutroMode, setPreviewOutroMode] = useState<boolean>(false);
  const [audioClips, setAudioClips] = useState<TimelineAudioClip[]>([]);
  const [overlayClips, setOverlayClips] = useState<OverlayImageGifClip[]>([]);

  // Menu popover du bouton "+" en bas à gauche
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState<boolean>(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  const [isImageGifModalOpen, setIsImageGifModalOpen] = useState<boolean>(false);

  // Éditeur Temporel Précis (à la seconde près) pour Sons, Images, GIFs et Textes
  const [timingEditorTarget, setTimingEditorTarget] = useState<TimingTarget | null>(null);
  const [isTimingModalOpen, setIsTimingModalOpen] = useState<boolean>(false);

  // Catalogue Musique : Onglets Tendance / Favoris / Tout & Barre de recherche en bas
  const [musicActiveTab, setMusicActiveTab] = useState<'tendance' | 'favoris' | 'tout'>('tendance');
  const [musicSearchQuery, setMusicSearchQuery] = useState<string>('');
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('andrea_fav_songs');
      return stored ? JSON.parse(stored) : ['g1', 'g2', 'g19'];
    } catch {
      return ['g1', 'g2', 'g19'];
    }
  });

  const toggleFavoriteSong = (id: string) => {
    setFavoriteSongIds(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      try {
        localStorage.setItem('andrea_fav_songs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtrage des chansons du catalogue
  const filteredSongs = GOOGLE_SONGS_CATALOGUE.filter(song => {
    const matchesTab = 
      musicActiveTab === 'tout' ||
      (musicActiveTab === 'tendance' && song.isTrending) ||
      (musicActiveTab === 'favoris' && favoriteSongIds.includes(song.id));

    const q = musicSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.badge.toLowerCase().includes(q) ||
      song.category.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  // Espace Andrea IA persistant à droite
  const [andreaChatInput, setAndreaChatInput] = useState<string>('');
  const [andreaMessages, setAndreaMessages] = useState<Array<{ id: string; role: 'user' | 'andrea'; text: string; time: string }>>([
    {
      id: 'm1',
      role: 'andrea',
      text: 'Bonjour ! Je suis Andrea dans votre Studio de Montage. Je peux créer un diaporama complet, concevoir un script viral, ou synchroniser automatiquement sons et sous-titres.',
      time: 'Maintenant'
    }
  ]);
  const [isAndreaThinking, setIsAndreaThinking] = useState<boolean>(false);
  const andreaChatEndRef = useRef<HTMLDivElement | null>(null);

  // Animation timeline
  const playedClipsRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTimeSec(prev => {
        const next = prev + deltaSec;
        if (next >= maxDurationSec) {
          setIsPlaying(false);
          playedClipsRef.current.clear();
          setPreviewOutroMode(true);
          return 0;
        }

        // Jouer les sons de la timeline
        if (!isMuted) {
          audioClips.forEach(clip => {
            if (prev <= clip.startTimeSec && next >= clip.startTimeSec && !playedClipsRef.current.has(clip.id)) {
              synthEngine.playSound(clip.type);
              playedClipsRef.current.add(clip.id);
            }
          });
        }

        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, audioClips, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      andreaVoice.stop();
    } else {
      playedClipsRef.current.clear();
      setPreviewOutroMode(false);
      setIsPlaying(true);
      if (currentTimeSec < 1.0 && textZones.length > 0) {
        andreaVoice.speak(textZones[0].text);
      }
    }
  };

  const resetPlayhead = () => {
    setIsPlaying(false);
    setCurrentTimeSec(0);
    playedClipsRef.current.clear();
    setPreviewOutroMode(false);
    andreaVoice.stop();
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    if (!isVideo && !isImage) {
      alert("Veuillez sélectionner un fichier vidéo ou photo.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setMediaFile({
      url: objectUrl,
      type: isVideo ? 'video' : 'image',
      name: file.name
    });
    setIsPlusMenuOpen(false);
  };

  // Insérer une zone de texte depuis le "+"
  const handleInsertTextZone = () => {
    const newZone: TextZone = {
      id: `tz_${Date.now()}`,
      text: 'VOTRE TEXTE ICI',
      fontFamily: activeFontFamily,
      fontSize: activeFontSize,
      isBold: isBold,
      isItalic: isItalic,
      isUnderline: isUnderline,
      isUppercase: isUppercase,
      textAlign: textAlign,
      textColor: textColor,
      xPercent: 50,
      yPercent: Math.min(75, 35 + textZones.length * 15),
      startTimeSec: currentTimeSec,
      endTimeSec: Math.min(maxDurationSec, currentTimeSec + 8),
    };
    setTextZones(prev => [...prev, newZone]);
    setSelectedTextZoneId(newZone.id);
    setIsPlusMenuOpen(false);
    synthEngine.playSound('whoosh_fast');
  };

  // Ajouter une chanson / son sélectionné sur la timeline avec sélection immédiate du moment
  const handleSelectSongToTimeline = (song: SongItem) => {
    const newClip: TimelineAudioClip = {
      id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: `${song.title} - ${song.artist}`,
      type: song.synthType,
      startTimeSec: Math.min(currentTimeSec, Math.max(0, maxDurationSec - song.durationSec)),
      durationSec: song.durationSec,
      color: song.color,
      volume: 0.85,
    };
    setAudioClips(prev => [...prev, newClip]);
    synthEngine.playSound(song.synthType);
    setIsMusicModalOpen(false);
    setIsPlusMenuOpen(false);

    // Ouvrir immédiatement le sélecteur temporel pour choisir précisément à quel moment le placer
    setTimingEditorTarget({
      kind: 'audio',
      id: newClip.id,
      name: newClip.name,
      startTimeSec: newClip.startTimeSec,
      durationSec: newClip.durationSec,
    });
    setIsTimingModalOpen(true);
  };

  // Ajouter une image ou un GIF sur la timeline avec sélection immédiate du moment
  const handleSelectImageGifToTimeline = (name: string, url: string, type: 'image' | 'gif' = 'gif') => {
    const newClip: OverlayImageGifClip = {
      id: `ov_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: name,
      url: url,
      type: type,
      startTimeSec: currentTimeSec,
      durationSec: 4.0,
      xPercent: 50,
      yPercent: 45,
      widthPercent: 35,
    };
    setOverlayClips(prev => [...prev, newClip]);
    setIsImageGifModalOpen(false);
    setIsPlusMenuOpen(false);

    // Ouvrir immédiatement le sélecteur temporel
    setTimingEditorTarget({
      kind: 'overlay',
      id: newClip.id,
      name: newClip.name,
      startTimeSec: newClip.startTimeSec,
      durationSec: newClip.durationSec,
    });
    setIsTimingModalOpen(true);
  };

  // Upload d'image ou GIF personnalisé depuis l'appareil
  const handleCustomImageGifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const isGif = file.type.includes('gif') || file.name.toLowerCase().endsWith('.gif');
    handleSelectImageGifToTimeline(file.name.replace(/\.[^/.]+$/, ""), url, isGif ? 'gif' : 'image');
  };

  // Envoi de message à Andrea dans le volet droit persistant
  const handleSendAndreaMessage = async (customPrompt?: string) => {
    const query = customPrompt || andreaChatInput.trim();
    if (!query) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAndreaMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setAndreaChatInput('');
    setIsAndreaThinking(true);

    try {
      const res = await andreaEngine.sendQuery(
        `[Mode Studio Montage & Diaporama] Requête: "${query}". Donne un plan ou des recommandations précises de montage.`
      );

      const andreaReply = {
        id: `a_${Date.now()}`,
        role: 'andrea' as const,
        text: res.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAndreaMessages(prev => [...prev, andreaReply]);

      if (query.toLowerCase().includes('diaporama')) {
        setTextZones([
          {
            id: 'slide_1',
            text: '1. LE SECRET DU SUCCÈS',
            fontFamily: FONT_OPTIONS[3].family,
            fontSize: 34,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isUppercase: true,
            textAlign: 'center',
            textColor: '#FACC15',
            xPercent: 50,
            yPercent: 40,
            startTimeSec: 0,
            endTimeSec: 10
          },
          {
            id: 'slide_2',
            text: '2. PASSER À L\'ACTION EN 3 ÉTAPES',
            fontFamily: FONT_OPTIONS[1].family,
            fontSize: 30,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isUppercase: true,
            textAlign: 'center',
            textColor: '#22C55E',
            xPercent: 50,
            yPercent: 45,
            startTimeSec: 10,
            endTimeSec: 20
          }
        ]);
        setSelectedTextZoneId('slide_1');
      }

      andreaVoice.speak(res.text.slice(0, 140));
    } catch {
      setAndreaMessages(prev => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          role: 'andrea',
          text: 'Je suis prête à vous aider sur vos montages ou diaporamas. Que souhaitez-vous ajouter ?',
          time: 'Maintenant'
        }
      ]);
    } finally {
      setIsAndreaThinking(false);
      setTimeout(() => andreaChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const selectedModel = FRAME_MODELS.find(m => m.id === activeFrame) || FRAME_MODELS[0];
  const bgPreset = BACKGROUND_PRESETS.find(b => b.id === activeBackground) || BACKGROUND_PRESETS[1];

  return (
    <div className="flex flex-col h-full bg-[#0a0718] text-white overflow-hidden select-none">
      
      {/* 1. BARRE SUPÉRIEURE TYPE CANVA & LIBREOFFICE : BOUTON RETOUR + CRÉATION DE VISUELS + OUTILS */}
      <header className="bg-[#120c2b] border-b border-[#5A33FF33] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20 shadow-md">
        
        {/* Section Gauche : BOUTON RETOUR + CRÉATION DE VISUELS */}
        <div className="flex items-center gap-2 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 rounded-xl bg-[#1b143c] hover:bg-[#281d59] border border-[#5A33FF44] text-[#c4b5fd] hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              title="Retour à la discussion"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </button>
          )}

          <button
            onClick={() => setStudioMode(m => m === 'montage' ? 'visuels' : 'montage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border shadow ${
              studioMode === 'visuels'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-pink-400'
                : 'bg-[#1b143c] hover:bg-[#281d59] text-white border-[#5A33FF44]'
            }`}
            title="Basculer vers la création de visuels"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Création de visuels</span>
          </button>
        </div>

        {/* Section Centrale : Modèle de Cadre, Police Canva/LibreOffice, Taille, Styles, Fond */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Choix du Cadre */}
          <div className="flex items-center bg-[#1b143c] p-0.5 rounded-xl border border-[#5A33FF44]">
            {FRAME_MODELS.map(frame => (
              <button
                key={frame.id}
                onClick={() => setActiveFrame(frame.id)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                  activeFrame === frame.id
                    ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                    : 'text-[#c4b5fd] hover:text-white'
                }`}
                title={frame.sublabel}
              >
                {frame.id}
              </button>
            ))}
          </div>

          {/* Police */}
          <select
            value={activeFontFamily}
            onChange={e => {
              const newFont = e.target.value;
              setActiveFontFamily(newFont);
              updateSelectedZone({ fontFamily: newFont });
            }}
            className="bg-[#1b143c] border border-[#5A33FF44] text-white text-xs font-semibold rounded-xl px-2 py-1.5 focus:outline-none cursor-pointer max-w-[140px] truncate"
            title="Police typographique"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.name} value={font.family} className="bg-[#120c2b]">
                {font.name}
              </option>
            ))}
          </select>

          {/* Taille */}
          <div className="flex items-center bg-[#1b143c] border border-[#5A33FF44] rounded-xl px-1.5 py-0.5">
            <button
              onClick={() => {
                const s = Math.max(14, activeFontSize - 2);
                setActiveFontSize(s);
                updateSelectedZone({ fontSize: s });
              }}
              className="px-1 text-xs font-bold text-[#c4b5fd] hover:text-white"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold px-1 text-white">{activeFontSize}</span>
            <button
              onClick={() => {
                const s = Math.min(80, activeFontSize + 2);
                setActiveFontSize(s);
                updateSelectedZone({ fontSize: s });
              }}
              className="px-1 text-xs font-bold text-[#c4b5fd] hover:text-white"
            >
              +
            </button>
          </div>

          {/* Gras, Italique, Souligné, Casse */}
          <div className="flex items-center bg-[#1b143c] border border-[#5A33FF44] rounded-xl p-0.5">
            <button
              onClick={() => {
                const b = !isBold;
                setIsBold(b);
                updateSelectedZone({ isBold: b });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${isBold ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Gras"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const it = !isItalic;
                setIsItalic(it);
                updateSelectedZone({ isItalic: it });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${isItalic ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Italique"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const u = !isUnderline;
                setIsUnderline(u);
                updateSelectedZone({ isUnderline: u });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${isUnderline ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Souligné"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const up = !isUppercase;
                setIsUppercase(up);
                updateSelectedZone({ isUppercase: up });
              }}
              className={`px-1.5 py-1 rounded-lg text-[10px] font-black transition ${isUppercase ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Majuscules"
            >
              TT
            </button>
          </div>

          {/* Alignement */}
          <div className="flex items-center bg-[#1b143c] border border-[#5A33FF44] rounded-xl p-0.5">
            <button
              onClick={() => { setTextAlign('left'); updateSelectedZone({ textAlign: 'left' }); }}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'left' ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setTextAlign('center'); updateSelectedZone({ textAlign: 'center' }); }}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'center' ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setTextAlign('right'); updateSelectedZone({ textAlign: 'right' }); }}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'right' ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Couleur */}
          <div className="flex items-center gap-1 bg-[#1b143c] border border-[#5A33FF44] rounded-xl px-2 py-1">
            <span className="text-[10px] text-[#c4b5fd] font-bold">Couleur</span>
            <input
              type="color"
              value={textColor}
              onChange={e => {
                const c = e.target.value;
                setTextColor(c);
                updateSelectedZone({ textColor: c });
              }}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
          </div>

          {/* Fond */}
          <div className="flex items-center gap-1.5 bg-[#1b143c] border border-[#5A33FF44] rounded-xl px-2.5 py-1">
            <span className="text-[10px] text-[#c4b5fd] font-bold">Fond :</span>
            <select
              value={activeBackground}
              onChange={e => {
                setActiveBackground(e.target.value);
                setCustomBackgroundImage(null);
              }}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {BACKGROUND_PRESETS.map(preset => (
                <option key={preset.id} value={preset.id} className="bg-[#120c2b]">
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Droite : Outro & Exporter */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPreviewOutroMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              previewOutroMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#1b143c] text-[#c4b5fd] hover:text-white border-[#5A33FF44]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{previewOutroMode ? 'Masquer Outro' : 'Aperçu Outro'}</span>
          </button>

          <button
            onClick={() => alert("Visuel HD exporté avec succès (avec filigrane 'made with Andrea AI' et écran de fin) !")}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </header>

      {/* 2. ESPACE CENTRAL : GAUCHE (CRÉATION VIDÉO/PHOTOS + TIMELINE ÉPURÉE) & DROITE (ESPACE ANDREA IA) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ================= GAUCHE / CENTRE : CRÉATION VIDÉO & TIMELINE ================= */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0718] relative">
          
          {/* ESPACE SUPÉRIEUR : PRÉVISUALISATION & IMPORT VIDÉO / PHOTOS */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-5 overflow-auto relative bg-[#090616]">
            <div 
              className={`relative shadow-2xl rounded-2xl overflow-hidden border border-[#5A33FF44] transition-all flex flex-col items-center justify-center ${selectedModel.aspectClass} ${
                customBackgroundImage ? '' : bgPreset.bgClass
              }`}
              style={
                customBackgroundImage ? { backgroundImage: `url(${customBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}
              }
            >
              {mediaFile ? (
                mediaFile.type === 'video' ? (
                  <video
                    src={mediaFile.url}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls={false}
                    muted={isMuted}
                    playsInline
                    autoPlay={isPlaying}
                    loop
                  />
                ) : (
                  <img
                    src={mediaFile.url}
                    alt={mediaFile.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white/5 transition group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1b143c] border border-[#5A33FF55] flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-[#8B70FF] transition shadow-lg mb-3">
                    <Upload className="w-6 h-6 text-purple-300" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    Cliquez ou glissez une vidéo ou photo
                  </span>
                  <span className="text-[10px] text-[#c4b5fd]/70 mt-1 max-w-[200px]">
                    Format {activeFrame} · MP4, PNG, JPG
                  </span>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Zones de texte insérées dynamiquement */}
              {textZones.map(zone => {
                const isSelected = selectedTextZoneId === zone.id;
                const isVisible = currentTimeSec >= zone.startTimeSec && currentTimeSec <= zone.endTimeSec;

                return (
                  <div
                    key={zone.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTextZoneId(zone.id);
                      setTimingEditorTarget({
                        kind: 'text',
                        id: zone.id,
                        name: zone.text,
                        startTimeSec: zone.startTimeSec,
                        durationSec: Math.max(1, zone.endTimeSec - zone.startTimeSec),
                      });
                    }}
                    style={{
                      position: 'absolute',
                      top: `${zone.yPercent}%`,
                      left: `${zone.xPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      fontFamily: zone.fontFamily,
                      fontSize: `${Math.round(zone.fontSize * 0.75)}px`,
                      fontWeight: zone.isBold ? 900 : 400,
                      fontStyle: zone.isItalic ? 'italic' : 'normal',
                      textDecoration: zone.isUnderline ? 'underline' : 'none',
                      color: zone.textColor,
                      textAlign: zone.textAlign,
                      opacity: isVisible ? 1 : 0.4,
                      zIndex: isSelected ? 30 : 20,
                    }}
                    className={`cursor-pointer px-3 py-1.5 rounded-xl transition-all ${
                      isSelected
                        ? 'border-2 border-purple-400 bg-black/60 shadow-xl scale-105'
                        : 'hover:border hover:border-white/30 bg-black/20'
                    }`}
                  >
                    <input
                      type="text"
                      value={zone.isUppercase ? zone.text.toUpperCase() : zone.text}
                      onChange={e => updateSelectedZone({ text: e.target.value })}
                      className="bg-transparent text-center focus:outline-none w-full min-w-[120px]"
                    />
                  </div>
                );
              })}

              {/* Images & GIFs insérés dynamiquement avec timing précis */}
              {overlayClips.map(clip => {
                const isVisible = currentTimeSec >= clip.startTimeSec && currentTimeSec <= (clip.startTimeSec + clip.durationSec);
                if (!isVisible) return null;

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimingEditorTarget({
                        kind: 'overlay',
                        id: clip.id,
                        name: clip.name,
                        startTimeSec: clip.startTimeSec,
                        durationSec: clip.durationSec,
                      });
                      setIsTimingModalOpen(true);
                    }}
                    style={{
                      position: 'absolute',
                      top: `${clip.yPercent}%`,
                      left: `${clip.xPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${clip.widthPercent}%`,
                      zIndex: 25,
                    }}
                    className="cursor-pointer hover:ring-2 hover:ring-pink-400 rounded-2xl transition-all group drop-shadow-2xl"
                    title="Cliquer pour ajuster le moment d'apparition dans la vidéo"
                  >
                    <img 
                      src={clip.url} 
                      alt={clip.name} 
                      className="w-full h-auto object-contain pointer-events-none rounded-xl"
                    />
                    <span className="opacity-0 group-hover:opacity-100 absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] bg-black/80 px-2 py-0.5 rounded text-white whitespace-nowrap border border-white/20 font-mono">
                      {clip.startTimeSec.toFixed(1)}s - {(clip.startTimeSec + clip.durationSec).toFixed(1)}s
                    </span>
                  </div>
                );
              })}

              {/* Filigrane discret en bas à droite (comme dans CapCut) */}
              <div className="absolute bottom-2.5 right-3 z-30 pointer-events-none flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="text-[9px] font-semibold text-zinc-300 tracking-wide">
                  made with <strong className="text-white">Andrea AI</strong>
                </span>
              </div>

              {/* Écran Outro finale officielle : LOGO SEUL SANS CARRÉ SUPERFLU */}
              {(previewOutroMode || currentTimeSec >= maxDurationSec - 1.5) && (
                <div className="absolute inset-0 bg-[#090616]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                  <img
                    src="/logo_bea.png"
                    alt="Andrea AI Logo"
                    className="w-16 h-16 object-contain mb-3 drop-shadow-2xl animate-pulse"
                    onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
                  />
                  <h3 className="text-2xl font-black text-white tracking-tight">Andrea AI</h3>
                  <p className="text-[11px] text-[#c4b5fd] font-bold tracking-widest uppercase mt-1">
                    By BehaviorLab AI
                  </p>
                  <button
                    onClick={() => setPreviewOutroMode(false)}
                    className="mt-4 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[10px] text-zinc-300"
                  >
                    Fermer l'aperçu
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BARRE DE LECTURE (Sous le canevas vidéo) */}
          <div className="bg-[#100b24] px-4 py-2 border-t border-b border-[#5A33FF33] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white flex items-center justify-center shadow transition"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={resetPlayhead}
                className="p-1.5 rounded-lg bg-[#1b143c] hover:bg-[#251c52] text-[#c4b5fd] hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-[#1b143c]">
                {currentTimeSec.toFixed(1)}s / {maxDurationSec.toFixed(1)}s
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-2">
              <input
                type="range"
                min="0"
                max={maxDurationSec}
                step="0.1"
                value={currentTimeSec}
                onChange={e => {
                  setCurrentTimeSec(parseFloat(e.target.value));
                  playedClipsRef.current.clear();
                }}
                className="w-full h-1.5 bg-[#201844] rounded-lg appearance-none cursor-pointer accent-[#5A33FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(m => !m)}
                className="p-1.5 rounded-lg bg-[#1b143c] text-[#c4b5fd] hover:text-white transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* PISTES TIMELINE ÉPURÉES (AUCUNE FAUSSE CASE DE COULEUR IMPOSÉE, SEUL LE PLUS EST DEMANDÉ) */}
          <div className="h-44 sm:h-52 bg-[#0c081e] p-3 overflow-y-auto space-y-2 border-t border-[#5A33FF22] relative">
            
            {/* Piste 1 : Vidéo & Média */}
            <div className="flex items-center gap-2">
              <div className="w-32 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>Piste 1 : Vidéo</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-3">
                {mediaFile ? (
                  <div className="h-full w-full bg-purple-600/30 rounded-lg flex items-center justify-between text-[10px] text-purple-200 px-2 font-mono">
                    <span className="truncate">{mediaFile.name}</span>
                    <span className="text-[9px] text-purple-300">Format {activeFrame}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-[#c4b5fd]/40 italic">Aucun média importé (cliquez sur + pour ajouter)</span>
                )}
              </div>
            </div>

            {/* Piste 2 : Voix Andrea */}
            <div className="flex items-center gap-2">
              <div className="w-32 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Volume1 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Piste 2 : Voix</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-emerald-500/20 relative overflow-hidden flex items-center px-3">
                <div className="h-full w-full bg-emerald-500/10 rounded-lg flex items-center justify-between text-[10px] text-emerald-300 px-2 font-mono">
                  <span>Voix Fluide Naturelle</span>
                  <span className="text-[9px] text-emerald-400">15 langues actives</span>
                </div>
              </div>
            </div>

            {/* Piste 3 : Musique & Sons SFX */}
            <div className="flex items-center gap-2">
              <div className="w-32 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>Piste 3 : Musique</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-2">
                {audioClips.length === 0 ? (
                  <span className="text-[10px] text-[#c4b5fd]/40 italic px-2">Aucune musique ajoutée (utilisez le bouton + ci-dessous)</span>
                ) : (
                  audioClips.map(clip => {
                    const leftPercent = (clip.startTimeSec / maxDurationSec) * 100;
                    const widthPercent = (clip.durationSec / maxDurationSec) * 100;
                    return (
                      <div
                        key={clip.id}
                        style={{ left: `${leftPercent}%`, width: `${Math.max(14, widthPercent)}%` }}
                        className={`absolute h-6 rounded-lg ${clip.color} text-white text-[9px] font-bold flex items-center justify-between px-1.5 shadow truncate group cursor-pointer hover:ring-1 hover:ring-white`}
                        onClick={() => {
                          synthEngine.playSound(clip.type);
                          setTimingEditorTarget({
                            kind: 'audio',
                            id: clip.id,
                            name: clip.name,
                            startTimeSec: clip.startTimeSec,
                            durationSec: clip.durationSec,
                          });
                          setIsTimingModalOpen(true);
                        }}
                        title="Cliquer pour choisir à quel moment de la vidéo le mettre"
                      >
                        <span className="truncate">{clip.name}</span>
                        <span className="text-[8px] opacity-75 font-mono ml-1">{clip.startTimeSec.toFixed(1)}s</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setAudioClips(prev => prev.filter(c => c.id !== clip.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-200 transition ml-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Piste 4 : Images & GIFs (Remplie quand l'utilisateur en ajoute via le bouton +) */}
            <div className="flex items-center gap-2">
              <div className="w-32 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>Piste 4 : Images/GIF</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-2">
                {overlayClips.length === 0 ? (
                  <span className="text-[10px] text-[#c4b5fd]/40 italic px-2">Aucune image/GIF inséré (cliquez sur + pour ajouter)</span>
                ) : (
                  overlayClips.map(clip => {
                    const leftPercent = (clip.startTimeSec / maxDurationSec) * 100;
                    const widthPercent = (clip.durationSec / maxDurationSec) * 100;
                    return (
                      <div
                        key={clip.id}
                        style={{ left: `${leftPercent}%`, width: `${Math.max(14, widthPercent)}%` }}
                        onClick={() => {
                          setTimingEditorTarget({
                            kind: 'overlay',
                            id: clip.id,
                            name: clip.name,
                            startTimeSec: clip.startTimeSec,
                            durationSec: clip.durationSec,
                          });
                          setIsTimingModalOpen(true);
                        }}
                        className="absolute h-6 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[9px] font-bold flex items-center justify-between px-1.5 shadow truncate group cursor-pointer hover:ring-1 hover:ring-white"
                        title="Cliquer pour choisir à quel moment de la vidéo placer l'image ou le GIF"
                      >
                        <span className="truncate">{clip.name}</span>
                        <span className="text-[8px] opacity-75 font-mono ml-1">{clip.startTimeSec.toFixed(1)}s</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOverlayClips(prev => prev.filter(c => c.id !== clip.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-200 transition ml-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Piste 5 : Textes */}
            <div className="flex items-center gap-2">
              <div className="w-32 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                <span>Piste 5 : Textes</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-2">
                {textZones.length === 0 ? (
                  <span className="text-[10px] text-[#c4b5fd]/40 italic px-2">Aucune zone de texte (cliquez sur + pour insérer)</span>
                ) : (
                  textZones.map(zone => {
                    const leftPercent = (zone.startTimeSec / maxDurationSec) * 100;
                    const widthPercent = ((zone.endTimeSec - zone.startTimeSec) / maxDurationSec) * 100;
                    const isSelected = selectedTextZoneId === zone.id;
                    return (
                      <div
                        key={zone.id}
                        style={{ left: `${leftPercent}%`, width: `${Math.max(14, widthPercent)}%` }}
                        onClick={() => {
                          setSelectedTextZoneId(zone.id);
                          setTimingEditorTarget({
                            kind: 'text',
                            id: zone.id,
                            name: zone.text,
                            startTimeSec: zone.startTimeSec,
                            durationSec: Math.max(1, zone.endTimeSec - zone.startTimeSec),
                          });
                          setIsTimingModalOpen(true);
                        }}
                        className={`absolute h-6 rounded-lg text-[9px] font-bold flex items-center justify-between px-1.5 truncate cursor-pointer transition ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-white'
                            : 'bg-[#251a4f] text-[#c4b5fd] hover:text-white'
                        }`}
                        title="Cliquer pour choisir à quel moment de la vidéo afficher le texte"
                      >
                        <span className="truncate">{zone.text}</span>
                        <span className="text-[8px] opacity-75 font-mono ml-1">{zone.startTimeSec.toFixed(1)}s</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextZones(prev => prev.filter(z => z.id !== zone.id));
                          }}
                          className="p-0.5 hover:text-red-300 ml-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Curseur de lecture vertical rouge */}
            <div
              style={{ left: `calc(8.5rem + ${(currentTimeSec / maxDurationSec) * 82}%)` }}
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-md pointer-events-none z-30"
            >
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -ml-1 -mt-0.5" />
            </div>
          </div>

          {/* ================= BOUTON "+" EN BAS À GAUCHE ================= */}
          <div className="absolute bottom-4 left-4 z-40">
            <button
              onClick={() => setIsPlusMenuOpen(prev => !prev)}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:brightness-110 active:scale-95 text-white flex items-center justify-center shadow-2xl border-2 border-purple-400/50 transition cursor-pointer"
              title="Ajouter au montage"
            >
              <Plus className={`w-6 h-6 transition-transform duration-200 ${isPlusMenuOpen ? 'rotate-45' : ''}`} />
            </button>

            {/* Menu Popover du Bouton "+" */}
            {isPlusMenuOpen && (
              <div className="absolute bottom-14 left-0 w-64 bg-[#140e2d] border border-[#5A33FF55] rounded-2xl shadow-2xl p-2 space-y-1 animate-in slide-in-from-bottom-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-[#c4b5fd] uppercase tracking-wider border-b border-white/5">
                  Ajouter au projet :
                </div>

                {/* Option 1 : Sélectionner une musique/son */}
                <button
                  onClick={() => {
                    setIsMusicModalOpen(true);
                    setIsPlusMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Sélectionner une musique/son</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Chansons Google, tendances & favoris</div>
                  </div>
                </button>

                {/* Option 2 : Insérer une image ou un GIF */}
                <button
                  onClick={() => {
                    setIsImageGifModalOpen(true);
                    setIsPlusMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Insérer une image ou un GIF</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Photos, stickers & GIFs animés</div>
                  </div>
                </button>

                {/* Option 3 : Insérer une zone de texte */}
                <button
                  onClick={handleInsertTextZone}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Insérer une zone de texte</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Active la police en haut</div>
                  </div>
                </button>

                {/* Option 4 : Importer Vidéo ou Photo principale */}
                <label className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5 cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Importer Vidéo / Photo</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Depuis votre appareil</div>
                  </div>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* MODAL CATALOGUE DE MUSIQUE & SONS GOOGLE : ONGLETS TENDANCE & FAVORIS + BARRE DE RECHERCHE EN BAS */}
            {isMusicModalOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-[#120c2b] border-2 border-[#5A33FF66] rounded-3xl max-w-xl w-full flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 overflow-hidden">
                  
                  {/* Header avec Titre et Fermeture */}
                  <div className="p-4 border-b border-[#5A33FF33] flex items-center justify-between shrink-0 bg-[#160f35]">
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-amber-400" />
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-white">Sélectionner une musique/son</h3>
                        <p className="text-[10px] text-[#c4b5fd]">Catalogue universel de chansons et sons disponibles sur Google</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMusicModalOpen(false)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* ONGLETS TENDANCE & FAVORIS */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#5A33FF22] bg-[#0e0922] shrink-0">
                    <button
                      onClick={() => setMusicActiveTab('tendance')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        musicActiveTab === 'tendance'
                          ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow'
                          : 'bg-[#1b143c] text-[#c4b5fd] hover:text-white'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>Tendance</span>
                    </button>

                    <button
                      onClick={() => setMusicActiveTab('favoris')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        musicActiveTab === 'favoris'
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow'
                          : 'bg-[#1b143c] text-[#c4b5fd] hover:text-white'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Favoris ({favoriteSongIds.length})</span>
                    </button>

                    <button
                      onClick={() => setMusicActiveTab('tout')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        musicActiveTab === 'tout'
                          ? 'bg-[#5A33FF] text-white shadow'
                          : 'bg-[#1b143c] text-[#c4b5fd] hover:text-white'
                      }`}
                    >
                      Toutes les chansons
                    </button>
                  </div>

                  {/* Liste des Chansons */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredSongs.length === 0 ? (
                      <div className="py-12 text-center text-xs text-[#c4b5fd]">
                        Aucune musique trouvée pour cette recherche. Essayez un autre titre ou artiste.
                      </div>
                    ) : (
                      filteredSongs.map(song => {
                        const isFav = favoriteSongIds.includes(song.id);
                        return (
                          <div
                            key={song.id}
                            className="p-3 rounded-2xl bg-[#1b143c] hover:bg-[#251b54] border border-[#5A33FF33] hover:border-[#8B70FF] transition flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                onClick={() => synthEngine.playSound(song.synthType)}
                                className="w-9 h-9 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-white flex items-center justify-center shrink-0 shadow transition"
                                title="Écouter un extrait"
                              >
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              </button>

                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                                  <span className="truncate">{song.title}</span>
                                  {song.isTrending && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold shrink-0">
                                      {song.badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#c4b5fd] flex items-center gap-2 mt-0.5">
                                  <span>{song.artist}</span>
                                  <span>•</span>
                                  <span className="font-mono">{song.durationLabel}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => toggleFavoriteSong(song.id)}
                                className={`p-1.5 rounded-lg transition ${
                                  isFav ? 'text-amber-400 bg-amber-400/10' : 'text-[#c4b5fd]/40 hover:text-amber-400'
                                }`}
                                title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                              >
                                <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                              </button>

                              <button
                                onClick={() => handleSelectSongToTimeline(song)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white text-xs font-bold shadow transition flex items-center gap-1"
                              >
                                <span>+ Insérer</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* BARRE DE RECHERCHE STRICTEMENT PLACÉE EN BAS (COMME DEMANDÉ) */}
                  <div className="p-3 border-t border-[#5A33FF33] bg-[#0f0a24] shrink-0">
                    <div className="bg-[#181138] border border-[#5A33FF55] focus-within:border-[#8B70FF] rounded-2xl px-3 py-2 flex items-center gap-2 shadow-inner">
                      <Search className="w-4 h-4 text-[#c4b5fd] shrink-0" />
                      <input
                        type="text"
                        value={musicSearchQuery}
                        onChange={e => setMusicSearchQuery(e.target.value)}
                        placeholder="Rechercher une chanson, un artiste ou un son disponible sur Google..."
                        className="w-full bg-transparent text-white text-xs placeholder-[#c4b5fd]/50 focus:outline-none"
                      />
                      {musicSearchQuery && (
                        <button
                          onClick={() => setMusicSearchQuery('')}
                          className="text-[#c4b5fd] hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* MODAL : INSÉRER UNE IMAGE OU UN GIF */}
            {isImageGifModalOpen && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-[#120c2b] border-2 border-[#5A33FF66] rounded-3xl max-w-lg w-full flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 overflow-hidden">
                  <div className="p-4 border-b border-[#5A33FF33] flex items-center justify-between bg-[#160f35] shrink-0">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-pink-400" />
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-white">Insérer une image ou un GIF</h3>
                        <p className="text-[10px] text-[#c4b5fd]">Sélectionnez un GIF viral ou téléversez votre fichier</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsImageGifModalOpen(false)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto space-y-4 flex-1">
                    {/* Option Téléverser son propre fichier */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-white">1. Téléverser depuis votre appareil (Image ou GIF) :</span>
                      <label className="border-2 border-dashed border-[#5A33FF55] hover:border-[#8B70FF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-[#181138]/60 hover:bg-[#181138] transition">
                        <Upload className="w-6 h-6 text-purple-400 mb-1.5" />
                        <span className="text-xs font-bold text-white">Sélectionner un fichier (PNG, JPG, GIF animé)</span>
                        <span className="text-[10px] text-[#c4b5fd]">Vous pourrez choisir la seconde exacte où le placer dans la vidéo</span>
                        <input
                          type="file"
                          accept="image/*,.gif"
                          onChange={handleCustomImageGifUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Galerie de GIFs / Stickers Animés Prédéfinis */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-white">2. Ou choisir parmi les stickers & GIFs viraux :</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {PRESET_GIFS.map(g => (
                          <button
                            key={g.id}
                            onClick={() => handleSelectImageGifToTimeline(g.name, g.url, 'gif')}
                            className="bg-[#1b143c] hover:bg-[#251b54] border border-[#5A33FF33] hover:border-[#8B70FF] p-2.5 rounded-2xl flex flex-col items-center justify-center gap-2 group transition"
                          >
                            <img src={g.url} alt={g.name} className="w-16 h-16 object-contain pointer-events-none group-hover:scale-105 transition" />
                            <span className="text-[10px] font-bold text-[#c4b5fd] group-hover:text-white truncate max-w-full">{g.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL : SÉLECTIONNER À QUEL MOMENT PRÉCIS METTRE LE SON, IMAGE OU GIF */}
            {isTimingModalOpen && timingEditorTarget && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
                <div className="bg-[#140e2d] border-2 border-[#8B70FF] rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-[#5A33FF33]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">Moment précis dans la vidéo</h4>
                        <p className="text-[11px] text-[#c4b5fd] truncate max-w-[220px]">{timingEditorTarget.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsTimingModalOpen(false)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1. Curseur et valeur du Début (en secondes) */}
                  <div className="space-y-1.5 bg-[#1b143c] p-3 rounded-2xl border border-[#5A33FF33]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span>⏱️ Début du clip :</span>
                        <strong className="text-purple-300 font-mono text-sm">{timingEditorTarget.startTimeSec.toFixed(1)} s</strong>
                      </span>
                      <span className="text-[10px] text-[#c4b5fd]">de 0.0s à {maxDurationSec}s</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(0, maxDurationSec - timingEditorTarget.durationSec)}
                      step="0.1"
                      value={timingEditorTarget.startTimeSec}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setTimingEditorTarget(prev => prev ? { ...prev, startTimeSec: val } : null);
                      }}
                      className="w-full h-2 bg-[#201844] rounded-lg appearance-none cursor-pointer accent-[#8B70FF]"
                    />
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                      {[0, 1, 2, 3, 5, 8, 10, 15, 20].filter(s => s <= maxDurationSec - timingEditorTarget.durationSec).map(s => (
                        <button
                          key={s}
                          onClick={() => setTimingEditorTarget(prev => prev ? { ...prev, startTimeSec: s } : null)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                            Math.abs(timingEditorTarget.startTimeSec - s) < 0.2
                              ? 'bg-purple-600 text-white font-bold'
                              : 'bg-[#120d28] text-[#c4b5fd] hover:text-white'
                          }`}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Curseur et valeur de la Durée (en secondes) */}
                  <div className="space-y-1.5 bg-[#1b143c] p-3 rounded-2xl border border-[#5A33FF33]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span>⏳ Durée d'affichage :</span>
                        <strong className="text-emerald-400 font-mono text-sm">{timingEditorTarget.durationSec.toFixed(1)} s</strong>
                      </span>
                      <span className="text-[10px] text-[#c4b5fd]">min 0.5s</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max={Math.min(maxDurationSec - timingEditorTarget.startTimeSec, 20)}
                      step="0.1"
                      value={timingEditorTarget.durationSec}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setTimingEditorTarget(prev => prev ? { ...prev, durationSec: val } : null);
                      }}
                      className="w-full h-2 bg-[#201844] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <p className="text-[10px] text-[#c4b5fd] text-right font-mono">
                      Positionné de <strong>{timingEditorTarget.startTimeSec.toFixed(1)}s</strong> à <strong>{(timingEditorTarget.startTimeSec + timingEditorTarget.durationSec).toFixed(1)}s</strong>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (timingEditorTarget.kind === 'audio') {
                          setAudioClips(prev => prev.filter(c => c.id !== timingEditorTarget.id));
                        } else if (timingEditorTarget.kind === 'overlay') {
                          setOverlayClips(prev => prev.filter(c => c.id !== timingEditorTarget.id));
                        } else if (timingEditorTarget.kind === 'text') {
                          setTextZones(prev => prev.filter(z => z.id !== timingEditorTarget.id));
                        }
                        setIsTimingModalOpen(false);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentTimeSec(timingEditorTarget.startTimeSec);
                        if (timingEditorTarget.kind === 'audio') {
                          const clip = audioClips.find(c => c.id === timingEditorTarget.id);
                          if (clip) synthEngine.playSound(clip.type);
                        }
                      }}
                      className="px-3 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2e2260] text-purple-200 border border-[#5A33FF44] text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Tester</span>
                    </button>

                    <button
                      onClick={() => {
                        if (timingEditorTarget.kind === 'audio') {
                          setAudioClips(prev => prev.map(c => c.id === timingEditorTarget.id ? { ...c, startTimeSec: timingEditorTarget.startTimeSec, durationSec: timingEditorTarget.durationSec } : c));
                        } else if (timingEditorTarget.kind === 'overlay') {
                          setOverlayClips(prev => prev.map(c => c.id === timingEditorTarget.id ? { ...c, startTimeSec: timingEditorTarget.startTimeSec, durationSec: timingEditorTarget.durationSec } : c));
                        } else if (timingEditorTarget.kind === 'text') {
                          setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, startTimeSec: timingEditorTarget.startTimeSec, endTimeSec: timingEditorTarget.startTimeSec + timingEditorTarget.durationSec } : z));
                        }
                        setIsTimingModalOpen(false);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Valider ce timing</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* ================= DROITE : ESPACE ANDREA IA PERMANENT (TOUJOURS VISIBLE) ================= */}
        <aside className="w-full lg:w-80 xl:w-96 bg-[#110b27] border-t lg:border-t-0 lg:border-l border-[#5A33FF33] flex flex-col shrink-0 h-72 lg:h-full z-20 shadow-xl">
          <div className="p-3 border-b border-[#5A33FF22] bg-[#140e2e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/logo_bea.png" 
                alt="Andrea" 
                className="w-6 h-6 object-contain rounded-lg p-0.5 bg-[#0b0819] border border-[#5A33FF44]"
                onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
              />
              <div>
                <span className="font-extrabold text-xs text-white">Espace Andrea IA</span>
                <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold leading-none mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Studio Assistant Actif
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSendAndreaMessage("Propose 3 accroches percutantes pour ce visuel")}
              className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#201844] hover:bg-[#2b215c] text-purple-300 hover:text-white border border-[#5A33FF33] transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Idée Hook</span>
            </button>
          </div>

          <div className="p-2.5 bg-[#0d0822] border-b border-[#5A33FF15] space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c4b5fd]/80 px-1">
              Actions instantanées :
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSendAndreaMessage("Génère un diaporama complet en 3 étapes avec accroches et textes")}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
              >
                <Presentation className="w-3 h-3 text-cyan-400" />
                <span>Créer un diaporama</span>
              </button>

              <button
                onClick={() => handleSendAndreaMessage("Écris un script de vidéo virale de 30 secondes pour captiver l'attention")}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
              >
                <Wand2 className="w-3 h-3 text-pink-400" />
                <span>Script vidéo virale</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {andreaMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white rounded-br-none'
                      : 'bg-[#1b143c] border border-[#5A33FF33] text-[#e2d6ff] rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-[#c4b5fd]/60 mt-1 px-1 font-mono">
                  {msg.time}
                </span>
              </div>
            ))}

            {isAndreaThinking && (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1b143c] text-purple-300 text-xs border border-[#5A33FF33] w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span className="text-[11px] font-semibold">Andrea réfléchit et génère...</span>
              </div>
            )}

            <div ref={andreaChatEndRef} />
          </div>

          <div className="p-2.5 bg-[#0e0924] border-t border-[#5A33FF22]">
            <div className="bg-[#171032] border border-[#5A33FF44] focus-within:border-[#8B70FF] rounded-2xl p-1.5 flex items-center gap-2">
              <input
                type="text"
                value={andreaChatInput}
                onChange={e => setAndreaChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendAndreaMessage();
                  }
                }}
                placeholder="Demander à Andrea (diaporama, sons...)"
                className="flex-1 bg-transparent text-white text-xs px-2 focus:outline-none placeholder-[#c4b5fd]/50"
              />

              <button
                type="button"
                onClick={() => handleSendAndreaMessage()}
                disabled={!andreaChatInput.trim()}
                className={`p-2 rounded-xl transition ${
                  andreaChatInput.trim()
                    ? 'bg-[#5A33FF] text-white hover:brightness-110 shadow'
                    : 'text-[#c4b5fd]/30 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
  );
};

export default MusicStudioReels;
