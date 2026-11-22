import React, { useState } from 'react';
import {
  Volume2,
  Sliders,
  RotateCcw,
  Download,
  Check,
  Play,
  Globe,
  Lock,
  UserCheck,
  Languages,
} from 'lucide-react';
import { AIParameters, AppLanguage } from '../types';

interface AIParametersPageProps {
  parameters: AIParameters;
  onSaveParameters: (params: AIParameters) => void;
}

const LANGUAGE_OPTIONS: Array<{
  id: AppLanguage;
  label: string;
  native: string;
  speechCode: string;
  sample: string;
}> = [
  { id: 'fr', label: 'Français', native: 'Français (FR)', speechCode: 'fr-FR', sample: 'Bonjour, je suis Andrea. Mon moteur vocal est prêt.' },
  { id: 'en', label: 'English', native: 'English (US/UK)', speechCode: 'en-US', sample: 'Hello, I am Andrea. Your teaching assistant is ready.' },
  { id: 'es', label: 'Español', native: 'Español (ES)', speechCode: 'es-ES', sample: 'Hola, soy Andrea. Mi motor pedagógico está listo.' },
  { id: 'de', label: 'Deutsch', native: 'Deutsch (DE)', speechCode: 'de-DE', sample: 'Hallo, ich bin Andrea. Ich bin bereit, Ihnen zu helfen.' },
  { id: 'pt', label: 'Português', native: 'Português (PT/BR)', speechCode: 'pt-PT', sample: 'Olá, sou Andrea. Estou pronta para ajudar.' },
  { id: 'ar', label: 'العربية', native: 'العربية (AR)', speechCode: 'ar-SA', sample: 'مرحباً، أنا أندريا. جاهزة لمساعدتك خطوة بخطوة.' },
];

