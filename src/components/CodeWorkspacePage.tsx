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
  Github,
  X,
  Lock,
  Globe,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { generateAppCodeFromPrompt } from '../services/andreaSkillsService';
import {
  bundleCodeFiles,
  buildAuditSummary,
  CodeAuditSummary,
  GeneratedCodeFiles,
} from '../services/andreaCodeArchitect';
import {
  fetchGitHubUser,
  pushFilesToGitHub,
  slugifyRepoName,
} from '../services/githubPushService';

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

  // Push to GitHub modal state
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [ghToken, setGhToken] = useState('');
  const [showGhToken, setShowGhToken] = useState(false);
  const [ghOwner, setGhOwner] = useState('');
  const [ghRepoName, setGhRepoName] = useState(() => slugifyRepoName(project.title));
  const [ghBranch, setGhBranch] = useState('main');
  const [ghIsPrivate, setGhIsPrivate] = useState(false);
  const [ghCommitMsg, setGhCommitMsg] = useState('Initial commit from Andrea Code Workspace');
  const [ghProgress, setGhProgress] = useState<string | null>(null);
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghPushedUrl, setGhPushedUrl] = useState<string | null>(null);
  const [isPushingGh, setIsPushingGh] = useState(false);
  const [copiedRepoUrl, setCopiedRepoUrl] = useState(false);

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

  const handleOpenGitHubModal = () => {
    setGhRepoName(slugifyRepoName(project.title));
    setGhError(null);
    setGhProgress(null);
    setGhPushedUrl(null);
    setIsGitHubModalOpen(true);
  };

  const handleDetectGitHubUser = async () => {
    setGhError(null);
    try {
      const user = await fetchGitHubUser(ghToken);
      setGhOwner(user.login);
      setGhProgress(`Compte GitHub vérifié : @${user.login}`);
    } catch (err) {
      setGhError(err instanceof Error ? err.message : 'Impossible de vérifier le token GitHub.');
    }
  };

  const handlePushToGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPushingGh) return;
    setGhError(null);
    setGhPushedUrl(null);
    setIsPushingGh(true);

    try {
      const readme = `# ${project.title}\n\n${project.prompt || 'Application web générée dans Andrea Code Workspace.'}\n\n## Fichiers inclus\n- \`index.html\`\n- \`styles.css\`\n- \`app.js\`\n`;
      const result = await pushFilesToGitHub({
        token: ghToken,
        owner: ghOwner,
        repo: ghRepoName,
        branch: ghBranch,
        isPrivate: ghIsPrivate,
        description: project.prompt?.slice(0, 140) || project.title,
        commitMessage: ghCommitMsg,
        files: [
          { path: 'index.html', content: activeFiles.html },
          { path: 'styles.css', content: activeFiles.css },
          { path: 'app.js', content: activeFiles.js },
          { path: 'README.md', content: readme },
        ],
        onProgress: (msg) => setGhProgress(msg),
      });

      setGhOwner(result.owner);
      setGhPushedUrl(result.repoUrl);
      setGhProgress(`${result.filesPushed} fichiers poussés sur la branche ${result.branch}.`);
    } catch (err) {
      setGhError(err instanceof Error ? err.message : 'Erreur lors du push vers GitHub.');
    } finally {
      setIsPushingGh(false);
    }
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
            onClick={handleOpenGitHubModal}
            aria-label="Push to GitHub"
            className="px-2.5 sm:px-3 py-1.5 bg-[#18182b] hover:bg-[#242442] border border-[#3b3b66] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            title="Pousser ce projet vers un dépôt GitHub"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Push to GitHub</span>
            <span className="sm:hidden">GitHub</span>
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

      {/* Modal Push to GitHub */}
      {isGitHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0e1329] border border-[#2b356d] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-[#141b3d] border-b border-[#2b356d] flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-white text-sm">
                <Github className="w-4 h-4 text-sky-400" />
                <span>Push to GitHub</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(false)}
                aria-label="Fermer la fenêtre GitHub"
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePushToGitHub} className="p-4 space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="gh-pat-input" className="font-bold text-slate-200">
                    Token d&apos;accès personnel GitHub (PAT · scope <span className="font-mono text-sky-300">repo</span>)
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGitHubUser}
                    disabled={!ghToken.trim() || isPushingGh}
                    className="text-[11px] font-bold text-sky-300 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    Vérifier le compte
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="gh-pat-input"
                    type={showGhToken ? 'text' : 'password'}
                    value={ghToken}
                    onChange={(e) => setGhToken(e.target.value)}
                    placeholder="ghp_... ou github_pat_..."
                    required
                    className="w-full px-3 py-2 pr-16 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGhToken((v) => !v)}
                    className="absolute right-2.5 top-2 text-[11px] font-bold text-slate-300 hover:text-white cursor-pointer"
                  >
                    {showGhToken ? 'Masquer' : 'Voir'}
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Utilisé uniquement en direct depuis votre navigateur pour créer/mettre à jour votre dépôt. Jamais enregistré.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="gh-owner-input" className="font-bold text-slate-200 block mb-1">
                    Propriétaire (Username)
                  </label>
                  <input
                    id="gh-owner-input"
                    type="text"
                    value={ghOwner}
                    onChange={(e) => setGhOwner(e.target.value)}
                    placeholder="Auto-détecté via token"
                    className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label htmlFor="gh-repo-input" className="font-bold text-slate-200 block mb-1">
                    Nom du dépôt
                  </label>
                  <input
                    id="gh-repo-input"
                    type="text"
                    value={ghRepoName}
                    onChange={(e) => setGhRepoName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="gh-branch-input" className="font-bold text-slate-200 block mb-1">
                    Branche cible
                  </label>
                  <input
                    id="gh-branch-input"
                    type="text"
                    value={ghBranch}
                    onChange={(e) => setGhBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block mb-1">Visibilité</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGhIsPrivate(false)}
                      className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        !ghIsPrivate
                          ? 'bg-[#2563eb] border-sky-400 text-white'
                          : 'bg-[#141b3d] border-[#2b3c8a] text-slate-300'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGhIsPrivate(true)}
                      className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        ghIsPrivate
                          ? 'bg-[#2563eb] border-sky-400 text-white'
                          : 'bg-[#141b3d] border-[#2b3c8a] text-slate-300'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Privé</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="gh-commit-input" className="font-bold text-slate-200 block mb-1">
                  Message de commit
                </label>
                <input
                  id="gh-commit-input"
                  type="text"
                  value={ghCommitMsg}
                  onChange={(e) => setGhCommitMsg(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#11173b] border border-[#232f6b] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
                <span>Fichiers inclus :</span>
                <span className="font-mono text-sky-300">index.html · styles.css · app.js · README.md</span>
              </div>

              {ghError && (
                <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-[11px]">
                  {ghError}
                </div>
              )}

              {ghProgress && !ghError && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-[11px]">
                  {ghProgress}
                </div>
              )}

              {ghPushedUrl && (
                <div className="p-3 rounded-xl bg-[#141b3d] border border-emerald-500/50 flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={ghPushedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sky-300 hover:text-white flex items-center gap-1.5 underline truncate"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{ghPushedUrl}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(ghPushedUrl);
                      setCopiedRepoUrl(true);
                      setTimeout(() => setCopiedRepoUrl(false), 1800);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#2563eb] text-white font-bold text-[11px] cursor-pointer shrink-0"
                  >
                    {copiedRepoUrl ? 'Copié' : 'Copier lien'}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsGitHubModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#141b3d] hover:bg-[#1e2a66] border border-[#2b3c8a] text-slate-200 font-bold cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={isPushingGh || !ghToken.trim() || !ghRepoName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isPushingGh ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />}
                  <span>{isPushingGh ? 'Push en cours...' : 'Créer & Pousser sur GitHub'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
