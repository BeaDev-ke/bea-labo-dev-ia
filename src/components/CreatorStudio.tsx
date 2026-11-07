import React, { useState, useRef } from 'react';
import {
  Film,
  Upload,
  Scissors,
  Sparkles,
  Download,
  Image as ImageIcon,
  Subtitles,
  Music,
  Type,
  Wand2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Play
} from 'lucide-react';
import { StudioSectionId, VideoScene, PlanType } from '../types';
import { MontageStudio } from './MontageStudio';
import { generateImageFlux } from '../services/videoService';
import { generateWhisperSubtitles } from '../services/voiceService';

interface CreatorStudioProps {
  activeSection: StudioSectionId;
  plan: PlanType;
  onOpenSection: (sec: StudioSectionId) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  activeSection,
  plan,
  onOpenSection,
}) => {
  // Visual Studio state (Flux.1 Schnell)
  const [visualPrompt, setVisualPrompt] = useState('Un studio d\'enregistrement moderne et futuriste baigné de néons violets et bleus profonds, atmosphère créative et épurée');
  const [visualStyle, setVisualStyle] = useState('general');
  const [visualRatio, setVisualRatio] = useState<'1:1' | '9:16' | '16:9' | '4:5'>('9:16');
  const [applyGradient, setApplyGradient] = useState(true);
  const [applyLogo, setApplyLogo] = useState(true);
  const [doUpscale, setDoUpscale] = useState(true);
  const [generatedVisualUrl, setGeneratedVisualUrl] = useState<string | null>(null);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const [visualHistory, setVisualHistory] = useState<Array<{ url: string; prompt: string; format: string }>>([]);

  // Subtitles generator state
  const [subText, setSubText] = useState('Dans cette vidéo je vous dévoile le secret ultime de productivité comportementale.');
  const [subSrt, setSubSrt] = useState<string | null>(null);
  const [isGeneratingSub, setIsGeneratingSub] = useState(false);

  // Thumbnail generator state
  const [thumbTitle, setThumbTitle] = useState("J'ai arrêté de procrastiner en 7 jours");
  const [thumbSub, setThumbSub] = useState("La méthode de psychologie comportementale");
  const [thumbStyle, setThumbStyle] = useState<'neon' | 'cyber' | 'sunset' | 'emerald'>('cyber');
  const [thumbResult, setThumbResult] = useState<string | null>(null);

  // Montage plan state
  const [planSubject, setPlanSubject] = useState("3 astuces pour doubler sa concentration quotidienne");
  const [planPlatform, setPlanPlatform] = useState("TikTok 9:16");
  const [planDuration, setPlanDuration] = useState("60 s");
  const [planResult, setPlanResult] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Composer state
  const [compTitle, setCompTitle] = useState('La Clé du Passage à l\'Action');
  const [compSubtitle, setCompSubtitle] = useState('Arrêtez d\'attendre la motivation : créez le momentum dès aujourd\'hui.');
  const [compLayout, setCompLayout] = useState<'Hero photo' | 'Grille 2×2' | 'Collage éditorial'>('Hero photo');
  const [compFormat, setCompFormat] = useState('Format Vertical (9:16)');
  const [compAccent, setCompAccent] = useState('#5A33FF');
  const [compBg, setCompBg] = useState('#0F0E1E');

  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    try {
      const url = await generateImageFlux(visualPrompt);
      setGeneratedVisualUrl(url);
      setVisualHistory((prev) => [{ url, prompt: visualPrompt, format: visualRatio }, ...prev]);
    } catch {
      // fallback
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleGenerateSubtitles = async () => {
    setIsGeneratingSub(true);
    try {
      const res = await generateWhisperSubtitles(subText, 5);
      setSubSrt(res.srtContent);
    } finally {
      setIsGeneratingSub(false);
    }
  };

  const handleGenerateThumbnail = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      if (thumbStyle === 'neon') {
        grad.addColorStop(0, '#0f0a1e');
        grad.addColorStop(1, '#a855f7');
      } else if (thumbStyle === 'cyber') {
        grad.addColorStop(0, '#080d1a');
        grad.addColorStop(1, '#38bdf8');
      } else if (thumbStyle === 'sunset') {
        grad.addColorStop(0, '#1c0d1b');
        grad.addColorStop(1, '#fb7185');
      } else {
        grad.addColorStop(0, '#061612');
        grad.addColorStop(1, '#34d399');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(thumbTitle.slice(0, 45), 70, 320);

      ctx.fillStyle = '#c4b5fd';
      ctx.font = '32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(thumbSub.slice(0, 60), 70, 420);

      setThumbResult(canvas.toDataURL('image/png'));
    }
  };

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      setPlanResult(
        `# Plan de Montage Vidéo : ${planSubject}\n\n` +
        `**Format :** ${planPlatform} | **Durée :** ${planDuration}\n\n` +
        `### 1. Accroche / Hook (0-3s)\n` +
        `- **Visuel :** Crash Zoom ou Travelling Avant rapide sur le visage.\n` +
        `- **Audio :** "Si tu attends la motivation pour agir, regarde cette vidéo avant ce soir."\n` +
        `- **Sous-titre Whisper :** Gros caractères jaunes centrés au milieu de l'écran.\n\n` +
        `### 2. Développement & Découpage (3-45s)\n` +
        `- **Scène 01 (3-15s) :** Le piège de la friction mentale. Incrustation texte : ❌ ERREUR COMMUNE.\n` +
        `- **Scène 02 (15-30s) :** La règle des 2 minutes et du momentum. Effet son impact.\n` +
        `- **Scène 03 (30-45s) :** La preuve concrète et résultat immédiat.\n\n` +
        `### 3. Appel à l'Action / Outro (45-60s)\n` +
        `- **Audio :** "Enregistre ce reel et commence ta première étape dès maintenant."\n` +
        `- **Miniature recommandée :** Visuel avec titre percutant en contraste.`
      );
      setIsGeneratingPlan(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* 1. Importer un média & Découpage en Scènes */}
      {activeSection === 'importer' && (
        <div className="space-y-4">
          <MontageStudio />
        </div>
      )}

      {/* 2. Visuals Flux 1 Schnell gratuit (matching Bea Studio Visuel) */}
      {activeSection === 'visuel_flux' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#8B70FF]" />
              <h2 className="text-xl font-bold text-white">
                🎨 Bea Studio Visuel — Moteur Graphique IA (Flux.1 Schnell)
              </h2>
            </div>
            <p className="text-xs text-[#c4b5fd]">
              Générez des miniatures percutantes, des visuels de haute qualité 8K et des illustrations optimisées avec la signature BehaviorLab AI sans clé payante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#c4b5fd] uppercase mb-1.5">
                  Description de votre image (Prompt)
                </label>
                <textarea
                  rows={3}
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  className="w-full p-3 bg-[#201844] border border-[#5A33FF44] rounded-xl text-sm text-white focus:outline-none focus:border-[#8B70FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#c4b5fd] mb-1">Style Visuel</label>
                  <select
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-white outline-none"
                  >
                    <option value="general">✨ Général & Réaliste (8K)</option>
                    <option value="beaute">💄 Beauté & Cosmétiques</option>
                    <option value="produit">📦 Produit Commercial Studio</option>
                    <option value="mode">👗 Mode & Éditorial Vogue</option>
                    <option value="cinema">🎬 Cinématique 35mm</option>
                    <option value="illustration">🎨 Illustration Digitale</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#c4b5fd] mb-1">Format & Ratio</label>
                  <select
                    value={visualRatio}
                    onChange={(e) => setVisualRatio(e.target.value as any)}
                    className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-white outline-none"
                  >
                    <option value="9:16">9:16 (TikTok / Reels / Shorts)</option>
                    <option value="1:1">1:1 (Carré Instagram)</option>
                    <option value="16:9">16:9 (YouTube / Miniature)</option>
                    <option value="4:5">4:5 (Portrait Feed)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-[#201844] rounded-xl border border-[#5A33FF33] space-y-2 text-xs">
                <div className="font-bold text-white">🛡️ Signature & Rendu Bea</div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyGradient}
                    onChange={(e) => setApplyGradient(e.target.checked)}
                    className="accent-[#8B70FF]"
                  />
                  <span>Dégradé subtil Bea (#1E1B8C → #5A33FF)</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyLogo}
                    onChange={(e) => setApplyLogo(e.target.checked)}
                    className="accent-[#8B70FF]"
                  />
                  <span>Badge Andrea / Bea AI discret</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doUpscale}
                    onChange={(e) => setDoUpscale(e.target.checked)}
                    className="accent-[#8B70FF]"
                  />
                  <span>Amélioration de netteté (Upscale HD)</span>
                </label>
              </div>

              <button
                onClick={handleGenerateVisual}
                disabled={isGeneratingVisual || !visualPrompt.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2521a8] hover:to-[#6a44ff] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#5A33FF44] cursor-pointer flex items-center justify-center gap-2"
              >
                {isGeneratingVisual ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Génération Flux 1 Schnell...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>🚀 Générer le visuel</span>
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] flex flex-col items-center justify-center min-h-[400px]">
              {generatedVisualUrl ? (
                <div className="w-full space-y-3 flex flex-col items-center animate-in fade-in">
                  <div
                    className={`rounded-xl overflow-hidden border border-[#5A33FF55] shadow-2xl relative ${
                      visualRatio === '9:16' ? 'w-[240px] aspect-[9/16]' : 'w-full max-w-[320px] aspect-square'
                    }`}
                  >
                    <img src={generatedVisualUrl} alt="Visual" className="w-full h-full object-cover" />
                    {applyLogo && (
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#0F0E1E]/90 border border-[#5A33FF] text-[10px] font-bold text-white">
                        Andrea AI
                      </div>
                    )}
                  </div>
                  <a
                    href={generatedVisualUrl}
                    download="andrea_visuel.png"
                    className="w-full py-2.5 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold rounded-xl text-xs text-center shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>⬇️ Télécharger en HD (PNG)</span>
                  </a>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400">
                  <ImageIcon className="w-12 h-12 text-[#8B70FF] mx-auto mb-3" />
                  <p className="text-xs">Le visuel généré s'affichera ici avec le ratio choisi.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Composer (Canvas publication matching Python) */}
      {activeSection === 'composer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33]">
            <h2 className="text-xl font-bold text-white mb-1">
              🎨 Composer — Studio de Design Visuel
            </h2>
            <p className="text-xs text-[#c4b5fd]">
              Canvas central, modèles, photos et formats de publication sociale (Instagram, TikTok, YouTube).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#c4b5fd] mb-1">Format</label>
                <select
                  value={compFormat}
                  onChange={(e) => setCompFormat(e.target.value)}
                  className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white"
                >
                  <option>Format Vertical (9:16)</option>
                  <option>Format Carré (1:1)</option>
                  <option>Format Paysage (16:9)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c4b5fd] mb-1">Titre de la publication</label>
                <input
                  type="text"
                  value={compTitle}
                  onChange={(e) => setCompTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#c4b5fd] mb-1">Sous-titre / Promesse</label>
                <textarea
                  rows={2}
                  value={compSubtitle}
                  onChange={(e) => setCompSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-[#c4b5fd] mb-1">Couleur d'accent</label>
                  <input
                    type="color"
                    value={compAccent}
                    onChange={(e) => setCompAccent(e.target.value)}
                    className="w-full h-9 rounded-lg bg-transparent cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#c4b5fd] mb-1">Couleur de fond</label>
                  <input
                    type="color"
                    value={compBg}
                    onChange={(e) => setCompBg(e.target.value)}
                    className="w-full h-9 rounded-lg bg-transparent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Canvas Preview */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] flex flex-col items-center justify-center">
              <div
                className="w-full max-w-[280px] aspect-[9/16] rounded-2xl p-5 flex flex-col justify-between shadow-2xl border border-white/10"
                style={{ backgroundColor: compBg }}
              >
                <div className="w-full h-44 rounded-xl bg-gradient-to-tr from-[#1E1B8C] to-[#5A33FF] flex items-center justify-center text-white text-xs font-bold">
                  Photo / Visuel
                </div>
                <div className="p-4 rounded-xl bg-[#101522]/90 border border-[#5A33FF33] space-y-2">
                  <h4 className="font-extrabold text-sm text-white leading-tight">{compTitle}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{compSubtitle}</p>
                  <div
                    className="inline-block px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow"
                    style={{ backgroundColor: compAccent }}
                  >
                    Découvrir
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sous-titres automatiques (Whisper) */}
      {activeSection === 'sous_titres' && (
        <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Subtitles className="w-5 h-5 text-[#8B70FF]" />
            <h2 className="text-xl font-bold text-white">💬 Sous-titres Automatiques (Whisper)</h2>
          </div>
          <p className="text-xs text-[#c4b5fd]">
            Transcription automatique par IA avec horodatage exact. Exportation standard aux formats SRT et VTT pour logiciels de montage.
          </p>

          <textarea
            rows={3}
            value={subText}
            onChange={(e) => setSubText(e.target.value)}
            placeholder="Texte de la vidéo..."
            className="w-full p-3 bg-[#201844] border border-[#5A33FF44] rounded-xl text-sm text-white"
          />

          <button
            onClick={handleGenerateSubtitles}
            disabled={isGeneratingSub}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
          >
            {isGeneratingSub ? 'Transcription...' : 'Générer les Sous-titres Whisper'}
          </button>

          {subSrt && (
            <div className="mt-4 p-4 rounded-xl bg-[#201844] border border-[#5A33FF44] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Fichier SRT généré :</span>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(subSrt)}`}
                  download="sous_titres.srt"
                  className="px-3 py-1 bg-sky-600 text-white font-bold rounded-lg flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Télécharger .SRT</span>
                </a>
              </div>
              <pre className="font-mono text-xs text-amber-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                {subSrt}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* 5. Miniature 1280x720 */}
      {activeSection === 'miniature' && (
        <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-5 h-5 text-[#8B70FF]" />
            <h2 className="text-xl font-bold text-white">🖼️ Miniature 1280×720</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#c4b5fd] mb-1">Titre principal</label>
              <input
                type="text"
                value={thumbTitle}
                onChange={(e) => setThumbTitle(e.target.value)}
                className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-white"
              />
            </div>
            <div>
              <label className="block font-bold text-[#c4b5fd] mb-1">Style de palette</label>
              <select
                value={thumbStyle}
                onChange={(e) => setThumbStyle(e.target.value as any)}
                className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-white"
              >
                <option value="cyber">Cyber (#38bdf8)</option>
                <option value="neon">Néon (#a855f7)</option>
                <option value="sunset">Sunset (#fb7185)</option>
                <option value="emerald">Emerald (#34d399)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateThumbnail}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
          >
            Générer la miniature
          </button>

          {thumbResult && (
            <div className="mt-4 space-y-2">
              <img src={thumbResult} alt="Thumbnail" className="w-full rounded-xl border border-[#5A33FF44]" />
              <a
                href={thumbResult}
                download="miniature_1280x720.png"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white font-bold rounded-xl text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger PNG 1280×720</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* 6. Plan de Montage IA */}
      {activeSection === 'plan_ia' && (
        <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Film className="w-5 h-5 text-[#8B70FF]" />
            <h2 className="text-xl font-bold text-white">🎬 Plan de Montage IA</h2>
          </div>
          <textarea
            rows={3}
            value={planSubject}
            onChange={(e) => setPlanSubject(e.target.value)}
            className="w-full p-3 bg-[#201844] border border-[#5A33FF44] rounded-xl text-sm text-white"
          />
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#c4b5fd] mb-1">Plateforme</label>
              <select
                value={planPlatform}
                onChange={(e) => setPlanPlatform(e.target.value)}
                className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-white"
              >
                <option>TikTok 9:16</option>
                <option>Instagram Reels 9:16</option>
                <option>YouTube Shorts 9:16</option>
                <option>YouTube 16:9 Long</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#c4b5fd] mb-1">Durée visée</label>
              <select
                value={planDuration}
                onChange={(e) => setPlanDuration(e.target.value)}
                className="w-full p-2.5 bg-[#201844] border border-[#5A33FF44] rounded-xl text-white"
              >
                <option>15 s</option>
                <option>30 s</option>
                <option>60 s</option>
                <option>3 min</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isGeneratingPlan}
            className="px-6 py-2.5 bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
          >
            {isGeneratingPlan ? 'Calcul du plan...' : 'Générer le plan de montage'}
          </button>

          {planResult && (
            <div className="mt-4 p-5 rounded-xl bg-[#201844] border border-[#5A33FF44] text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
              {planResult}
            </div>
          )}
        </div>
      )}

      {/* Fallback for other sections (Audio, Texte, Effets, Transitions, etc.) */}
      {['audio', 'texte', 'effets', 'transitions', 'filtres', 'ajustement', 'autocollants', 'modeles'].includes(
        activeSection
      ) && (
        <div className="p-6 rounded-2xl bg-[#1A1930] border border-[#5A33FF33] space-y-3 text-xs">
          <h3 className="text-base font-bold text-white capitalize">
            Module {activeSection}
          </h3>
          <p className="text-slate-300">
            Ce module permet de peaufiner les rushes et d'ajuster les pistes audio, sous-titres et effets de transition.
          </p>
          <div className="p-4 bg-[#201844] rounded-xl border border-[#5A33FF33] text-[#c4b5fd]">
            Glissez une vidéo dans <strong>📂 Importer & Découpage Scènes</strong> pour activer le traitement complet.
          </div>
        </div>
      )}
    </div>
  );
};
