import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  Film, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { andreaVoice } from '../utils/speech';

interface Chapter {
  id: number;
  title: string;
  duration: number; // in seconds
  icon: string;
}

const CHAPTERS: Chapter[] = [
  { id: 0, title: 'Questions / Réponses avec Andrea', duration: 10, icon: '💬' },
  { id: 1, title: 'Création de Site Web en 1 prompt', duration: 10, icon: '🌐' },
  { id: 2, title: 'Montage Vidéo & Formats Courts', duration: 10, icon: '🎬' },
  { id: 3, title: 'Signature Andrea & BehaviorLab AI', duration: 8, icon: '🧠' }
];

const TOTAL_DURATION = CHAPTERS.reduce((acc, c) => acc + c.duration, 0); // 38s

const NARRATION_SCRIPTS = [
  "Bienvenue dans l'univers Andrea. Posez votre blocage, Andrea vous répond immédiatement avec une analyse comportementale et un plan d'action sans dispersion.",
  "Besoin d'un site web ? Décrivez simplement votre projet. Andrea génère instantanément une page complète, responsive et prête pour Vercel.",
  "Pour vos vidéos, le studio de montage intégré calibre vos accroches, sous-titres et formats courts en quelques clics.",
  "Andrea, propulsée par l'architecture BehaviorLab AI. L'intelligence stratégique qui transforme vos ambitions en résultats réels."
];

