import React, { useState } from 'react';
import { Mic, Volume2, Subtitles, Download, Sparkles, RefreshCw, Play, Check } from 'lucide-react';
import { generateVoice, generateWhisperSubtitles } from '../services/voiceService';
import { SubtitleCue } from '../types';

export const VoiceStudio: React.FC = () => {
  const [text, setText] = useState("Bienvenue dans le futur de la création vidéo automatisée par intelligence artificielle.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [srtContent, setSrtContent] = useState<string | null>(null);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setStatus('Appel à F5-TTS (SWIVID sur Hugging Face)...');

    try {
      const voiceRes = await generateVoice({ text }, (s) => setStatus(s));
      setAudioUrl(voiceRes.audioUrl);
      setProviderUsed(voiceRes.providerUsed);

      setStatus('Génération des sous-titres Whisper auto...');
      const whisperRes = await generateWhisperSubtitles(text, voiceRes.duration);
      setCues(whisperRes.cues);
      setSrtContent(whisperRes.srtContent);

      setStatus(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setStatus(`file d'attente gratuite saturée réessaye dans deux minutes avec un fallback (${msg})`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSrt = () => {
    if (!srtContent) return;
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whisper-subtitles-${Date.now()}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Mic className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl font-bold text-white">Voix Off Humaine F5-TTS & Sous-Titres Whisper</h2>
        </div>
        <p className="text-sm text-slate-400">
          Synthèse vocale réaliste en français sans API payante : F5-TTS (Swivid) en modèle principal, Coqui XTTS-v2 en repli et transcription automatique Whisper au format standard .SRT.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Texte à vocaliser (Voix Off Française)
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tapez le script de la voix off..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Génération en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Générer Voix F5-TTS & Sous-titres Whisper</span>
              </>
            )}
          </button>

          {status && (
            <div className="p-3 bg-slate-950 border border-sky-500/30 rounded-xl text-xs text-sky-300">
              {status}
            </div>
          )}
        </div>

        {/* Right: Output Player & Subtitles breakdown */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          {audioUrl ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    Lecture Audio
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{providerUsed}</span>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>

              {/* Subtitles Cues list */}
              {cues.length > 0 && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs flex items-center gap-2">
                      <Subtitles className="w-4 h-4 text-amber-400" />
                      Sous-Titres Whisper ({cues.length} segments)
                    </span>
                    <button
                      onClick={downloadSrt}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Télécharger .SRT</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {cues.map((cue) => (
                      <div
                        key={cue.id}
                        className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-mono text-[11px] text-sky-400">
                          {cue.startTime.toFixed(2)}s - {cue.endTime.toFixed(2)}s
                        </span>
                        <span className="font-bold text-amber-300 tracking-wide uppercase">
                          {cue.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-12 text-slate-500">
              <Mic className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="text-xs text-slate-400">
                Générez la voix off pour écouter le résultat audio F5-TTS et inspecter les sous-titres Whisper découpés au format TikTok / Reels.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
