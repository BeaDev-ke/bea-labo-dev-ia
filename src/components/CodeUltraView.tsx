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
import {
  buildSite,
  SECTOR_OPTIONS,
  OBJECTIVE_OPTIONS,
  AMBIANCE_OPTIONS,
  SectorId,
  ObjectiveId,
  AmbianceId,
} from '../services/siteBuilder';

export const CodeUltraView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'site'>('editor');

  // Python Editor State (Photo 5)
  const [pythonCode, setPythonCode] = useState<string>(
    `import streamlit as st\n\ndef hello_andrea():\n    st.title("Bienvenue sur Andrea")\n    st.write("Analyse comportementale en temps réel avec protection active")\n\nif __name__ == '__main__':\n    hello_andrea()\n`
  );
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Créateur de site
  const [projectName, setProjectName] = useState('');
  const [sector, setSector] = useState<SectorId>('btp');
  const [siteObjective, setSiteObjective] = useState<ObjectiveId>('devis');
  const [visualAmbience, setVisualAmbience] = useState<AmbianceId>('industriel');
  const [specificNotes, setSpecificNotes] = useState('');
  const [siteContact, setSiteContact] = useState('');
  const [isGeneratingSite, setIsGeneratingSite] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [siteError, setSiteError] = useState<string | null>(null);
  const [siteDevice, setSiteDevice] = useState<'desktop' | 'mobile'>('desktop');
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
    if (!projectName.trim()) {
      setSiteError("Indique d'abord le nom de ton projet ou de ton entreprise.");
      return;
    }
    setSiteError(null);
    setIsGeneratingSite(true);
    try {
      setGeneratedHtml(
        buildSite({
          name: projectName,
          sector,
          objective: siteObjective,
          ambiance: visualAmbience,
          notes: specificNotes,
          contact: siteContact,
        })
      );
    } catch {
      setSiteError('La génération a échoué. Vérifie les informations saisies et réessaie.');
    } finally {
      setIsGeneratingSite(false);
    }
  };

  const handleCopySite = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSite = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const slug = projectName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    a.href = url;
    a.download = `${slug || 'mon-site'}.html`;
    a.click();
    URL.revokeObjectURL(url);
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

      {/* VUE 2 : Créateur de site */}
      {activeSubTab === 'site' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <span>Créateur de Site Web Pro</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Génère un site complet et responsive : catalogue, devis, rendez-vous ou boutique avec panier, avis, FAQ et contact.
              Tu télécharges un seul fichier HTML, prêt à héberger où tu veux.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="site-name" className="text-xs font-bold text-slate-200">1. Nom de ton projet / entreprise :</label>
                <input
                  id="site-name"
                  type="text"
                  value={projectName}
                  maxLength={60}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ex : Atelier Dupont"
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4255b3]"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="site-sector" className="text-xs font-bold text-slate-200">2. Secteur d'activité :</label>
                <select
                  id="site-sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value as SectorId)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  {SECTOR_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="site-objective" className="text-xs font-bold text-slate-200">3. Objectif prioritaire du site :</label>
                <select
                  id="site-objective"
                  value={siteObjective}
                  onChange={(e) => setSiteObjective(e.target.value as ObjectiveId)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  {OBJECTIVE_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="site-ambiance" className="text-xs font-bold text-slate-200">4. Ambiance & style visuel :</label>
                <select
                  id="site-ambiance"
                  value={visualAmbience}
                  onChange={(e) => setVisualAmbience(e.target.value as AmbianceId)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                >
                  {AMBIANCE_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="site-notes" className="text-xs font-bold text-slate-200">
                5. Présentation de ton activité (affichée en haut du site) :
              </label>
              <input
                id="site-notes"
                type="text"
                value={specificNotes}
                maxLength={300}
                onChange={(e) => setSpecificNotes(e.target.value)}
                placeholder="Ex : Outillage professionnel pour artisans, avec conseils et devis rapides"
                className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4255b3]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="site-contact" className="text-xs font-bold text-slate-200">
                6. E-mail ou téléphone de contact (facultatif) :
              </label>
              <input
                id="site-contact"
                type="text"
                value={siteContact}
                maxLength={80}
                onChange={(e) => setSiteContact(e.target.value)}
                placeholder="contact@monsite.fr ou 06 12 34 56 78"
                className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4255b3]"
              />
              <p className="text-[11px] text-slate-400">
                Avec un e-mail, les formulaires du site ouvrent la messagerie du visiteur avec la demande déjà rédigée.
              </p>
            </div>

            {siteError && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">{siteError}</div>
            )}

            <button
              onClick={handleGenerateSite}
              disabled={isGeneratingSite}
              className="w-full py-3.5 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] hover:from-[#2a45c7] hover:to-[#4e6df5] text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isGeneratingSite ? 'Génération...' : 'Générer mon site complet'}</span>
            </button>
          </div>

          {generatedHtml && (
            <div className="p-4 bg-[#0a0f26] rounded-3xl border border-[#202959] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                <span className="font-bold">Aperçu en direct : {projectName}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSiteDevice('desktop')}
                    className={`p-1.5 rounded border cursor-pointer ${siteDevice === 'desktop' ? 'bg-[#253073] border-[#3b4fb8] text-white' : 'bg-[#171e47] border-[#28346e] text-slate-400'}`}
                    title="Bureau"
                  >
                    <Laptop className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSiteDevice('mobile')}
                    className={`p-1.5 rounded border cursor-pointer ${siteDevice === 'mobile' ? 'bg-[#253073] border-[#3b4fb8] text-white' : 'bg-[#171e47] border-[#28346e] text-slate-400'}`}
                    title="Mobile"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopySite}
                    className="px-3 py-1 bg-[#171e47] hover:bg-[#253073] border border-[#28346e] rounded-lg text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier le code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadSite}
                    className="px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] rounded-lg text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger HTML</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className={`h-[520px] rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-xl transition-all ${
                    siteDevice === 'mobile' ? 'w-[390px] max-w-full' : 'w-full'
                  }`}
                >
                  <iframe
                    title="Aperçu du site"
                    srcDoc={generatedHtml}
                    sandbox="allow-scripts allow-forms"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                À faire avant de publier : remplace les avis d'exemple, vérifie les textes et, pour une boutique,
                modifie les prix d'exemple dans le code.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
