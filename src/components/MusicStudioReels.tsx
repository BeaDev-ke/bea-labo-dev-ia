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
  ArrowLeft,
  Search,
  Star,
  Flame,
  X,
  Film,
  Layers,
  Presentation,
  Send,
  Clock,
  Image as ImageIcon,
  Radio,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { andreaVoice } from '../utils/speech';
import { andreaEngine } from '../utils/andreaRequestEngine';

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
  color?: string;
  synthType?: string;
  previewUrl?: string;
  artwork?: string;
  badge?: string;
}

export interface TimelineAudioClip {
  id: string;
  name: string;
  type: string;
  startTimeSec: number;
  durationSec: number;
  color: string;
  volume: number;
  previewUrl?: string;
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
  kind: 'audio' | 'overlay' | 'text' | 'video';
  id: string;
  name: string;
  startTimeSec: number;
  durationSec: number;
  text?: string;
  textColor?: string;
  fontSize?: number;
  isBold?: boolean;
  isUppercase?: boolean;
  bgColor?: string;
}

export const PRESET_GIFS = [
  { id: 'gif_flame', name: '🔥 Flamme Virale', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnE2Y3lzcXlxaGZ2M3B6cWl4NnRhZ3FmbzMyejB5Z3g4Z3R5Y3g3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKTDnUxE0g2fSE8/giphy.gif' },
  { id: 'gif_light', name: '💡 Ampoule Eurêka', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Zuc2ptczIxaHNyMWkxd2V1b203c2I5a2d1dnlmb3M2MHNtcXVqMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/xUPGcJ9uOZS5eqlW80/giphy.gif' },
  { id: 'gif_rocket', name: '🚀 Fusée Décollage', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNudWZ5d2w2OXAzMWc2MnNocW14b29xMDR4cnM4Y3Y5d3g5d2NodyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/fem2uTTbZSnnW/giphy.gif' },
  { id: 'gif_success', name: '🎉 Victoire & Succès', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm40N2pnaDB4dHozMnhlMHkzaHBkczZkMXNsc3Vob2Z2eW03d2JleSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/artj92V8o75VPL7AeQ/giphy.gif' },
  { id: 'gif_check', name: '✅ Validation Verte', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXl2M3Juc2M0bXo0eWhuNG82Z2t4NGtjc3RvaG9mOG93c3BmbzhvMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13CoXDiaCcCoyk/giphy.gif' }
];

// Catalogue initial de chansons phares préchargées
export const POPULAR_SEED_SONGS: SongItem[] = [
  { id: 'seed_1', title: 'Blinding Lights', artist: 'The Weeknd', category: 'pop', durationSec: 30, durationLabel: '3:20', isTrending: true, color: 'bg-rose-600', badge: 'Hit Mondial', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/44/7f/b4/447fb4ee-a5ef-e64e-4b47-c037807ec173/mzaf_14725330882874311894.plus.aac.p.m4a' },
  { id: 'seed_2', title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell', category: 'electro', durationSec: 30, durationLabel: '4:08', isTrending: true, color: 'bg-fuchsia-600', badge: 'Légende', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/33/c4/8c/33c48c66-1c39-2a90-3ce4-6338b25aafe0/mzaf_10526084042878652467.plus.aac.p.m4a' },
  { id: 'seed_3', title: "God's Plan", artist: 'Drake', category: 'rap', durationSec: 30, durationLabel: '3:18', isTrending: true, color: 'bg-amber-600', badge: 'Rap US', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/1e/99/33/1e993311-9659-33b6-e2a2-3c1bb0c7aaee/mzaf_8496733221293399433.plus.aac.p.m4a' },
  { id: 'seed_4', title: 'Papaoutai', artist: 'Stromae', category: 'pop', durationSec: 30, durationLabel: '3:52', isTrending: true, color: 'bg-blue-600', badge: 'Classique FR', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/48/84/c4/4884c478-f7d1-081d-b8bc-891d4e0e5a1b/mzaf_7136066795493215264.plus.aac.p.m4a' },
  { id: 'seed_5', title: 'Time (Inception)', artist: 'Hans Zimmer', category: 'cinema', durationSec: 30, durationLabel: '4:35', isTrending: true, color: 'bg-amber-700', badge: 'Cinématique', previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/71/6a/c5/716ac565-df61-591a-7b3e-7975bf87e954/mzaf_13337965415717658744.plus.aac.p.m4a' },
  { id: 'seed_6', title: 'Morning Coffee Lofi', artist: 'Chilled Beats', category: 'lofi', durationSec: 30, durationLabel: '2:45', isTrending: true, color: 'bg-teal-600', badge: 'Chill Study' },
  { id: 'sfx_1', title: '⚡ Whoosh Rapide Accroche', artist: 'Studio SFX', category: 'sfx', durationSec: 1.2, durationLabel: '0:01', isTrending: true, color: 'bg-amber-500', synthType: 'whoosh_fast', badge: 'Transition' },
  { id: 'sfx_2', title: '💥 808 Bass Drop Sub', artist: 'Studio SFX', category: 'sfx', durationSec: 2.0, durationLabel: '0:02', isTrending: true, color: 'bg-rose-500', synthType: 'drop', badge: 'Impact' },
  { id: 'sfx_3', title: '🔔 Cloche Succès / Cash', artist: 'Studio SFX', category: 'sfx', durationSec: 1.5, durationLabel: '0:01', isTrending: true, color: 'bg-emerald-500', synthType: 'bell_cash', badge: 'Victoire' },
  { id: 'sfx_4', title: '🛑 Glitch & Tension', artist: 'Studio SFX', category: 'sfx', durationSec: 0.8, durationLabel: '0:01', isTrending: false, color: 'bg-pink-600', synthType: 'glitch', badge: 'Cyber' },
];

// Synthétiseur Web Audio API pour effets SFX instantanés
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

  public playSound(soundType: string = 'whoosh') {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      if (soundType.includes('whoosh')) {
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
        gain.gain.linearRampToValueAtTime(0.5, t + 0.2);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.45);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(t);
        noise.stop(t + 0.45);
      } else if (soundType.includes('bell') || soundType.includes('cash')) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1560, t);
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.9);
      } else if (soundType.includes('drop') || soundType.includes('808')) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.6);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.75);
      } else {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      }
    } catch {}
  }
}

const synthEngine = new SynthesizerEngine();

export interface MusicStudioReelsProps {
  onBack?: () => void;
  onSwitchToVisualComposition?: () => void;
}

