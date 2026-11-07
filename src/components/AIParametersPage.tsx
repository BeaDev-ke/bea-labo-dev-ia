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
  Sparkles
} from 'lucide-react';
import { AIParameters } from '../types';

interface AIParametersPageProps {
  parameters: AIParameters;
  onSaveParameters: (params: AIParameters) => void;
}

export const AIParametersPage: React.FC<AIParametersPageProps> = ({
  parameters,
  onSaveParameters,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'voix' | 'style' | 'web' | 'donnees'>('voix');

  // Voice Settings (Photo 1)
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [testPhrase, setTestPhrase] = useState('Bonjour, je suis Andrea. Mon moteur vocal est optimisé pour vous');
  const [pitch, setPitch] = useState(1.10);
  const [speed, setSpeed] = useState(1.00);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Personality & Style State
  const [posture, setPosture] = useState('Stratégique & Orienté Action');
  const [verbosity, setVerbosity] = useState('Concis & Structuré');

  // Web Capabilities
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [enableWanVideo, setEnableWanVideo] = useState(true);

  const handleTestVoice = (customText?: string) => {
    const textToSpeak = customText || testPhrase;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      utterance.pitch = pitch;
      utterance.rate = speed;

      // Adjust voice if available
      const voices = window.speechSynthesis.getVoices();
      const frVoices = voices.filter((v) => v.lang.startsWith('fr'));
      if (frVoices.length > 0) {
        if (voiceGender === 'male') {
          const maleVoice = frVoices.find((v) => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('paul') || v.name.toLowerCase().includes('thomas'));
          if (maleVoice) utterance.voice = maleVoice;
        } else {
          const femaleVoice = frVoices.find((v) => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('amlie') || v.name.toLowerCase().includes('celine'));
          if (femaleVoice) utterance.voice = femaleVoice;
        }
      }

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
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleResetDefault = () => {
    setVoiceGender('female');
    setPitch(1.10);
    setSpeed(1.00);
    setTestPhrase('Bonjour, je suis Andrea. Mon moteur vocal est optimisé pour vous');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Left Column matching Photo 1 */}
      <div className="lg:col-span-5 space-y-4">
        {/* Title */}
        <div className="p-4 bg-[#11173b] border border-[#232f6b] rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-black text-white">Paramètres</h2>
              <p className="text-xs text-slate-400">Configuration d'Andrea</p>
            </div>
          </div>
        </div>

        {/* 4 Sub-Tabs Cards */}
        <div className="space-y-2">
          {/* Sub-tab 1: Voix d'Andrea */}
          <button
            onClick={() => setActiveSubTab('voix')}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeSubTab === 'voix'
                ? 'bg-[#1b2b73] border-[#384fa6] text-white shadow-lg shadow-indigo-950/50'
                : 'bg-[#0f1433] border-[#202959] text-slate-300 hover:bg-[#151c42]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-bold text-white">Voix d'Andrea</div>
                <div className="text-[11px] text-slate-400">Féminine / Masculine</div>
              </div>
            </div>
          </button>

          {/* Sub-tab 2: Personnalité & Style */}
          <button
            onClick={() => setActiveSubTab('style')}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeSubTab === 'style'
                ? 'bg-[#1b2b73] border-[#384fa6] text-white shadow-lg shadow-indigo-950/50'
                : 'bg-[#0f1433] border-[#202959] text-slate-300 hover:bg-[#151c42]'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold text-white">Personnalité & Style</div>
                <div className="text-[11px] text-slate-400">Posture & réponses</div>
              </div>
            </div>
          </button>

          {/* Sub-tab 3: Capacités Web & Outils */}
          <button
            onClick={() => setActiveSubTab('web')}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeSubTab === 'web'
                ? 'bg-[#1b2b73] border-[#384fa6] text-white shadow-lg shadow-indigo-950/50'
                : 'bg-[#0f1433] border-[#202959] text-slate-300 hover:bg-[#151c42]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">Capacités Web & Outils</div>
                <div className="text-[11px] text-slate-400">Recherche & analyse</div>
              </div>
            </div>
          </button>

          {/* Sub-tab 4: Données & Confidentialité */}
          <button
            onClick={() => setActiveSubTab('donnees')}
            className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              activeSubTab === 'donnees'
                ? 'bg-[#1b2b73] border-[#384fa6] text-white shadow-lg shadow-indigo-950/50'
                : 'bg-[#0f1433] border-[#202959] text-slate-300 hover:bg-[#151c42]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Données & Confidentialité</div>
                <div className="text-[11px] text-slate-400">Sécurité & historique</div>
              </div>
            </div>
          </button>
        </div>

        {/* Action Buttons matching Photo 1 bottom: Défaut, Exporter, Appliquer */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleResetDefault}
            className="py-2.5 px-3 bg-[#131838] hover:bg-[#1a214d] border border-[#222c5e] text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Défaut</span>
          </button>

          <button
            onClick={() => alert('Configuration exportée.')}
            className="py-2.5 px-3 bg-[#131838] hover:bg-[#1a214d] border border-[#222c5e] text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>

          <button
            onClick={handleApply}
            className="col-span-2 py-3 px-4 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] hover:from-[#2a45c7] hover:to-[#4e6df5] text-white rounded-xl text-xs font-extrabold transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{savedSuccess ? 'Modifications Appliquées !' : '✓ Appliquer'}</span>
          </button>
        </div>
      </div>

      {/* Right Column matching Photo 1 */}
      <div className="lg:col-span-7">
        {activeSubTab === 'voix' && (
          <div className="p-6 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-black text-white">
                    Choix de la Voix & Synthèse Vocale
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 font-mono">
                  Gratuit & Illimité
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sélectionnez et testez en direct la voix masculine ou féminine utilisée par Andrea pour la lecture vocale.
              </p>
            </div>

            {/* Sélection de la Voix */}
            <div className="space-y-3 pt-2 border-t border-[#202959]">
              <label className="text-xs font-extrabold text-slate-200 block">
                Sélection de la Voix :
              </label>

              <div className="flex items-center gap-6 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                  <input
                    type="radio"
                    name="voiceGender"
                    checked={voiceGender === 'female'}
                    onChange={() => setVoiceGender('female')}
                    className="accent-[#3a58e8] w-4 h-4 cursor-pointer"
                  />
                  <span>Voix Féminine (Par défaut)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                  <input
                    type="radio"
                    name="voiceGender"
                    checked={voiceGender === 'male'}
                    onChange={() => setVoiceGender('male')}
                    className="accent-[#3a58e8] w-4 h-4 cursor-pointer"
                  />
                  <span>Voix Masculine</span>
                </label>
              </div>
            </div>

            {/* Test d'Écoute en Direct */}
            <div className="space-y-3 pt-2 border-t border-[#202959]">
              <label className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Test d'Écoute en Direct</span>
              </label>

              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">Phrase à faire prononcer à Andrea :</span>
                <input
                  type="text"
                  value={testPhrase}
                  onChange={(e) => setTestPhrase(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#171e47] border border-[#28346e] rounded-xl text-xs text-white focus:outline-none focus:border-[#4255b3]"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleTestVoice()}
                  disabled={isPlayingAudio}
                  className="px-4 py-2 bg-[#2036a1] hover:bg-[#2b44bf] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>
                    {isPlayingAudio
                      ? 'Lecture en cours...'
                      : `Tester la voix ${voiceGender === 'female' ? 'féminine' : 'masculine'} d'Andrea`}
                  </span>
                </button>

                <button
                  onClick={() => handleTestVoice("Bienvenue sur Andrea, votre intelligence comportementale et créative.")}
                  className="px-4 py-2 bg-[#171e47] hover:bg-[#242e6b] text-slate-200 text-xs font-bold rounded-xl border border-[#28346e] transition-all cursor-pointer"
                >
                  Message d'accueil
                </button>
              </div>
            </div>

            {/* Sliders matching Photo 1 */}
            <div className="space-y-4 pt-2 border-t border-[#202959]">
              {/* Pitch */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Tonalité (Pitch)</span>
                  <span className="font-mono text-sky-400">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-[#3a58e8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Plus grave</span>
                  <span>Neutre (1.0)</span>
                  <span>Plus aiguë</span>
                </div>
              </div>

              {/* Speed */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Vitesse d'élocution (Speed)</span>
                  <span className="font-mono text-indigo-400">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.40"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#3a58e8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.75x (Lent)</span>
                  <span>1.0x (Naturel)</span>
                  <span>1.4x (Rapide)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'style' && (
          <div className="p-6 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Posture & Personnalité d'Andrea</h3>
            <p className="text-slate-300">Définissez la manière dont Andrea cadre ses réponses et analyse vos défis.</p>
            <div className="space-y-2">
              <label className="font-bold text-white block">Posture privilégiée :</label>
              <select
                value={posture}
                onChange={(e) => setPosture(e.target.value)}
                className="w-full p-3 bg-[#171e47] border border-[#28346e] rounded-xl text-white"
              >
                <option value="Stratégique & Orienté Action">Stratégique & Orienté Action</option>
                <option value="Pédagogue & Méthodique">Pédagogue & Méthodique</option>
                <option value="Direct & Minimaliste">Direct & Minimaliste</option>
              </select>
            </div>
          </div>
        )}

        {activeSubTab === 'web' && (
          <div className="p-6 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Capacités Web & Moteurs Multimodaux</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-[#171e47] rounded-xl cursor-pointer">
                <span className="font-bold text-white">Moteur Vidéo Wan 2.1 (9:16)</span>
                <input
                  type="checkbox"
                  checked={enableWanVideo}
                  onChange={(e) => setEnableWanVideo(e.target.checked)}
                  className="w-4 h-4 accent-[#3a58e8]"
                />
              </label>
              <label className="flex items-center justify-between p-3 bg-[#171e47] rounded-xl cursor-pointer">
                <span className="font-bold text-white">Recherche Web & Analyse en direct</span>
                <input
                  type="checkbox"
                  checked={enableWebSearch}
                  onChange={(e) => setEnableWebSearch(e.target.checked)}
                  className="w-4 h-4 accent-[#3a58e8]"
                />
              </label>
            </div>
          </div>
        )}

        {activeSubTab === 'donnees' && (
          <div className="p-6 rounded-3xl bg-[#0f1433] border border-[#202959] space-y-4 text-xs">
            <h3 className="text-base font-black text-white">Données & Sécurité Locale</h3>
            <p className="text-slate-300">Vos conversations et vidéos sont traitées en local et sur API gratuites protégées.</p>
            <button
              onClick={() => alert('Historique local vidé.')}
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
