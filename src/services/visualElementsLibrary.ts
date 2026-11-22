export interface VisualFrameDef {
  id: string;
  title: string;
  desc: string;
  ratio: string;
  category: 'Standard' | 'Réseaux' | 'Collage' | 'Créatif';
  previewLayout:
    | 'single'
    | 'duo_h'
    | 'duo_v'
    | 'trio_col'
    | 'trio_asym'
    | 'grid_4'
    | 'grid_6'
    | 'grid_9'
    | 'polaroid'
    | 'circle'
    | 'arch'
    | 'pip';
}

export interface VisualLibraryElement {
  id: string;
  name: string;
  kind: 'image' | 'gif';
  category: string;
  src: string;
}

const toSvgDataUrl = (svgBody: string, width = 120, height = 120): string => {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${svgBody}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
};

export const VISUAL_FRAMES: VisualFrameDef[] = [
  { id: '9:16', title: 'Mobile Plein Écran (9:16)', desc: 'Vertical HD 1080×1920', ratio: '9/16', category: 'Réseaux', previewLayout: 'single' },
  { id: '1:1', title: 'Carré Universel (1:1)', desc: 'Carré HD 1080×1080', ratio: '1/1', category: 'Standard', previewLayout: 'single' },
  { id: '4:5', title: 'Portrait Élargi (4:5)', desc: 'Portrait HD 1080×1350', ratio: '4/5', category: 'Réseaux', previewLayout: 'single' },
  { id: '16:9', title: 'Grand Écran (16:9)', desc: 'Panoramique HD 1920×1080', ratio: '16/9', category: 'Standard', previewLayout: 'single' },
  { id: '3:4', title: 'Affiche Éditoriale (3:4)', desc: 'Format affiche 1200×1600', ratio: '3/4', category: 'Standard', previewLayout: 'single' },
  { id: '2.39:1', title: 'Cinéma Anamorphique (2.39:1)', desc: 'Format film grand angle', ratio: '21/9', category: 'Créatif', previewLayout: 'single' },
  { id: '3:1', title: 'Bannière Web (3:1)', desc: 'En-tête panoramique 1500×500', ratio: '3/1', category: 'Réseaux', previewLayout: 'single' },
  { id: 'duo_h', title: 'Duo Côte à Côte', desc: 'Comparatif gauche / droite', ratio: '1/1', category: 'Collage', previewLayout: 'duo_h' },
  { id: 'duo_v', title: 'Duo Haut / Bas', desc: 'Double écran vertical', ratio: '9/16', category: 'Collage', previewLayout: 'duo_v' },
  { id: 'trio_col', title: 'Trio Vertical (3 colonnes)', desc: 'Trois panneaux alignés', ratio: '16/9', category: 'Collage', previewLayout: 'trio_col' },
  { id: 'trio_asym', title: 'Trio Magazine', desc: '1 panneau principal + 2 vignettes', ratio: '1/1', category: 'Collage', previewLayout: 'trio_asym' },
  { id: 'grid_4', title: 'Grille 2×2 Collage', desc: 'Quatre cadrans équilibrés', ratio: '1/1', category: 'Collage', previewLayout: 'grid_4' },
  { id: 'grid_6', title: 'Grille 2×3 Storyboard', desc: 'Six vignettes séquentielles', ratio: '4/5', category: 'Collage', previewLayout: 'grid_6' },
  { id: 'grid_9', title: 'Mosaïque 3×3', desc: 'Neuf cases panoramiques', ratio: '1/1', category: 'Collage', previewLayout: 'grid_9' },
  { id: 'polaroid', title: 'Cadre Polaroïd Studio', desc: 'Bordure photo avec légende', ratio: '3/4', category: 'Créatif', previewLayout: 'polaroid' },
  { id: 'circle_focus', title: 'Cadre Cercle / Médaillon', desc: 'Rond centré pour portrait', ratio: '1/1', category: 'Créatif', previewLayout: 'circle' },
  { id: 'arch_frame', title: 'Cadre Arche Moderne', desc: 'Fenêtre voûtée élégante', ratio: '4/5', category: 'Créatif', previewLayout: 'arch' },
  { id: 'pip_frame', title: 'Cadre Double PiP', desc: 'Grand plan + médaillon flottant', ratio: '9/16', category: 'Créatif', previewLayout: 'pip' },
];

