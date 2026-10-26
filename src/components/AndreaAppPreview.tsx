import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Film, 
  Code2, 
  Globe, 
  Brain, 
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
  Zap,
  Wand2,
  Check,
  Award,
  User,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  ArrowUp,
  Sliders,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, PageView, UserProfile, ProfileType, UseCaseType } from '../types/bea';
import { andreaVoice } from '../utils/speech';
import { VisualDesignStudio } from './VisualDesignStudio';
import { SiteBuilder } from './SiteBuilder';
import { ProfileManager } from './ProfileManager';
import { SalesOffers } from './SalesOffers';
import { SecurityShield } from './SecurityShield';
import { AiSettingsPanel } from './AiSettingsPanel';
import { CreativeHub } from './CreativeHub';
import { PROFILE_METAS } from '../data/profilesData';
import { 
  inspectPromptSecurity, 
  sanitizeXSS, 
  checkRateLimit, 
  signData, 
  verifyData, 
  isHoneypotTriggered 
} from '../utils/security';
import { generateHumanAndreaResponse } from '../utils/textHumanizer';

export interface AndreaAppPreviewProps {
  onOpenLab: () => void;
  onOpenStudio?: () => void;
  onSignOut?: () => void;
  currentUser?: UserProfile;
}

export type BeaAppPreviewProps = AndreaAppPreviewProps;

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-client',
  displayName: 'Mon Espace',
  email: 'client@andrea.ai',
  profileType: 'createur',
  useCase: 'contenu',
  goal: 'Créer du contenu percutant et concrétiser mes projets.',
  schoolCountry: 'France',
  studyLevel: 'Supérieur',
  preferredStyle: 'expert',
  plan: 'pro',
  lastActive: 'À l\'instant',
  streakDays: 1,
  momentumPoints: 60,
};

export const AndreaAppPreview: React.FC<AndreaAppPreviewProps> = ({ 
  onOpenLab, 
  onOpenStudio, 
  onSignOut,
  currentUser 
}) => {
  const [currentPage, setCurrentPage] = useState<PageView>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [modelChoice, setModelChoice] = useState<'rapide' | 'puissant'>('rapide');
  
  // Ref to automatically scroll to the bottom of the conversation (WhatsApp behavior)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (currentUser) return currentUser;
    try {
      const stored = localStorage.getItem('andrea_active_session') || localStorage.getItem('andrea_user_profile_secure') || localStorage.getItem('bea_user_profile_secure');
      if (stored) {
        const parsed = JSON.parse(stored);
        return verifyData<UserProfile>(parsed, DEFAULT_PROFILE);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    if (currentUser) {
      setUserProfile(currentUser);
    }
  }, [currentUser]);

  // Active use case mode synchronisé avec le profil utilisateur
  const useCase: UseCaseType = userProfile.useCase;
  const [showChallengeInfo, setShowChallengeInfo] = useState(false);

  // PSYCHOLOGIE & RÉTENTION :
  const hasStreak = useCase === 'contenu' || useCase === 'scolaire';
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
      content: `Passer 5 heures sur un montage court est un piège classique : ton attention se dissipe dans des micro-ajustements qui n'impactent ni la rétention ni la clarté du message.

Voici comment compresser ta production de 5h à 45 minutes :

**1. La structure en 3 couches (Zéro dispersion) :**
- **Couche Hook (0 à 3 sec)** : C'est là que se joue 80% du résultat. 1 phrase d'accroche directe + 1 sous-titre dynamique contrasté.
- **Couche Cœur (3 à 45 sec)** : 1 seule idée directrice, 2 exemples max. Coupe simplement les hésitations et silences (jump-cuts nets). Pas d'animations superflues.
- **Couche Sortie (45 à 55 sec)** : 1 appel à l'action limpide et engageant.

**2. Le découplage des tâches (Batching) :**
Ne filme jamais et ne monte jamais dans la même session. La fatigue décisionnelle après le tournage te fait hésiter sur chaque coupe. Découpe en deux créneaux :
- Bloc A : Écriture et tournage d'affilée de 3 vidéos brutes.
- Bloc B : Montage standardisé le lendemain avec un template pré-calibré dans l'outil de Montage Andrea.

Veux-tu qu'on applique cette trame directement à ton prochain sujet ?`,
      timestamp: '11:21',
      securityShield: true,
    },
  ]);

  // Auto-scroll to bottom like WhatsApp whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [codeContent, setCodeContent] = useState(`import streamlit as st

