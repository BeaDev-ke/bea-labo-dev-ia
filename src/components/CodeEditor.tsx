import React, { useState } from 'react';
import {
  Code,
  Play,
  Download,
  Copy,
  Sparkles,
  Check,
  RotateCcw,
  Save,
  Terminal,
  Bug,
  FileCode,
  Zap
} from 'lucide-react';

export const CodeEditor: React.FC = () => {
  const [language, setLanguage] = useState<'python' | 'javascript' | 'html' | 'sql' | 'bash'>('python');
  const [code, setCode] = useState<string>(
    `# Bienvenue dans l'éditeur de code Andrea (BehaviorLab AI)
import time

def process_stream_data(events):
    """Analyse les flux utilisateurs et calcule la rétention."""
    retention_scores = []
    for event in events:
        score = event.get('retention_rate', 0.85) * 100
        retention_scores.append(round(score, 2))
    return retention_scores

if __name__ == '__main__':
    data = [{'user': 'demo', 'retention_rate': 0.94}]
    print("Scores calculés :", process_stream_data(data))
`
  );
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      python: 'py',
      javascript: 'js',
      html: 'html',
      sql: 'sql',
      bash: 'sh',
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `andrea_script.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAskAI = (actionType: 'explain' | 'optimize' | 'fix' | 'custom') => {
    setIsProcessing(true);
    setTimeout(() => {
      if (actionType === 'explain') {
        setAiResponse(
          `**Explication du code (${language})** :\n\n` +
          `• **Structure** : Le script définit une fonction de traitement itératif sur des dictionnaires.\n` +
          `• **Complexité** : O(N) linéaire en temps, O(N) en espace mémoire.\n` +
          `• **Recommandation** : Code propre et idiomatique. Idéal pour être couplé avec un pipeline de données en streaming.`
        );
      } else if (actionType === 'optimize') {
        setAiResponse(
          `**Optimisation proposée** :\n\n` +
          `Utilisation d'une compréhension de liste directe pour réduire le temps d'exécution de ~25% :\n\n` +
          `\`\`\`${language}\n` +
          `def process_stream_data(events):\n` +
          `    return [round(e.get('retention_rate', 0.85) * 100, 2) for e in events]\n` +
          `\`\`\``
        );
      } else if (actionType === 'fix') {
        setAiResponse(
          `**Audit & Correction d'erreurs** :\n\n` +
          `✓ Aucune erreur de syntaxe détectée.\n` +
          `✓ Gestion sécurisée de la clé avec \`.get()\` avec valeur par défaut.\n` +
          `💡 Conseil sécurité : valider que \`events\` est bien une liste non nulle.`
        );
      } else {
        setAiResponse(
          `**Réponse Andrea** à "${prompt}" :\n\n` +
          `Voici l'implémentation adaptée aux contraintes de production et de robustesse : le code a été structuré avec typage explicite et gestion défensive des exceptions.`
        );
      }
      setIsProcessing(false);
    }, 700);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF44] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B70FF] uppercase tracking-wider mb-1">
            <Code className="w-4 h-4" />
            <span>Studio de Code Intelligent</span>
          </div>
          <h2 className="text-2xl font-black text-white">Éditeur & Audit IA</h2>
          <p className="text-xs text-slate-300 mt-1">
            Écrivez, testez, auditez et optimisez vos scripts avec Andrea en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#201844] border border-[#5A33FF44] text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            <option value="python">Python 3.12</option>
            <option value="javascript">JavaScript / TypeScript</option>
            <option value="html">HTML5 / Tailwind</option>
            <option value="sql">PostgreSQL / SQL</option>
            <option value="bash">Bash / Shell</option>
          </select>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[#201844] hover:bg-[#2b1f5c] border border-[#5A33FF44] text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Copier le code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-[#201844] hover:bg-[#2b1f5c] border border-[#5A33FF44] text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Télécharger le fichier"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2521a8] hover:to-[#6a44ff] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Enregistré !' : 'Sauvegarder'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Code on left, AI assistant on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code editor pane */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#0F0E1E] border border-[#5A33FF44] overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-[#14132b] border-b border-[#5A33FF33] flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-bold text-slate-300">script.{language === 'python' ? 'py' : language === 'javascript' ? 'ts' : language}</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {code.split('\n').length} lignes · {code.length} caractères
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full min-h-[460px] p-4 bg-[#0F0E1E] text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-[#5A33FF] selection:text-white"
            placeholder="Écrivez ou collez votre code ici..."
          />
        </div>

        {/* AI Assistant pane */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-5 rounded-2xl bg-[#1A1930] border border-[#5A33FF44] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-[#8B70FF]" />
              <span>Actions rapides IA</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAskAI('explain')}
                disabled={isProcessing}
                className="p-2.5 rounded-xl bg-[#201844] hover:bg-[#2c2060] border border-[#5A33FF44] text-[11px] font-bold text-slate-200 hover:text-white transition-all text-center cursor-pointer flex flex-col items-center gap-1.5"
              >
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Expliquer</span>
              </button>

              <button
                onClick={() => handleAskAI('optimize')}
                disabled={isProcessing}
                className="p-2.5 rounded-xl bg-[#201844] hover:bg-[#2c2060] border border-[#5A33FF44] text-[11px] font-bold text-slate-200 hover:text-white transition-all text-center cursor-pointer flex flex-col items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Optimiser</span>
              </button>

              <button
                onClick={() => handleAskAI('fix')}
                disabled={isProcessing}
                className="p-2.5 rounded-xl bg-[#201844] hover:bg-[#2c2060] border border-[#5A33FF44] text-[11px] font-bold text-slate-200 hover:text-white transition-all text-center cursor-pointer flex flex-col items-center gap-1.5"
              >
                <Bug className="w-4 h-4 text-emerald-400" />
                <span>Corriger</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#5A33FF22]">
              <label className="text-xs font-semibold text-slate-300">
                Instruction personnalisée pour ce script :
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && prompt.trim()) {
                      handleAskAI('custom');
                    }
                  }}
                  placeholder="Ex: Ajoute un décorateur de mesure de temps..."
                  className="w-full px-3 py-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#8B70FF]"
                />
                <button
                  onClick={() => handleAskAI('custom')}
                  disabled={isProcessing || !prompt.trim()}
                  className="absolute right-1.5 top-1.5 px-2.5 py-1.5 rounded-lg bg-[#5A33FF] hover:bg-[#704dff] text-white text-xs font-bold disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>

          {/* AI Response Box */}
          <div className="flex-1 p-5 rounded-2xl bg-[#14132b] border border-[#5A33FF44] flex flex-col min-h-[220px]">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span>Analyse Andrea</span>
              {isProcessing && (
                <span className="text-[10px] text-sky-400 animate-pulse font-mono">
                  Génération en cours...
                </span>
              )}
            </div>

            <div className="flex-1 text-xs text-slate-300 leading-relaxed font-sans overflow-y-auto whitespace-pre-wrap">
              {aiResponse ? (
                aiResponse
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 italic text-center p-4">
                  Cliquez sur Expliquer, Optimiser ou posez une question pour démarrer l'assistance code.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
