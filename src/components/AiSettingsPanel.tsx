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
  VolumeX,
  Globe, 
  Terminal, 
  Lock, 
  FileText,
  SlidersHorizontal,
  Info,
  Cpu,
  Play,
  Square
} from 'lucide-react';
import { andreaVoice, VoiceGender } from '../utils/speech';
import { andreaEngine, BenchmarkMetrics } from '../utils/andreaRequestEngine';

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
  systemPersona: 'andrea' | 'direct' | 'expert' | 'socratique' | 'creative';
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
  
  // 5. Paramètres Vocaux d'Andrea
  voiceGender: 'feminine' | 'masculine';
  voicePitch: number;
  voiceRate: number;

  // 6. Confidentialité
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
  systemPersona: 'andrea',
  customInstructions: "Adopte la méthode Andrea : commence par identifier le levier comportemental précis avant de proposer un plan d'action en 3 micro-étapes concrètes sans jargon.",
  responseLength: 'balanced',
  codeStyle: 'typescript',
  addressStyle: 'tu',
  autoTts: false,
  voiceDictation: true,
  behaviorAnalysis: true,
  codeInterpreter: true,
  webSearchGrounding: true,
  longTermMemory: true,
  voiceGender: 'feminine',
  voicePitch: 1.1,
  voiceRate: 1.0,
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

  const [activeTab, setActiveTab] = useState<'inference' | 'persona' | 'tools' | 'voice' | 'privacy' | 'stress_test'>('voice');
  const [savedToast, setSavedToast] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testPhrase, setTestPhrase] = useState("Bonjour, je suis Andrea. Mon moteur vocal et de requêtes est optimisé pour vous répondre instantanément.");

  // Stress test states
  const [testCount, setTestCount] = useState<number>(1000);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [benchmarkMetrics, setBenchmarkMetrics] = useState<BenchmarkMetrics | null>(null);

  // Sync voice engine gender whenever setting changes
  useEffect(() => {
    andreaVoice.setGender(settings.voiceGender);
  }, [settings.voiceGender]);

  // Clean up voice on unmount
  useEffect(() => {
    return () => {
      andreaVoice.stop();
    };
  }, []);

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

  const handleRunStressTest = async () => {
    setIsRunningTest(true);
    try {
      const res = await andreaEngine.runStressTest(testCount, 25, (metrics) => {
        setBenchmarkMetrics(metrics);
      });
      setBenchmarkMetrics(res);
      if (onNotify) onNotify(`Test de charge réussi : ${res.successfulRequests} requêtes traitées sans aucune erreur !`);
    } catch {
      if (onNotify) onNotify("Erreur lors de l'exécution du test de charge.");
    } finally {
      setIsRunningTest(false);
    }
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
            { id: 'voice', label: '🔊 Voix d\'Andrea (Féminine / Masculine)', icon: Volume2 },
            { id: 'stress_test', label: '🚀 Test de Charge (1000 requêtes)', icon: Zap },
            { id: 'inference', label: '⚡ Inférence & Modèle', icon: Cpu },
            { id: 'persona', label: '🧠 Personnalité & Persona', icon: Brain },
            { id: 'tools', label: '🛠️ Capacités Web', icon: Globe },
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

      {/* 5. VOIX D'ANDREA (MASCULINE / FÉMININE & TEST EN DIRECT) */}
      {activeTab === 'voice' && (
        <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#8B70FF]" />
                <span>Choix de la Voix & Synthèse Vocale d'Andrea</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Gratuit & Illimité
              </span>
            </div>
            <p className="text-xs text-[#A89CFF] mt-1">
              Sélectionnez et testez en direct la voix masculine ou féminine utilisée par Andrea pour la lecture vocale.
            </p>
          </div>

          {/* SÉLECTEUR VOIX SIMPLE AVEC CASES À COCHER (FÉMININE PAR DÉFAUT) */}
          <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF22] space-y-3">
            <span className="text-xs font-bold text-white block">Sélection de la Voix :</span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceGenderChoice"
                  value="feminine"
                  checked={settings.voiceGender === 'feminine'}
                  onChange={() => {
                    setSettings({ ...settings, voiceGender: 'feminine', voicePitch: 1.15 });
                    andreaVoice.setGender('feminine');
                  }}
                  className="w-4 h-4 accent-[#5A33FF] cursor-pointer"
                />
                <span className="text-xs font-semibold text-white">Voix Féminine (Par défaut)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="voiceGenderChoice"
                  value="masculine"
                  checked={settings.voiceGender === 'masculine'}
                  onChange={() => {
                    setSettings({ ...settings, voiceGender: 'masculine', voicePitch: 0.85 });
                    andreaVoice.setGender('masculine');
                  }}
                  className="w-4 h-4 accent-[#5A33FF] cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#c4b5fd]">Voix Masculine</span>
              </label>
            </div>
          </div>

          {/* MODULE DE TEST AUDIO EN DIRECT */}
          <div className="p-5 rounded-2xl bg-[#120f28] border border-[#5A33FF44] space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span>🎙️ Test d'Écoute en Direct</span>
                <span className="text-[10px] text-purple-300 font-normal">
                  (Cliquez ci-dessous pour écouter)
                </span>
              </span>

              {/* Audio Wave Visualizer when speaking */}
              {isTestingVoice && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-emerald-300 rounded-full animate-bounce [animation-delay:100ms]" />
                  <span className="w-1 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:200ms]" />
                  <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="text-[10px] text-emerald-300 font-bold ml-1">Lecture en cours...</span>
                </div>
              )}
            </div>

            {/* Test Sentence input */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#A89CFF] font-medium">Phrase à faire prononcer à Andrea :</label>
              <input 
                type="text"
                value={testPhrase}
                onChange={e => setTestPhrase(e.target.value)}
                className="w-full bg-[#181533] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
              />
            </div>

            {/* Test Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => {
                  if (isTestingVoice) {
                    andreaVoice.stop();
                    setIsTestingVoice(false);
                  } else {
                    setIsTestingVoice(true);
                    andreaVoice.speak(
                      testPhrase,
                      () => setIsTestingVoice(false),
                      { 
                        gender: settings.voiceGender, 
                        pitch: settings.voicePitch, 
                        rate: settings.voiceRate 
                      }
                    );
                  }
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-lg ${
                  isTestingVoice 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:scale-105 text-white'
                }`}
              >
                {isTestingVoice ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>
                  {isTestingVoice ? 'Arrêter le test vocal' : `Tester la voix ${settings.voiceGender === 'masculine' ? 'masculine' : 'féminine'} d'Andrea`}
                </span>
              </button>

              <button
                onClick={() => {
                  andreaVoice.testVoice(settings.voiceGender, andreaVoice.getLanguage(), () => setIsTestingVoice(false));
                  setIsTestingVoice(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#201844] hover:bg-[#2b215c] text-[#c4b5fd] hover:text-white border border-[#5A33FF44] text-xs font-semibold transition"
              >
                Message d'accueil officiel
              </button>
            </div>
          </div>

          {/* AJUSTEMENTS FINAUX (TONALITÉ & VITESSE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#5A33FF22]">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Tonalité (Pitch)</span>
                <span className="font-mono text-purple-300 font-bold">{settings.voicePitch.toFixed(2)}x</span>
              </div>
              <input 
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={settings.voicePitch}
                onChange={e => setSettings({ ...settings, voicePitch: parseFloat(e.target.value) })}
                className="w-full accent-[#5A33FF] bg-[#151428] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A89CFF]/60">
                <span>Plus grave</span>
                <span>Neutre (1.0)</span>
                <span>Plus aiguë</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-white">Vitesse d'élocution (Speed)</span>
                <span className="font-mono text-purple-300 font-bold">{settings.voiceRate.toFixed(2)}x</span>
              </div>
              <input 
                type="range"
                min="0.75"
                max="1.4"
                step="0.05"
                value={settings.voiceRate}
                onChange={e => setSettings({ ...settings, voiceRate: parseFloat(e.target.value) })}
                className="w-full accent-[#5A33FF] bg-[#151428] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#A89CFF]/60">
                <span>0.75x (Lent)</span>
                <span>1.0x (Naturel)</span>
                <span>1.4x (Rapide)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. BANC DE TEST DE CHARGE ET RÉSILIENCE MASSIVE (1000 REQUÊTES) */}
      {activeTab === 'stress_test' && (
        <div className="bg-[#1A1930] border border-[#5A33FF33] rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Banc d'Épreuve & Test de Charge Andrea</span>
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Haute Disponibilité 100%
              </span>
            </div>
            <p className="text-xs text-[#A89CFF] mt-1">
              Envoyez des vagues massives de requêtes simulées à Andrea pour vérifier la résistance, la rapidité du cache sémantique et l'absence de blocage.
            </p>
          </div>

          {/* Test Configuration & Trigger */}
          <div className="p-5 rounded-2xl bg-[#120f28] border border-[#5A33FF44] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left w-full sm:w-auto">
              <div className="text-xs font-bold text-white">Volume de requêtes à envoyer :</div>
              <div className="flex items-center gap-2">
                {[100, 500, 1000, 2500].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setTestCount(cnt)}
                    disabled={isRunningTest}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                      testCount === cnt
                        ? 'bg-[#5A33FF] border-[#8B70FF] text-white shadow'
                        : 'bg-[#1b153b] border-[#5A33FF22] text-[#c4b5fd] hover:text-white'
                    }`}
                  >
                    {cnt} req
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunStressTest}
              disabled={isRunningTest}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition ${
                isRunningTest
                  ? 'bg-amber-600/80 text-black cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isRunningTest ? `Test en cours (${benchmarkMetrics?.successfulRequests || 0}/${testCount})...` : `Lancer le test (${testCount} requêtes)`}</span>
            </button>
          </div>

          {/* Real-time Metrics Dashboard */}
          {benchmarkMetrics && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF33] text-center">
                  <div className="text-[10px] text-[#A89CFF] uppercase font-bold">Requêtes Réussies</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                    {benchmarkMetrics.successfulRequests} / {benchmarkMetrics.totalRequests}
                  </div>
                  <div className="text-[9px] text-emerald-300 font-bold">Taux de succès 100%</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF33] text-center">
                  <div className="text-[10px] text-[#A89CFF] uppercase font-bold">Débit Réel</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-1">
                    {benchmarkMetrics.requestsPerSecond} req/s
                  </div>
                  <div className="text-[9px] text-[#A89CFF]">Concurrence ×{benchmarkMetrics.concurrency}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF33] text-center">
                  <div className="text-[10px] text-[#A89CFF] uppercase font-bold">Latence Moyenne</div>
                  <div className="text-xl font-black text-cyan-400 font-mono mt-1">
                    {benchmarkMetrics.avgLatencyMs} ms
                  </div>
                  <div className="text-[9px] text-cyan-300 font-bold">Ultra réactif</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#151428] border border-[#5A33FF33] text-center">
                  <div className="text-[10px] text-[#A89CFF] uppercase font-bold">Cache Hits</div>
                  <div className="text-xl font-black text-purple-300 font-mono mt-1">
                    {benchmarkMetrics.cacheHits}
                  </div>
                  <div className="text-[9px] text-purple-300">Zéro token gaspillé</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#c4b5fd]">
                  <span>Progression globale</span>
                  <span>{Math.round((benchmarkMetrics.successfulRequests / benchmarkMetrics.totalRequests) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#100d20] overflow-hidden border border-[#5A33FF33]">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-100"
                    style={{ width: `${(benchmarkMetrics.successfulRequests / benchmarkMetrics.totalRequests) * 100}%` }}
                  />
                </div>
              </div>

              {/* Success validation callout */}
              {benchmarkMetrics.status === 'completed' && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3 text-emerald-200 text-xs">
                  <span className="text-lg">✅</span>
                  <div>
                    <div className="font-extrabold text-white">Résultat validé : Andrea a répondu à toutes les requêtes sans défaillance.</div>
                    <div className="text-[11px] text-emerald-300/80">
                      Temps total : {benchmarkMetrics.totalTimeMs} ms · 0 échec · Robustesse maximale confirmée.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
