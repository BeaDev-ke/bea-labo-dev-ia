import React, { useState } from 'react';
import { Globe, Code, Eye, Laptop, Smartphone, Tablet, Download, Sparkles, Check, Copy } from 'lucide-react';
import { GeneratedWebsite } from '../types';

export const WebsiteGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initial generated website
  const [currentSite, setCurrentSite] = useState<GeneratedWebsite>({
    id: 'site_bea_1',
    title: 'Aura Skin — Laboratoire Cosmétique Haute Précision',
    description: 'Landing page moderne pour marque de soins dermatologiques augmentés par IA.',
    category: 'ecommerce',
    accentColor: '#38bdf8',
    createdAt: '2026-11-07',
    htmlCode: `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #030712; color: #f8fafc; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
  <!-- Header -->
  <header class="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50 bg-slate-950/70">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-extrabold text-black">A</div>
      <span class="font-bold text-lg tracking-tight text-white">Aura Skin Lab</span>
    </div>
    <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300">
      <a href="#formulation" class="hover:text-sky-400 transition-colors">Formulation</a>
      <a href="#resultats" class="hover:text-sky-400 transition-colors">Résultats</a>
      <a href="#technologie" class="hover:text-sky-400 transition-colors">Technologie</a>
    </nav>
    <button class="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-lg text-xs transition-colors shadow-lg shadow-sky-500/20">
      Commander le Sérum
    </button>
  </header>

  <!-- Hero Section -->
  <main class="flex-1 max-w-5xl mx-auto px-6 py-16 text-center flex flex-col items-center justify-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 mb-6 font-medium">
      <span>Biotechnologie & IA Moléculaire</span>
      <span>·</span>
      <span>Édition Limitée 2026</span>
    </div>
    <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
      La régénération cutanée guidée par l'algorithme cellulaire.
    </h1>
    <p class="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
      Chaque flacon est formulé sur-mesure d'après votre profil d'exposition urbaine et de régénération nocturne.
    </p>
    <div class="mt-8 flex flex-wrap gap-4 justify-center">
      <button class="px-6 py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors shadow-xl">
        Découvrir mon Diagnostic
      </button>
      <button class="px-6 py-3 bg-slate-900 border border-slate-700 text-white font-medium rounded-xl text-sm hover:bg-slate-800 transition-colors">
        Voir la Démonstration Vidéo
      </button>
    </div>

    <!-- Feature Grid -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
      <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div class="text-sky-400 font-mono text-sm mb-2">01 / ANALYSE</div>
        <h3 class="text-lg font-bold text-white mb-2">Scan Spectrométrique</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Mesure micrométrique de la barrière épidermique en temps réel.</p>
      </div>
      <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div class="text-sky-400 font-mono text-sm mb-2">02 / SYNTHÈSE</div>
        <h3 class="text-lg font-bold text-white mb-2">Peptides Bio-Actifs</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Concentration active à 98.4% sans conservateurs synthétiques.</p>
      </div>
      <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div class="text-sky-400 font-mono text-sm mb-2">03 / RÉSULTAT</div>
        <h3 class="text-lg font-bold text-white mb-2">+142% d'Hydratation</h3>
        <p class="text-xs text-slate-400 leading-relaxed">Validé cliniquement sous contrôle dermatologique indépendant.</p>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800/80 px-6 py-6 text-center text-xs text-slate-500">
    © 2026 Aura Skin Lab. Tous droits réservés. Propulsé par Bea Labo Dev IA.
  </footer>
</body>
</html>`,
  });

  const templates = [
    { title: 'SaaS IA & Cloud', category: 'saas' as const, desc: 'Plateforme moderne d\'automatisation cloud pour équipes tech' },
    { title: 'Agence Créative & 3D', category: 'agency' as const, desc: 'Studio de direction artistique et vidéo cinématique' },
    { title: 'Boutique Luxe & Mode', category: 'ecommerce' as const, desc: 'E-commerce épuré avec typographie soignée et call-to-action' },
    { title: 'Portfolio Architecture', category: 'portfolio' as const, desc: 'Galerie minimale pour architectes et designers d\'intérieur' },
  ];

  const handleGenerate = (templatePrompt?: string) => {
    const query = templatePrompt || prompt;
    if (!query.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const isAgency = query.toLowerCase().includes('agence') || query.toLowerCase().includes('créat');
      const isSaaS = query.toLowerCase().includes('saas') || query.toLowerCase().includes('cloud');

      setCurrentSite({
        id: `site_${Date.now()}`,
        title: query.slice(0, 40),
        description: `Site complet généré pour : "${query}"`,
        category: isAgency ? 'agency' : isSaaS ? 'saas' : 'ecommerce',
        accentColor: '#38bdf8',
        createdAt: new Date().toISOString().split('T')[0],
        htmlCode: `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b0f19; color: #f8fafc; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
  <header class="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <span class="font-bold text-lg text-white">${query.slice(0, 24)}</span>
    <button class="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-xs">Accéder</button>
  </header>
  <main class="max-w-4xl mx-auto px-6 py-20 text-center">
    <div class="inline-block px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-xs font-semibold mb-4">
      Conçu avec le Générateur Web Bea Labo
    </div>
    <h1 class="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">${query}</h1>
    <p class="text-slate-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
      Expérience optimisée pour un taux de conversion maximal, un temps de chargement instantané et une compatibilité mobile totale.
    </p>
    <div class="flex gap-3 justify-center">
      <button class="px-6 py-3 bg-sky-500 text-white font-semibold rounded-xl text-sm">Démarrer maintenant</button>
      <button class="px-6 py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm border border-slate-700">En savoir plus</button>
    </div>
  </main>
  <footer class="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
    Généré par Bea Labo Dev IA.
  </footer>
</body>
</html>`,
      });
      setIsGenerating(false);
    }, 800);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentSite.htmlCode || currentSite.html || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([currentSite.htmlCode || currentSite.html || ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-${currentSite.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Prompt Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl font-bold text-white">Système de Génération de Site Web</h2>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Générez instantanément des interfaces web et landing pages réactives, intégrant Tailwind CSS et optimisées pour la conversion.
        </p>

        {/* Templates shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => {
                setPrompt(tpl.title);
                handleGenerate(tpl.title);
              }}
              className="p-3 text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
            >
              <span className="font-semibold text-white text-xs block group-hover:text-sky-400 transition-colors">
                {tpl.title}
              </span>
              <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{tpl.desc}</span>
            </button>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre site web (ex: 'Landing page pour café torréfacteur artisanal à Paris')..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Génération...' : 'Générer le Site'}</span>
          </button>
        </form>
      </div>

      {/* Preview / Code Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Workspace Toolbar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
          {/* Mode switch */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'preview' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu Direct</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'code' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code Source</span>
            </button>
          </div>

          {/* Device viewport switch (in preview mode) */}
          {viewMode === 'preview' && (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  deviceView === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Bureau (100%)"
              >
                <Laptop className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  deviceView === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablette (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  deviceView === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile (390px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions: Copy & Download */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              onClick={downloadHtml}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter HTML</span>
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="p-4 bg-slate-950 flex justify-center items-center min-h-[550px] overflow-x-auto">
          {viewMode === 'preview' ? (
            <div
              className={`transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 ${
                deviceView === 'desktop'
                  ? 'w-full h-[600px]'
                  : deviceView === 'tablet'
                  ? 'w-[768px] h-[600px]'
                  : 'w-[390px] h-[640px]'
              }`}
            >
              <iframe
                title="Aperçu Site Généré"
                srcDoc={currentSite.htmlCode}
                className="w-full h-full border-none bg-black"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          ) : (
            <div className="w-full h-[600px] overflow-auto rounded-xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs text-sky-200">
              <pre className="whitespace-pre-wrap">{currentSite.htmlCode}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