export const AndreaShowcaseVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.2;
          if (next >= TOTAL_DURATION) {
            setIsPlaying(false);
            andreaVoice.stop();
            return TOTAL_DURATION;
          }
          return next;
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Determine current chapter
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      accumulated += CHAPTERS[i].duration;
      if (currentTime <= accumulated) {
        if (activeChapterIndex !== i) {
          setActiveChapterIndex(i);
          // Narrate chapter transition if sound is enabled
          if (isPlaying && !isMuted) {
            andreaVoice.speak(NARRATION_SCRIPTS[i]);
          }
        }
        break;
      }
    }
  }, [currentTime, isPlaying, isMuted, activeChapterIndex]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      if (currentTime >= TOTAL_DURATION) {
        setCurrentTime(0);
        setActiveChapterIndex(0);
      }
      setIsPlaying(true);
      if (!isMuted) {
        andreaVoice.speak(NARRATION_SCRIPTS[activeChapterIndex]);
      }
    } else {
      setIsPlaying(false);
      andreaVoice.stop();
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    let accumulated = 0;
    for (let i = 0; i < CHAPTERS.length; i++) {
      accumulated += CHAPTERS[i].duration;
      if (newTime <= accumulated) {
        setActiveChapterIndex(i);
        if (isPlaying && !isMuted) {
          andreaVoice.speak(NARRATION_SCRIPTS[i]);
        }
        break;
      }
    }
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      andreaVoice.stop();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (isPlaying) {
        andreaVoice.speak(NARRATION_SCRIPTS[activeChapterIndex]);
      }
    }
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setActiveChapterIndex(0);
    setIsPlaying(true);
    if (!isMuted) {
      andreaVoice.speak(NARRATION_SCRIPTS[0]);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Chapter 0 progress (0 to 1)
  const getChapterProgress = () => {
    let startOfChapter = 0;
    for (let i = 0; i < activeChapterIndex; i++) {
      startOfChapter += CHAPTERS[i].duration;
    }
    const elapsed = currentTime - startOfChapter;
    return Math.min(1, Math.max(0, elapsed / CHAPTERS[activeChapterIndex].duration));
  };

  const chProg = getChapterProgress();

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden border-2 border-[#5A33FF66] bg-[#0c081e] shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full max-w-4xl mx-auto'
      }`}
    >
      {/* Top Header Badge */}
      <div className="bg-[#120c2c] px-4 py-2.5 border-b border-[#5A33FF33] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-black text-white tracking-wide uppercase">
            Vidéo Démonstration Officielle · Andrea
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hidden sm:inline">
            BehaviorLab AI
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#c4b5fd] font-mono">
            {Math.floor(currentTime)}s / {TOTAL_DURATION}s
          </span>
        </div>
      </div>

      {/* Main Video Screen Area (16:9 ratio) */}
      <div className="relative aspect-video w-full bg-[#080517] overflow-hidden flex items-center justify-center select-none">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-radial from-purple-900/30 via-transparent to-black pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* SCENE 0: QUESTIONS / RÉPONSES AVEC ANDREA */}
        {activeChapterIndex === 0 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
            {/* Top Scene Tag */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold shadow">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Coaching & Questions-Réponses en Direct</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                ● Andrea active
              </span>
            </div>

            {/* Simulated Live Chat Bubbles */}
            <div className="space-y-3 max-w-xl mx-auto w-full my-auto">
              {/* User Question */}
              <div className="p-3.5 rounded-2xl bg-[#231a4a] border border-[#5A33FF44] text-white text-xs sm:text-sm font-medium shadow-lg ml-auto max-w-md animate-in slide-in-from-bottom-2">
                <div className="text-[10px] text-purple-300 font-bold mb-1">👤 Vous</div>
                « Je n'arrive pas à avancer sur mon projet, je passe 5 heures à douter et je me décourage. »
              </div>

              {/* Andrea Live Response */}
              {chProg > 0.25 && (
                <div className="p-4 rounded-2xl bg-[#171033] border-2 border-[#8B70FF] text-white text-xs sm:text-sm shadow-2xl mr-auto max-w-lg space-y-2 animate-in slide-in-from-left-3 duration-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1.5">
                      <span>🧠 Andrea (BehaviorLab AI)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Méthode 3 Étapes
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">
                    Ce blocage est une <strong>surcharge cognitive</strong>, pas un manque de compétence. Voici ton plan immédiat :
                  </p>
                  <div className="text-xs bg-[#0f0a24] p-2.5 rounded-xl border border-purple-500/30 space-y-1 font-mono text-[#c4b5fd]">
                    <div>✓ Étape 1 : 1 idée directrice unique (Zéro dispersion)</div>
                    <div>✓ Étape 2 : 15 minutes chrono sans retoucher</div>
                    <div>✓ Étape 3 : Validation immédiate avec Andrea</div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-purple-300/80 font-medium">
              Andrea adapte ses conseils selon votre profil : créateur, étudiant ou indépendant.
            </div>
          </div>
        )}

        {/* SCENE 1: CRÉATION DE SITE WEB (MOTEUR BOLT) */}
        {activeChapterIndex === 1 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold shadow">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Création de Site Web en 1 Prompt (Moteur Bolt)</span>
              </span>
              <span className="text-[10px] font-mono text-purple-300 font-bold bg-[#1b143c] px-2.5 py-1 rounded-lg border border-purple-500/30">
                ⚡ Quota Bolt : 10M tokens
              </span>
            </div>

            {/* Split Screen : Prompt & Site Generated Live */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full my-auto items-center">
              {/* Prompt box */}
              <div className="bg-[#150f2e] border border-[#5A33FF55] p-3.5 rounded-2xl space-y-2 shadow-xl">
                <div className="text-[10px] font-bold text-[#8B70FF] uppercase tracking-wider">Prompt Utilisateur</div>
                <div className="text-xs text-white font-mono bg-[#0c081f] p-2.5 rounded-xl border border-white/10">
                  « Crée une landing page SaaS sombre avec pricing interactif et code HTML5 prêt pour Vercel »
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Compilation terminée en 0.8s</span>
                </div>
              </div>

              {/* Generated Mini Site Mockup */}
              <div className="bg-[#0b0819] border-2 border-cyan-500/60 rounded-2xl p-3 shadow-2xl space-y-2 relative overflow-hidden group">
                <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-zinc-400 font-mono ml-2">nexus-saas.vercel.app</span>
                </div>
                <div className="p-3 bg-gradient-to-br from-[#1E1B8C]/40 to-purple-900/40 rounded-xl border border-purple-500/30 text-center space-y-1.5">
                  <div className="text-xs font-black text-white">NexusAI · SaaS Moderne</div>
                  <div className="text-[10px] text-purple-200">Généré et exportable en 1 clic</div>
                  <div className="inline-block px-3 py-1 bg-[#5A33FF] text-white text-[9px] font-bold rounded-lg shadow mt-1">
                    Export HTML & CSS
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-cyan-300/80 font-medium">
              Code sémantique pur, 100% responsive et téléchargeable sans engagement.
            </div>
          </div>
        )}

        {/* SCENE 2: MONTAGE VIDÉO & FORMATS COURTS */}
        {activeChapterIndex === 2 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-bold shadow">
                <Film className="w-3.5 h-3.5 text-pink-400" />
                <span>3. Studio de Montage & Formats Courts (9:16)</span>
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                Hooks & Rétention Max
              </span>
            </div>

            {/* Mobile Vertical Frame Preview */}
            <div className="flex items-center justify-center gap-6 my-auto">
              <div className="w-36 h-56 rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 border-2 border-pink-500 p-2.5 flex flex-col justify-between shadow-2xl relative overflow-hidden animate-pulse">
                <div className="text-center">
                  <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-black">
                    HOOK VIRAL (0-3s)
                  </span>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-[11px] font-black text-white leading-tight uppercase drop-shadow-md">
                    Arrêtez cette erreur en 2026 !
                  </div>
                  <div className="text-[8px] text-amber-300 bg-black/60 px-1 py-0.5 rounded font-mono">
                    Sous-titres dynamiques
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[8px] font-bold text-white bg-purple-600 px-2 py-0.5 rounded-lg shadow">
                    CTA Engageant
                  </span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2 text-left hidden sm:block">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Templates pré-calibrés 9:16</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-pink-400" />
                  <span>Accroches virales et psychologiques</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Export haute définition sans filigrane</span>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-pink-300/80 font-medium">
              Conçu pour TikTok, Reels et Shorts sans complexité technique.
            </div>
          </div>
        )}

        {/* SCENE 3: OUTRO OFFICIEL AVEC LOGO ANDREA & BEHAVIORLAB AI */}
        {activeChapterIndex === 3 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-700">
            {/* Grand Logo Officiel avec Halo Lumineux */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B70FF] rounded-3xl blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#140e2d] border-2 border-[#8B70FF] p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo_bea.png" 
                  alt="Logo Officiel Andrea" 
                  className="w-full h-full object-contain drop-shadow"
                  onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
                />
              </div>
            </div>

            {/* Brand Title */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Andrea
              </h2>
              <div className="text-xs sm:text-sm font-extrabold tracking-widest text-[#a855f7] uppercase">
                Intelligence Stratégique & Créative
              </div>
            </div>

            {/* Signature BehaviorLab AI */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b143c] border border-[#5A33FF66] shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-[#c4b5fd]">
                Architecture conçue par <strong className="text-white">BehaviorLab AI</strong>
              </span>
            </div>

            <p className="text-xs text-[#a89cff] max-w-md mx-auto leading-relaxed pt-1">
              Prêt à passer à l'action ? Créez votre compte en 10 secondes ci-contre pour accéder à tous vos outils.
            </p>
          </div>
        )}

        {/* Play Overlay if paused */}
        {!isPlaying && (
          <div 
            onClick={handleTogglePlay}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#1E1B8C] to-[#8B70FF] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform border border-white/30">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <div className="text-white font-extrabold text-sm sm:text-base mt-3 tracking-wide drop-shadow">
              Lancer la démonstration complète avec Andrea
            </div>
            <div className="text-[11px] text-[#c4b5fd] mt-1">
              Questions-réponses · Création de site · Montage vidéo · Logo officiel
            </div>
          </div>
        )}
      </div>

      {/* Chapters Bar (Direct Jump) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-[#0e0924] border-t border-[#5A33FF33] text-xs">
        {CHAPTERS.map((ch, idx) => {
          const isActive = activeChapterIndex === idx;
          let chapterStart = 0;
          for (let i = 0; i < idx; i++) chapterStart += CHAPTERS[i].duration;

          return (
            <button
              key={ch.id}
              onClick={() => handleSeek(chapterStart)}
              className={`p-2 rounded-xl text-left transition flex items-center gap-2 ${
                isActive 
                  ? 'bg-[#231a4a] text-white border border-[#8B70FF] shadow' 
                  : 'text-[#c4b5fd]/80 hover:bg-[#181135] hover:text-white'
              }`}
            >
              <span className="text-base shrink-0">{ch.icon}</span>
              <div className="truncate">
                <div className="font-bold text-[11px] truncate">{ch.title}</div>
                <div className="text-[9px] text-[#a89cff]/70 font-mono">{ch.duration}s</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Video Control Bottom Bar */}
      <div className="bg-[#120c2c] px-4 py-3 border-t border-[#5A33FF33] space-y-2">
        {/* Scrubber / Progress Bar */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            handleSeek(clickPos * TOTAL_DURATION);
          }}
          className="relative w-full h-2 bg-[#1b143c] rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
        >
          <div 
            className="h-full bg-gradient-to-r from-[#1E1B8C] via-[#8B70FF] to-pink-500 rounded-full transition-all duration-150"
            style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-xl bg-[#201844] hover:bg-[#2e2363] text-white border border-[#5A33FF44] transition shadow"
              title={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-[#201844] hover:bg-[#2e2363] text-[#c4b5fd] hover:text-white border border-[#5A33FF44] transition"
              title="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold ${
                isMuted 
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/40' 
                  : 'bg-[#201844] text-emerald-300 border-[#5A33FF44]'
              }`}
              title={isMuted ? "Activer la voix" : "Couper la voix"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? 'Voix coupée' : 'Voix Andrea Active'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#c4b5fd]">
            <span className="font-semibold hidden md:inline">
              {CHAPTERS[activeChapterIndex]?.title}
            </span>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#201844] hover:bg-[#2e2363] text-[#c4b5fd] hover:text-white border border-[#5A33FF44] transition"
              title="Plein écran"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