export const SLIDE_BACKGROUNDS = [
  { id: 'indigo_night', label: 'Nuit Indigo', css: 'linear-gradient(160deg, #1e2759 0%, #0d122b 100%)' },
  { id: 'violet_royal', label: 'Violet Royal', css: 'linear-gradient(150deg, #3b1d7a 0%, #110b29 100%)' },
  { id: 'ocean_cyan', label: 'Océan Cyan', css: 'linear-gradient(155deg, #0c4a6e 0%, #090d1f 100%)' },
  { id: 'sunset_rose', label: 'Coucher Rose', css: 'linear-gradient(155deg, #831843 0%, #1e1b4b 100%)' },
  { id: 'emerald_deep', label: 'Émeraude', css: 'linear-gradient(155deg, #065f46 0%, #061612 100%)' },
  { id: 'amber_gold', label: 'Ambre Doré', css: 'linear-gradient(155deg, #92400e 0%, #1c1008 100%)' },
  { id: 'clean_light', label: 'Papier Clair', css: 'linear-gradient(155deg, #f8fafc 0%, #e2e8f0 100%)' },
  { id: 'onyx_pure', label: 'Noir Studio', css: 'linear-gradient(155deg, #18181b 0%, #09090b 100%)' },
];

export const VISUAL_ELEMENTS: VisualLibraryElement[] = [
  // === 18 PETITES IMAGES ILLUSTRÉES ===
  {
    id: 'img_rocket',
    name: 'Fusée Lancement',
    kind: 'image',
    category: 'Business',
    src: toSvgDataUrl(`
      <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs>
      <circle cx="60" cy="60" r="52" fill="#172554" stroke="#38bdf8" stroke-width="3"/>
      <path d="M60 20 C76 34 80 56 76 74 L44 74 C40 56 44 34 60 20Z" fill="url(#g1)"/>
      <circle cx="60" cy="48" r="8" fill="#fff"/>
      <path d="M44 62 L32 76 L44 74 Z M76 62 L88 76 L76 74 Z" fill="#f43f5e"/>
      <path d="M52 74 L60 98 L68 74 Z" fill="#fbbf24"/>
    `),
  },
  {
    id: 'img_crown',
    name: 'Couronne Or',
    kind: 'image',
    category: 'Badges',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#2e1b05" stroke="#fbbf24" stroke-width="3"/>
      <path d="M24 80 L30 38 L48 56 L60 30 L72 56 L90 38 L96 80 Z" fill="#fbbf24" stroke="#fef08a" stroke-width="2"/>
      <rect x="24" y="82" width="72" height="10" rx="4" fill="#d97706"/>
      <circle cx="60" cy="28" r="5" fill="#fef08a"/><circle cx="29" cy="36" r="4" fill="#fef08a"/><circle cx="91" cy="36" r="4" fill="#fef08a"/>
    `),
  },
  {
    id: 'img_camera',
    name: 'Caméra Vidéo',
    kind: 'image',
    category: 'Média',
    src: toSvgDataUrl(`
      <rect x="10" y="10" width="100" height="100" rx="26" fill="#1e1b4b" stroke="#818cf8" stroke-width="3"/>
      <rect x="24" y="42" width="52" height="38" rx="8" fill="#3b82f6"/>
      <polygon points="76,52 98,40 98,82 76,70" fill="#60a5fa"/>
      <circle cx="48" cy="61" r="10" fill="#0f172a" stroke="#93c5fd" stroke-width="3"/>
      <circle cx="34" cy="34" r="6" fill="#c084fc"/>
    `),
  },
  {
    id: 'img_mic',
    name: 'Micro Podcast',
    kind: 'image',
    category: 'Média',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#1f1235" stroke="#c084fc" stroke-width="3"/>
      <rect x="46" y="24" width="28" height="44" rx="14" fill="#a855f7" stroke="#f3e8ff" stroke-width="2"/>
      <path d="M34 56 A26 26 0 0 0 86 56" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <line x1="60" y1="82" x2="60" y2="96" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <line x1="44" y1="96" x2="76" y2="96" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
    `),
  },
  {
    id: 'img_idea',
    name: 'Ampoule Idée',
    kind: 'image',
    category: 'Créatif',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#1e293b" stroke="#facc15" stroke-width="3"/>
      <path d="M60 22 C43 22 33 34 33 48 C33 58 40 65 44 72 L76 72 C80 65 87 58 87 48 C87 34 77 22 60 22Z" fill="#fde047"/>
      <rect x="46" y="75" width="28" height="7" rx="3" fill="#94a3b8"/>
      <rect x="50" y="85" width="20" height="7" rx="3" fill="#64748b"/>
      <path d="M52 46 L60 56 L68 46" fill="none" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
    `),
  },
  {
    id: 'img_flame',
    name: 'Flamme Viral',
    kind: 'image',
    category: 'Effets',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#2c0b0e" stroke="#fb7185" stroke-width="3"/>
      <path d="M62 18 C78 38 90 54 84 74 C78 90 66 96 58 96 C40 96 32 82 34 66 C36 52 48 44 48 32 C54 36 58 26 62 18Z" fill="#f43f5e"/>
      <path d="M60 48 C70 58 74 70 68 82 C64 88 54 90 48 82 C44 74 48 62 60 48Z" fill="#fbbf24"/>
    `),
  },
  {
    id: 'img_trophy',
    name: 'Trophée Succès',
    kind: 'image',
    category: 'Badges',
    src: toSvgDataUrl(`
      <rect x="10" y="10" width="100" height="100" rx="26" fill="#172033" stroke="#fbbf24" stroke-width="3"/>
      <path d="M36 28 H84 V50 C84 65 73 74 60 74 C47 74 36 65 36 50 Z" fill="#f59e0b"/>
      <path d="M36 34 H24 C24 50 30 56 36 56 M84 34 H96 C96 50 90 56 84 56" fill="none" stroke="#fbbf24" stroke-width="4"/>
      <rect x="54" y="74" width="12" height="14" fill="#d97706"/>
      <rect x="40" y="88" width="40" height="8" rx="4" fill="#fbbf24"/>
    `),
  },
  {
    id: 'img_target',
    name: 'Cible Objectif',
    kind: 'image',
    category: 'Business',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="50" fill="#ef4444"/>
      <circle cx="60" cy="60" r="36" fill="#ffffff"/>
      <circle cx="60" cy="60" r="22" fill="#ef4444"/>
      <circle cx="60" cy="60" r="9" fill="#fbbf24"/>
      <line x1="60" y1="60" x2="98" y2="22" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
      <polygon points="98,22 86,24 96,34" fill="#38bdf8"/>
    `),
  },
  {
    id: 'img_chart',
    name: 'Croissance +%',
    kind: 'image',
    category: 'Business',
    src: toSvgDataUrl(`
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#06281e" stroke="#34d399" stroke-width="3"/>
      <rect x="26" y="66" width="14" height="24" rx="3" fill="#10b981"/>
      <rect x="50" y="50" width="14" height="40" rx="3" fill="#34d399"/>
      <rect x="74" y="32" width="14" height="58" rx="3" fill="#6ee7b7"/>
      <path d="M24 54 L52 38 L86 20" fill="none" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
      <polygon points="88,18 76,20 84,30" fill="#fde047"/>
    `),
  },
  {
    id: 'img_phone',
    name: 'Écran Mobile',
    kind: 'image',
    category: 'Média',
    src: toSvgDataUrl(`
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <rect x="36" y="20" width="48" height="80" rx="10" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
      <rect x="42" y="30" width="36" height="54" rx="4" fill="#3b82f6"/>
      <polygon points="54,48 54,66 70,57" fill="#ffffff"/>
      <circle cx="60" cy="91" r="3" fill="#cbd5e1"/>
    `),
  },
  {
    id: 'img_heart',
    name: 'Cœur Vibrant',
    kind: 'image',
    category: 'Social',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#2d0a1e" stroke="#f472b6" stroke-width="3"/>
      <path d="M60 92 C60 92 22 68 22 44 C22 30 34 22 46 22 C54 22 58 27 60 32 C62 27 66 22 74 22 C86 22 98 30 98 44 C98 68 60 92 60 92Z" fill="#ec4899"/>
      <ellipse cx="40" cy="40" rx="6" ry="3" transform="rotate(-30 40 40)" fill="#fbcfe8"/>
    `),
  },
  {
    id: 'img_star',
    name: 'Étoile Premium',
    kind: 'image',
    category: 'Badges',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#1e1b4b" stroke="#a855f7" stroke-width="3"/>
      <polygon points="60,18 71,44 99,46 77,64 84,92 60,77 36,92 43,64 21,46 49,44" fill="#facc15" stroke="#fef9c3" stroke-width="2"/>
    `),
  },
  {
    id: 'img_clock',
    name: 'Chrono Rapide',
    kind: 'image',
    category: 'Business',
    src: toSvgDataUrl(`
      <circle cx="60" cy="64" r="42" fill="#0f172a" stroke="#38bdf8" stroke-width="5"/>
      <rect x="50" y="12" width="20" height="8" rx="3" fill="#38bdf8"/>
      <line x1="60" y1="64" x2="60" y2="38" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
      <line x1="60" y1="64" x2="80" y2="74" stroke="#f43f5e" stroke-width="4" stroke-linecap="round"/>
      <circle cx="60" cy="64" r="4" fill="#fbbf24"/>
    `),
  },
  {
    id: 'img_clap',
    name: 'Clap Cinéma',
    kind: 'image',
    category: 'Média',
    src: toSvgDataUrl(`
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#18181b" stroke="#e4e4e7" stroke-width="3"/>
      <rect x="24" y="44" width="72" height="48" rx="6" fill="#27272a" stroke="#fff" stroke-width="2"/>
      <path d="M24 44 L96 44 L96 30 L24 30 Z" fill="#ffffff" transform="rotate(-12 24 44)"/>
      <line x1="40" y1="30" x2="50" y2="44" stroke="#18181b" stroke-width="5"/>
      <line x1="65" y1="30" x2="75" y2="44" stroke="#18181b" stroke-width="5"/>
    `),
  },
  {
    id: 'img_megaphone',
    name: 'Annonce Forte',
    kind: 'image',
    category: 'Social',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#172554" stroke="#60a5fa" stroke-width="3"/>
      <polygon points="30,54 78,30 78,86 30,66" fill="#f97316"/>
      <rect x="24" y="52" width="14" height="18" rx="3" fill="#e2e8f0"/>
      <path d="M36 68 L44 90 L34 90 L28 68 Z" fill="#94a3b8"/>
      <path d="M88 46 Q96 58 88 70" fill="none" stroke="#fde047" stroke-width="4" stroke-linecap="round"/>
    `),
  },
  {
    id: 'img_verified',
    name: 'Badge Vérifié',
    kind: 'image',
    category: 'Badges',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="46" fill="#0ea5e9" stroke="#e0f2fe" stroke-width="4"/>
      <polyline points="38,62 53,77 84,42" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    `),
  },
  {
    id: 'img_arrow_curve',
    name: 'Flèche Focus',
    kind: 'image',
    category: 'Social',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#1e1b4b" stroke="#38bdf8" stroke-width="3"/>
      <path d="M26 78 Q38 30 84 40" fill="none" stroke="#fde047" stroke-width="7" stroke-linecap="round"/>
      <polygon points="94,42 74,28 76,52" fill="#fde047"/>
    `),
  },
  {
    id: 'img_gift',
    name: 'Cadeau Offre',
    kind: 'image',
    category: 'Social',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#2d0f28" stroke="#ec4899" stroke-width="3"/>
      <rect x="28" y="48" width="64" height="44" rx="6" fill="#ec4899"/>
      <rect x="24" y="38" width="72" height="14" rx="4" fill="#f472b6"/>
      <rect x="54" y="38" width="12" height="54" fill="#fde047"/>
      <circle cx="48" cy="30" r="8" fill="none" stroke="#fde047" stroke-width="4"/>
      <circle cx="72" cy="30" r="8" fill="none" stroke="#fde047" stroke-width="4"/>
    `),
  },

  // === 12 GIFs ANIMÉS (SVG SMIL LOOPING MOTION GRAPHICS) ===
  {
    id: 'gif_soundwave',
    name: 'GIF Onde Sonore',
    kind: 'gif',
    category: 'Audio GIF',
    src: toSvgDataUrl(`
      <rect x="6" y="6" width="108" height="108" rx="24" fill="#090d1f" stroke="#38bdf8" stroke-width="3"/>
      <rect x="22" y="45" width="10" height="30" rx="5" fill="#38bdf8">
        <animate attributeName="height" values="20;66;20" dur="0.8s" repeatCount="indefinite"/>
        <animate attributeName="y" values="50;27;50" dur="0.8s" repeatCount="indefinite"/>
      </rect>
      <rect x="40" y="30" width="10" height="60" rx="5" fill="#818cf8">
        <animate attributeName="height" values="64;22;64" dur="0.7s" repeatCount="indefinite"/>
        <animate attributeName="y" values="28;49;28" dur="0.7s" repeatCount="indefinite"/>
      </rect>
      <rect x="58" y="25" width="10" height="70" rx="5" fill="#c084fc">
        <animate attributeName="height" values="30;74;30" dur="0.9s" repeatCount="indefinite"/>
        <animate attributeName="y" values="45;23;45" dur="0.9s" repeatCount="indefinite"/>
      </rect>
      <rect x="76" y="36" width="10" height="48" rx="5" fill="#f472b6">
        <animate attributeName="height" values="58;20;58" dur="0.65s" repeatCount="indefinite"/>
        <animate attributeName="y" values="31;50;31" dur="0.65s" repeatCount="indefinite"/>
      </rect>
      <rect x="94" y="42" width="10" height="36" rx="5" fill="#34d399">
        <animate attributeName="height" values="24;62;24" dur="0.85s" repeatCount="indefinite"/>
        <animate attributeName="y" values="48;29;48" dur="0.85s" repeatCount="indefinite"/>
      </rect>
    `),
  },
  {
    id: 'gif_bounce_arrow',
    name: 'GIF Flèche Rebond',
    kind: 'gif',
    category: 'CTA GIF',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#172554" stroke="#60a5fa" stroke-width="3"/>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,-8; 0,10; 0,-8" dur="0.85s" repeatCount="indefinite"/>
        <rect x="52" y="24" width="16" height="38" rx="6" fill="#fde047"/>
        <polygon points="34,58 86,58 60,92" fill="#fde047"/>
      </g>
    `),
  },
  {
    id: 'gif_sparkles',
    name: 'GIF Étoiles Flash',
    kind: 'gif',
    category: 'Effet GIF',
    src: toSvgDataUrl(`
      <rect x="8" y="8" width="104" height="104" rx="24" fill="#1e1b4b" stroke="#c084fc" stroke-width="3"/>
      <polygon points="48,20 54,42 76,48 54,54 48,76 42,54 20,48 42,42" fill="#fde047">
        <animateTransform attributeName="transform" type="scale" additive="sum" values="0.8;1.15;0.8" dur="1.1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.1s" repeatCount="indefinite"/>
      </polygon>
      <polygon points="86,62 90,74 102,78 90,82 86,94 82,82 70,78 82,74" fill="#38bdf8">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite"/>
      </polygon>
    `),
  },
  {
    id: 'gif_radar',
    name: 'GIF Onde Radar',
    kind: 'gif',
    category: 'Effet GIF',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="54" fill="#090d1f"/>
      <circle cx="60" cy="60" r="14" fill="#38bdf8"/>
      <circle cx="60" cy="60" r="16" fill="none" stroke="#38bdf8" stroke-width="4">
        <animate attributeName="r" values="14;52" dur="1.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0" dur="1.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="60" r="16" fill="none" stroke="#a855f7" stroke-width="4">
        <animate attributeName="r" values="14;52" dur="1.3s" begin="0.65s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0" dur="1.3s" begin="0.65s" repeatCount="indefinite"/>
      </circle>
    `),
  },
  {
    id: 'gif_live_badge',
    name: 'GIF Badge LIVE',
    kind: 'gif',
    category: 'CTA GIF',
    src: toSvgDataUrl(`
      <rect x="10" y="34" width="100" height="52" rx="16" fill="#dc2626" stroke="#fecaca" stroke-width="3"/>
      <circle cx="32" cy="60" r="9" fill="#ffffff">
        <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite"/>
      </circle>
      <text x="50" y="67" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff">LIVE</text>
    `),
  },
  {
    id: 'gif_heart_beat',
    name: 'GIF Cœur Battant',
    kind: 'gif',
    category: 'Social GIF',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#2d0a1e" stroke="#f43f5e" stroke-width="3"/>
      <g transform="translate(60 60)">
        <animateTransform attributeName="transform" type="scale" additive="sum" values="0.88;1.12;0.92;1.08;0.88" dur="1s" repeatCount="indefinite"/>
        <path d="M0 28 C0 28 -34 6 -34 -14 C-34 -26 -24 -34 -14 -34 C-6 -34 -2 -29 0 -24 C2 -29 6 -34 14 -34 C24 -34 34 -26 34 -14 C34 6 0 28 0 28Z" fill="#f43f5e"/>
      </g>
    `),
  },
  {
    id: 'gif_neon_ring',
    name: 'GIF Anneau Néo',
    kind: 'gif',
    category: 'Effet GIF',
    src: toSvgDataUrl(`
      <defs><linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#a855f7"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs>
      <circle cx="60" cy="60" r="42" fill="none" stroke="url(#ring)" stroke-width="10" stroke-dasharray="190 70" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="1.4s" repeatCount="indefinite"/>
      </circle>
      <polygon points="52,44 52,76 78,60" fill="#ffffff"/>
    `),
  },
  {
    id: 'gif_confetti',
    name: 'GIF Confettis',
    kind: 'gif',
    category: 'Effet GIF',
    src: toSvgDataUrl(`
      <rect x="8" y="8" width="104" height="104" rx="24" fill="#151030" stroke="#fbbf24" stroke-width="3"/>
      <circle cx="32" cy="34" r="7" fill="#38bdf8"><animate attributeName="cy" values="26;88;26" dur="1.4s" repeatCount="indefinite"/></circle>
      <rect x="54" y="24" width="12" height="12" rx="2" fill="#f43f5e"><animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="1.5s" repeatCount="indefinite"/></rect>
      <circle cx="88" cy="40" r="6" fill="#34d399"><animate attributeName="cy" values="84;28;84" dur="1.2s" repeatCount="indefinite"/></circle>
      <polygon points="44,72 52,86 36,86" fill="#fde047"><animate attributeName="opacity" values="1;0.3;1" dur="0.9s" repeatCount="indefinite"/></polygon>
    `),
  },
  {
    id: 'gif_bolt',
    name: 'GIF Éclair Rapide',
    kind: 'gif',
    category: 'Effet GIF',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#1e1b4b" stroke="#facc15" stroke-width="3"/>
      <polygon points="68,16 32,64 56,64 48,104 88,52 62,52" fill="#facc15">
        <animate attributeName="opacity" values="1;0.4;1;0.7;1" dur="0.7s" repeatCount="indefinite"/>
      </polygon>
    `),
  },
  {
    id: 'gif_flame_anim',
    name: 'GIF Flamme Live',
    kind: 'gif',
    category: 'Effet GIF',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#2a0a12" stroke="#f97316" stroke-width="3"/>
      <g>
        <animateTransform attributeName="transform" type="scale" additive="sum" values="1,1; 1.05,0.94; 1,1" dur="0.65s" repeatCount="indefinite"/>
        <path d="M62 20 C82 40 90 60 82 78 C74 92 60 96 50 92 C36 86 32 70 38 56 C44 42 54 34 62 20Z" fill="#f97316"/>
        <path d="M60 48 C70 58 72 72 64 82 C58 88 48 86 46 76 C44 66 52 56 60 48Z" fill="#fde047"/>
      </g>
    `),
  },
  {
    id: 'gif_swipe_up',
    name: 'GIF Swipe Haut',
    kind: 'gif',
    category: 'CTA GIF',
    src: toSvgDataUrl(`
      <rect x="14" y="14" width="92" height="92" rx="22" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <polyline points="34,62 60,36 86,62" fill="none" stroke="#38bdf8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <animateTransform attributeName="transform" type="translate" values="0,12; 0,-10; 0,12" dur="0.9s" repeatCount="indefinite"/>
      </polyline>
      <polyline points="38,82 60,60 82,82" fill="none" stroke="#a855f7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <animateTransform attributeName="transform" type="translate" values="0,10; 0,-8; 0,10" dur="0.9s" begin="0.15s" repeatCount="indefinite"/>
      </polyline>
    `),
  },
  {
    id: 'gif_bell',
    name: 'GIF Cloche Alerte',
    kind: 'gif',
    category: 'Social GIF',
    src: toSvgDataUrl(`
      <circle cx="60" cy="60" r="52" fill="#172554" stroke="#fbbf24" stroke-width="3"/>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-12 60 30; 12 60 30; -12 60 30" dur="0.7s" repeatCount="indefinite"/>
        <path d="M60 24 C44 24 36 36 36 56 L28 74 H92 L84 56 C84 36 76 24 60 24Z" fill="#fbbf24"/>
        <circle cx="60" cy="84" r="8" fill="#fef08a"/>
      </g>
    `),
  },
];
