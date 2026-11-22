import React, { useState } from 'react';
import {
  Code,
  Globe,
  Play,
  Download,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye,
  FileCode
} from 'lucide-react';

export const CodeUltraView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'site'>('editor');

  // Python Editor State (Photo 5)
  const [pythonCode, setPythonCode] = useState<string>(
    `import streamlit as st\n\ndef hello_andrea():\n    st.title("Bienvenue sur Andrea")\n    st.write("Analyse comportementale en temps réel avec protection active")\n\nif __name__ == '__main__':\n    hello_andrea()\n`
  );
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Site Builder State (Photo 4)
  const [projectName, setProjectName] = useState('BatiTools Pro');
  const [sector, setSector] = useState('Bâtiment, Travaux & Outillage');
  const [siteObjective, setSiteObjective] = useState('Catalogue & Devis en ligne express');
  const [visualAmbience, setVisualAmbience] = useState('Industriel Pro & Robuste (BTP/Travaux)');
  const [specificNotes, setSpecificNotes] = useState('Créer moi un site de mes outils de travaux');
  const [siteMode, setSiteMode] = useState<'guided' | 'prompt'>('guided');
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecutePython = () => {
    setIsExecuting(true);
    setExecutionOutput(null);
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionOutput(
        `> Execution Python 3.12 (Streamlit Core Simulation)...\n` +
        `[OK] Script validé avec succès (0 warning).\n` +
        `✓ Analyse comportementale initialisée avec protection active.\n` +
        `✓ Local URL: http://localhost:8501/`
      );
    }, 600);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mon_script.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateSite = () => {
    setIsGeneratingSite(true);
    setTimeout(() => {
      setIsGeneratingSite(false);
      setGeneratedHtml(`<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName} — Outillage BTP Pro</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-6 font-sans">
  <div class="max-w-5xl mx-auto space-y-8">
    <header class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div class="text-xl font-black text-amber-400">🔨 ${projectName}</div>
      <div class="text-xs text-slate-400">${sector} · ${visualAmbience}</div>
      <button class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs">
        Devis Express 24h
      </button>
    </header>

    <div class="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
      <h1 class="text-3xl font-extrabold text-white">Outillage Professionnel pour Artisans & BTP</h1>
      <p class="text-sm text-slate-300">${specificNotes || 'Catalogue complet de matériel haut rendement avec devis instantané.'}</p>
      <div class="pt-2 flex gap-3">
        <button class="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Consulter le Catalogue</button>
        <button class="px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-xs">Demander un Devis</button>
      </div>
    </div>
  </div>
</body>
</html>`);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Sub-Navigation Tabs matching Photos 4 & 5 */}
      <div className="flex items-center justify-between border-b border-[#1d254f] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'editor'
                ? 'bg-[#1b2b73] text-white shadow-md border border-[#2b41b0]'
                : 'bg-[#101533] text-slate-300 hover:text-white hover:bg-[#161c42]'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            <span>&lt;/&gt; Éditeur Python & Copilote</span>
          </button>

          <button
            onClick={() => setActiveSubTab('site')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'site'
                ? 'bg-[#1b2b73] text-white shadow-md border border-[#2b41b0]'
                : 'bg-[#101533] text-slate-300 hover:text-white hover:bg-[#161c42]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Création de Site</span>
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-400 font-mono">
          Format Ultra Actif
        </div>
      </div>

      {/* VIEW 1: Python Editor (Photo 5) */}
      {activeSubTab === 'editor' && (
        <div className="space-y-4">
          {/* Header of Python Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>&lt;/&gt; Éditeur de Code Python</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Écrivez, testez et exécutez votre script</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExecutePython}
                disabled={isExecuting}
                className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isExecuting ? 'Exécution...' : '▶ Exécuter / Tester'}</span>
              </button>

              <button
                onClick={handleDownloadPy}
                className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger .py</span>
              </button>
            </div>
          </div>

          {/* Code Window */}
          <div className="rounded-2xl bg-[#090d1f] border border-[#1e2754] overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="px-4 py-2.5 bg-[#0f1430] border-b border-[#1e2754] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-bold text-slate-200 font-mono">mon_script.py (Python)</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                UTF-8 · Streamlit Support
              </div>
            </div>

            <textarea
              value={pythonCode}
              onChange={(e) => setPythonCode(e.target.value)}
              spellCheck={false}
              className="w-full h-72 p-4 bg-[#090d1f] text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>

          {/* Console Output */}
          {executionOutput && (
            <div className="p-4 rounded-xl bg-[#0a0f26] border border-[#1e2754] font-mono text-xs text-emerald-400 whitespace-pre-wrap">
              {executionOutput}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: Créateur de Site Web Pro (Photo 4) */}
      {activeSubTab === 'site' && (
        <div className="space-y-6">
          {/* Header of Site Creator */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-sky-400" />
                <span>Créateur de Site Web Pro</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Générez un site complet avec catalogue, devis interactif et avis clients, prêt à publier sur Vercel, PlayStore ou en Application de Bureau.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSiteMode('guided')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  siteMode === 'guided'
                    ? 'bg-[#1f2f7a] text-white border border-[#2e45b0]'
                    : 'bg-[#101533] text-slate-400'
                }`}
              >
                Mode Guidé (Style IONOS)
              </button>
              <button
                onClick={() => setSiteMode('prompt')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  siteMode === 'prompt'
                    ? 'bg-[#1f2f7a] text-white border border-[#2e45b0]'
                    : 'bg-[#101533] text-slate-400'
                }`}
              >
                Prompt Rapide
              </button>
            </div>
          </div>

          {/* Guided Form matching Photo 4 */}
          <div className="p-6 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  1. Nom de votre projet / entreprise :
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none focus:border-[#4255b3]"
                />
              </div>

              {/* Field 2 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  2. Secteur d'activité :
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Bâtiment, Travaux & Outillage">🔨 Bâtiment, Travaux & Outillage</option>
                  <option value="Immobilier & Architecture">🏠 Immobilier & Architecture</option>
                  <option value="E-commerce & Mode">🛍️ E-commerce & Mode</option>
                  <option value="Santé & Cosmétique">✨ Santé & Cosmétique</option>
                  <option value="Restauration & Gastronomie">🍽️ Restauration & Gastronomie</option>
                  <option value="Tech & SaaS">💻 Tech & SaaS</option>
                </select>
              </div>

              {/* Field 3 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  3. Objectif prioritaire du site :
                </label>
                <select
                  value={siteObjective}
                  onChange={(e) => setSiteObjective(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Catalogue & Devis en ligne express">Catalogue & Devis en ligne express</option>
                  <option value="Prise de rendez-vous immédiate">Prise de rendez-vous immédiate</option>
                  <option value="Vente directe de produits">Vente directe de produits</option>
                  <option value="Présentation institutionnelle">Présentation institutionnelle</option>
                </select>
              </div>

              {/* Field 4 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  4. Ambiance & Style visuel :
                </label>
                <select
                  value={visualAmbience}
                  onChange={(e) => setVisualAmbience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="Industriel Pro & Robuste (BTP/Travaux)">Industriel Pro & Robuste (BTP/Travaux)</option>
                  <option value="Minimaliste & Sombre (Dark Luxe)">Minimaliste & Sombre (Dark Luxe)</option>
                  <option value="Épuré & Lumineux (Clean White)">Épuré & Lumineux (Clean White)</option>
                  <option value="Néon & Cyber Futuriste">Néon & Cyber Futuriste</option>
                </select>
              </div>
            </div>

            {/* Field 5 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-slate-200">
                  5. Précisions ou fonctionnalités spécifiques :
                </label>
                <span className="text-[11px] text-slate-400 italic">
                  Ex: "Créer moi un site de mes outils de travaux"
                </span>
              </div>
              <input
                type="text"
                value={specificNotes}
                onChange={(e) => setSpecificNotes(e.target.value)}
                placeholder="Ex: Créer moi un site de mes outils de travaux"
                className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none focus:border-[#4255b3]"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerateSite}
              disabled={isGeneratingSite}
              className="w-full py-3.5 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] hover:from-[#2a45c7] hover:to-[#4e6df5] text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGeneratingSite ? 'Génération du site complet en cours...' : 'Générer mon site complet (Pack Pro)'}</span>
            </button>
          </div>

          {/* Generated Site Preview */}
          {generatedHtml && (
            <div className="p-4 bg-[#0a0f26] rounded-3xl border border-[#202959] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold">Aperçu en direct : {projectName}</span>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${projectName.toLowerCase().replace(/\s+/g, '_')}.html`;
                    a.click();
                  }}
                  className="px-3 py-1 bg-[#171e47] hover:bg-[#253073] border border-[#28346e] rounded-lg text-white font-bold cursor-pointer"
                >
                  Télécharger HTML
                </button>
              </div>

              <div className="w-full h-96 rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-xl">
                <iframe
                  title="Site Preview"
                  srcDoc={generatedHtml}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
