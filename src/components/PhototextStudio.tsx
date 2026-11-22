import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Eraser,
  Type,
  Download,
  RotateCcw,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Plus,
  Trash2,
  ShieldCheck,
  Wand2,
} from 'lucide-react';
import { PhototextEraseBox, PhototextLayer } from '../types';
import { renderPhototextToCanvas, sampleImageRegionColor } from '../services/andreaSkillsService';

const BASE_FONTS = [
  { id: 'Impact', label: 'Impact' },
  { id: "'Plus Jakarta Sans', sans-serif", label: 'Plus Jakarta Sans' },
  { id: 'Montserrat, sans-serif', label: 'Montserrat Black' },
  { id: "'Playfair Display', serif", label: 'Playfair Display' },
  { id: "'JetBrains Mono', monospace", label: 'JetBrains Mono' },
  { id: 'Georgia, serif', label: 'Georgia' },
];

export const PhototextStudio: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [toolMode, setToolMode] = useState<'replace' | 'erase' | 'add'>('replace');
  const [controlTab, setControlTab] = useState<'outil' | 'typo'>('outil');
  const [customFonts, setCustomFonts] = useState<Array<{ id: string; label: string }>>([]);

  const [eraseBoxes, setEraseBoxes] = useState<PhototextEraseBox[]>([]);
  const [layers, setLayers] = useState<PhototextLayer[]>([
    {
      id: 'pt_layer_1',
      text: 'NOUVELLE ÉDITION',
      x: 50,
      y: 26,
      fontSize: 34,
      fontFamily: 'Impact',
      color: '#ffffff',
      gradientEnabled: false,
      gradientStart: '#38bdf8',
      gradientEnd: '#a855f7',
      strokeEnabled: true,
      strokeColor: '#0f172a',
      strokeWidth: 3,
      shadowEnabled: true,
      shadowColor: 'rgba(0,0,0,0.75)',
      curveAngle: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      isBold: true,
      isItalic: false,
      isUnderline: false,
    },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('pt_layer_1');
  const [replacePromptText, setReplacePromptText] = useState('NOUVEAU TEXTE');
  const [boxSizePct, setBoxSizePct] = useState({ w: 32, h: 10 });
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const activeLayer = layers.find((l) => l.id === activeLayerId) || layers[0] || null;

  const refreshRender = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = renderPhototextToCanvas(canvas, imageEl, eraseBoxes, layers, 1080, 1080);
    setPreviewDataUrl(url);
  }, [imageEl, eraseBoxes, layers]);

  useEffect(() => {
    refreshRender();
  }, [refreshRender]);

  const handleLoadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImageEl(img);
    img.src = url;
  };

  const handleImportCustomFont = async (file: File) => {
    try {
      const fontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '');
      const buf = await file.arrayBuffer();
      const face = new FontFace(fontName, buf);
      await face.load();
      document.fonts.add(face);
      setCustomFonts((prev) => [...prev, { id: fontName, label: `${fontName} (Importée)` }]);
      if (activeLayer) updateActiveLayer({ fontFamily: fontName });
    } catch {
      // Ignore invalid font
    }
  };

  const updateActiveLayer = (patch: Partial<PhototextLayer>) => {
    if (!activeLayer) return;
    setLayers((prev) => prev.map((l) => (l.id === activeLayer.id ? { ...l, ...patch } : l)));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const clickY = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    const bx = Math.max(0, clickX - boxSizePct.w / 2);
    const by = Math.max(0, clickY - boxSizePct.h / 2);
    const sampled = imageEl
      ? sampleImageRegionColor(imageEl, bx, by, boxSizePct.w, boxSizePct.h)
      : '#162040';

    if (toolMode === 'erase') {
      setEraseBoxes((prev) => [
        ...prev,
        {
          id: `er_${Date.now()}`,
          x: bx,
          y: by,
          width: boxSizePct.w,
          height: boxSizePct.h,
          sampledColor: sampled,
          label: 'Zone gommée',
        },
      ]);
    } else if (toolMode === 'replace') {
      setEraseBoxes((prev) => [
        ...prev,
        {
          id: `er_${Date.now()}`,
          x: bx,
          y: by,
          width: boxSizePct.w,
          height: boxSizePct.h,
          sampledColor: sampled,
          label: 'Remplacement texte',
        },
      ]);
      const newLayer: PhototextLayer = {
        id: `pt_${Date.now()}`,
        text: replacePromptText || 'NOUVEAU TEXTE',
        x: clickX,
        y: clickY,
        fontSize: 30,
        fontFamily: activeLayer?.fontFamily || 'Impact',
        color: '#ffffff',
        gradientEnabled: false,
        gradientStart: '#38bdf8',
        gradientEnd: '#a855f7',
        strokeEnabled: true,
        strokeColor: '#000000',
        strokeWidth: 2,
        shadowEnabled: true,
        shadowColor: 'rgba(0,0,0,0.6)',
        curveAngle: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        isBold: true,
        isItalic: false,
        isUnderline: false,
      };
      setLayers((prev) => [...prev, newLayer]);
      setActiveLayerId(newLayer.id);
    } else {
      const newLayer: PhototextLayer = {
        id: `pt_${Date.now()}`,
        text: 'TEXTE STYLISÉ',
        x: clickX,
        y: clickY,
        fontSize: 32,
        fontFamily: activeLayer?.fontFamily || 'Impact',
        color: '#facc15',
        gradientEnabled: false,
        gradientStart: '#f59e0b',
        gradientEnd: '#ef4444',
        strokeEnabled: true,
        strokeColor: '#000000',
        strokeWidth: 2,
        shadowEnabled: true,
        shadowColor: 'rgba(0,0,0,0.7)',
        curveAngle: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        isBold: true,
        isItalic: false,
        isUnderline: false,
      };
      setLayers((prev) => [...prev, newLayer]);
      setActiveLayerId(newLayer.id);
    }
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = renderPhototextToCanvas(canvas, imageEl, eraseBoxes, layers, 1080, 1080);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retouche_photo_andrea_${Date.now()}.png`;
    a.click();
  };

  const allFonts = [...BASE_FONTS, ...customFonts];

  return (
    <div className="h-full flex flex-col gap-2.5 text-xs overflow-hidden">
      {/* Top Bar */}
      <div className="shrink-0 p-2.5 bg-[#0a0e24] border border-[#1d2757] rounded-2xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#172152] border border-[#2b3c8a] text-sky-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Retouche Texte sur Photo · Andrea</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Reconstruction de fond, gomme anti-texte, texte courbé & 3D en local</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-[#172152] hover:bg-[#233178] border border-[#2b3c8a] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            <span>{imageSrc ? 'Changer la photo' : 'Importer une photo'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleLoadImage(e.target.files[0])}
          />

          <button
            onClick={handleDownloadPng}
            className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter PNG</span>
          </button>
        </div>
      </div>

      {/* Main 12-Col Grid (Zero Scrollbar) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        {/* Left Controls */}
        <div className="lg:col-span-5 bg-[#0d122c] border border-[#1e2754] rounded-2xl p-3 flex flex-col justify-between gap-2 overflow-hidden">
          {/* Switch Controls Subtab */}
          <div className="shrink-0 grid grid-cols-2 gap-1 bg-[#090d1f] p-1 rounded-xl border border-[#1d2757]">
            <button
              onClick={() => setControlTab('outil')}
              className={`py-1.5 rounded-lg font-bold cursor-pointer ${
                controlTab === 'outil' ? 'bg-[#2563eb] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Gomme & Zone
            </button>
            <button
              onClick={() => setControlTab('typo')}
              className={`py-1.5 rounded-lg font-bold cursor-pointer ${
                controlTab === 'typo' ? 'bg-[#2563eb] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Typographie & 3D
            </button>
          </div>

          {controlTab === 'outil' ? (
            <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 overflow-hidden">
              <div className="space-y-2">
                <div className="font-bold text-white">Mode d'action au clic :</div>
                <div className="grid grid-cols-3 gap-1.5 bg-[#090d1f] p-1 rounded-xl border border-[#1d2757]">
                  <button
                    onClick={() => setToolMode('replace')}
                    className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer ${
                      toolMode === 'replace' ? 'bg-[#2563eb] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Remplacer</span>
                  </button>
                  <button
                    onClick={() => setToolMode('erase')}
                    className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer ${
                      toolMode === 'erase' ? 'bg-[#2563eb] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eraser className="w-3 h-3" />
                    <span>Gomme IA</span>
                  </button>
                  <button
                    onClick={() => setToolMode('add')}
                    className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer ${
                      toolMode === 'add' ? 'bg-[#2563eb] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Type className="w-3 h-3" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {toolMode === 'replace' && (
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-300 block">
                      Nouveau texte à injecter sur la zone reconstruite :
                    </label>
                    <input
                      type="text"
                      value={replacePromptText}
                      onChange={(e) => setReplacePromptText(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white"
                      placeholder="Saisir le texte de remplacement..."
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block tabular-nums">Largeur ({boxSizePct.w}%)</label>
                    <input
                      type="range"
                      min="8"
                      max="80"
                      value={boxSizePct.w}
                      onChange={(e) => setBoxSizePct((p) => ({ ...p, w: Number(e.target.value) }))}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block tabular-nums">Hauteur ({boxSizePct.h}%)</label>
                    <input
                      type="range"
                      min="4"
                      max="40"
                      value={boxSizePct.h}
                      onChange={(e) => setBoxSizePct((p) => ({ ...p, h: Number(e.target.value) }))}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                </div>
              </div>

              {activeLayer && (
                <div className="p-2.5 rounded-xl bg-[#090d1f] border border-[#1d2757] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Calque actif</span>
                    <button
                      onClick={() => {
                        const nl: PhototextLayer = {
                          ...activeLayer,
                          id: `pt_${Date.now()}`,
                          text: 'NOUVEAU CALQUE',
                          y: Math.min(88, activeLayer.y + 12),
                        };
                        setLayers((p) => [...p, nl]);
                        setActiveLayerId(nl.id);
                      }}
                      className="px-2 py-1 bg-[#172152] text-sky-300 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Calque</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {layers.slice(0, 4).map((l, idx) => (
                      <button
                        key={l.id}
                        onClick={() => setActiveLayerId(l.id)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          l.id === activeLayer.id ? 'bg-[#2563eb] text-white' : 'bg-[#141b3d] text-slate-300'
                        }`}
                      >
                        #{idx + 1} {l.text.slice(0, 10)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={activeLayer.text}
                    onChange={(e) => updateActiveLayer({ text: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white font-bold"
                  />
                </div>
              )}

              {eraseBoxes.length > 0 && (
                <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold pt-1 border-t border-[#1e2754]">
                  <span>Zones reconstruites ({eraseBoxes.length})</span>
                  <button
                    onClick={() => setEraseBoxes([])}
                    className="text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Annuler zones</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            activeLayer && (
              <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <select
                    value={activeLayer.fontFamily}
                    onChange={(e) => updateActiveLayer({ fontFamily: e.target.value })}
                    className="flex-1 px-2 py-1.5 bg-[#141b3d] border border-[#2b3c8a] rounded-xl text-white cursor-pointer"
                  >
                    {allFonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => fontInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-[#172152] border border-[#2b3c8a] rounded-xl text-slate-200 font-bold cursor-pointer whitespace-nowrap"
                  >
                    + Police
                  </button>
                  <input
                    ref={fontInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImportCustomFont(e.target.files[0])}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 tabular-nums">Taille ({activeLayer.fontSize}px)</label>
                    <input
                      type="range"
                      min="14"
                      max="90"
                      value={activeLayer.fontSize}
                      onChange={(e) => updateActiveLayer({ fontSize: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-[#141b3d] border border-[#2b3c8a] rounded-lg p-1">
                    <button
                      onClick={() => updateActiveLayer({ isBold: !activeLayer.isBold })}
                      className={`p-1 rounded cursor-pointer ${activeLayer.isBold ? 'bg-[#2563eb] text-white' : 'text-slate-400'}`}
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateActiveLayer({ isItalic: !activeLayer.isItalic })}
                      className={`p-1 rounded cursor-pointer ${activeLayer.isItalic ? 'bg-[#2563eb] text-white' : 'text-slate-400'}`}
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => updateActiveLayer({ isUnderline: !activeLayer.isUnderline })}
                      className={`p-1 rounded cursor-pointer ${activeLayer.isUnderline ? 'bg-[#2563eb] text-white' : 'text-slate-400'}`}
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 tabular-nums">Pos X ({Math.round(activeLayer.x)}%)</label>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={activeLayer.x}
                      onChange={(e) => updateActiveLayer({ x: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 tabular-nums">Pos Y ({Math.round(activeLayer.y)}%)</label>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={activeLayer.y}
                      onChange={(e) => updateActiveLayer({ y: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <label className="flex items-center justify-between p-1.5 bg-[#141b3d] rounded-xl cursor-pointer">
                    <span className="text-slate-200 font-semibold">Couleur</span>
                    <input
                      type="color"
                      value={activeLayer.color}
                      onChange={(e) => updateActiveLayer({ color: e.target.value, gradientEnabled: false })}
                      className="w-5 h-4 bg-transparent border-0 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-1.5 bg-[#141b3d] rounded-xl cursor-pointer">
                    <span className="text-slate-200 font-semibold">Dégradé</span>
                    <input
                      type="checkbox"
                      checked={activeLayer.gradientEnabled}
                      onChange={(e) => updateActiveLayer({ gradientEnabled: e.target.checked })}
                      className="accent-[#38bdf8]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-1.5 bg-[#141b3d] rounded-xl cursor-pointer">
                    <span className="text-slate-200 font-semibold">Contour</span>
                    <input
                      type="checkbox"
                      checked={activeLayer.strokeEnabled}
                      onChange={(e) => updateActiveLayer({ strokeEnabled: e.target.checked })}
                      className="accent-[#38bdf8]"
                    />
                  </label>
                  <label className="flex items-center justify-between p-1.5 bg-[#141b3d] rounded-xl cursor-pointer">
                    <span className="text-slate-200 font-semibold">Ombre portée</span>
                    <input
                      type="checkbox"
                      checked={activeLayer.shadowEnabled}
                      onChange={(e) => updateActiveLayer({ shadowEnabled: e.target.checked })}
                      className="accent-[#38bdf8]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 tabular-nums">Courbe ({activeLayer.curveAngle}°)</label>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      value={activeLayer.curveAngle}
                      onChange={(e) => updateActiveLayer({ curveAngle: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 tabular-nums">3D Y ({activeLayer.rotateY}°)</label>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={activeLayer.rotateY}
                      onChange={(e) => updateActiveLayer({ rotateY: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 tabular-nums">Rot ({activeLayer.rotateZ}°)</label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={activeLayer.rotateZ}
                      onChange={(e) => updateActiveLayer({ rotateZ: Number(e.target.value) })}
                      className="w-full accent-[#38bdf8]"
                    />
                  </div>
                </div>

                {layers.length > 1 && (
                  <button
                    onClick={() => {
                      const next = layers.filter((l) => l.id !== activeLayer.id);
                      setLayers(next);
                      if (next[0]) setActiveLayerId(next[0].id);
                    }}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer ce calque</span>
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {/* Right Interactive Canvas Viewport */}
        <div className="lg:col-span-7 bg-[#060914] border border-[#1d2757] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 overflow-hidden">
          <div className="text-[11px] text-slate-400 text-center shrink-0">
            {toolMode === 'replace'
              ? 'Cliquez sur un texte de la photo pour reconstruire son fond et le remplacer.'
              : toolMode === 'erase'
              ? 'Cliquez sur un texte ou logo à effacer proprement.'
              : 'Cliquez sur le visuel pour placer un calque texte.'}
          </div>

          <div
            onClick={handleCanvasClick}
            className="relative h-full max-h-[380px] aspect-square rounded-2xl overflow-hidden border border-[#2b3c8a] cursor-crosshair shadow-2xl bg-[#0b1024]"
          >
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Aperçu retouche photo"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            ) : null}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};
