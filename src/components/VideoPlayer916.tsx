import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Subtitles, RotateCcw, Video, Maximize2 } from 'lucide-react';
import { SubtitleCue, VideoGenerationResult } from '../types';

interface VideoPlayer916Props {
  video: VideoGenerationResult;
  autoPlay?: boolean;
}

export const VideoPlayer916: React.FC<VideoPlayer916Props> = ({ video, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 4);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      if (audioRef.current) {
        audioRef.current.currentTime = videoRef.current.currentTime;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Sync active subtitle from Whisper cues
    if (video.subtitles && video.subtitles.length > 0) {
      const activeCue = video.subtitles.find(
        (cue: SubtitleCue) => time >= cue.startTime && time <= cue.endTime
      );
      setCurrentSubtitle(activeCue ? activeCue.text : '');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (audioRef.current) audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const restart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(true);
    }
  };

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = `bea-labo-${video.id}-9x16.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSrt = () => {
    if (!video.srtContent) return;
    const blob = new Blob([video.srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bea-labo-${video.id}-subtitles.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center">
      {/* 9:16 Vertical Container */}
      <div className="relative w-[270px] sm:w-[300px] aspect-[9/16] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group select-none">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover cursor-pointer"
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration || video.duration || 4);
          }}
          onClick={togglePlay}
        />

        {/* Separate Audio Track if present */}
        {video.audioUrl && (
          <audio ref={audioRef} src={video.audioUrl} loop muted={isMuted} />
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] font-semibold text-white border border-white/10">
            <Video className="w-3.5 h-3.5 text-sky-400" />
            <span>Wan 2.1 · 9:16</span>
          </div>

          {video.cameraMovement && (
            <div className="px-2 py-1 bg-sky-950/80 border border-sky-500/30 backdrop-blur-md rounded-md text-[10px] font-mono text-sky-300">
              {video.cameraMovement.name}
            </div>
          )}
        </div>

        {/* Live Subtitle Overlay (Whisper SRT formatted for 9:16 shorts) */}
        {showSubtitles && currentSubtitle && (
          <div className="absolute bottom-20 left-4 right-4 flex justify-center text-center pointer-events-none z-20 animate-in fade-in zoom-in-95 duration-150">
            <span className="px-3.5 py-1.5 bg-black/85 backdrop-blur-sm rounded-lg text-amber-300 font-extrabold text-sm sm:text-base tracking-wide uppercase border border-amber-400/40 shadow-lg">
              {currentSubtitle}
            </span>
          </div>
        )}

        {/* Play/Pause Center Indicator on Hover or Paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-all z-20 cursor-pointer shadow-xl"
            aria-label="Lire la vidéo"
          >
            <Play className="w-6 h-6 ml-1 fill-white" />
          </button>
        )}

        {/* Bottom Control Bar on Hover / Focus */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 z-20 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Progress Slider */}
          <input
            type="range"
            min="0"
            max={duration || 4}
            step="0.05"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />

          {/* Buttons row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={restart}
                className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
                title="Recommencer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleMute}
                className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="font-mono text-[11px] text-slate-300">
                {currentTime.toFixed(1)}s / {(duration || 4).toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  showSubtitles ? 'text-amber-400 bg-amber-500/20' : 'text-slate-400 hover:text-white'
                }`}
                title={showSubtitles ? 'Masquer sous-titres' : 'Afficher sous-titres'}
              >
                <Subtitles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export & Download Bar */}
      <div className="w-[270px] sm:w-[300px] mt-2.5 flex items-center justify-between gap-2">
        <button
          onClick={downloadVideo}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export 9:16</span>
        </button>

        {video.srtContent && (
          <button
            onClick={downloadSrt}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="Télécharger fichier de sous-titres Whisper (.srt)"
          >
            <Subtitles className="w-3.5 h-3.5 text-amber-400" />
            <span>.SRT</span>
          </button>
        )}
      </div>

      {/* Model Provider Info */}
      <div className="mt-1.5 text-[11px] text-slate-400 text-center flex items-center gap-2">
        <span>Généré avec : {video.providerUsed}</span>
        {video.isCached && <span className="text-emerald-400 font-mono text-[10px]">(Cache Supabase)</span>}
      </div>
    </div>
  );
};
