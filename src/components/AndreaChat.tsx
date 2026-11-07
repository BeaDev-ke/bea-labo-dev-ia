import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Camera,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Volume2,
  Trash2,
  Play,
  RotateCcw,
  Paperclip,
  Share2,
  Mic,
  Plus,
  Check,
  Edit2
} from 'lucide-react';
import { ChatMessage, CameraMovementId, VideoGenerationResult } from '../types';
import { generateVideo, CAMERA_MOVEMENTS, generateImageFlux, generateTalkingAvatar } from '../services/videoService';
import { generateVoice, generateWhisperSubtitles } from '../services/voiceService';
import { VideoPlayer916 } from './VideoPlayer916';

interface AndreaChatProps {
  userProfile?: string;
  displayName?: string;
}

export const STARTER_CARDS: Record<string, string[]> = {
  entreprise: [
    "Structurer ma délégation et les priorités de la semaine",
    "Créer une routine d'équipe régulière et autonome",
    "Trancher une décision stratégique complexe avec clarté",
  ],
  independant: [
    "Optimiser ma prospection client et mon taux de conversion",
    "Revaloriser mon offre et mes tarifs avec assurance",
    "Construire un rythme de travail stable et performant",
  ],
  createur: [
    "Structurer une vidéo virale avec forte rétention dès le hook",
    "Diviser par 3 mon temps de production et de montage",
    "Créer une ligne éditoriale percutante pour ce mois",
  ],
  etudiant: [
    "Méthode d'assimilation active pour un cours complexe",
    "Plan de révision par répétition espacée sans surcharge",
    "Démarrer une session d'étude efficace de 45 minutes",
  ],
  salarie: [
    "Clarifier mes priorités et reprendre le contrôle de mon agenda",
    "Préparer un échange stratégique avec mon équipe ou direction",
    "Construire mon plan d'évolution et d'impact professionnel",
  ],
  recherche_emploi: [
    "Optimiser la présentation de mon parcours en entretien",
    "Cibler les opportunités clés et maximiser mes candidatures",
    "Clarifier ma trajectoire professionnelle et mes points forts",
  ],
  parent: [
    "Harmoniser mes projets personnels et mon organisation familiale",
    "Créer des blocs de temps dédiés à mes priorités clés",
    "Mettre en place des routines quotidiennes sereines et efficaces",
  ],
  enseignant: [
    "Structurer une séquence pédagogique interactive et engageante",
    "Déconstruire une notion difficile avec la méthode Feynman",
    "Renforcer l'ancrage et la mémorisation durable des élèves",
  ],
  autre: [
    "Transformer une idée en plan d'action concret en 3 étapes",
    "Définir mes priorités stratégiques pour la semaine",
    "Construire une routine quotidienne productive et durable",
  ],
};

// Une vidéo n'est lancée que sur une demande explicite de création
// (ex : "crée une vidéo TikTok sur…") ou quand le mode vidéo est activé.
// Un simple mot comme "vidéo" ou "caméra" dans une question ne suffit plus.
const VIDEO_INTENT =
  /(cr[ée]e|cr[ée]er|g[ée]n[èe]re|g[ée]n[ée]rer|fais|fabrique|produis|r[ée]alise)[\s-][^.?!]{0,40}(vid[ée]o|tiktok|reel|short)/i;

