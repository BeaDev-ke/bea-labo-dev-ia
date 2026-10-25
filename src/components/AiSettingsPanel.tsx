import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Brain, 
  Zap, 
  Sparkles, 
  Shield, 
  RotateCcw, 
  Check, 
  Download, 
  Volume2, 
  Globe, 
  Terminal, 
  Lock, 
  FileText,
  SlidersHorizontal,
  Info,
  Cpu
} from 'lucide-react';

export interface AiSettings {
  // 1. Modèle & Inférence
  model: 'llama-instant' | 'llama-70b' | 'mixtral-8x7b' | 'gemma-2';
  contextWindow: number; // 8192, 32768, 131072
  
  // 2. Hyperparamètres LLM
  temperature: number; // 0.0 - 1.5
  topP: number; // 0.1 - 1.0
  presencePenalty: number; // 0.0 - 2.0
  frequencyPenalty: number; // 0.0 - 2.0
  maxTokens: number; // 512 - 8192
  streamResponse: boolean;
  showReasoningCoT: boolean; // Chain of Thought
  
  // 3. Instructions Système & Personnalité
  systemPersona: 'behaviorlab' | 'direct' | 'expert' | 'socratique' | 'creative';
  customInstructions: string;
  responseLength: 'concise' | 'balanced' | 'exhaustive';
  codeStyle: 'typescript' | 'python' | 'fullstack';
  addressStyle: 'tu' | 'vous';
  
  // 4. Outils & Capacités
  autoTts: boolean;
  voiceDictation: boolean;
  behaviorAnalysis: boolean;
  codeInterpreter: boolean;
  webSearchGrounding: boolean;
  longTermMemory: boolean;
  
  // 5. Confidentialité
  saveHistory: boolean;
  trainingOptOut: boolean;
  secureLocalEncryption: boolean;
}

const DEFAULT_SETTINGS: AiSettings = {
  model: 'llama-instant',
  contextWindow: 131072,
  temperature: 0.7,
  topP: 0.9,
  presencePenalty: 0.0,
  frequencyPenalty: 0.2,
  maxTokens: 4096,
  streamResponse: true,
  showReasoningCoT: false,
  systemPersona: 'behaviorlab',
  customInstructions: "Adopte la méthode BehaviorLab AI : commence par identifier le levier comportemental précis avant de proposer un plan d'action en 3 micro-étapes concrètes sans jargon.",
  responseLength: 'balanced',
  codeStyle: 'typescript',
  addressStyle: 'tu',
  autoTts: false,
  voiceDictation: true,
  behaviorAnalysis: true,
  codeInterpreter: true,
  webSearchGrounding: true,
  longTermMemory: true,
  saveHistory: true,
  trainingOptOut: true,
  secureLocalEncryption: true,
};

interface AiSettingsPanelProps {
  onNotify?: (msg: string) => void;
}

