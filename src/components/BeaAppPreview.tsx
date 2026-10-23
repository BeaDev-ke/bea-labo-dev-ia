import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Film, 
  Code2, 
  Globe, 
  FolderGit2, 
  Brain, 
  Palette, 
  CreditCard, 
  Send, 
  Mic, 
  Sparkles, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Download, 
  Plus, 
  Volume2,
  VolumeX,
  Flame,
  Trophy,
  Zap,
  CheckCircle2,
  Wand2,
  Check,
  Award,
  User,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ArrowUp
} from 'lucide-react';
import { ChatMessage, PageView, UserProfile, ProfileType, UseCaseType } from '../types/bea';
import { beaVoice } from '../utils/speech';
import { VisualDesignStudio } from './VisualDesignStudio';
import { SiteBuilder } from './SiteBuilder';
import { ProfileManager } from './ProfileManager';
import { SalesOffers } from './SalesOffers';
import { SecurityShield } from './SecurityShield';
import { PROFILE_METAS } from '../data/profilesData';
import { 
  inspectPromptSecurity, 
  sanitizeXSS, 
  checkRateLimit, 
  signData, 
  verifyData, 
  isHoneypotTriggered 
} from '../utils/security';

interface BeaAppPreviewProps {
  onOpenLab: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-1',
  displayName: 'Alexandre',
  email: 'saydoukebe31@gmail.com',
  profileType: 'createur',
  useCase: 'contenu',
  goal: 'Publier 1 vidéo par jour et doubler l’engagement sans bloquer sur le montage.',
  schoolCountry: 'France',
  studyLevel: 'Lycée - Première (Bac)',
  preferredStyle: 'expert',
  plan: 'pro',
  lastActive: 'À l\'instant',
  streakDays: 5,
  momentumPoints: 140,
};

