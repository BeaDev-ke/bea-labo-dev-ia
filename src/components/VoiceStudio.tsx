import React, { useState } from 'react';
import { Mic, Volume2, Subtitles, Download, Sparkles, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateVoice, generateWhisperSubtitles } from '../services/voiceService';
import { SubtitleCue } from '../types';

export const VoiceStudio: React.FC = () => {
  const [text, setText] = useState('Bienvenue dans votre studio de voix off et sous-titres synchronisés.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [cues, setCues] = useState<SubtitleCue[]>([]);
  const [srtContent, setSrtContent] = useState<string | null>(null);
  const [cuePage, setCuePage] = useState(0);

  const handleGenerate = async () => {
    if (!text.trim() || isGenerating) return;
    setIsGenerating(true);
    setStatus('Synthèse vocale en cours...');

    try {
      const voiceRes = await generateVoice({ text }, (s) => setStatus(s));
      setAudioUrl(voiceRes.audioUrl);
      const subRes = await generateWhisperSubtitles(text, voiceRes.duration);
      setCues(subRes.cues);
      setSrtContent(subRes.srtContent);
      setCuePage(0);
      setStatus(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setStatus(`File d'attente saturée (${msg})`);
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
    a.download = `sous-titres-${Date.now()}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const CUES_PER_PAGE = 4;
  const totalCuePages = Math.max(1, Math.ceil(cues.length / CUES_PER_PAGE));
  const visibleCues = cues.slice(cuePage * CUES_PER_PAGE, cuePage * CUES_PER_PAGE + CUES_PER_PAGE);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="shrink-0 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-0.5">
          <Mic className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">Voix Off Humaine & Sous-Titres</h2>
        </div>
        <p className="text-xs text-slate-400">Synthèse vocale naturelle et export des sous-titres au format .SRT.</p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Script à vocaliser</label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none resize-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'Génération...' : 'Générer Voix & Sous-titres'}</span>
          </button>
          {status && <div className="p-2.5 bg-slate-950 border border-sky-500/30 rounded-xl text-xs text-sky-300">{status}</div>}
        </div>

        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 overflow-hidden">
          {audioUrl ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-white">
                  <Volume2 className="w-4 h-4 text-sky-400" />
                  <span>Lecture Audio</span>
                </div>
                <audio controls src={audioUrl} className="w-full" />
              </div>

              {cues.length > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Subtitles className="w-4 h-4 text-amber-400" />
                      <span>Sous-titres ({cues.length})</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {totalCuePages > 1 && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setCuePage((p) => Math.max(0, p - 1))} disabled={cuePage === 0} className="p-1 rounded bg-slate-800 disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-3 h-3" /></button>
                          <button onClick={() => setCuePage((p) => Math.min(totalCuePages - 1, p + 1))} disabled={cuePage >= totalCuePages - 1} className="p-1 rounded bg-slate-800 disabled:opacity-30 cursor-pointer"><ChevronRight className="w-3 h-3" /></button>
                        </div>
                      )}
                      <button onClick={downloadSrt} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg font-mono flex items-center gap-1 cursor-pointer">
                        <Download className="w-3 h-3 text-amber-400" />
                        <span>.SRT</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {visibleCues.map((cue) => (
                      <div key={cue.id} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] text-sky-400 tabular-nums">
                          {cue.startTime.toFixed(2)}s - {cue.endTime.toFixed(2)}s
                        </span>
                        <span className="font-bold text-amber-300 uppercase">{cue.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-10 text-slate-500 my-auto">
              <Mic className="w-9 h-9 mx-auto mb-2 text-slate-600" />
              <p className="text-xs text-slate-400">Générez la voix off pour écouter le rendu audio et exporter les sous-titres.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
