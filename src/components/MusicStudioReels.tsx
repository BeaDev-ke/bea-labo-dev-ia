import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Upload, 
  Music, 
  Mic, 
  Type, 
  Sparkles, 
  Plus, 
  Trash2, 
  Layers, 
  Scissors, 
  Download, 
  Wand2, 
  Sliders, 
  Check, 
  Flame, 
  ChevronRight,
  Disc,
  Radio,
  Eye,
  Maximize2,
  Search,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { andreaVoice } from '../utils/speech';

// Audio Synthesizer via Web Audio API capable of generating rich sounds and beats on the fly
class DAWWebAudioSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
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
        // Whoosh sound: filtered white noise sweeping frequency
        const bufferSize = this.ctx.sampleRate * 0.45;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
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
      } else if (soundType.includes('drop') || soundType.includes('boom') || soundType.includes('impact')) {
        // Bass drop / 808 sub boom
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
      } else if (soundType.includes('bell') || soundType.includes('ding') || soundType.includes('cash')) {
        // Clear high bell chime
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
      } else if (soundType.includes('glitch') || soundType.includes('scratch')) {
        // Vinyl scratch / digital glitch
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
        // Tension riser / build-up
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
      } else if (soundType.includes('ambient') || soundType.includes('cinematic')) {
        // Cinematic warm pad chord
        const freqs = [220, 277.18, 329.63]; // A Major chord
        freqs.forEach(f => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0.18, t + 0.5);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 2.1);
        });
      } else {
        // Standard rhythmic kick / beat
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.28);
        gain.gain.setValueAtTime(0.75, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      }
    } catch {}
  }
}

const synthEngine = new DAWWebAudioSynthesizer();

export interface TimelineAudioClip {
  id: string;
  name: string;
  type: string;
  startTimeSec: number;
  durationSec: number;
  color: string;
  volume: number;
}

export interface TimelineColoredWord {
  id: string;
  text: string;
  color: string; // #FACC15, #22C55E, #EF4444, #06B6D4, etc.
  startTimeSec: number;
  endTimeSec: number;
}

export interface ViralReelCard {
  id: string;
  title: string;
  subtitle: string;
  viewsBadge: string;
  playCount: number;
  highlightText: string;
  script: string;
  soundCue: string;
}

export interface SoundItem {
  id: string;
  name: string;
  category: 'all' | 'transitions' | 'beats' | 'impacts' | 'bells' | 'ambience' | 'voices';
  type: string;
  durationSec: number;
  color: string;
  badge: string;
}