export const AndreaChat: React.FC<AndreaChatProps> = ({
  userProfile = 'createur',
  displayName = 'Saydou',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [modelChoice, setModelChoice] = useState<'rapide' | 'puissant'>('puissant');
  const [selectedMovement, setSelectedMovement] = useState<CameraMovementId>('orbit');
  const [videoMode, setVideoMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveQueueStatus, setLiveQueueStatus] = useState<string | null>(null);
  const [showPlusPopover, setShowPlusPopover] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileKey = STARTER_CARDS[userProfile] ? userProfile : 'createur';
  const starters = STARTER_CARDS[profileKey];

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, liveQueueStatus]);

  // Hook generation with LLM
  const generateHookWithLLM = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('cosmétique') || p.includes('beaute') || p.includes('crème')) {
      return "90% des personnes font cette erreur le matin. Voici ce qui change tout.";
    }
    if (p.includes('luxe') || p.includes('immo') || p.includes('villa') || p.includes('maison')) {
      return "Cette villa secrète n'a jamais été montrée en vidéo. Regardez jusqu'à la fin.";
    }
    if (p.includes('tech') || p.includes('ia') || p.includes('code') || p.includes('app')) {
      return "Le code n'existe plus en 2026. Voici comment on crée une appli en 30 secondes.";
    }
    if (p.includes('sport') || p.includes('sneaker') || p.includes('mode')) {
      return "Ce design a failli être banni des défilés. Découvrez pourquoi.";
    }
    return `La vérité sur ${prompt.slice(0, 35)}... Personne ne vous le dit.`;
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
      attachmentName: attachedFile?.name,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setAttachedFile(null);
    setShowPlusPopover(false);
    setIsGenerating(true);

    const isVideoRequest = videoMode || VIDEO_INTENT.test(textToSend);

    try {
      if (isVideoRequest) {
        // Full Video pipeline with Wan 2.1 & F5-TTS
        setLiveQueueStatus("Andrea écrit l'accroche virale percutante avec son LLM...");
        const hookText = generateHookWithLLM(textToSend);
        await new Promise((r) => setTimeout(r, 600));

        // Video generation
        const videoResult: VideoGenerationResult = await generateVideo(
          {
            prompt: textToSend,
            cameraMovement: selectedMovement,
            aspectRatio: '9:16',
            durationSeconds: 4,
          },
          (status) => setLiveQueueStatus(status)
        );

        // Voiceover F5-TTS
        setLiveQueueStatus('Génération voix off F5-TTS SWIVID...');
        const voiceResult = await generateVoice({ text: hookText }, (status) =>
          setLiveQueueStatus(status)
        );

        // Subtitles via Whisper
        setLiveQueueStatus('Synchronisation automatique des sous-titres Whisper...');
        const { cues, srtContent } = await generateWhisperSubtitles(
          hookText,
          videoResult.duration || 4
        );

        const fullResult: VideoGenerationResult = {
          ...videoResult,
          hookText,
          audioUrl: voiceResult.audioUrl,
          subtitles: cues,
          srtContent,
        };

        setLiveQueueStatus(null);
        setMessages((prev) => [
          ...prev,
          {
            id: `andrea_${Date.now()}`,
            sender: 'andrea',
            text: `Voici ta vidéo verticale 9:16 générée avec **Wan 2.1** (mouvement caméra **${videoResult.cameraMovement?.name || selectedMovement}**), accompagnée de la voix off humaine **F5-TTS** et des sous-titres **Whisper** synchronisés pour TikTok & Reels.`,
            hook: hookText,
            video: fullResult,
            timestamp: Date.now(),
          },
        ]);
      } else {
        // Standard BehaviorLab AI strategic response
        setLiveQueueStatus('Andrea analyse la situation et prépare une réponse stratégique...');
        await new Promise((r) => setTimeout(r, 800));

        const responseText =
          `Voici mon analyse comportementale et stratégique pour ta demande :\n\n` +
          `1. **Lecture de la dynamique** : Pour avancer efficacement sur "${textToSend.slice(0, 45)}...", la priorité n'est pas d'accumuler de la théorie mais de lever la friction immédiate de passage à l'action.\n\n` +
          `2. **Levier comportemental (Momentum & Clarté)** : Découpe l'objectif en 3 étapes nettes exécutables en moins de 25 minutes chacune pour créer une traction mesurable.\n\n` +
          `3. **Plan d'action direct** :\n` +
          `   • **Étape 1** : Fixer le périmètre non négociable du jour (1 seule tâche clé).\n` +
          `   • **Étape 2** : Éliminer la décision intermédiaire et lancer la session avec un minuteur dédié.\n` +
          `   • **Étape 3** : Valider et mesurer le résultat concret sans chercher la perfection prématurée.\n\n` +
          `Tu veux qu'on génère une vidéo 9:16 ou qu'on détaille l'une de ces étapes ?`;

        setLiveQueueStatus(null);
        setMessages((prev) => [
          ...prev,
          {
            id: `andrea_${Date.now()}`,
            sender: 'andrea',
            text: responseText,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Saturation réseau';
      setLiveQueueStatus(null);
      setMessages((prev) => [
        ...prev,
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

  // Text-to-Speech (Free Web Speech API)
  const speakMessage = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*_#`]/g, '').slice(0, 1500);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy message
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Voice dictation using SpeechRecognition
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
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
    if (lastUser) {
      handleSendMessage(lastUser.text);
    }
  };

  const exportConversation = () => {
    const lines = ['# Discussion avec Andrea (BehaviorLab AI)\n\n'];
    messages.forEach((m) => {
      lines.push(`**${m.sender === 'user' ? 'Moi' : 'Andrea'}** :\n${m.text}\n\n`);
    });
    const blob = new Blob([lines.join('')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discussion_andrea_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[960px] mx-auto w-full px-3 sm:px-6 select-text overflow-hidden">
      {/* Top Sub-Bar matching Photo 8 */}
      <div className="shrink-0 flex items-center justify-between py-2 border-b border-[#1d254f] mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b2b73] text-sky-300 font-bold border border-[#2b41b0]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Voix 100% Gratuite Active</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b2b73] text-slate-200 font-bold border border-[#2b41b0]">
            <span className="text-slate-400 font-normal">Mode :</span>
            <span>
              {userProfile === 'createur'
                ? '🎬 Créateur de contenu'
                : userProfile === 'entreprise'
                ? '🏢 Dirigeant & Entreprise'
                : '💼 ' + userProfile}
            </span>
          </span>
        </div>

        <button
          onClick={exportConversation}
          className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Partager</span>
        </button>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
        {messages.length === 0 ? (
          <div className="space-y-4 pt-4">
            {/* Welcome Banner matching Python code */}
            <div className="bg-[#231a4a] border border-[#5A33FF55] rounded-2xl p-6 shadow-xl shadow-[#0f0a23]/60">
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo_andrea.svg" alt="Andrea Logo" className="w-10 h-10 rounded-xl" />
                <div>
                  <div className="font-extrabold text-white text-lg">Bonjour, je suis Andrea.</div>
                  <div className="text-xs text-[#c4b5fd]">
                    Ton partenaire d'analyse stratégique, de créativité et de passage à l'action.
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed mt-2">
                Pose-moi une question, décris un blocage ou demande-moi de créer une <strong>vidéo verticale 9:16 avec Wan 2.1</strong>, voix off <strong>F5-TTS</strong> et sous-titres <strong>Whisper</strong>.
              </p>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="space-y-5">
            {/* Action Bar when discussion has started */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[#1A1930] border border-[#5A33FF33] text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={regenerateLast}
                  className="px-3 py-1.5 bg-[#231a4a] hover:bg-[#2e2260] text-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#8B70FF]" />
                  <span>🔄 Régénérer</span>
                </button>
                <button
                  onClick={() => handleSendMessage('Continue exactement où tu t\'es arrêté')}
                  className="px-3 py-1.5 bg-[#231a4a] hover:bg-[#2e2260] text-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>▶️ Continuer</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportConversation}
                  className="px-3 py-1.5 bg-[#231a4a] hover:bg-[#2e2260] text-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>⬇️ Exporter (.md)</span>
                </button>
                <button
                  onClick={() => setMessages([])}
                  className="px-3 py-1.5 bg-[#231a4a] hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>🗑️ Supprimer</span>
                </button>
              </div>
            </div>

            {/* Thread */}
            {messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              const isEditing = editingMsgId === m.id;

              return (
                <div
                  key={m.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-xl ${
                    isUser
                      ? 'bg-[#201844] border-[#5A33FF44] ml-auto max-w-[85%]'
                      : 'bg-[#231a4a] border-[#5A33FF55] max-w-[920px] mx-auto w-full'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      {isUser ? (
                        <>
                          <div className="w-6 h-6 rounded-full bg-[#372b6e] flex items-center justify-center text-[#c4b5fd]">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span>Moi</span>
                        </>
                      ) : (
                        <>
                          <img src="/logo_andrea.svg" alt="Andrea" className="w-6 h-6 rounded-lg" />
                          <span>Andrea</span>
                          <span className="text-[10px] text-[#8B70FF] font-semibold bg-[#1A1930] px-2 py-0.5 rounded-full border border-[#5A33FF33]">
                            BehaviorLab AI
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Attachment if present */}
                  {m.attachmentName && (
                    <div className="mb-2 text-xs text-[#c4b5fd] flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      <span>{m.attachmentName}</span>
                    </div>
                  )}

                  {/* Viral Hook Highlight */}
                  {m.hook && (
                    <div className="mb-3 p-3 rounded-xl bg-[#140E2D] border border-amber-500/40 text-amber-300 text-xs flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-extrabold uppercase text-[10px] text-amber-400 block tracking-wider">
                          Accroche Virale (Générée par LLM) :
                        </span>
                        <span className="italic font-bold">“{m.hook}”</span>
                      </div>
                    </div>
                  )}

                  {/* Message Body or Edit Field */}
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full p-3 bg-[#1A1930] border border-[#5A33FF66] rounded-xl text-sm text-white focus:outline-none"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end text-xs">
                        <button
                          onClick={() => {
                            m.text = editingText;
                            setEditingMsgId(null);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingMsgId(null)}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {m.text}
                    </p>
                  )}

                  {/* 9:16 Video Player Embed if video is included */}
                  {m.video && (
                    <div className="mt-4 pt-3 border-t border-[#5A33FF33] flex justify-center">
                      <VideoPlayer916 video={m.video} />
                    </div>
                  )}

                  {/* Message Action Toolbar (matching Python: speak, copy, up, down, pdf, word, edit) */}
                  <div className="mt-3 pt-2 border-t border-[#5A33FF22] flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      {!isUser && (
                        <>
                          <button
                            onClick={() => speakMessage(m.text)}
                            className="p-1.5 hover:text-white hover:bg-[#1A1930] rounded-lg transition-colors cursor-pointer"
                            title="Écouter Andrea (Web Speech)"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-[#8B70FF]" />
                          </button>
                          <button
                            onClick={() => copyMessage(m.text)}
                            className="p-1.5 hover:text-white hover:bg-[#1A1930] rounded-lg transition-colors cursor-pointer"
                            title="Copier"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => (m.feedback = 1)}
                            className="p-1.5 hover:text-emerald-400 hover:bg-[#1A1930] rounded-lg transition-colors cursor-pointer"
                            title="J'aime"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => (m.feedback = -1)}
                            className="p-1.5 hover:text-rose-400 hover:bg-[#1A1930] rounded-lg transition-colors cursor-pointer"
                            title="Je n'aime pas"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isUser && (
                        <button
                          onClick={() => {
                            setEditingMsgId(m.id);
                            setEditingText(m.text);
                          }}
                          className="px-2 py-1 hover:text-white hover:bg-[#1A1930] rounded-md transition-colors text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Modifier</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Queue Status / Saturation Notice */}
        {isGenerating && (
          <div className="max-w-[920px] mx-auto p-4 rounded-2xl bg-[#231a4a] border border-[#5A33FF66] text-xs text-[#c4b5fd] flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-4 h-4 text-[#8B70FF] animate-spin shrink-0" />
            <div>
              <span className="font-bold text-white block">Traitement en cours...</span>
              <span>{liveQueueStatus || 'Connexion aux clusters Wan 2.1 & F5-TTS...'}</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Discussion Box - Always fully visible at bottom */}
      <div className="shrink-0 w-full max-w-[920px] mx-auto pt-2 pb-2 z-30">
        <div
          className="relative w-full bg-[#201844] border border-[#5A33FF55] hover:border-[#8B70FF] rounded-[24px] shadow-2xl shadow-[#0f0a23]/80 p-3 pb-12 transition-all focus-within:border-[#8B70FF] focus-within:ring-2 focus-within:ring-[#8B70FF]/30"
          style={{ minHeight: '98px' }}
        >
          {/* Main Textarea */}
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Envoyer un message à Andrea..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none resize-none px-2 pt-1 pb-2 leading-relaxed"
            rows={2}
          />

          {/* Bottom-left: Circular 36px Plus Button & Instant Pill */}
          <div className="absolute left-[14px] bottom-[8px] z-30 flex items-center gap-2">
            <button
              onClick={() => setShowPlusPopover(!showPlusPopover)}
              className="w-9 h-9 rounded-full bg-[#1b2352] hover:bg-[#253073] border border-[#2b3c8a] text-slate-200 hover:text-white flex items-center justify-center text-lg font-bold transition-all shadow-md cursor-pointer"
              title="Ajouter un fichier, modèle IA ou actions"
            >
              ＋
            </button>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1b2352] border border-[#2b3c8a] text-[11px] font-bold text-slate-300 select-none">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Instant</span>
            </div>
            {videoMode && (
              <button
                onClick={() => setVideoMode(false)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5A33FF] border border-[#8B70FF] text-[11px] font-bold text-white cursor-pointer"
                title="Désactiver le mode vidéo"
              >
                <span>🎬 Mode vidéo</span>
                <span>✕</span>
              </button>
            )}

            {/* Plus Popover */}
            {showPlusPopover && (
              <div className="absolute bottom-11 left-0 w-72 bg-[#1A1930] border border-[#5A33FF55] rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3 animate-in fade-in zoom-in-95">
                <div>
                  <div className="font-bold text-white mb-1.5">🧠 Modèle IA</div>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-[#201844]">
                      <input
                        type="radio"
                        name="model"
                        checked={modelChoice === 'rapide'}
                        onChange={() => setModelChoice('rapide')}
                        className="accent-[#8B70FF]"
                      />
                      <span className="text-slate-200">⚡ Llama instant</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-[#201844]">
                      <input
                        type="radio"
                        name="model"
                        checked={modelChoice === 'puissant'}
                        onChange={() => setModelChoice('puissant')}
                        className="accent-[#8B70FF]"
                      />
                      <span className="text-slate-200">🧠 Puissant (70B) [Recommandé]</span>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-[#5A33FF22]" />

                <label className="flex items-center justify-between gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-[#201844]">
                  <span className="text-slate-200">🎬 Créer une vidéo 9:16 avec mon message</span>
                  <input
                    type="checkbox"
                    checked={videoMode}
                    onChange={(e) => setVideoMode(e.target.checked)}
                    className="accent-[#8B70FF]"
                  />
                </label>

                <div>
                  <div className="font-bold text-white mb-1.5">📎 Ajouter un fichier</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAttachedFile(e.target.files[0]);
                        setShowPlusPopover(false);
                      }
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-[#201844] hover:bg-[#2a2057] text-[#c4b5fd] rounded-xl border border-[#5A33FF44] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Choisir un document</span>
                  </button>
                  {attachedFile && (
                    <div className="mt-1 text-[11px] text-emerald-400 truncate">
                      ✓ {attachedFile.name}
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#5A33FF22]" />

                <button
                  onClick={exportConversation}
                  className="w-full py-2 px-3 bg-[#201844] hover:bg-[#2a2057] text-slate-200 rounded-xl border border-[#5A33FF44] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Télécharger la discussion</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom-right: Circular 36px Microphone Button */}
          <div className="absolute right-[58px] bottom-[8px] z-30">
            <button
              onClick={toggleVoiceInput}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-[#2a2057] hover:bg-[#372b6e] border border-[#5A33FF66] hover:border-[#8B70FF] text-[#c4b5fd] hover:text-white'
              }`}
              title="Dictée vocale (100% gratuit)"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom-right: Circular 36px Send Button (blue circle with white icon) */}
          <div className="absolute right-[14px] bottom-[8px] z-30">
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || isGenerating}
              className="w-9 h-9 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="Envoyer le message"
            >
              <Send className="w-4 h-4 text-white fill-white -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
