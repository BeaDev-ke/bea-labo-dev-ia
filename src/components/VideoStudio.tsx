import React, { useState } from 'react';
import { Video, Camera, Sparkles, RefreshCw, Wand2, Download, Subtitles, Play, Image as ImageIcon, Bot } from 'lucide-react';
import { CameraMovementId, VideoGenerationResult } from '../types';
import { CAMERA_MOVEMENTS, generateVideo, generateImageFlux, generateTalkingAvatar } from '../services/videoService';
import { generateVoice, generateWhisperSubtitles } from '../services/voiceService';
import { VideoPlayer916 } from './VideoPlayer916';

export const VideoStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('Parfum haute couture flacon en verre ambré lévitant dans un faisceau de lumière dorée');
  const [selectedMovement, setSelectedMovement] = useState<CameraMovementId>('orbit');
  const [voiceText, setVoiceText] = useState("Une fragrance intemporelle conçue pour marquer les mémoires.");
  const [withVoice, setWithVoice] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [queueStatus, setQueueStatus] = useState<string | null>(null);
  const [result, setResult] = useState<VideoGenerationResult | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setQueueStatus('Initialisation de la génération Wan 2.1...');

    try {
      // 1. Video generation
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

      // 2. Audio & Subtitles
      if (withVoice && voiceText.trim()) {
        setQueueStatus('Génération voix off F5-TTS SWIVID...');
        const voiceRes = await generateVoice({ text: voiceText }, (s) => setQueueStatus(s));
        audioUrl = voiceRes.audioUrl;

        setQueueStatus('Alignement des sous-titres Whisper...');
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
      setQueueStatus(`file d'attente gratuite saturée réessaye dans deux minutes avec un fallback (${msg})`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Camera className="w-5 h-5 text-sky-400" />
          <h2 className="text-xl font-bold text-white">Studio Vidéo Wan 2.1 & Mouvements Caméra</h2>
        </div>
        <p className="text-sm text-slate-400">
          Moteur vidéo gratuit sans data center : Wan 2.1 en principal avec repli automatique sur CogVideoX 5B et AnimateDiff SD 1.5, enrichi par la bibliothèque de 10 mouvements cinéma style Higgsfield.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Prompt de la scène (Wan 2.1)
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez précisément votre scène, les textures, l'ambiance et la lumière..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* 10 Camera Movements (Higgsfield Style) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mouvement Caméra Cinéma (10 mouvements Higgsfield)
              </label>
              <span className="text-[11px] text-sky-400 font-mono">
                {CAMERA_MOVEMENTS.find(m => m.id === selectedMovement)?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CAMERA_MOVEMENTS.map((move) => {
                const isSelected = selectedMovement === move.id;
                return (
                  <button
                    key={move.id}
                    onClick={() => setSelectedMovement(move.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500 text-white shadow-sm ring-1 ring-sky-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{move.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{move.frenchName}</div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-slate-400 italic">
              {CAMERA_MOVEMENTS.find(m => m.id === selectedMovement)?.description}
            </p>
          </div>

          {/* Voiceover & Subtitles toggle */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                <input
                  type="checkbox"
                  checked={withVoice}
                  onChange={(e) => setWithVoice(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-sky-500"
                />
                <span>Ajouter Voix Off Humaine (F5-TTS Swivid) & Sous-titres Whisper</span>
              </label>
              <span className="text-[11px] text-amber-400 font-mono">Format 9:16 Shorts</span>
            </div>

            {withVoice && (
              <div>
                <input
                  type="text"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Texte de la voix off synchronisée..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Generation Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Génération Wan 2.1 en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Lancer le Rendu Vidéo 9:16</span>
              </>
            )}
          </button>

          {/* Queue Status Notice */}
          {queueStatus && (
            <div className="p-3 bg-slate-950 border border-sky-500/40 rounded-xl text-xs text-sky-300">
              {queueStatus}
            </div>
          )}
        </div>

        {/* Right Column: 9:16 Live Player Output */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[500px]">
          {result ? (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              <span className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Rendu 9:16 Prêt pour Export
              </span>
              <VideoPlayer916 video={result} autoPlay={true} />
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500 max-w-xs">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Aperçu Vidéo 9:16</h3>
              <p className="text-xs text-slate-400">
                Configurez votre prompt et votre mouvement caméra pour afficher la vidéo Wan 2.1 avec voix off et sous-titres Whisper synchronisés.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
