import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Zap
} from 'lucide-react';
import { andreaVoice } from '../utils/speech';

interface Chapter {
  id: number;
  title: string;
  badge: string;
  script: string;
}

const CHAPTERS: Chapter[] = [
  { 
    id: 0, 
    title: 'Questions / Réponses avec Andrea', 
    badge: '1. Coaching & Plan d\'Action',
    script: "Bonjour, je suis Andrea. Dites-moi ce qui vous bloque aujourd'hui, et nous construisons ensemble un plan clair en trois étapes pour avancer sans stress."
  },
  { 
    id: 1, 
    title: 'Création de Site Web en 1 prompt', 
    badge: '2. Générateur de Site Web',
    script: "Pour vos sites web, décrivez simplement votre projet en une phrase. Andrea génère un code complet, moderne et prêt pour Vercel."
  },
  { 
    id: 2, 
    title: 'Montage Vidéo & Formats Courts', 
    badge: '3. Studio de Montage & Rétention',
    script: "Pour vos vidéos, le studio prépare vos accroches percutantes et vos sous-titres au format vertical en quelques clics."
  },
  { 
    id: 3, 
    title: 'Signature Andrea & BehaviorLab AI', 
    badge: '4. Signature Officielle',
    script: "Andrea, propulsée par BehaviorLab I.A. L'intelligence stratégique qui concrétise vos projets sans friction."
  }
];

