import React, { useState } from 'react';
import { Video, Camera, Sparkles, RefreshCw } from 'lucide-react';
import { CameraMovementId, VideoGenerationResult } from '../types';
import { CAMERA_MOVEMENTS, generateVideo } from '../services/videoService';
import { generateVoice, generateWhisperSubtitles } from '../services/voiceService';
import { VideoPlayer916 } from './VideoPlayer916';

export const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('Flacon ambré flottant dans une lumière dorée studio');
  const [selectedMovement, setSelectedMovement] = useState<CameraMovementId>('orbit');
  const [voiceText, setVoiceText] = useState('Une création intemporelle conçue pour marquer les esprits.');
  const [withVoice, setWithVoice] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [queueStatus, setQueueStatus] = useState<string | null>(null);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setQueueStatus('Initialisation de la génération vidéo...');

    try {
      const vidResult = await generateVideo(
        {
          prompt,
          cameraMovement: selectedMovement,
          aspectRatio: '9:16',
          durationSeconds: 4,
        },
        (s) => setQueueStatus(s)
      );

      let audioUrl: string | undefined;
      let srtContent: string | undefined;
      let cues = undefined;

      if (withVoice && voiceText.trim()) {
        setQueueStatus('Synthèse de la voix off...');
        const voiceRes = await generateVoice({ text: voiceText }, (s) => setQueueStatus(s));
        audioUrl = voiceRes.audioUrl;

        setQueueStatus('Synchronisation des sous-titres...');
        const whisperRes = await generateWhisperSubtitles(voiceText, vidResult.duration || 4);
        cues = whisperRes.cues;
        srtContent = whisperRes.srtContent;
      }

      setResult({
        ...vidResult,
        audioUrl,
        subtitles: cues,
        srtContent,
        hookText: withVoice ? voiceText : undefined,
      });
      setQueueStatus(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de génération';
      setQueueStatus(`File d'attente saturée, réessayez dans quelques instants (${msg})`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      <div className="shrink-0 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-0.5">
          <Camera className="w-5 h-5 text-sky-400" />
          <h2 className="text-lg font-bold text-white">Studio Vidéo 9:16 & Mouvements Caméra</h2>
        </div>
        <p className="text-xs text-slate-400">
          Génération vidéo verticale avec 10 trajectoires cinéma, voix off naturelle et sous-titres synchronisés.
        </p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-3 overflow-hidden">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description de la scène</label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-300">Mouvement Caméra Cinéma</span>
              <span className="text-sky-400 font-mono">{CAMERA_MOVEMENTS.find((m) => m.id === selectedMovement)?.name}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {CAMERA_MOVEMENTS.map((move) => (
                <button
                  key={move.id}
                  onClick={() => setSelectedMovement(move.id)}
                  className={`p-2 rounded-xl border text-left cursor-pointer ${
                    selectedMovement === move.id
                      ? 'bg-sky-500/15 border-sky-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">{move.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
              <input type="checkbox" checked={withVoice} onChange={(e) => setWithVoice(e.target.checked)} />
              <span>Ajouter Voix Off & Sous-titres synchronisés</span>
            </label>
            {withVoice && (
              <input
                type="text"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              />
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'Génération en cours...' : 'Lancer le Rendu Vidéo 9:16'}</span>
          </button>

          {queueStatus && (
            <div className="p-2.5 bg-slate-950 border border-sky-500/40 rounded-xl text-xs text-sky-300">{queueStatus}</div>
          )}
        </div>

        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden">
          {result ? (
            <VideoPlayer916 video={result} autoPlay={true} />
          ) : (
            <div className="text-center p-6 text-slate-500">
              <Video className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <h3 className="text-sm font-semibold text-white">Aperçu Vidéo 9:16</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
