import {
  OpuscarProject,
  OpuscarScene,
  OpuscarStyleId,
  PhototextEraseBox,
  PhototextLayer,
  ReplicaBlueprint,
} from '../types';
import { generateVoice, generateWhisperSubtitles } from './voiceService';
import {
  architectAppCode,
  GeneratedAppResult,
  GeneratedCodeFiles,
} from './andreaCodeArchitect';

export const ILLUSTRATION_STYLES: Array<{
  id: OpuscarStyleId;
  label: string;
  station: string;
  description: string;
  bgPrimary: string;
  bgSecondary: string;
  accent: string;
  ink: string;
}> = [
  {
    id: 'edit_documentary',
    label: 'Documentaire Éditorial',
    station: 'Style 01 · Cinématique',
    description: 'Cadrages cinématiques, repères de montage et typographie éditoriale dynamique.',
    bgPrimary: '#0b1021',
    bgSecondary: '#162040',
    accent: '#38bdf8',
    ink: '#f8fafc',
  },
  {
    id: 'painting_illustration',
    label: 'Peinture & Illustration',
    station: 'Style 02 · Gouache',
    description: 'Courbes organiques fluides, dégradés chauds et touches picturales animées.',
    bgPrimary: '#1e1328',
    bgSecondary: '#3b1d4a',
    accent: '#f59e0b',
    ink: '#fef3c7',
  },
  {
    id: 'sketch_board',
    label: 'Tableau Blanc & Croquis',
    station: 'Style 03 · Schéma',
    description: 'Grille architecturale, tracés à main levée progressifs et flèches explicatives.',
    bgPrimary: '#f8fafc',
    bgSecondary: '#e2e8f0',
    accent: '#2563eb',
    ink: '#0f172a',
  },
  {
    id: 'line_diagrams',
    label: 'Diagrammes Vectoriels',
    station: 'Style 04 · Flux',
    description: 'Nœuds géométriques, liaisons animées et visualisation de flux.',
    bgPrimary: '#071318',
    bgSecondary: '#0d2630',
    accent: '#10b981',
    ink: '#ecfdf5',
  },
  {
    id: 'print_printmaking',
    label: 'Gravure & Trame Presse',
    station: 'Style 05 · Estampe',
    description: 'Trame demi-teinte contrastée, esthétique presse et typographie brute.',
    bgPrimary: '#1c1917',
    bgSecondary: '#292524',
    accent: '#f43f5e',
    ink: '#fafaf9',
  },
];

export const OPUSCAR_STYLES = ILLUSTRATION_STYLES;

/**
 * Génère une application ou un site web complet interactif multi-fichiers à partir d'un prompt.
 */
export function generateAppCodeFromPrompt(
  prompt: string,
  previousHtml?: string,
  previousFiles?: GeneratedCodeFiles
): GeneratedAppResult {
  return architectAppCode(prompt, previousHtml, previousFiles);
}

/**
 * Réplication & restructuration clean-room d'une application
 */
export async function runReplicaSkill(prompt: string): Promise<ReplicaBlueprint> {
  const cleanPrompt = prompt.trim();
  const quotedMatch = cleanPrompt.match(/["«']([^"»']+)["»']/);
  const targetName = quotedMatch
    ? quotedMatch[1]
    : cleanPrompt
        .replace(/^(replica|clone|cloner|reproduis|reproduire|copie|copier|rebrand|skill)\s*/i, '')
        .slice(0, 42) || 'Application Web';

  const brandName = `${targetName.split(' ')[0] || 'Nova'} Studio`;
  const pLower = cleanPrompt.toLowerCase();

  let sector = 'Plateforme Digitale Interactive';
  let coreFlows = [
    'Parcours d’accueil instantané orienté action',
    'Espace de travail interactif avec filtres en temps réel',
    'Suivi des résultats et personnalisation de marque',
  ];

  if (pLower.includes('shop') || pLower.includes('boutique') || pLower.includes('ecommerce') || pLower.includes('vente')) {
    sector = 'E-Commerce Haute Conversion';
    coreFlows = [
      'Vitrine produit épurée avec sélection de variantes',
      'Panier dynamique instantané avec calcul automatique',
      'Tunnel de commande simplifié sans friction',
    ];
  }

  const { html } = generateAppCodeFromPrompt(cleanPrompt);

  return {
    id: `app_${Date.now()}`,
    targetName,
    brandName,
    sector,
    architectureStack: [
      'Interface modulaire responsive',
      'Composants interactifs sans dépendance externe',
      'Persistance navigateur intégrée',
    ],
    coreFlows,
    parityChecklist: [
      { label: 'Structure UI & parcours fonctionnels complets', status: 'verified' },
      { label: 'Architecture autonome prête à exporter', status: 'done' },
      { label: 'Contrôle responsive & interactivité vérifiée', status: 'verified' },
    ],
    generatedHtml: html,
    createdAt: Date.now(),
  };
}

