import React, { useState } from 'react';
import { Globe, Code, Eye, Laptop, Smartphone, Tablet, Download, Sparkles, Check, Copy } from 'lucide-react';
import { GeneratedWebsite } from '../types';
import { buildSite, inferBrief, SiteBrief } from '../services/siteBuilder';

export const WebsiteGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const makeSite = (brief: SiteBrief, title: string, category: string): GeneratedWebsite => ({
    id: `site_${Date.now()}`,
    title,
    description: brief.notes,
    category,
    accentColor: '#38bdf8',
    createdAt: new Date().toISOString().split('T')[0],
    htmlCode: buildSite(brief),
  });

  const [currentSite, setCurrentSite] = useState<GeneratedWebsite>(() =>
    makeSite(
      {
        name: 'Aura Skin Lab',
        sector: 'sante',
        objective: 'vente',
        ambiance: 'dark',
        notes: 'Soins et sérums pour une peau qui respire, composés avec des actifs choisis.',
        contact: '',
      },
      'Aura Skin Lab',
      'ecommerce'
    )
  );

  const templates: Array<{ title: string; desc: string; category: string; brief: SiteBrief }> = [
    {
      title: 'SaaS IA & Cloud',
      desc: "Plateforme d'automatisation pour équipes tech",
      category: 'saas',
      brief: { name: 'Nuage Pro', sector: 'tech', objective: 'vitrine', ambiance: 'neon', notes: "Une plateforme d'automatisation simple, pensée pour les équipes qui veulent gagner du temps.", contact: '' },
    },
    {
      title: 'Agence Créative',
      desc: 'Studio de direction artistique et vidéo',
      category: 'agency',
      brief: { name: 'Studio Lumière', sector: 'tech', objective: 'rdv', ambiance: 'dark', notes: 'Un studio créatif qui conçoit vos identités visuelles et vos vidéos.', contact: '' },
    },
    {
      title: 'Boutique Mode',
      desc: 'E-commerce épuré avec panier',
      category: 'ecommerce',
      brief: { name: 'Maison Atelier', sector: 'mode', objective: 'vente', ambiance: 'clean', notes: 'Des pièces choisies avec soin, pour un style simple et durable.', contact: '' },
    },
    {
      title: 'Cabinet d’architecture',
      desc: 'Présentation de projets et contact',
      category: 'portfolio',
      brief: { name: 'Atelier Vertical', sector: 'immo', objective: 'vitrine', ambiance: 'clean', notes: "Un cabinet d'architecture qui conçoit des espaces lumineux et durables.", contact: '' },
    },
  ];

  const handleGenerate = (preset?: (typeof templates)[number]) => {
    if (isGenerating) return;
    const query = prompt.trim();
    if (!preset && !query) return;

    setIsGenerating(true);
    try {
      if (preset) {
        setCurrentSite(makeSite(preset.brief, preset.brief.name, preset.category));
      } else {
        const brief = inferBrief(query);
        const named: SiteBrief = { ...brief, name: brief.name || query.slice(0, 40) };
        setCurrentSite(makeSite(named, named.name, named.sector));
      }
      setViewMode('preview');
    } finally {
      setIsGenerating(false);
    }
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
          Décris ton activité en une phrase ou pars d'un modèle : tu obtiens un site complet, responsive, en un seul fichier HTML.
        </p>

        {/* Templates shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => {
                setPrompt('');
                handleGenerate(tpl);
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
            placeholder="Décris ton site (ex : « Site avec prise de rendez-vous pour mon salon de massage, style épuré »)"
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Génération...' : 'Générer le site'}</span>
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
                sandbox="allow-scripts allow-forms"
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