// Complete library of searchable sounds & music without mentioning external brands
const FULL_SOUND_LIBRARY: SoundItem[] = [
  // Transitions & Whooshes
  { id: 's1', name: '⚡ Whoosh Rapide', category: 'transitions', type: 'whoosh', durationSec: 1.2, color: 'bg-amber-500', badge: 'Impact' },
  { id: 's2', name: '🌪️ Whoosh Cinématique', category: 'transitions', type: 'whoosh_cinematic', durationSec: 1.8, color: 'bg-amber-600', badge: 'Cinéma' },
  { id: 's3', name: '🚀 Swish Aérien', category: 'transitions', type: 'swish', durationSec: 0.9, color: 'bg-yellow-500', badge: 'Rapide' },
  { id: 's4', name: '📈 Riser Montée en Tension', category: 'transitions', type: 'riser', durationSec: 2.2, color: 'bg-orange-500', badge: 'Build-up' },
  { id: 's5', name: '🛑 Glitch & Stop', category: 'transitions', type: 'glitch', durationSec: 0.8, color: 'bg-rose-500', badge: 'Cyber' },
  { id: 's6', name: '💿 Vinyl Scratch Arrêt', category: 'transitions', type: 'scratch', durationSec: 1.1, color: 'bg-cyan-500', badge: 'Mème' },
  
  // Beats & Musiques
  { id: 's7', name: '🥁 Beat Lo-Fi Chill', category: 'beats', type: 'beat_lofi', durationSec: 4.5, color: 'bg-purple-500', badge: 'Détente' },
  { id: 's8', name: '🔥 Trap 808 Énergique', category: 'beats', type: 'beat_trap', durationSec: 4.0, color: 'bg-red-500', badge: 'Rythme' },
  { id: 's9', name: '🌃 Synthwave 80s', category: 'beats', type: 'beat_synthwave', durationSec: 5.0, color: 'bg-fuchsia-500', badge: 'Rétro' },
  { id: 's10', name: '🎸 Groove Acoustique', category: 'beats', type: 'beat_acoustic', durationSec: 4.2, color: 'bg-emerald-500', badge: 'Organique' },
  { id: 's11', name: '⚡ Cyberpunk Pulse', category: 'beats', type: 'beat_cyber', durationSec: 3.8, color: 'bg-indigo-500', badge: 'Futuriste' },
  { id: 's12', name: '🕺 Funk Pop Moderne', category: 'beats', type: 'beat_funk', durationSec: 4.0, color: 'bg-teal-500', badge: 'Entraînant' },

  // Impacts & Drops
  { id: 's13', name: '💥 Bass Drop 808 Lourd', category: 'impacts', type: 'drop', durationSec: 2.2, color: 'bg-red-600', badge: 'Sub-bass' },
  { id: 's14', name: '💣 Slam Percutant', category: 'impacts', type: 'impact_slam', durationSec: 1.5, color: 'bg-amber-700', badge: 'Boom' },
  { id: 's15', name: '🥊 Punch Impact Hook', category: 'impacts', type: 'impact_punch', durationSec: 1.0, color: 'bg-rose-600', badge: 'Accroche' },
  { id: 's16', name: '⚡ Choc Électrique', category: 'impacts', type: 'impact_elec', durationSec: 1.3, color: 'bg-violet-600', badge: 'FX' },

  // Cloches & Dings
  { id: 's17', name: '🔔 Cloche Cash / Vente', category: 'bells', type: 'cash', durationSec: 1.5, color: 'bg-emerald-400', badge: 'Argent' },
  { id: 's18', name: '✨ Ding de Succès', category: 'bells', type: 'ding', durationSec: 1.2, color: 'bg-teal-400', badge: 'Validation' },
  { id: 's19', name: '🎮 Level Up / Victoire', category: 'bells', type: 'bell_level', durationSec: 1.6, color: 'bg-amber-400', badge: 'Gamification' },
  { id: 's20', name: '📱 Notification Pop', category: 'bells', type: 'bell_notif', durationSec: 0.8, color: 'bg-sky-400', badge: 'Alerte' },

  // Ambiances & Cinématique
  { id: 's21', name: '🌌 Nappe Spatiale Zen', category: 'ambience', type: 'ambient', durationSec: 5.5, color: 'bg-blue-600', badge: 'Calme' },
  { id: 's22', name: '🕵️ Suspense & Mystère', category: 'ambience', type: 'cinematic', durationSec: 4.5, color: 'bg-slate-600', badge: 'Enquête' },
  { id: 's23', name: '🏆 Montée Triomphale', category: 'ambience', type: 'ambient_epic', durationSec: 5.0, color: 'bg-orange-600', badge: 'Victoire' },
  { id: 's24', name: '🌧️ Pluie & Calme Lo-Fi', category: 'ambience', type: 'ambient', durationSec: 6.0, color: 'bg-cyan-700', badge: 'Focus' },

  // Voix & Chants
  { id: 's25', name: '🎙️ Voix Andrea Intro', category: 'voices', type: 'voice', durationSec: 3.5, color: 'bg-pink-500', badge: 'IA Stratégique' },
  { id: 's26', name: '🗣️ « Attends ! » Hook', category: 'voices', type: 'voice_hook', durationSec: 1.2, color: 'bg-rose-500', badge: 'Interpellation' },
  { id: 's27', name: '👏 Applaudissements Foule', category: 'voices', type: 'applause', durationSec: 2.8, color: 'bg-emerald-600', badge: 'Foule' },
  { id: 's28', name: '🚀 Compte à rebours 3-2-1', category: 'voices', type: 'countdown', durationSec: 3.0, color: 'bg-amber-500', badge: 'Lancement' },
];