export const AIParametersPage: React.FC<AIParametersPageProps> = ({
  parameters,
  onSaveParameters,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'voix' | 'langue' | 'style' | 'web' | 'donnees'>('voix');
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(parameters.language || 'fr');
  const [testPhrase, setTestPhrase] = useState('Bonjour, je suis Andrea. Mon moteur vocal est prêt.');
  const [pitch, setPitch] = useState(1.1);
  const [speed, setSpeed] = useState(1.0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const [posture, setPosture] = useState(parameters.posture || 'Pédagogique & Détaillé');
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [enableVideoEngine, setEnableVideoEngine] = useState(true);
  const [enableCodeCreation, setEnableCodeCreation] = useState(true);
  const [enableTextIllustration, setEnableTextIllustration] = useState(true);

  const notify = (msg: string) => {
    setStatusNote(msg);
    setTimeout(() => setStatusNote(null), 2500);
  };

  const handleSelectLanguage = (langId: AppLanguage) => {
    setSelectedLang(langId);
    const meta = LANGUAGE_OPTIONS.find((l) => l.id === langId);
    if (meta) setTestPhrase(meta.sample);
    onSaveParameters({
      ...parameters,
      language: langId,
      posture,
    });
    notify(`Langue sélectionnée : ${meta?.label || langId}`);
  };

  const handleTestVoice = (customText?: string) => {
    const textToSpeak = customText || testPhrase;
    const meta = LANGUAGE_OPTIONS.find((l) => l.id === selectedLang);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = meta?.speechCode || 'fr-FR';
      utterance.pitch = pitch;
      utterance.rate = speed;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleApply = () => {
    onSaveParameters({
      ...parameters,
      creativity: 0.7,
      useMemory: true,
      language: selectedLang,
      posture,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDefault = () => {
    setVoiceGender('female');
    setSelectedLang('fr');
    setPitch(1.1);
    setSpeed(1.0);
    setPosture('Pédagogique & Détaillé');
    setTestPhrase('Bonjour, je suis Andrea. Mon moteur vocal est prêt.');
    onSaveParameters({
      ...parameters,
      language: 'fr',
      posture: 'Pédagogique & Détaillé',
    });
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto overflow-y-auto lg:overflow-hidden overflow-x-hidden">
      {/* Left Column */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 lg:overflow-hidden">
        <div className="space-y-1.5">
          <div className="p-2.5 bg-[#11173b] border border-[#232f6b] rounded-2xl flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-base font-black text-white">Paramètres</h2>
              <p className="text-[11px] text-slate-400">Configuration d'Andrea</p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              { id: 'voix' as const, label: "Voix d'Andrea", sub: 'Féminine / Masculine', icon: Volume2, color: 'text-sky-400' },
              { id: 'langue' as const, label: 'Langue', sub: `Active : ${LANGUAGE_OPTIONS.find((l) => l.id === selectedLang)?.label || 'Français'}`, icon: Languages, color: 'text-cyan-400' },
              { id: 'style' as const, label: 'Personnalité & Style', sub: 'Posture pédagogique & dialogue', icon: UserCheck, color: 'text-indigo-400' },
              { id: 'web' as const, label: 'Capacités & Outils', sub: 'Vidéo, illustration & code', icon: Globe, color: 'text-emerald-400' },
              { id: 'donnees' as const, label: 'Données & Confidentialité', sub: 'Sécurité locale', icon: Lock, color: 'text-amber-400' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    activeSubTab === item.id
                      ? 'bg-[#1b2b73] border-[#384fa6] text-white'
                      : 'bg-[#0f1433] border-[#202959] text-slate-300 hover:bg-[#151c42]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{item.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleResetDefault}
            className="py-2 px-3 bg-[#131838] border border-[#222c5e] text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Défaut</span>
          </button>
          <button
            onClick={() => notify('Configuration exportée localement.')}
            className="py-2 px-3 bg-[#131838] border border-[#222c5e] text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
          <button
            onClick={handleApply}
            className="col-span-2 py-2 px-4 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{savedSuccess ? 'Modifications Appliquées' : 'Appliquer'}</span>
          </button>
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-7 lg:overflow-hidden flex flex-col">
        {statusNote && (
          <div className="mb-2 px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shrink-0">
            {statusNote}
          </div>
        )}

        {activeSubTab === 'voix' && (
          <div className="flex-1 min-h-0 p-4 sm:p-5 rounded-3xl bg-[#0f1433] border border-[#202959] flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black text-white">Choix de la Voix & Synthèse Vocale</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 font-mono">Actif</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Sélectionnez et testez la voix utilisée par Andrea.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs border-t border-[#202959] pt-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                <input type="radio" name="voiceGender" checked={voiceGender === 'female'} onChange={() => setVoiceGender('female')} className="accent-[#3a58e8]" />
                <span>Voix Féminine</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                <input type="radio" name="voiceGender" checked={voiceGender === 'male'} onChange={() => setVoiceGender('male')} className="accent-[#3a58e8]" />
                <span>Voix Masculine</span>
              </label>
            </div>

            <div className="space-y-2 border-t border-[#202959] pt-3">
              <input
                type="text"
                value={testPhrase}
                onChange={(e) => setTestPhrase(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white"
              />
              <button
                onClick={() => handleTestVoice()}
                disabled={isPlayingAudio}
                className="px-4 py-2 bg-[#2036a1] hover:bg-[#2b44bf] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isPlayingAudio ? 'Lecture...' : 'Tester la voix'}</span>
              </button>
            </div>

            <div className="space-y-3 border-t border-[#202959] pt-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-200 tabular-nums">
                  <span>Tonalité</span>
                  <span className="font-mono text-sky-400">{pitch.toFixed(2)}x</span>
                </div>
                <input type="range" min="0.7" max="1.5" step="0.05" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full accent-[#3a58e8]" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-200 tabular-nums">
                  <span>Vitesse</span>
                  <span className="font-mono text-indigo-400">{speed.toFixed(2)}x</span>
                </div>
                <input type="range" min="0.75" max="1.40" step="0.05" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-[#3a58e8]" />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'langue' && (
          <div className="flex-1 min-h-0 p-5 rounded-3xl bg-[#0f1433] border border-[#202959] flex flex-col justify-between gap-3 overflow-hidden text-xs">
            <div>
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">Langue de l'interface & d'Andrea</h3>
              </div>
              <p className="text-slate-300 mt-1">
                Choisissez la langue dans laquelle Andrea vous enseigne, vous répond et synthétise la voix.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-0 content-start">
              {LANGUAGE_OPTIONS.map((lang) => {
                const active = selectedLang === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      active
                        ? 'bg-[#1b2b73] border-[#384fa6] text-white'
                        : 'bg-[#171e47] border-[#28346e] text-slate-300 hover:bg-[#1f2961]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{lang.label}</div>
                      <div className="text-[11px] text-slate-400">{lang.native}</div>
                    </div>
                    {active && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-[#171e47] border border-[#28346e] flex items-center justify-between gap-2">
              <span className="text-slate-300 truncate">{testPhrase}</span>
              <button
                type="button"
                onClick={() => handleTestVoice()}
                className="px-3 py-1.5 bg-[#2036a1] hover:bg-[#2b44bf] text-white font-bold rounded-xl cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Écouter</span>
              </button>
            </div>
          </div>
        )}

        {activeSubTab === 'style' && (
          <div className="flex-1 min-h-0 p-5 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Posture & Personnalité d'Andrea</h3>
            <p className="text-slate-300">
              Par défaut, Andrea adopte une approche pédagogique structurée qui explique chaque notion en détail et s'adapte à vos demandes en pleine conversation.
            </p>
            <select
              value={posture}
              onChange={(e) => setPosture(e.target.value)}
              className="w-full p-3 bg-[#171e47] border border-[#28346e] rounded-xl text-white"
            >
              <option value="Pédagogique & Détaillé">Pédagogique &amp; Détaillé (Recommandé)</option>
              <option value="Stratégique & Orienté Action">Stratégique &amp; Orienté Action</option>
              <option value="Créatif & Idéation Ludique">Créatif &amp; Idéation Ludique</option>
              <option value="Direct & Minimaliste">Direct &amp; Minimaliste</option>
            </select>
          </div>
        )}

        {activeSubTab === 'web' && (
          <div className="flex-1 min-h-0 p-5 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-2.5 text-xs overflow-hidden">
            <h3 className="text-base font-black text-white">Capacités & Outils Andrea</h3>
            {[
              { label: 'Moteur Vidéo 9:16, Avatar Parlant & Mouvements Caméra', checked: enableVideoEngine, toggle: setEnableVideoEngine },
              { label: 'Création dynamique de sites et applications en discussion', checked: enableCodeCreation, toggle: setEnableCodeCreation },
              { label: 'Illustration vidéo de texte (Bouton Illustrer votre texte)', checked: enableTextIllustration, toggle: setEnableTextIllustration },
              { label: 'Recherche musicale et de bruitages universelle en direct', checked: enableWebSearch, toggle: setEnableWebSearch },
            ].map((item, idx) => (
              <label key={idx} className="flex items-center justify-between p-2.5 bg-[#171e47] rounded-xl cursor-pointer">
                <span className="font-bold text-white">{item.label}</span>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.toggle(e.target.checked)}
                  className="w-4 h-4 accent-[#3a58e8]"
                />
              </label>
            ))}
          </div>
        )}

        {activeSubTab === 'donnees' && (
          <div className="flex-1 min-h-0 p-5 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Données & Sécurité Locale</h3>
            <p className="text-slate-300">Vos discussions et projets sont enregistrés localement sur votre navigateur.</p>
            <button
              onClick={() => notify('Cache local effacé.')}
              className="px-4 py-2 bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/40 rounded-xl font-bold cursor-pointer"
            >
              Effacer le cache local
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
