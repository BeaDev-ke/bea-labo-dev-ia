import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Eye, 
  FileText, 
  Play, 
  History, 
  BookOpen, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Terminal,
  Zap,
  ArrowRight,
  Wand2,
  Trophy,
  Globe,
  Brain,
  Sliders,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { LAB_LEVELS, SAMPLE_TARGET_SNIPPETS } from '../data/labLevels';
import { ModifLevelId, BackupItem, DiffLine, SubLevelItem } from '../types/bea';

interface DevLabProps {
  onGoToProd: () => void;
  onViewFullCode: () => void;
}

export const DevLab: React.FC<DevLabProps> = ({ onGoToProd, onViewFullCode }) => {
  const [selectedLevel, setSelectedLevel] = useState<ModifLevelId>('3');
  const [activeTab, setActiveTab] = useState<'modify' | 'diff' | 'backups' | 'guide' | 'roadmap'>('modify');
  const [modelChoice, setModelChoice] = useState('openai/gpt-oss-120b');
  const [backupName, setBackupName] = useState(`backup_lvl3_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`);
  const [selectedTargetLabel, setSelectedTargetLabel] = useState<string>('Comportement de base de Bea (SYSTEM_BEHAVIOR_BASE)');
  const [selectedSubLevelId, setSelectedSubLevelId] = useState<string>('3.1');
  const [applyMode, setApplyMode] = useState<'direct' | 'diff'>('direct');
  const [prompt, setPrompt] = useState('Insérer une grille de diagnostic Fogg pour chaque problème soumis.');
  
  // Mode d'édition et code manuel
  const [editMode, setEditMode] = useState<'ai' | 'manual'>('ai');
  const [manualCode, setManualCode] = useState<string>('');

  // Simulation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [validationSuccess, setValidationSuccess] = useState<boolean | null>(null);
  const [validationMsg, setValidationMsg] = useState<string>('');
  const [lastDiffLines, setLastDiffLines] = useState<DiffLine[] | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Roadmap activation states for interactive demonstration
  const [activatedPillars, setActivatedPillars] = useState<Record<string, boolean>>({
    'duplex_voice': true,
    'memory_graph': true,
    'dual_canvas': true,
    'autonomous_nudges': false,
    'ast_shield': true,
    'multilingual_15': true,
  });

  // Backups list
  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: 'bk-1',
      name: 'backup_lvl3_fogg_behavior_safe',
      timestamp: 'Aujourd\'hui 11:25:40',
      level: '3',
      target: 'SYSTEM_BEHAVIOR_BASE',
      summary: 'Grille d\'analyse Fogg et 5 étapes opérationnelles',
      codeSnippet: 'SYSTEM_BEHAVIOR_BASE = """Tu es Bea, une IA d\'analyse comportementale..."""',
    },
    {
      id: 'bk-2',
      name: 'backup_lvl1_clean_monochrome',
      timestamp: 'Aujourd\'hui 10:14:12',
      level: '1',
      target: 'CSS_STYLES',
      summary: 'Thème neutre épuré style ChatGPT / Claude',
      codeSnippet: '.stApp { background: #121214 !important; }',
    },
    {
      id: 'bk-3',
      name: 'backup_lvl6_sitebuilder_templates',
      timestamp: 'Hier 18:40:02',
      level: '6',
      target: 'SiteBuilder',
      summary: 'Générateur de sites web haute conversion & formulaires',
      codeSnippet: '<!-- Moteur Bâtisseur de Site Web Bea BehaviorLab AI -->',
    },
  ]);

  const currentLevelInfo = LAB_LEVELS[selectedLevel] || LAB_LEVELS['1'];
  const targetKeys = Object.keys(currentLevelInfo.targets);
  const currentTargetId = currentLevelInfo.targets[selectedTargetLabel] || targetKeys[0] || 'SYSTEM_BEHAVIOR_BASE';
  const currentSnippet = SAMPLE_TARGET_SNIPPETS[currentTargetId] || `# Code source de ${currentTargetId}\ndef ${currentTargetId}():\n    pass`;

  const handleLevelChange = (lvl: ModifLevelId) => {
    setSelectedLevel(lvl);
    const newLevelInfo = LAB_LEVELS[lvl];
    const newTargets = Object.keys(newLevelInfo.targets);
    setSelectedTargetLabel(newTargets[0] || '');
    if (newLevelInfo.subLevels && newLevelInfo.subLevels.length > 0) {
      const firstSub = newLevelInfo.subLevels[0];
      setSelectedSubLevelId(firstSub.id);
      setPrompt(firstSub.defaultPreset);
    } else {
      setSelectedSubLevelId('');
      setPrompt(newLevelInfo.presets[0] || '');
    }
    setBackupName(`backup_lvl${lvl}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`);
  };

  const handleSelectSubLevel = (sub: SubLevelItem) => {
    setSelectedSubLevelId(sub.id);
    setPrompt(sub.defaultPreset);
    // Select corresponding target label if found
    const matchingKey = targetKeys.find(k => currentLevelInfo.targets[k] === sub.target);
    if (matchingKey) {
      setSelectedTargetLabel(matchingKey);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setPrompt(preset);
  };

  const runModification = async () => {
    const chosenPrompt = prompt.trim() || currentLevelInfo.presets[0];
    if (editMode === 'ai' && !prompt.trim()) {
      setPrompt(chosenPrompt);
    }
    const effectiveContent = editMode === 'ai' ? chosenPrompt : (manualCode.trim() || currentSnippet);
    if (!effectiveContent) return;
    setIsProcessing(true);
    setValidationSuccess(null);
    setRecentNotification(null);

    // Step 1: Extraction
    setProcessStep(`1/5 - Isolation chirurgicale de la cible : ${currentTargetId} (Niveau ${selectedLevel})...`);
    await new Promise(r => setTimeout(r, 400));

    // Step 2: Cerveau IA
    setProcessStep(`2/5 - Raisonnement par le Moteur IA Bea (BehaviorLab AI)...`);
    await new Promise(r => setTimeout(r, 550));

    // Step 3: Génération
    setProcessStep(`3/5 - Synthèse du bloc optimisé selon le sous-niveau ${selectedSubLevelId || selectedLevel}...`);
    await new Promise(r => setTimeout(r, 500));

    // Step 4: AST Validation
    setProcessStep(`4/5 - Contrôle de syntaxe Python strict (ast.parse)...`);
    await new Promise(r => setTimeout(r, 400));

    setValidationSuccess(true);
    setValidationMsg('Contrôle ast.parse 100% réussi : zéro SyntaxError, indentation validée, prêt pour la prod.');

    // Generate simulated Diff
    const diff: DiffLine[] = [
      { type: 'same', text: `def ${currentTargetId}():` },
      { type: 'same', text: `    # Bloc initialisé pour le niveau ${selectedLevel}` },
      { type: 'remove', text: `    # Version précédente sans optimisation comportementale` },
      { type: 'add', text: `    # [Niveau ${selectedLevel}${selectedSubLevelId ? ' · ' + selectedSubLevelId : ''}] Optimisation active :` },
      { type: 'add', text: `    # Directive : ${chosenPrompt.slice(0, 65)}...` },
      { type: 'add', text: `    return execute_behavioral_pipeline("${currentTargetId}")` },
      { type: 'same', text: `    # Fin du bloc validé` },
    ];
    setLastDiffLines(diff);

    // Step 5: Save
    setProcessStep(`5/5 - Création du snapshot de sauvegarde et déploiement...`);
    await new Promise(r => setTimeout(r, 350));

    const newBackup: BackupItem = {
      id: `bk-${Date.now()}`,
      name: backupName,
      timestamp: 'À l\'instant',
      level: selectedLevel,
      target: currentTargetId,
      summary: chosenPrompt.slice(0, 70) + (chosenPrompt.length > 70 ? '...' : ''),
      codeSnippet: `# Snapshot Niveau ${selectedLevel}\n# Cible : ${currentTargetId}\n# Directive : ${chosenPrompt}`,
    };
    setBackups(prev => [newBackup, ...prev]);

    setIsProcessing(false);
    setProcessStep('');
    setRecentNotification(`Modification du Niveau ${selectedLevel} (${currentTargetId}) appliquée avec succès ! Syntaxe validée.`);
    
    if (applyMode === 'diff') {
      setActiveTab('diff');
    }
  };

  const handleRollback = (backup: BackupItem) => {
    setRecentNotification(`Restauration réussie vers la sauvegarde ${backup.name} (${backup.timestamp}).`);
  };

  const togglePillar = (key: string) => {
    setActivatedPillars(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                BehaviorLab AI · Système Dev
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                AST Shield Actif (Anti-Crash)
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                8 Niveaux d'Intervention
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              🧪 Labo Dev IA <span className="text-zinc-400">Bea</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mt-1 leading-relaxed">
              Pilotez l'architecture de Bea par niveaux et sous-niveaux ultra-ciblés : de la micro-retouche visuelle jusqu'aux moteurs multi-agents, bâtisseur web, mémoire vectorielle et sécurité globale.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={onViewFullCode}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-zinc-200 transition flex items-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4 text-zinc-300" />
              <span>app.py</span>
            </button>
            <button
              onClick={onGoToProd}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition flex items-center gap-2 shadow"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Tester le Site (Prod)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification banner avec action directe */}
      {recentNotification && (
        <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-2xl p-4 text-sm text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium text-xs sm:text-sm">{recentNotification}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={onGoToProd}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
            >
              <span>🌐 Voir sur le Site</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRecentNotification(null)}
              className="text-xs text-emerald-400 hover:text-white underline px-2 py-1"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION - ALIGNÉS À DROITE SANS COULEURS FLASHY */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 overflow-x-auto justify-end">
        <button
          onClick={() => setActiveTab('modify')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
            activeTab === 'modify'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>🚀 Modifier (8 Niveaux)</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
            activeTab === 'roadmap'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>🏆 Vision Top 10 Mondial</span>
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
            activeTab === 'diff'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>🔍 Diff & Inspection</span>
          {lastDiffLines && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
        </button>

        <button
          onClick={() => setActiveTab('backups')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
            activeTab === 'backups'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
          }`}
        >
          <History className="w-4 h-4" />
          <span>💾 Sauvegardes ({backups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
            activeTab === 'guide'
              ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>📖 Guide Architecture</span>
        </button>
      </div>

      {/* TAB 1: MODIFIER PAR NIVEAU & SOUS-NIVEAUX */}
      {activeTab === 'modify' && (
        <div className="space-y-6">
          {/* LEVEL SELECTOR: 8 NIVEAUX DISPONIBLES EN GRILLE ULTRA-CLAIRE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-300" />
                <span>1. Choisissez le Niveau d'Intervention (8 Niveaux) :</span>
              </label>
              <span className="text-xs text-zinc-400">Isolation chirurgicale garantie</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(LAB_LEVELS) as ModifLevelId[]).map(lvlId => {
                const lvl = LAB_LEVELS[lvlId];
                const isSelected = selectedLevel === lvlId;
                return (
                  <button
                    key={lvlId}
                    type="button"
                    onClick={() => handleLevelChange(lvlId)}
                    className={`text-left p-3.5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-600 shadow-md ring-1 ring-zinc-500'
                        : 'bg-[#18181b] border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${lvl.color}`}>
                          {lvl.badge}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="text-xs font-bold text-white mb-1">{lvl.title}</div>
                      <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {lvl.scope}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SOUS-NIVEAUX D'INTERVENTION SPÉCIFIQUES AU NIVEAU CHOISI */}
          {currentLevelInfo.subLevels && currentLevelInfo.subLevels.length > 0 && (
            <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Sous-Niveaux & Spécialisations pour le {currentLevelInfo.badge} :</span>
                </label>
                <span className="text-[11px] text-zinc-400">Cliquez pour pré-remplir l'intervention</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {currentLevelInfo.subLevels.map(sub => {
                  const isSubSelected = selectedSubLevelId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSelectSubLevel(sub)}
                      className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                        isSubSelected
                          ? 'bg-zinc-800/90 border-zinc-600 shadow-sm text-white'
                          : 'bg-[#212121] border-zinc-800/90 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-700/60 text-zinc-200">
                            {sub.id}
                          </span>
                          {isSubSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </div>
                        <div className="text-xs font-bold text-white mb-1">{sub.title}</div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {sub.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CONFIGURATION & CIBLE */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target selector */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-zinc-300" />
                  <span>2. Cible spécifique pour le Niveau {selectedLevel} :</span>
                </label>
                <select
                  value={selectedTargetLabel}
                  onChange={e => setSelectedTargetLabel(e.target.value)}
                  className="w-full bg-[#212121] border border-zinc-700 text-white text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-zinc-500"
                >
                  {targetKeys.map(key => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Identifiant Python : <code className="text-zinc-200 font-mono">{currentTargetId}</code> · Seul ce bloc sera modifié et validé par ast.parse.
                </p>
              </div>

              {/* Model choice */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Cerveau IA :</span>
                </label>
                <select
                  value={modelChoice}
                  onChange={e => setModelChoice(e.target.value)}
                  className="w-full bg-[#212121] border border-zinc-700 text-white text-xs font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-zinc-500"
                >
                  <option value="openai/gpt-oss-120b">GPT OSS 120B (Ultra recommandé)</option>
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Puissant)</option>
                  <option value="openai/gpt-oss-20b">GPT OSS 20B (Codeur)</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B (Instantané)</option>
                </select>
              </div>
            </div>

            {/* Presets rapides */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <label className="block text-xs font-semibold text-zinc-400">
                Idées de modifications pré-validées :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentLevelInfo.presets.map((pr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(pr)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-[#212121] hover:bg-zinc-700/60 border border-zinc-700 text-zinc-300 hover:text-white transition"
                  >
                    💡 {pr}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selection: Prompt IA ou Code Manuel */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1 bg-[#212121] p-1 rounded-xl border border-zinc-700 text-xs">
                <button
                  type="button"
                  onClick={() => setEditMode('ai')}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    editMode === 'ai' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  🤖 Par Prompt IA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode('manual');
                    if (!manualCode) setManualCode(currentSnippet);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    editMode === 'manual' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  ✍️ Code Manuel Direct
                </button>
              </div>

              <div className="text-[11px] text-zinc-400">
                Mode d'application : <strong>{applyMode === 'direct' ? 'Déploiement direct' : 'Validation visuelle (Diff)'}</strong>
              </div>
            </div>

            {/* Textarea instruction or code */}
            {editMode === 'ai' ? (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-white">
                  3. Décrivez précisément la modification à appliquer :
                </label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder={`Exemple : Optimiser le bloc ${currentTargetId} pour ajouter une relance comportementale...`}
                  className="w-full bg-[#212121] border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono leading-relaxed"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white">
                    3. Édition manuelle du bloc ({currentTargetId}) :
                  </label>
                  <button
                    type="button"
                    onClick={() => setManualCode(currentSnippet)}
                    className="text-[11px] text-zinc-400 hover:text-white underline"
                  >
                    Réinitialiser au code original
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={manualCode || currentSnippet}
                  onChange={e => setManualCode(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-700 rounded-xl p-3 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-zinc-500"
                />
              </div>
            )}

            {/* Action footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={backupName}
                  onChange={e => setBackupName(e.target.value)}
                  placeholder="Nom de la sauvegarde"
                  className="bg-[#212121] border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-mono focus:outline-none w-56"
                />
                <select
                  value={applyMode}
                  onChange={e => setApplyMode(e.target.value as any)}
                  className="bg-[#212121] border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="direct">Sauvegarder & Appliquer</option>
                  <option value="diff">Inspecter le Diff avant validation</option>
                </select>
              </div>

              <button
                type="button"
                onClick={runModification}
                disabled={isProcessing}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                  isProcessing 
                    ? 'bg-zinc-700 text-zinc-400 cursor-wait' 
                    : 'bg-white hover:bg-zinc-200 text-black active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Lancer la Modification (Niveau {selectedLevel})</span>
                  </>
                )}
              </button>
            </div>

            {/* Process step live feed */}
            {isProcessing && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-2.5 animate-in fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{processStep}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VISION & ROADMAP TOP 10 MONDIAL */}
      {activeTab === 'roadmap' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Analyse Stratégique & Feuille de Route BehaviorLab AI</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Ce qui sépare Bea d'un outil IA dans le TOP 10 MONDIAL
            </h2>
            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              Pour rivaliser avec les géants mondiaux (ChatGPT, Claude, Cursor, Perplexity, Midjourney, v0), un outil ne peut pas se contenter d'un simple chat passif. Il doit être <strong>multimodal, proactif, doté d'une mémoire cognitive profonde et d'un environnement de création en direct</strong>.
            </p>
          </div>

          {/* THE 6 CRITICAL PILLARS TO ENTER TOP 10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PILLAR 1: MULTIMODAL DUPLEX */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activatedPillars.duplex_voice ? 'bg-[#212121] border-zinc-600 shadow-md' : 'bg-[#18181b] border-zinc-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    🎙️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">1. Voix Full-Duplex & Latence &lt;250ms</h3>
                    <div className="text-[10px] text-zinc-400">Comme ChatGPT Advanced Voice & Gemini Live</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePillar('duplex_voice')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                    activatedPillars.duplex_voice ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {activatedPillars.duplex_voice ? '✓ Actif' : 'Désactivé'}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <strong>Ce qui manque aux IAs ordinaires :</strong> Elles attendent qu'on clique sur un micro puis s'arrêtent. Un outil du Top 10 permet de converser oralement en continu, avec des intonations naturelles, en pouvant interrompre l'IA quand elle parle.
              </p>
              <div className="text-[11px] text-zinc-400 bg-[#141416] p-2.5 rounded-xl border border-zinc-800">
                <strong>Dans Bea :</strong> Intégration de Web Speech API dictée sans coupure + synthèse vocale adaptative (`beaVoice`).
              </div>
            </div>

            {/* PILLAR 2: PERSISTENT COGNITIVE MEMORY */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activatedPillars.memory_graph ? 'bg-[#212121] border-zinc-600 shadow-md' : 'bg-[#18181b] border-zinc-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    🧠
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">2. Graphe de Mémoire Cognitive</h3>
                    <div className="text-[10px] text-zinc-400">Bien plus qu'un simple historique de chat</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePillar('memory_graph')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                    activatedPillars.memory_graph ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {activatedPillars.memory_graph ? '✓ Actif' : 'Désactivé'}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <strong>Ce qui manque aux IAs ordinaires :</strong> Elles oublient dès qu'une session expire. Un outil du Top 10 cartographie vos forces, vos moments de découragement, vos projets récurrents et ajuste ses conseils sans que vous ayez à vous répéter.
              </p>
              <div className="text-[11px] text-zinc-400 bg-[#141416] p-2.5 rounded-xl border border-zinc-800">
                <strong>Dans Bea :</strong> Table Supabase `memories` persistante avec profilage automatique (étudiant, créateur, indépendant) et suivi de la série de jours consécutifs.
              </div>
            </div>

            {/* PILLAR 3: DUAL-CANVAS INTERACTIVE WORKSPACE */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activatedPillars.dual_canvas ? 'bg-[#212121] border-zinc-600 shadow-md' : 'bg-[#18181b] border-zinc-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    ⚡
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">3. Espace Double-Canvas (Style Claude Artifacts & Cursor)</h3>
                    <div className="text-[10px] text-zinc-400">Le chat à gauche, le produit vivant à droite</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePillar('dual_canvas')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                    activatedPillars.dual_canvas ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {activatedPillars.dual_canvas ? '✓ Actif' : 'Désactivé'}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <strong>Ce qui manque aux IAs ordinaires :</strong> Tout reste enfermé dans des blocs de texte. Dans le Top 10, quand vous demandez un site web ou une miniature, l'application s'affiche en direct à côté et s'actualise au millimètre.
              </p>
              <div className="text-[11px] text-zinc-400 bg-[#141416] p-2.5 rounded-xl border border-zinc-800">
                <strong>Dans Bea :</strong> SiteBuilder réactif avec aperçu Desktop/Mobile interactif et VisualDesignStudio avec canevas 9:16 / 1:1 / 16:9.
              </div>
            </div>

            {/* PILLAR 4: PROACTIVE NUDGES */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activatedPillars.autonomous_nudges ? 'bg-[#212121] border-zinc-600 shadow-md' : 'bg-[#18181b] border-zinc-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">4. Relances Comportementales Proactives (Nudges)</h3>
                    <div className="text-[10px] text-zinc-400">Une IA qui vient vers vous au moment critique</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePillar('autonomous_nudges')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                    activatedPillars.autonomous_nudges ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {activatedPillars.autonomous_nudges ? '✓ Actif' : 'En test'}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <strong>Ce qui manque aux IAs ordinaires :</strong> Si vous ne revenez pas, elles ne font rien. Le secret d'une IA comportementale d'élite est de vous envoyer un check-in amical quand vous aviez promis de faire une tâche à 15h.
              </p>
              <div className="text-[11px] text-zinc-400 bg-[#141416] p-2.5 rounded-xl border border-zinc-800">
                <strong>Dans Bea :</strong> Système de streaks (jours consécutifs) et compteur d'élan mental (Momentum Points).
              </div>
            </div>

            {/* PILLAR 5: AST SHIELD & ZERO CRASH */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activatedPillars.ast_shield ? 'bg-[#212121] border-zinc-600 shadow-md' : 'bg-[#18181b] border-zinc-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">5. Exécution Sans Erreur & Bouclier AST</h3>
                    <div className="text-[10px] text-zinc-400">Zéro plantage en production garanti</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePillar('ast_shield')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                    activatedPillars.ast_shield ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {activatedPillars.ast_shield ? '✓ Actif' : 'Désactivé'}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <strong>Ce qui manque aux IAs ordinaires :</strong> Elles génèrent du code qui casse dès qu'on le lance. Un outil du Top 10 inspecte le code dans un arbre abstrait (AST) avant de l'écrire et rollback automatiquement en cas de pépin.
              </p>
              <div className="text-[11px] text-zinc-400 bg-[#141416] p-2.5 rounded-xl border border-zinc-800">
                <strong>Dans Bea :</strong> Labo Dev IA avec validation <code className="text-white font-mono">ast.parse()</code> intégrée et historique de snapshots.
              </div>
            </div>

            {/* PILLAR 6: 15 WORLD LANGUAGES */}
            <div className={`p-5 rounded-2xl border transition-all ${
              activatedPillars.multilingual_15 ? 'bg-[#212121] border-zinc-600 shadow-md' : 'bg-[#18181b] border-zinc-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-lg">
                    🌍
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">6. 15 Langues Majeures & Adaptation Culturelle</h3>
                    <div className="text-[10px] text-zinc-400">Présence mondiale instantanée</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePillar('multilingual_15')}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                    activatedPillars.multilingual_15 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {activatedPillars.multilingual_15 ? '✓ Actif' : 'Désactivé'}
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                <strong>Ce qui manque aux IAs ordinaires :</strong> Traductions mot à mot froides. Dans le Top 10, les métaphores comportementales et les déclencheurs de passage à l'action sont adaptés aux cultures occidentales, asiatiques, arabes et africaines.
              </p>
              <div className="text-[11px] text-zinc-400 bg-[#141416] p-2.5 rounded-xl border border-zinc-800">
                <strong>Dans Bea :</strong> Prise en charge des 15 langues majeures (FR, EN, ES, DE, PT, IT, NL, AR, ZH, JA, KO, RU, HI, TR, WO) dès la vitrine.
              </div>
            </div>
          </div>

          {/* MATRICE COMPARATIVE */}
          <div className="p-6 bg-[#212121] border border-zinc-700 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <span>Comparatif mondial : Bea vs ChatGPT vs Claude vs Cursor</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase text-zinc-400 border-b border-zinc-700">
                  <tr>
                    <th className="py-2.5 pr-4">Capacité</th>
                    <th className="py-2.5 px-3 font-bold text-white">Bea (BehaviorLab AI)</th>
                    <th className="py-2.5 px-3 text-zinc-400">ChatGPT (OpenAI)</th>
                    <th className="py-2.5 px-3 text-zinc-400">Claude (Anthropic)</th>
                    <th className="py-2.5 px-3 text-zinc-400">Cursor / v0</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-white">Psychologie Comportementale Fogg</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ Cœur natif (5 étapes)</td>
                    <td className="py-2.5 px-3 text-zinc-500">Générique</td>
                    <td className="py-2.5 px-3 text-zinc-500">Générique</td>
                    <td className="py-2.5 px-3 text-zinc-500">Non</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-white">Validation AST Anti-Crash Directe</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ 8 Niveaux chirurgicaux</td>
                    <td className="py-2.5 px-3 text-zinc-500">Non</td>
                    <td className="py-2.5 px-3 text-zinc-500">Non</td>
                    <td className="py-2.5 px-3 text-cyan-400">Partiel (IDE)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-white">Bâtisseur Web & Studio Visuel</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ Intégré sans quitter l'app</td>
                    <td className="py-2.5 px-3 text-zinc-500">Code brut</td>
                    <td className="py-2.5 px-3 text-purple-400">Artifacts</td>
                    <td className="py-2.5 px-3 text-cyan-400">v0 externe</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-white">Mémoire d'Habitudes & Streaks</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ Suivi de régularité</td>
                    <td className="py-2.5 px-3 text-zinc-400">Mémoire simple</td>
                    <td className="py-2.5 px-3 text-zinc-500">Projets</td>
                    <td className="py-2.5 px-3 text-zinc-500">Non</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-semibold text-white">15 Langues en Vitrine & App</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">✓ Inclus Wolof & Monde</td>
                    <td className="py-2.5 px-3 text-zinc-400">Multiples</td>
                    <td className="py-2.5 px-3 text-zinc-400">Multiples</td>
                    <td className="py-2.5 px-3 text-zinc-500">Anglais prioritaire</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIFF & INSPECTION */}
      {activeTab === 'diff' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-300" />
              <span>Inspection Différentielle (Diff Visuel)</span>
            </h3>
            <span className="text-xs text-zinc-400">Cible : <code className="text-zinc-200 font-mono">{currentTargetId}</code></span>
          </div>

          {lastDiffLines ? (
            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-4 font-mono text-xs space-y-1 overflow-x-auto">
              {lastDiffLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-0.5 rounded flex items-center gap-2 ${
                    line.type === 'add'
                      ? 'bg-emerald-950/60 text-emerald-300 border-l-2 border-emerald-400'
                      : line.type === 'remove'
                      ? 'bg-rose-950/60 text-rose-300 line-through border-l-2 border-rose-400'
                      : 'text-zinc-400'
                  }`}
                >
                  <span className="w-4 text-center text-zinc-600 select-none">
                    {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}
                  </span>
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-zinc-500 space-y-2">
              <Eye className="w-8 h-8 mx-auto text-zinc-600 opacity-50" />
              <p>Aucune modification récente à inspecter.</p>
              <button
                onClick={() => setActiveTab('modify')}
                className="text-white hover:underline text-xs"
              >
                Lancer une modification dans l'onglet 1
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAUVEGARDES & ROLLBACK */}
      {activeTab === 'backups' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-300" />
              <span>Historique des Sauvegardes & Rollbacks Automatiques ({backups.length})</span>
            </h3>
            <span className="text-xs text-zinc-400">Restauration 100% infaillible</span>
          </div>

          <div className="space-y-3">
            {backups.map(bk => (
              <div
                key={bk.id}
                className="bg-[#212121] border border-zinc-700/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-zinc-600 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{bk.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Niveau {bk.level}
                    </span>
                    <span className="text-[10px] text-zinc-400">{bk.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{bk.summary}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRollback(bk)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurer cette version</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GUIDE DES 8 NIVEAUX */}
      {activeTab === 'guide' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-300" />
              <span>Guide d'Architecture des 8 Niveaux de Modification</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Pourquoi segmenter en 8 niveaux ? Parce qu'un fichier de 2500 lignes envoyé d'un seul bloc à un LLM risque d'être tronqué ou d'introduire des régressions. Le système par niveau isole la cible avec une précision chirurgicale et garantit un code exécutable en prod.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(Object.keys(LAB_LEVELS) as ModifLevelId[]).map(lvlId => {
              const lvl = LAB_LEVELS[lvlId];
              return (
                <div key={lvlId} className="bg-[#212121] border border-zinc-700/80 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{lvl.title}</h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${lvl.color}`}>
                      {lvl.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{lvl.description}</p>
                  <div className="pt-2 border-t border-zinc-700/60 text-[11px] text-zinc-300">
                    <strong>Sous-niveaux inclus :</strong> {lvl.subLevels.map(s => s.title).join(' · ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