export const MusicStudioReels: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // Navigation tabs inside Montage
  const [activeTab, setActiveTab] = useState<'daw' | 'reels_generator' | 'format_export'>('daw');

  // Video & Timeline states
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const maxDurationSec = 30; // 30s Reel standard
  const [isMuted, setIsMuted] = useState(false);
  const [previewOutroMode, setPreviewOutroMode] = useState(false);

  // Sound Library search and category filter
  const [soundSearch, setSoundSearch] = useState('');
  const [soundCategory, setSoundCategory] = useState<'all' | 'transitions' | 'beats' | 'impacts' | 'bells' | 'ambience' | 'voices'>('all');

  // Tracks data
  const [audioClips, setAudioClips] = useState<TimelineAudioClip[]>([
    { id: 'c1', name: '⚡ Whoosh Hook', type: 'whoosh', startTimeSec: 0.0, durationSec: 1.2, color: 'bg-amber-500', volume: 0.9 },
    { id: 'c2', name: '💥 808 Impact', type: 'drop', startTimeSec: 2.8, durationSec: 2.0, color: 'bg-red-500', volume: 0.8 },
    { id: 'c3', name: '🥁 Beat Lo-Fi', type: 'beat', startTimeSec: 4.5, durationSec: 6.0, color: 'bg-purple-500', volume: 0.7 },
    { id: 'c4', name: '🔔 Cloche Réussite', type: 'bell', startTimeSec: 12.0, durationSec: 1.5, color: 'bg-emerald-500', volume: 0.85 },
  ]);

  const [coloredWords, setColoredWords] = useState<TimelineColoredWord[]>([
    { id: 'w1', text: 'ANDREA PEUT FAIRE DES REELS', color: '#FACC15', startTimeSec: 0.0, endTimeSec: 2.8 },
    { id: 'w2', text: '10K VUES EN 3 JOURS', color: '#22C55E', startTimeSec: 2.8, endTimeSec: 7.0 },
    { id: 'w3', text: '99% DES GENS RATENT ÇA', color: '#EF4444', startTimeSec: 7.0, endTimeSec: 12.0 },
    { id: 'w4', text: 'LE SKILL SECRET DÉVOILÉ', color: '#06B6D4', startTimeSec: 12.0, endTimeSec: 18.0 },
    { id: 'w5', text: 'FAIT PAR ANDREA 🚀', color: '#FB923C', startTimeSec: 18.0, endTimeSec: 25.0 },
  ]);

  // Viral Reel Cards matching user reference screenshots
  const VIRAL_CARDS: ViralReelCard[] = [
    {
      id: 'r1',
      title: 'Andrea fait des reels',
      subtitle: 'Accroche hypnotique 3 secondes',
      viewsBadge: '10 k en 3 jours',
      playCount: 12450,
      highlightText: 'ANDREA PEUT MAINTENANT FAIRE DES REELS.',
      script: 'Les autres solutions étaient rigides. Andrea génère désormais vos réels viraux de A à Z avec voix off naturelle, musique, et sous-titres en couleurs.',
      soundCue: '⚡ Whoosh Rapide + 💥 Bass Drop',
    },
    {
      id: 'r2',
      title: '10 k en 3 jours',
      subtitle: 'Courbe de rétention virale',
      viewsBadge: '+450% portée',
      playCount: 8900,
      highlightText: 'VUES 10K EN 3 JOURS.',
      script: 'Comment passer de 0 à 10 000 vues en 3 jours sans sponsoriser grâce au découpage en 3 étapes d\'Andrea.',
      soundCue: '🥁 Beat Lo-Fi Rhythme',
    },
    {
      id: 'r3',
      title: 'FAIT PAR ANDREA',
      subtitle: 'Génération en 1 seul prompt',
      viewsBadge: 'Format 9:16',
      playCount: 15300,
      highlightText: 'FAIT PAR ANDREA.',
      script: 'Montage automatisé, effets sonores placés aux secondes clés et mots surlignés synchronisés.',
      soundCue: '🔔 Cloche Cash / Ding',
    },
    {
      id: 'r4',
      title: '99% des gens ratent ça.',
      subtitle: 'Biais cognitif de curiosité',
      viewsBadge: 'Rétention 82%',
      playCount: 6400,
      highlightText: '99% DES GENS RATENT ÇA.',
      script: 'Le piège qui bloque la visibilité de vos créations, et la solution immédiate pour capter l\'attention.',
      soundCue: '🛑 Glitch & Scratch',
    },
    {
      id: 'r5',
      title: 'Le skill secret',
      subtitle: 'Architecture de production',
      viewsBadge: 'Ultra Viral',
      playCount: 11200,
      highlightText: 'LE SKILL SECRET.',
      script: 'Le plan en 3 étapes pour automatiser vos vidéos et captiver votre audience.',
      soundCue: '⚡ Whoosh Rapide',
    },
  ];

  const [selectedCard, setSelectedCard] = useState<ViralReelCard>(VIRAL_CARDS[0]);

  // Filtered sounds from comprehensive web sound engine
  const filteredSounds = FULL_SOUND_LIBRARY.filter(s => {
    const matchesCategory = soundCategory === 'all' || s.category === soundCategory;
    const matchesSearch = !soundSearch.trim() || 
      s.name.toLowerCase().includes(soundSearch.toLowerCase()) ||
      s.badge.toLowerCase().includes(soundSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Playhead animation loop & sound triggering
  const playedClipsRef = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTimeSec(prev => {
        const nextTime = prev + deltaSec;
        if (nextTime >= maxDurationSec) {
          setIsPlaying(false);
          playedClipsRef.current.clear();
          return 0;
        }

        // Trigger audio clips when playhead passes their start time
        if (!isMuted) {
          audioClips.forEach(clip => {
            if (
              prev <= clip.startTimeSec && 
              nextTime >= clip.startTimeSec && 
              !playedClipsRef.current.has(clip.id)
            ) {
              synthEngine.playSound(clip.type);
              playedClipsRef.current.add(clip.id);
            }
          });
        }

        return nextTime;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, audioClips, isMuted]);

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      andreaVoice.stop();
    } else {
      playedClipsRef.current.clear();
      setIsPlaying(true);
      if (currentTimeSec < 1.0) {
        andreaVoice.speak(selectedCard.highlightText);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeSec(0);
    playedClipsRef.current.clear();
    andreaVoice.stop();
  };

  // Add sound effect to timeline at current playhead
  const handleAddSoundToTimeline = (sound: SoundItem) => {
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
  };

  const handleRemoveClip = (id: string) => {
    setAudioClips(prev => prev.filter(c => c.id !== id));
  };

  // Drag and drop sound handling
  const handleDragStart = (e: React.DragEvent, sound: SoundItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(sound));
  };

  const handleTimelineDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const sound: SoundItem = JSON.parse(data);
        const rect = e.currentTarget.getBoundingClientRect();
        const dropX = e.clientX - rect.left;
        const targetSec = Math.max(0, Math.min(maxDurationSec - 1, (dropX / rect.width) * maxDurationSec));
        
        const newClip: TimelineAudioClip = {
          id: `clip_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: sound.name,
          type: sound.type,
          startTimeSec: Number(targetSec.toFixed(1)),
          durationSec: sound.durationSec,
          color: sound.color,
          volume: 0.85,
        };
        setAudioClips(prev => [...prev, newClip]);
        synthEngine.playSound(sound.type);
      }
    } catch {}
  };

  // Active colored word based on current time
  const activeWord = coloredWords.find(
    w => currentTimeSec >= w.startTimeSec && currentTimeSec < w.endTimeSec
  );

  // Outro screen condition (at the end of the video or when manually activated)
  const isAtOutro = previewOutroMode || (currentTimeSec >= maxDurationSec - 3.5 && isPlaying);

  // File upload for video
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const handleGenerateViralReel = (card: ViralReelCard) => {
    setSelectedCard(card);
    setCurrentTimeSec(0);
    playedClipsRef.current.clear();
    
    setAudioClips([
      { id: 'c1', name: '⚡ Whoosh Hook', type: 'whoosh', startTimeSec: 0.0, durationSec: 1.2, color: 'bg-amber-500', volume: 0.9 },
      { id: 'c2', name: '💥 808 Bass Impact', type: 'drop', startTimeSec: 2.5, durationSec: 2.0, color: 'bg-red-500', volume: 0.85 },
      { id: 'c3', name: '🥁 Lo-Fi Beat', type: 'beat', startTimeSec: 4.0, durationSec: 8.0, color: 'bg-purple-500', volume: 0.75 },
      { id: 'c4', name: '🔔 Ding Cloche CTA', type: 'bell', startTimeSec: 14.0, durationSec: 1.5, color: 'bg-emerald-500', volume: 0.9 },
    ]);

    setColoredWords([
      { id: 'w1', text: card.highlightText, color: '#FACC15', startTimeSec: 0.0, endTimeSec: 3.0 },
      { id: 'w2', text: '10K VUES EN 3 JOURS', color: '#22C55E', startTimeSec: 3.0, endTimeSec: 7.5 },
      { id: 'w3', text: 'LE SECRET DU MONTAGE EN 3 ÉTAPES', color: '#06B6D4', startTimeSec: 7.5, endTimeSec: 13.0 },
      { id: 'w4', text: 'FAIT PAR ANDREA 🚀', color: '#FB923C', startTimeSec: 13.0, endTimeSec: 20.0 },
    ]);

    setIsPlaying(true);
    andreaVoice.speak(card.script);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d091e] text-[#f5f3ff] overflow-hidden select-none">
      
      {/* 1. TOP STUDIO CONTROL BAR */}
      <div className="px-4 py-2.5 bg-[#120b29] border-b border-[#5A33FF33] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-[#1d143c] hover:bg-[#2c1f59] border border-[#5A33FF44] text-[#c4b5fd] hover:text-white transition"
              title="Retour"
            >
              ←
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow">
              <Disc className="w-4 h-4 animate-spin-slow" />
            </span>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-1.5 leading-none">
                <span>Studio de Montage & Musique Andrea</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  DAW PRO
                </span>
              </div>
              <div className="text-[10px] text-[#c4b5fd]/80">
                Catalogue universel de sons, voix off et mots en couleurs
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-[#1b123d] border border-[#5A33FF44] p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveTab('daw')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'daw'
                ? 'bg-gradient-to-r from-[#5A33FF] to-[#8B70FF] text-white shadow'
                : 'text-[#c4b5fd] hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Studio DAW Multipiste</span>
          </button>

          <button
            onClick={() => setActiveTab('reels_generator')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'reels_generator'
                ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow'
                : 'text-[#c4b5fd] hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Réels Viraux Andrea</span>
          </button>
        </div>

        {/* Master Controls & Outro Switch */}
        <div className="flex items-center gap-2">
          {/* Bouton pour tester l'Outro finale exigée */}
          <button
            onClick={() => setPreviewOutroMode(!previewOutroMode)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              previewOutroMode
                ? 'bg-orange-600 text-white border-orange-400 shadow-md'
                : 'bg-[#1b123d] border-[#5A33FF44] text-[#c4b5fd] hover:text-white'
            }`}
            title="Prévisualiser l'écran de fin officiel (Logo + Andrea AI + By BehaviorLab AI)"
          >
            <Tv className="w-3.5 h-3.5 text-orange-400" />
            <span>{previewOutroMode ? 'Quitter Outro' : 'Aperçu Outro'}</span>
          </button>

          <div className="px-3 py-1 rounded-xl bg-[#090514] border border-[#5A33FF44] font-mono text-xs font-bold text-amber-400">
            {formatTime(currentTimeSec)} / {formatTime(maxDurationSec)}
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition ${
              isMuted 
                ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
                : 'bg-[#1b123d] border-[#5A33FF44] text-[#c4b5fd] hover:text-white'
            }`}
            title={isMuted ? 'Rétablir le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow transition ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Lecture</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-[#1b123d] hover:bg-[#2a1c5d] border border-[#5A33FF44] text-[#c4b5fd] hover:text-white transition"
            title="Remettre au début"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE (SPLIT: VIDEO PREVIEW & DAW TIMELINE) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT / CENTER : VIDEO PREVIEW MONITOR (VERTICAL 9:16 REELS STYLE) */}
        <div className="w-full md:w-[380px] lg:w-[420px] bg-[#0a0618] border-r border-[#5A33FF33] flex flex-col items-center justify-center p-3 shrink-0 relative overflow-hidden">
          
          {/* Header Video Monitor */}
          <div className="w-full flex items-center justify-between pb-2 text-xs text-[#c4b5fd]">
            <span className="font-bold flex items-center gap-1 text-white">
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              Aperçu Réel 9:16
            </span>
            <label className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-white cursor-pointer bg-[#191136] px-2 py-0.5 rounded-lg border border-[#5A33FF44]">
              <Upload className="w-3 h-3" />
              <span>Importer vidéo</span>
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
            </label>
          </div>

          {/* 9:16 Vertical Screen */}
          <div className="relative aspect-[9/16] h-[340px] sm:h-[400px] md:h-[430px] rounded-2xl overflow-hidden bg-black border-2 border-orange-500/40 shadow-2xl flex flex-col justify-between p-4 group">
            
            {/* Background: User Video or Animated Studio Canvas */}
            {videoSrc ? (
              <video 
                src={videoSrc} 
                className="absolute inset-0 w-full h-full object-cover" 
                muted={isMuted} 
                playsInline 
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#180e38] via-[#0d0720] to-[#05020a] flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ff7700_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Mascot Star matching user reference screenshot */}
                <div className="relative z-10 flex flex-col items-center animate-bounce-subtle">
                  <div className="relative">
                    <img 
                      src="/logo_bea.png" 
                      alt="Andrea Star Mascot"
                      className="w-20 h-20 object-contain drop-shadow-[0_0_25px_rgba(255,140,0,0.6)]"
                      onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
                    />
                    {isPlaying && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>

                  {/* Audio Waveform visualization */}
                  <div className="mt-4 flex items-center gap-1 px-4 py-1.5 rounded-full bg-black/60 border border-orange-500/40 backdrop-blur-md">
                    <span className="text-[10px] text-orange-400 font-mono">||||||||||||||</span>
                  </div>
                </div>
              </div>
            )}

            {/* ÉCRAN DE FIN DE VIDÉO (OUTRO OFFICIELLE EXIGÉE PAR L'UTILISATEUR) */}
            {isAtOutro && (
              <div className="absolute inset-0 z-40 bg-[#090514]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="relative mb-3 animate-pulse">
                  <img 
                    src="/logo_bea.png" 
                    alt="Andrea Logo" 
                    className="w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(255,140,0,0.9)]"
                    onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
                  />
                </div>
                <div className="text-2xl font-black text-white tracking-tight uppercase">
                  Andrea AI
                </div>
                <div className="text-[10px] font-bold text-[#c4b5fd]/80 tracking-widest uppercase mt-1">
                  By BehaviorLab AI
                </div>
                <div className="mt-5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-amber-300">
                  Fin de vidéo · Outro officielle
                </div>
              </div>
            )}

            {/* Top Reel Overlay: Tag & Andrea Branding */}
            <div className="relative z-20 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-orange-500/40 text-[10px] font-black text-orange-300 uppercase tracking-wider">
                Fait par Andrea
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                {formatTime(currentTimeSec)}
              </span>
            </div>

            {/* Center / Bottom: SYNCHRONIZED COLORED WORDS */}
            <div className="relative z-20 text-center px-2 py-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 space-y-2">
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Sous-titres synchronisés
              </div>
              <div 
                className="text-base sm:text-lg font-black tracking-tight drop-shadow-md transition-all duration-150"
                style={{ color: activeWord ? activeWord.color : '#FFFFFF' }}
              >
                {activeWord ? activeWord.text : selectedCard.highlightText}
              </div>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-[9px] text-[#c4b5fd]">
                  {audioClips.length} sons placés sur la timeline
                </span>
              </div>
            </div>

            {/* FILIGRANE STYLE CAPCUT EN BAS À DROITE : "made with Andrea AI" */}
            <div className="absolute bottom-14 right-3 z-30 pointer-events-none select-none">
              <span className="text-[9px] font-bold tracking-wider text-white/60 bg-black/50 px-2 py-0.5 rounded border border-white/10 backdrop-blur-xs font-sans">
                made with Andrea AI
              </span>
            </div>

            {/* Bottom mini actions matching Image 2 */}
            <div className="relative z-20 grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10">
              <div className="p-1.5 rounded-xl bg-orange-950/40 border border-orange-500/50 flex flex-col items-center text-center">
                <Mic className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[8px] font-bold text-orange-200 mt-0.5">Voix off</span>
              </div>
              <div className="p-1.5 rounded-xl bg-orange-950/40 border border-orange-500/50 flex flex-col items-center text-center">
                <Music className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[8px] font-bold text-orange-200 mt-0.5">Musique</span>
              </div>
              <div className="p-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col items-center text-center">
                <Type className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-[8px] font-bold text-purple-200 mt-0.5">Couleurs</span>
              </div>
              <div className="p-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex flex-col items-center text-center">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span className="text-[8px] font-bold text-purple-200 mt-0.5">Viralité</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AREA : DAW MULTITRACK TIMELINE & COMPREHENSIVE SOUND ENGINE */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0c081c]">
          
          {/* TAB 1: DAW TIMELINE (STYLE STUDIO DE MUSIQUE) */}
          {activeTab === 'daw' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Comprehensive Audio & Sound Library Dock (Search + Categorized) */}
              <div className="px-4 py-3 bg-[#130b2e] border-b border-[#5A33FF33] shrink-0 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Music className="w-4 h-4 text-amber-400" />
                    <span>Catalogue Universel de Musiques & Effets Sonores ({filteredSounds.length})</span>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#c4b5fd] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={soundSearch}
                      onChange={e => setSoundSearch(e.target.value)}
                      placeholder="Rechercher musiques, beats, bruitages..."
                      className="w-full bg-[#1e1540] border border-[#5A33FF44] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#c4b5fd]/60 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Categories Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'Tous les sons' },
                    { id: 'transitions', label: '⚡ Transitions' },
                    { id: 'beats', label: '🥁 Beats & Musiques' },
                    { id: 'impacts', label: '💥 Impacts & 808' },
                    { id: 'bells', label: '🔔 Cloches & Cash' },
                    { id: 'ambience', label: '🌆 Ambiances' },
                    { id: 'voices', label: '🎙️ Voix & Chants' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSoundCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
                        soundCategory === cat.id
                          ? 'bg-amber-500 text-black shadow'
                          : 'bg-[#1e1540] text-[#c4b5fd] hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sounds Grid (Scrollable) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-h-28 overflow-y-auto pr-1">
                  {filteredSounds.map(sound => (
                    <div
                      key={sound.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, sound)}
                      onClick={() => handleAddSoundToTimeline(sound)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#1d1440] hover:bg-[#2b1e60] border border-[#5A33FF44] hover:border-amber-400 cursor-grab active:cursor-grabbing transition shadow-sm flex items-center justify-between group"
                      title="Glissez sur la piste ou cliquez pour ajouter au curseur"
                    >
                      <div className="truncate text-left">
                        <div className="text-[11px] font-bold text-white truncate group-hover:text-amber-300">
                          {sound.name}
                        </div>
                        <div className="text-[9px] text-[#c4b5fd] font-mono flex items-center gap-1">
                          <span>{sound.durationSec}s</span>
                          <span>·</span>
                          <span className="text-amber-400/80">{sound.badge}</span>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition">
                        +
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE RULER & MULTI-TRACKS AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0617]">
                
                {/* RULER / GRADUATION TEMPORELLE */}
                <div className="relative h-6 bg-[#160e36] rounded-lg border border-[#5A33FF33] overflow-hidden flex items-center">
                  {Array.from({ length: 7 }, (_, i) => i * 5).map(sec => (
                    <div
                      key={sec}
                      className="absolute top-0 bottom-0 border-l border-[#5A33FF44] flex flex-col justify-between pl-1"
                      style={{ left: `${(sec / maxDurationSec) * 100}%` }}
                    >
                      <span className="text-[9px] font-mono text-[#c4b5fd] select-none">
                        {sec}s
                      </span>
                      <span className="w-1 h-1 bg-[#5A33FF]" />
                    </div>
                  ))}

                  {/* Playhead Scrubber in Ruler */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_8px_#fbbf24] z-30 pointer-events-none"
                    style={{ left: `${(currentTimeSec / maxDurationSec) * 100}%` }}
                  >
                    <div className="w-2.5 h-2.5 -ml-1 bg-amber-400 rotate-45 rounded-xs" />
                  </div>
                </div>

                {/* TRACK 1: 🎬 PISTE VIDÉO */}
                <div className="rounded-xl bg-[#120b2d] border border-[#5A33FF33] overflow-hidden shadow">
                  <div className="px-3 py-1.5 bg-[#180e3d] border-b border-[#5A33FF22] flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>🎬</span> Piste 1 : Vidéo & Scènes Clés
                    </span>
                    <span className="text-[10px] text-zinc-400">Plein écran 9:16</span>
                  </div>
                  <div 
                    className="relative h-14 bg-[#0a0518] p-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      setCurrentTimeSec((x / rect.width) * maxDurationSec);
                    }}
                  >
                    <div className="absolute left-0 top-1 bottom-1 w-full bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 rounded-lg border border-purple-500/40 flex items-center px-3 justify-between">
                      <span className="text-xs font-bold text-purple-200">
                        {videoSrc ? 'Vidéo importée' : 'Template Réel Andrea (9:16 HD)'}
                      </span>
                      <span className="text-[10px] font-mono text-purple-300">
                        00:00 - {formatTime(maxDurationSec)}
                      </span>
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 pointer-events-none"
                      style={{ left: `${(currentTimeSec / maxDurationSec) * 100}%` }}
                    />
                  </div>
                </div>

                {/* TRACK 2: 🎙️ PISTE VOIX OFF ANDREA */}
                <div className="rounded-xl bg-[#120b2d] border border-[#5A33FF33] overflow-hidden shadow">
                  <div className="px-3 py-1.5 bg-[#180e3d] border-b border-[#5A33FF22] flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-orange-400" />
                      <span>Piste 2 : Voix off & Andrea Speech</span>
                    </span>
                    <button
                      onClick={() => andreaVoice.speak(selectedCard.script)}
                      className="text-[10px] font-bold text-orange-300 hover:text-white px-2 py-0.5 rounded bg-orange-500/20"
                    >
                      Écouter la voix
                    </button>
                  </div>
                  <div 
                    className="relative h-14 bg-[#0a0518] p-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      setCurrentTimeSec((x / rect.width) * maxDurationSec);
                    }}
                  >
                    <div className="absolute left-0 top-1 bottom-1 w-[80%] bg-gradient-to-r from-orange-600/70 to-amber-600/70 rounded-lg border border-orange-500/60 flex items-center px-3 justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        🎙️ Voix fluide style Gemini : « {selectedCard.script.slice(0, 45)}... »
                      </span>
                      <span className="text-[9px] font-mono text-orange-200 shrink-0">
                        Voix neuronale
                      </span>
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 pointer-events-none"
                      style={{ left: `${(currentTimeSec / maxDurationSec) * 100}%` }}
                    />
                  </div>
                </div>

                {/* TRACK 3: 🎵 PISTE SONS & SFX (DRAG & DROP ZONE) */}
                <div className="rounded-xl bg-[#120b2d] border border-amber-500/40 overflow-hidden shadow-lg">
                  <div className="px-3 py-1.5 bg-[#1d1240] border-b border-[#5A33FF33] flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-amber-400" />
                      <span>Piste 3 : Musique & Effets Sonores SFX (Emplacement exact des sons)</span>
                    </span>
                    <span className="text-[10px] text-amber-400/80">
                      Glissez des sons ici
                    </span>
                  </div>
                  
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleTimelineDrop}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      setCurrentTimeSec((x / rect.width) * maxDurationSec);
                    }}
                    className="relative h-16 bg-[#090416] p-1 cursor-pointer transition"
                  >
                    {audioClips.map(clip => {
                      const leftPercent = (clip.startTimeSec / maxDurationSec) * 100;
                      const widthPercent = Math.max(4, (clip.durationSec / maxDurationSec) * 100);
                      const isPassing = currentTimeSec >= clip.startTimeSec && currentTimeSec <= clip.startTimeSec + clip.durationSec;

                      return (
                        <div
                          key={clip.id}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          className={`absolute top-1.5 bottom-1.5 ${clip.color} rounded-lg border-2 ${
                            isPassing ? 'border-white scale-105 shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'border-black/40'
                          } text-black font-extrabold text-[10px] px-2 flex items-center justify-between overflow-hidden shadow transition-all duration-100 group`}
                          onClick={(e) => {
                            e.stopPropagation();
                            synthEngine.playSound(clip.type);
                          }}
                        >
                          <span className="truncate pr-1">{clip.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveClip(clip.id);
                            }}
                            className="w-3.5 h-3.5 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black transition"
                            title="Supprimer ce son"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 pointer-events-none"
                      style={{ left: `${(currentTimeSec / maxDurationSec) * 100}%` }}
                    />
                  </div>
                </div>

                {/* TRACK 4: 🔤 PISTE MOTS EN COULEURS & SOUS-TITRES DYNAMIQUES */}
                <div className="rounded-xl bg-[#120b2d] border border-cyan-500/40 overflow-hidden shadow">
                  <div className="px-3 py-1.5 bg-[#141b3d] border-b border-[#5A33FF33] flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Piste 4 : Mots en Couleurs (À quel moment apparaissent les mots clés)</span>
                    </span>
                    <span className="text-[10px] text-cyan-400/80">
                      Style MrBeast / Rétention maximale
                    </span>
                  </div>

                  <div 
                    className="relative h-16 bg-[#090416] p-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      setCurrentTimeSec((x / rect.width) * maxDurationSec);
                    }}
                  >
                    {coloredWords.map(word => {
                      const leftPercent = (word.startTimeSec / maxDurationSec) * 100;
                      const widthPercent = ((word.endTimeSec - word.startTimeSec) / maxDurationSec) * 100;
                      const isActive = currentTimeSec >= word.startTimeSec && currentTimeSec <= word.endTimeSec;

                      return (
                        <div
                          key={word.id}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            backgroundColor: `${word.color}22`,
                            borderColor: word.color,
                          }}
                          className={`absolute top-1.5 bottom-1.5 rounded-lg border-2 ${
                            isActive ? 'ring-2 ring-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.6)]' : ''
                          } text-[10px] font-black px-2 flex items-center justify-center text-center overflow-hidden transition-all duration-100`}
                        >
                          <span 
                            className="truncate px-1" 
                            style={{ color: word.color }}
                          >
                            {word.text}
                          </span>
                        </div>
                      );
                    })}

                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 pointer-events-none"
                      style={{ left: `${(currentTimeSec / maxDurationSec) * 100}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: RÉELS VIRAUX ANDREA */}
          {activeTab === 'reels_generator' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#0c081c]">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Moteur de Viralité Andrea v2.5
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Andrea peut maintenant faire des reels.
                </h1>
                <p className="text-xs text-[#c4b5fd] max-w-lg mx-auto">
                  Choisissez un template ci-dessous pour charger instantanément les pistes sons, voix off et sous-titres colorés dans le studio.
                </p>
              </div>

              {/* Carrousel de Cartes Virales 3D */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {VIRAL_CARDS.map((card, idx) => {
                  const isSelected = selectedCard.id === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => handleGenerateViralReel(card)}
                      className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[230px] ${
                        isSelected
                          ? 'bg-gradient-to-b from-orange-500 to-amber-600 text-black shadow-xl ring-2 ring-white scale-102'
                          : 'bg-[#181033] hover:bg-[#23184d] border border-[#5A33FF44] text-white hover:border-orange-500/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-black text-orange-300' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        }`}>
                          {card.viewsBadge}
                        </span>
                        <span className="text-xs">
                          {idx === 0 ? '⭐' : idx === 1 ? '📈' : idx === 2 ? '🔥' : '⚡'}
                        </span>
                      </div>

                      <div className="space-y-1 my-auto">
                        <div className={`text-sm font-black uppercase leading-tight ${isSelected ? 'text-black' : 'text-white'}`}>
                          {card.title}
                        </div>
                        <div className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-black/80' : 'text-[#c4b5fd]'}`}>
                          {card.subtitle}
                        </div>
                      </div>

                      <div className={`p-1.5 rounded-lg text-[9px] font-mono truncate ${
                        isSelected ? 'bg-black/20 text-black' : 'bg-black/40 text-orange-300'
                      }`}>
                        {card.soundCue}
                      </div>

                      <div className="pt-2 border-t border-black/10 flex items-center justify-between">
                        <div className={`flex items-center gap-1 text-[11px] font-bold ${isSelected ? 'text-black' : 'text-zinc-400'}`}>
                          <Play className={`w-3 h-3 ${isSelected ? 'fill-black' : 'fill-zinc-400'}`} />
                          <span>{card.playCount.toLocaleString()}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold ${isSelected ? 'text-black underline' : 'text-purple-300'}`}>
                          Charger →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="p-5 rounded-2xl bg-[#140e30] border border-[#5A33FF44] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      Générer un Réel Personnalisé en 1 Clic
                    </h3>
                    <p className="text-xs text-[#c4b5fd]">
                      Andrea assemble le script, la voix off naturelle, les bruitages aux secondes clés et les mots colorés.
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerateViralReel(selectedCard)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Créer le Réel Viral avec Andrea</span>
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
