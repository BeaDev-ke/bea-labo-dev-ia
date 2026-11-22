import React, { useState, useRef } from 'react';
import {
  Send,
  Sparkles,
  User,
  RefreshCw,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Trash2,
  Play,
  Paperclip,
  Share2,
  Mic,
  Edit2,
  Code2,
  ChevronLeft,
  ChevronRight,
  Film,
} from 'lucide-react';
import { ChatMessage, CameraMovementId, VideoGenerationResult, OpuscarStyleId, AppLanguage } from '../types';
import { generateVideo, generateImageFlux, generateTalkingAvatar } from '../services/videoService';
import { generateVoice, generateWhisperSubtitles } from '../services/voiceService';
import { runOpuscarSkill, generateAppCodeFromPrompt } from '../services/andreaSkillsService';
import {
  AndreaConversationStyle,
  buildProfessorResponse,
  executeInternalPhotoTextSkill,
} from '../services/andreaProfessorEngine';
import { VideoPlayer916 } from './VideoPlayer916';
import { ActiveCodeProject } from './CodeWorkspacePage';

interface AndreaChatProps {
  userProfile?: string;
  displayName?: string;
  language?: AppLanguage;
  onOpenCodeBuilder?: (project: ActiveCodeProject) => void;
}

export const STARTER_CARDS: Record<string, string[]> = {
  entreprise: [
    'Comprendre comment structurer la délégation et les priorités',
    'Mettre en place une routine d’équipe claire et autonome',
    'Analyser une décision stratégique complexe en profondeur',
  ],
  independant: [
    'Comprendre les leviers psychologiques de la prospection client',
    'Valoriser mon offre et défendre mes tarifs avec sérénité',
    'Construire un rythme de travail régulier et soutenable',
  ],
  createur: [
    'Comprendre la psychologie de rétention sur les vidéos 9:16',
    'Donne-moi des idées de jeu originales et interactives',
    'Créer un site vitrine ou une application web interactive',
  ],
  etudiant: [
    'Comprendre comment mémoriser un cours complexe durablement',
    'Organiser mes révisions sans surcharge cognitive',
    'Expliquer une notion difficile étape par étape',
  ],
  salarie: [
    'Clarifier mes priorités et reprendre la main sur mon agenda',
    'Préparer un échange stratégique avec ma direction',
    'Définir une trajectoire d’évolution professionnelle solide',
  ],
  recherche_emploi: [
    'Valoriser mon parcours et mes compétences en entretien',
    'Cibler les meilleures opportunités avec méthode',
    'Structurer un discours clair sur ma valeur ajoutée',
  ],
  parent: [
    'Harmoniser mes projets personnels et mon organisation familiale',
    'Créer des blocs de temps dédiés à mes priorités',
    'Installer des routines quotidiennes calmes et efficaces',
  ],
  enseignant: [
    'Concevoir une séquence pédagogique captivante et interactive',
    'Déconstruire une notion complexe avec des analogies simples',
    'Renforcer l’ancrage mémoriel des élèves en classe',
  ],
  autre: [
    'Clarifier un projet et comprendre ses mécanismes clés',
    'Donne-moi des idées de jeu ou de concepts créatifs',
    'Construire une progression durable au quotidien',
  ],
};

const MESSAGES_PER_PAGE = 2;

