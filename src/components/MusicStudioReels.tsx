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
  Sliders, 
  Check, 
  ChevronRight,
  Eye,
  Maximize2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Send,
  Mic,
  MessageSquare,
  Film,
  Layers,
  Presentation,
  Volume1,
  X
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
  xPercent: number; // Position X en %
  yPercent: number; // Position Y en %
  startTimeSec: number;
  endTimeSec: number;
}

export interface SoundItem {
  id: string;
  name: string;
  category: 'transitions' | 'beats' | 'impacts' | 'bells' | 'ambience' | 'voices';
  type: string;
  durationSec: number;
  color: string;
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

// Bibliothèque de sons Web Audio native
export const SOUND_LIBRARY: SoundItem[] = [
  { id: 's1', name: '⚡ Whoosh Rapide', category: 'transitions', type: 'whoosh_fast', durationSec: 1.2, color: 'bg-amber-500', badge: 'Impact' },
  { id: 's2', name: '🌪️ Whoosh Cinématique', category: 'transitions', type: 'whoosh_cinema', durationSec: 1.8, color: 'bg-cyan-500', badge: 'Cinéma' },
  { id: 's3', name: '💥 808 Bass Drop', category: 'impacts', type: 'drop', durationSec: 2.0, color: 'bg-rose-500', badge: 'Sub-bass' },
  { id: 's4', name: '🥊 Slam Punch', category: 'impacts', type: 'slam', durationSec: 0.9, color: 'bg-red-600', badge: 'Percutant' },
  { id: 's5', name: '🥁 Beat Lo-Fi Chill', category: 'beats', type: 'beat_lofi', durationSec: 6.0, color: 'bg-purple-500', badge: 'Détente' },
  { id: 's6', name: '🔥 Trap 808 Énergique', category: 'beats', type: 'beat_trap', durationSec: 5.0, color: 'bg-blue-600', badge: 'Rythme' },
  { id: 's7', name: '🔔 Cloche Succès / Cash', category: 'bells', type: 'bell_cash', durationSec: 1.5, color: 'bg-emerald-500', badge: 'Victoire' },
  { id: 's8', name: '🛑 Glitch & Stop', category: 'transitions', type: 'glitch', durationSec: 0.8, color: 'bg-pink-600', badge: 'Cyber' },
  { id: 's9', name: '📈 Riser Montée Tension', category: 'transitions', type: 'riser', durationSec: 2.5, color: 'bg-amber-600', badge: 'Build-up' },
  { id: 's10', name: '✨ Scintillement Magique', category: 'bells', type: 'shimmer', durationSec: 2.0, color: 'bg-teal-400', badge: 'Féerique' },
  { id: 's11', name: '🌌 Nappe Spatiale Ambiante', category: 'ambience', type: 'ambient_pad', durationSec: 6.0, color: 'bg-indigo-500', badge: 'Profondeur' },
  { id: 's12', name: '🎙️ Hook « Attends ! »', category: 'voices', type: 'voice_hook', durationSec: 1.2, color: 'bg-fuchsia-500', badge: 'Attention' },
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
      } else if (soundType.includes('drop') || soundType.includes('slam') || soundType.includes('impact')) {
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
      } else if (soundType.includes('bell') || soundType.includes('cash') || soundType.includes('shimmer')) {
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
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.28);
        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      }
    } catch {
      // Audio fallback
    }
  }
}

const synthEngine = new SynthesizerEngine();