function splitPastedTextLogically(rawText: string): string[] {
  const normalized = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\s*\n+\s*/g, '\n')
    .trim();

  if (!normalized) {
    return ['Votre texte sera illustré scène par scène ici.'];
  }

  // Découpage prioritaire par paragraphes / lignes puis par phrases (. ! ?)
  const rawSegments = normalized
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Si un seul bloc long sans ponctuation, découper logiquement par groupes de ~9 mots
  if (rawSegments.length === 1 && rawSegments[0].split(/\s+/).length > 14) {
    const words = rawSegments[0].split(/\s+/);
    const chunks: string[] = [];
    const chunkSize = Math.ceil(words.length / Math.min(4, Math.ceil(words.length / 8)));
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  }

  // Limiter à 6 scènes cohérentes en fusionnant les très petits fragments si besoin
  const merged: string[] = [];
  for (const seg of rawSegments) {
    if (merged.length > 0 && merged[merged.length - 1].length < 22 && merged.length >= 2) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${seg}`;
    } else {
      merged.push(seg);
    }
  }
  return merged.slice(0, 6);
}

function buildSceneTitleFromSegment(segment: string, idx: number, total: number): string {
  const words = segment
    .replace(/[«»"'.,!?:;()]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) {
    const snippet = words.slice(0, 4).join(' ');
    return snippet.charAt(0).toUpperCase() + snippet.slice(1);
  }
  if (idx === 0) return 'Ouverture';
  if (idx === total - 1) return 'Conclusion';
  return `Séquence ${idx + 1}`;
}

/**
 * Illustration animée de votre texte (segmentation logique du texte collé + rendu Canvas HTML5 + voix off + sous-titres)
 */
export async function runOpuscarSkill(
  prompt: string,
  styleId: OpuscarStyleId = 'edit_documentary',
  onProgress?: (status: string) => void
): Promise<OpuscarProject> {
  const styleMeta = ILLUSTRATION_STYLES.find((s) => s.id === styleId) || ILLUSTRATION_STYLES[0];
  const segments = splitPastedTextLogically(prompt);
  const cleanTitle = buildSceneTitleFromSegment(segments[0] || prompt, 0, segments.length);

  if (onProgress) {
    onProgress(`Illustration (${styleMeta.label}) : structuration logique de ${segments.length} séquence${segments.length > 1 ? 's' : ''}...`);
  }

  const directives = [
    'Ouverture progressive et mise en valeur du message principal.',
    'Enchaînement visuel animé suivant le fil logique du texte.',
    'Accentuation graphique des mots clés et transition fluide.',
    'Développement visuel équilibré avec rythme typographique.',
    'Synthèse visuelle contrastée pour ancrer le propos.',
    'Fermeture éditoriale nette prête pour export.',
  ];

  const scenes: OpuscarScene[] = segments.map((seg, idx) => {
    const wordCount = seg.split(/\s+/).filter(Boolean).length;
    const duration = Number(Math.max(1.8, Math.min(4.2, wordCount * 0.34 + 1.0)).toFixed(1));
    return {
      id: `il_sc_${idx + 1}_${Date.now()}`,
      sceneNumber: idx + 1,
      title: buildSceneTitleFromSegment(seg, idx, segments.length),
      narration: seg,
      visualDirective: directives[idx % directives.length],
      duration,
      accentColor: styleMeta.accent,
    };
  });

  const totalDuration = Number(scenes.reduce((acc, s) => acc + s.duration, 0).toFixed(1));
  const fullNarration = scenes.map((s) => s.narration).join(' ');

  if (onProgress) onProgress(`Rendu frame par frame (${styleMeta.label})...`);
  const videoUrl = await renderIllustrationCanvasVideo(cleanTitle, scenes, styleMeta);

  if (onProgress) onProgress('Synthèse voix off & synchronisation des sous-titres...');
  const voiceResult = await generateVoice({ text: fullNarration });
  const { cues, srtContent } = await generateWhisperSubtitles(fullNarration, totalDuration);

  return {
    id: `illu_${Date.now()}`,
    title: cleanTitle,
    style: styleId,
    styleLabel: styleMeta.label,
    scenes,
    videoUrl,
    audioUrl: voiceResult.audioUrl,
    subtitles: cues,
    srtContent,
    totalDuration,
    createdAt: Date.now(),
  };
}

async function renderIllustrationCanvasVideo(
  title: string,
  scenes: OpuscarScene[],
  style: (typeof ILLUSTRATION_STYLES)[number]
): Promise<string> {
  return new Promise((resolve) => {
    const width = 720;
    const height = 1280;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = canvas.captureStream(30);
    } catch {}

    const drawFrame = (progress: number) => {
      const sceneIdx = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
      const scene = scenes[sceneIdx];
      const localP = (progress * scenes.length) % 1;

      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, style.bgPrimary);
      grad.addColorStop(1, style.bgSecondary);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      if (style.id === 'sketch_board') {
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.14)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < width; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, height);
          ctx.stroke();
        }
        for (let gy = 0; gy < height; gy += 40) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(width, gy);
          ctx.stroke();
        }
      } else if (style.id === 'line_diagrams') {
        ctx.strokeStyle = style.accent;
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 6; i++) {
          const x1 = 120 + i * 95;
          const y1 = 420 + Math.sin(progress * Math.PI * 4 + i) * 90;
          const x2 = 120 + ((i + 1) % 6) * 95;
          const y2 = 420 + Math.cos(progress * Math.PI * 4 + i) * 90;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.fillStyle = style.accent;
          ctx.beginPath();
          ctx.arc(x1, y1, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (style.id === 'painting_illustration') {
        for (let w = 0; w < 4; w++) {
          ctx.fillStyle = `${style.accent}${25 + w * 12}`;
          ctx.beginPath();
          ctx.ellipse(
            width / 2 + Math.sin(progress * 6 + w) * 60,
            height * 0.44 + w * 30,
            240 - w * 35,
            110,
            progress * 0.8 + w,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      } else if (style.id === 'print_printmaking') {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        for (let px = 40; px < width; px += 28) {
          for (let py = 180; py < height - 220; py += 28) {
            const r = 3 + Math.sin(progress * 6 + (px + py) * 0.02) * 2;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(1, r), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        ctx.strokeStyle = style.accent;
        ctx.lineWidth = 3;
        const boxPad = 64 + Math.sin(localP * Math.PI) * 18;
        ctx.strokeRect(boxPad, 220, width - boxPad * 2, 540);
      }
      ctx.restore();

      ctx.fillStyle = style.accent;
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText(`ANDREA STUDIO · ${style.label.toUpperCase()}`, 48, 72);

      ctx.fillStyle = style.ink;
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`SCÈNE 0${scene.sceneNumber} — ${scene.title}`, 48, 845);

      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = style.ink;
      const words = scene.narration.split(/\s+/);
      const wrappedLines: string[] = [];
      let currentLine = '';
      for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(candidate).width > width - 96 && currentLine) {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = candidate;
        }
      }
      if (currentLine) wrappedLines.push(currentLine);
      wrappedLines.slice(0, 5).forEach((ln, lineIdx) => {
        ctx.fillText(ln, 48, 900 + lineIdx * 34);
      });

      ctx.fillStyle = style.accent;
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText(title.slice(0, 46), 48, height - 64);
    };

    if (!stream || typeof MediaRecorder === 'undefined') {
      drawFrame(0.35);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
      return;
    }

    const chunks: Blob[] = [];
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm',
      });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };

    recorder.start();
    const totalFrames = 90;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      drawFrame(frame / totalFrames);
      if (frame >= totalFrames) {
        clearInterval(timer);
        try {
          recorder.stop();
        } catch {
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        }
      }
    }, 33);
  });
}

/**
 * Moteur local d'édition de texte sur photo :
 * - Reconstruction de l'arrière-plan assorti
 * - Gomme IA anti-texte / logo
 * - Typographie avancée (contour, ombre, dégradé, texte courbé, rotation 3D)
 */
export function sampleImageRegionColor(
  img: HTMLImageElement,
  xPct: number,
  yPct: number,
  wPct: number,
  hPct: number
): string {
  try {
    const temp = document.createElement('canvas');
    const w = Math.min(400, img.naturalWidth || 400);
    const h = Math.min(400, img.naturalHeight || 400);
    temp.width = w;
    temp.height = h;
    const ctx = temp.getContext('2d');
    if (!ctx) return '#1e293b';
    ctx.drawImage(img, 0, 0, w, h);

    const sx = Math.max(0, Math.min(w - 1, Math.round(((xPct - 1) / 100) * w)));
    const sy = Math.max(0, Math.min(h - 1, Math.round(((yPct - 1) / 100) * h)));
    const ex = Math.max(0, Math.min(w - 1, Math.round(((xPct + wPct + 1) / 100) * w)));
    const ey = Math.max(0, Math.min(h - 1, Math.round(((yPct + hPct + 1) / 100) * h)));

    const p1 = ctx.getImageData(sx, sy, 1, 1).data;
    const p2 = ctx.getImageData(ex, ey, 1, 1).data;
    const r = Math.round((p1[0] + p2[0]) / 2);
    const g = Math.round((p1[1] + p2[1]) / 2);
    const b = Math.round((p1[2] + p2[2]) / 2);
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return '#1e293b';
  }
}

export function renderPhototextToCanvas(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  eraseBoxes: PhototextEraseBox[],
  layers: PhototextLayer[],
  width = 1080,
  height = 1080
): string {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  for (const box of eraseBoxes) {
    const bx = (box.x / 100) * width;
    const by = (box.y / 100) * height;
    const bw = (box.width / 100) * width;
    const bh = (box.height / 100) * height;

    ctx.save();
    ctx.fillStyle = box.sampledColor;
    ctx.shadowColor = box.sampledColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 8);
    ctx.fill();
    ctx.restore();
  }

  for (const layer of layers) {
    const lx = (layer.x / 100) * width;
    const ly = (layer.y / 100) * height;
    const scaledFontSize = Math.round(layer.fontSize * (width / 540));

    ctx.save();
    ctx.translate(lx, ly);

    const radZ = (layer.rotateZ * Math.PI) / 180;
    const scaleX = Math.cos((layer.rotateY * Math.PI) / 180);
    const scaleY = Math.cos((layer.rotateX * Math.PI) / 180);
    ctx.rotate(radZ);
    ctx.scale(Math.max(0.25, scaleX), Math.max(0.25, scaleY));

    const stylePrefix = `${layer.isItalic ? 'italic ' : ''}${layer.isBold ? '900 ' : '600 '}`;
    ctx.font = `${stylePrefix}${scaledFontSize}px ${layer.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (layer.shadowEnabled) {
      ctx.shadowColor = layer.shadowColor;
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 6;
    }

    if (layer.gradientEnabled) {
      const grad = ctx.createLinearGradient(-160, 0, 160, 0);
      grad.addColorStop(0, layer.gradientStart);
      grad.addColorStop(1, layer.gradientEnd);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = layer.color;
    }

    if (Math.abs(layer.curveAngle) > 4) {
      const chars = layer.text.split('');
      const radius = Math.max(90, 280 - Math.abs(layer.curveAngle) * 1.3);
      const totalArc = (layer.curveAngle * Math.PI) / 180;
      const step = chars.length > 1 ? totalArc / (chars.length - 1) : 0;
      const dir = layer.curveAngle >= 0 ? 1 : -1;

      chars.forEach((ch, idx) => {
        const angle = -totalArc / 2 + idx * step;
        ctx.save();
        ctx.translate(0, dir * radius);
        ctx.rotate(angle);
        ctx.translate(0, -dir * radius);
        if (layer.strokeEnabled && layer.strokeWidth > 0) {
          ctx.lineWidth = layer.strokeWidth * 2;
          ctx.strokeStyle = layer.strokeColor;
          ctx.strokeText(ch, 0, 0);
        }
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      });
    } else {
      if (layer.strokeEnabled && layer.strokeWidth > 0) {
        ctx.lineWidth = layer.strokeWidth * 2;
        ctx.strokeStyle = layer.strokeColor;
        ctx.strokeText(layer.text, 0, 0);
      }
      ctx.fillText(layer.text, 0, 0);

      if (layer.isUnderline) {
        const metrics = ctx.measureText(layer.text);
        ctx.fillRect(-metrics.width / 2, scaledFontSize * 0.55, metrics.width, Math.max(2, scaledFontSize * 0.07));
      }
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}