export const MusicStudioReels: React.FC<MusicStudioReelsProps> = ({ 
  onBack, 
  onSwitchToVisualComposition 
}) => {
  // Média importé (Vidéo ou Photo principale)
  const [mediaFile, setMediaFile] = useState<{ url: string; type: 'video' | 'image'; name: string } | null>(null);

  // Éléments de montage sur la piste unique
  const [textZones, setTextZones] = useState<TextZone[]>([]);
  const [selectedTextZoneId, setSelectedTextZoneId] = useState<string | null>(null);
  const [audioClips, setAudioClips] = useState<TimelineAudioClip[]>([]);
  const [overlayClips, setOverlayClips] = useState<OverlayImageGifClip[]>([]);

  // Lecteur et Timeline
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [maxDurationSec, setMaxDurationSec] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const playheadIntervalRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Bouton Plus en bas à droite et modales
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState<boolean>(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  const [isImageGifModalOpen, setIsImageGifModalOpen] = useState<boolean>(false);
  const [previewOutroMode, setPreviewOutroMode] = useState<boolean>(false);

  // Modal de modification de la durée totale (valeurs de x à x et saisie personnalisée)
  const [isDurationModalOpen, setIsDurationModalOpen] = useState<boolean>(false);
  const [customDurationInput, setCustomDurationInput] = useState<string>('30');

  // MOTEUR DE RECHERCHE EN DIRECT (MILLIONS DE CHANSONS VIA CATALOGUE MONDIAL)
  const [musicSearchQuery, setMusicSearchQuery] = useState<string>('');
  const [isSearchingMusic, setIsSearchingMusic] = useState<boolean>(false);
  const [liveMusicResults, setLiveMusicResults] = useState<SongItem[]>(POPULAR_SEED_SONGS);
  const [musicActiveTab, setMusicActiveTab] = useState<'tendance' | 'favoris' | 'sfx' | 'search'>('tendance');
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>(['seed_1', 'seed_2']);
  const [currentlyAuditioningId, setCurrentlyAuditioningId] = useState<string | null>(null);
  const searchDebounceRef = useRef<any>(null);

  // Sous-titres automatiques IA
  const [autoSubtitlesEnabled, setAutoSubtitlesEnabled] = useState<boolean>(true);
  const [isGeneratingSubtitles, setIsGeneratingSubtitles] = useState<boolean>(false);

  // Modal d'ajustement du timing et de style texte
  const [timingEditorTarget, setTimingEditorTarget] = useState<TimingTarget | null>(null);
  const [isTimingModalOpen, setIsTimingModalOpen] = useState<boolean>(false);

  // Andrea AI Chat Assistant (situé à gauche)
  const [andreaChatInput, setAndreaChatInput] = useState('');
  const [andreaMessages, setAndreaMessages] = useState<Array<{ id: string; role: 'andrea' | 'user'; text: string; time: string }>>([
    {
      id: 'm_init',
      role: 'andrea',
      text: "Bonjour ! Je suis Andrea dans votre Studio de Montage. L'agent IA est à votre gauche. Glissez une vidéo au centre, ajoutez des sons depuis le catalogue universel ou demandez-moi un script/diaporama.",
      time: 'Maintenant'
    }
  ]);
  const [isAndreaThinking, setIsAndreaThinking] = useState(false);
  const andreaChatEndRef = useRef<HTMLDivElement>(null);

  // Gestion de la lecture de la timeline
  useEffect(() => {
    if (isPlaying) {
      playheadIntervalRef.current = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= maxDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(maxDurationSec, prev + 0.1);
        });
      }, 100);
    } else {
      if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current);
    }
    return () => {
      if (playheadIntervalRef.current) clearInterval(playheadIntervalRef.current);
    };
  }, [isPlaying, maxDurationSec]);

  // Synchronisation audio pendant la lecture
  useEffect(() => {
    if (!isPlaying) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Stop audition audio when unmounting
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  // Détection de recherche musicale en temps réel
  useEffect(() => {
    const q = musicSearchQuery.trim();
    if (!q) {
      setLiveMusicResults(POPULAR_SEED_SONGS);
      setIsSearchingMusic(false);
      return;
    }

    setIsSearchingMusic(true);
    setMusicActiveTab('search');

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        // 1. Interrogation de l'endpoint serveur /api/andrea/music-search
        const res = await fetch(`/api/andrea/music-search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.results) && data.results.length > 0) {
            setLiveMusicResults(data.results);
            setIsSearchingMusic(false);
            return;
          }
        }

        // 2. Fallback direct client-side (Recherche ouverte sur des milliards de morceaux)
        const directRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=40`);
        if (directRes.ok) {
          const directData = await directRes.json();
          const items: SongItem[] = (directData.results || []).map((t: any) => ({
            id: String(t.trackId),
            title: t.trackName || 'Titre inconnu',
            artist: t.artistName || 'Artiste',
            category: 'pop',
            durationSec: 30,
            durationLabel: `${Math.floor((t.trackTimeMillis || 30000) / 60000)}:${String(Math.floor(((t.trackTimeMillis || 30000) % 60000) / 1000)).padStart(2, '0')}`,
            previewUrl: t.previewUrl,
            artwork: t.artworkUrl100 || t.artworkUrl60,
            color: 'bg-indigo-600',
            badge: t.primaryGenreName || 'Musique'
          }));
          setLiveMusicResults(items);
        }
      } catch (err) {
        console.error('Erreur recherche musique:', err);
      } finally {
        setIsSearchingMusic(false);
      }
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [musicSearchQuery]);

  // Écouter un aperçu audio dans la modale
  const handleAuditionSong = (song: SongItem) => {
    if (currentlyAuditioningId === song.id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setCurrentlyAuditioningId(null);
      return;
    }

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }

    if (song.previewUrl) {
      try {
        const audio = new Audio(song.previewUrl);
        audio.volume = isMuted ? 0 : 0.8;
        audio.onended = () => setCurrentlyAuditioningId(null);
        audio.play().then(() => {
          previewAudioRef.current = audio;
          setCurrentlyAuditioningId(song.id);
        }).catch(() => {
          // Playback blocked or failed
          synthEngine.playSound(song.synthType || 'whoosh');
        });
      } catch {
        synthEngine.playSound(song.synthType || 'whoosh');
      }
    } else {
      synthEngine.playSound(song.synthType || 'whoosh');
      setCurrentlyAuditioningId(song.id);
      setTimeout(() => setCurrentlyAuditioningId(null), 1200);
    }
  };

  // Ajouter un son à la timeline
  const handleAddSongToTimeline = (song: SongItem) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setCurrentlyAuditioningId(null);
    }

    const newClip: TimelineAudioClip = {
      id: `audio_${Date.now()}`,
      name: `${song.title} - ${song.artist}`,
      type: song.synthType || 'audio_stream',
      startTimeSec: currentTimeSec,
      durationSec: song.category === 'sfx' ? (song.durationSec || 2) : Math.min(15, song.durationSec || 15),
      color: song.color || 'bg-amber-600',
      volume: 1,
      previewUrl: song.previewUrl
    };

    setAudioClips(prev => [...prev, newClip]);
    setIsMusicModalOpen(false);

    // Ouvrir directement le réglage du moment précis dans la vidéo
    setTimingEditorTarget({
      kind: 'audio',
      id: newClip.id,
      name: newClip.name,
      startTimeSec: newClip.startTimeSec,
      durationSec: newClip.durationSec
    });
    setIsTimingModalOpen(true);
  };

  // Génération automatique des sous-titres IA avec synchronisation virale
  const handleGenerateAutoSubtitles = (targetDuration: number = maxDurationSec) => {
    setIsGeneratingSubtitles(true);

    const dynamicCaptions = [
      { text: "LE SECRET QUE PERSONNE NE TE DIT", start: 0, dur: 3.5, color: "#FACC15" },
      { text: "POUR MULTIPLIER TA CONCENTRATION PAR 3", start: 3.5, dur: 4.5, color: "#FFFFFF" },
      { text: "1. APPLIQUE L'IMPLÉMENTATION INTENTION", start: 8.0, dur: 4.8, color: "#38BDF8" },
      { text: "SI JE FAIS CETTE ACTION, ALORS J'ENCHAÎNE", start: 12.8, dur: 5.2, color: "#4ADE80" },
      { text: "PROUVÉ PAR LES NEUROSCIENCES À 80%", start: 18.0, dur: 4.5, color: "#F43F5E" },
      { text: "ENREGISTRE CE REEL POUR TA SESSION", start: 22.5, dur: Math.max(2, targetDuration - 22.5), color: "#FACC15" }
    ];

    const generatedZones: TextZone[] = dynamicCaptions
      .filter(cap => cap.start < targetDuration)
      .map((cap, i) => ({
        id: `sub_${Date.now()}_${i}`,
        text: cap.text,
        fontFamily: 'Inter, sans-serif',
        fontSize: 28,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isUppercase: true,
        textAlign: 'center',
        textColor: cap.color,
        bgColor: 'rgba(0, 0, 0, 0.75)',
        xPercent: 50,
        yPercent: 80,
        startTimeSec: cap.start,
        endTimeSec: Math.min(targetDuration, cap.start + cap.dur)
      }));

    setTimeout(() => {
      setTextZones(prev => {
        const withoutOldSubs = prev.filter(z => !z.id.startsWith('sub_'));
        return [...withoutOldSubs, ...generatedZones];
      });
      setIsGeneratingSubtitles(false);
    }, 350);
  };

  // Upload vidéo ou photo principale avec prise en charge des sous-titres auto
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const isVid = file.type.startsWith('video') || file.name.match(/\.(mp4|webm|mov|mkv)$/i);
    setMediaFile({
      url,
      type: isVid ? 'video' : 'image',
      name: file.name
    });
    setIsPlusMenuOpen(false);

    if (isVid && autoSubtitlesEnabled) {
      handleGenerateAutoSubtitles(maxDurationSec);
    }
  };

  // Ajouter une zone de texte sur le canvas et sur la timeline avec édition directe
  const handleAddTextZone = () => {
    const newId = `txt_${Date.now()}`;
    const newZone: TextZone = {
      id: newId,
      text: 'MOT CLÉ VIRAL',
      fontFamily: 'Inter, sans-serif',
      fontSize: 32,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: true,
      textAlign: 'center',
      textColor: '#FACC15',
      bgColor: 'rgba(0, 0, 0, 0.7)',
      xPercent: 50,
      yPercent: 45,
      startTimeSec: currentTimeSec,
      endTimeSec: Math.min(maxDurationSec, currentTimeSec + 5)
    };
    setTextZones(prev => [...prev, newZone]);
    setSelectedTextZoneId(newId);
    setIsPlusMenuOpen(false);

    setTimingEditorTarget({
      kind: 'text',
      id: newId,
      name: newZone.text,
      startTimeSec: newZone.startTimeSec,
      durationSec: 5,
      text: newZone.text,
      textColor: newZone.textColor,
      fontSize: newZone.fontSize,
      isBold: newZone.isBold,
      isUppercase: newZone.isUppercase,
      bgColor: newZone.bgColor,
    });
    setIsTimingModalOpen(true);
  };

  // Ajouter une image ou GIF sur le canvas et la timeline
  const handleSelectImageGifToTimeline = (name: string, url: string, type: 'image' | 'gif') => {
    const newId = `overlay_${Date.now()}`;
    const newClip: OverlayImageGifClip = {
      id: newId,
      name,
      url,
      type,
      startTimeSec: currentTimeSec,
      durationSec: 4,
      xPercent: 50,
      yPercent: 65,
      widthPercent: 28
    };
    setOverlayClips(prev => [...prev, newClip]);
    setIsImageGifModalOpen(false);

    setTimingEditorTarget({
      kind: 'overlay',
      id: newClip.id,
      name: newClip.name,
      startTimeSec: newClip.startTimeSec,
      durationSec: newClip.durationSec
    });
    setIsTimingModalOpen(true);
  };

  // Envoi de message à Andrea IA dans le volet gauche
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
        `[Mode Studio Montage] Requête: "${query}". Recommandations de montage, hooks ou diaporamas.`
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
            fontFamily: 'Inter, sans-serif',
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
            fontFamily: 'Inter, sans-serif',
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
      }

      andreaVoice.speak(res.text.slice(0, 140));
    } catch {
      setAndreaMessages(prev => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          role: 'andrea',
          text: "Je suis à votre écoute pour optimiser votre montage, créer des transitions ou ajouter des diaporamas.",
          time: 'Maintenant'
        }
      ]);
    } finally {
      setIsAndreaThinking(false);
      setTimeout(() => andreaChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  // Liste filtrée des musiques à afficher dans la modale
  const displayedSongs = (() => {
    if (musicActiveTab === 'favoris') {
      return liveMusicResults.filter(s => favoriteSongIds.includes(s.id));
    }
    if (musicActiveTab === 'sfx') {
      return liveMusicResults.filter(s => s.category === 'sfx');
    }
    return liveMusicResults;
  })();

  return (
    <div className="flex flex-col h-full bg-[#070510] text-white overflow-hidden select-none font-sans">
      
      {/* 1. BARRE SUPÉRIEURE ÉPURÉE DU MONTAGE : RETOUR + CRÉATION DE VISUELS (SANS LES POLICES NI RATIOS INUTILES) */}
      <header className="bg-[#100b24] border-b border-[#5A33FF33] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 shrink-0 z-20 shadow-md">
        
        {/* Section Gauche : Bouton Retour + Bouton Création de Visuels (qui bascule directement vers composition) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 rounded-xl bg-[#1c143d] hover:bg-[#281d56] border border-[#5A33FF44] text-[#c4b5fd] hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              title="Revenir sur l'application"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </button>
          )}

          <button
            onClick={onSwitchToVisualComposition}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 border border-pink-400/40"
            title="Basculer vers la création de visuels et cadres Canva"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Création de visuels</span>
          </button>
        </div>

        {/* Section Droite : Aperçu Outro & Exporter */}
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
            onClick={() => alert("Vidéo exportée avec succès avec la signature 'made with Andrea AI' et écran de fin !")}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </header>

      {/* 2. ESPACE CENTRAL : AGENT IA ANDREA À GAUCHE + MONTAGE VIDÉO À DROITE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ================= GAUCHE : ESPACE ANDREA IA (PERMANENT) ================= */}
        <aside className="w-full lg:w-80 xl:w-96 order-first lg:order-first bg-[#0e0922] border-b lg:border-b-0 lg:border-r border-[#5A33FF33] flex flex-col shrink-0 h-64 sm:h-72 lg:h-full z-20 shadow-xl">
          <div className="p-3 border-b border-[#5A33FF22] bg-[#130d2d] flex items-center justify-between">
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
              onClick={() => handleSendAndreaMessage("Propose 3 accroches percutantes et courtes pour ce montage")}
              className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#201844] hover:bg-[#2b215c] text-purple-300 hover:text-white border border-[#5A33FF33] transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Idée Hook</span>
            </button>
          </div>

          <div className="p-2 bg-[#090616] border-b border-[#5A33FF15] flex gap-1.5 flex-wrap">
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

          <div className="p-2.5 bg-[#0a0718] border-t border-[#5A33FF22]">
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

        {/* ================= CENTRE / DROITE : ESPACE NOIR VIDÉO + PISTE UNIQUE + PLUS EN BAS À DROITE ================= */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#070510] relative">
          
          {/* 1. ESPACE NOIR DE PRÉVISUALISATION AVEC BOUTON CENTRAL GLISSER FICHIERS */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-5 overflow-auto relative bg-[#04020a]">
            
            {mediaFile ? (
              <div className="flex flex-col items-center max-h-full w-full max-w-[360px] gap-2">
                {/* BARRE DE CONTRÔLE SOUS-TITRES AUTOMATIQUES IA */}
                <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-2xl bg-[#140e2d]/90 border border-[#5A33FF44] backdrop-blur-md shadow-lg text-xs z-30">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoSubtitlesEnabled}
                      onChange={e => {
                        const checked = e.target.checked;
                        setAutoSubtitlesEnabled(checked);
                        if (checked) {
                          handleGenerateAutoSubtitles(maxDurationSec);
                        } else {
                          setTextZones(prev => prev.filter(z => !z.id.startsWith('sub_')));
                        }
                      }}
                      className="w-4 h-4 rounded text-[#5A33FF] accent-[#5A33FF] cursor-pointer"
                    />
                    <span className="font-bold text-white text-[11px] flex items-center gap-1">
                      <span>🎙️ Sous-titres automatiques</span>
                    </span>
                  </label>

                  {autoSubtitlesEnabled && (
                    <button
                      type="button"
                      onClick={() => handleGenerateAutoSubtitles(maxDurationSec)}
                      disabled={isGeneratingSubtitles}
                      className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 text-[10px] font-bold transition flex items-center gap-1"
                      title="Générer de nouveaux sous-titres synchronisés"
                    >
                      <Sparkles className={`w-3 h-3 ${isGeneratingSubtitles ? 'animate-spin text-amber-400' : 'text-purple-300'}`} />
                      <span>{isGeneratingSubtitles ? 'Génération...' : 'Régénérer'}</span>
                    </button>
                  )}
                </div>

                <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-[#5A33FF44] aspect-[9/16] w-full bg-black flex items-center justify-center">
                  {mediaFile.type === 'video' ? (
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
                  )}

                {/* Zones de texte insérées dynamiquement */}
                {textZones.map(zone => {
                  const isVisible = currentTimeSec >= zone.startTimeSec && currentTimeSec <= zone.endTimeSec;
                  if (!isVisible) return null;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        setSelectedTextZoneId(zone.id);
                        setTimingEditorTarget({
                          kind: 'text',
                          id: zone.id,
                          name: zone.text,
                          startTimeSec: zone.startTimeSec,
                          durationSec: Math.max(1, zone.endTimeSec - zone.startTimeSec),
                          text: zone.text,
                          textColor: zone.textColor,
                          fontSize: zone.fontSize,
                          isBold: zone.isBold,
                          isUppercase: zone.isUppercase,
                          bgColor: zone.bgColor,
                        });
                        setIsTimingModalOpen(true);
                      }}
                      style={{
                        position: 'absolute',
                        top: `${zone.yPercent}%`,
                        left: `${zone.xPercent}%`,
                        transform: 'translate(-50%, -50%)',
                        fontFamily: zone.fontFamily,
                        fontSize: `${Math.round(zone.fontSize * 0.75)}px`,
                        fontWeight: zone.isBold ? 900 : 400,
                        color: zone.textColor,
                        textAlign: zone.textAlign,
                        zIndex: 25,
                      }}
                      className="cursor-pointer px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 shadow-xl"
                    >
                      <span>{zone.isUppercase ? zone.text.toUpperCase() : zone.text}</span>
                    </div>
                  );
                })}

                {/* Overlays Images / GIFs */}
                {overlayClips.map(clip => {
                  const isVisible = currentTimeSec >= clip.startTimeSec && currentTimeSec <= (clip.startTimeSec + clip.durationSec);
                  if (!isVisible) return null;

                  return (
                    <div
                      key={clip.id}
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
                      style={{
                        position: 'absolute',
                        top: `${clip.yPercent}%`,
                        left: `${clip.xPercent}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `${clip.widthPercent}%`,
                        zIndex: 25,
                      }}
                      className="cursor-pointer hover:ring-2 hover:ring-pink-400 rounded-2xl transition-all"
                    >
                      <img src={clip.url} alt={clip.name} className="w-full h-auto object-contain pointer-events-none rounded-xl" />
                    </div>
                  );
                })}

                {/* Filigrane officiel "made with Andrea AI" en bas à droite */}
                <div className="absolute bottom-2.5 right-3 z-30 pointer-events-none flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                  <span className="text-[9px] font-semibold text-zinc-300 tracking-wide">
                    made with <strong className="text-white">Andrea AI</strong>
                  </span>
                </div>

                {/* Écran Outro finale officielle */}
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
            ) : (
              /* ESPACE NOIR AVEC BOUTON GLISSER FICHIERS AU MILIEU */
              <div className="w-full h-full flex flex-col items-center justify-center p-6">
                <label className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed border-[#5A33FF55] hover:border-[#8B70FF] bg-[#0c081e]/80 hover:bg-[#120c2b] transition cursor-pointer group shadow-2xl max-w-md w-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#1b143c] border border-[#5A33FF66] flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-[#8B70FF] transition shadow-lg mb-3">
                    <Upload className="w-7 h-7 text-purple-300" />
                  </div>
                  <span className="text-sm sm:text-base font-extrabold text-white group-hover:text-purple-300 transition">
                    Glisser ou déposer des fichiers
                  </span>
                  <span className="text-xs text-[#c4b5fd]/70 mt-1.5 max-w-xs">
                    Vidéos (MP4, WebM) ou Photos (PNG, JPG)
                  </span>

                  {/* Option Sous-titres automatiques activée par défaut */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171038] border border-[#5A33FF55] shadow-sm"
                  >
                    <input
                      type="checkbox"
                      id="empty_state_subs"
                      checked={autoSubtitlesEnabled}
                      onChange={(e) => setAutoSubtitlesEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-[#5A33FF] accent-[#5A33FF] cursor-pointer"
                    />
                    <label htmlFor="empty_state_subs" className="text-xs font-bold text-white cursor-pointer select-none flex items-center gap-1.5">
                      <span>🎙️ Sous-titres automatiques (IA)</span>
                    </label>
                  </div>

                  <span className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white text-xs font-bold shadow-md">
                    Parcourir mon appareil
                  </span>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* 2. BARRE DE LECTURE (Sous l'espace noir) */}
          <div className="bg-[#100b24] px-4 py-2.5 border-t border-b border-[#5A33FF33] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(p => !p)}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white flex items-center justify-center shadow transition"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setCurrentTimeSec(0);
                  setIsPlaying(false);
                }}
                className="p-1.5 rounded-lg bg-[#1b143c] hover:bg-[#251c52] text-[#c4b5fd] hover:text-white transition"
                title="Remettre au début"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* TEMPS INTERACTIF & MODIFIABLE (CLIC POUR MODIFIER DE X À X OU ENTRER UNE VALEUR) */}
              <button
                onClick={() => {
                  setCustomDurationInput(String(maxDurationSec));
                  setIsDurationModalOpen(true);
                }}
                className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded-xl bg-[#1b143c] hover:bg-[#251b54] border border-[#5A33FF44] hover:border-[#8B70FF] transition flex items-center gap-1.5 cursor-pointer shadow-sm group"
                title="Cliquer pour modifier la durée totale ou entrer une valeur personnalisée"
              >
                <Clock className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white" />
                <span>{currentTimeSec.toFixed(1)}s / {maxDurationSec.toFixed(1)}s</span>
                <span className="text-[10px] text-purple-300 group-hover:text-white font-sans">✎</span>
              </button>
            </div>

            <div className="flex-1 max-w-xl mx-2">
              <input
                type="range"
                min="0"
                max={maxDurationSec}
                step="0.1"
                value={currentTimeSec}
                onChange={e => setCurrentTimeSec(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#201844] rounded-lg appearance-none cursor-pointer accent-[#5A33FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(m => !m)}
                className="p-1.5 rounded-lg bg-[#1b143c] text-[#c4b5fd] hover:text-white transition"
                title={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. PISTE DE MONTAGE UNIQUE AVEC GRADUATIONS VISIBLES & CASE DU BOUTON PLUS */}
          <div className="bg-[#0b071a] p-3 border-t border-[#5A33FF22] shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <div className="flex items-center gap-2 text-[#c4b5fd]">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Piste de Montage Unique</span>
                <span className="text-[10px] text-zinc-400 font-normal">
                  ({audioClips.length + overlayClips.length + textZones.length + (mediaFile ? 1 : 0)} éléments)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                <span>Curseur : <strong className="text-white">{currentTimeSec.toFixed(1)}s</strong></span>
                <span className="text-zinc-600">|</span>
                <span>Durée totale : <strong className="text-purple-300">{maxDurationSec.toFixed(1)}s</strong></span>
              </div>
            </div>

            {/* CONTENEUR PISTE + CASE DU BOUTON PLUS CÔTE À CÔTE SANS CHEVAUCHEMENT */}
            <div className="flex items-stretch gap-2.5">
              
              {/* LA PISTE UNIQUE AVEC RÈGLE DE GRADUATIONS OFFICIELLES */}
              <div className="flex-1 relative rounded-2xl bg-[#130d2d] border border-[#5A33FF44] overflow-hidden flex flex-col shadow-inner min-h-[92px]">
                
                {/* 1. RÈGLE DES GRADUATIONS VISIBLES (CLIQUABLE) */}
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                    setCurrentTimeSec(parseFloat((clickRatio * maxDurationSec).toFixed(1)));
                  }}
                  className="relative h-7 bg-[#171038] border-b border-[#5A33FF44] cursor-pointer select-none overflow-hidden shrink-0"
                  title="Cliquer sur la graduation pour déplacer la tête de lecture"
                >
                  {/* Graduations Majeures avec Chiffres */}
                  {Array.from({ length: Math.floor(maxDurationSec / (maxDurationSec <= 30 ? 5 : (maxDurationSec <= 60 ? 10 : (maxDurationSec <= 120 ? 15 : 30)))) + 1 }).map((_, idx) => {
                    const step = maxDurationSec <= 30 ? 5 : (maxDurationSec <= 60 ? 10 : (maxDurationSec <= 120 ? 15 : 30));
                    const sec = idx * step;
                    if (sec > maxDurationSec) return null;
                    const leftPercent = (sec / maxDurationSec) * 100;
                    return (
                      <div 
                        key={`maj_${sec}`} 
                        style={{ left: `${leftPercent}%` }}
                        className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none -translate-x-1/2"
                      >
                        <span className="text-[9px] font-mono font-bold text-white tracking-wider leading-none pt-0.5">
                          {sec}s
                        </span>
                        <div className="w-0.5 h-2.5 bg-zinc-200 mt-0.5" />
                      </div>
                    );
                  })}

                  {/* Graduations Mineures (secondes intermédiaires) */}
                  {Array.from({ length: Math.floor(maxDurationSec / (maxDurationSec <= 30 ? 1 : (maxDurationSec <= 60 ? 2 : (maxDurationSec <= 120 ? 5 : 10)))) + 1 }).map((_, idx) => {
                    const majorStep = maxDurationSec <= 30 ? 5 : (maxDurationSec <= 60 ? 10 : (maxDurationSec <= 120 ? 15 : 30));
                    const minorStep = maxDurationSec <= 30 ? 1 : (maxDurationSec <= 60 ? 2 : (maxDurationSec <= 120 ? 5 : 10));
                    const sec = idx * minorStep;
                    if (sec % majorStep === 0 || sec > maxDurationSec) return null;
                    const leftPercent = (sec / maxDurationSec) * 100;
                    return (
                      <div 
                        key={`min_${sec}`} 
                        style={{ left: `${leftPercent}%` }}
                        className="absolute bottom-0 w-px h-1.5 bg-zinc-400 pointer-events-none -translate-x-1/2"
                      />
                    );
                  })}
                </div>

                {/* 2. ZONE DE PISTE (CLIPS AUDIO, VIDÉO, TEXTES, OVERLAYS) */}
                <div className="relative flex-1 p-1 flex items-center min-h-[58px]">
                  
                  {/* Guides verticaux de repères de temps */}
                  {Array.from({ length: Math.floor(maxDurationSec / (maxDurationSec <= 30 ? 5 : (maxDurationSec <= 60 ? 10 : (maxDurationSec <= 120 ? 15 : 30)))) + 1 }).map((_, idx) => {
                    const step = maxDurationSec <= 30 ? 5 : (maxDurationSec <= 60 ? 10 : (maxDurationSec <= 120 ? 15 : 30));
                    const sec = idx * step;
                    if (sec > maxDurationSec) return null;
                    const leftPercent = (sec / maxDurationSec) * 100;
                    return (
                      <div 
                        key={`guide_${sec}`} 
                        style={{ left: `${leftPercent}%` }}
                        className="absolute top-0 bottom-0 w-px bg-white/5 pointer-events-none -translate-x-1/2"
                      />
                    );
                  })}

                  {/* État vide */}
                  {!mediaFile && audioClips.length === 0 && overlayClips.length === 0 && textZones.length === 0 && (
                    <div className="w-full text-center text-xs text-[#c4b5fd]/40 italic pointer-events-none">
                      Piste vide · Cliquez sur le bouton + à droite pour ajouter musique, vidéo, image ou texte
                    </div>
                  )}

                  {/* Clip Vidéo/Photo principale */}
                  {mediaFile && (
                    <div 
                      style={{ left: '0%', width: '100%' }}
                      onClick={() => {
                        setTimingEditorTarget({
                          kind: 'video',
                          id: 'main_media',
                          name: mediaFile.name,
                          startTimeSec: 0,
                          durationSec: maxDurationSec,
                        });
                        setIsTimingModalOpen(true);
                      }}
                      className="absolute top-1 bottom-1 rounded-xl bg-purple-600/30 border border-purple-400/50 text-purple-200 text-[10px] font-bold flex items-center px-2 truncate cursor-pointer hover:ring-1 hover:ring-purple-300 transition"
                      title="Cliquer pour ajuster le média principal"
                    >
                      <Film className="w-3 h-3 mr-1 text-purple-300 shrink-0" />
                      <span className="truncate">{mediaFile.name}</span>
                    </div>
                  )}

                  {/* Clips Audio sur la piste unique */}
                  {audioClips.map(clip => {
                    const leftPercent = (clip.startTimeSec / maxDurationSec) * 100;
                    const widthPercent = (clip.durationSec / maxDurationSec) * 100;
                    return (
                      <div
                        key={clip.id}
                        style={{ left: `${leftPercent}%`, width: `${Math.max(12, widthPercent)}%` }}
                        onClick={() => {
                          if (clip.previewUrl) {
                            const a = new Audio(clip.previewUrl);
                            a.play().catch(() => {});
                          } else {
                            synthEngine.playSound(clip.type);
                          }
                          setTimingEditorTarget({
                            kind: 'audio',
                            id: clip.id,
                            name: clip.name,
                            startTimeSec: clip.startTimeSec,
                            durationSec: clip.durationSec,
                          });
                          setIsTimingModalOpen(true);
                        }}
                        className={`absolute top-1 bottom-1 rounded-xl ${clip.color || 'bg-amber-600'} text-white text-[9px] font-bold flex items-center justify-between px-2 shadow-lg truncate group cursor-pointer hover:ring-2 hover:ring-amber-300 transition z-10`}
                        title="Cliquer pour ajuster le moment d'apparition dans la vidéo"
                      >
                        <div className="flex items-center gap-1 truncate">
                          <Music className="w-3 h-3 text-amber-200 shrink-0" />
                          <span className="truncate">{clip.name}</span>
                        </div>
                        <span className="text-[8px] opacity-80 font-mono ml-1">{clip.startTimeSec.toFixed(1)}s</span>
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
                  })}

                  {/* Clips Image/GIF sur la piste unique */}
                  {overlayClips.map(clip => {
                    const leftPercent = (clip.startTimeSec / maxDurationSec) * 100;
                    const widthPercent = (clip.durationSec / maxDurationSec) * 100;
                    return (
                      <div
                        key={clip.id}
                        style={{ left: `${leftPercent}%`, width: `${Math.max(12, widthPercent)}%` }}
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
                        className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[9px] font-bold flex items-center justify-between px-2 shadow-lg truncate group cursor-pointer hover:ring-2 hover:ring-pink-300 transition z-10"
                        title="Cliquer pour ajuster le moment d'apparition dans la vidéo"
                      >
                        <div className="flex items-center gap-1 truncate">
                          <ImageIcon className="w-3 h-3 text-pink-200 shrink-0" />
                          <span className="truncate">{clip.name}</span>
                        </div>
                        <span className="text-[8px] opacity-80 font-mono ml-1">{clip.startTimeSec.toFixed(1)}s</span>
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
                  })}

                  {/* Clips Texte sur la piste unique */}
                  {textZones.map(zone => {
                    const leftPercent = (zone.startTimeSec / maxDurationSec) * 100;
                    const widthPercent = ((zone.endTimeSec - zone.startTimeSec) / maxDurationSec) * 100;
                    return (
                      <div
                        key={zone.id}
                        style={{ left: `${leftPercent}%`, width: `${Math.max(12, widthPercent)}%` }}
                        onClick={() => {
                          setSelectedTextZoneId(zone.id);
                          setTimingEditorTarget({
                            kind: 'text',
                            id: zone.id,
                            name: zone.text,
                            startTimeSec: zone.startTimeSec,
                            durationSec: Math.max(1, zone.endTimeSec - zone.startTimeSec),
                            text: zone.text,
                            textColor: zone.textColor,
                            fontSize: zone.fontSize,
                            isBold: zone.isBold,
                            isUppercase: zone.isUppercase,
                            bgColor: zone.bgColor,
                          });
                          setIsTimingModalOpen(true);
                        }}
                        className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[9px] font-bold flex items-center justify-between px-2 shadow-lg truncate group cursor-pointer hover:ring-2 hover:ring-cyan-300 transition z-10"
                        title="Cliquer pour ajuster le moment d'apparition du texte"
                      >
                        <div className="flex items-center gap-1 truncate">
                          <Type className="w-3 h-3 text-cyan-200 shrink-0" />
                          <span className="truncate">{zone.text}</span>
                        </div>
                        <span className="text-[8px] opacity-80 font-mono ml-1">{zone.startTimeSec.toFixed(1)}s</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextZones(prev => prev.filter(z => z.id !== zone.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-200 transition ml-1"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Curseur de lecture vertical rouge */}
                  <div
                    style={{ left: `${(currentTimeSec / maxDurationSec) * 100}%` }}
                    className="absolute top-0 bottom-0 w-1 bg-rose-500 shadow-md pointer-events-none z-30 transition-all duration-75"
                  >
                    <div className="w-3 h-3 bg-rose-500 rounded-full -ml-1 -mt-0.5 shadow-lg" />
                  </div>
                </div>
              </div>

              {/* 3. CASE DÉDIÉE AU BOUTON PLUS : DANS SA PROPRE CASE, NE CACHE AUCUN ÉLÉMENT */}
              <div className="shrink-0 relative flex items-center">
                <button
                  onClick={() => setIsPlusMenuOpen(prev => !prev)}
                  className="w-14 h-full min-h-[92px] rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:brightness-110 active:scale-95 text-white flex flex-col items-center justify-center shadow-xl border-2 border-purple-400/50 transition cursor-pointer gap-1 p-2"
                  title="Ajouter au montage (+)"
                >
                  <Plus className={`w-6 h-6 transition-transform duration-200 ${isPlusMenuOpen ? 'rotate-45' : ''}`} />
                  <span className="text-[10px] font-extrabold text-zinc-100">Ajouter</span>
                </button>

                {/* Menu Popover du Bouton "+" orienté vers le haut */}
                {isPlusMenuOpen && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#140e2d] border border-[#5A33FF55] rounded-2xl shadow-2xl p-2 space-y-1 animate-in slide-in-from-bottom-2 z-50">
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
                        <div className="text-[10px] text-[#c4b5fd] font-normal">Recherche universelle & catalogue mondial</div>
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
                        <div className="text-[10px] text-[#c4b5fd] font-normal">Photos, stickers ou GIFs animés</div>
                      </div>
                    </button>

                    {/* Option 3 : Insérer une zone de texte */}
                    <button
                      onClick={() => {
                        handleAddTextZone();
                        setIsPlusMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                        <Type className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Insérer une zone de texte</div>
                        <div className="text-[10px] text-[#c4b5fd] font-normal">Titres, sous-titres personnalisables</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ================= MODALE MODIFICATION DURÉE DU TEMPS (VALEURS X À X ET CASE SAISIE) ================= */}
          {isDurationModalOpen && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-[#120c2b] border-2 border-[#5A33FF66] rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#5A33FF33] pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-300" />
                    <h3 className="text-sm font-extrabold text-white">Modifier la durée du projet</h3>
                  </div>
                  <button onClick={() => setIsDurationModalOpen(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Valeurs rapides de x à x */}
                  <div>
                    <label className="text-xs font-bold text-white block mb-2">Choisir une durée prédéfinie :</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[5, 10, 15, 30, 45, 60, 90, 120, 180, 300].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            setMaxDurationSec(s);
                            setCustomDurationInput(String(s));
                            if (currentTimeSec > s) setCurrentTimeSec(s);
                            setIsDurationModalOpen(false);
                          }}
                          className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition border ${
                            maxDurationSec === s
                              ? 'bg-[#5A33FF] border-[#8B70FF] text-white shadow'
                              : 'bg-[#1b143c] border-[#5A33FF22] text-zinc-300 hover:text-white hover:bg-[#251c54]'
                          }`}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Case pour entrer une valeur personnalisée */}
                  <div className="space-y-2 pt-2 border-t border-[#5A33FF22]">
                    <label className="text-xs font-bold text-white block">Entrer une valeur précise (en secondes) :</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="600"
                        step="1"
                        value={customDurationInput}
                        onChange={e => setCustomDurationInput(e.target.value)}
                        className="flex-1 bg-[#181138] border border-[#5A33FF55] focus:border-[#8B70FF] rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none"
                        placeholder="Ex: 40"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(customDurationInput);
                          if (!isNaN(val) && val >= 1 && val <= 600) {
                            setMaxDurationSec(val);
                            if (currentTimeSec > val) setCurrentTimeSec(val);
                            setIsDurationModalOpen(false);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold text-xs shadow transition cursor-pointer"
                      >
                        Appliquer
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">Plage autorisée : 1 à 600 secondes (10 minutes).</p>
                  </div>

                  {/* Saut direct curseur */}
                  <div className="space-y-2 pt-2 border-t border-[#5A33FF22]">
                    <label className="text-xs font-bold text-white block">Position du curseur :</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max={maxDurationSec}
                        step="0.1"
                        value={currentTimeSec.toFixed(1)}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setCurrentTimeSec(Math.min(maxDurationSec, Math.max(0, val)));
                        }}
                        className="flex-1 bg-[#181138] border border-[#5A33FF55] focus:border-[#8B70FF] rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none"
                      />
                      <span className="text-xs text-zinc-400 font-mono">/ {maxDurationSec.toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODALE SÉLECTION DE MUSIQUES / SONS : RECHERCHE EN DIRECT SUR DES MILLIONS DE CHANSONS ================= */}
          {isMusicModalOpen && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
              <div className="bg-[#120c2b] border-2 border-[#5A33FF66] rounded-3xl max-w-xl w-full flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 overflow-hidden">
                
                {/* Header avec Titre et Fermeture */}
                <div className="p-4 border-b border-[#5A33FF33] flex items-center justify-between shrink-0 bg-[#160f35]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Music className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">Sélectionner une musique/son</h3>
                      <p className="text-[10px] text-[#c4b5fd]">Recherche en direct sur le catalogue universel mondial</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (previewAudioRef.current) previewAudioRef.current.pause();
                      setCurrentlyAuditioningId(null);
                      setIsMusicModalOpen(false);
                    }}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ONGLETS TENDANCE, FAVORIS & SFX */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-[#5A33FF22] bg-[#0e0922] shrink-0">
                  <button
                    onClick={() => {
                      setMusicActiveTab('tendance');
                      setMusicSearchQuery('');
                    }}
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
                    onClick={() => {
                      setMusicActiveTab('favoris');
                      setMusicSearchQuery('');
                    }}
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
                    onClick={() => {
                      setMusicActiveTab('sfx');
                      setMusicSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      musicActiveTab === 'sfx'
                        ? 'bg-[#5A33FF] text-white shadow'
                        : 'bg-[#1b143c] text-[#c4b5fd] hover:text-white'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Bruitages & SFX</span>
                  </button>
                </div>

                {/* LISTE DES RÉSULTATS (AVEC MILLIONS DE CHANSONS DISPONIBLES) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {isSearchingMusic && (
                    <div className="text-center py-6 text-xs text-purple-300 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Recherche parmi des millions de musiques...</span>
                    </div>
                  )}

                  {!isSearchingMusic && displayedSongs.length === 0 && (
                    <div className="text-center py-8 text-xs text-[#c4b5fd]">
                      Aucun morceau trouvé pour « {musicSearchQuery} ». Essayez un autre nom d'artiste ou de son.
                    </div>
                  )}

                  {!isSearchingMusic && displayedSongs.map(song => {
                    const isAuditioning = currentlyAuditioningId === song.id;
                    const isFav = favoriteSongIds.includes(song.id);

                    return (
                      <div
                        key={song.id}
                        className="bg-[#1b143c] hover:bg-[#251b54] border border-[#5A33FF33] hover:border-[#8B70FF] p-2.5 rounded-2xl flex items-center justify-between gap-3 transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Pochette ou icône */}
                          {song.artwork ? (
                            <img src={song.artwork} alt={song.title} className="w-10 h-10 rounded-xl object-cover shrink-0 shadow" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                              <Music className="w-5 h-5 text-purple-300" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">{song.title}</span>
                              {song.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                                  {song.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#c4b5fd] truncate">{song.artist}</p>
                          </div>
                        </div>

                        {/* Actions : Écouter, Favori, Ajouter */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleAuditionSong(song)}
                            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                              isAuditioning
                                ? 'bg-amber-500 text-black shadow-lg scale-105'
                                : 'bg-[#201844] hover:bg-[#2b215c] text-white'
                            }`}
                            title="Écouter un extrait de 30 secondes"
                          >
                            {isAuditioning ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                          </button>

                          <button
                            onClick={() => {
                              setFavoriteSongIds(prev => 
                                isFav ? prev.filter(id => id !== song.id) : [...prev, song.id]
                              );
                            }}
                            className={`p-2 rounded-xl transition ${isFav ? 'text-amber-400' : 'text-[#c4b5fd]/50 hover:text-white'}`}
                            title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleAddSongToTimeline(song)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white text-xs font-bold transition shadow"
                          >
                            + Ajouter
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BARRE DE RECHERCHE EN BAS (CATALOGUE UNIVERSEL EN DIRECT) */}
                <div className="p-3 bg-[#160f35] border-t border-[#5A33FF33] shrink-0">
                  <div className="bg-[#1b143c] border border-[#5A33FF55] focus-within:border-[#8B70FF] rounded-2xl px-3 py-2 flex items-center gap-2 shadow-inner">
                    <Search className="w-4 h-4 text-purple-400 shrink-0" />
                    <input
                      type="text"
                      value={musicSearchQuery}
                      onChange={e => setMusicSearchQuery(e.target.value)}
                      placeholder="Tapez n'importe quelle chanson ou son (ex: Drake, Jul, Daft Punk, Lofi, Bruitage...)"
                      className="bg-transparent text-white text-xs w-full focus:outline-none placeholder-[#c4b5fd]/50 font-medium"
                    />
                    {musicSearchQuery && (
                      <button
                        onClick={() => setMusicSearchQuery('')}
                        className="text-zinc-400 hover:text-white text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[#c4b5fd]/70 mt-1.5 px-1 text-center">
                    Moteur de recherche connecté : interroge en direct des milliards de titres musicaux sans limite.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODALE IMAGES ET GIFS ================= */}
          {isImageGifModalOpen && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
              <div className="bg-[#120c2b] border-2 border-[#5A33FF66] rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#5A33FF33] pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-pink-400" />
                    <h3 className="text-sm font-extrabold text-white">Insérer une image ou un GIF</h3>
                  </div>
                  <button onClick={() => setIsImageGifModalOpen(false)} className="p-1 text-zinc-300 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload personnalisé */}
                <div className="space-y-1.5">
                  <label className="border-2 border-dashed border-[#5A33FF55] hover:border-[#8B70FF] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-[#181138]/60 hover:bg-[#181138] transition">
                    <Upload className="w-6 h-6 text-purple-400 mb-1" />
                    <span className="text-xs font-bold text-white">Téléverser depuis votre appareil (PNG, JPG, GIF)</span>
                    <input
                      type="file"
                      accept="image/*,.gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          handleSelectImageGifToTimeline(file.name.replace(/\.[^/.]+$/, ""), url, file.type.includes('gif') ? 'gif' : 'image');
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Galerie de GIFs / Stickers Animés Prédéfinis */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white">Ou choisir parmi les stickers viraux :</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_GIFS.map(g => (
                      <button
                        key={g.id}
                        onClick={() => handleSelectImageGifToTimeline(g.name, g.url, 'gif')}
                        className="bg-[#1b143c] hover:bg-[#251b54] border border-[#5A33FF33] hover:border-[#8B70FF] p-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 group transition"
                      >
                        <img src={g.url} alt={g.name} className="w-14 h-14 object-contain pointer-events-none group-hover:scale-105 transition" />
                        <span className="text-[10px] font-bold text-[#c4b5fd] group-hover:text-white truncate max-w-full">{g.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODALE : CHOISIR À QUEL MOMENT PRÉCIS DE LA VIDÉO PLACER LE SON / IMAGE / TEXTE ================= */}
          {isTimingModalOpen && timingEditorTarget && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
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

                {/* SECTION SPÉCIFIQUE ZONE DE TEXTE : ÉCRITURE DU TEXTE, COULEUR ET TAILLE */}
                {timingEditorTarget.kind === 'text' && (
                  <div className="space-y-3 bg-[#1b143c] p-3.5 rounded-2xl border border-purple-500/40 shadow-inner">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-purple-400" />
                        <span>Texte affiché sur la vidéo :</span>
                      </label>
                      <span className="text-[10px] text-purple-300 font-medium">Édition instantanée</span>
                    </div>

                    <textarea
                      rows={2}
                      value={timingEditorTarget.text ?? timingEditorTarget.name}
                      onChange={e => {
                        const newTxt = e.target.value;
                        setTimingEditorTarget(prev => prev ? { ...prev, text: newTxt, name: newTxt } : null);
                        setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, text: newTxt } : z));
                      }}
                      placeholder="Tapez ici votre texte ou mot-clé..."
                      className="w-full bg-[#110b27] border border-[#5A33FF55] focus:border-[#8B70FF] rounded-xl p-2.5 text-xs text-white placeholder-[#c4b5fd]/40 resize-none font-bold focus:outline-none"
                    />

                    {/* SÉLECTEUR DE COULEUR DU TEXTE AVEC PALETTE VIVE + SÉLECTEUR LIBRE */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-[#c4b5fd]">Couleur du texte :</span>
                        <span className="font-mono text-white text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10">
                          {timingEditorTarget.textColor || '#FACC15'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {['#FFFFFF', '#FACC15', '#EF4444', '#06B6D4', '#4ADE80', '#A855F7', '#F97316', '#EC4899', '#000000'].map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setTimingEditorTarget(prev => prev ? { ...prev, textColor: c } : null);
                              setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, textColor: c } : z));
                            }}
                            style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                              (timingEditorTarget.textColor || '#FACC15') === c 
                                ? 'scale-125 border-white ring-2 ring-purple-500 shadow-md' 
                                : 'border-white/30 hover:scale-110'
                            }`}
                            title={`Couleur ${c}`}
                          />
                        ))}

                        {/* Sélecteur libre de couleur HTML5 */}
                        <label className="relative cursor-pointer flex items-center justify-center w-7 h-7 rounded-xl bg-[#201844] border border-[#5A33FF55] hover:border-white transition" title="Choisir une couleur sur mesure">
                          <span className="text-xs">🎨</span>
                          <input
                            type="color"
                            value={timingEditorTarget.textColor || '#FACC15'}
                            onChange={e => {
                              const c = e.target.value;
                              setTimingEditorTarget(prev => prev ? { ...prev, textColor: c } : null);
                              setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, textColor: c } : z));
                            }}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>

                    {/* TAILLE & STYLE DE POLICE */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 items-center">
                      <div>
                        <div className="flex justify-between text-[10px] text-zinc-300 font-bold mb-1">
                          <span>Taille :</span>
                          <span className="font-mono text-purple-300">{timingEditorTarget.fontSize || 32}px</span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="64"
                          step="2"
                          value={timingEditorTarget.fontSize || 32}
                          onChange={e => {
                            const sz = parseInt(e.target.value);
                            setTimingEditorTarget(prev => prev ? { ...prev, fontSize: sz } : null);
                            setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, fontSize: sz } : z));
                          }}
                          className="w-full h-1.5 bg-[#201844] rounded-lg appearance-none cursor-pointer accent-[#8B70FF]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const b = !(timingEditorTarget.isBold ?? true);
                            setTimingEditorTarget(prev => prev ? { ...prev, isBold: b } : null);
                            setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, isBold: b } : z));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            timingEditorTarget.isBold ?? true 
                              ? 'bg-purple-600 border-purple-400 text-white shadow' 
                              : 'bg-[#150f2e] border-white/10 text-zinc-400 hover:text-white'
                          }`}
                          title="Gras"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const u = !(timingEditorTarget.isUppercase ?? true);
                            setTimingEditorTarget(prev => prev ? { ...prev, isUppercase: u } : null);
                            setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { ...z, isUppercase: u } : z));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            timingEditorTarget.isUppercase ?? true 
                              ? 'bg-purple-600 border-purple-400 text-white shadow' 
                              : 'bg-[#150f2e] border-white/10 text-zinc-400 hover:text-white'
                          }`}
                          title="Majuscules"
                        >
                          AA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. Curseur et valeur du Début (en secondes) */}
                <div className="space-y-1.5 bg-[#1b143c] p-3 rounded-2xl border border-[#5A33FF33]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>⏱️ Moment de départ :</span>
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
                    Actif de <strong>{timingEditorTarget.startTimeSec.toFixed(1)}s</strong> à <strong>{(timingEditorTarget.startTimeSec + timingEditorTarget.durationSec).toFixed(1)}s</strong>
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
                      if (timingEditorTarget.kind === 'audio') {
                        setAudioClips(prev => prev.map(c => c.id === timingEditorTarget.id ? { ...c, startTimeSec: timingEditorTarget.startTimeSec, durationSec: timingEditorTarget.durationSec } : c));
                      } else if (timingEditorTarget.kind === 'overlay') {
                        setOverlayClips(prev => prev.map(c => c.id === timingEditorTarget.id ? { ...c, startTimeSec: timingEditorTarget.startTimeSec, durationSec: timingEditorTarget.durationSec } : c));
                      } else if (timingEditorTarget.kind === 'text') {
                        setTextZones(prev => prev.map(z => z.id === timingEditorTarget.id ? { 
                          ...z, 
                          text: timingEditorTarget.text ?? z.text,
                          textColor: timingEditorTarget.textColor ?? z.textColor,
                          fontSize: timingEditorTarget.fontSize ?? z.fontSize,
                          isBold: timingEditorTarget.isBold ?? z.isBold,
                          isUppercase: timingEditorTarget.isUppercase ?? z.isUppercase,
                          startTimeSec: timingEditorTarget.startTimeSec, 
                          endTimeSec: timingEditorTarget.startTimeSec + timingEditorTarget.durationSec 
                        } : z));
                      }
                      setIsTimingModalOpen(false);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider les modifications</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MusicStudioReels;