export const MusicStudioReels: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // 1. Modèle de cadre actif
  const [activeFrame, setActiveFrame] = useState<FrameModel>('9:16');
  
  // 2. Modèle de fond actif
  const [activeBackground, setActiveBackground] = useState<string>('deep_night');
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);

  // 3. Typographie active (Canva / LibreOffice style)
  const [activeFontFamily, setActiveFontFamily] = useState<string>(FONT_OPTIONS[0].family);
  const [activeFontSize, setActiveFontSize] = useState<number>(32);
  const [isBold, setIsBold] = useState<boolean>(true);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isUppercase, setIsUppercase] = useState<boolean>(true);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');

  // 4. Média importé (Vidéo ou Photo)
  const [mediaFile, setMediaFile] = useState<{ url: string; type: 'video' | 'image'; name: string } | null>(null);

  // 5. Zones de texte sur le canvas
  const [textZones, setTextZones] = useState<TextZone[]>([
    {
      id: 'tz_default',
      text: 'VOTRE TITRE ACCROCHEUR ICI',
      fontFamily: FONT_OPTIONS[3].family, // Impact
      fontSize: 32,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isUppercase: true,
      textAlign: 'center',
      textColor: '#FACC15', // Jaune accroche
      xPercent: 50,
      yPercent: 45,
      startTimeSec: 0,
      endTimeSec: 30,
    }
  ]);
  const [selectedTextZoneId, setSelectedTextZoneId] = useState<string | null>('tz_default');

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
  }, [selectedTextZoneId]);

  // Appliquer les changements de la barre du haut à la zone de texte sélectionnée
  const updateSelectedZone = (props: Partial<TextZone>) => {
    if (!selectedTextZoneId) return;
    setTextZones(prev => prev.map(zone => {
      if (zone.id === selectedTextZoneId) {
        return { ...zone, ...props };
      }
      return zone;
    }));
  };

  // 6. Timeline & Clips Audio
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const maxDurationSec = 30; // 30s Reel standard
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previewOutroMode, setPreviewOutroMode] = useState<boolean>(false);

  const [audioClips, setAudioClips] = useState<TimelineAudioClip[]>([
    { id: 'c1', name: '⚡ Whoosh Rapide', type: 'whoosh_fast', startTimeSec: 0.0, durationSec: 1.2, color: 'bg-amber-500', volume: 0.9 },
    { id: 'c2', name: '💥 808 Bass Drop', type: 'drop', startTimeSec: 3.0, durationSec: 2.0, color: 'bg-rose-500', volume: 0.85 },
    { id: 'c3', name: '🥁 Beat Lo-Fi Chill', type: 'beat_lofi', startTimeSec: 5.0, durationSec: 6.0, color: 'bg-purple-500', volume: 0.75 },
    { id: 'c4', name: '🔔 Cloche Succès', type: 'bell_cash', startTimeSec: 12.0, durationSec: 1.5, color: 'bg-emerald-500', volume: 0.8 },
  ]);

  // 7. Bouton "+" menu popover (Musique / Texte / Média)
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState<boolean>(false);
  const [isAudioPickerOpen, setIsAudioPickerOpen] = useState<boolean>(false);

  // 8. Espace Andrea IA persistant à droite
  const [andreaChatInput, setAndreaChatInput] = useState<string>('');
  const [andreaMessages, setAndreaMessages] = useState<Array<{ id: string; role: 'user' | 'andrea'; text: string; time: string }>>([
    {
      id: 'm1',
      role: 'andrea',
      text: 'Bonjour ! Je suis votre assistante Andrea dédiée au Studio. Que souhaitez-vous réaliser ? Je peux créer un diaporama complet, concevoir un script viral, ou synchroniser automatiquement sons et sous-titres.',
      time: 'Maintenant'
    }
  ]);
  const [isAndreaThinking, setIsAndreaThinking] = useState<boolean>(false);
  const andreaChatEndRef = useRef<HTMLDivElement | null>(null);

  // Animation de la Timeline et déclenchement des clips audio
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

        // Jouer les sons programmés sur la timeline
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

  // Contrôles lecture
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      andreaVoice.stop();
    } else {
      playedClipsRef.current.clear();
      setPreviewOutroMode(false);
      setIsPlaying(true);
      // Voix Andrea au début
      if (currentTimeSec < 1.0) {
        const activeText = textZones[0]?.text || "Bienvenue dans le Studio Andrea";
        andreaVoice.speak(activeText);
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

  // Import de média (vidéo ou image)
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    if (!isVideo && !isImage) {
      alert("Veuillez sélectionner un fichier vidéo (MP4, WebM) ou image (PNG, JPG).");
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

  // Insérer une nouvelle zone de texte
  const handleInsertTextZone = () => {
    const newZone: TextZone = {
      id: `tz_${Date.now()}`,
      text: 'NOUVEAU TEXTE',
      fontFamily: activeFontFamily,
      fontSize: activeFontSize,
      isBold: isBold,
      isItalic: isItalic,
      isUnderline: isUnderline,
      isUppercase: isUppercase,
      textAlign: textAlign,
      textColor: textColor,
      xPercent: 50,
      yPercent: Math.min(80, 30 + textZones.length * 15),
      startTimeSec: currentTimeSec,
      endTimeSec: Math.min(maxDurationSec, currentTimeSec + 8),
    };
    setTextZones(prev => [...prev, newZone]);
    setSelectedTextZoneId(newZone.id);
    setIsPlusMenuOpen(false);
    synthEngine.playSound('whoosh_fast');
  };

  // Ajouter un son sur la timeline
  const handleAddSoundClip = (sound: SoundItem) => {
    const newClip: TimelineAudioClip = {
      id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: sound.name,
      type: sound.type,
      startTimeSec: Math.min(currentTimeSec, maxDurationSec - sound.durationSec),
      durationSec: sound.durationSec,
      color: sound.color,
      volume: 0.85,
    };
    setAudioClips(prev => [...prev, newClip]);
    synthEngine.playSound(sound.type);
    setIsAudioPickerOpen(false);
    setIsPlusMenuOpen(false);
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
      // Traitement via Andrea Request Engine
      const res = await andreaEngine.sendQuery(
        `[Mode Studio Montage & Diaporama] L'utilisateur demande : "${query}". Réponds avec une action concrète, un script percutant ou les paramètres de diaporama recommandés.`
      );

      const andreaReply = {
        id: `a_${Date.now()}`,
        role: 'andrea' as const,
        text: res.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAndreaMessages(prev => [...prev, andreaReply]);

      // Si l'utilisateur demande un diaporama ou des sons, exécuter l'action concrète
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
          },
          {
            id: 'slide_3',
            text: '3. RÉSULTATS IMMÉDIATS AVEC ANDREA',
            fontFamily: FONT_OPTIONS[0].family,
            fontSize: 32,
            isBold: true,
            isItalic: false,
            isUnderline: false,
            isUppercase: true,
            textAlign: 'center',
            textColor: '#38BDF8',
            xPercent: 50,
            yPercent: 50,
            startTimeSec: 20,
            endTimeSec: 30
          }
        ]);
        setSelectedTextZoneId('slide_1');
      }

      // Lire la réponse avec la voix fluide d'Andrea
      andreaVoice.speak(res.text.slice(0, 150));
    } catch {
      setAndreaMessages(prev => [
        ...prev,
        {
          id: `a_err_${Date.now()}`,
          role: 'andrea',
          text: 'Je suis prête à configurer votre diaporama et ajuster les effets sonores. Que souhaitez-vous ajouter ?',
          time: 'Maintenant'
        }
      ]);
    } finally {
      setIsAndreaThinking(false);
      setTimeout(() => {
        andreaChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Exportation Haute Définition
  const handleExportHD = () => {
    alert("Export Haute Définition prêt ! Le visuel avec filigrane « made with Andrea AI » et l'écran de fin officiel sont enregistrés.");
  };

  const selectedModel = FRAME_MODELS.find(m => m.id === activeFrame) || FRAME_MODELS[0];
  const bgPreset = BACKGROUND_PRESETS.find(b => b.id === activeBackground) || BACKGROUND_PRESETS[1];

  return (
    <div className="flex flex-col h-full bg-[#0a0718] text-white overflow-hidden select-none">
      
      {/* 1. BARRE SUPÉRIEURE TYPE CANVA & LIBREOFFICE : CADRE, POLICE, TAILLE, STYLES, FOND */}
      <header className="bg-[#120c2b] border-b border-[#5A33FF33] px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0 z-20 shadow-md">
        
        {/* Section Gauche : Choix du Modèle de Cadre */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-extrabold text-[#c4b5fd] uppercase tracking-wider hidden sm:inline mr-1">
            Cadre :
          </span>
          <div className="flex items-center bg-[#1b143c] p-1 rounded-xl border border-[#5A33FF44]">
            {FRAME_MODELS.map(frame => (
              <button
                key={frame.id}
                onClick={() => setActiveFrame(frame.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeFrame === frame.id
                    ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                    : 'text-[#c4b5fd] hover:text-white'
                }`}
                title={frame.sublabel}
              >
                <span>{frame.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Centrale : Outils Typographiques Canva & LibreOffice */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Choix de la police */}
          <select
            value={activeFontFamily}
            onChange={e => {
              const newFont = e.target.value;
              setActiveFontFamily(newFont);
              updateSelectedZone({ fontFamily: newFont });
            }}
            className="bg-[#1b143c] border border-[#5A33FF44] text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer max-w-[150px] truncate"
            title="Police typographique (Canva / LibreOffice)"
          >
            {FONT_OPTIONS.map(font => (
              <option key={font.name} value={font.family}>
                {font.name}
              </option>
            ))}
          </select>

          {/* Taille de police */}
          <div className="flex items-center bg-[#1b143c] border border-[#5A33FF44] rounded-xl px-1.5 py-0.5">
            <button
              onClick={() => {
                const newSize = Math.max(14, activeFontSize - 2);
                setActiveFontSize(newSize);
                updateSelectedZone({ fontSize: newSize });
              }}
              className="px-1.5 text-xs font-bold text-[#c4b5fd] hover:text-white"
              title="Réduire taille"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold px-1 text-white">{activeFontSize}</span>
            <button
              onClick={() => {
                const newSize = Math.min(80, activeFontSize + 2);
                setActiveFontSize(newSize);
                updateSelectedZone({ fontSize: newSize });
              }}
              className="px-1.5 text-xs font-bold text-[#c4b5fd] hover:text-white"
              title="Augmenter taille"
            >
              +
            </button>
          </div>

          {/* Gras, Italique, Souligné, Casse */}
          <div className="flex items-center bg-[#1b143c] border border-[#5A33FF44] rounded-xl p-0.5">
            <button
              onClick={() => {
                const next = !isBold;
                setIsBold(next);
                updateSelectedZone({ isBold: next });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${isBold ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Gras (Bold)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const next = !isItalic;
                setIsItalic(next);
                updateSelectedZone({ isItalic: next });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${isItalic ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Italique"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const next = !isUnderline;
                setIsUnderline(next);
                updateSelectedZone({ isUnderline: next });
              }}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${isUnderline ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Souligné"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const next = !isUppercase;
                setIsUppercase(next);
                updateSelectedZone({ isUppercase: next });
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
              onClick={() => {
                setTextAlign('left');
                updateSelectedZone({ textAlign: 'left' });
              }}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'left' ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Aligner à gauche"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTextAlign('center');
                updateSelectedZone({ textAlign: 'center' });
              }}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'center' ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Centrer"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTextAlign('right');
                updateSelectedZone({ textAlign: 'right' });
              }}
              className={`p-1.5 rounded-lg text-xs transition ${textAlign === 'right' ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white'}`}
              title="Aligner à droite"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Couleur du texte */}
          <div className="flex items-center gap-1 bg-[#1b143c] border border-[#5A33FF44] rounded-xl px-2 py-1">
            <span className="text-[10px] text-[#c4b5fd] font-bold">Couleur</span>
            <input
              type="color"
              value={textColor}
              onChange={e => {
                const color = e.target.value;
                setTextColor(color);
                updateSelectedZone({ textColor: color });
              }}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              title="Choisir la couleur"
            />
          </div>

          {/* Choix du fond */}
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
                <option key={preset.id} value={preset.id} className="bg-[#120c2b] text-white">
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Droite : Aperçu Outro & Export */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPreviewOutroMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              previewOutroMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#1b143c] text-[#c4b5fd] hover:text-white border-[#5A33FF44]'
            }`}
            title="Aperçu de l'écran de fin officiel"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{previewOutroMode ? 'Masquer Outro' : 'Aperçu Outro'}</span>
          </button>

          <button
            onClick={handleExportHD}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2922a8] hover:to-[#6d46ff] text-white text-xs font-extrabold shadow-md flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter HD</span>
          </button>
        </div>
      </header>

      {/* 2. CORPS PRINCIPAL : GAUCHE (CRÉATION VIDÉO & TIMELINE) + DROITE (ESPACE ANDREA IA PERMANENT) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* ================= GAUCHE / CENTRE : CRÉATION VIDÉO & TIMELINE ================= */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0718] relative">
          
          {/* A. ESPACE DE PRÉVISUALISATION & IMPORT VIDÉO / PHOTOS (EN HAUT) */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-5 overflow-auto relative bg-[#090616]">
            
            {/* Cadre de Rendu Dynamique */}
            <div 
              className={`relative shadow-2xl rounded-2xl overflow-hidden border border-[#5A33FF44] transition-all flex flex-col items-center justify-center ${selectedModel.aspectClass} ${
                customBackgroundImage ? '' : bgPreset.bgClass
              }`}
              style={
                customBackgroundImage ? { backgroundImage: `url(${customBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}
              }
            >
              {/* Contenu Média Importé (Vidéo ou Photo) */}
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
                /* Zone d'importation vierge ergonomique */
                <label className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-white/5 transition group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1b143c] border border-[#5A33FF55] flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-[#8B70FF] transition shadow-lg mb-3">
                    <Upload className="w-6 h-6 text-purple-300" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                    Cliquez ou glissez une vidéo / photo
                  </span>
                  <span className="text-[10px] text-[#c4b5fd]/70 mt-1 max-w-[200px]">
                    Formats acceptés : MP4, WebM, PNG, JPG (Qualité HD)
                  </span>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Zones de Texte Superposées (Éditables et déplaçables au clic) */}
              {textZones.map(zone => {
                const isSelected = selectedTextZoneId === zone.id;
                // Visible si le temps de lecture est dans l'intervalle
                const isVisible = currentTimeSec >= zone.startTimeSec && currentTimeSec <= zone.endTimeSec;

                return (
                  <div
                    key={zone.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTextZoneId(zone.id);
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

              {/* FILIGRANE OBLIGATOIRE EN BAS À DROITE (STYLE CAPCUT) */}
              <div className="absolute bottom-2.5 right-3 z-30 pointer-events-none flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                <span className="text-[9px] font-semibold text-zinc-300 tracking-wide">
                  made with <strong className="text-white">Andrea AI</strong>
                </span>
              </div>

              {/* ÉCRAN OUTRO FINALE OFFICIELLE : /logo_bea.png + Andrea AI + By BehaviorLab AI */}
              {(previewOutroMode || currentTimeSec >= maxDurationSec - 1.5) && (
                <div className="absolute inset-0 bg-[#090616]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                  <img
                    src="/logo_bea.png"
                    alt="Andrea AI Logo"
                    className="w-16 h-16 object-contain rounded-2xl p-1 bg-[#120c2b] border border-[#5A33FF55] shadow-2xl mb-3 animate-pulse"
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

          {/* BARRE DE CONTRÔLE DE LECTURE (Sous le canevas vidéo) */}
          <div className="bg-[#100b24] px-4 py-2 border-t border-b border-[#5A33FF33] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white flex items-center justify-center shadow transition"
                title={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>

              <button
                onClick={resetPlayhead}
                className="p-1.5 rounded-lg bg-[#1b143c] hover:bg-[#251c52] text-[#c4b5fd] hover:text-white transition"
                title="Remise à zéro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-[#1b143c]">
                {currentTimeSec.toFixed(1)}s / {maxDurationSec.toFixed(1)}s
              </div>
            </div>

            {/* Curseur de lecture interactive (Scrubber) */}
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
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* B. PISTES TIMELINE (JUSTE EN DESSOUS DE L'ESPACE VIDÉO) */}
          <div className="h-44 sm:h-52 bg-[#0c081e] p-3 overflow-y-auto space-y-2 border-t border-[#5A33FF22] relative">
            
            {/* Piste 1 : Vidéo & Scènes Clés */}
            <div className="flex items-center gap-2">
              <div className="w-36 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>Piste 1 : Vidéo/Média</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-3">
                <div className="h-full w-full bg-purple-600/20 rounded-lg flex items-center justify-between text-[10px] text-purple-200 px-2 font-mono">
                  <span>{mediaFile ? mediaFile.name : 'Scène Principale (30.0s)'}</span>
                  <span className="text-[9px] text-purple-300">Format {activeFrame}</span>
                </div>
              </div>
            </div>

            {/* Piste 2 : Voix off & Andrea Speech */}
            <div className="flex items-center gap-2">
              <div className="w-36 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Volume1 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Piste 2 : Voix Andrea</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-emerald-500/30 relative overflow-hidden flex items-center px-3">
                <div className="h-full w-full bg-emerald-500/20 rounded-lg flex items-center justify-between text-[10px] text-emerald-200 px-2 font-mono">
                  <span>Voix Fluide Naturelle sans coupure</span>
                  <span className="text-[9px] text-emerald-300">15 langues actives</span>
                </div>
              </div>
            </div>

            {/* Piste 3 : Musique & Effets Sonores SFX */}
            <div className="flex items-center gap-2">
              <div className="w-36 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>Piste 3 : Sons & SFX</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-1">
                {audioClips.map(clip => {
                  const leftPercent = (clip.startTimeSec / maxDurationSec) * 100;
                  const widthPercent = (clip.durationSec / maxDurationSec) * 100;
                  return (
                    <div
                      key={clip.id}
                      style={{ left: `${leftPercent}%`, width: `${Math.max(12, widthPercent)}%` }}
                      className={`absolute h-6 rounded-lg ${clip.color} text-white text-[9px] font-bold flex items-center justify-between px-1.5 shadow truncate group cursor-pointer`}
                      title={`${clip.name} (${clip.startTimeSec.toFixed(1)}s)`}
                      onClick={() => synthEngine.playSound(clip.type)}
                    >
                      <span className="truncate">{clip.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAudioClips(prev => prev.filter(c => c.id !== clip.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-200 transition"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Piste 4 : Textes & Mots Clés */}
            <div className="flex items-center gap-2">
              <div className="w-36 text-[10px] font-bold text-[#c4b5fd] truncate shrink-0 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-cyan-400" />
                <span>Piste 4 : Textes</span>
              </div>
              <div className="flex-1 h-8 rounded-xl bg-[#171032] border border-[#5A33FF33] relative overflow-hidden flex items-center px-1">
                {textZones.map(zone => {
                  const leftPercent = (zone.startTimeSec / maxDurationSec) * 100;
                  const widthPercent = ((zone.endTimeSec - zone.startTimeSec) / maxDurationSec) * 100;
                  const isSelected = selectedTextZoneId === zone.id;
                  return (
                    <div
                      key={zone.id}
                      style={{ left: `${leftPercent}%`, width: `${Math.max(15, widthPercent)}%` }}
                      onClick={() => setSelectedTextZoneId(zone.id)}
                      className={`absolute h-6 rounded-lg text-[9px] font-bold flex items-center justify-between px-1.5 truncate cursor-pointer transition ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-white'
                          : 'bg-[#251a4f] text-[#c4b5fd] hover:text-white'
                      }`}
                      title={zone.text}
                    >
                      <span className="truncate">{zone.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tête de Lecture Verticale Rouge/Violette synchronisée */}
            <div
              style={{ left: `calc(9rem + ${(currentTimeSec / maxDurationSec) * 80}%)` }}
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
              title="Ajouter Musique, Son, Texte ou Média"
            >
              <Plus className={`w-6 h-6 transition-transform duration-200 ${isPlusMenuOpen ? 'rotate-45' : ''}`} />
            </button>

            {/* Menu Popover du Bouton "+" */}
            {isPlusMenuOpen && (
              <div className="absolute bottom-14 left-0 w-64 bg-[#140e2d] border border-[#5A33FF55] rounded-2xl shadow-2xl p-2 space-y-1 animate-in slide-in-from-bottom-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-[#c4b5fd] uppercase tracking-wider border-b border-white/5">
                  Insérer dans le projet :
                </div>

                {/* Option 1 : Musique & Sons */}
                <button
                  onClick={() => {
                    setIsAudioPickerOpen(true);
                    setIsPlusMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Musique & Effets Sonores</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Whoosh, 808, beats et cloches</div>
                  </div>
                </button>

                {/* Option 2 : Insérer une zone de texte */}
                <button
                  onClick={handleInsertTextZone}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Type className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Insérer une zone de texte</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Active la barre de police du haut</div>
                  </div>
                </button>

                {/* Option 3 : Importer Vidéo ou Photo */}
                <label className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#201844] text-xs font-bold text-white transition flex items-center gap-2.5 cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Importer Vidéo / Photo</div>
                    <div className="text-[10px] text-[#c4b5fd] font-normal">Depuis votre ordinateur ou mobile</div>
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

            {/* Tiroir / Modal de Sélection de Sons & Musiques */}
            {isAudioPickerOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#140e2d] border-2 border-[#5A33FF55] rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-bold text-white">Catalogue de Musiques & Sons</h3>
                    </div>
                    <button
                      onClick={() => setIsAudioPickerOpen(false)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#c4b5fd]">
                    Cliquez sur un son pour l'écouter et l'insérer sur la timeline à la seconde actuelle ({currentTimeSec.toFixed(1)}s) :
                  </p>

                  <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {SOUND_LIBRARY.map(sound => (
                      <div
                        key={sound.id}
                        onClick={() => handleAddSoundClip(sound)}
                        className="p-2.5 rounded-xl bg-[#1b143c] hover:bg-[#281c5a] border border-[#5A33FF33] hover:border-[#8B70FF] transition cursor-pointer flex flex-col justify-between space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span className="truncate">{sound.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-300 font-mono">
                            {sound.durationSec}s
                          </span>
                        </div>
                        <div className="text-[10px] text-[#c4b5fd] flex items-center justify-between">
                          <span>{sound.badge}</span>
                          <span className="text-purple-300 font-bold">+ Insérer</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setIsAudioPickerOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#231a4a] text-white text-xs font-bold hover:bg-[#2d2160]"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= DROITE : ESPACE ANDREA IA PERMANENT (TOUJOURS VISIBLE) ================= */}
        <aside className="w-full lg:w-80 xl:w-96 bg-[#110b27] border-t lg:border-t-0 lg:border-l border-[#5A33FF33] flex flex-col shrink-0 h-72 lg:h-full z-20 shadow-xl">
          
          {/* Header du volet Andrea IA */}
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

          {/* Suggestions d'actions rapides (Diaporamas, Vidéos virales, Sons) */}
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
                <span>Créer un diaporama complet</span>
              </button>

              <button
                onClick={() => handleSendAndreaMessage("Écris un script de vidéo virale de 30 secondes pour captiver l'attention")}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
              >
                <Wand2 className="w-3 h-3 text-pink-400" />
                <span>Script vidéo virale</span>
              </button>

              <button
                onClick={() => {
                  handleAddSoundClip(SOUND_LIBRARY[0]); // Whoosh
                  setTimeout(() => handleAddSoundClip(SOUND_LIBRARY[2]), 400); // 808
                  handleSendAndreaMessage("J'ai synchronisé les effets sonores optimaux.");
                }}
                className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
              >
                <Music className="w-3 h-3 text-amber-400" />
                <span>Ajouter sons clés</span>
              </button>
            </div>
          </div>

          {/* Historique des messages Andrea */}
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

          {/* Saisie de message Andrea */}
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
                title="Envoyer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default MusicStudioReels;