export const BeaAppPreview: React.FC<BeaAppPreviewProps> = ({ onOpenLab }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [modelChoice, setModelChoice] = useState<'rapide' | 'puissant'>('rapide');
  const [showModelMenu, setShowModelMenu] = useState(false);

  const handleToggleVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La dictée vocale nécessite un navigateur compatible (ex. Chrome, Edge ou Safari).");
      return;
    }
    
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecordingVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => (prev ? prev + ' ' : '') + transcript);
        setIsRecordingVoice(false);
      };

      recognition.onerror = () => {
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
    } catch {
      setIsRecordingVoice(false);
    }
  };

  // Profile State (chargé et vérifié cryptographiquement)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('bea_user_profile_secure');
      if (stored) {
        const parsed = JSON.parse(stored);
        return verifyData<UserProfile>(parsed, DEFAULT_PROFILE);
      }
    } catch {
      // Fallback sécurisé en cas de données corrompues
    }
    return DEFAULT_PROFILE;
  });

  // Active use case mode synchronisé avec le profil utilisateur
  const useCase: UseCaseType = userProfile.useCase;
  const [showChallengeInfo, setShowChallengeInfo] = useState(false);

  // PSYCHOLOGIE & RÉTENTION SELON LES CONSIGNES EXACTES :
  // 1. Compteur de série : STRICTEMENT réservé à 'contenu' et 'scolaire'
  const hasStreak = useCase === 'contenu' || useCase === 'scolaire';

  // 2. Micro-défis : STRICTEMENT réservés à 'scolaire' (accompagnement scolaire)
  const hasDailyChallenge = useCase === 'scolaire';

  const [dailyChallengeDone, setDailyChallengeDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Messages de départ adaptés au profil
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'user',
      content: 'Je n\'arrive pas à publier tous les jours mes vidéos, je bloque sur le montage et je me décourage.',
      timestamp: '11:20',
    },
    {
      id: 'm2',
      role: 'assistant',
      content: `Tu veux être régulier dans tes publications mais la friction technique du montage transforme une intention créative en corvée décourageante.

**Problèmes possibles :**
1. **Perfectionnisme de débutant** : tu passes 3h sur des détails que personne ne remarque dans les 3 premières secondes.
2. **Charge cognitive trop lourde** : tu essaies de trouver l'idée, filmer et monter le même jour au lieu de séparer les tâches.
3. **Absence de format réutilisable (template)** : tu réinventes la roue à chaque vidéo au lieu de garder un rythme fixe.
4. **Attente du résultat immédiat** : l'absence de validation instantanée coupe ta dopamine et déclenche l'évitement.

**Leviers d'action concrets :**
1. **Règle des 80/20 du montage** : concentre 70% de ton énergie sur les 3 premières secondes (hook + sous-titre dynamique), le reste doit être sobre.
2. **Session de batching en 2 blocs** : le samedi = écriture de 5 idées en 30 min ; le dimanche = tournage des 5 vidéos d'affilée en 45 min.
3. **Format signature en 3 points** : Problème douloureux (0-3s) → Erreur fréquente (3-15s) → Solution concrète (15-45s) → CTA simple.
4. **Utilise le Studio Bea** : génère ton plan de montage et tes visuels en 1 clic pour diviser par 3 ton temps de travail.

**Plan de démarrage pour cette semaine :**
- Aujourd'hui : filme UNE seule vidéo de 30 secondes avec un format minimaliste sans coupes complexes.
- Demain : publie-la avant midi, sans la retoucher plus de 20 minutes.
- Indicateur de succès : publier 3 vidéos cette semaine, peu importe le nombre de vues.

Lequel de ces 4 blocages te ressemble le plus en ce moment ?`,
      timestamp: '11:21',
      securityShield: true,
    },
  ]);

  const [codeContent, setCodeContent] = useState(`import streamlit as st

def hello_bea():
    st.title("Bienvenue sur BehaviorLab AI")
    st.write("Analyse comportementale en temps réel avec protection active")

if __name__ == "__main__":
    hello_bea()`);

  // Arrêt de la voix au démontage
  useEffect(() => {
    return () => {
      beaVoice.stop();
    };
  }, [currentPage]);

  // Sauvegarde sécurisée du profil avec scellement d'intégrité
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      const envelope = signData(updated);
      localStorage.setItem('bea_user_profile_secure', JSON.stringify(envelope));
    } catch (e) {
      console.error('Erreur sauvegarde profil', e);
    }
  };

  const handleUseCaseSwitch = (newUseCase: UseCaseType) => {
    const updated: UserProfile = {
      ...userProfile,
      useCase: newUseCase,
    };
    handleUpdateProfile(updated);
  };

  const toggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      beaVoice.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      beaVoice.speak(text, () => {
        setSpeakingMsgId(null);
      });
    }
  };

  // ENVOI SÉCURISÉ AVEC TRIPLE COUCHE ANTI-PIRATAGE
  const handleSend = () => {
    // 1. Détection piége Honeypot anti-bot
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[SECURITY] Bot piégé par le Honeypot.');
      return;
    }

    if (!inputMessage.trim()) return;

    // 2. Rate limiting anti-flood
    const rateCheck = checkRateLimit('user-chat-session', 25, 60000);
    if (!rateCheck.allowed) {
      setSecurityAlert(`Ralentissez : trop de requêtes rapprochées. Réessayez dans ${rateCheck.resetInSec}s.`);
      return;
    }

    // 3. Pare-feu Prompt Injection & Sanitisation XSS
    const secInspection = inspectPromptSecurity(inputMessage);
    if (!secInspection.isSafe) {
      setSecurityAlert(`Alerte de sécurité : ${secInspection.threat}. Votre prompt a été neutralisé.`);
    } else {
      setSecurityAlert(null);
    }

    const cleanInput = secInspection.sanitized;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: cleanInput,
      timestamp: 'À l\'instant',
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputMessage('');
    
    // Gain de points momentum
    setUserProfile(prev => ({
      ...prev,
      momentumPoints: prev.momentumPoints + 5,
    }));

    // Réponse structurée de Bea adaptée au profil
    setTimeout(() => {
      let promptContext = '';
      if (useCase === 'scolaire') {
        promptContext = `[Profil Scolaire - ${userProfile.schoolCountry || 'France'} - ${userProfile.studyLevel || 'Collège/Lycée'}]
Voici une méthode de révision pas-à-pas pour ancrer la notion sans surcharge cognitive.`;
      } else if (useCase === 'contenu') {
        promptContext = `[Profil Créateur de Contenu - Rétention 3 secondes]
Voici comment structurer ton hook pour captiver l'attention dès les premières secondes.`;
      } else {
        promptContext = `[Profil ${PROFILE_METAS[userProfile.profileType]?.label || 'Projets'}]
Voici ton plan d'action immédiat pour débloquer l'exécution.`;
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: `${promptContext}

**Diagnostic du blocage :**
1. **Friction de démarrage** : la première étape te semble floue ou trop intimidante.
2. **Ambiguïté sur la priorité n°1** : trop d'options dispersent ton focus.
3. **Absence de délai court** : une tâche sans limite de temps s'étire indéfiniment (Loi de Parkinson).

**Leviers d'action concrets :**
1. **Micro-action de 2 minutes** : commence par la plus petite unité possible (1 ligne ou 1 formule).
2. **Suppression des distractions** : bloque les notifications pendant 25 minutes chrono.
3. **Mesure du progrès** : note 1 avancée visible chaque soir.

**Plan de démarrage :**
- Action 1 : Choisir la tâche la plus importante.
- Action 2 : La faire pendant 20 minutes chrono.
- Action 3 : Cocher la case et passer à la suite.`,
        timestamp: 'À l\'instant',
        securityShield: true,
      };
      setMessages([...newMsgs, assistantMsg]);
    }, 700);
  };

  const completeDailyChallenge = () => {
    if (dailyChallengeDone) return;
    setDailyChallengeDone(true);
    setUserProfile(prev => ({
      ...prev,
      momentumPoints: prev.momentumPoints + 25,
      streakDays: prev.streakDays + 1,
    }));
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  return (
    <div className="bg-[#0f0a1e] border-2 border-[#7c3aed] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[780px]">
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full md:w-64 bg-[#0d0d14] border-r-2 border-[#7c3aed] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Logo & Identity */}
          <div className="text-center pt-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#7c3aed] to-[#db2777] flex items-center justify-center text-2xl shadow-lg shadow-purple-900/40">
              🧠
            </div>
            <div className="font-extrabold text-lg text-[#f5f3ff] mt-2 tracking-tight">Bea</div>
            <div className="text-[10px] font-bold text-[#c4b5fd] tracking-widest uppercase">BehaviorLab AI</div>
          </div>

          {/* ACTIVE USER PROFILE CHIP (Cliquez pour éditer) */}
          <button
            onClick={() => setCurrentPage('profil')}
            className="w-full bg-[#181135] hover:bg-[#231a4a] border border-[#7c3aed]/50 p-2.5 rounded-2xl text-left transition flex items-center justify-between shadow-inner"
            title="Gérer et réparer votre profil utilisateur"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xl shrink-0">{PROFILE_METAS[userProfile.profileType]?.icon || '👤'}</span>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{userProfile.displayName}</div>
                <div className="text-[10px] text-[#c4b5fd] truncate">{PROFILE_METAS[userProfile.profileType]?.label}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 shrink-0">
              Éditer
            </span>
          </button>

          {/* MODE SELECTOR */}
          <div className="bg-[#15112a] border border-[#7c3aed]/40 rounded-xl p-1.5 space-y-1 text-xs">
            <span className="text-[10px] text-[#a78bfa] font-bold block px-1">Cas d'usage actif :</span>
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: 'scolaire', label: '🎓 Scolaire', hint: 'Défis + Série' },
                { id: 'contenu', label: '🎬 Contenu', hint: 'Série active' },
                { id: 'clients', label: '💼 Clients', hint: 'Sans streak' },
                { id: 'general', label: '✨ Général', hint: 'Sans streak' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => handleUseCaseSwitch(m.id as any)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition text-left ${
                    useCase === m.id
                      ? 'bg-[#7c3aed] text-white shadow-sm'
                      : 'text-[#c4b5fd] hover:bg-[#231a4a]'
                  }`}
                >
                  <div className="font-bold">{m.label}</div>
                  <div className="text-[9px] opacity-75">{m.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* COMPTEUR DE SÉRIE : STRICTEMENT POUR 'scolaire' et 'contenu' */}
          {hasStreak && (
            <div className="bg-gradient-to-br from-[#1e143b] to-[#140e2b] border border-[#7c3aed]/50 rounded-2xl p-3 space-y-2 shadow-inner animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>
                    {useCase === 'scolaire' ? `Série révisions : ${userProfile.streakDays}j` : `Série publications : ${userProfile.streakDays}j`}
                  </span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {userProfile.momentumPoints} pts
                </span>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#c4b5fd] mb-1">
                  <span>{useCase === 'scolaire' ? 'Objectif régularité' : 'Rythme créateur'}</span>
                  <span>80% atteint</span>
                </div>
                <div className="w-full h-1.5 bg-[#0a0718] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] rounded-full transition-all duration-500 w-[80%]" />
                </div>
              </div>
            </div>
          )}

          {/* New Chat Button */}
          <button
            onClick={() => {
              setMessages([]);
              setCurrentPage('chat');
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#15112a] hover:bg-[#231a4a] border-2 border-[#7c3aed] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            Nouvelle discussion
          </button>

          {/* Navigation Menu */}
          <div className="space-y-1">
            {[
              { id: 'chat', label: '💬 Discussion avec Bea', icon: MessageSquare },
              { id: 'profil', label: '👤 Mon Profil & Rôle', icon: User, badge: 'Réparé' },
              { id: 'compte', label: '💎 Offres & Abonnements', icon: CreditCard, badge: 'Pro' },
              { id: 'studio', label: '🎨 Studio de Design Visuel', icon: Film },
              { id: 'app', label: '🌐 Site Web en 1 Prompt', icon: Globe },
              { id: 'code', label: '💻 Code & Débogage', icon: Code2 },
              { id: 'securite', label: '🛡️ Bouclier Anti-Piratage', icon: ShieldCheck, badge: 'Actif' },
              { id: 'memoire', label: '🧠 Mémoire de Bea', icon: Brain },
            ].map(item => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as PageView)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                    active
                      ? 'bg-[#231a4a] text-white border border-[#a855f7] shadow-sm'
                      : 'text-[#e2d6ff] hover:bg-[#15112a] hover:text-white'
                  }`}
                >
                  <span className="truncate pr-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                  {active && !item.badge && <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dev Lab Launcher from Inside Bea */}
        <div className="pt-4 border-t border-[#7c3aed]/30 space-y-2">
          <div className="text-[10px] font-extrabold text-[#a855f7] tracking-wider uppercase">
            PORTAIL DÉVELOPPEUR
          </div>
          <button
            onClick={onOpenLab}
            className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 border border-[#7c3aed] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-300" />
            🧪 Ouvrir le Labo Dev IA
          </button>
          <div className="text-[10px] text-[#8a7ab8] text-center">{userProfile.email}</div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-[#0f0a1e] overflow-hidden">
        {/* TOP NAVIGATION BAR - MENUS ALIGNÉS À DROITE SANS COULEURS FLASHY */}
        <div className="bg-[#18181b] px-4 py-2 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">Bea</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              BehaviorLab AI
            </span>
          </div>

          {/* Menus alignés à droite */}
          <div className="flex items-center gap-1.5 overflow-x-auto ml-auto justify-end">
            {[
              { id: 'chat', label: '💬 Discussion' },
              { id: 'studio', label: '🎨 Studio Visuel' },
              { id: 'app', label: '🌐 Site Web' },
              { id: 'code', label: '💻 Code' },
              { id: 'profil', label: '👤 Profil' },
              { id: 'compte', label: '💎 Offres' },
              { id: 'securite', label: '🛡️ Sécurité' },
              { id: 'memoire', label: '🧠 Mémoire' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id as PageView)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  currentPage === tab.id
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              onClick={onOpenLab}
              className="ml-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-medium whitespace-nowrap shadow-sm flex items-center gap-1.5 transition"
            >
              <Wand2 className="w-3.5 h-3.5 text-zinc-300" />
              <span>🧪 Labo Dev</span>
            </button>
          </div>
        </div>

        {/* TOP MOMENTUM & PSYCHOLOGY BAR */}
        <div className="bg-[#140e2b] px-4 py-2.5 border-b border-[#7c3aed]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {useCase === 'scolaire' ? 'Mode : Accompagnement Scolaire' : 
                 (useCase === 'contenu' ? 'Mode : Stratégie Contenu' : 
                 (useCase === 'clients' ? 'Mode : Analyse Clients' : 'Mode : Projets & Habitudes'))}
              </span>
            </span>

            {/* Compteur de série : seulement si hasStreak (contenu ou scolaire) */}
            {hasStreak && (
              <>
                <span className="text-[#8a7ab8]">·</span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  Série : {userProfile.streakDays} jours consécutifs
                </span>
              </>
            )}

            <span className="text-[#8a7ab8]">·</span>
            <span className="text-[#c4b5fd] hidden sm:inline">
              Effet de progression : <strong>+18% de passage à l'action</strong>
            </span>
          </div>

          {/* MICRO-DÉFI INTERACTIF DU JOUR : STRICTEMENT ET UNIQUEMENT DANS ACCOMPAGNEMENT SCOLAIRE */}
          {hasDailyChallenge && (
            <div className="flex items-center gap-2 animate-in fade-in">
              <button
                onClick={() => setShowChallengeInfo(!showChallengeInfo)}
                className="px-2 py-1 rounded-full bg-[#1a1535] hover:bg-[#231a4a] border border-[#7c3aed]/60 text-[#c4b5fd] text-[11px] font-bold transition flex items-center gap-1"
                title="Comprendre le fonctionnement du micro-défi scolaire"
              >
                <span>C'est quoi ce défi ?</span>
              </button>

              <button
                onClick={completeDailyChallenge}
                disabled={dailyChallengeDone}
                className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow ${
                  dailyChallengeDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400 animate-pulse'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                {dailyChallengeDone ? '✓ Défi Révision validé (+25 pts)' : '🎯 Micro-Défi 3 min : Relire 1 formule clé'}
              </button>
            </div>
          )}
        </div>

        {/* CALLOUT EXPLICATION MICRO-DÉFI (STRICTEMENT SCOLAIRE SANS DUPLICATION) */}
        {hasDailyChallenge && showChallengeInfo && (
          <div className="bg-[#1f153d] border-b-2 border-purple-500 p-4 text-xs text-purple-100 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between font-bold text-white text-sm">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-300" />
                C'est quoi le bouton Micro-Défi Scolaire ?
              </span>
              <button 
                onClick={() => setShowChallengeInfo(false)}
                className="text-xs text-[#c4b5fd] hover:text-white underline"
              >
                Fermer
              </button>
            </div>
            <p className="leading-relaxed text-[#d8ccff]">
              Le <strong>Micro-Défi Scolaire</strong> est une méthode issue des sciences cognitives pour <strong>vaincre la procrastination des devoirs et révisions</strong> (technique des micro-engagements de 2 à 3 minutes).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="bg-[#15112a] p-2.5 rounded-xl border border-purple-500/30">
                <strong className="text-amber-300 block mb-0.5">1. Pourquoi ?</strong>
                Réviser tout un chapitre bloque le cerveau. Relire 1 formule ou 1 définition ne génère aucun stress.
              </div>
              <div className="bg-[#15112a] p-2.5 rounded-xl border border-purple-500/30">
                <strong className="text-cyan-300 block mb-0.5">2. Comment ?</strong>
                Prenez 2 minutes pour relire une notion clé de votre cours, puis cliquez sur le bouton.
              </div>
              <div className="bg-[#15112a] p-2.5 rounded-xl border border-purple-500/30">
                <strong className="text-emerald-300 block mb-0.5">3. Résultat :</strong>
                Une micro-victoire enregistrée (+25 pts) qui enclenche l'élan pour démarrer vos devoirs facilement !
              </div>
            </div>
          </div>
        )}

        {/* MICRO-CELEBRATION TOAST */}
        {showCelebration && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 text-center text-xs font-bold shadow-lg animate-in slide-in-from-top flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Félicitations ! Micro-défi validé (+25 pts). Votre élan de révision est lancé !</span>
          </div>
        )}

        {/* SECURITY ALERT BANNER */}
        {securityAlert && (
          <div className="bg-rose-950/80 border-b border-rose-500 p-2.5 text-xs text-rose-200 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{securityAlert}</span>
            </div>
            <button
              onClick={() => setSecurityAlert(null)}
              className="text-xs text-rose-300 hover:text-white underline font-bold"
            >
              Fermer
            </button>
          </div>
        )}

        {/* 1. CHAT VIEW */}
        {currentPage === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#7c3aed]/30 flex items-center justify-between bg-[#15112a]">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>💬 Discussion avec Bea</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Voix 100% Gratuite Active
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hidden sm:inline-flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    Bouclier Anti-Piratage
                  </span>
                </h2>
                <p className="text-xs text-[#c4b5fd]">
                  Profil actif : <strong>{PROFILE_METAS[userProfile.profileType]?.label}</strong> · {userProfile.displayName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('profil')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1b143a] border border-[#7c3aed]/60 text-[11px] font-bold text-purple-200 hover:bg-[#291b52] transition flex items-center gap-1"
                >
                  <User className="w-3 h-3 text-purple-400" />
                  Changer de profil
                </button>
                <button
                  onClick={onOpenLab}
                  className="px-2.5 py-1.5 rounded-lg bg-[#231a4a] border border-[#7c3aed] text-[11px] font-bold text-purple-200 hover:bg-[#322369] transition flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3 text-purple-400" />
                  Modifier cette page dans le Labo
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border-2 ${
                    msg.role === 'user'
                      ? 'bg-[#15112a] border-[#7c3aed]/50 text-white ml-auto max-w-2xl'
                      : 'bg-[#1a1535] border-[#7c3aed] text-[#f5f3ff] max-w-3xl shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#c4b5fd] flex items-center gap-1.5">
                      {msg.role === 'user' ? `👤 ${userProfile.displayName}` : '🧠 Bea (BehaviorLab AI)'}
                    </span>
                    <span className="text-[10px] text-[#8a7ab8]">{msg.timestamp}</span>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>

                  {msg.role === 'assistant' && (
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#7c3aed]/20 text-xs">
                      {/* FREE SPEECH SYNTHESIS BUTTON */}
                      <button
                        onClick={() => toggleSpeak(msg.id, msg.content)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          speakingMsgId === msg.id
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : 'bg-[#231a4a] text-purple-200 hover:bg-[#302166] border border-[#7c3aed]/60'
                        }`}
                        title="Écouter la réponse de Bea à voix haute (100% gratuit)"
                      >
                        {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{speakingMsgId === msg.id ? 'Arrêter la voix' : '🔊 Écouter Bea'}</span>
                      </button>

                      <button 
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="p-1.5 rounded-lg bg-[#15112a] hover:bg-[#231a4a] border border-[#7c3aed]/40 text-[#c4b5fd]" 
                        title="Copier le texte"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-[#15112a] hover:bg-[#231a4a] border border-[#7c3aed]/40 text-[#c4b5fd]" title="Utile">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-[#15112a] hover:bg-[#231a4a] border border-[#7c3aed]/40 text-[#c4b5fd]" title="À améliorer">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* STARTER PROMPTS ADAPTÉS AU PROFIL ACTUEL */}
            <div className="px-4 py-2 bg-[#100b24] border-t border-[#7c3aed]/20 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-[#a78bfa] shrink-0">Suggestions profil :</span>
              {PROFILE_METAS[userProfile.profileType]?.starterPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setInputMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#1b143a] hover:bg-[#2b1c5c] text-[11px] text-[#e2d6ff] border border-[#7c3aed]/40 whitespace-nowrap transition"
                >
                  {prompt.length > 45 ? prompt.slice(0, 45) + '...' : prompt}
                </button>
              ))}
            </div>

            {/* Input Bar avec Honeypot anti-bot */}
            <div className="p-4 bg-[#15112a] border-t border-[#7c3aed]/30 relative">
              {/* Invisible Honeypot field for bot trapping */}
              <input 
                type="text" 
                name="bea_anti_bot_check" 
                value={honeypot} 
                onChange={e => setHoneypot(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off" 
                style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} 
              />

              {/* ChatGPT / Claude / Gemini style Prompt Input Box */}
              <div className="bg-[#212121] border border-[#383838] hover:border-zinc-600 focus-within:border-zinc-500 rounded-[26px] p-3 shadow-lg transition-all duration-200">
                {/* Textarea area */}
                <div className="px-1.5 pt-0.5">
                  <textarea
                    rows={1}
                    value={inputMessage}
                    onChange={e => {
                      setInputMessage(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`Envoyer un message à Bea (${PROFILE_METAS[userProfile.profileType]?.label})...`}
                    className="w-full bg-transparent text-white text-[15px] placeholder-zinc-400 resize-none focus:outline-none min-h-[42px] max-h-[160px] leading-relaxed selection:bg-zinc-700"
                  />
                </div>

                {/* Action row: + tout à gauche, sélecteur de modèle à côté, micro et flèche à droite de taille strictement identique */}
                <div className="flex items-center justify-between pt-1.5 px-0.5 gap-2">
                  {/* Left group: '+' et Modèle (Rapide / Puissant) */}
                  <div className="flex items-center gap-1.5">
                    {/* '+' button */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPlusMenu(!showPlusMenu)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
                          showPlusMenu 
                            ? 'bg-zinc-700 text-white' 
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                        title="Ajouter un document ou une action rapide"
                      >
                        <Plus className={`w-4 h-4 transition-transform duration-200 ${showPlusMenu ? 'rotate-45' : ''}`} />
                      </button>

                      {showPlusMenu && (
                        <div className="absolute bottom-11 left-0 z-50 w-72 bg-[#262626] border border-zinc-700 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in slide-in-from-bottom-2">
                          <div className="text-[10px] font-semibold text-zinc-400 px-2.5 py-1 uppercase tracking-wider">
                            Ajouter à la discussion
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const fileInput = document.createElement('input');
                              fileInput.type = 'file';
                              fileInput.accept = '.txt,.md,.pdf,.csv,.py,.js,.json';
                              fileInput.onchange = (ev: any) => {
                                const file = ev.target?.files?.[0];
                                if (file) {
                                  setInputMessage(prev => (prev ? prev + '\n' : '') + `[Fichier joint : ${file.name}] `);
                                  setShowPlusMenu(false);
                                }
                              };
                              fileInput.click();
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-700/60 hover:text-white transition flex items-center gap-2.5"
                          >
                            <span className="text-base">📎</span>
                            <div>
                              <div className="font-medium">Joindre un document</div>
                              <div className="text-[10px] text-zinc-400">PDF, TXT, code ou notes</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInputMessage("Analyse ce blocage et donne-moi les 3 leviers comportementaux concrets :");
                              setShowPlusMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-700/60 hover:text-white transition flex items-center gap-2.5"
                          >
                            <span className="text-base">🧠</span>
                            <div>
                              <div className="font-medium">Analyser un blocage</div>
                              <div className="text-[10px] text-zinc-400">Méthode comportementale</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setInputMessage("Donne-moi 3 actions rapides pour avancer aujourd'hui :");
                              setShowPlusMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-700/60 hover:text-white transition flex items-center gap-2.5"
                          >
                            <span className="text-base">🎯</span>
                            <div>
                              <div className="font-medium">Plan d'action en 3 étapes</div>
                              <div className="text-[10px] text-zinc-400">Passage immédiat à l'action</div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* SÉLECTEUR DE MODÈLE (RAPIDE / PUISSANT) DANS LA CASE D'ENVOI */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowModelMenu(!showModelMenu)}
                        className="h-9 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700/90 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition flex items-center gap-1.5 shadow-sm active:scale-95"
                        title="Changer de modèle IA"
                      >
                        {modelChoice === 'rapide' ? (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                            <span>Rapide</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                            <span>Puissant</span>
                          </>
                        )}
                        <span className="text-[10px] text-zinc-400">▾</span>
                      </button>

                      {showModelMenu && (
                        <div className="absolute bottom-11 left-0 z-50 w-64 bg-[#262626] border border-zinc-700 rounded-2xl p-2 shadow-2xl space-y-1 animate-in fade-in slide-in-from-bottom-2">
                          <div className="text-[10px] font-semibold text-zinc-400 px-2.5 py-1 uppercase tracking-wider">
                            Modèle IA sélectionné
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setModelChoice('rapide');
                              setShowModelMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                              modelChoice === 'rapide' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-700/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                              <div>
                                <div className="font-semibold">Rapide</div>
                                <div className="text-[10px] text-zinc-400">Réponse instantanée (Llama 8B / Flash)</div>
                              </div>
                            </div>
                            {modelChoice === 'rapide' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setModelChoice('puissant');
                              setShowModelMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between ${
                              modelChoice === 'puissant' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-300 hover:bg-zinc-700/50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Brain className="w-3.5 h-3.5 text-purple-400" />
                              <div>
                                <div className="font-semibold">Puissant</div>
                                <div className="text-[10px] text-zinc-400">Raisonnement profond (Llama 70B / Pro)</div>
                              </div>
                            </div>
                            {modelChoice === 'puissant' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side buttons: Micro et Flèche d'envoi DE TAILLE STRICTEMENT IDENTIQUE */}
                  <div className="flex items-center gap-2 ml-auto shrink-0">
                    {/* Microphone button: STRICTEMENT LA MÊME TAILLE que la flèche (w-9 h-9) */}
                    <button
                      type="button"
                      onClick={handleToggleVoiceRecording}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 border ${
                        isRecordingVoice
                          ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-md'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-zinc-700/80 shadow-sm'
                      }`}
                      title={isRecordingVoice ? 'Arrêter la dictée vocale' : 'Dictée vocale gratuite (Microphone)'}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Send Arrow button: tout à droite, STRICTEMENT LA MÊME TAILLE que le micro (w-9 h-9) */}
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!inputMessage.trim()}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 ${
                        inputMessage.trim()
                          ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-md font-bold cursor-pointer'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed'
                      }`}
                      title="Envoyer le message (Entrée)"
                    >
                      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Discreet helper underneath */}
              <div className="text-center text-[11px] text-zinc-500 pt-2">
                <span>Bea peut faire des erreurs. BehaviorLab AI.</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROFIL MANAGER VIEW (RÉPARATION DES PROFILS) */}
        {currentPage === 'profil' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <ProfileManager
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onGoToChat={() => setCurrentPage('chat')}
            />
          </div>
        )}

        {/* 3. COMPTE VIEW : OFFRES & ABONNEMENTS À FORTE CONVERSION */}
        {currentPage === 'compte' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <SalesOffers 
              currentPlan={userProfile.plan} 
              userProfile={userProfile}
              onSelectPlan={(plan) => handleUpdateProfile({ ...userProfile, plan })}
            />
          </div>
        )}

        {/* 4. SÉCURITÉ ACTIVE : BOUCLIER ANTI-PIRATAGE */}
        {currentPage === 'securite' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <SecurityShield />
          </div>
        )}

        {/* 5. STUDIO DE DESIGN VISUEL */}
        {currentPage === 'studio' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <VisualDesignStudio />
          </div>
        )}

        {/* 6. SITE WEB EN 1 PROMPT */}
        {currentPage === 'app' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <SiteBuilder />
          </div>
        )}

        {/* 7. CODE VIEW */}
        {currentPage === 'code' && (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  💻 Éditeur de Code avec IA
                </h2>
                <p className="text-xs text-[#c4b5fd]">Écrivez, testez et demandez à Bea d'améliorer votre script</p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-[#7c3aed] text-white font-bold text-xs flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Télécharger .py
              </button>
            </div>

            <div className="bg-[#0b081b] border-2 border-[#7c3aed] rounded-2xl overflow-hidden font-mono">
              <div className="bg-[#181135] px-4 py-2 border-b border-[#7c3aed]/40 flex items-center justify-between text-xs text-[#c4b5fd]">
                <span>mon_script.py (Python)</span>
                <span>UTF-8</span>
              </div>
              <textarea
                value={codeContent}
                onChange={e => setCodeContent(e.target.value)}
                rows={12}
                className="w-full bg-transparent text-[#e2d6ff] p-4 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 8. MODULES ADDITIONNELS */}
        {['projets', 'memoire', 'perso'].includes(currentPage) && (
          <div className="flex-1 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white capitalize">{currentPage}</h2>
            <div className="p-8 rounded-2xl bg-[#15112a] border border-[#7c3aed] text-center space-y-3">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
              <p className="text-xs text-[#c4b5fd]">
                Module <code className="text-purple-300 font-mono">{currentPage}</code> connecté et actif dans Bea.
              </p>
              <button
                onClick={onOpenLab}
                className="px-4 py-2 rounded-xl bg-[#231a4a] border border-[#7c3aed] text-xs font-bold text-white inline-flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                Modifier ce module dans le Labo Dev
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
