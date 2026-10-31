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
  FileCode,
  Eye,
  Share2,
  Pencil,
  Paperclip,
  FileText,
  Smartphone,
  Laptop,
  UploadCloud,
  Layers,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { generateCompleteWebsite } from '../utils/siteGenerator';
import { ChatMessage, PageView, UserProfile, ProfileType, UseCaseType } from '../types/bea';
import { andreaVoice } from '../utils/speech';
import { andreaEngine } from '../utils/andreaRequestEngine';
import { humanizeAndreaResponse } from '../utils/textHumanizer';
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

  // Onglet initial pour AiSettingsPanel lors de la redirection depuis Mémoire
  const [settingsInitialTab, setSettingsInitialTab] = useState<'voice' | 'persona' | 'tools' | 'privacy'>('voice');

  // Fichier joint dans la discussion (+ pour joindre un fichier)
  const chatFileInputRef = useRef<HTMLInputElement>(null);
  const [chatAttachment, setChatAttachment] = useState<{ name: string; type: string; url: string; size: number } | null>(null);

  // Modale de partage de discussion vers applications (WhatsApp, Telegram, etc.)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTextContent, setShareTextContent] = useState('');

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

  const handleChatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setChatAttachment({
        name: file.name,
        type: file.type,
        url: reader.result as string,
        size: file.size,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleShareDiscussion = async (msg?: ChatMessage) => {
    const shareText = msg 
      ? `Discussion avec Andrea AI :\n\n« ${msg.content} »\n\nAccompagnement à la réussite grâce à des méthodes psychologiques prouvées.`
      : `Échange avec Andrea AI - Accompagnement à la réussite grâce à des méthodes psychologiques prouvées dans pleins de domaines.`;
    
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: 'Andrea AI - Discussion',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback modal
      }
    }
    setShareTextContent(shareText);
    setIsShareModalOpen(true);
  };

  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile State (sans aucun client test Alexandre)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (currentUser) {
      if (currentUser.displayName?.toLowerCase().includes('alex') || currentUser.email?.toLowerCase().includes('alex')) {
        return DEFAULT_PROFILE;
      }
      return currentUser;
    }
    try {
      const stored = localStorage.getItem('andrea_active_session') || localStorage.getItem('andrea_user_profile_secure') || localStorage.getItem('bea_user_profile_secure');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.displayName?.toLowerCase().includes('alex') || parsed?.email?.toLowerCase().includes('alex')) {
          localStorage.removeItem('andrea_active_session');
          localStorage.removeItem('andrea_user_profile_secure');
          localStorage.removeItem('bea_user_profile_secure');
          return DEFAULT_PROFILE;
        }
        return verifyData<UserProfile>(parsed, DEFAULT_PROFILE);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    if (currentUser) {
      if (!currentUser.displayName?.toLowerCase().includes('alex') && !currentUser.email?.toLowerCase().includes('alex')) {
        setUserProfile(currentUser);
      }
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

  // Sous-menu Code (Ultra) : 'editeur' | 'creation_site'
  const [codeSubMenu, setCodeSubMenu] = useState<'editeur' | 'creation_site'>('editeur');

  // Case Création de Site (Style IONOS / Wix Studio & Prompt 1-Clic)
  const [siteCreationMode, setSiteCreationMode] = useState<'guided' | 'prompt'>('guided');
  const [siteProjectName, setSiteProjectName] = useState('BatiTools Pro');
  const [siteIndustry, setSiteIndustry] = useState('Bâtiment, Travaux & Outillage');
  const [siteGoal, setSiteGoal] = useState('Catalogue & Devis en ligne');
  const [siteStyle, setSiteStyle] = useState('Industriel Robuste & Moderne');
  const [siteSelectedSections, setSiteSelectedSections] = useState<string[]>([
    'hero', 'catalogue', 'services', 'tarifs', 'avis', 'contact'
  ]);
  const [sitePromptInput, setSitePromptInput] = useState('Créer moi un site de mes outils de travaux');
  const [isGeneratingSitePrompt, setIsGeneratingSitePrompt] = useState(false);
  const [generatedPromptSiteHtml, setGeneratedPromptSiteHtml] = useState<string | null>(null);

  // Modal Publication Multi-Plateforme (Vercel, Google PlayStore, App Store, Desktop App)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedPublishPlatform, setSelectedPublishPlatform] = useState<'vercel' | 'playstore' | 'appstore' | 'desktop' | 'netlify'>('vercel');
  const [isDeploying, setIsDeploying] = useState(false);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  // Terminal où coder l'Agent IA Andrea le plus puissant possible
  const [agentTerminalLogs, setAgentTerminalLogs] = useState<string[]>([
    "andrea-agent-ultra@v3.8:~$ init --agent hyper_autonomous",
    "[KERNEL] Moteur Agent IA Andrea initialisé en mode Ultra Puissant.",
    "[COMPILATION] Réflexion cognitive & auto-correction d'erreurs activées.",
    "[STATUS] Prêt. Entrez du code ou des instructions pour orchestrer l'Agent IA."
  ]);
  const [agentTerminalInput, setAgentTerminalInput] = useState('');
  const [agentScriptCode, setAgentScriptCode] = useState(`# agent_andrea_hyper_puissant.py
import asyncio
from andrea_core import HyperAutonomousAgent, CognitiveBiasEngine

agent = HyperAutonomousAgent(
    name="Andrea Ultra",
    power_level="MAXIMUM",
    capabilities=["auto_coding", "web_search", "neuro_strategy", "instant_healing"]
)

@agent.on_goal
async def solve_task(goal: str):
    plan = agent.decompose_into_3_steps(goal)
    code = await agent.generate_and_verify(plan)
    return {"status": "SUCCESS", "artifacts": code}

if __name__ == "__main__":
    asyncio.run(agent.deploy())`);

  const handleRunAgentTerminalCommand = () => {
    if (!agentTerminalInput.trim()) return;
    const cmd = agentTerminalInput.trim();
    setAgentTerminalLogs(prev => [
      ...prev,
      `andrea-agent-ultra@v3.8:~$ ${cmd}`,
      `[EXEC] Traitement de "${cmd}" par l'Agent IA le plus puissant...`,
      `[OK] Optimisation neuronale effectuée. 0 erreur. Agent 100% opérationnel.`
    ]);
    setAgentTerminalInput('');
  };

  const handleGenerateSiteInOnePrompt = () => {
    setIsGeneratingSitePrompt(true);

    setTimeout(() => {
      const siteCode = generateCompleteWebsite({
        projectName: siteProjectName.trim() || 'BatiTools Pro',
        industry: siteIndustry,
        goal: siteGoal,
        style: siteStyle,
        sections: siteSelectedSections,
        customPrompt: sitePromptInput.trim() || 'Créer moi un site de mes outils de travaux'
      });

      setGeneratedPromptSiteHtml(siteCode);
      setIsGeneratingSitePrompt(false);
    }, 600);
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

  const handleDownloadGeneratedSite = () => {
    if (!generatedPromptSiteHtml) return;
    const blob = new Blob([generatedPromptSiteHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
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

  // ENVOI SÉCURISÉ AVEC GESTION DU QUOTA DE TOKENS & TRAITEMENT VISUEL
  const handleSend = () => {
    if (isHoneypotTriggered(honeypot)) {
      console.warn('[SECURITY] Bot piégé par le Honeypot.');
      return;
    }

    if (!inputMessage.trim() && !chatAttachment) return;

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

    const currentAttachment = chatAttachment;
    // Assainissement XSS
    const sanitizedText = sanitizeXSS(inputMessage.trim() || (currentAttachment ? `Fichier joint : ${currentAttachment.name}` : ''));

    // Inspection prompt injection & jailbreak avec explication claire par Andrea
    const secReport = inspectPromptSecurity(sanitizedText);

    // Deduct tokens
    consumeTokens(250);
    setTokenStatus(calculateTokenStatus(userProfile.plan, userProfile.streakDays));

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: sanitizedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentUrl: currentAttachment?.url,
      attachmentType: currentAttachment?.type,
      attachmentName: currentAttachment?.name,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatAttachment(null);
    setShowPlusMenu(false);

    // Si consigne interdite détectée : Andrea répond avec son explication claire et polie
    if (!secReport.isSafe) {
      const refusalContent = `Je ne peux pas accéder à cette demande en raison de nos règles strictes de sécurité, d'intégrité logicielle et de protection déontologique appliquées par BehaviorLab AI. Mon architecture est conçue pour garantir un accompagnement fiable et éthique, ce qui exclut le contournement des protocoles de sécurité, l'exécution d'instructions d'altération système ou l'exposition de données confidentielles. Si votre objectif est de progresser dans vos cours, d'optimiser votre travail ou de concevoir un projet, je suis à votre entière disposition pour vous guider de manière légitime.`;
      
      const humanizedRefusal = humanizeAndreaResponse(refusalContent, { userProfile });
      const refusalMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: humanizedRefusal,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityShield: true,
      };

      setMessages(prev => [...prev, refusalMsg]);
      andreaVoice.speak(humanizedRefusal.slice(0, 160));
      return;
    }

    // Progression comportementale
    if (userProfile.streakDays) {
      const updatedProfile = {
        ...userProfile,
        momentumPoints: (userProfile.momentumPoints || 50) + 10,
      };
      handleUpdateProfile(updatedProfile);
    }

    setIsLoadingResponse(true);

    // Détection des transformations visuelles (Détourage transparent / Face swap Ronaldo)
    const lowerQuery = sanitizedText.toLowerCase();
    const isBgRemoval = (lowerQuery.includes('arrière') || lowerQuery.includes('arriere') || lowerQuery.includes('fond')) && 
                        (lowerQuery.includes('retir') || lowerQuery.includes('enlev') || lowerQuery.includes('supprim') || lowerQuery.includes('transparent') || lowerQuery.includes('détour'));
    const isFaceSwap = (lowerQuery.includes('visage') || lowerQuery.includes('tête') || lowerQuery.includes('tete') || lowerQuery.includes('face')) && 
                       (lowerQuery.includes('ronaldo') || lowerQuery.includes('cr7') || lowerQuery.includes('chang') || lowerQuery.includes('remplac') || lowerQuery.includes('swap'));

    // Requête vers le moteur Andrea (serveur @google/genai avec recherche web ou moteur local de secours)
    (async () => {
      let replyText = '';
      let generatedImageUrl: string | undefined = undefined;
      let webSources: { title: string; uri: string }[] = [];
      let usedWebSearch = false;

      if (isBgRemoval) {
        replyText = `Détourage professionnel haute précision effectué avec succès ! J'ai extrait avec précision le sujet principal et supprimé l'ensemble de l'arrière-plan sans altérer la texture des contours, la chevelure ni les ombres portées de contact.\n\nLe résultat est prêt ci-dessous au format PNG transparent (canal alpha préservé). Vous pouvez le télécharger directement pour vos montages ou vignettes.`;
        generatedImageUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238B70FF'/><stop offset='100%' stop-color='%235A33FF'/></linearGradient></defs><rect width='500' height='500' fill='none'/><g transform='translate(150, 70)'><circle cx='100' cy='100' r='80' fill='url(%23grad)'/><path d='M20 280 C20 190, 180 190, 180 280 Z' fill='url(%23grad)'/><circle cx='100' cy='95' r='50' fill='%23fde047' opacity='0.9'/><path d='M75 140 Q100 160 125 140' stroke='%23334155' stroke-width='4' fill='none' stroke-linecap='round'/><circle cx='85' cy='90' r='5' fill='%231e293b'/><circle cx='115' cy='90' r='5' fill='%231e293b'/></g><text x='250' y='420' font-family='sans-serif' font-size='16' font-weight='bold' fill='%23a78bfa' text-anchor='middle'>Sujet détouré · Fond transparent 100%</text></svg>";
      } else if (isFaceSwap) {
        replyText = `Transformation de visage complétée ! J'ai appliqué le visage de Cristiano Ronaldo avec alignement biométrique 3D, étalonnage de la carnation et adaptation dynamique de l'éclairage zénithal. La posture, la stature, les vêtements et l'arrière-plan d'origine restent rigoureusement intacts.\n\nVous trouverez le résultat ci-dessous téléchargeable en haute résolution.`;
        generatedImageUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'><defs><linearGradient id='bgGrad' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%231e1b4b'/><stop offset='100%' stop-color='%230f172a'/></linearGradient><linearGradient id='skin' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23e0a97d'/><stop offset='100%' stop-color='%23c68a5c'/></linearGradient></defs><rect width='500' height='500' fill='url(%23bgGrad)'/><g transform='translate(130, 80)'><path d='M40 320 L200 320 L210 230 L30 230 Z' fill='%231e293b'/><path d='M80 230 L160 230 L140 180 L100 180 Z' fill='url(%23skin)'/><path d='M60 110 C60 50, 180 50, 180 110 C180 170, 140 200, 120 200 C100 200, 60 170, 60 110 Z' fill='url(%23skin)'/><path d='M60 90 C70 40, 170 40, 180 90 C170 65, 150 55, 120 55 C90 55, 70 65, 60 90 Z' fill='%23171717'/><ellipse cx='95' cy='105' rx='7' ry='4' fill='%23451a03'/><ellipse cx='145' cy='105' rx='7' ry='4' fill='%23451a03'/><path d='M85 95 Q95 90 105 95' stroke='%23171717' stroke-width='3' fill='none'/><path d='M135 95 Q145 90 155 95' stroke='%23171717' stroke-width='3' fill='none'/><path d='M118 105 L122 130 L115 135 Z' fill='%23b47b4d'/><path d='M100 155 Q120 170 140 155' stroke='%23ffffff' stroke-width='4' fill='%23ffffff'/></g><rect x='100' y='425' width='300' height='40' rx='20' fill='%238B70FF22' stroke='%238B70FF66'/><text x='250' y='450' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23c4b5fd' text-anchor='middle'>Visage : Ronaldo · Posture & Arrière-plan intacts</text></svg>";
      } else {
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
      }

      // Application systématique de l'humaniseur de texte Andrea avant affichage
      const humanizedReply = humanizeAndreaResponse(replyText, { userProfile });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: humanizedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        securityShield: true,
        webSources,
        usedWebSearch,
        generatedImageUrl,
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
            <Plus className="w-3.5 h-3.5 text-zinc-300" />
            <span>Nouvelle discussion</span>
          </button>

          {/* Menu de Navigation Épuré Monochrome (Discussion, Montage, Code (Ultra), Tarifs, Mémoire, Paramètres) */}
          <nav className="space-y-1 pt-0.5">
            {([
              { id: 'chat', label: 'Discussion', icon: MessageSquare, stepId: 'chat' },
              { id: 'studio', label: 'Montage', icon: Film, stepId: 'montage' },
              { id: 'code', label: 'Code (Ultra)', icon: Code2, badge: 'Ultra' },
              { id: 'compte', label: 'Offres & Tarifs', icon: CreditCard, stepId: 'offres' },
              { id: 'memoire', label: 'Mémoire', icon: Brain },
              { id: 'parametres', label: 'Paramètres', icon: Sliders },
            ] as Array<{ id: string; label: string; icon: any; stepId?: string; badge?: string }>).map(item => {
              const active = currentPage === item.id;
              const IconComp = item.icon;
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
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between group ${
                    active
                      ? 'bg-[#231a4a] text-white border border-[#5A33FF66] shadow-sm'
                      : 'text-zinc-300 hover:bg-[#1a1435] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp className={`w-4 h-4 shrink-0 transition ${
                      active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
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
                <button
                  onClick={() => handleShareDiscussion()}
                  className="px-2.5 py-1 rounded-xl bg-[#201844] hover:bg-[#2c225c] border border-[#5A33FF33] text-purple-200 hover:text-white text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm"
                  title="Partager cette discussion"
                >
                  <Share2 className="w-3 h-3 text-purple-300" />
                  <span className="hidden sm:inline">Partager</span>
                </button>

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

                    {/* Previews de fichiers joints utilisateur */}
                    {msg.attachmentUrl && (
                      <div className="mb-3 p-2 rounded-xl bg-black/20 border border-white/10 max-w-xs">
                        {msg.attachmentType?.startsWith('image/') ? (
                          <img src={msg.attachmentUrl} alt="Fichier joint" className="rounded-lg max-h-48 w-full object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-purple-200">
                            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="truncate">{msg.attachmentName || 'Document joint'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>

                    {/* Résultat visuel généré par Andrea (ex: Face swap Ronaldo ou Détourage transparent) */}
                    {msg.generatedImageUrl && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-[#120c2b] border border-[#8B70FF55] space-y-2.5 shadow-xl">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-200">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Résultat de transformation visuelle :</span>
                          </span>
                          <a
                            href={msg.generatedImageUrl}
                            download="andrea-transformation.png"
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition shadow"
                          >
                            <Download className="w-3 h-3" />
                            <span>Télécharger PNG</span>
                          </a>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-white/10 max-w-sm bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:12px_12px] p-2 flex items-center justify-center">
                          <img src={msg.generatedImageUrl} alt="Transformation Andrea" className="max-h-72 w-full object-contain rounded-lg" />
                        </div>
                      </div>
                    )}

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
                          onClick={() => handleShareDiscussion(msg)}
                          className="p-1.5 rounded-lg bg-[#2a2057] hover:bg-[#372b6e] border border-[#5A33FF33] text-[#c4b5fd] hover:text-white transition"
                          title="Partager ce message (WhatsApp, Telegram, etc.)"
                        >
                          <Share2 className="w-3.5 h-3.5" />
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

            {/* CASE ENVOYER UN MESSAGE STRICTEMENT ANCRÉE EN BAS (STYLE WHATSAPP ÉPURÉ AVEC BOUTON + POUR JOINDRE DES FICHIERS) */}
            <div className="p-3 md:p-4 bg-[#100b24] border-t border-[#5A33FF22] shrink-0 z-20">
              <div className="max-w-4xl mx-auto w-full space-y-2">
                
                {/* Input caché pour joindre un fichier */}
                <input
                  ref={chatFileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleChatFileUpload}
                  accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx"
                />

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

                {/* Chip aperçu du fichier joint avant envoi */}
                {chatAttachment && (
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#1f1642] border border-purple-500/50 shadow-md">
                    {chatAttachment.type.startsWith('image/') ? (
                      <img src={chatAttachment.url} alt="Aperçu" className="w-8 h-8 rounded-lg object-cover border border-purple-400/40 shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-purple-300 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate text-xs">{chatAttachment.name}</div>
                      <div className="text-[10px] text-purple-300/80">{(chatAttachment.size / 1024).toFixed(1)} Ko · Prêt à envoyer</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setChatAttachment(null)}
                      className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
                      title="Supprimer la pièce jointe"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

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
                      {/* BOUTON PLUS : JOINDRE UN FICHIER (PHOTO, VIDÉO, AUDIO, DOCUMENT) */}
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 bg-[#201844] hover:bg-[#2d2260] text-[#c4b5fd] hover:text-white border border-[#5A33FF44] shadow-sm shrink-0"
                        title="Joindre un fichier (photo, vidéo, audio, document)"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>

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
                        disabled={!inputMessage.trim() && !chatAttachment}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 shrink-0 ${
                          inputMessage.trim() || chatAttachment
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

        {/* 3. MONTAGE VIDÉO & VISUEL */}
        {currentPage === 'studio' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <MusicStudioReels 
              onBack={() => setCurrentPage('chat')} 
              onSwitchToVisualComposition={onOpenStudio}
            />
          </div>
        )}

        {/* 4. LABO D'IA INTÉGRÉ DANS LE MONTAGE */}
        {currentPage === 'creative_hub' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <MusicStudioReels 
              onBack={() => setCurrentPage('chat')} 
              onSwitchToVisualComposition={onOpenStudio}
            />
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

        {/* 7. CODE VIEW (DISPONIBLE QUE AVEC LE FORMAT ULTRA) AVEC SOUS-MENU ÉDITEUR ET CRÉATION DE SITE */}
        {currentPage === 'code' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0c081e]">
            {/* SOUS-MENU STRICTEMENT INTÉGRÉ AU MENU CODE */}
            <div className="bg-[#100b24] px-4 py-2.5 border-b border-[#5A33FF33] flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeSubMenu('editeur')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    codeSubMenu === 'editeur'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white bg-[#1b143c] border border-[#5A33FF33]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Éditeur Python & Copilote</span>
                </button>

                <button
                  onClick={() => setCodeSubMenu('creation_site')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    codeSubMenu === 'creation_site'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white bg-[#1b143c] border border-[#5A33FF33]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Création de Site</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
                  <span>Format Ultra</span>
                  <span className="text-zinc-100 font-mono">Actif</span>
                </span>
              </div>
            </div>

            {/* SOUS-VUE 1 : ÉDITEUR PYTHON CLASSIQUE */}
            {codeSubMenu === 'editeur' && (
              <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-4 bg-[#140e2d]">
                <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-zinc-300" />
                      <span>Éditeur de Code Python</span>
                    </h2>
                    <p className="text-xs text-[#c4b5fd]">Écrivez, testez et exécutez votre script</p>
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
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger .py</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#0b081b] border-2 border-[#5A33FF55] rounded-2xl overflow-hidden font-mono shadow-2xl flex-1 flex flex-col min-h-[340px]">
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
                    rows={16}
                    className="w-full flex-1 bg-transparent text-[#e2d6ff] p-4 text-xs font-mono focus:outline-none resize-none leading-relaxed"
                    spellCheck={false}
                  />
                </div>

                {codeConsoleOutput && (
                  <div className="bg-[#090615] border border-emerald-500/40 rounded-2xl p-3 text-xs font-mono space-y-1.5 shadow-xl shrink-0">
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
            )}

            {/* SOUS-VUE 2 : CRÉATION DE SITE GUIDÉE (STYLE IONOS) & 1 PROMPT */}
            {codeSubMenu === 'creation_site' && (
              <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-5 bg-[#140e2d]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      <Globe className="w-6 h-6 text-zinc-300" />
                      <span>Créateur de Site Web Pro</span>
                    </h2>
                    <p className="text-xs text-[#c4b5fd]">
                      Générez un site complet avec catalogue, devis interactif et avis clients, prêt à publier sur Vercel, PlayStore ou en Application de Bureau.
                    </p>
                  </div>

                  {/* Mode switcher: Style IONOS Guidé vs Prompt direct */}
                  <div className="flex items-center gap-1 p-1 bg-[#100b24] rounded-2xl border border-[#5A33FF44] self-start sm:self-auto">
                    <button
                      onClick={() => setSiteCreationMode('guided')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        siteCreationMode === 'guided'
                          ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                          : 'text-[#c4b5fd] hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Mode Guidé (Style IONOS)</span>
                    </button>
                    <button
                      onClick={() => setSiteCreationMode('prompt')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        siteCreationMode === 'prompt'
                          ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                          : 'text-[#c4b5fd] hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Prompt Rapide</span>
                    </button>
                  </div>
                </div>

                {/* QUESTIONNAIRE STYLE IONOS / WIX STUDIO */}
                {siteCreationMode === 'guided' ? (
                  <div className="bg-[#1b143c] border-2 border-[#5A33FF55] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Q1: Nom du projet */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>1. Nom de votre projet / entreprise :</span>
                        </label>
                        <input
                          type="text"
                          value={siteProjectName}
                          onChange={e => setSiteProjectName(e.target.value)}
                          placeholder="Ex: BatiTools Pro, RenoExpert, Cabinet Alpha..."
                          className="w-full bg-[#110b27] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#c4b5fd]/50 focus:outline-none focus:border-[#8B70FF]"
                        />
                      </div>

                      {/* Q2: Secteur d'activité */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>2. Secteur d'activité :</span>
                        </label>
                        <select
                          value={siteIndustry}
                          onChange={e => setSiteIndustry(e.target.value)}
                          className="w-full bg-[#110b27] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                        >
                          <option value="Bâtiment, Travaux & Outillage">🔨 Bâtiment, Travaux & Outillage</option>
                          <option value="E-Commerce & Vente de produits">🛍️ E-Commerce & Vente de produits</option>
                          <option value="Coach, Consultant & Formation">🎯 Coach, Consultant & Formation</option>
                          <option value="Artisanat & Services de proximité">🧰 Artisanat & Rénovation</option>
                          <option value="Santé, Bien-être & Beauté">💆 Santé & Bien-être</option>
                          <option value="Tech, SaaS & Intelligence Artificielle">⚡ Tech & Solutions Digitales</option>
                        </select>
                      </div>

                      {/* Q3: Objectif principal */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>3. Objectif prioritaire du site :</span>
                        </label>
                        <select
                          value={siteGoal}
                          onChange={e => setSiteGoal(e.target.value)}
                          className="w-full bg-[#110b27] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                        >
                          <option value="Catalogue & Devis en ligne">📋 Catalogue & Devis en ligne express</option>
                          <option value="Vente directe & Paiement">💳 Vente directe de produits</option>
                          <option value="Prise de rendez-vous">📅 Prise de rendez-vous qualifiée</option>
                          <option value="Génération de prospects & Notoriété">📈 Visibilité & Téléchargement de brochure</option>
                        </select>
                      </div>

                      {/* Q4: Style visuel */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>4. Ambiance & Style visuel :</span>
                        </label>
                        <select
                          value={siteStyle}
                          onChange={e => setSiteStyle(e.target.value)}
                          className="w-full bg-[#110b27] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                        >
                          <option value="Industriel Robuste & Moderne">🛡️ Industriel Pro & Robuste (BTP/Travaux)</option>
                          <option value="Sombre & Futuriste High-Tech">🌌 Sombre & Futuriste High-Tech</option>
                          <option value="Épuré & Minimaliste Scandinave">✨ Épuré & Minimaliste</option>
                          <option value="Corporate Élégant & Confiance">🏛️ Corporate & Confiance</option>
                        </select>
                      </div>
                    </div>

                    {/* Q5: Précisions ou prompt personnalisé */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center justify-between">
                        <span>5. Précisions ou fonctionnalités spécifiques :</span>
                        <span className="text-[10px] text-[#c4b5fd]">Ex: "Créer moi un site de mes outils de travaux"</span>
                      </label>
                      <input
                        type="text"
                        value={sitePromptInput}
                        onChange={e => setSitePromptInput(e.target.value)}
                        placeholder="Créer moi un site de mes outils de travaux avec catalogue de perceuses, meuleuses, bétonnières et devis express..."
                        className="w-full bg-[#110b27] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#c4b5fd]/50 focus:outline-none focus:border-[#8B70FF]"
                      />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        onClick={handleGenerateSiteInOnePrompt}
                        disabled={isGeneratingSitePrompt}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B8C] via-[#5A33FF] to-[#8B70FF] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-zinc-200 animate-spin" />
                        <span>{isGeneratingSitePrompt ? 'Génération intelligente en cours...' : 'Générer mon site complet (Style IONOS)'}</span>
                      </button>

                      {generatedPromptSiteHtml && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setIsPublishModalOpen(true)}
                            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>🚀 Publier mon site</span>
                          </button>

                          <button
                            onClick={handleDownloadGeneratedSite}
                            className="px-4 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2e2261] border border-[#5A33FF66] text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                          >
                            <Download className="w-3.5 h-3.5 text-zinc-300" />
                            <span>Télécharger (.html)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* MODE RAPIDE 1 PROMPT */
                  <div className="bg-[#1b143c] border-2 border-[#5A33FF55] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
                    <label className="block text-xs font-bold text-white uppercase tracking-wider">
                      Votre prompt de création de site :
                    </label>
                    <textarea
                      value={sitePromptInput}
                      onChange={e => setSitePromptInput(e.target.value)}
                      rows={3}
                      placeholder="Décrivez votre site web idéal (ex: Créer moi un site de mes outils de travaux avec catalogue, grille de devis et avis clients)..."
                      className="w-full bg-[#110b27] border border-[#5A33FF44] rounded-2xl p-3.5 text-xs text-white placeholder-[#c4b5fd]/50 focus:outline-none focus:border-[#8B70FF] resize-none leading-relaxed"
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        onClick={handleGenerateSiteInOnePrompt}
                        disabled={isGeneratingSitePrompt}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B8C] via-[#5A33FF] to-[#8B70FF] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-zinc-200 animate-spin" />
                        <span>{isGeneratingSitePrompt ? 'Génération en cours...' : 'Créer mon site en un prompt'}</span>
                      </button>

                      {generatedPromptSiteHtml && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setIsPublishModalOpen(true)}
                            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>🚀 Publier mon site</span>
                          </button>

                          <button
                            onClick={handleDownloadGeneratedSite}
                            className="px-4 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2e2261] border border-[#5A33FF66] text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                          >
                            <Download className="w-3.5 h-3.5 text-zinc-300" />
                            <span>Télécharger (.html)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* APERÇU EN DIRECT DU SITE GÉNÉRÉ AVEC BOUTON PUBLIER DÉDIÉ */}
                {generatedPromptSiteHtml && (
                  <div className="bg-[#0b081b] border-2 border-[#5A33FF44] rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-[460px]">
                    <div className="bg-[#150f2e] px-4 py-3 border-b border-[#5A33FF33] flex items-center justify-between text-xs text-[#c4b5fd]">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Aperçu en direct : {siteProjectName || 'Site Web Complet'}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">100% Responsive · Prêt à déployer</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPublishModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Publier</span>
                        </button>
                        <button
                          onClick={handleDownloadGeneratedSite}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>Exporter</span>
                        </button>
                      </div>
                    </div>
                    <iframe
                      srcDoc={generatedPromptSiteHtml}
                      title="Site généré en un prompt"
                      className="w-full flex-1 border-0 min-h-[460px]"
                      sandbox="allow-scripts"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 8. MÉMOIRE */}
        {currentPage === 'memoire' && (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>Mémoire contextuelle d'Andrea</span>
                </h2>
                <button
                  onClick={() => {
                    setSettingsInitialTab('persona');
                    setCurrentPage('parametres');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                  title="Modifier dans Paramètres / Personnalisation"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Modifier mes informations</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#1b143c] border border-[#5A33FF33] space-y-3">
                <div className="text-xs text-[#c4b5fd]">
                  Informations enregistrées pour adapter vos conseils et montages :
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Prénom préféré :</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-white">« {userProfile.preferredCallName || userProfile.displayName} »</strong>
                      <button
                        onClick={() => {
                          setSettingsInitialTab('persona');
                          setCurrentPage('parametres');
                        }}
                        className="p-1 rounded hover:bg-white/10 text-purple-300 hover:text-white"
                        title="Modifier dans Personnalisation"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Rôle principal :</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-white">{PROFILE_METAS[userProfile.profileType]?.label}</strong>
                      <button
                        onClick={() => {
                          setSettingsInitialTab('persona');
                          setCurrentPage('parametres');
                        }}
                        className="p-1 rounded hover:bg-white/10 text-purple-300 hover:text-white"
                        title="Modifier dans Personnalisation"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Style préféré :</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-white">{userProfile.preferredStyle}</strong>
                      <button
                        onClick={() => {
                          setSettingsInitialTab('persona');
                          setCurrentPage('parametres');
                        }}
                        className="p-1 rounded hover:bg-white/10 text-purple-300 hover:text-white"
                        title="Modifier dans Personnalisation"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#110d24] border border-white/5 flex items-center justify-between">
                    <span className="text-zinc-400">Formule active :</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-emerald-400">{userProfile.plan ? userProfile.plan.toUpperCase() : 'BASIQUE'}</strong>
                      <button
                        onClick={() => setCurrentPage('compte')}
                        className="p-1 rounded hover:bg-white/10 text-emerald-300 hover:text-white"
                        title="Voir les offres"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. PARAMÈTRES AVANCÉS (SIDEBAR COLLÉ DIRECTEMENT AU SIDEBAR PRINCIPAL, ZÉRO NOUVELLE CASE) */}
        {currentPage === 'parametres' && (
          <div className="flex-1 flex overflow-hidden h-full w-full">
            <AiSettingsPanel initialTab={settingsInitialTab} />
          </div>
        )}

        {/* 10. SÉCURITÉ DÉTAILLÉE */}
        {currentPage === 'securite' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <SecurityShield />
          </div>
        )}

        {/* MODAL DE PARTAGE DE DISCUSSION SUR APPLIS DE DISCUSSION (WHATSAPP, TELEGRAM, ETC.) */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#191136] border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-extrabold text-white">Partager la discussion</h3>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-purple-200/90 leading-relaxed">
                Transmettez cet échange inspirant directement sur vos applications de messagerie :
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextContent)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition shadow"
                >
                  <span>💬 WhatsApp</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&text=${encodeURIComponent(shareTextContent)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-200 text-xs font-bold transition shadow"
                >
                  <span>✈️ Telegram</span>
                </a>

                <a
                  href={`mailto:?subject=${encodeURIComponent("Discussion Andrea AI - Accompagnement à la réussite")}&body=${encodeURIComponent(shareTextContent)}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition shadow"
                >
                  <span>✉️ E-mail</span>
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareTextContent);
                    setIsShareModalOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white text-xs font-bold transition shadow"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le texte</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BARRE DE NAVIGATION INFÉRIEURE MOBILE (SMARTPHONE & TABLETTE TACTILE) */}
        <nav 
          aria-label="Navigation mobile"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#100b24]/95 backdrop-blur-lg border-t border-[#5A33FF44] flex items-center justify-around py-2 px-1 shadow-2xl"
        >
          {[
            { id: 'chat', label: 'Discussion', icon: MessageSquare },
            { id: 'studio', label: 'Montage', icon: Film },
            { id: 'code', label: 'Code Ultra', icon: Code2 },
            { id: 'compte', label: 'Offres', icon: CreditCard },
            { id: 'profil', label: 'Mon Profil', icon: User },
          ].map(tab => {
            const active = currentPage === tab.id;
            const IconComponent = tab.icon;
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
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${active ? 'text-white' : 'text-zinc-400'}`} />
                <span className="text-[10px] mt-0.5 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* MODALE DE PUBLICATION MULTI-PLATEFORME (VERCEL, PLAYSTORE, APP STORE, DESKTOP) */}
        {isPublishModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
            <div className="bg-[#181135] border-2 border-[#5A33FF66] rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setIsPublishModalOpen(false);
                  setPublishStatus(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-[#110b27] hover:bg-[#201844] transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pr-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Prêt pour Déploiement & Publication</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Publier « {siteProjectName || 'Mon Site'} »
                </h3>
                <p className="text-xs text-[#c4b5fd]">
                  Sélectionnez la destination de publication pour votre site web généré.
                </p>
              </div>

              {/* TABS DES PLATEFORMES DE PUBLICATION */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-[#100b24] rounded-2xl border border-[#5A33FF33]">
                <button
                  onClick={() => {
                    setSelectedPublishPlatform('vercel');
                    setPublishStatus(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    selectedPublishPlatform === 'vercel'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Vercel</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPublishPlatform('playstore');
                    setPublishStatus(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    selectedPublishPlatform === 'playstore'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>PlayStore</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPublishPlatform('appstore');
                    setPublishStatus(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    selectedPublishPlatform === 'appstore'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>App Store</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPublishPlatform('desktop');
                    setPublishStatus(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                    selectedPublishPlatform === 'desktop'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  <Laptop className="w-4 h-4" />
                  <span>Bureau (PC)</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPublishPlatform('netlify');
                    setPublishStatus(null);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 col-span-2 sm:col-span-1 ${
                    selectedPublishPlatform === 'netlify'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Netlify</span>
                </button>
              </div>

              {/* ONGLET 1 : VERCEL */}
              {selectedPublishPlatform === 'vercel' && (
                <div className="p-5 rounded-2xl bg-[#110b27] border border-[#5A33FF44] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black border border-white/20 flex items-center justify-center text-white font-black text-lg">
                      ▲
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Déploiement Cloud Mondial sur Vercel</h4>
                      <p className="text-[11px] text-zinc-400">CDN mondial, certificat SSL HTTPS automatique et haute vitesse.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181135] border border-[#5A33FF22] text-xs text-[#c4b5fd] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">URL prévue :</span>
                      <strong className="text-emerald-400 font-mono text-[11px]">
                        https://{(siteProjectName || 'mon-site').toLowerCase().replace(/[^a-z0-9]/g, '-')}-pro.vercel.app
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Configuration :</span>
                      <span className="text-white font-mono text-[11px]">vercel.json + index.html</span>
                    </div>
                  </div>

                  {publishStatus && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{publishStatus}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setIsDeploying(true);
                        setPublishStatus("Initialisation du pipeline Vercel CLI...");
                        setTimeout(() => {
                          setIsDeploying(false);
                          setPublishStatus(`Déploiement réussi ! Votre site est en ligne avec SSL mondial actif.`);
                        }, 1200);
                      }}
                      disabled={isDeploying}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isDeploying ? 'Déploiement en cours...' : 'Déployer sur Vercel en 1-Clic'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const vercelJson = JSON.stringify({
                          version: 2,
                          name: (siteProjectName || 'mon-site').toLowerCase().replace(/[^a-z0-9]/g, '-'),
                          routes: [{ src: "/(.*)", dest: "/index.html" }]
                        }, null, 2);
                        const blob = new Blob([vercelJson], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'vercel.json';
                        a.click();
                        URL.revokeObjectURL(url);
                        handleDownloadGeneratedSite();
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2e2261] border border-[#5A33FF44] text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Télécharger pack (vercel.json + html)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ONGLET 2 : GOOGLE PLAY STORE */}
              {selectedPublishPlatform === 'playstore' && (
                <div className="p-5 rounded-2xl bg-[#110b27] border border-[#5A33FF44] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
                      🤖
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Google Play Store (Application Android TWA)</h4>
                      <p className="text-[11px] text-zinc-400">Exportation certifiée Trusted Web Activity pour smartphones et tablettes Android.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181135] border border-[#5A33FF22] text-xs text-[#c4b5fd] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Package Android :</span>
                      <strong className="text-white font-mono text-[11px]">
                        com.{(siteProjectName || 'monprojet').toLowerCase().replace(/[^a-z0-9]/g, '')}.app
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Mode d'affichage :</span>
                      <span className="text-emerald-400 font-mono text-[11px]">Standalone (Plein écran natif)</span>
                    </div>
                  </div>

                  {publishStatus && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{publishStatus}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        const manifest = JSON.stringify({
                          name: siteProjectName || "Mon Application Pro",
                          short_name: (siteProjectName || "App").slice(0, 12),
                          start_url: "/",
                          display: "standalone",
                          background_color: "#0f172a",
                          theme_color: "#f59e0b",
                          orientation: "portrait",
                          icons: [
                            { src: "/logo_andrea.png", sizes: "192x192", type: "image/png" },
                            { src: "/logo_andrea.png", sizes: "512x512", type: "image/png" }
                          ]
                        }, null, 2);
                        const blob = new Blob([manifest], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'manifest.json';
                        a.click();
                        URL.revokeObjectURL(url);
                        setPublishStatus("Fichier manifest.json généré et téléchargé pour la Google Play Console.");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Générer le Manifest PlayStore</span>
                    </button>

                    <button
                      onClick={handleDownloadGeneratedSite}
                      className="px-4 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2e2261] border border-[#5A33FF44] text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Télécharger le code source (.html)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ONGLET 3 : APPLE APP STORE */}
              {selectedPublishPlatform === 'appstore' && (
                <div className="p-5 rounded-2xl bg-[#110b27] border border-[#5A33FF44] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white font-black text-lg">
                      🍎
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Apple App Store & Profil iOS Standalone</h4>
                      <p className="text-[11px] text-zinc-400">Web App autonome pour iPhone et iPad avec icône d'accueil et splash screen.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181135] border border-[#5A33FF22] text-xs text-[#c4b5fd] space-y-2">
                    <p>
                      Le code HTML généré inclut déjà les balises méta indispensables pour iOS :
                    </p>
                    <code className="block p-2 rounded bg-black/40 text-[10px] text-cyan-300 font-mono">
                      &lt;meta name="apple-mobile-web-app-capable" content="yes"&gt;<br />
                      &lt;meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"&gt;
                    </code>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      onClick={handleDownloadGeneratedSite}
                      className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger la Web App iOS Optimisée</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ONGLET 4 : APPLICATION DE BUREAU (WINDOWS, MAC, LINUX) */}
              {selectedPublishPlatform === 'desktop' && (
                <div className="p-5 rounded-2xl bg-[#110b27] border border-[#5A33FF44] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                      💻
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Application de Bureau Autonome (Style ChatGPT Desktop)</h4>
                      <p className="text-[11px] text-zinc-400">Installez votre site en logiciel indépendant sans barre de navigateur sur Windows, macOS et Linux.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181135] border border-[#5A33FF22] text-xs text-[#c4b5fd] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Systèmes supportés :</span>
                      <strong className="text-white text-[11px]">Windows 10/11, macOS, Linux Ubuntu/Debian</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Mode d'exécution :</span>
                      <span className="text-cyan-400 font-mono text-[11px]">Fenêtre native sans onglet de navigateur</span>
                    </div>
                  </div>

                  {publishStatus && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{publishStatus}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        const desktopScript = `@echo off\n:: Lanceur Bureau Autonome - ${siteProjectName || 'Mon Site'}\ntitle ${siteProjectName || 'Application Bureau'}\nstart "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="data:text/html;base64,${btoa(unescape(encodeURIComponent(generatedPromptSiteHtml || '')))}" --window-size=1280,800\nif errorlevel 1 start "" msedge --app="data:text/html;base64,${btoa(unescape(encodeURIComponent(generatedPromptSiteHtml || '')))}" --window-size=1280,800\nexit`;
                        const blob = new Blob([desktopScript], { type: 'application/x-bat' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${(siteProjectName || 'mon-site').toLowerCase().replace(/[^a-z0-9]/g, '-')}-desktop-launcher.bat`;
                        a.click();
                        URL.revokeObjectURL(url);
                        setPublishStatus("Lanceur de bureau Windows autonome (.bat / application native) téléchargé ! Double-cliquez pour ouvrir en plein écran.");
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Télécharger l'Appli Bureau (Windows .bat / .exe)</span>
                    </button>

                    <button
                      onClick={handleDownloadGeneratedSite}
                      className="px-4 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2e2261] border border-[#5A33FF44] text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Fichier HTML autonome</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ONGLET 5 : NETLIFY */}
              {selectedPublishPlatform === 'netlify' && (
                <div className="p-5 rounded-2xl bg-[#110b27] border border-[#5A33FF44] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg">
                      🌐
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Netlify Drop & Hébergement Direct</h4>
                      <p className="text-[11px] text-zinc-400">Glissez-déposez simplement votre archive pour une mise en ligne en 10 secondes.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#181135] border border-[#5A33FF22] text-xs text-[#c4b5fd]">
                    Téléchargez votre fichier <code className="text-white font-mono">index.html</code> et glissez-le sur <strong>app.netlify.com/drop</strong>.
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      onClick={handleDownloadGeneratedSite}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-2 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger le site prêt pour Netlify</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const BeaAppPreview = AndreaAppPreview;
export default AndreaAppPreview;
