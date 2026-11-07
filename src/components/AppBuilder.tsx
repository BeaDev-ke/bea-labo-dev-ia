import React, { useState } from 'react';
import {
  Globe,
  Play,
  Download,
  Copy,
  Sparkles,
  Check,
  Eye,
  Code as CodeIcon,
  RefreshCw,
  FolderArchive,
  ExternalLink,
  Smartphone,
  Monitor
} from 'lucide-react';

export const AppBuilder: React.FC = () => {
  const [appName, setAppName] = useState('Tableau de Bord Analytics');
  const [appDescription, setAppDescription] = useState('Une application web SaaS mono-page avec métriques en temps réel, graphiques et mode sombre');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedHtml, setGeneratedHtml] = useState<string>(`<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6">
  <div class="max-w-6xl mx-auto space-y-6">
    <header class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-white">⚡ BehaviorLab Dashboard</h1>
        <p class="text-xs text-slate-400">Monitoring en temps réel des flux de rétention</p>
      </div>
      <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
        Exporter Rapport
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div class="text-xs text-slate-400 font-medium">Taux d'Attention</div>
        <div class="text-3xl font-extrabold text-white mt-1">94.8%</div>
        <div class="text-xs text-emerald-400 mt-2 font-mono">↑ +14.2% ce mois</div>
      </div>
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div class="text-xs text-slate-400 font-medium">Vidéos Générées (Wan 2.1)</div>
        <div class="text-3xl font-extrabold text-white mt-1">1,248</div>
        <div class="text-xs text-indigo-400 mt-2 font-mono">100% 9:16 vertical</div>
      </div>
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div class="text-xs text-slate-400 font-medium">Latence Moyenne</div>
        <div class="text-3xl font-extrabold text-white mt-1">1.8s</div>
        <div class="text-xs text-emerald-400 mt-2 font-mono">Infra gratuite HF</div>
      </div>
      <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div class="text-xs text-slate-400 font-medium">Score d'Accroche</div>
        <div class="text-3xl font-extrabold text-white mt-1">98/100</div>
        <div class="text-xs text-amber-400 mt-2 font-mono">Whisper synchronisé</div>
      </div>
    </div>

    <div class="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
      <div class="text-sm font-bold text-white">Performances des Campagnes Vidéo</div>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-1">
            <span>Orbite 360° · Révélation Produit</span>
            <span class="text-indigo-400 font-bold">96%</span>
          </div>
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 rounded-full" style="width: 96%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-300 mb-1">
            <span>Crash Zoom · Hook Virale</span>
            <span class="text-sky-400 font-bold">89%</span>
          </div>
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-sky-500 rounded-full" style="width: 89%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);

  const handleGenerateApp = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedHtml(`<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6">
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="p-8 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 rounded-3xl border border-indigo-500/30">
      <span class="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono">App Autonome Andrea</span>
      <h1 class="text-3xl font-black text-white mt-3">${appName}</h1>
      <p class="text-sm text-slate-300 mt-2">${appDescription}</p>
      <div class="mt-6 flex gap-3">
        <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold">Démarrer</button>
        <button class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold">En savoir plus</button>
      </div>
    </div>
  </div>
</body>
</html>`);
      setIsGenerating(false);
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF44] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B70FF] uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Atelier de Création Web (Andrea Ultra)</span>
          </div>
          <h2 className="text-2xl font-black text-white">Générateur d'App Web Autonome</h2>
          <p className="text-xs text-slate-300 mt-1">
            Concevez et déployez des applications web complètes en un seul fichier HTML/JS autonome avec Tailwind.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-[#5A33FF] text-white shadow-md'
                : 'bg-[#201844] text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu en direct</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-[#5A33FF] text-white shadow-md'
                : 'bg-[#201844] text-slate-300 hover:text-white'
            }`}
          >
            <CodeIcon className="w-3.5 h-3.5" />
            <span>Code Source</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2521a8] hover:to-[#6a44ff] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger HTML</span>
          </button>
        </div>
      </div>

      {/* Control Strip */}
      <div className="p-5 rounded-2xl bg-[#14132b] border border-[#5A33FF33] grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-4 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Nom de l'application</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full px-3 py-2 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white focus:outline-none focus:border-[#8B70FF]"
          />
        </div>

        <div className="md:col-span-6 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Description des fonctionnalités & design</label>
          <input
            type="text"
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white focus:outline-none focus:border-[#8B70FF]"
          />
        </div>

        <div className="md:col-span-2">
          <button
            onClick={handleGenerateApp}
            disabled={isGenerating}
            className="w-full py-2.5 bg-[#5A33FF] hover:bg-[#704dff] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#5A33FF33] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Génération...' : 'Re-générer'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'preview' ? (
        <div className="rounded-2xl bg-[#0c0b17] border border-[#5A33FF44] p-4 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-[#5A33FF22] text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-300">Iframe Sandbox Autonome</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceView === 'desktop' ? 'bg-[#5A33FF] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vue Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  deviceView === 'mobile' ? 'bg-[#5A33FF] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Vue Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-white ${
              deviceView === 'mobile' ? 'max-w-sm h-[640px]' : 'h-[640px]'
            }`}
          >
            <iframe
              title="Autonomous Preview"
              srcDoc={generatedHtml}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0F0E1E] border border-[#5A33FF44] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#14132b] border-b border-[#5A33FF33] flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">index.html</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-[#201844] hover:bg-[#2b1f5c] border border-[#5A33FF44] text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
          <textarea
            value={generatedHtml}
            onChange={(e) => setGeneratedHtml(e.target.value)}
            spellCheck={false}
            className="w-full h-[580px] p-4 bg-[#0F0E1E] text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
          />
        </div>
      )}
    </div>
  );
};
