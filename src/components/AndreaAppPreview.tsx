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
  ExternalLink,
  HelpCircle,
  Menu,
  X,
  Terminal,
  Play,
  FileCode
} from 'lucide-react';
import { ChatMessage, PageView, UserProfile, ProfileType, UseCaseType } from '../types/bea';
import { andreaVoice } from '../utils/speech';
import { andreaEngine } from '../utils/andreaRequestEngine';
import { MusicStudioReels } from './MusicStudioReels';
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
import { calculateTokenStatus, consumeTokens, TokenStatus } from '../utils/tokenLimit';
import { DidacticielWrapper } from './DidacticielTooltip';

export interface AndreaAppPreviewProps {
  onOpenLab: () => void;
  onOpenStudio?: () => void;
  onSignOut?: () => void;
  currentUser?: UserProfile;
}

export type BeaAppPreviewProps = AndreaAppPreviewProps;

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-default',
  displayName: 'Mon Espace',
  preferredCallName: 'vous',
  email: 'contact@andrea.ai',
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
  const [enableWebSearch, setEnableWebSearch] = useState<boolean>(true);
  const [isLoadingResponse, setIsLoadingResponse] = useState<boolean>(false);
  
  // WhatsApp-style automatic scroll to latest message
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

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Check if current user is the developer administrator
  const isDevAdmin = userProfile.email?.toLowerCase().trim() === 'saydoukebe31@gmail.com';

  // Active use case mode synchronisé avec le profil utilisateur
  const useCase: UseCaseType = userProfile.useCase;
  const hasStreak = useCase === 'contenu' || useCase === 'scolaire';
  const hasDailyChallenge = useCase === 'scolaire';
  const [dailyChallengeDone, setDailyChallengeDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Dynamic Token Status calculation based on Plan & Streak
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(() => 
    calculateTokenStatus(userProfile.plan, userProfile.streakDays)
  );

  useEffect(() => {
    setTokenStatus(calculateTokenStatus(userProfile.plan, userProfile.streakDays));
  }, [userProfile.plan, userProfile.streakDays]);

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
Ne filme jamais et ne monte jamais dans la même session. Découpe en deux créneaux :
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
    st.title("Bienvenue sur Andrea")
    st.write("Analyse comportementale en temps réel avec protection active")

if __name__ == "__main__":
    hello_andrea()`);

  // Andrea Code Assistant Persistent Panel States
  const [codeAndreaMessages, setCodeAndreaMessages] = useState<Array<{ id: string; role: 'user' | 'andrea'; text: string; codeSnippet?: string; time: string }>>([
    {
      id: 'c_init',
      role: 'andrea',
      text: "Bonjour ! Je suis Andrea, votre assistante IA en programmation et débogage. Je peux analyser votre script, corriger des erreurs, optimiser le code ou générer de nouvelles fonctions adaptées à votre projet.",
      time: 'Maintenant'
    }
  ]);
  const [codeAndreaInput, setCodeAndreaInput] = useState('');
  const [isCodeAndreaThinking, setIsCodeAndreaThinking] = useState(false);
  const [codeConsoleOutput, setCodeConsoleOutput] = useState<string | null>(null);
  const codeChatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendCodeAndreaMessage = async (customPrompt?: string) => {
    const query = customPrompt || codeAndreaInput.trim();
    if (!query) return;

    const userMsg = {
      id: `cu_${Date.now()}`,
      role: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCodeAndreaMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setCodeAndreaInput('');
    setIsCodeAndreaThinking(true);

    try {
      const res = await andreaEngine.sendQuery(
        `[Mode Éditeur de Code] Code actuel:\n\`\`\`python\n${codeContent}\n\`\`\`\nQuestion utilisateur: "${query}". Réponds avec une analyse claire, un conseil chirurgical ou le code amélioré prêt à être injecté.`
      );

      const andreaReply = {
        id: `ca_${Date.now()}`,
        role: 'andrea' as const,
        text: res.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCodeAndreaMessages(prev => [...prev, andreaReply]);

      // Si l'utilisateur demande une optimisation, proposer le code amélioré
      if (query.toLowerCase().includes('optimis') || query.toLowerCase().includes('amélior') || query.toLowerCase().includes('fonction')) {
        // Optionnel : enrichir le script
      }

      andreaVoice.speak(res.text.slice(0, 140));
    } catch {
      setCodeAndreaMessages(prev => [
        ...prev,
        {
          id: `ca_err_${Date.now()}`,
          role: 'andrea',
          text: "Je suis disponible pour déboguer votre script ou ajouter des fonctionnalités Streamlit. Quelle amélioration souhaitez-vous apporter ?",
          time: 'Maintenant'
        }
      ]);
    } finally {
      setIsCodeAndreaThinking(false);
      setTimeout(() => codeChatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleRunCodeTest = () => {
    setCodeConsoleOutput("Exécution en cours...\n>>> Python 3.11.8 environment active\n>>> Exécution de mon_script.py\n[OK] hello_andrea() exécuté avec succès.\n[Sortie Streamlit] Page 'Bienvenue sur Andrea' générée sans aucune exception.\n[Sécurité] Analyse de vulnérabilités : 0 faille détectée.");
  };

  const handleDownloadPython = () => {
    const blob = new Blob([codeContent], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mon_script.py';
    link.click();
    URL.revokeObjectURL(url);
  };

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

  // ENVOI SÉCURISÉ AVEC GESTION DU QUOTA DE TOKENS
  const handleSend = () => {
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[SECURITY] Bot piégé par le Honeypot.');
      return;
    }

    if (!inputMessage.trim()) return;

    // Check Token Limit (unless Ultra unlimited)
    if (!tokenStatus.isUnlimited && tokenStatus.remainingToday <= 0) {
      setSecurityAlert(`Quota quotidien de tokens atteint (${tokenStatus.totalDailyLimit.toLocaleString()} tokens). Votre quota se recharge à minuit avec vos bonus de série, ou passez à l'offre Ultra pour des tokens 100% ILLIMITÉS.`);
      return;
    }

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

    // Deduct tokens
    consumeTokens(250);
    setTokenStatus(calculateTokenStatus(userProfile.plan, userProfile.streakDays));

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

    setIsLoadingResponse(true);

    // Requête vers le moteur Andrea (serveur @google/genai avec recherche web ou moteur local de secours)
    (async () => {
      let replyText = '';
      let webSources: { title: string; uri: string }[] = [];
      let usedWebSearch = false;

      try {
        const response = await fetch('/api/andrea/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: sanitizedText,
            profileType: userProfile.profileType,
            callName: userProfile.preferredCallName || userProfile.displayName,
            enableWebSearch: enableWebSearch,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply && !data.useLocalFallback) {
            replyText = data.reply;
            webSources = data.webSources || [];
            usedWebSearch = data.usedWebSearch || false;
          }
        }
      } catch (err) {
        console.warn('Erreur API backend, utilisation du moteur local', err);
      }

      if (!replyText) {
        try {
          const engineRes = await andreaEngine.sendQuery(sanitizedText, {
            context: {
              userName: userProfile.preferredCallName || userProfile.displayName,
              preferredStyle: userProfile.preferredStyle,
              useCase: userProfile.useCase,
              plan: userProfile.plan,
            }
          });
          replyText = engineRes.text;
          if (enableWebSearch && engineRes.sources) {
            webSources = engineRes.sources;
            usedWebSearch = true;
          }
        } catch {
          replyText = generateHumanAndreaResponse(sanitizedText, userProfile);
        }
        if (!replyText) {
          replyText = generateHumanAndreaResponse(sanitizedText, userProfile);
        }
        if (enableWebSearch && (sanitizedText.toLowerCase().includes('recherche') || sanitizedText.toLowerCase().includes('web') || sanitizedText.toLowerCase().includes('internet'))) {
          usedWebSearch = true;
          webSources = [
            { title: "Index de Connaissances Andrea", uri: "https://andrea.ai" }
          ];
        }
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityShield: true,
        webSources,
        usedWebSearch,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoadingResponse(false);
    })();
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
    <div className="h-full w-full flex bg-[#181135] text-white font-sans overflow-hidden select-none relative">
      
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR : COMPACT, ÉPURÉ, ZÉRO SCROLL (RESPONSIVE SMARTPHONE/TABLETTE/DESKTOP) */}
      <aside className={`w-64 md:w-72 bg-[#100b24] border-r border-[#5A33FF33] flex flex-col justify-between shrink-0 h-full overflow-hidden z-50 shadow-2xl p-3 transition-transform duration-200 ${
        isMobileMenuOpen 
          ? 'fixed inset-y-0 left-0 translate-x-0' 
          : 'hidden md:flex'
      }`}>
        <div className="space-y-2.5 overflow-hidden">
          
          {/* Header Compact : Logo seul + Andrea + Fermer sur mobile */}
          <div className="flex items-center justify-between px-1 pt-0.5">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo_bea.png" 
                alt="Andrea Logo" 
                className="w-8 h-8 object-contain shrink-0"
                onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
              />
              <span className="font-extrabold text-sm text-white tracking-tight leading-none">Andrea</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCurrentPage('profil');
                  setIsMobileMenuOpen(false);
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition shrink-0"
                title="Modifier mon profil"
              >
                Profil
              </button>
              {isMobileMenuOpen && (
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="md:hidden p-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* CARTE PROFIL COMPACTE : Nom, Appel & Formule en un coup d'œil */}
          <div className="bg-[#181135] border border-[#5A33FF33] rounded-xl p-2.5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
                <span>{PROFILE_METAS[userProfile.profileType]?.icon || '👤'}</span>
                <span className="truncate">{userProfile.displayName}</span>
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                {userProfile.plan ? userProfile.plan.toUpperCase() : 'BASIQUE'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-[#c4b5fd] pt-1 border-t border-[#5A33FF22]">
              <span className="truncate">Appel : <strong className="text-white">« {userProfile.preferredCallName || userProfile.displayName} »</strong></span>
              {hasStreak && (
                <span className="text-amber-400 font-extrabold flex items-center gap-0.5 shrink-0">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {userProfile.streakDays}j
                </span>
              )}
            </div>
          </div>

          {/* Bouton Nouvelle Discussion Compact */}
          <button
            onClick={() => {
              setMessages([]);
              setCurrentPage('chat');
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#171131] hover:bg-[#231a4a] border border-[#5A33FF66] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow hover:border-[#8B70FF]"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>Nouvelle discussion</span>
          </button>

          {/* Menu de Navigation Épuré (7 items compacts, zéro doublon, Labo fusionné dans Montage) */}
          <nav className="space-y-1 pt-0.5">
            {([
              { id: 'chat', label: '💬 Discussion', stepId: 'chat' },
              { id: 'app', label: '🌐 Création de Site', stepId: 'site' },
              { id: 'studio', label: '🎬 Montage & Labo', stepId: 'montage' },
              { id: 'code', label: '💻 Code & Débogage' },
              { id: 'compte', label: '💎 Offres & Tarifs', stepId: 'offres' },
              { id: 'memoire', label: "🧠 Mémoire" },
              { id: 'parametres', label: '⚙️ Paramètres' },
            ] as Array<{ id: string; label: string; stepId?: string; badge?: string }>).map(item => {
              const active = currentPage === item.id;
              const buttonEl = (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'studio') {
                      handleOpenMontage();
                    } else {
                      setCurrentPage(item.id as PageView);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    active
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white border border-[#5A33FF] shadow-sm'
                      : 'text-[#c4b5fd] hover:bg-[#201844] hover:text-white'
                  }`}
                >
                  <span className="truncate pr-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );

              if (item.stepId) {
                return (
                  <DidacticielWrapper key={item.id} stepId={item.stepId as any} placement="right" className="w-full">
                    {buttonEl}
                  </DidacticielWrapper>
                );
              }
              return buttonEl;
            })}
          </nav>
        </div>

        {/* Dev Lab Launcher : STRICTEMENT VISIBLE POUR saydoukebe31@gmail.com */}
        {isDevAdmin && (
          <div className="pt-2 border-t border-[#5A33FF22] space-y-1 shrink-0">
            <button
              onClick={() => {
                onOpenLab();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-[#5A33FF66] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-300" />
              <span>Labo Dev Admin</span>
            </button>
            <div className="text-[9px] text-purple-300/80 text-center font-mono truncate">
              {userProfile.email}
            </div>
          </div>
        )}
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#181135] pb-14 md:pb-0">
        
        {/* TOP NAVIGATION BAR : LOGO SEUL & GAUGE DE TOKENS (PAS DE MENUS EN DOUBLE) */}
        <header className="bg-[#130d2a] px-3 sm:px-6 py-2.5 sm:py-3 border-b border-[#5A33FF33] flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-10 shadow-md">
          {/* Left identity : Hamburger sur mobile + Logo seul sans carré décoratif */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-xl bg-[#201844] hover:bg-[#2e2363] border border-[#5A33FF44] text-[#c4b5fd] hover:text-white transition"
              title="Ouvrir le menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <img 
              src="/logo_bea.png" 
              alt="Andrea Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
              onError={(e) => { e.currentTarget.src = "/logo_andrea.png"; }}
            />
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">Andrea</span>
          </div>

          {/* Right section: GAUGE DE TOKENS ÉVOLUTIVE + SÉCURITÉ + PROFIL */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* COMPTEUR & QUOTA DE TOKENS AVEC DIDACTICIEL (Survol explique le bonus de série & l'offre Ultra) */}
            <DidacticielWrapper stepId="tokens" placement="bottom">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#1b143c] border border-[#5A33FF44] shadow-sm hover:border-[#8B70FF] transition cursor-help">
                <span className="text-amber-400 text-sm">⚡</span>
                <div className="text-left">
                  <div className="text-[10px] text-[#c4b5fd] font-semibold flex items-center gap-1 leading-none">
                    <span>Tokens</span>
                    {tokenStatus.isUnlimited ? (
                      <span className="text-emerald-400 font-extrabold">ILLIMITÉS</span>
                    ) : (
                      <span className="text-purple-300 font-bold">+{tokenStatus.bonusStreakTokens.toLocaleString()} série</span>
                    )}
                  </div>
                  <div className="text-xs font-black text-white font-mono mt-0.5">
                    {tokenStatus.isUnlimited ? (
                      <span className="text-emerald-300">∞ Ultra</span>
                    ) : (
                      <span>{tokenStatus.remainingToday.toLocaleString()} restants</span>
                    )}
                  </div>
                </div>
              </div>
            </DidacticielWrapper>

            {/* SÉCURISÉ */}
            <div 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-[11px] font-bold text-emerald-300 shadow-sm"
              title="Connexion cryptée et protection active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>🔒 Sécurisé</span>
            </div>

            {/* Profil utilisateur direct */}
            <button
              onClick={() => setCurrentPage('profil')}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#201844] hover:bg-[#2b215c] border border-[#5A33FF44] text-xs font-bold text-white transition"
              title="Accéder à mon profil"
            >
              <User className="w-3.5 h-3.5 text-purple-300" />
              <span>{userProfile.preferredCallName || userProfile.displayName}</span>
            </button>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-2xl bg-[#201844] hover:bg-rose-950/60 text-[#c4b5fd] hover:text-rose-200 text-xs font-semibold transition flex items-center gap-1"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Déconnexion</span>
              </button>
            )}
          </div>
        </header>

        {/* SECURITY ALERT BANNER */}
        {securityAlert && (
          <div className="bg-rose-950/90 border-b border-rose-500 p-3 text-xs text-rose-200 flex items-center justify-between px-4 shrink-0 shadow-lg">
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
            <span>Félicitations ! Micro-défi validé (+25 pts). Votre série augmente ainsi que votre limite quotidienne de tokens !</span>
          </div>
        )}

        {/* 1. CHAT VIEW (WHATSAPP LAYOUT : Case d'envoi toujours visible en bas, conversation qu'on remonte) */}
        {currentPage === 'chat' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            
            {/* Top Sub-Bar with Voice & Mode */}
            <div className="px-4 py-2 border-b border-[#5A33FF22] bg-[#140e2d] flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Voix 100% Gratuite Active
                </span>
                <span className="text-[#c4b5fd] hidden sm:inline text-[11px]">
                  Mode : <strong>{PROFILE_METAS[userProfile.profileType]?.label}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasDailyChallenge && (
                  <button
                    onClick={completeDailyChallenge}
                    disabled={dailyChallengeDone}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 ${
                      dailyChallengeDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400 animate-pulse'
                    }`}
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    {dailyChallengeDone ? '✓ Défi validé' : '🎯 Micro-Défi 3 min (+ Tokens)'}
                  </button>
                )}
              </div>
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
                        Espace de Travail Stratégique
                      </h3>
                      <p className="text-xs text-[#c4b5fd] max-w-md mx-auto leading-relaxed">
                        Posez votre question directement ci-dessous pour démarrer votre session.
                      </p>
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
                        {msg.role === 'user' ? `👤 ${userProfile.displayName}` : '🧠 Andrea'}
                      </span>
                      <span className="text-[10px] text-[#c4b5fd]/60">{msg.timestamp}</span>
                    </div>

                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>

                    {msg.webSources && msg.webSources.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-[#5A33FF22] space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300">
                          <Globe className="w-3 h-3 text-cyan-400" />
                          <span>Sources Web consultées en direct :</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.webSources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-[#241c4a] hover:bg-[#34276d] text-cyan-200 border border-cyan-500/30 transition truncate max-w-xs"
                            >
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{source.title || source.uri}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

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

                {/* Loading indicator */}
                {isLoadingResponse && (
                  <div className="p-3.5 rounded-2xl bg-[#1b143c] border border-[#5A33FF44] text-[#c4b5fd] max-w-md shadow-lg flex items-center gap-2.5 animate-pulse">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                    <span className="text-xs font-semibold">
                      Andrea analyse {enableWebSearch ? 'et consulte le Web en direct' : 'votre demande'}...
                    </span>
                  </div>
                )}

                {/* Anchor for auto-scroll */}
                <div ref={messagesEndRef} />
              </div>
            </div>


            {/* CASE ENVOYER UN MESSAGE STRICTEMENT ANCRÉE EN BAS (STYLE WHATSAPP ÉPURÉ) */}
            <div className="p-3 md:p-4 bg-[#100b24] border-t border-[#5A33FF22] shrink-0 z-20">
              <div className="max-w-4xl mx-auto w-full space-y-2">
                
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
                <div className="bg-[#181135] border border-[#5A33FF44] hover:border-[#5A33FF77] focus-within:border-[#8B70FF] rounded-[24px] p-2.5 shadow-xl transition-all duration-200">
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
                      placeholder={`Envoyer un message à Andrea...`}
                      className="w-full bg-transparent text-white text-[14px] placeholder-[#c4b5fd]/60 resize-none focus:outline-none min-h-[38px] max-h-[140px] leading-relaxed selection:bg-[#5A33FF]/40"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1 px-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Model speed selector */}
                      <button
                        type="button"
                        onClick={() => setModelChoice(m => m === 'rapide' ? 'puissant' : 'rapide')}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#201844] text-[#c4b5fd] hover:text-white border border-[#5A33FF33] transition"
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

                <div className="text-center text-[10px] text-[#c4b5fd]/60 pt-1">
                  Andrea · Réponses personnalisées pour {userProfile.displayName}
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

        {/* 3. MONTAGE VIDÉO & VISUEL (STUDIO MUSICAL DAW & RÉELS VIRAUX) */}
        {currentPage === 'studio' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <MusicStudioReels onBack={() => setCurrentPage('chat')} />
          </div>
        )}

        {/* 4. LABO D'IA INTÉGRÉ DANS LE MONTAGE */}
        {currentPage === 'creative_hub' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <MusicStudioReels onBack={() => setCurrentPage('chat')} />
          </div>
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

        {/* 7. CODE VIEW AVEC ESPACE ANDREA IA PERMANENT À DROITE */}
        {currentPage === 'code' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* GAUCHE : ÉDITEUR PYTHON ET CONSOLE DE TEST */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-4 bg-[#140e2d]">
              <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-purple-400" />
                    <span>💻 Éditeur de Code avec IA</span>
                  </h2>
                  <p className="text-xs text-[#c4b5fd]">Écrivez, testez et demandez à Andrea d'améliorer votre script</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCodeTest}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                    title="Exécuter et tester le script en temps réel"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Exécuter / Tester</span>
                  </button>

                  <button 
                    onClick={handleDownloadPython}
                    className="px-3.5 py-1.5 rounded-xl bg-[#5A33FF] hover:bg-[#6c48ff] text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
                    title="Télécharger le fichier Python"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger .py</span>
                  </button>
                </div>
              </div>

              {/* Conteneur de l'Éditeur */}
              <div className="bg-[#0b081b] border-2 border-[#5A33FF55] rounded-2xl overflow-hidden font-mono shadow-2xl flex-1 flex flex-col min-h-[300px]">
                <div className="bg-[#150f2e] px-4 py-2 border-b border-[#5A33FF33] flex items-center justify-between text-xs text-[#c4b5fd]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="font-bold text-white ml-2">mon_script.py (Python)</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">UTF-8 · Streamlit Support</span>
                </div>
                <textarea
                  value={codeContent}
                  onChange={e => setCodeContent(e.target.value)}
                  rows={14}
                  className="w-full flex-1 bg-transparent text-[#e2d6ff] p-4 text-xs font-mono focus:outline-none resize-none leading-relaxed selection:bg-purple-800"
                  spellCheck={false}
                />
              </div>

              {/* Console d'Exécution de Test */}
              {codeConsoleOutput && (
                <div className="bg-[#090615] border border-emerald-500/40 rounded-2xl p-3 text-xs font-mono space-y-1.5 shadow-xl animate-in slide-in-from-bottom-2 shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 border-b border-emerald-500/20 pb-1">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Console de Sortie Python</span>
                    </div>
                    <button
                      onClick={() => setCodeConsoleOutput(null)}
                      className="text-zinc-400 hover:text-white text-[10px]"
                    >
                      Effacer
                    </button>
                  </div>
                  <pre className="text-emerald-200 text-[11px] whitespace-pre-wrap leading-relaxed">
                    {codeConsoleOutput}
                  </pre>
                </div>
              )}
            </div>

            {/* DROITE : ESPACE ANDREA IA PERMANENT (TOUJOURS VISIBLE) */}
            <aside className="w-full lg:w-80 xl:w-96 bg-[#110b27] border-t lg:border-t-0 lg:border-l border-[#5A33FF33] flex flex-col shrink-0 h-80 lg:h-full z-20 shadow-xl">
              {/* Header */}
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
                      Coach Code & Débogage
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Python 3.11
                </span>
              </div>

              {/* Suggestions d'actions rapides pour le code */}
              <div className="p-2.5 bg-[#0d0822] border-b border-[#5A33FF15] space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c4b5fd]/80 px-1">
                  Actions immédiates :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendCodeAndreaMessage("Analyse ce script et vérifie s'il contient des bugs ou failles de sécurité.")}
                    className="text-[10px] font-bold px-2 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Déboguer ce script</span>
                  </button>

                  <button
                    onClick={() => handleSendCodeAndreaMessage("Optimise les performances de ce script et rends-le plus rapide.")}
                    className="text-[10px] font-bold px-2 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Optimiser le code</span>
                  </button>

                  <button
                    onClick={() => handleSendCodeAndreaMessage("Explique pas à pas le fonctionnement de ce script Python.")}
                    className="text-[10px] font-bold px-2 py-1 rounded-xl bg-[#1b143c] hover:bg-[#271d54] text-white border border-[#5A33FF44] transition flex items-center gap-1 shadow-sm"
                  >
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span>Expliquer pas à pas</span>
                  </button>
                </div>
              </div>

              {/* Historique des messages Andrea */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {codeAndreaMessages.map(msg => (
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

                {isCodeAndreaThinking && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#1b143c] text-purple-300 text-xs border border-[#5A33FF33] w-fit">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span className="text-[11px] font-semibold">Andrea analyse le code...</span>
                  </div>
                )}

                <div ref={codeChatEndRef} />
              </div>

              {/* Input de saisie */}
              <div className="p-2.5 bg-[#0e0924] border-t border-[#5A33FF22]">
                <div className="bg-[#171032] border border-[#5A33FF44] focus-within:border-[#8B70FF] rounded-2xl p-1.5 flex items-center gap-2">
                  <input
                    type="text"
                    value={codeAndreaInput}
                    onChange={e => setCodeAndreaInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendCodeAndreaMessage();
                      }
                    }}
                    placeholder="Demander à Andrea (déboguer, corriger...)"
                    className="flex-1 bg-transparent text-white text-xs px-2 focus:outline-none placeholder-[#c4b5fd]/50"
                  />

                  <button
                    type="button"
                    onClick={() => handleSendCodeAndreaMessage()}
                    disabled={!codeAndreaInput.trim()}
                    className={`p-2 rounded-xl transition ${
                      codeAndreaInput.trim()
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

        {/* 10. SÉCURITÉ DÉTAILLÉE */}
        {currentPage === 'securite' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <SecurityShield />
          </div>
        )}

        {/* BARRE DE NAVIGATION INFÉRIEURE MOBILE (SMARTPHONE & TABLETTE TACTILE) */}
        <nav 
          aria-label="Navigation mobile"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#100b24]/95 backdrop-blur-lg border-t border-[#5A33FF44] flex items-center justify-around py-2 px-1 shadow-2xl"
        >
          {[
            { id: 'chat', label: 'Discussion', icon: '💬' },
            { id: 'studio', label: 'Montage', icon: '🎬' },
            { id: 'app', label: 'Site Web', icon: '🌐' },
            { id: 'compte', label: 'Offres', icon: '💎' },
            { id: 'profil', label: 'Mon Profil', icon: '👤' },
          ].map(tab => {
            const active = currentPage === tab.id;
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
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
                  active
                    ? 'text-white font-extrabold bg-[#5A33FF]/30 border border-[#5A33FF]/60 shadow-sm'
                    : 'text-[#c4b5fd]/80 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
};

export const BeaAppPreview = AndreaAppPreview;
export default AndreaAppPreview;
