import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  RotateCcw,
  GitCommit,
  Code2,
  Sparkles,
  Shield,
  Clock,
  Bot,
  Send,
  Terminal,
  Cpu,
} from 'lucide-react';

interface CodebaseTarget {
  file: string;
  symbol: string;
  levelTitle: string;
  lineRange: string;
  rationale: string;
  diff: string;
}

export const DevLab: React.FC<{ onNavigateToPortal?: () => void }> = () => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'editor' | 'diff' | 'backups' | 'tests'>('mcp');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [agentAnalysis, setAgentAnalysis] = useState<CodebaseTarget>({
    file: 'src/services/videoService.ts',
    symbol: 'CAMERA_MOVEMENTS / generateVideo',
    levelTitle: 'Niveau 5 · Moteur Vidéo',
    lineRange: 'L. 15-48',
    rationale:
      'Pour ajuster la trajectoire caméra par défaut, le superviseur cible le tableau cinématique et la fonction principale de rendu.',
    diff: `@@ -18,3 +18,4 @@ export const CAMERA_MOVEMENTS = [\n-  defaultMotion: 'orbit',\n+  defaultMotion: 'fpv_drone',\n+  preferredDuration: 5,`,
  });

  const [appliedMessage, setAppliedMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [agentLogs, setAgentLogs] = useState<string[]>([
    '[READY] Indexation codebase prête (Composants & Services)',
    '[AGENT] Prêt à cibler vos modifications techniques',
  ]);
  const [customDiffText, setCustomDiffText] = useState(
    `@@ -42,2 +42,3 @@\n- const ACCENT_COLOR = '#4F46E5';\n+ const ACCENT_COLOR = '#5A33FF';`
  );
  const [backups, setBackups] = useState([
    { id: 'b_03', date: "Aujourd'hui", name: 'Mise à jour Studio Montage & Piste', size: '2.4 MB' },
    { id: 'b_02', date: 'Hier', name: 'Optimisation moteur vidéo & audio', size: '2.1 MB' },
    { id: 'b_01', date: 'Initial', name: 'Socle applicatif Andrea', size: '1.9 MB' },
  ]);

  const analyzePromptWithMcpAgent = (prompt: string) => {
    setIsAnalyzing(true);
    const p = prompt.toLowerCase();
    setTimeout(() => {
      let target: CodebaseTarget;
      if (p.includes('montage') || p.includes('piste') || p.includes('audio')) {
        target = {
          file: 'src/components/MontageStudio.tsx',
          symbol: 'MontageStudio / Piste & 8 Menus',
          levelTitle: 'Niveau 4 · Montage',
          lineRange: 'L. 80-210',
          rationale: 'Cible la gestion de la piste, des menus de montage et de la recherche musicale.',
          diff: `@@ -142,1 +142,2 @@\n+ const splitThresholdMs = 800;`,
        };
      } else {
        target = {
          file: 'src/components/AndreaChat.tsx',
          symbol: 'AndreaChat / handleSendMessage',
          levelTitle: 'Niveau 4 · Discussion',
          lineRange: 'L. 120-210',
          rationale: "Cible la boucle de discussion et l'ouverture dynamique du mode Code & Aperçu.",
          diff: `@@ -95,1 +95,2 @@\n+ const maxContextTokens = 8192;`,
        };
      }
      setAgentAnalysis(target);
      setIsAnalyzing(false);
      setAgentLogs((prev) => [`[TARGET] ${target.file} -> ${target.symbol}`, ...prev.slice(0, 2)]);
    }, 350);
  };

  const handleApplyModification = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      const newBackup = {
        id: `b_0${backups.length + 1}`,
        date: "À l'instant",
        name: `Patch sur ${agentAnalysis.file}`,
        size: '2.5 MB',
      };
      setBackups([newBackup, ...backups.slice(0, 2)]);
      setAppliedMessage(`Modification appliquée sur ${agentAnalysis.file}.`);
      setTimeout(() => setAppliedMessage(null), 3000);
    }, 450);
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      <div className="shrink-0 p-4 rounded-2xl bg-[#140e2d] border border-[#5A33FF44] flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-400" />
            <span>Labo Dev Admin · Superviseur Technique</span>
          </h2>
          <p className="text-xs text-slate-300">Pilotage technique de l'architecture et des restaurations.</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>En ligne</span>
        </div>
      </div>

      {appliedMessage && (
        <div className="shrink-0 p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{appliedMessage}</span>
        </div>
      )}

      <div className="flex-1 min-h-0 rounded-2xl bg-[#100b24] border border-[#5A33FF44] flex flex-col overflow-hidden">
        <div className="shrink-0 px-4 py-2.5 bg-[#171038] border-b border-[#5A33FF33] flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'mcp' as const, label: 'Agent Technique', icon: Bot },
            { id: 'editor' as const, label: 'Éditeur', icon: Code2 },
            { id: 'diff' as const, label: 'Aperçu Diff', icon: GitCommit },
            { id: 'backups' as const, label: `Restaurations (${backups.length})`, icon: Clock },
            { id: 'tests' as const, label: 'Intégrité', icon: Shield },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white'
                    : 'text-[#c4b5fd] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-h-0 p-4 overflow-hidden">
          {activeTab === 'mcp' && (
            <div className="h-full flex flex-col justify-between gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <input
                  type="text"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && agentPrompt.trim()) analyzePromptWithMcpAgent(agentPrompt);
                  }}
                  placeholder="Envoyer une consigne technique..."
                  className="w-full bg-[#0c081e] border border-[#5A33FF66] rounded-xl px-4 py-2.5 pr-28 text-xs text-white focus:outline-none"
                />
                <button
                  onClick={() => agentPrompt.trim() && analyzePromptWithMcpAgent(agentPrompt)}
                  disabled={isAnalyzing || !agentPrompt.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#5A33FF] text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{isAnalyzing ? 'Analyse...' : 'Analyser'}</span>
                </button>
              </div>

              <div className="flex-1 min-h-0 p-4 rounded-2xl bg-[#150f33] border border-[#5A33FF55] flex flex-col justify-between gap-2 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-extrabold text-white font-mono">
                      {agentAnalysis.file} <span className="text-slate-400 text-xs">({agentAnalysis.lineRange})</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{agentAnalysis.rationale}</p>
                  </div>
                  <button
                    onClick={handleApplyModification}
                    disabled={isApplying}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isApplying ? 'Application...' : 'Appliquer'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-[#090616] border border-[#5A33FF44] font-mono text-xs text-slate-200 overflow-hidden">
                  {agentAnalysis.diff}
                </pre>

                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{agentLogs[0]}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <textarea
              value={customDiffText}
              onChange={(e) => setCustomDiffText(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 bg-[#0c0b17] rounded-2xl border border-[#5A33FF44] font-mono text-xs text-slate-200 focus:outline-none resize-none"
            />
          )}

          {activeTab === 'diff' && (
            <pre className="p-4 bg-[#090616] rounded-2xl border border-[#5A33FF33] font-mono text-xs text-slate-200 overflow-hidden">
              {agentAnalysis.diff}
            </pre>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-2.5">
              {backups.map((bk) => (
                <div key={bk.id} className="p-3 bg-[#14132b] rounded-2xl border border-[#5A33FF33] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{bk.name}</div>
                    <div className="text-[11px] text-slate-400">{bk.date} · {bk.size}</div>
                  </div>
                  <button
                    onClick={() => setAppliedMessage(`Restauration vers « ${bk.name} » effectuée.`)}
                    className="px-3 py-1.5 rounded-xl bg-[#201844] border border-[#5A33FF44] text-slate-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurer</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-2.5 text-xs">
              {[
                'Intégrité des composants & routage principal',
                'Chaîne vidéo verticale & sous-titres synchronisés',
                'Moteur audio universel & compétences internes d’Andrea',
              ].map((lbl, idx) => (
                <div key={idx} className="p-3.5 bg-[#14132b] rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                  <span className="font-bold text-white">{lbl}</span>
                  <span className="text-emerald-300 font-mono text-[11px] font-bold">OK</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