def hello_andrea():
    st.title("Bienvenue sur BehaviorLab AI")
    st.write("Analyse comportementale en temps réel avec protection active")

if __name__ == "__main__":
    hello_andrea()`);

  // Arrêt de la voix au démontage
  useEffect(() => {
    return () => {
      andreaVoice.stop();
    };
  }, [currentPage]);

  // Sauvegarde sécurisée du profil avec scellement d'intégrité
  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      const envelope = signData(updated);
      localStorage.setItem('andrea_user_profile_secure', JSON.stringify(envelope));
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
      andreaVoice.stop();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      andreaVoice.speak(text, () => {
        setSpeakingMsgId(null);
      });
    }
  };

  // ENVOI SÉCURISÉ AVEC TRIPLE COUCHE ANTI-PIRATAGE
  const handleSend = () => {
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[SECURITY] Bot piégé par le Honeypot.');
      return;
    }

    if (!inputMessage.trim()) return;

    // Rate limiting anti-flood
    const rateCheck = checkRateLimit('user-chat-app', 15, 60000);
    if (!rateCheck.allowed) {
      setSecurityAlert(`Anti-flood activé : veuillez patienter ${rateCheck.resetInSec} secondes.`);
      return;
    }

    // Inspection prompt injection & jailbreak
    const secReport = inspectPromptSecurity(inputMessage);
    if (!secReport.isSafe) {
      setSecurityAlert(secReport.threat || 'Requête suspecte bloquée par le bouclier.');
      return;
    }

    // Assainissement XSS
    const sanitizedText = sanitizeXSS(inputMessage.trim());

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: sanitizedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setShowPlusMenu(false);

    // Progression comportementale
    if (userProfile.streakDays) {
      const updatedProfile = {
        ...userProfile,
        momentumPoints: (userProfile.momentumPoints || 50) + 10,
      };
      handleUpdateProfile(updatedProfile);
    }

    // Réponse humanisée d'Andrea
    setTimeout(() => {
      const replyText = generateHumanAndreaResponse(sanitizedText, userProfile);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityShield: true,
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 450);
  };

  // Validation du micro-défi quotidien
  const completeDailyChallenge = () => {
    if (dailyChallengeDone) return;
    setDailyChallengeDone(true);
    setShowCelebration(true);
    const updated = {
      ...userProfile,
      momentumPoints: (userProfile.momentumPoints || 50) + 25,
      streakDays: (userProfile.streakDays || 1) + 1,
    };
    handleUpdateProfile(updated);
    setTimeout(() => setShowCelebration(false), 4000);
  };

  // Handle switching to montage editor
  const handleOpenMontage = () => {
    if (onOpenStudio) {
      onOpenStudio();
    } else {
      setCurrentPage('studio');
    }
  };

  return (
    <div className="h-full w-full flex bg-[#181135] text-white font-sans overflow-hidden select-none">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 md:w-72 bg-[#100b24] border-r border-[#5A33FF33] flex flex-col justify-between shrink-0 h-full overflow-y-auto z-20 shadow-2xl">
        <div className="p-3.5 space-y-3.5">
          
          {/* Logo Andrea (logo_bea.png) */}
          <div className="flex flex-col items-center justify-center text-center pt-1">
            <div className="w-14 h-14 rounded-2xl bg-[#161033] border border-[#5A33FF55] p-1 shadow-lg mb-1.5 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
              <img 
                src="/logo_bea.png" 
                alt="Andrea Logo" 
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
              />
            </div>
            <div className="font-extrabold text-base text-white tracking-tight">Andrea</div>
            <div className="text-[10px] font-bold text-[#a78bfa] tracking-widest uppercase">BehaviorLab AI</div>
          </div>

          {/* ACTIVE USER PROFILE CHIP */}
          <button
            onClick={() => setCurrentPage('profil')}
            className="w-full bg-[#181135] hover:bg-[#231a4a] border border-[#5A33FF44] p-2.5 rounded-2xl text-left transition flex items-center justify-between shadow-inner"
            title="Gérer votre profil utilisateur"
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
          <div className="bg-[#15112a] border border-[#5A33FF33] rounded-xl p-1.5 space-y-1 text-xs">
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
                      ? 'bg-[#5A33FF] text-white shadow-sm'
                      : 'text-[#c4b5fd] hover:bg-[#231a4a]'
                  }`}
                >
                  <div className="font-bold">{m.label}</div>
                  <div className="text-[9px] opacity-75">{m.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* COMPTEUR DE SÉRIE */}
          {hasStreak && (
            <div className="bg-gradient-to-br from-[#1e143b] to-[#140e2b] border border-[#5A33FF44] rounded-2xl p-2.5 space-y-1.5 shadow-inner">
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
              <div className="w-full h-1.5 bg-[#0a0718] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5A33FF] via-[#a855f7] to-[#ec4899] rounded-full transition-all duration-500 w-[80%]" />
              </div>
            </div>
          )}

          {/* New Chat Button */}
          <button
            onClick={() => {
              setMessages([]);
              setCurrentPage('chat');
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#171131] hover:bg-[#231a4a] border border-[#5A33FF66] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            Nouvelle discussion
          </button>

          {/* NOM PAR LEQUEL ANDREA APPELLE LE CLIENT */}
          <div className="bg-[#181135] border border-[#5A33FF33] rounded-2xl p-2.5 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#c4b5fd] uppercase tracking-wider">
                Espace Personnel
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {userProfile.plan ? userProfile.plan.toUpperCase() : 'BASIQUE'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">👋</span>
              <div className="truncate">
                <span className="text-[10px] text-[#c4b5fd] block">Andrea vous appelle :</span>
                <span className="text-xs font-extrabold text-white truncate block">
                  « {userProfile.preferredCallName || userProfile.displayName} »
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu (Sans doublons, avec Création de Site en place de Profil, et Montage) */}
          <nav className="space-y-1">
            {[
              { id: 'chat', label: '💬 Discussion avec Andrea', isAction: false },
              { id: 'app', label: '🌐 Création de Site Web', isAction: false, badge: 'Pro' },
              { id: 'studio', label: '🎬 Montage Vidéo & Visuel', isAction: true },
              { id: 'creative_hub', label: '✨ Labo d\'IA (Création)', isAction: false, badge: 'Viral' },
              { id: 'profil', label: '👤 Mon Profil & Rôle', isAction: false },
              { id: 'compte', label: '💎 Offres & Abonnements', isAction: false },
              { id: 'code', label: '💻 Code & Débogage', isAction: false },
              { id: 'memoire', label: "🧠 Mémoire d'Andrea", isAction: false },
              { id: 'parametres', label: '⚙️ Paramètres IA', isAction: false },
            ].map(item => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'studio') {
                      handleOpenMontage();
                    } else {
                      setCurrentPage(item.id as PageView);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                    active
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white border border-[#5A33FF] shadow-sm font-semibold'
                      : 'text-[#c4b5fd] hover:bg-[#201844] hover:text-white'
                  }`}
                >
                  <span className="truncate pr-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dev Lab Launcher from Inside Andrea */}
        <div className="p-3 border-t border-[#5A33FF22] bg-[#0c091d] space-y-1.5">
          <button
            onClick={onOpenLab}
            className="w-full py-2 px-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-[#5A33FF55] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-300" />
            🧪 Ouvrir le Labo Dev IA
          </button>
          <div className="text-[10px] text-[#8a7ab8] text-center truncate">{userProfile.email}</div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#181135]">
        
        {/* TOP NAVIGATION BAR : UN SEUL HEADER ÉPURÉ SANS BARRES EN DOUBLE */}
        <header className="bg-[#130d2a] px-3 sm:px-6 py-2.5 border-b border-[#5A33FF33] flex items-center justify-between gap-3 shrink-0 z-10 shadow-md">
          {/* Left identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img 
              src="/logo_bea.png" 
              alt="Andrea Logo" 
              className="w-7 h-7 object-contain rounded-lg border border-[#5A33FF44]"
              onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
            />
            <span className="font-extrabold text-sm text-white">Andrea</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd] border border-[#5A33FF33] hidden sm:inline">
              BehaviorLab AI
            </span>
          </div>

          {/* Menus horizontaux : Création de Site en place de Profil, Montage, etc. */}
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 justify-center py-0.5 px-2">
            {[
              { id: 'chat', label: '💬 Discussion' },
              { id: 'app', label: '🌐 Création de Site' }, // In place of Profil
              { id: 'studio', label: '🎬 Montage' },
              { id: 'creative_hub', label: '✨ Labo d\'IA' },
              { id: 'code', label: '💻 Code' },
              { id: 'compte', label: '💎 Offres' },
              { id: 'memoire', label: '🧠 Mémoire' },
              { id: 'parametres', label: '⚙️ Paramètres' },
            ].map(tab => {
              const isActive = currentPage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'studio') {
                      handleOpenMontage();
                    } else {
                      setCurrentPage(tab.id as PageView);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md border border-[#5A33FF]'
                      : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right section: Sécurité en haut à droite + Profil utilisateur + Déconnexion */}
          <div className="flex items-center gap-2 shrink-0">
            {/* SÉCURITÉ EN HAUT À DROITE (Comme demandé par l'utilisateur) */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-[11px] font-bold text-emerald-300 shadow-sm"
              title="Connexion cryptée et protection anti-piratage active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🔒 Sécurisé</span>
            </div>

            {/* Profil utilisateur direct */}
            <button
              onClick={() => setCurrentPage('profil')}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#201844] hover:bg-[#2b215c] border border-[#5A33FF44] text-xs font-bold text-white transition"
              title="Accéder à mon profil"
            >
              <User className="w-3.5 h-3.5 text-purple-300" />
              <span>{userProfile.preferredCallName || userProfile.displayName}</span>
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-2.5 py-1 rounded-xl bg-[#201844] hover:bg-rose-950/60 text-[#c4b5fd] hover:text-rose-200 text-xs font-semibold transition flex items-center gap-1"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </header>

        {/* SECURITY ALERT BANNER */}
        {securityAlert && (
          <div className="bg-rose-950/80 border-b border-rose-500 p-2.5 text-xs text-rose-200 flex items-center justify-between px-4 shrink-0">
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

        {/* CELEBRATION TOAST */}
        {showCelebration && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2.5 text-center text-xs font-bold shadow-lg animate-in slide-in-from-top flex items-center justify-center gap-2 shrink-0">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Félicitations ! Micro-défi validé (+25 pts). Votre élan est lancé !</span>
          </div>
        )}

        {/* 1. CHAT VIEW (WHATSAPP LAYOUT : Case d'envoi toujours visible en bas, conversation qu'on remonte) */}
        {currentPage === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            
            {/* Top Sub-Bar with Voice & Mode */}
            <div className="px-4 py-2 border-b border-[#5A33FF22] bg-[#140e2d] flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Voix 100% Gratuite Active
                </span>
                <span className="text-[#c4b5fd] hidden sm:inline text-[11px]">
                  Mode : <strong>{PROFILE_METAS[userProfile.profileType]?.label}</strong>
                </span>
              </div>

              {hasDailyChallenge && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={completeDailyChallenge}
                    disabled={dailyChallengeDone}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition flex items-center gap-1 ${
                      dailyChallengeDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400 animate-pulse'
                    }`}
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    {dailyChallengeDone ? '✓ Défi Révision validé' : '🎯 Micro-Défi 3 min'}
                  </button>
                </div>
              )}
            </div>

            {/* Conversation Messages Container : ON REMONTE POUR VOIR LES ANCIENS MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="max-w-4xl mx-auto w-full space-y-4">
                
                {/* Starter greeting when no messages */}
                {messages.length === 0 && (
                  <div className="py-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-4 animate-in fade-in duration-300">
                    <img 
                      src="/logo_bea.png" 
                      alt="Andrea Logo" 
                      className="w-16 h-16 object-contain rounded-2xl p-1 bg-[#100b24] border border-[#5A33FF55] shadow-xl"
                      onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
                    />
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#201844] border border-[#5A33FF44] text-[#c4b5fd] text-xs font-semibold">
                        <span>👋 Bonjour {userProfile.preferredCallName || userProfile.displayName}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">({userProfile.plan ? userProfile.plan.toUpperCase() : 'BASIQUE'})</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                        Sur quoi souhaitez-vous avancer aujourd'hui ?
                      </h3>
                      <p className="text-xs text-[#c4b5fd] max-w-md mx-auto leading-relaxed">
                        Posez votre question, partagez votre blocage ou cliquez sur une action rapide pour démarrer sans friction.
                      </p>
                    </div>

                    {/* Quick Starter Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2 text-left">
                      {[
                        {
                          title: '⚡ Plan d\'action 15 minutes',
                          desc: 'Débloquer une tâche sans remettre à plus tard',
                          prompt: 'Donne-moi un plan d\'action concret en 3 étapes simples de 5 minutes pour passer à l\'action maintenant.',
                        },
                        {
                          title: '🎬 Créer du contenu percutant',
                          desc: 'Accroches et structure à fort impact visuel',
                          prompt: 'Aide-moi à trouver 3 hooks percutants et une idée de visuel pour mon prochain sujet.',
                        },
                        {
                          title: '🎓 Clarifier une notion complexe',
                          desc: 'Explication limpide et méthode de mémorisation',
                          prompt: 'Explique-moi ce concept simplement avec une métaphore du quotidien et un exemple pratique.',
                        },
                        {
                          title: '💼 Diagnostic stratégique & offre',
                          desc: 'Lever une objection et clarifier ma valeur',
                          prompt: 'Comment formuler mon offre pour que la valeur saute aux yeux et supprime les objections de prix ?',
                        },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setInputMessage(item.prompt)}
                          className="p-3 rounded-2xl bg-[#1b143c] hover:bg-[#231a4a] border border-[#5A33FF33] hover:border-[#8B70FF] transition text-left group shadow-sm hover:scale-[1.01]"
                        >
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#c4b5fd]/80 mt-0.5">
                            {item.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages list */}
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl border ${
                      msg.role === 'user'
                        ? 'bg-[#231a4a] border-[#5A33FF44] text-white ml-auto max-w-2xl shadow-md'
                        : 'bg-[#1b143c] border-[#5A33FF33] text-[#f5f3ff] max-w-3xl shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#c4b5fd] flex items-center gap-1.5">
                        {msg.role === 'user' ? `👤 ${userProfile.displayName}` : '🧠 Andrea (BehaviorLab AI)'}
                      </span>
                      <span className="text-[10px] text-[#c4b5fd]/60">{msg.timestamp}</span>
                    </div>

                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>

                    {msg.role === 'assistant' && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[#5A33FF33] text-xs">
                        <button
                          onClick={() => toggleSpeak(msg.id, msg.content)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            speakingMsgId === msg.id
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                              : 'bg-[#231a4a] text-[#c4b5fd] hover:text-white hover:bg-[#2a2057] border border-[#5A33FF44]'
                          }`}
                          title="Écouter la réponse d'Andrea à voix haute (100% gratuit)"
                        >
                          {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#8B70FF]" />}
                          <span>{speakingMsgId === msg.id ? 'Arrêter la voix' : '🔊 Écouter Andrea'}</span>
                        </button>

                        <button 
                          onClick={() => navigator.clipboard.writeText(msg.content)}
                          className="p-1.5 rounded-lg bg-[#2a2057] hover:bg-[#372b6e] border border-[#5A33FF33] text-[#c4b5fd] hover:text-white" 
                          title="Copier le texte"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button className="p-1.5 rounded-lg bg-[#2a2057] hover:bg-[#372b6e] border border-[#5A33FF33] text-[#c4b5fd] hover:text-white" title="Utile">
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button className="p-1.5 rounded-lg bg-[#2a2057] hover:bg-[#372b6e] border border-[#5A33FF33] text-[#c4b5fd] hover:text-white" title="À améliorer">
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Anchor for auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Suggestions de prompts rapides au-dessus de la saisie */}
            <div className="px-4 py-1.5 bg-[#140e2c] border-t border-[#5A33FF22] overflow-x-auto shrink-0">
              <div className="max-w-4xl mx-auto w-full flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#8B70FF] shrink-0">Suggestions profil :</span>
                {PROFILE_METAS[userProfile.profileType]?.starterPrompts.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setInputMessage(prompt)}
                    className="px-2.5 py-0.5 rounded-full bg-[#201844] hover:bg-[#2a2057] text-[11px] text-[#c4b5fd] hover:text-white border border-[#5A33FF33] whitespace-nowrap transition"
                  >
                    {prompt.length > 45 ? prompt.slice(0, 45) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* CASE ENVOYER UN MESSAGE STRICTEMENT ANCRÉE EN BAS (STYLE WHATSAPP) */}
            <div className="p-3 md:p-4 bg-[#110d24] border-t border-[#5A33FF33] shrink-0 z-20 shadow-2xl">
              <div className="max-w-4xl mx-auto w-full">
                
                {/* Invisible Honeypot field for bot trapping */}
                <input 
                  type="text" 
                  name="andrea_anti_bot_check" 
                  value={honeypot} 
                  onChange={e => setHoneypot(e.target.value)} 
                  tabIndex={-1} 
                  autoComplete="off" 
                  style={{ position: 'absolute', opacity: 0, height: 0, width: 0, zIndex: -1 }} 
                />

                {/* Saisie principale ergonomique */}
                <div className="bg-[#1b143c] border border-[#5A33FF55] hover:border-[#5A33FF88] focus-within:border-[#8B70FF] rounded-[24px] p-2.5 shadow-xl transition-all duration-200">
                  <div className="px-1.5 pt-0.5">
                    <textarea
                      rows={1}
                      value={inputMessage}
                      onChange={e => {
                        setInputMessage(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={`Envoyer un message à Andrea (${PROFILE_METAS[userProfile.profileType]?.label})...`}
                      className="w-full bg-transparent text-white text-[14px] placeholder-[#c4b5fd]/60 resize-none focus:outline-none min-h-[38px] max-h-[140px] leading-relaxed selection:bg-[#5A33FF]/40"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1 px-1">
                    <div className="flex items-center gap-1.5">
                      {/* Plus options popup */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPlusMenu(!showPlusMenu)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            showPlusMenu ? 'bg-[#5A33FF] text-white' : 'text-[#c4b5fd] hover:text-white hover:bg-white/10'
                          }`}
                          title="Options d'actions rapides"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        {showPlusMenu && (
                          <div className="absolute bottom-10 left-0 bg-[#161033] border border-[#5A33FF55] rounded-2xl shadow-2xl p-2 w-64 z-50 space-y-1 animate-in fade-in zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                setInputMessage("Donne-moi un plan d'action en 3 étapes simples pour avancer aujourd'hui :");
                                setShowPlusMenu(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-[#E2D6FF] hover:bg-[#252245] hover:text-white transition flex items-center gap-2"
                            >
                              <span>🎯 Plan d'action rapide</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInputMessage("Analyse ce blocage et donne-moi les leviers concrets pour passer à l'action :");
                                setShowPlusMenu(false);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-[#E2D6FF] hover:bg-[#252245] hover:text-white transition flex items-center gap-2"
                            >
                              <span>🧠 Analyser un blocage</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Model speed selector */}
                      <button
                        type="button"
                        onClick={() => setModelChoice(m => m === 'rapide' ? 'puissant' : 'rapide')}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd] hover:text-white border border-[#5A33FF33] transition"
                        title="Basculer entre modèle instantané et approfondi"
                      >
                        {modelChoice === 'rapide' ? '⚡ Instant' : '🧠 Approfondi'}
                      </button>
                    </div>

                    {/* Micro et Envoi (dimensions identiques w-9 h-9) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleToggleVoiceRecording}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 border ${
                          isRecordingVoice
                            ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-md'
                            : 'bg-[#201844] hover:bg-[#2d2260] text-[#c4b5fd] hover:text-white border-[#5A33FF44] shadow-sm'
                        }`}
                        title={isRecordingVoice ? 'Arrêter la dictée vocale' : 'Dictée vocale gratuite (Microphone)'}
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!inputMessage.trim()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 ${
                          inputMessage.trim()
                            ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white hover:brightness-110 active:scale-95 shadow-md font-bold cursor-pointer'
                            : 'bg-[#201844] text-[#c4b5fd]/40 border border-[#5A33FF22] cursor-not-allowed'
                        }`}
                        title="Envoyer le message (Entrée)"
                      >
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-[#c4b5fd]/60 pt-1.5">
                  Andrea BehaviorLab AI · Réponses personnalisées pour {userProfile.displayName}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CRÉATION DE SITE WEB (Bolt / Gemini level) */}
        {currentPage === 'app' && (
          <div className="flex-1 overflow-y-auto">
            <SiteBuilder />
          </div>
        )}

        {/* 3. MONTAGE VIDÉO & VISUEL */}
        {currentPage === 'studio' && (
          <div className="flex-1 overflow-y-auto">
            <VisualDesignStudio />
          </div>
        )}

        {/* 4. LABO D'IA (CRÉATION) */}
        {currentPage === 'creative_hub' && (
          <CreativeHub
            onSelectAction={(action, promptText) => {
              if (promptText) {
                setInputMessage(promptText);
                setCurrentPage('chat');
              }
            }}
            onNavigate={(page) => setCurrentPage(page)}
            onOpenVoice={handleToggleVoiceRecording}
          />
        )}

        {/* 5. PROFIL MANAGER VIEW */}
        {currentPage === 'profil' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <ProfileManager
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onGoToChat={() => setCurrentPage('chat')}
            />
          </div>
        )}

        {/* 6. COMPTE VIEW : OFFRES & ABONNEMENTS */}
        {currentPage === 'compte' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <SalesOffers 
              currentPlan={userProfile.plan} 
              userProfile={userProfile}
              onSelectPlan={(plan) => handleUpdateProfile({ ...userProfile, plan })}
            />
          </div>
        )}

        {/* 7. CODE VIEW */}
        {currentPage === 'code' && (
          <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  💻 Éditeur de Code avec IA
                </h2>
                <p className="text-xs text-[#c4b5fd]">Écrivez, testez et demandez à Andrea d'améliorer votre script</p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-[#5A33FF] text-white font-bold text-xs flex items-center gap-1.5 shadow">
                <Download className="w-3.5 h-3.5" />
                Télécharger .py
              </button>
            </div>
            <div className="bg-[#0b081b] border-2 border-[#5A33FF55] rounded-2xl overflow-hidden font-mono">
              <div className="bg-[#150f2e] px-4 py-2 border-b border-[#5A33FF33] flex items-center justify-between text-xs text-[#c4b5fd]">
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

        {/* 8. MÉMOIRE */}
        {currentPage === 'memoire' && (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Mémoire contextuelle d'Andrea
              </h2>
              <div className="p-5 rounded-2xl bg-[#1b143c] border border-[#5A33FF33] space-y-3">
                <div className="text-xs text-[#c4b5fd]">
                  Informations enregistrées pour adapter vos conseils et montages :
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex justify-between">
                    <span className="text-zinc-400">Prénom préféré :</span>
                    <strong className="text-white">« {userProfile.preferredCallName || userProfile.displayName} »</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex justify-between">
                    <span className="text-zinc-400">Rôle principal :</span>
                    <strong className="text-white">{PROFILE_METAS[userProfile.profileType]?.label}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex justify-between">
                    <span className="text-zinc-400">Style préféré :</span>
                    <strong className="text-white">{userProfile.preferredStyle}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex justify-between">
                    <span className="text-zinc-400">Formule active :</span>
                    <strong className="text-emerald-400">{userProfile.plan ? userProfile.plan.toUpperCase() : 'BASIQUE'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. PARAMÈTRES AVANCÉS */}
        {currentPage === 'parametres' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <AiSettingsPanel />
          </div>
        )}

        {/* 10. SÉCURITÉ DÉTAILLÉE (Accessible si besoin) */}
        {currentPage === 'securite' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <SecurityShield />
          </div>
        )}

      </div>
    </div>
  );
};

export const BeaAppPreview = AndreaAppPreview;
export default AndreaAppPreview;
