import React, { useState } from 'react';
import {
  ArrowLeft,
  Code2,
  Copy,
  Check,
  Download,
  Eye,
  Laptop,
  Tablet,
  Smartphone,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  FileCode2,
  Plus,
} from 'lucide-react';
import { generateAppCodeFromPrompt } from '../services/andreaSkillsService';
import {
  bundleCodeFiles,
  buildAuditSummary,
  CodeAuditSummary,
  GeneratedCodeFiles,
} from '../services/andreaCodeArchitect';

export interface ActiveCodeProject {
  id: string;
  title: string;
  prompt: string;
  html: string;
  files?: GeneratedCodeFiles;
  audit?: CodeAuditSummary;
  history: Array<{ role: 'user' | 'andrea'; text: string }>;
}

interface CodeWorkspacePageProps {
  project: ActiveCodeProject;
  onUpdateProject: (next: ActiveCodeProject) => void;
  onBackToDiscussion: () => void;
}

type CodeViewTab = 'preview' | 'html' | 'css' | 'js';

export const CodeWorkspacePage: React.FC<CodeWorkspacePageProps> = ({
  project,
  onUpdateProject,
  onBackToDiscussion,
}) => {
  const [viewTab, setViewTab] = useState<CodeViewTab>('preview');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refinePrompt, setRefinePrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [undoStack, setUndoStack] = useState<Array<{ html: string; files?: GeneratedCodeFiles }>>([]);

  const activeFiles: GeneratedCodeFiles = project.files || {
    html: project.html,
    css: '/* Styles intégrés dans index.html */',
    js: '// Scripts intégrés dans index.html',
  };

  const activeAudit: CodeAuditSummary =
    project.audit || buildAuditSummary(activeFiles);

  const applyModification = (instruction: string) => {
    const clean = instruction.trim();
    if (!clean) return;

    setUndoStack((prev) => [...prev.slice(-7), { html: project.html, files: project.files }]);

    const updated = generateAppCodeFromPrompt(clean, project.html, project.files);
    onUpdateProject({
      ...project,
      html: updated.html,
      files: updated.files,
      audit: updated.audit,
      history: [
        ...project.history,
        { role: 'user' as const, text: clean },
        { role: 'andrea' as const, text: updated.summary },
      ].slice(-6),
    });
  };

  const handleRefine = () => {
    const clean = refinePrompt.trim();
    if (!clean) return;
    setRefinePrompt('');
    applyModification(clean);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    onUpdateProject({
      ...project,
      html: prev.html,
      files: prev.files,
      audit: prev.files ? buildAuditSummary(prev.files) : project.audit,
    });
  };

  const handleEditFilePart = (part: 'html' | 'css' | 'js', value: string) => {
    const nextFiles: GeneratedCodeFiles = {
      ...activeFiles,
      [part]: value,
    };
    const nextBundled = project.files
      ? bundleCodeFiles(project.title, nextFiles)
      : part === 'html'
      ? value
      : project.html;

    onUpdateProject({
      ...project,
      html: nextBundled,
      files: project.files ? nextFiles : undefined,
      audit: buildAuditSummary(nextFiles),
    });
  };

  const activeCodeContent =
    viewTab === 'css'
      ? activeFiles.css
      : viewTab === 'js'
      ? activeFiles.js
      : viewTab === 'html' && project.files
      ? activeFiles.html
      : project.html;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCodeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([project.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const QUICK_BLOCKS = [
    { label: '+ Tarifs', prompt: 'Ajoute une section tarifs à 3 colonnes' },
    { label: '+ FAQ', prompt: 'Ajoute une section FAQ interactive' },
    { label: '+ Formulaire', prompt: 'Ajoute un formulaire de contact rapide' },
    { label: '+ Témoignages', prompt: 'Ajoute une section témoignages clients' },
    { label: 'Thème Clair/Sombre', prompt: 'Change le thème clair ou sombre' },
  ];

  return (
    <div className="h-full flex flex-col gap-2.5 overflow-y-auto lg:overflow-hidden overflow-x-hidden text-xs">
      {/* Top Studio Bar */}
      <div className="shrink-0 p-2.5 bg-[#0a0e24] border border-[#1d2757] rounded-2xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBackToDiscussion}
            aria-label="Retour à la discussion"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#141c45] hover:bg-[#1e2a66] border border-[#2b3c8a] text-white font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Retour à la discussion</span>
            <span className="sm:hidden">Retour</span>
          </button>

          <div className="h-4 w-px bg-[#1d2757] shrink-0 hidden sm:block" />

          <div className="flex items-center gap-1.5 min-w-0">
            <Code2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-extrabold text-white truncate">{project.title}</span>
          </div>

          <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/35 text-[10px] font-bold text-emerald-300 shrink-0">
            <ShieldCheck className="w-3 h-3" />
            <span>{activeAudit.scoreLabel} · {activeAudit.interactiveCount} contrôles</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Preview + Multi-file Code Tabs */}
          <div className="flex items-center bg-[#101638] border border-[#222c5e] rounded-xl p-0.5">
            <button
              onClick={() => setViewTab('preview')}
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                viewTab === 'preview' ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu</span>
            </button>
            <button
              onClick={() => setViewTab('html')}
              className={`px-2 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                viewTab === 'html' ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>
            {project.files && (
              <>
                <button
                  onClick={() => setViewTab('css')}
                  className={`px-2 py-1.5 rounded-lg font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                    viewTab === 'css' ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  CSS
                </button>
                <button
                  onClick={() => setViewTab('js')}
                  className={`px-2 py-1.5 rounded-lg font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                    viewTab === 'js' ? 'bg-[#2563eb] text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  JS
                </button>
              </>
            )}
          </div>

          {viewTab === 'preview' && (
            <div className="hidden sm:flex items-center bg-[#101638] border border-[#222c5e] rounded-xl p-0.5">
              <button
                onClick={() => setDeviceMode('desktop')}
                aria-label="Vue Bureau"
                className={`p-1.5 rounded-lg cursor-pointer ${
                  deviceMode === 'desktop' ? 'bg-[#1b2b73] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vue Bureau"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                aria-label="Vue Tablette"
                className={`p-1.5 rounded-lg cursor-pointer ${
                  deviceMode === 'tablet' ? 'bg-[#1b2b73] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vue Tablette"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                aria-label="Vue Mobile"
                className={`p-1.5 rounded-lg cursor-pointer ${
                  deviceMode === 'mobile' ? 'bg-[#1b2b73] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vue Mobile"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {undoStack.length > 0 && (
            <button
              onClick={handleUndo}
              aria-label="Annuler la dernière modification"
              title="Annuler la dernière modification"
              className="px-2.5 py-1.5 bg-[#141c45] hover:bg-[#1e2a66] border border-[#2b3c8a] text-slate-200 font-bold rounded-xl flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Annuler</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            aria-label="Copier le code"
            className="px-2.5 sm:px-3 py-1.5 bg-[#141c45] hover:bg-[#1e2a66] border border-[#2b3c8a] text-slate-200 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            aria-label="Télécharger le fichier HTML complet"
            className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Télécharger .html</span>
            <span className="sm:hidden">.html</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:overflow-hidden">
        {/* Left: Iterative Architect Assistant + Quick Components */}
        <div className="lg:col-span-4 bg-[#0d122c] border border-[#1e2754] rounded-2xl p-3 flex flex-col justify-between gap-2.5 overflow-hidden">
          <div className="space-y-2 shrink-0">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1d2757]">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="font-extrabold text-white">Andrea · Architecte Web &amp; App</div>
                <div className="text-[10px] text-slate-400">
                  Architecture modulaire HTML / CSS / JS en direct
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {QUICK_BLOCKS.map((blk) => (
                <button
                  key={blk.label}
                  type="button"
                  onClick={() => applyModification(blk.prompt)}
                  className="px-2 py-1 rounded-lg bg-[#141c45] hover:bg-[#1e2a66] border border-[#2b3c8a] text-[10px] font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-2.5 h-2.5 text-sky-400" />
                  <span>{blk.label.replace(/^\+\s*/, '')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-end gap-2 overflow-hidden">
            {project.history.slice(-4).map((item, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-[11px] leading-snug ${
                  item.role === 'user'
                    ? 'bg-[#1b2559] border-[#2b3a82] text-white ml-4'
                    : 'bg-[#11173b] border-[#1f295e] text-slate-200 mr-4'
                }`}
              >
                <span className="font-bold block text-[10px] text-sky-300 mb-0.5">
                  {item.role === 'user' ? 'Vous' : 'Andrea'}
                </span>
                <p className="line-clamp-3">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="shrink-0 pt-2 border-t border-[#1d2757] flex items-center gap-2">
            <input
              type="text"
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRefine();
              }}
              placeholder="Demander une modification (couleurs, sections, JS)..."
              className="flex-1 px-3 py-2 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={handleRefine}
              disabled={!refinePrompt.trim()}
              aria-label="Appliquer la modification"
              className="p-2 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 text-white rounded-xl cursor-pointer shrink-0"
              title="Appliquer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Live Preview or Multi-File Code Editor */}
        <div className="lg:col-span-8 bg-[#080c1f] border border-[#1e2754] rounded-2xl p-3 flex flex-col overflow-hidden">
          {viewTab === 'preview' ? (
            <div className="flex-1 min-h-0 flex items-center justify-center bg-[#050814] rounded-xl border border-[#1a2248] overflow-hidden p-2">
              <iframe
                title={project.title}
                srcDoc={project.html}
                className={`h-full bg-white rounded-xl border border-slate-700 transition-all ${
                  deviceMode === 'mobile'
                    ? 'w-[375px] max-w-full'
                    : deviceMode === 'tablet'
                    ? 'w-[768px] max-w-full'
                    : 'w-full'
                }`}
              />
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col rounded-xl bg-[#050814] border border-[#1a2248] overflow-hidden">
              <div className="px-3 py-2 bg-[#0e1430] border-b border-[#1a2248] flex items-center justify-between text-[11px] font-mono text-slate-300 shrink-0">
                <span>
                  {viewTab === 'css'
                    ? 'styles.css'
                    : viewTab === 'js'
                    ? 'app.js'
                    : 'index.html'}
                </span>
                <span className="tabular-nums">{activeCodeContent.length} caractères</span>
              </div>
              <textarea
                value={activeCodeContent}
                onChange={(e) =>
                  handleEditFilePart(viewTab === 'css' ? 'css' : viewTab === 'js' ? 'js' : 'html', e.target.value)
                }
                spellCheck={false}
                aria-label={`Éditeur ${viewTab}`}
                className="flex-1 w-full p-3 bg-[#050814] text-emerald-300 font-mono text-[11px] leading-relaxed focus:outline-none resize-none overflow-y-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
