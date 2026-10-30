import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Brain, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Download, 
  Volume2, 
  Globe, 
  Terminal, 
  Lock, 
  SlidersHorizontal,
  Play,
  Square
} from 'lucide-react';
import { andreaVoice } from '../utils/speech';

export interface AiSettings {
  // Style & Personnalité
  systemPersona: 'behaviorlab' | 'expert' | 'socratique';
  responseLength: 'concise' | 'balanced' | 'exhaustive';
  codeStyle: 'typescript' | 'python' | 'fullstack';
  addressStyle: 'tu' | 'vous';
  
  // Outils & Capacités
  autoTts: boolean;
  voiceDictation: boolean;
  behaviorAnalysis: boolean;
  codeInterpreter: boolean;
  webSearchGrounding: boolean;
  longTermMemory: boolean;
  
  // Paramètres Vocaux d'Andrea
  voiceGender: 'feminine' | 'masculine';
  voicePitch: number;
  voiceRate: number;

  // Confidentialité
  saveHistory: boolean;
  trainingOptOut: boolean;
  secureLocalEncryption: boolean;
}

const DEFAULT_SETTINGS: AiSettings = {
  systemPersona: 'behaviorlab',
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

  const [activeTab, setActiveTab] = useState<'voice' | 'persona' | 'tools' | 'privacy'>('voice');
  const [savedToast, setSavedToast] = useState(false);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testPhrase, setTestPhrase] = useState("Bonjour, je suis Andrea. Mon moteur vocal est optimisé pour vous répondre instantanément.");

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
    try {
      localStorage.setItem('andrea_ai_settings', JSON.stringify(settings));
    } catch {}
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    if (onNotify) onNotify("Paramètres enregistrés avec succès.");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('andrea_ai_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch {}
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    if (onNotify) onNotify("Paramètres réinitialisés aux valeurs par défaut.");
  };

  const exportConfigJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `andrea_parametres_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#150f2e] border border-[#5A33FF33] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[580px] animate-in fade-in">
      {/* SIDEBAR SOUS-MENUS À GAUCHE */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#100b24] border-b md:border-b-0 md:border-r border-[#5A33FF33] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Header Paramètres */}
          <div className="px-2 py-1 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#1b143c] border border-[#5A33FF44] text-zinc-200">
              <Sliders className="w-4 h-4 text-zinc-300" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Paramètres</h2>
              <p className="text-[11px] text-zinc-400">Configuration d'Andrea</p>
            </div>
          </div>

          {/* Navigation Sous-menus à gauche */}
          <nav className="space-y-1">
            {[
              { id: 'voice', label: "Voix d'Andrea", icon: Volume2, sublabel: 'Féminine / Masculine' },
              { id: 'persona', label: 'Personnalité & Style', icon: Brain, sublabel: 'Posture & réponses' },
              { id: 'tools', label: 'Capacités Web & Outils', icon: Globe, sublabel: 'Recherche & analyse' },
              { id: 'privacy', label: 'Données & Confidentialité', icon: Lock, sublabel: 'Sécurité & historique' },
            ].map(item => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-3 ${
                    active
                      ? 'bg-[#231a4a] text-white border border-[#5A33FF66] shadow'
                      : 'text-zinc-300 hover:bg-[#181135] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-zinc-400'}`} />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{item.label}</div>
                    <div className="text-[10px] text-zinc-400 truncate font-normal">{item.sublabel}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Actions en bas du sidebar */}
        <div className="pt-4 border-t border-[#5A33FF22] space-y-2 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex-1 py-1.5 px-2 rounded-xl bg-transparent hover:bg-[#1c153d] border border-[#5A33FF33] text-[11px] font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3 text-zinc-400" />
              <span>Défaut</span>
            </button>
            <button
              onClick={exportConfigJson}
              className="flex-1 py-1.5 px-2 rounded-xl bg-[#181236] hover:bg-[#231a4a] border border-[#5A33FF44] text-[11px] font-semibold text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3 h-3 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
          <button
            onClick={handleSave}
            className="w-full py-2 rounded-xl bg-[#231a4a] hover:bg-[#2e2363] border border-[#5A33FF66] text-xs font-bold text-white transition flex items-center justify-center gap-1.5 shadow"
          >
            <Check className="w-3.5 h-3.5 text-zinc-200" />
            <span>{savedToast ? 'Enregistré !' : 'Appliquer'}</span>
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL DU SOUS-MENU SÉLECTIONNÉ À DROITE */}
      <div className="flex-1 p-5 md:p-7 overflow-y-auto bg-[#150f2e]">
        
        {/* SOUS-MENU 1 : VOIX D'ANDREA (FÉMININE / MASCULINE & TEST) */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-zinc-300" />
                  <span>Choix de la Voix & Synthèse Vocale</span>
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Gratuit & Illimité
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Sélectionnez et testez en direct la voix masculine ou féminine utilisée par Andrea pour la lecture vocale.
              </p>
            </div>

            {/* SÉLECTEUR VOIX SIMPLE AVEC CASES À COCHER (FÉMININE PAR DÉFAUT) */}
            <div className="p-4 rounded-2xl bg-[#1b143c] border border-[#5A33FF22] space-y-3">
              <span className="text-xs font-bold text-white block">Sélection de la Voix :</span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
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

                <label className="flex items-center gap-2.5 cursor-pointer">
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
                  <span className="text-xs font-semibold text-zinc-300">Voix Masculine</span>
                </label>
              </div>
            </div>

            {/* MODULE DE TEST AUDIO EN DIRECT */}
            <div className="p-5 rounded-2xl bg-[#120d26] border border-[#5A33FF33] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Test d'Écoute en Direct</span>
                </span>

                {/* Audio Wave Visualizer when speaking */}
                {isTestingVoice && (
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-zinc-300 rounded-full animate-bounce" />
                    <span className="w-1 h-5 bg-zinc-200 rounded-full animate-bounce [animation-delay:100ms]" />
                    <span className="w-1 h-4 bg-zinc-400 rounded-full animate-bounce [animation-delay:200ms]" />
                    <span className="text-[10px] text-zinc-300 font-bold ml-1">Lecture en cours...</span>
                  </div>
                )}
              </div>

              {/* Test Sentence input */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-zinc-400 font-medium">Phrase à faire prononcer à Andrea :</label>
                <input 
                  type="text"
                  value={testPhrase}
                  onChange={e => setTestPhrase(e.target.value)}
                  className="w-full bg-[#181236] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                />
              </div>

              {/* Test Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
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
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow ${
                    isTestingVoice 
                      ? 'bg-zinc-800 text-white border border-zinc-600 animate-pulse'
                      : 'bg-[#231a4a] hover:bg-[#2d2260] text-white border border-[#5A33FF66]'
                  }`}
                >
                  {isTestingVoice ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white" />}
                  <span>
                    {isTestingVoice ? 'Arrêter le test vocal' : `Tester la voix ${settings.voiceGender === 'masculine' ? 'masculine' : 'féminine'} d'Andrea`}
                  </span>
                </button>

                <button
                  onClick={() => {
                    andreaVoice.testVoice(settings.voiceGender, andreaVoice.getLanguage(), () => setIsTestingVoice(false));
                    setIsTestingVoice(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#1b143c] hover:bg-[#261c52] text-zinc-300 hover:text-white border border-[#5A33FF33] text-xs font-semibold transition"
                >
                  Message d'accueil
                </button>
              </div>
            </div>

            {/* TONALITÉ & VITESSE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#5A33FF22]">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">Tonalité (Pitch)</span>
                  <span className="font-mono text-zinc-300 font-bold">{settings.voicePitch.toFixed(2)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.6"
                  max="1.5"
                  step="0.05"
                  value={settings.voicePitch}
                  onChange={e => setSettings({ ...settings, voicePitch: parseFloat(e.target.value) })}
                  className="w-full accent-[#5A33FF] bg-[#100b24] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Plus grave</span>
                  <span>Neutre (1.0)</span>
                  <span>Plus aiguë</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">Vitesse d'élocution (Speed)</span>
                  <span className="font-mono text-zinc-300 font-bold">{settings.voiceRate.toFixed(2)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.75"
                  max="1.4"
                  step="0.05"
                  value={settings.voiceRate}
                  onChange={e => setSettings({ ...settings, voiceRate: parseFloat(e.target.value) })}
                  className="w-full accent-[#5A33FF] bg-[#100b24] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>0.75x (Lent)</span>
                  <span>1.0x (Naturel)</span>
                  <span>1.4x (Rapide)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOUS-MENU 2 : PERSONNALITÉ & STYLE (SANS LE CHAMP INSTRUCTION PERSONNALISÉE) */}
        {activeTab === 'persona' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-zinc-300" />
                <span>Persona & Posture Psychologique d'Andrea</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Définit la manière dont l'IA vous répond et le niveau d'exigence comportementale appliqué.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'behaviorlab', title: 'BehaviorLab AI', desc: 'Neurosciences, déblocage psychologique et passage à l’action concret' },
                { id: 'expert', title: 'Expert & Stratège', desc: 'Direct, analytique, centré sur le résultat mesurable et la rigueur' },
                { id: 'socratique', title: 'Tuteur Socratique', desc: 'Pose des questions ciblées pour faire émerger vos propres solutions' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSettings({ ...settings, systemPersona: p.id as any })}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    settings.systemPersona === p.id
                      ? 'bg-[#231a4a] border-[#5A33FF] text-white shadow-lg'
                      : 'bg-[#1b143c] border-[#5A33FF22] text-zinc-300 hover:bg-[#261c52] hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{p.title}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 leading-snug">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Style parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#5A33FF22]">
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Longueur de réponse</label>
                <select
                  value={settings.responseLength}
                  onChange={e => setSettings({ ...settings, responseLength: e.target.value as any })}
                  className="w-full bg-[#100b24] border border-[#5A33FF44] rounded-xl p-2 text-xs text-white focus:outline-none"
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
                  className="w-full bg-[#100b24] border border-[#5A33FF44] rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="tu">Tutoiement direct (Dynamique)</option>
                  <option value="vous">Vouvoiement formel (Entreprise)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Préférence de Code</label>
                <select
                  value={settings.codeStyle}
                  onChange={e => setSettings({ ...settings, codeStyle: e.target.value as any })}
                  className="w-full bg-[#100b24] border border-[#5A33FF44] rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="typescript">TypeScript strict (React / Node)</option>
                  <option value="python">Python typé</option>
                  <option value="fullstack">Architecture Full-Stack complète</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* SOUS-MENU 3 : CAPACITÉS & OUTILS WEB */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-300" />
                <span>Outils & Capacités Avancées</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Activez ou désactivez les capacités dynamiques intégrées à Andrea.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
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
                  label: 'Dictée vocale instantanée',
                  desc: 'Active le micro pour dicter vos messages à la voix.',
                  icon: Volume2,
                  state: settings.voiceDictation
                },
              ].map(item => (
                <div 
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1b143c] border border-[#5A33FF22] hover:border-[#5A33FF44] transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-[#100b24] border border-[#5A33FF33] text-zinc-300">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-zinc-400">{item.desc}</div>
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

        {/* SOUS-MENU 4 : DONNÉES & CONFIDENTIALITÉ */}
        {activeTab === 'privacy' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-zinc-300" />
                <span>Protection des Données & Confidentialité</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Contrôlez la rétention, le stockage chiffré et l'entraînement des modèles.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#1b143c] border border-[#5A33FF22] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Opt-Out Entraînement Modèle (Zéro Data Retention)</div>
                  <div className="text-[11px] text-zinc-400">Vos données ne sont jamais utilisées pour entraîner des modèles publics.</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-bold">
                  Actif (100% Privé)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#1b143c] border border-[#5A33FF22] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Chiffrement AES Local des Discussions</div>
                  <div className="text-[11px] text-zinc-400">Toutes les mémoires locales sont signées cryptographiquement.</div>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.secureLocalEncryption}
                  onChange={e => setSettings({ ...settings, secureLocalEncryption: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#5A33FF] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#1b143c] border border-[#5A33FF22] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Sauvegarde de l'Historique dans le Navigateur</div>
                  <div className="text-[11px] text-zinc-400">Désactiver pour un mode éphémère (discussions supprimées à la fermeture de l'onglet).</div>
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
    </div>
  );
};

export default AiSettingsPanel;