export const AiSettingsPanel: React.FC<AiSettingsPanelProps> = ({ onNotify }) => {
  const [settings, setSettings] = useState<AiSettings>(() => {
    try {
      const saved = localStorage.getItem('andrea_ai_settings') || localStorage.getItem('bea_ai_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<'inference' | 'persona' | 'tools' | 'privacy'>('inference');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('andrea_ai_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    if (onNotify) onNotify("Paramètres de l'IA enregistrés avec succès.");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    if (onNotify) onNotify("Paramètres réinitialisés aux valeurs recommandées.");
  };

  const exportConfigJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `andrea_ai_parameters_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Top Header Card */}
      <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#5A33FF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Paramètres du Moteur IA</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E1B8C] text-[#A89CFF] border border-[#5A33FF]">
                    Standards Pro & Playground
                  </span>
                </h2>
                <p className="text-xs text-[#A89CFF]">
                  Configurez la température, le modèle, la fenêtre de contexte et les instructions système d'Andrea.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-transparent hover:bg-[#1E1B8C]/40 border border-[#5A33FF33] text-xs font-semibold text-[#A89CFF] hover:text-white transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Défaut</span>
            </button>
            <button
              onClick={exportConfigJson}
              className="px-3 py-2 rounded-xl bg-[#151428] hover:bg-[#252245] border border-[#5A33FF44] text-xs font-semibold text-[#A89CFF] hover:text-white transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter JSON</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:brightness-110 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-[#5A33FF]/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{savedToast ? 'Enregistré !' : 'Appliquer'}</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 mt-6 border-b border-[#5A33FF33] pb-3 overflow-x-auto">
          {[
            { id: 'inference', label: '⚡ Inférence & Hyperparamètres', icon: Zap },
            { id: 'persona', label: '🧠 Personnalité & Instructions', icon: Brain },
            { id: 'tools', label: '🛠️ Capacités & Outils Web', icon: Globe },
            { id: 'privacy', label: '🛡️ Données & Confidentialité', icon: Lock },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  active
                    ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow border border-[#5A33FF]'
                    : 'text-[#A89CFF] hover:text-white hover:bg-[#151428]'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. INFÉRENCE & HYPERPARAMÈTRES */}
      {activeTab === 'inference' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Modèle de Langage */}
          <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#8B70FF]" />
                Modèle de Langage (LLM Engine)
              </h3>
              <span className="text-[10px] text-[#A89CFF]">Moteur Groq / Llama</span>
            </div>

            <div className="space-y-2">
              {[
                { id: 'llama-instant', name: '⚡ Llama instant', desc: 'Ultra-rapide (~650 tokens/s), Llama 3.1 8B, fenêtre 128k', badge: 'Recommandé' },
                { id: 'llama-70b', name: '🧠 Puissant (70B)', desc: 'Raisonnement logique poussé, analyse complexe et synthèse', badge: 'Stratégie' },
                { id: 'mixtral-8x7b', name: '⚡ Mixtral 8x7B MoE', desc: 'Architecture Mixture of Experts, polyvalence multilingue', badge: 'MoE' },
                { id: 'gemma-2', name: '🚀 Gemma 2 (27B)', desc: 'Précision conceptuelle Google, clarté pédagogique', badge: 'Google' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setSettings({ ...settings, model: item.id as any })}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                    settings.model === item.id
                      ? 'bg-gradient-to-r from-[#1E1B8C]/80 to-[#5A33FF]/40 border-[#5A33FF] text-white shadow-md'
                      : 'bg-[#151428] border-[#5A33FF22] text-[#A89CFF] hover:bg-[#252245] hover:text-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#5A33FF33] text-[#A89CFF] border border-[#5A33FF44]">
                        {item.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A89CFF]/80 mt-0.5">{item.desc}</div>
                  </div>
                  {settings.model === item.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Context window */}
            <div className="pt-2 border-t border-[#5A33FF22]">
              <label className="text-xs font-semibold text-white block mb-1.5">
                Fenêtre de Contexte Maximale (Context Length)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 8192, label: '8k tokens' },
                  { val: 32768, label: '32k tokens' },
                  { val: 131072, label: '128k (Max)' },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setSettings({ ...settings, contextWindow: opt.val })}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
                      settings.contextWindow === opt.val
                        ? 'bg-[#1E1B8C] border-[#5A33FF] text-white'
                        : 'bg-[#151428] border-[#5A33FF22] text-[#A89CFF] hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hyperparamètres (Sliders) */}
          <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-5 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8B70FF]" />
              Hyperparamètres d'Échantillonnage
            </h3>

            {/* Température */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span>Température (Créativité)</span>
                  <span className="text-[10px] text-[#A89CFF] font-normal">
                    {settings.temperature < 0.3 ? 'Précis & Code' : (settings.temperature > 0.9 ? 'Très créatif' : 'Équilibré')}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#131226] border border-[#5A33FF33] text-white font-mono font-bold">
                  {settings.temperature.toFixed(2)}
                </span>
              </div>
              <input 
                type="range"
                min="0.0"
                max="1.5"
                step="0.05"
                value={settings.temperature}
                onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full accent-[#5A33FF] bg-[#151428] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A89CFF]/60">
                <span>0.0 (Déterministe)</span>
                <span>0.7 (Recommandé)</span>
                <span>1.5 (Exploration)</span>
              </div>
            </div>

            {/* Top-P */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Top-P (Nucleus Sampling)</span>
                <span className="px-2 py-0.5 rounded bg-[#131226] border border-[#5A33FF33] text-white font-mono font-bold">
                  {settings.topP.toFixed(2)}
                </span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.topP}
                onChange={e => setSettings({ ...settings, topP: parseFloat(e.target.value) })}
                className="w-full accent-[#5A33FF] bg-[#151428] rounded-lg cursor-pointer"
              />
            </div>

            {/* Frequency Penalty */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Pénalité de Répétition (Frequency Penalty)</span>
                <span className="px-2 py-0.5 rounded bg-[#131226] border border-[#5A33FF33] text-white font-mono font-bold">
                  {settings.frequencyPenalty.toFixed(2)}
                </span>
              </div>
              <input 
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={settings.frequencyPenalty}
                onChange={e => setSettings({ ...settings, frequencyPenalty: parseFloat(e.target.value) })}
                className="w-full accent-[#5A33FF] bg-[#151428] rounded-lg cursor-pointer"
              />
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Longueur Maximale de Réponse</span>
                <span className="px-2 py-0.5 rounded bg-[#131226] border border-[#5A33FF33] text-white font-mono font-bold">
                  {settings.maxTokens} tokens
                </span>
              </div>
              <input 
                type="range"
                min="512"
                max="8192"
                step="256"
                value={settings.maxTokens}
                onChange={e => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                className="w-full accent-[#5A33FF] bg-[#151428] rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 border-t border-[#5A33FF22] space-y-2">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="text-white font-medium">Streaming mot à mot (Génération temps réel)</span>
                <input 
                  type="checkbox"
                  checked={settings.streamResponse}
                  onChange={e => setSettings({ ...settings, streamResponse: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#5A33FF]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="text-white font-medium">Afficher la chaîne de pensée (Chain of Thought CoT)</span>
                <input 
                  type="checkbox"
                  checked={settings.showReasoningCoT}
                  onChange={e => setSettings({ ...settings, showReasoningCoT: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#5A33FF]"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSONNALITÉ & INSTRUCTIONS SYSTÈME */}
      {activeTab === 'persona' && (
        <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-6 space-y-6 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#8B70FF]" />
              Persona & Posture Psychologique d'Andrea
            </h3>
            <p className="text-xs text-[#A89CFF] mt-1">
              Définit la manière dont l'IA vous répond et le niveau d'exigence comportementale appliqué.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'behaviorlab', title: '🧠 BehaviorLab AI', desc: 'Neurosciences, déblocage psychologique et passage à l’action en 3 étapes' },
              { id: 'expert', title: '🎯 Expert & Stratège', desc: 'Direct, analytique, centré sur le ROI, la rigueur et les résultats mesurables' },
              { id: 'socratique', title: '💬 Tuteur Socratique', desc: 'Pose des questions ciblées pour faire émerger vos propres solutions' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSettings({ ...settings, systemPersona: p.id as any })}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  settings.systemPersona === p.id
                    ? 'bg-gradient-to-br from-[#1E1B8C] to-[#5A33FF]/40 border-[#5A33FF] text-white shadow-lg'
                    : 'bg-[#151428] border-[#5A33FF22] text-[#A89CFF] hover:bg-[#252245] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{p.title}</div>
                <div className="text-[11px] opacity-80 mt-1 leading-snug">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* Custom instructions box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#8B70FF]" />
                Instructions Système Personnalisées (Custom System Prompt)
              </label>
              <span className="text-[10px] text-[#A89CFF]">Injecté en tête de chaque requête</span>
            </div>
            <textarea
              rows={4}
              value={settings.customInstructions}
              onChange={e => setSettings({ ...settings, customInstructions: e.target.value })}
              className="w-full bg-[#131226] border border-[#5A33FF44] focus:border-[#8B70FF] rounded-2xl p-3 text-xs text-white leading-relaxed resize-none focus:outline-none"
              placeholder="Ex : Sois extrêmement concis, ne mets pas de politesses superflues, donne toujours des exemples de code TypeScript prêts à l'emploi..."
            />
          </div>

          {/* Style parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#5A33FF22]">
            <div>
              <label className="text-xs font-semibold text-white block mb-1.5">Longueur de réponse</label>
              <select
                value={settings.responseLength}
                onChange={e => setSettings({ ...settings, responseLength: e.target.value as any })}
                className="w-full bg-[#131226] border border-[#5A33FF44] rounded-xl p-2 text-xs text-white focus:outline-none"
              >
                <option value="concise">Ultra-concise (Moins de 150 mots)</option>
                <option value="balanced">Équilibrée & Actionnable</option>
                <option value="exhaustive">Exhaustive & Approfondie</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white block mb-1.5">Style d'adresse</label>
              <select
                value={settings.addressStyle}
                onChange={e => setSettings({ ...settings, addressStyle: e.target.value as any })}
                className="w-full bg-[#131226] border border-[#5A33FF44] rounded-xl p-2 text-xs text-white focus:outline-none"
              >
                <option value="tu">Tutoiement direct (Dynamique & moderne)</option>
                <option value="vous">Vouvoiement formel (Entreprise & officiel)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white block mb-1.5">Préférence de Code</label>
              <select
                value={settings.codeStyle}
                onChange={e => setSettings({ ...settings, codeStyle: e.target.value as any })}
                className="w-full bg-[#131226] border border-[#5A33FF44] rounded-xl p-2 text-xs text-white focus:outline-none"
              >
                <option value="typescript">TypeScript strict (React / Node)</option>
                <option value="python">Python typé (FastAPI / Streamlit)</option>
                <option value="fullstack">Architecture Full-Stack complète</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. CAPACITÉS & OUTILS WEB */}
      {activeTab === 'tools' && (
        <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8B70FF]" />
              Outils & Capacités Avancées (Tools & Multimodal)
            </h3>
            <p className="text-xs text-[#A89CFF] mt-1">
              Activez ou désactivez les capacités dynamiques intégrées à Andrea.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: 'webSearchGrounding',
                label: 'Recherche Web en temps réel (Grounding)',
                desc: 'Permet à Andrea d\'extraire des faits récents, tendances et documentations à jour.',
                icon: Globe,
                state: settings.webSearchGrounding
              },
              {
                key: 'codeInterpreter',
                label: 'Interpréteur & Analyseur de code AST',
                desc: 'Vérifie la syntaxe de chaque bloc de code avant affichage pour éviter les bugs.',
                icon: Terminal,
                state: settings.codeInterpreter
              },
              {
                key: 'behaviorAnalysis',
                label: 'Détecteur de blocage comportemental',
                desc: 'Analyse la procrastination, la surcharge cognitive et propose le micro-défi adapté.',
                icon: Brain,
                state: settings.behaviorAnalysis
              },
              {
                key: 'longTermMemory',
                label: 'Mémoire continue inter-sessions',
                desc: 'Retient vos préférences de projet et objectifs à travers toutes vos discussions.',
                icon: Sparkles,
                state: settings.longTermMemory
              },
              {
                key: 'voiceDictation',
                label: 'Dictée vocale Whisper instantanée',
                desc: 'Active le micro 36px pour dicter librement vos messages à la voix.',
                icon: Volume2,
                state: settings.voiceDictation
              },
            ].map(item => (
              <div 
                key={item.key}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#151428] border border-[#5A33FF22] hover:border-[#5A33FF44] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#1A1930] border border-[#5A33FF33] text-[#8B70FF]">
                    <item.icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{item.label}</div>
                    <div className="text-[11px] text-[#A89CFF]/80">{item.desc}</div>
                  </div>
                </div>
                <input 
                  type="checkbox"
                  checked={item.state}
                  onChange={e => setSettings({ ...settings, [item.key]: e.target.checked } as any)}
                  className="w-4 h-4 rounded accent-[#5A33FF] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DONNÉES & CONFIDENTIALITÉ */}
      {activeTab === 'privacy' && (
        <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-6 space-y-5 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8B70FF]" />
              Protection des Données & Confidentialité
            </h3>
            <p className="text-xs text-[#A89CFF] mt-1">
              Contrôlez la rétention, le stockage chiffré et l'entraînement des modèles.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF22] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Opt-Out Entraînement Modèle (Zéro Data Retention)</div>
                <div className="text-[11px] text-[#A89CFF]/80">Vos données ne sont jamais utilisées pour entraîner ou affiner des modèles d'IA publics.</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                Actif (100% Privé)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF22] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Chiffrement AES Local des Discussions</div>
                <div className="text-[11px] text-[#A89CFF]/80">Toutes les mémoires locales sont signées cryptographiquement contre les attaques XSS.</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.secureLocalEncryption}
                onChange={e => setSettings({ ...settings, secureLocalEncryption: e.target.checked })}
                className="w-4 h-4 rounded accent-[#5A33FF] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF22] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Sauvegarde de l'Historique dans le Navigateur</div>
                <div className="text-[11px] text-[#A89CFF]/80">Désactiver pour un mode éphémère (discussions supprimées à la fermeture de l'onglet).</div>
              </div>
              <input 
                type="checkbox"
                checked={settings.saveHistory}
                onChange={e => setSettings({ ...settings, saveHistory: e.target.checked })}
                className="w-4 h-4 rounded accent-[#5A33FF] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
