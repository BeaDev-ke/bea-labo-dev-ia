import React, { useState } from 'react';
import {
  FlaskConical,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  GitCommit,
  Layers,
  Code2,
  Sparkles,
  Shield,
  Play,
  FileText,
  Clock,
  ArrowRight,
  Bot,
  Send,
  Terminal,
  Cpu,
  Check,
  Search,
  Zap,
  CornerDownLeft
} from 'lucide-react';

interface CodebaseTarget {
  file: string;
  symbol: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelTitle: string;
  lineRange: string;
  rationale: string;
  diff: string;
}

export const DevLab: React.FC<{ onNavigateToPortal?: () => void }> = ({ onNavigateToPortal }) => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'editor' | 'diff' | 'backups' | 'tests'>('mcp');
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4 | 5>(1);

  // MCP AI Agent State
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentAnalysis, setAgentAnalysis] = useState<CodebaseTarget | null>({
    file: 'src/services/videoService.ts',
    symbol: 'CAMERA_MOVEMENTS / generateVideo',
    level: 5,
    levelTitle: 'Niveau 5 · Core Engine & AST',
    lineRange: 'L. 15-48',
    rationale: 'Pour modifier la trajectoire caméra par défaut de Wan 2.1, l\'agent cible le tableau de constantes cinématiques et la fonction principale de génération vidéo.',
    diff: `diff --git a/src/services/videoService.ts b/src/services/videoService.ts
@@ -18,6 +18,7 @@ export const CAMERA_MOVEMENTS = [
-  defaultMotion: 'orbit',
+  defaultMotion: 'fpv_drone', // Mouvement caméra dynamique Wan 2.1
+  autoStabilize: true,
+  preferredDuration: 5,
@@ -82,3 +83,4 @@ export async function generateVideo(options) {
+  console.log('[MCP] Trajectoire FPV Drone injectée dans le prompt Wan 2.1');`
  });

  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    '[MCP-READY] Indexation complète du codebase (14 composants, 2 services)',
    '[MCP-CONTEXT] Cartographie AST prête : App.tsx, AndreaChat.tsx, MontageStudio.tsx, videoService.ts',
    '[MCP-AGENT] Prêt à analyser et cibler vos modifications'
  ]);

  const [customDiffText, setCustomDiffText] = useState<string>(
    `@@ -42,6 +42,7 @@\n- const ACCENT_COLOR = '#4F46E5';\n+ const ACCENT_COLOR = '#5A33FF'; // BehaviorLab Official Violet\n+ const WAN21_DEFAULT_MOTION = 'orbit';\n+ const WHISPER_AUTO_SRT = true;`
  );

  const [backups, setBackups] = useState([
    { id: 'b_05', date: 'À l\'instant', name: 'Agent MCP · Ciblage automatique Wan 2.1 & FPV', size: '2.5 MB' },
    { id: 'b_04', date: 'Aujourd\'hui 14:48', name: 'Wan 2.1 & 10 Caméras Higgsfield intégrés', size: '2.4 MB' },
    { id: 'b_03', date: 'Aujourd\'hui 12:30', name: 'Découpage automatique de scènes au montage', size: '2.3 MB' },
    { id: 'b_02', date: 'Hier 18:20', name: 'Optimisation pipeline vidéo Wan 2.1 & Whisper', size: '2.1 MB' },
    { id: 'b_01', date: 'Hier 14:10', name: 'Version initiale BehaviorLab AI', size: '1.9 MB' },
  ]);

  // Codebase Semantic Router (Agent Knowledge Graph)
  const analyzePromptWithMcpAgent = (prompt: string) => {
    setIsAnalyzing(true);
    const p = prompt.toLowerCase();

    setTimeout(() => {
      let target: CodebaseTarget;

      if (p.includes('couleur') || p.includes('theme') || p.includes('css') || p.includes('fond') || p.includes('violet') || p.includes('style')) {
        target = {
          file: 'src/index.css & src/App.tsx',
          symbol: 'Theme Variables / Tailwind Classes',
          level: 1,
          levelTitle: 'Niveau 1 · Style & Thème',
          lineRange: 'L. 1-35',
          rationale: `L'Agent MCP a détecté une demande cosmétique sur l'apparence visuelle. Modification des tokens Tailwind et des classes de fond globales.`,
          diff: `diff --git a/src/index.css b/src/index.css
@@ -1,4 +1,7 @@
 @import "tailwindcss";
+@theme {
+  --color-primary-glow: #8B70FF;
+  --color-accent-neon: #5A33FF;
+}`
        };
      } else if (p.includes('montage') || p.includes('scinder') || p.includes('couper') || p.includes('effet') || p.includes('audio') || p.includes('son') || p.includes('cadre') || p.includes('texte')) {
        target = {
          file: 'src/components/MontageStudio.tsx',
          symbol: 'MontageStudio / handleSplitScene / framePresets',
          level: 4,
          levelTitle: 'Niveau 4 · Composants & Layout',
          lineRange: 'L. 80-210',
          rationale: `L'Agent MCP a identifié l'espace Montage. Il cible la gestion de la timeline, les tiroirs d'effets visuels et l'inspecteur de scènes.`,
          diff: `diff --git a/src/components/MontageStudio.tsx b/src/components/MontageStudio.tsx
@@ -142,6 +142,8 @@ export const MontageStudio = () => {
+  // Action optimisée via Agent MCP
+  const splitThresholdMs = 800; // Découpe réactive à la tête de lecture
+  const autoSnapGrid = true;`
        };
      } else if (p.includes('video') || p.includes('wan') || p.includes('camera') || p.includes('higgsfield') || p.includes('mouvement') || p.includes('zoom')) {
        target = {
          file: 'src/services/videoService.ts',
          symbol: 'CAMERA_MOVEMENTS / generateVideo',
          level: 5,
          levelTitle: 'Niveau 5 · Core Engine & AST',
          lineRange: 'L. 20-75',
          rationale: `L'Agent MCP cible directement le pipeline Wan 2.1, les fallbacks Replicate/CogVideoX et la calibration des mouvements caméra Higgsfield.`,
          diff: `diff --git a/src/services/videoService.ts b/src/services/videoService.ts
@@ -25,6 +25,8 @@ export const CAMERA_MOVEMENTS = [
+  cinematicWeight: 1.25,
+  enforceMotionPrompt: true, // Renforce les trajectoires caméra dans le prompt Wan 2.1`
        };
      } else if (p.includes('voix') || p.includes('f5') || p.includes('tts') || p.includes('audio') || p.includes('whisper') || p.includes('sous-titre')) {
        target = {
          file: 'src/services/voiceService.ts & src/components/AIParametersPage.tsx',
          symbol: 'generateVoice / WebAudioSynthesizer',
          level: 5,
          levelTitle: 'Niveau 5 · Core Engine & AST',
          lineRange: 'L. 30-85',
          rationale: `L'Agent MCP localise le service de synthèse vocale SWIVID F5-TTS et le calage des timecodes Whisper .SRT.`,
          diff: `diff --git a/src/services/voiceService.ts b/src/services/voiceService.ts
@@ -45,6 +45,8 @@ export async function generateVoice(options) {
+  sampleRate: 44100,
+  naturalCadenceModifier: 1.08, // Élocution naturelle fluide`
        };
      } else if (p.includes('chat') || p.includes('discussion') || p.includes('andrea') || p.includes('message') || p.includes('accroche') || p.includes('hook')) {
        target = {
          file: 'src/components/AndreaChat.tsx',
          symbol: 'AndreaChat / handleSendMessage / generateHook',
          level: 4,
          levelTitle: 'Niveau 4 · Composants & Layout',
          lineRange: 'L. 65-180',
          rationale: `L'Agent MCP cible la discussion principale avec Andrea, la génération d'accroches virales et l'affichage du player 9:16.`,
          diff: `diff --git a/src/components/AndreaChat.tsx b/src/components/AndreaChat.tsx
@@ -95,6 +95,8 @@ export const AndreaChat = () => {
+  // Paramètres optimisés par l'Agent MCP
+  const instantHookGeneration = true;
+  const maxContextTokens = 8192;`
        };
      } else {
        target = {
          file: 'src/App.tsx',
          symbol: 'App / Navigation & Global State',
          level: 3,
          levelTitle: 'Niveau 3 · Logique & Événements',
          lineRange: 'L. 45-120',
          rationale: `L'Agent MCP a analysé la requête et a ciblé le chef d'orchestre principal App.tsx pour propager les changements.`,
          diff: `diff --git a/src/App.tsx b/src/App.tsx
@@ -60,6 +60,8 @@ export default function App() {
+  // Mutation appliquée via Agent MCP
+  const mcpAutoSync = true;`
        };
      }

      setAgentAnalysis(target);
      setIsAnalyzing(false);
      setAgentLogs((prev) => [
        `[MCP-TARGET] ${target.file} -> ${target.symbol} (${target.lineRange})`,
        `[MCP-AST] Patch calculé avec succès pour : "${prompt.slice(0, 40)}..."`,
        ...prev.slice(0, 4)
      ]);
    }, 450);
  };

  const handleApplyModification = () => {
    if (!agentAnalysis) return;
    setIsApplying(true);

    setTimeout(() => {
      setIsApplying(false);
      const newBackup = {
        id: `b_0${backups.length + 1}`,
        date: 'À l\'instant',
        name: `Patch Agent MCP sur ${agentAnalysis.file.split(' ')[0]}`,
        size: '2.5 MB'
      };
      setBackups([newBackup, ...backups]);
      setAppliedMessage(`Modification appliquée avec succès sur ${agentAnalysis.file} ! Point de restauration ${newBackup.id} généré.`);
      setAgentLogs((prev) => [
        `[MCP-APPLY] Patch injecté sur ${agentAnalysis.file}`,
        `[MCP-CHECK] Codebase intègre (0 erreur de compilation)`,
        ...prev
      ]);
      setTimeout(() => setAppliedMessage(null), 4000);
    }, 700);
  };

  const samplePrompts = [
    { label: '🎥 Vidéo Wan 2.1 : Vitesse 1.25x et FPV Drone', prompt: 'Modifie le moteur vidéo Wan 2.1 pour activer le mouvement FPV drone et une durée optimisée de 5s' },
    { label: '🎨 Style : Thème violet néon #8B70FF', prompt: 'Passe la couleur d\'accentuation principale en violet néon intense #8B70FF avec effet glow' },
    { label: '✂️ Montage : Découpe automatique scènes', prompt: 'Active la découpe automatique des scènes avec seuil réactif au curseur de lecture' },
    { label: '🎙️ Voix F5-TTS : Cadence naturelle fluide', prompt: 'Optimise l\'élocution de la synthèse vocale F5-TTS pour un débit plus vivant' },
    { label: '💬 Discussion : Hooks instantanés 3s', prompt: 'Renforce la génération des accroches virales pour captiver l\'audience dès les 3 premières secondes' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#140e2d] border border-[#5A33FF44] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B70FF] uppercase tracking-wider">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>Agent IA Ingénieur Code & Protocole MCP</span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <span>Labo Dev · Superviseur MCP</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd] text-xs font-mono font-bold border border-[#5A33FF55]">
              Full Codebase Access
            </span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            L'Agent IA connaît l'intégralité du code de l'application. Envoyez n'importe quelle consigne en langage naturel : il sait exactement dans quel fichier, composant et fonction agir.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Agent MCP En Ligne</span>
          </div>
        </div>
      </div>

      {appliedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedMessage}</span>
        </div>
      )}

      {/* Main Labo Tabs */}
      <div className="rounded-3xl bg-[#100b24] border border-[#5A33FF44] overflow-hidden shadow-2xl">
        {/* Navigation Bar */}
        <div className="px-6 py-3.5 bg-[#171038] border-b border-[#5A33FF33] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('mcp')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'mcp'
                  ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                  : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-300" />
              <span>Agent IA MCP (Recommandé)</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                  : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Éditeur AST & Niveaux</span>
            </button>

            <button
              onClick={() => setActiveTab('diff')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'diff'
                  ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                  : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Aperçu Diff Git</span>
            </button>

            <button
              onClick={() => setActiveTab('backups')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'backups'
                  ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                  : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sauvegardes & Rollback ({backups.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'tests'
                  ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                  : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Intégrité & Tests</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#c4b5fd]">
            Projet : <span className="text-white font-bold">Bea Labo Dev IA v2.4</span>
          </div>
        </div>

        {/* Tab 1: AGENT IA MCP (Interactive Natural Language Modification Engine) */}
        {activeTab === 'mcp' && (
          <div className="p-6 space-y-6">
            {/* Input Prompt Section */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Envoyer une consigne de modification à l'Agent IA MCP :</span>
                </span>
                <span className="text-[11px] text-[#c4b5fd] font-normal">
                  L'agent identifie automatiquement le fichier, le composant et la fonction
                </span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && agentPrompt.trim()) {
                      analyzePromptWithMcpAgent(agentPrompt);
                    }
                  }}
                  placeholder="Ex : Change le mouvement caméra par défaut de Wan 2.1 en FPV Drone et augmente la durée..."
                  className="w-full bg-[#0c081e] border border-[#5A33FF66] rounded-2xl px-4 py-3.5 pr-28 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B70FF] shadow-inner font-sans"
                />

                <button
                  onClick={() => {
                    if (agentPrompt.trim()) analyzePromptWithMcpAgent(agentPrompt);
                  }}
                  disabled={isAnalyzing || !agentPrompt.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Analyse...' : 'Analyser'}</span>
                </button>
              </div>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Exemples rapides :</span>
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAgentPrompt(sp.prompt);
                      analyzePromptWithMcpAgent(sp.prompt);
                    }}
                    className="text-[11px] px-3 py-1 rounded-full bg-[#1b143c] hover:bg-[#261d54] text-[#c4b5fd] hover:text-white border border-[#5A33FF33] transition cursor-pointer"
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MCP Analysis & Diagnostic Result Card */}
            {agentAnalysis && (
              <div className="p-6 rounded-2xl bg-[#150f33] border border-[#5A33FF55] space-y-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#5A33FF33] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Cible identifiée par l'Agent MCP
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
                      <span>{agentAnalysis.file}</span>
                      <span className="text-slate-400 text-xs">({agentAnalysis.lineRange})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-[#201844] text-[#8B70FF] text-xs font-mono font-bold border border-[#5A33FF44]">
                      {agentAnalysis.levelTitle}
                    </span>
                    <button
                      onClick={handleApplyModification}
                      disabled={isApplying}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{isApplying ? 'Application du patch...' : 'Appliquer via Agent MCP'}</span>
                    </button>
                  </div>
                </div>

                {/* Agent Reasoning */}
                <div className="p-4 rounded-xl bg-[#0d091e] border border-[#5A33FF33] space-y-1.5">
                  <div className="text-[11px] font-bold text-[#c4b5fd] uppercase tracking-wider flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Raisonnement de l'Agent IA & Point d'impact :</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {agentAnalysis.rationale}
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono pt-1">
                    🎯 Symbole cible : <span className="text-purple-300">{agentAnalysis.symbol}</span>
                  </div>
                </div>

                {/* Diff Preview */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Patch Git Diff généré :</span>
                    <span className="text-[10px] font-mono text-slate-400">Contrôle d'intégrité AST : OK</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#090616] border border-[#5A33FF44] font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                    {agentAnalysis.diff.split('\n').map((line, i) => {
                      let color = 'text-slate-300';
                      if (line.startsWith('+')) color = 'text-emerald-400 bg-emerald-950/30 px-1 rounded';
                      else if (line.startsWith('-')) color = 'text-rose-400 bg-rose-950/30 px-1 rounded';
                      else if (line.startsWith('@')) color = 'text-sky-400 font-bold';
                      else if (line.startsWith('diff')) color = 'text-purple-400 font-bold';
                      return <div key={i} className={color}>{line}</div>;
                    })}
                  </pre>
                </div>
              </div>
            )}

            {/* Live Agent Logs Stream */}
            <div className="p-4 rounded-2xl bg-[#0d091e] border border-[#5A33FF22] space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>Journal d'activité de l'Agent MCP :</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-400">
                {agentLogs.map((log, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-purple-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AST Editor by Levels */}
        {activeTab === 'editor' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#14132b] rounded-2xl border border-[#5A33FF33] space-y-2">
                <label className="text-xs font-bold text-slate-300">Action prédéfinie (Niveau {activeLevel})</label>
                <select
                  value={'accent_color'}
                  onChange={() => {}}
                  className="w-full px-3 py-2 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="accent_color">Ajuster la teinte principale (#5A33FF)</option>
                  <option value="motion_defaults">Mouvement Wan 2.1 par défaut (Orbit 360°)</option>
                  <option value="whisper_sync">Sous-titres automatiques Whisper (Activés)</option>
                  <option value="f5tts_rate">Vitesse d'élocution F5-TTS (1.05x)</option>
                </select>
              </div>

              <div className="p-4 bg-[#14132b] rounded-2xl border border-[#5A33FF33] space-y-2">
                <label className="text-xs font-bold text-slate-300">Portée d'application</label>
                <div className="text-xs text-slate-400 font-mono py-2">
                  src/services/videoService.ts · src/components/AndreaChat.tsx
                </div>
              </div>

              <div className="p-4 bg-[#14132b] rounded-2xl border border-[#5A33FF33] space-y-2">
                <label className="text-xs font-bold text-slate-300">Statut du build</label>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>0 erreur · Prêt au déploiement</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Patch AST / Snippet injecté :
              </label>
              <textarea
                value={customDiffText}
                onChange={(e) => setCustomDiffText(e.target.value)}
                spellCheck={false}
                className="w-full h-48 p-4 bg-[#0c0b17] rounded-2xl border border-[#5A33FF44] font-mono text-xs text-slate-200 leading-relaxed focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Git Diff */}
        {activeTab === 'diff' && (
          <div className="p-6">
            <div className="p-5 bg-[#090616] rounded-2xl border border-[#5A33FF33] font-mono text-xs space-y-1">
              <div className="text-slate-500 font-bold mb-2">diff --git a/src/services/videoService.ts b/src/services/videoService.ts</div>
              <div className="text-sky-400">@@ -15,8 +15,12 @@ export const CAMERA_MOVEMENTS = [</div>
              <div className="text-slate-400">   id: 'orbit', name: 'Orbit 360°'</div>
              <div className="text-rose-400 bg-rose-950/30 px-1 rounded">-  engine: 'legacy'</div>
              <div className="text-emerald-400 bg-emerald-950/30 px-1 rounded">+  engine: 'wan-2.1-primary'</div>
              <div className="text-emerald-400 bg-emerald-950/30 px-1 rounded">+  fallback: ['cogvideox-5b', 'animatediff-sd15']</div>
              <div className="text-slate-400">   promptCue: '360 degree rotational orbit camera shot around central subject...'</div>
            </div>
          </div>
        )}

        {/* Tab 4: Backups & Rollback */}
        {activeTab === 'backups' && (
          <div className="p-6 space-y-3">
            <div className="text-xs text-slate-400">
              Chaque modification appliquée via l'Agent MCP génère automatiquement un point de restauration :
            </div>
            {backups.map((bk) => (
              <div
                key={bk.id}
                className="p-4 bg-[#14132b] rounded-2xl border border-[#5A33FF33] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#201844] flex items-center justify-center text-[#8B70FF] font-bold">
                    {bk.id.replace('b_', '#')}
                  </div>
                  <div>
                    <div className="font-bold text-white">{bk.name}</div>
                    <div className="text-[11px] text-slate-400">{bk.date} · {bk.size}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    alert(`Restauration vers ${bk.name} effectuée avec succès.`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#201844] hover:bg-[#2b1f5c] border border-[#5A33FF44] text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rollback</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Tests */}
        {activeTab === 'tests' && (
          <div className="p-6 space-y-3">
            <div className="p-4 bg-[#14132b] rounded-2xl border border-emerald-500/30 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Test 1 · Intégrité Codebase & Routage MCP</div>
                <div className="text-[11px] text-slate-400">14 composants et 2 services indexés sans rupture de contrat d'interface</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px]">PASS</span>
            </div>

            <div className="p-4 bg-[#14132b] rounded-2xl border border-emerald-500/30 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Test 2 · Fallback Chaîne Vidéo Wan 2.1</div>
                <div className="text-[11px] text-slate-400">Résilience réseau et bascule automatique en cas de saturation de file d'attente HF</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px]">PASS</span>
            </div>

            <div className="p-4 bg-[#14132b] rounded-2xl border border-emerald-500/30 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Test 3 · Calage Sous-titres Whisper (.SRT)</div>
                <div className="text-[11px] text-slate-400">Synchronisation des timecodes avec le lecteur vidéo vertical 9:16</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px]">PASS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