export const AndreaChat: React.FC<AndreaChatProps> = ({
  userProfile = 'createur',
  displayName = 'Utilisateur',
  language = 'fr',
  onOpenCodeBuilder,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [msgPage, setMsgPage] = useState(0);
  const [inputPrompt, setInputPrompt] = useState('');
  const [modelChoice, setModelChoice] = useState<'rapide' | 'puissant'>('puissant');
  const [selectedMovement] = useState<CameraMovementId>('orbit');
  const [conversationStyle, setConversationStyle] = useState<AndreaConversationStyle>('professeur');
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveQueueStatus, setLiveQueueStatus] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [showPlusPopover, setShowPlusPopover] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [textChunkPage, setTextChunkPage] = useState<Record<string, number>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileKey = STARTER_CARDS[userProfile] ? userProfile : 'createur';
  const starters = STARTER_CARDS[profileKey];

  const generateHookWithLLM = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('cosmétique') || p.includes('beaute') || p.includes('crème')) {
      return '90% des personnes font cette erreur le matin. Voici ce qui change tout.';
    }
    if (p.includes('luxe') || p.includes('immo') || p.includes('villa') || p.includes('maison')) {
      return "Cette villa secrète n'a jamais été montrée en vidéo. Regardez jusqu'à la fin.";
    }
    if (p.includes('tech') || p.includes('ia') || p.includes('code') || p.includes('app')) {
      return 'Voici comment concevoir une application complète en quelques secondes.';
    }
    if (p.includes('sport') || p.includes('sneaker') || p.includes('mode')) {
      return 'Ce design a marqué tous les esprits. Découvrez pourquoi.';
    }
    return `L'essentiel à comprendre sur ${prompt.slice(0, 38)}...`;
  };

  const appendMessagesAndFocusLast = (newMsgs: ChatMessage[]) => {
    setMessages((prev) => {
      const next = [...prev, ...newMsgs];
      const totalPages = Math.max(1, Math.ceil(next.length / MESSAGES_PER_PAGE));
      setMsgPage(totalPages - 1);
      return next;
    });
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    const currentFile = attachedFile;
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
      attachmentName: currentFile?.name,
    };

    const historySnapshot = [...messages, userMsg];
    appendMessagesAndFocusLast([userMsg]);
    setInputPrompt('');
    setAttachedFile(null);
    setShowPlusPopover(false);
    setIsGenerating(true);

    const lower = textToSend.toLowerCase();

    const isSiteOrAppRequest =
      lower.includes('créer un site') ||
      lower.includes('crée un site') ||
      lower.includes('cree un site') ||
      lower.includes('fais un site') ||
      lower.includes('site web') ||
      lower.includes('page web') ||
      lower.includes('landing page') ||
      lower.includes('créer une app') ||
      lower.includes('crée une app') ||
      lower.includes('cree une app') ||
      lower.includes('créer une application') ||
      lower.includes('crée une application') ||
      lower.includes('fais une app') ||
      lower.includes('application web') ||
      lower.includes('code un site') ||
      lower.includes('code une app') ||
      lower.includes('cloner') ||
      lower.includes('reproduire') ||
      lower.includes('rebrand');

    const isIllustrateRequest =
      lower.includes('illustrer') ||
      lower.includes('illustration animée') ||
      lower.includes('mini-film') ||
      lower.includes('film animé') ||
      lower.includes('croquis') ||
      lower.includes('schéma animé');

    const isPhotoTextSkillRequest =
      lower.includes('effacer le texte') ||
      lower.includes('gomme texte') ||
      lower.includes('gommer le texte') ||
      lower.includes('remplacer le texte') ||
      lower.includes('texte courbé') ||
      lower.includes('texte sur photo') ||
      lower.includes('retouche photo') ||
      lower.includes('retoucher la photo') ||
      lower.includes('retoucher cette image');

    const isAvatarRequest =
      lower.includes('avatar') ||
      lower.includes('personnage parlant') ||
      lower.includes('visage qui parle');

    const isImageRequest =
      !isPhotoTextSkillRequest &&
      !isSiteOrAppRequest &&
      (lower.includes('génère une image') ||
        lower.includes('genere une image') ||
        lower.includes('créer une image') ||
        lower.includes('crée une image') ||
        lower.includes('générer un visuel') ||
        lower.includes('créer un visuel'));

    const isVideoRequest =
      !isSiteOrAppRequest &&
      !isIllustrateRequest &&
      !isAvatarRequest &&
      (lower.includes('vidéo') ||
        lower.includes('video') ||
        lower.includes('mouvement') ||
        lower.includes('caméra'));

    try {
      if (isSiteOrAppRequest) {
        setLiveQueueStatus("Andrea conçoit l'architecture et le code interactif...");
        await new Promise((r) => setTimeout(r, 350));
        const { title, html, files, summary, audit } = generateAppCodeFromPrompt(textToSend);
        setLiveQueueStatus(null);

        const project: ActiveCodeProject = {
          id: `proj_${Date.now()}`,
          title,
          prompt: textToSend,
          html,
          files,
          audit,
          history: [
            { role: 'user', text: textToSend },
            { role: 'andrea', text: summary },
          ],
        };

        appendMessagesAndFocusLast([
          {
            id: `andrea_code_${Date.now()}`,
            sender: 'andrea',
            text: `${displayName}, j'ai généré votre projet **${title}** et ouvert l'espace Code & Aperçu en direct.`,
            attachmentName: 'code_project_opened',
            timestamp: Date.now(),
          },
        ]);

        if (onOpenCodeBuilder) {
          onOpenCodeBuilder(project);
        }
      } else if (isPhotoTextSkillRequest) {
        setLiveQueueStatus('Andrea applique sa compétence interne de retouche photo...');
        const { dataUrl, explanation } = await executeInternalPhotoTextSkill(textToSend, currentFile);
        setLiveQueueStatus(null);
        appendMessagesAndFocusLast([
          {
            id: `andrea_pt_${Date.now()}`,
            sender: 'andrea',
            text: explanation,
            imageUrl: dataUrl,
            timestamp: Date.now(),
          },
        ]);
      } else if (isAvatarRequest) {
        setLiveQueueStatus("Andrea anime l'avatar parlant 9:16...");
        const avatarRes = await generateTalkingAvatar(textToSend);
        const voiceRes = await generateVoice({ text: textToSend }, (s) => setLiveQueueStatus(s));
        const { cues, srtContent } = await generateWhisperSubtitles(textToSend, 4);
        setLiveQueueStatus(null);
        appendMessagesAndFocusLast([
          {
            id: `andrea_avatar_${Date.now()}`,
            sender: 'andrea',
            text: `${displayName}, voici votre avatar parlant 9:16 synchronisé (${avatarRes.provider}) avec voix off et sous-titres.`,
            video: {
              id: `av_${Date.now()}`,
              videoUrl: avatarRes.videoUrl,
              thumbnailUrl: avatarRes.videoUrl,
              prompt: textToSend,
              aspectRatio: '9:16',
              duration: 4,
              providerUsed: 'Client Synthesis Fallback',
              audioUrl: voiceRes.audioUrl,
              subtitles: cues,
              srtContent,
              isCached: false,
              createdAt: Date.now(),
            },
            timestamp: Date.now(),
          },
        ]);
      } else if (isImageRequest) {
        setLiveQueueStatus('Andrea génère votre visuel haute définition...');
        const imgUrl = await generateImageFlux(textToSend);
        setLiveQueueStatus(null);
        appendMessagesAndFocusLast([
          {
            id: `andrea_img_${Date.now()}`,
            sender: 'andrea',
            text: `Voici votre visuel 9:16 généré pour « ${textToSend.slice(0, 60)} ».`,
            imageUrl: imgUrl,
            timestamp: Date.now(),
          },
        ]);
      } else if (isIllustrateRequest) {
        let styleId: OpuscarStyleId = 'edit_documentary';
        if (lower.includes('croquis') || lower.includes('tableau')) styleId = 'sketch_board';
        else if (lower.includes('peinture')) styleId = 'painting_illustration';
        else if (lower.includes('schéma')) styleId = 'line_diagrams';
        else if (lower.includes('gravure')) styleId = 'print_printmaking';

        const animProject = await runOpuscarSkill(textToSend, styleId, (status) => setLiveQueueStatus(status));
        setLiveQueueStatus(null);
        appendMessagesAndFocusLast([
          {
            id: `andrea_anim_${Date.now()}`,
            sender: 'andrea',
            text: `Illustration vidéo générée dans le style **${animProject.styleLabel}** avec voix off et sous-titres synchronisés.`,
            opuscar: animProject,
            video: {
              id: animProject.id,
              videoUrl: animProject.videoUrl,
              thumbnailUrl: animProject.videoUrl,
              prompt: animProject.title,
              aspectRatio: '9:16',
              duration: animProject.totalDuration,
              providerUsed: 'Client Synthesis Fallback',
              audioUrl: animProject.audioUrl,
              subtitles: animProject.subtitles,
              srtContent: animProject.srtContent,
              isCached: false,
              createdAt: animProject.createdAt,
            },
            timestamp: Date.now(),
          },
        ]);
      } else if (isVideoRequest) {
        setLiveQueueStatus("Andrea rédige l'accroche de la séquence...");
        const hookText = generateHookWithLLM(textToSend);
        await new Promise((r) => setTimeout(r, 400));

        const videoResult: VideoGenerationResult = await generateVideo(
          {
            prompt: textToSend,
            cameraMovement: selectedMovement,
            aspectRatio: '9:16',
            durationSeconds: 4,
          },
          (status) => setLiveQueueStatus(status)
        );

        setLiveQueueStatus('Synthèse de la voix off naturelle...');
        const voiceResult = await generateVoice({ text: hookText }, (status) => setLiveQueueStatus(status));

        setLiveQueueStatus('Synchronisation automatique des sous-titres...');
        const { cues, srtContent } = await generateWhisperSubtitles(hookText, videoResult.duration || 4);

        const fullResult: VideoGenerationResult = {
          ...videoResult,
          hookText,
          audioUrl: voiceResult.audioUrl,
          subtitles: cues,
          srtContent,
        };

        setLiveQueueStatus(null);
        appendMessagesAndFocusLast([
          {
            id: `andrea_${Date.now()}`,
            sender: 'andrea',
            text: `Voici votre vidéo 9:16 avec mouvement **${videoResult.cameraMovement?.name || selectedMovement}**, voix off et sous-titres synchronisés.`,
            hook: hookText,
            video: fullResult,
            timestamp: Date.now(),
          },
        ]);
      } else {
        setLiveQueueStatus('Andrea prépare une explication détaillée...');
        await new Promise((r) => setTimeout(r, modelChoice === 'rapide' ? 250 : 450));

        const reply = buildProfessorResponse(textToSend, {
          displayName,
          userProfile,
          language,
          history: historySnapshot,
          activeStyle: conversationStyle,
        });
        setConversationStyle(reply.nextStyle);

        setLiveQueueStatus(null);
        appendMessagesAndFocusLast([
          {
            id: `andrea_${Date.now()}`,
            sender: 'andrea',
            text: reply.text,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Saturation réseau';
      setLiveQueueStatus(null);
      appendMessagesAndFocusLast([
        {
          id: `andrea_err_${Date.now()}`,
          sender: 'andrea',
          text: `file d'attente gratuite saturée réessaye dans deux minutes avec un fallback (${errMsg}).`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsGenerating(false);
      setLiveQueueStatus(null);
    }
  };

  const speakMessage = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`]/g, '').slice(0, 1500);
      const utterance = new SpeechSynthesisUtterance(clean);
      const langMap: Record<AppLanguage, string> = {
        fr: 'fr-FR',
        en: 'en-US',
        es: 'es-ES',
        de: 'de-DE',
        pt: 'pt-PT',
        ar: 'ar-SA',
      };
      utterance.lang = langMap[language] || 'fr-FR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceNotice("La dictée vocale n'est pas prise en charge par ce navigateur.");
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      setIsListening(false);
    }
  };

  const regenerateLast = () => {
    if (messages.length === 0) return;
    const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUser) handleSendMessage(lastUser.text);
  };

  const exportConversation = () => {
    const lines = ['# Discussion avec Andrea\n\n'];
    messages.forEach((m) => {
      lines.push(`**${m.sender === 'user' ? displayName : 'Andrea'}** :\n${m.text}\n\n`);
    });
    const blob = new Blob([lines.join('')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discussion_andrea_${Date.now()}.md`;
    a.click();
  };

  const splitTextIntoPages = (txt: string, maxChars = 540): string[] => {
    if (txt.length <= maxChars) return [txt];
    const paragraphs = txt.split('\n\n');
    const pages: string[] = [];
    let current = '';
    for (const para of paragraphs) {
      if ((current + '\n\n' + para).trim().length > maxChars && current.trim().length > 0) {
        pages.push(current.trim());
        current = para;
      } else {
        current = current ? `${current}\n\n${para}` : para;
      }
    }
    if (current.trim()) pages.push(current.trim());
    return pages.length > 0 ? pages : [txt];
  };

  const totalPages = Math.max(1, Math.ceil(messages.length / MESSAGES_PER_PAGE));
  const safePage = Math.min(msgPage, totalPages - 1);
  const visibleMessages = messages.slice(
    safePage * MESSAGES_PER_PAGE,
    safePage * MESSAGES_PER_PAGE + MESSAGES_PER_PAGE
  );

  return (
    <div className="flex flex-col h-full max-w-[960px] mx-auto w-full px-1.5 sm:px-6 select-text overflow-hidden">
      {/* Top Sub-Bar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 py-2 border-b border-[#1d254f] mb-2 text-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-sky-300 font-bold truncate">
            <span className="truncate">Andrea · {displayName}</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-slate-300 font-medium hidden sm:inline">
            {conversationStyle === 'jeu_creatif'
              ? 'Idées de Jeu'
              : conversationStyle === 'ludique'
              ? 'Mode Ludique'
              : conversationStyle === 'concis'
              ? 'Mode Concis'
              : conversationStyle === 'socratique'
              ? 'Méthode Interactive'
              : 'Discussion active'}
          </span>
        </div>

        <button
          onClick={exportConversation}
          aria-label="Partager la discussion"
          className="text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partager</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto sm:overflow-hidden overflow-x-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 min-h-0 flex flex-col justify-center gap-3">
            <div className="bg-[#231a4a] border border-[#5A33FF55] rounded-2xl p-3.5 sm:p-5 shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo_andrea.svg" alt="Andrea" className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0" />
                <div className="min-w-0">
                  <div className="font-extrabold text-white text-sm sm:text-base truncate">
                    Bonjour {displayName}, je suis Andrea.
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#c4b5fd]">
                    Votre assistante stratégique &amp; créative : explications détaillées, adaptation du style en direct, création de vidéos 9:16 et d'applications.
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-2">
                Posez votre question pour recevoir une explication approfondie, demandez-moi d'ajuster mon style (idées de jeu, quiz, plus court), d'illustrer votre texte en vidéo ou d'ouvrir l'espace <strong>Code &amp; Aperçu</strong> pour créer un site ou une application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {starters.map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(st)}
                  className="p-3 rounded-2xl bg-[#161233] hover:bg-[#211a4a] border border-[#5A33FF44] text-left text-xs text-slate-200 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="font-bold text-sky-300 mb-1">Piste #{idx + 1}</div>
                  <div className="line-clamp-2">{st}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
            {/* Action + Pagination Bar */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-1.5 p-2 rounded-xl bg-[#1A1930] border border-[#5A33FF33] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={regenerateLast}
                  className="px-2 sm:px-2.5 py-1 bg-[#231a4a] hover:bg-[#2e2260] text-slate-200 rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap"
                >
                  <RefreshCw className="w-3 h-3 text-[#8B70FF]" />
                  <span>Régénérer</span>
                </button>
                <button
                  onClick={() => handleSendMessage('Approfondis encore plus ce point en détail')}
                  className="px-2 sm:px-2.5 py-1 bg-[#231a4a] hover:bg-[#2e2260] text-slate-200 rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span>Approfondir</span>
                </button>
                <button
                  onClick={exportConversation}
                  className="px-2 sm:px-2.5 py-1 bg-[#231a4a] hover:bg-[#2e2260] text-slate-200 rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap"
                >
                  <Download className="w-3 h-3 text-sky-400" />
                  <span className="hidden xs:inline sm:inline">Exporter</span>
                </button>
                <button
                  onClick={() => {
                    setMessages([]);
                    setMsgPage(0);
                  }}
                  className="px-2 sm:px-2.5 py-1 bg-[#231a4a] hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                  <span>Effacer</span>
                </button>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 tabular-nums">
                  <button
                    onClick={() => setMsgPage((p) => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    aria-label="Page de messages précédente"
                    className="p-1 rounded bg-[#231a4a] text-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-300">
                    Page {safePage + 1}/{totalPages}
                  </span>
                  <button
                    onClick={() => setMsgPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={safePage >= totalPages - 1}
                    aria-label="Page de messages suivante"
                    className="p-1 rounded bg-[#231a4a] text-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Visible Messages */}
            <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden justify-start">
              {visibleMessages.map((m) => {
                const isUser = m.sender === 'user';
                const isEditing = editingMsgId === m.id;
                const chunks = isUser || m.video || m.imageUrl ? [m.text] : splitTextIntoPages(m.text, 560);
                const chunkIdx = Math.min(textChunkPage[m.id] || 0, chunks.length - 1);

                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border shadow-lg overflow-hidden ${
                      isUser
                        ? 'bg-[#201844] border-[#5A33FF44] ml-auto max-w-[85%] shrink-0'
                        : 'bg-[#231a4a] border-[#5A33FF55] w-full flex-1 min-h-0 flex flex-col justify-between'
                    }`}
                  >
                    <div className="space-y-1.5 overflow-hidden flex-1 min-h-0 flex flex-col justify-start">
                      <div className="flex items-center justify-between text-xs shrink-0">
                        <div className="flex items-center gap-2 font-bold text-white">
                          {isUser ? (
                            <>
                              <div className="w-5 h-5 rounded-full bg-[#372b6e] flex items-center justify-center text-[#c4b5fd]">
                                <User className="w-3 h-3" />
                              </div>
                              <span>{displayName}</span>
                            </>
                          ) : (
                            <>
                              <img src="/logo_andrea.svg" alt="Andrea" className="w-5 h-5 object-contain" />
                              <span>Andrea</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {chunks.length > 1 && (
                            <div className="flex items-center gap-1 tabular-nums">
                              <button
                                onClick={() =>
                                  setTextChunkPage((p) => ({ ...p, [m.id]: Math.max(0, chunkIdx - 1) }))
                                }
                                disabled={chunkIdx === 0}
                                aria-label="Extrait précédent"
                                className="px-1.5 py-0.5 rounded bg-[#140E2D] text-slate-200 disabled:opacity-30 cursor-pointer"
                              >
                                ‹
                              </button>
                              <span className="text-[10px] font-mono text-sky-300">
                                {chunkIdx + 1}/{chunks.length}
                              </span>
                              <button
                                onClick={() =>
                                  setTextChunkPage((p) => ({
                                    ...p,
                                    [m.id]: Math.min(chunks.length - 1, chunkIdx + 1),
                                  }))
                                }
                                disabled={chunkIdx >= chunks.length - 1}
                                aria-label="Extrait suivant"
                                className="px-1.5 py-0.5 rounded bg-[#140E2D] text-slate-200 disabled:opacity-30 cursor-pointer"
                              >
                                ›
                              </button>
                            </div>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {m.hook && (
                        <div className="p-2 rounded-xl bg-[#140E2D] border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="italic font-bold truncate">“{m.hook}”</span>
                        </div>
                      )}

                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full p-2 bg-[#1A1930] border border-[#5A33FF66] rounded-xl text-xs text-white focus:outline-none"
                            rows={2}
                          />
                          <div className="flex gap-2 justify-end text-xs">
                            <button
                              onClick={() => {
                                m.text = editingText;
                                setEditingMsgId(null);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Sauvegarder
                            </button>
                            <button
                              onClick={() => setEditingMsgId(null)}
                              className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-100 whitespace-pre-wrap leading-relaxed overflow-hidden">
                          {chunks[chunkIdx]}
                        </p>
                      )}

                      {m.imageUrl && (
                        <div className="pt-1 flex items-center gap-3 shrink-0">
                          <img
                            src={m.imageUrl}
                            alt="Visuel généré par Andrea"
                            className="h-44 w-44 rounded-xl object-cover border border-[#5A33FF44] shadow-lg"
                          />
                          <a
                            href={m.imageUrl}
                            download={`andrea_visuel_${m.id}.png`}
                            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Télécharger PNG</span>
                          </a>
                        </div>
                      )}

                      {m.video && (
                        <div className="pt-1 flex justify-center shrink-0">
                          <VideoPlayer916 video={m.video} />
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-[#5A33FF22] flex items-center justify-between text-xs text-slate-400 shrink-0">
                      <div className="flex items-center gap-1">
                        {!isUser && (
                          <>
                            <button
                              onClick={() => speakMessage(m.text)}
                              className="p-1 hover:text-white rounded cursor-pointer"
                              title="Écouter"
                              aria-label="Écouter la réponse"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-[#8B70FF]" />
                            </button>
                            <button
                              onClick={() => copyMessage(m.text)}
                              className="p-1 hover:text-white rounded cursor-pointer"
                              title="Copier"
                              aria-label="Copier le message"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => (m.feedback = 1)}
                              aria-label="Utile"
                              className="p-1 hover:text-emerald-400 rounded cursor-pointer"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => (m.feedback = -1)}
                              aria-label="À améliorer"
                              className="p-1 hover:text-rose-400 rounded cursor-pointer"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {isUser && (
                        <button
                          onClick={() => {
                            setEditingMsgId(m.id);
                            setEditingText(m.text);
                          }}
                          className="px-2 py-0.5 hover:text-white rounded text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isGenerating && (
                <div className="p-3 rounded-2xl bg-[#231a4a] border border-[#5A33FF66] text-xs text-[#c4b5fd] flex items-center gap-2.5 animate-pulse shrink-0">
                  <RefreshCw className="w-4 h-4 text-[#8B70FF] animate-spin shrink-0" />
                  <span>{liveQueueStatus || 'Traitement en cours...'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {voiceNotice && (
        <div className="shrink-0 mb-1.5 px-3 py-1.5 rounded-xl bg-[#1e1b4b] border border-amber-500/40 text-amber-200 text-xs">
          {voiceNotice}
        </div>
      )}

      {/* Prompt Input Fixed at Bottom */}
      <div className="shrink-0 w-full pt-2 pb-1 z-30">
        <div
          className="relative w-full bg-[#201844] border border-[#5A33FF55] hover:border-[#8B70FF] rounded-[22px] shadow-2xl p-2.5 pb-11 transition-all"
          style={{ minHeight: '90px' }}
        >
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Envoyer un message à Andrea (${displayName})...`}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm outline-none resize-none px-2 pt-0.5 leading-relaxed"
            rows={2}
          />

          <div className="absolute left-[14px] bottom-[8px] z-30 flex items-center gap-2">
            <button
              onClick={() => setShowPlusPopover(!showPlusPopover)}
              className="w-8 h-8 rounded-full bg-[#1b2352] hover:bg-[#253073] border border-[#2b3c8a] text-slate-200 hover:text-white flex items-center justify-center text-base font-bold cursor-pointer"
              title="Actions & Fichiers"
              aria-label="Actions et fichiers"
              aria-expanded={showPlusPopover}
            >
              +
            </button>
            <span className="text-[11px] font-bold text-slate-300 select-none hidden sm:inline">
              {modelChoice === 'puissant' ? 'Mode Puissant' : 'Mode Instant'}
            </span>

            {showPlusPopover && (
              <div className="absolute bottom-10 left-0 w-[min(18rem,calc(100vw-4.5rem))] bg-[#1A1930] border border-[#5A33FF55] rounded-2xl p-3.5 shadow-2xl z-50 text-xs space-y-2.5">
                <div className="space-y-1">
                  <div className="font-bold text-white">Modèle</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setModelChoice('rapide')}
                      className={`py-1.5 px-2 rounded-lg font-bold cursor-pointer ${
                        modelChoice === 'rapide' ? 'bg-[#2563eb] text-white' : 'bg-[#201844] text-slate-300'
                      }`}
                    >
                      Instant
                    </button>
                    <button
                      onClick={() => setModelChoice('puissant')}
                      className={`py-1.5 px-2 rounded-lg font-bold cursor-pointer ${
                        modelChoice === 'puissant' ? 'bg-[#2563eb] text-white' : 'bg-[#201844] text-slate-300'
                      }`}
                    >
                      Puissant
                    </button>
                  </div>
                </div>

                <div className="h-px bg-[#5A33FF22]" />

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAttachedFile(e.target.files[0]);
                        setShowPlusPopover(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-1.5 px-3 bg-[#201844] hover:bg-[#2a2057] text-[#c4b5fd] rounded-xl border border-[#5A33FF44] font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Joindre un fichier</span>
                  </button>
                  {attachedFile && <div className="mt-1 text-[11px] text-emerald-400 truncate">✓ {attachedFile.name}</div>}
                </div>

                <div className="h-px bg-[#5A33FF22]" />

                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setShowPlusPopover(false);
                      handleSendMessage('Créer un site web moderne pour mon activité');
                    }}
                    className="w-full py-1.5 px-2.5 bg-[#201844] hover:bg-[#2a2057] text-left text-slate-200 rounded-lg font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Créer un site ou une app</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowPlusPopover(false);
                      handleSendMessage('Illustrer mon texte en vidéo animée');
                    }}
                    className="w-full py-1.5 px-2.5 bg-[#201844] hover:bg-[#2a2057] text-left text-slate-200 rounded-lg font-medium flex items-center gap-2 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-purple-400" />
                    <span>Illustrer votre texte</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="absolute right-[54px] bottom-[8px] z-30">
            <button
              onClick={toggleVoiceInput}
              className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#2a2057] hover:bg-[#372b6e] border border-[#5A33FF66] text-[#c4b5fd] hover:text-white'
              }`}
              title="Dictée vocale"
              aria-label="Activer la dictée vocale"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute right-[12px] bottom-[8px] z-30">
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || isGenerating}
              className="w-8 h-8 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 flex items-center justify-center text-white shadow-lg cursor-pointer"
              title="Envoyer"
              aria-label="Envoyer le message"
            >
              <Send className="w-3.5 h-3.5 text-white fill-white -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