export const AndreaShowcaseVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [chapterProgress, setChapterProgress] = useState(0); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const postSpeechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);

  const clearTimers = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (postSpeechTimerRef.current) {
      clearTimeout(postSpeechTimerRef.current);
      postSpeechTimerRef.current = null;
    }
  };

  // Passage propre au chapitre suivant (uniquement après la fin complète de la parole)
  const advanceToNextChapter = useCallback((currentIndex: number) => {
    if (currentIndex < CHAPTERS.length - 1) {
      const nextIndex = currentIndex + 1;
      setActiveChapterIndex(nextIndex);
      setChapterProgress(0);
      playChapter(nextIndex);
    } else {
      // Fin de la vidéo complète
      setIsPlaying(false);
      setChapterProgress(1);
      andreaVoice.stop();
    }
  }, []);

  // Déroulement d'un chapitre sans coupure de voix
  const playChapter = useCallback((index: number) => {
    clearTimers();
    isTransitioningRef.current = false;
    setChapterProgress(0);

    const currentChapter = CHAPTERS[index];
    const estimatedDurationMs = isMuted ? 8000 : 9000;
    const intervalMs = 100;
    const step = intervalMs / estimatedDurationMs;

    // Progression visuelle fluide
    progressTimerRef.current = setInterval(() => {
      setChapterProgress(prev => {
        if (prev >= 0.95 && andreaVoice.isSpeaking()) {
          // Attendre que la voix termine naturellement
          return 0.95;
        }
        const next = prev + step;
        return next > 0.98 ? 0.98 : next;
      });
    }, intervalMs);

    if (!isMuted) {
      andreaVoice.speak(currentChapter.script, () => {
        // La voix s'est terminée naturellement à la dernière syllabe
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setChapterProgress(1);

        // Pause de respiration visuelle de 2.2 secondes avant la scène suivante
        postSpeechTimerRef.current = setTimeout(() => {
          advanceToNextChapter(index);
        }, 2200);
      });
    } else {
      // En mode muet, attendre 8 secondes puis passer au chapitre suivant
      postSpeechTimerRef.current = setTimeout(() => {
        setChapterProgress(1);
        advanceToNextChapter(index);
      }, 8000);
    }
  }, [isMuted, advanceToNextChapter]);

  // Démarrer ou stopper la vidéo
  const handleTogglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      if (activeChapterIndex >= CHAPTERS.length - 1 && chapterProgress >= 1) {
        setActiveChapterIndex(0);
        setChapterProgress(0);
        playChapter(0);
      } else {
        playChapter(activeChapterIndex);
      }
    } else {
      setIsPlaying(false);
      clearTimers();
      andreaVoice.stop();
    }
  };

  const handleRestart = () => {
    clearTimers();
    andreaVoice.stop();
    setActiveChapterIndex(0);
    setChapterProgress(0);
    setIsPlaying(true);
    playChapter(0);
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      andreaVoice.stop();
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (isPlaying) {
        playChapter(activeChapterIndex);
      }
    }
  };

  const handleSeekChapter = (index: number) => {
    clearTimers();
    andreaVoice.stop();
    setActiveChapterIndex(index);
    setChapterProgress(0);
    if (isPlaying) {
      playChapter(index);
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

  useEffect(() => {
    return () => {
      clearTimers();
      andreaVoice.stop();
    };
  }, []);

  // Calcul du pourcentage global de la vidéo
  const totalPercentage = ((activeChapterIndex + chapterProgress) / CHAPTERS.length) * 100;

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
            Chapitre {activeChapterIndex + 1} / {CHAPTERS.length}
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
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between transition-opacity duration-700 ease-in-out">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold shadow">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Coaching & Questions-Réponses en Direct</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                ● Andrea active
              </span>
            </div>

            <div className="space-y-3 max-w-xl mx-auto w-full my-auto">
              <div className="p-3.5 rounded-2xl bg-[#231a4a] border border-[#5A33FF44] text-white text-xs sm:text-sm font-medium shadow-lg ml-auto max-w-md">
                <div className="text-[10px] text-purple-300 font-bold mb-1">👤 Vous</div>
                « Je n'arrive pas à avancer sur mon projet, je passe des heures à douter et je me décourage. »
              </div>

              {chapterProgress > 0.15 && (
                <div className="p-4 rounded-2xl bg-[#171033] border-2 border-[#8B70FF] text-white text-xs sm:text-sm shadow-2xl mr-auto max-w-lg space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1.5">
                      <span>🧠 Andrea (BehaviorLab AI)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      Méthode 3 Étapes
                    </span>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">
                    Ce blocage est une <strong>surcharge cognitive</strong>, pas un manque de compétence. Voici votre plan d'action immédiat :
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
              Andrea adapte ses réponses selon votre profil : créateur, étudiant ou indépendant.
            </div>
          </div>
        )}

        {/* SCENE 1: CRÉATION DE SITE WEB */}
        {activeChapterIndex === 1 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between transition-opacity duration-700 ease-in-out">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold shadow">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Création de Site Web en 1 Prompt</span>
              </span>
              <span className="text-[10px] font-mono text-purple-300 font-bold bg-[#1b143c] px-2.5 py-1 rounded-lg border border-purple-500/30">
                ⚡ Moteur Rapide : 10M tokens
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full my-auto items-center">
              <div className="bg-[#150f2e] border border-[#5A33FF55] p-3.5 rounded-2xl space-y-2 shadow-xl">
                <div className="text-[10px] font-bold text-[#8B70FF] uppercase tracking-wider">Votre Prompt</div>
                <div className="text-xs text-white font-mono bg-[#0c081f] p-2.5 rounded-xl border border-white/10">
                  « Crée une landing page sombre avec présentation, tarifs et code HTML5 prêt pour Vercel »
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Code complet généré en 0.8s</span>
                </div>
              </div>

              <div className="bg-[#0b0819] border-2 border-cyan-500/60 rounded-2xl p-3 shadow-2xl space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-zinc-400 font-mono ml-2">andrea-projet.vercel.app</span>
                </div>
                <div className="p-3 bg-gradient-to-br from-[#1E1B8C]/40 to-purple-900/40 rounded-xl border border-purple-500/30 text-center space-y-1.5">
                  <div className="text-xs font-black text-white">Votre Site Web · Moderne</div>
                  <div className="text-[10px] text-purple-200">Généré et prêt au déploiement</div>
                  <div className="inline-block px-3 py-1 bg-[#5A33FF] text-white text-[9px] font-bold rounded-lg shadow mt-1">
                    Export HTML & CSS
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-cyan-300/80 font-medium">
              Code sémantique propre, 100% responsive et immédiatement téléchargeable.
            </div>
          </div>
        )}

        {/* SCENE 2: MONTAGE VIDÉO & FORMATS COURTS */}
        {activeChapterIndex === 2 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-between transition-opacity duration-700 ease-in-out">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/80 border border-pink-500/40 text-pink-300 text-xs font-bold shadow">
                <Film className="w-3.5 h-3.5 text-pink-400" />
                <span>3. Studio de Montage & Formats Courts (9:16)</span>
              </span>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                Hooks & Rétention Max
              </span>
            </div>

            <div className="flex items-center justify-center gap-6 my-auto">
              <div className="w-36 h-56 rounded-2xl bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 border-2 border-pink-500 p-2.5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
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
                    Appel à l'Action
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-left hidden sm:block">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Cadres pré-calibrés 9:16</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-pink-400" />
                  <span>Accroches psychologiques pour captiver</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Export haute fidélité pour vos réseaux</span>
                </div>
              </div>
            </div>

            <div className="text-center text-[11px] text-pink-300/80 font-medium">
              Conçu pour tous vos formats verticaux et vos réseaux sociaux sans complexité.
            </div>
          </div>
        )}

        {/* SCENE 3: SIGNATURE OFFICIELLE AVEC LOGO ANDREA & BEHAVIORLAB AI */}
        {activeChapterIndex === 3 && (
          <div className="w-full h-full p-4 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 transition-opacity duration-700 ease-in-out">
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B70FF] rounded-3xl blur-2xl opacity-50" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#140e2d] border-2 border-[#8B70FF] p-2 shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo_bea.png" 
                  alt="Logo Officiel Andrea" 
                  className="w-full h-full object-contain drop-shadow"
                  onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Andrea
              </h2>
              <div className="text-xs sm:text-sm font-extrabold tracking-widest text-[#a855f7] uppercase">
                Intelligence Stratégique & Créative
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b143c] border border-[#5A33FF66] shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-[#c4b5fd]">
                Architecture conçue par <strong className="text-white">BehaviorLab AI</strong>
              </span>
            </div>

            <p className="text-xs text-[#a89cff] max-w-md mx-auto leading-relaxed pt-1">
              Prêt à passer à l'action ? Créez votre compte ci-dessus pour accéder immédiatement à tous vos outils.
            </p>
          </div>
        )}

        {/* Play Overlay if paused */}
        {!isPlaying && (
          <div 
            onClick={handleTogglePlay}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer group transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#1E1B8C] to-[#8B70FF] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform border border-white/30">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <div className="text-white font-extrabold text-sm sm:text-base mt-3 tracking-wide drop-shadow">
              Lancer la démonstration complète avec Andrea
            </div>
            <div className="text-[11px] text-[#c4b5fd] mt-1">
              Questions-réponses · Création de site · Montage vidéo · Signature officielle
            </div>
          </div>
        )}
      </div>

      {/* Video Control Bottom Bar (Uniquement commandes du lecteur, zéro bouton superflu) */}
      <div className="bg-[#120c2c] px-4 py-3 border-t border-[#5A33FF33] space-y-2">
        {/* Scrubber / Progress Bar globale */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            const targetChapter = Math.min(CHAPTERS.length - 1, Math.floor(clickPos * CHAPTERS.length));
            handleSeekChapter(targetChapter);
          }}
          className="relative w-full h-2 bg-[#1b143c] rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
          title="Naviguer dans la vidéo"
        >
          <div 
            className="h-full bg-gradient-to-r from-[#1E1B8C] via-[#8B70FF] to-pink-500 rounded-full transition-all duration-150"
            style={{ width: `${Math.min(100, Math.max(0, totalPercentage))}%` }}
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
