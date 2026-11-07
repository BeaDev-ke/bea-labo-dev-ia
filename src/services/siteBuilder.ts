/**
 * Générateur de site web.
 *
 * Produit UN fichier HTML autonome (CSS + JS inclus, aucune ressource externe)
 * à partir d'un brief structuré. Tout texte saisi par l'utilisateur est échappé :
 * il ne peut ni casser la page ni y injecter de code.
 */

export type SectorId = 'btp' | 'immo' | 'mode' | 'sante' | 'resto' | 'tech';
export type ObjectiveId = 'devis' | 'rdv' | 'vente' | 'vitrine';
export type AmbianceId = 'industriel' | 'dark' | 'clean' | 'neon';

export interface SiteBrief {
  name: string;
  sector: SectorId;
  objective: ObjectiveId;
  ambiance: AmbianceId;
  /** Précisions libres : devient le texte d'introduction du site. */
  notes: string;
  /** E-mail ou téléphone affiché sur le site. */
  contact: string;
}

export const SECTOR_OPTIONS: Array<{ id: SectorId; label: string }> = [
  { id: 'btp', label: '🔨 Bâtiment, Travaux & Outillage' },
  { id: 'immo', label: '🏠 Immobilier & Architecture' },
  { id: 'mode', label: '🛍️ E-commerce & Mode' },
  { id: 'sante', label: '✨ Santé & Cosmétique' },
  { id: 'resto', label: '🍽️ Restauration & Gastronomie' },
  { id: 'tech', label: '💻 Tech & SaaS' },
];

export const OBJECTIVE_OPTIONS: Array<{ id: ObjectiveId; label: string }> = [
  { id: 'devis', label: 'Catalogue & Devis en ligne' },
  { id: 'rdv', label: 'Prise de rendez-vous' },
  { id: 'vente', label: 'Vente directe de produits' },
  { id: 'vitrine', label: 'Présentation institutionnelle' },
];

export const AMBIANCE_OPTIONS: Array<{ id: AmbianceId; label: string }> = [
  { id: 'industriel', label: 'Industriel Pro & Robuste' },
  { id: 'dark', label: 'Minimaliste & Sombre (Dark Luxe)' },
  { id: 'clean', label: 'Épuré & Lumineux (Clean White)' },
  { id: 'neon', label: 'Néon & Cyber Futuriste' },
];

/* ------------------------------------------------------------------ */
/* Contenu par secteur                                                 */
/* ------------------------------------------------------------------ */

interface Item {
  icon: string;
  title: string;
  desc: string;
  /** Prix d'exemple en euros (vente directe). À remplacer par le propriétaire. */
  price: number;
}

interface SectorContent {
  emoji: string;
  headline: string;
  sub: string;
  offerTitle: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  items: Item[];
}

const SECTORS: Record<SectorId, SectorContent> = {
  btp: {
    emoji: '🔨',
    headline: "Le bon outil, au bon prix, pour chaque chantier",
    sub: "Un catalogue clair de matériel professionnel, avec conseils et réponse rapide à vos demandes.",
    offerTitle: 'Notre matériel',
    features: [
      { icon: '🛠️', title: 'Matériel éprouvé', desc: 'Des outils choisis pour tenir sur la durée, chantier après chantier.' },
      { icon: '📞', title: 'Conseil de pros', desc: "Une équipe qui connaît le terrain et vous oriente vers le bon choix." },
      { icon: '🚚', title: 'Prêt quand il le faut', desc: 'Retrait ou livraison organisés selon votre planning de travaux.' },
    ],
    items: [
      { icon: '🔩', title: 'Perceuses & visseuses', desc: 'Sans fil et filaires pour le perçage et le vissage intensifs.', price: 129 },
      { icon: '🪚', title: 'Scies & découpe', desc: 'Circulaires, sauteuses et scies sabre pour tous les matériaux.', price: 159 },
      { icon: '📏', title: 'Mesure & traçage', desc: 'Lasers, niveaux et mètres pour des relevés précis.', price: 49 },
      { icon: '🧰', title: 'Rangement & caisses', desc: 'Servantes et coffrets pour garder le matériel organisé.', price: 79 },
      { icon: '🦺', title: 'Protection & sécurité', desc: 'Casques, gants et lunettes aux normes en vigueur.', price: 29 },
      { icon: '🔧', title: 'Outillage à main', desc: 'Clés, pinces, marteaux et tournevis de qualité pro.', price: 39 },
    ],
  },
  immo: {
    emoji: '🏠',
    headline: 'Trouvez le lieu qui correspond à votre projet',
    sub: 'Une sélection de biens et de projets présentés avec soin, et un accompagnement de A à Z.',
    offerTitle: 'Nos biens et prestations',
    features: [
      { icon: '🔑', title: 'Accompagnement complet', desc: 'De la première visite à la remise des clés.' },
      { icon: '📐', title: 'Regard d’architecte', desc: "Une lecture claire du potentiel de chaque espace." },
      { icon: '🤝', title: 'Transparence', desc: 'Des informations précises et des conditions expliquées simplement.' },
    ],
    items: [
      { icon: '🏡', title: 'Maisons', desc: 'Maisons de ville et de campagne avec jardin.', price: 250000 },
      { icon: '🏢', title: 'Appartements', desc: 'Du studio au grand appartement familial.', price: 180000 },
      { icon: '🏗️', title: 'Programmes neufs', desc: 'Logements neufs aux normes actuelles.', price: 210000 },
      { icon: '🏬', title: 'Locaux professionnels', desc: 'Bureaux et commerces bien situés.', price: 150000 },
      { icon: '📋', title: 'Estimation offerte', desc: 'Une estimation argumentée de votre bien.', price: 0 },
      { icon: '🎨', title: 'Conception & rénovation', desc: "Plans, conseils et suivi de travaux d'aménagement.", price: 0 },
    ],
  },
  mode: {
    emoji: '🛍️',
    headline: 'Des pièces choisies, un style qui vous ressemble',
    sub: 'Une boutique soignée, des produits sélectionnés et une commande simple du début à la fin.',
    offerTitle: 'Nos produits',
    features: [
      { icon: '✨', title: 'Sélection exigeante', desc: 'Chaque article est choisi pour sa qualité et son style.' },
      { icon: '📦', title: 'Commande simple', desc: 'Un panier clair, sans étape inutile.' },
      { icon: '↩️', title: 'Retours faciles', desc: "Un doute ? Échange ou retour selon nos conditions." },
    ],
    items: [
      { icon: '👕', title: 'T-shirts essentiels', desc: 'Coton doux, coupes intemporelles.', price: 35 },
      { icon: '🧥', title: 'Vestes & manteaux', desc: 'Pièces fortes pour toutes les saisons.', price: 129 },
      { icon: '👖', title: 'Pantalons', desc: 'Du quotidien à la tenue habillée.', price: 79 },
      { icon: '👟', title: 'Chaussures', desc: 'Confort et allure, de jour comme de soir.', price: 99 },
      { icon: '👜', title: 'Sacs', desc: 'Pratiques et durables.', price: 89 },
      { icon: '🧣', title: 'Accessoires', desc: 'Les détails qui font la différence.', price: 25 },
    ],
  },
  sante: {
    emoji: '✨',
    headline: 'Prenez soin de vous, simplement',
    sub: 'Des soins et conseils personnalisés, dans une approche douce et professionnelle.',
    offerTitle: 'Nos soins et produits',
    features: [
      { icon: '🌿', title: 'Formules soignées', desc: 'Des produits choisis avec attention pour la peau.' },
      { icon: '👩‍⚕️', title: 'Conseil personnalisé', desc: 'Un échange pour trouver ce qui vous convient.' },
      { icon: '🕊️', title: 'Cadre apaisant', desc: 'Un moment pensé pour vous détendre.' },
    ],
    items: [
      { icon: '🧴', title: 'Soin visage', desc: 'Nettoyer, hydrater et protéger au quotidien.', price: 45 },
      { icon: '💆', title: 'Massage relaxant', desc: 'Un temps de détente profonde.', price: 60 },
      { icon: '🧖', title: 'Soin du corps', desc: 'Gommage, hydratation et bien-être.', price: 55 },
      { icon: '🌸', title: 'Huiles & sérums', desc: 'Actifs sélectionnés pour chaque besoin.', price: 39 },
      { icon: '💅', title: 'Beauté des mains', desc: 'Soin, pose et finition.', price: 35 },
      { icon: '🎁', title: 'Coffrets cadeaux', desc: 'Une attention prête à offrir.', price: 59 },
    ],
  },
  resto: {
    emoji: '🍽️',
    headline: 'Une cuisine qui donne envie de revenir',
    sub: 'Des plats préparés avec des produits choisis, dans une ambiance chaleureuse.',
    offerTitle: 'Notre carte',
    features: [
      { icon: '🥬', title: 'Produits choisis', desc: 'Des ingrédients sélectionnés avec soin.' },
      { icon: '👨‍🍳', title: 'Fait maison', desc: 'Une cuisine préparée sur place, chaque jour.' },
      { icon: '🥂', title: 'Ambiance conviviale', desc: 'Pour un repas simple ou un moment à partager.' },
    ],
    items: [
      { icon: '🥗', title: 'Entrées', desc: 'Salades fraîches et petites assiettes à partager.', price: 9 },
      { icon: '🍝', title: 'Plats du jour', desc: 'Une proposition qui change selon le marché.', price: 16 },
      { icon: '🥩', title: 'Spécialités de la maison', desc: 'Nos recettes signature.', price: 22 },
      { icon: '🍰', title: 'Desserts', desc: 'Pâtisseries et douceurs maison.', price: 8 },
      { icon: '🍷', title: 'Boissons', desc: 'Vins, softs et boissons chaudes.', price: 5 },
      { icon: '🎉', title: 'Groupes & événements', desc: 'Menus adaptés pour vos réceptions.', price: 35 },
    ],
  },
  tech: {
    emoji: '💻',
    headline: 'Le logiciel qui fait gagner du temps à votre équipe',
    sub: 'Une plateforme claire, rapide à prendre en main, avec un accompagnement humain.',
    offerTitle: 'Fonctionnalités et formules',
    features: [
      { icon: '⚡', title: 'Prise en main rapide', desc: 'Opérationnel en quelques minutes, sans formation lourde.' },
      { icon: '🔒', title: 'Données protégées', desc: 'Sécurité et confidentialité au cœur du produit.' },
      { icon: '💬', title: 'Support réactif', desc: 'Une vraie personne répond à vos questions.' },
    ],
    items: [
      { icon: '📊', title: 'Tableau de bord', desc: 'Vos indicateurs clés, en un coup d’œil.', price: 19 },
      { icon: '🔄', title: 'Automatisations', desc: 'Moins de tâches répétitives, plus de temps utile.', price: 29 },
      { icon: '🔌', title: 'Intégrations', desc: 'Connectez vos outils existants.', price: 39 },
      { icon: '👥', title: 'Travail en équipe', desc: 'Commentaires, rôles et suivi partagé.', price: 25 },
      { icon: '📈', title: 'Rapports', desc: 'Des exports clairs pour décider vite.', price: 15 },
      { icon: '🛟', title: 'Accompagnement', desc: 'Mise en place et formation à la demande.', price: 49 },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Thèmes                                                              */
/* ------------------------------------------------------------------ */

interface Theme {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  accent2: string;
  radius: string;
  scheme: 'dark' | 'light';
}

const THEMES: Record<AmbianceId, Theme> = {
  industriel: {
    bg: '#111214', surface: '#1b1d20', text: '#f4f4f5', muted: '#a1a1aa', border: '#2e3136',
    accent: '#f59e0b', accentText: '#111214', accent2: '#fbbf24', radius: '6px', scheme: 'dark',
  },
  dark: {
    bg: '#0b0b0f', surface: '#14141b', text: '#f5f5f7', muted: '#9a9aa8', border: '#26262f',
    accent: '#d4af37', accentText: '#0b0b0f', accent2: '#f0d27a', radius: '10px', scheme: 'dark',
  },
  clean: {
    bg: '#ffffff', surface: '#f6f7f9', text: '#14171f', muted: '#5b6472', border: '#e4e7ec',
    accent: '#2563eb', accentText: '#ffffff', accent2: '#60a5fa', radius: '14px', scheme: 'light',
  },
  neon: {
    bg: '#070816', surface: '#0f1230', text: '#eef0ff', muted: '#98a0d6', border: '#252a66',
    accent: '#22d3ee', accentText: '#04121a', accent2: '#a855f7', radius: '16px', scheme: 'dark',
  },
};

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** JSON sûr pour être placé dans une balise <script>. */
function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function clip(value: string, max: number): string {
  return (value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

type ContactKind = 'email' | 'phone' | 'none';

function parseContact(raw: string): { kind: ContactKind; value: string } {
  const value = clip(raw, 80);
  if (/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(value)) return { kind: 'email', value };
  const digits = value.replace(/[^\d+]/g, '');
  if (digits.replace(/\D/g, '').length >= 6) return { kind: 'phone', value };
  return { kind: 'none', value: '' };
}

function euro(n: number): string {
  return n.toLocaleString('fr-FR') + ' €';
}

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

function buildCss(t: Theme, ambiance: AmbianceId): string {
  const buttonBg =
    ambiance === 'neon' ? `linear-gradient(90deg, ${t.accent}, ${t.accent2})` : t.accent;
  return `
:root{--bg:${t.bg};--surface:${t.surface};--text:${t.text};--muted:${t.muted};--border:${t.border};--accent:${t.accent};--accent-text:${t.accentText};--accent2:${t.accent2};--radius:${t.radius};color-scheme:${t.scheme}}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
img,svg{max-width:100%}
a{color:inherit}
.skip{position:absolute;left:-999px;top:8px;background:var(--accent);color:var(--accent-text);padding:8px 12px;border-radius:var(--radius);z-index:100}
.skip:focus{left:8px}
:focus-visible{outline:3px solid var(--accent2);outline-offset:2px}
.wrap{width:min(1120px,100% - 40px);margin-inline:auto}
header.top{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--border)}
.bar{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px}
.brand{font-weight:800;font-size:1.15rem;letter-spacing:-.01em;text-decoration:none;display:flex;align-items:center;gap:8px}
nav.main{display:flex;align-items:center;gap:22px}
nav.main a{text-decoration:none;color:var(--muted);font-size:.95rem;font-weight:600}
nav.main a:hover{color:var(--text)}
nav.main a.btn,nav.main a.btn:hover{color:var(--accent-text)}
.menu-btn{display:none;background:none;border:1px solid var(--border);color:var(--text);border-radius:var(--radius);padding:8px 12px;font-size:1rem;cursor:pointer}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;text-decoration:none;font:inherit;font-weight:700;padding:12px 22px;border-radius:var(--radius);background:${buttonBg};color:var(--accent-text);transition:transform .15s ease,filter .15s ease}
.btn:hover{transform:translateY(-1px);filter:brightness(1.08)}
.btn.ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn.small{padding:8px 14px;font-size:.9rem}
.hero{padding:88px 0 72px;text-align:center}
.eyebrow{display:inline-block;padding:6px 14px;border:1px solid var(--border);background:var(--surface);border-radius:999px;color:var(--muted);font-size:.85rem;font-weight:600;margin-bottom:20px}
h1{font-size:clamp(2rem,5.2vw,3.6rem);line-height:1.1;letter-spacing:-.02em;margin:0 auto 18px;max-width:20ch}
.lead{color:var(--muted);font-size:clamp(1rem,2vw,1.2rem);max-width:60ch;margin:0 auto 30px}
.cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
section{padding:72px 0}
section.alt{background:var(--surface);border-block:1px solid var(--border)}
h2{font-size:clamp(1.5rem,3.4vw,2.2rem);letter-spacing:-.015em;line-height:1.2;margin:0 0 10px}
.sub{color:var(--muted);margin:0 0 36px;max-width:60ch}
.grid{display:grid;gap:18px}
.g3{grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:22px}
section.alt .card{background:var(--bg)}
.card .ic{font-size:1.7rem;margin-bottom:10px}
.card h3{margin:0 0 6px;font-size:1.08rem}
.card p{margin:0;color:var(--muted);font-size:.95rem}
.card .row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:16px}
.price{font-weight:800;color:var(--accent)}
form.box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:26px;display:grid;gap:14px;max-width:680px}
section.alt form.box{background:var(--bg)}
label{display:grid;gap:6px;font-weight:600;font-size:.92rem}
input,select,textarea{font:inherit;color:var(--text);background:var(--bg);border:1px solid var(--border);border-radius:calc(var(--radius) - 2px);padding:11px 12px;width:100%}
section.alt input,section.alt select,section.alt textarea{background:var(--surface)}
textarea{min-height:110px;resize:vertical}
.checks{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px}
.checks label{display:flex;align-items:center;gap:10px;font-weight:500;padding:10px 12px;border:1px solid var(--border);border-radius:calc(var(--radius) - 2px);cursor:pointer}
.checks input{width:auto}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.notice{display:none;padding:14px 16px;border-radius:var(--radius);border:1px solid var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);font-size:.95rem;white-space:pre-line}
.notice.show{display:block}
details{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;margin-bottom:12px}
section.alt details{background:var(--bg)}
summary{cursor:pointer;font-weight:700}
details p{color:var(--muted);margin:10px 0 0}
.quote p{margin:0 0 14px;color:var(--text)}
.quote small{color:var(--muted)}
.cart-bar{position:fixed;right:18px;bottom:18px;z-index:60;display:none}
.cart-bar.show{display:block}
.cart-panel{position:fixed;right:18px;bottom:76px;width:min(360px,100% - 36px);max-height:70vh;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;z-index:60;display:none;box-shadow:0 20px 50px rgba(0,0,0,.35)}
.cart-panel.show{display:block}
.cart-line{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:.95rem}
.cart-total{display:flex;justify-content:space-between;font-weight:800;margin:14px 0}
footer{border-top:1px solid var(--border);padding:34px 0;color:var(--muted);font-size:.92rem}
.foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
.todo{font-size:.8rem;color:var(--muted);margin-top:10px}
@media (max-width:760px){
  .menu-btn{display:inline-block}
  nav.main{display:none;position:absolute;left:0;right:0;top:64px;background:var(--bg);border-bottom:1px solid var(--border);flex-direction:column;align-items:flex-start;padding:16px 20px;gap:14px}
  nav.main.open{display:flex}
  .two{grid-template-columns:1fr}
  .hero{padding:56px 0 44px}
  section{padding:52px 0}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.btn{transition:none}}
`;
}

/* ------------------------------------------------------------------ */
/* Script embarqué (sans backticks ni ${} : injecté tel quel)           */
/* ------------------------------------------------------------------ */

const PAGE_SCRIPT = String.raw`
(function(){
  var CFG = /*__CFG__*/null;
  var $ = function(s, r){ return (r||document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  var menuBtn = $('.menu-btn'), nav = $('nav.main');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
  }

  // Envoi : sans serveur, on ouvre le logiciel de messagerie du visiteur
  // quand un e-mail de contact est renseigné.
  function finish(box, subject, lines){
    var body = lines.join('\n');
    var out = $('.notice', box.parentNode) || $('.notice');
    if (!out) return;
    if (CFG.contactKind === 'email') {
      window.location.href = 'mailto:' + encodeURIComponent(CFG.contact).replace('%40','@') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      out.textContent = 'Votre messagerie va s\u2019ouvrir avec la demande prête à envoyer.\n\n' + body;
    } else if (CFG.contactKind === 'phone') {
      out.textContent = 'Votre demande est prête. Appelez-nous au ' + CFG.contact + ' pour la confirmer :\n\n' + body;
    } else {
      out.textContent = 'Démonstration : ce site n\u2019a pas encore d\u2019adresse de contact, rien n\u2019a été envoyé.\n\n' + body;
    }
    out.className = 'notice show';
    out.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  function val(form, name){ var el = form.elements[name]; return el ? String(el.value || '').trim() : ''; }

  var quote = $('#form-devis');
  if (quote) quote.addEventListener('submit', function(e){
    e.preventDefault();
    var chosen = $$('input[name="items"]:checked', quote).map(function(i){ return i.value; });
    if (!chosen.length) { alert('Choisissez au moins un article.'); return; }
    finish(quote, 'Demande de devis', [
      'Nom : ' + val(quote,'nom'), 'E-mail : ' + val(quote,'email'),
      'Articles : ' + chosen.join(', '), 'Message : ' + (val(quote,'message') || '-')
    ]);
  });

  var rdv = $('#form-rdv');
  if (rdv) {
    var d = rdv.elements['date'];
    if (d) { var t = new Date(); d.min = t.getFullYear() + '-' + ('0'+(t.getMonth()+1)).slice(-2) + '-' + ('0'+t.getDate()).slice(-2); }
    rdv.addEventListener('submit', function(e){
      e.preventDefault();
      finish(rdv, 'Demande de rendez-vous', [
        'Nom : ' + val(rdv,'nom'), 'Contact : ' + val(rdv,'contact'),
        'Prestation : ' + val(rdv,'service'), 'Date souhaitée : ' + val(rdv,'date') + ' à ' + val(rdv,'heure'),
        'Message : ' + (val(rdv,'message') || '-')
      ]);
    });
  }

  var contact = $('#form-contact');
  if (contact) contact.addEventListener('submit', function(e){
    e.preventDefault();
    finish(contact, 'Message depuis le site', [
      'Nom : ' + val(contact,'nom'), 'E-mail : ' + val(contact,'email'), 'Message : ' + val(contact,'message')
    ]);
  });

  // Panier (vente directe)
  var cart = {};
  var bar = $('.cart-bar'), panel = $('.cart-panel');
  function fmt(n){ return n.toLocaleString('fr-FR') + ' \u20ac'; }
  function renderCart(){
    if (!bar || !panel) return;
    var ids = Object.keys(cart), count = 0, total = 0;
    var list = $('.cart-lines', panel);
    list.innerHTML = '';
    ids.forEach(function(id){
      var p = CFG.products[id], q = cart[id];
      count += q; total += p.price * q;
      var row = document.createElement('div'); row.className = 'cart-line';
      var a = document.createElement('span'); a.textContent = q + ' \u00d7 ' + p.title;
      var b = document.createElement('span'); b.textContent = fmt(p.price * q);
      row.appendChild(a); row.appendChild(b); list.appendChild(row);
    });
    $('.cart-count', bar).textContent = String(count);
    $('.cart-sum', panel).textContent = fmt(total);
    bar.classList.toggle('show', count > 0);
    if (!count) panel.classList.remove('show');
  }
  $$('[data-add]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('data-add');
      cart[id] = (cart[id] || 0) + 1; renderCart();
    });
  });
  if (bar) $('button', bar).addEventListener('click', function(){ panel.classList.toggle('show'); });
  var clear = $('.cart-clear');
  if (clear) clear.addEventListener('click', function(){ cart = {}; renderCart(); });
  var order = $('.cart-order');
  if (order) order.addEventListener('click', function(){
    var lines = Object.keys(cart).map(function(id){ return cart[id] + ' x ' + CFG.products[id].title + ' (' + fmt(CFG.products[id].price * cart[id]) + ')'; });
    if (!lines.length) return;
    finish(order, 'Commande', lines);
  });
})();
`;

/* ------------------------------------------------------------------ */
/* Assemblage de la page                                               */
/* ------------------------------------------------------------------ */

function sampleReviews(name: string): Array<{ text: string; who: string }> {
  // Textes d'EXEMPLE : le propriétaire doit les remplacer par de vrais avis.
  return [
    { text: 'Accueil très professionnel et réponse rapide à toutes mes questions.', who: 'Client A.' },
    { text: 'Un service sérieux et un résultat à la hauteur de mes attentes.', who: 'Client B.' },
    { text: `Je recommande ${name} sans hésiter.`, who: 'Client C.' },
  ];
}

const FAQ: Record<ObjectiveId, Array<{ q: string; a: string }>> = {
  devis: [
    { q: 'Comment obtenir un devis ?', a: 'Sélectionnez vos articles dans le formulaire ci-dessus et envoyez votre demande.' },
    { q: 'Le devis est-il gratuit ?', a: 'Oui, la demande de devis est gratuite et sans engagement.' },
    { q: 'Sous quel délai ai-je une réponse ?', a: 'Nous vous répondons dès que possible, généralement sous un à deux jours ouvrés.' },
  ],
  rdv: [
    { q: 'Comment prendre rendez-vous ?', a: 'Choisissez une prestation, une date et un créneau dans le formulaire, puis envoyez.' },
    { q: 'Puis-je modifier ou annuler ?', a: 'Oui, contactez-nous simplement pour déplacer ou annuler votre rendez-vous.' },
    { q: 'Que dois-je prévoir ?', a: 'Rien de particulier : nous vous précisons les détails lors de la confirmation.' },
  ],
  vente: [
    { q: 'Comment commander ?', a: 'Ajoutez les produits au panier, puis validez votre commande depuis le panier.' },
    { q: 'Quels sont les délais et frais de livraison ?', a: 'Ils vous sont communiqués au moment de la confirmation de commande.' },
    { q: 'Puis-je retourner un article ?', a: 'Oui, contactez-nous : nous vous indiquons la marche à suivre.' },
  ],
  vitrine: [
    { q: 'Qui sommes-nous ?', a: 'Une équipe engagée, attachée à la qualité de service et à la relation de confiance.' },
    { q: 'Comment vous contacter ?', a: 'Utilisez le formulaire de contact : nous répondons à chaque message.' },
    { q: 'Où intervenez-vous ?', a: 'Contactez-nous avec votre besoin, nous vous indiquerons nos possibilités.' },
  ],
};

export function buildSite(input: SiteBrief): string {
  const sector = SECTORS[input.sector] || SECTORS.btp;
  const objective: ObjectiveId = input.objective || 'devis';
  const ambiance: AmbianceId = input.ambiance || 'dark';
  const theme = THEMES[ambiance] || THEMES.dark;

  const name = clip(input.name, 60) || 'Mon entreprise';
  const notes = clip(input.notes, 300);
  const contact = parseContact(input.contact);
  const year = new Date().getFullYear();

  const eName = escapeHtml(name);
  const intro = notes ? escapeHtml(notes) : escapeHtml(sector.sub);

  const items = sector.items;
  const offerId = objective === 'vente' ? 'boutique' : objective === 'vitrine' ? 'savoir-faire' : 'offre';

  const nav: Array<[string, string]> = [[`#${offerId}`, sector.offerTitle]];
  if (objective === 'devis') nav.push(['#devis', 'Devis']);
  if (objective === 'rdv') nav.push(['#rdv', 'Rendez-vous']);
  nav.push(['#avis', 'Avis'], ['#faq', 'FAQ'], ['#contact', 'Contact']);

  const mainCta: [string, string] =
    objective === 'devis' ? ['#devis', 'Demander un devis']
    : objective === 'rdv' ? ['#rdv', 'Prendre rendez-vous']
    : objective === 'vente' ? ['#boutique', 'Voir la boutique']
    : ['#contact', 'Nous contacter'];

  const features = sector.features
    .map((f) => `<div class="card"><div class="ic" aria-hidden="true">${f.icon}</div><h3>${escapeHtml(f.title)}</h3><p>${escapeHtml(f.desc)}</p></div>`)
    .join('');

  const offerCards = items
    .map((it, i) => {
      const priced = objective === 'vente' && it.price > 0;
      const row = priced
        ? `<div class="row"><span class="price">${euro(it.price)}</span><button class="btn small" type="button" data-add="p${i}">Ajouter</button></div>`
        : '';
      return `<article class="card"><div class="ic" aria-hidden="true">${it.icon}</div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.desc)}</p>${row}</article>`;
    })
    .join('');

  const offerSection = `
<section id="${offerId}" class="${objective === 'vitrine' ? '' : 'alt'}">
  <div class="wrap">
    <h2>${escapeHtml(sector.offerTitle)}</h2>
    <p class="sub">${objective === 'vente' ? 'Ajoutez vos produits au panier en un clic.' : 'Un aperçu de ce que nous proposons.'}</p>
    <div class="grid g3">${offerCards}</div>
    ${objective === 'vente' ? '<p class="todo">Les prix affichés sont des exemples : modifiez-les dans le code avant de publier.</p>' : ''}
  </div>
</section>`;

  const notice = '<div class="notice" role="status" aria-live="polite"></div>';

  let actionSection = '';
  if (objective === 'devis') {
    const checks = items
      .map((it) => `<label><input type="checkbox" name="items" value="${escapeHtml(it.title)}"> ${it.icon} ${escapeHtml(it.title)}</label>`)
      .join('');
    actionSection = `
<section id="devis">
  <div class="wrap">
    <h2>Demandez votre devis</h2>
    <p class="sub">Cochez ce qui vous intéresse, nous vous répondons rapidement.</p>
    <form class="box" id="form-devis">
      <div class="two">
        <label>Nom<input name="nom" required autocomplete="name"></label>
        <label>E-mail<input name="email" type="email" required autocomplete="email"></label>
      </div>
      <div class="checks" role="group" aria-label="Articles">${checks}</div>
      <label>Précisions<textarea name="message" placeholder="Quantités, délais, contraintes…"></textarea></label>
      <button class="btn" type="submit">Envoyer ma demande</button>
    </form>
    ${notice}
  </div>
</section>`;
  } else if (objective === 'rdv') {
    const opts = items.map((it) => `<option>${escapeHtml(it.title)}</option>`).join('');
    const slots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].map((h) => `<option>${h}</option>`).join('');
    actionSection = `
<section id="rdv">
  <div class="wrap">
    <h2>Prenez rendez-vous</h2>
    <p class="sub">Choisissez la prestation et le créneau qui vous arrangent.</p>
    <form class="box" id="form-rdv">
      <div class="two">
        <label>Nom<input name="nom" required autocomplete="name"></label>
        <label>E-mail ou téléphone<input name="contact" required></label>
      </div>
      <label>Prestation<select name="service">${opts}</select></label>
      <div class="two">
        <label>Date souhaitée<input name="date" type="date" required></label>
        <label>Heure<select name="heure">${slots}</select></label>
      </div>
      <label>Message (facultatif)<textarea name="message"></textarea></label>
      <button class="btn" type="submit">Demander ce rendez-vous</button>
    </form>
    ${notice}
  </div>
</section>`;
  } else if (objective === 'vitrine') {
    actionSection = `
<section id="a-propos" class="alt">
  <div class="wrap">
    <h2>À propos de ${eName}</h2>
    <p class="sub">${intro}</p>
    <div class="grid g3">
      <div class="card"><div class="ic" aria-hidden="true">🎯</div><h3>Notre mission</h3><p>Apporter une réponse claire et fiable à chaque besoin.</p></div>
      <div class="card"><div class="ic" aria-hidden="true">🤝</div><h3>Nos valeurs</h3><p>Écoute, transparence et respect des engagements.</p></div>
      <div class="card"><div class="ic" aria-hidden="true">🌱</div><h3>Notre vision</h3><p>Construire des relations durables avec nos clients et partenaires.</p></div>
    </div>
  </div>
</section>`;
  }

  const reviews = sampleReviews(name)
    .map((r) => `<figure class="card quote" style="margin:0"><p>“${escapeHtml(r.text)}”</p><small>${escapeHtml(r.who)}</small></figure>`)
    .join('');

  const faq = FAQ[objective]
    .map((f) => `<details><summary>${escapeHtml(f.q)}</summary><p>${escapeHtml(f.a)}</p></details>`)
    .join('');

  const contactLine =
    contact.kind === 'email'
      ? `<p><a href="mailto:${escapeHtml(contact.value)}">${escapeHtml(contact.value)}</a></p>`
      : contact.kind === 'phone'
      ? `<p><a href="tel:${escapeHtml(contact.value.replace(/[^\d+]/g, ''))}">${escapeHtml(contact.value)}</a></p>`
      : '';

  const contactSection = `
<section id="contact" class="${objective === 'vitrine' ? '' : 'alt'}">
  <div class="wrap">
    <h2>Contact</h2>
    <p class="sub">Une question ? Écrivez-nous.</p>
    ${contactLine}
    <form class="box" id="form-contact">
      <div class="two">
        <label>Nom<input name="nom" required autocomplete="name"></label>
        <label>E-mail<input name="email" type="email" required autocomplete="email"></label>
      </div>
      <label>Message<textarea name="message" required></textarea></label>
      <button class="btn" type="submit">Envoyer</button>
    </form>
    ${objective === 'devis' || objective === 'rdv' ? '' : notice}
  </div>
</section>`;

  const cart =
    objective === 'vente'
      ? `<div class="cart-panel" role="dialog" aria-label="Panier"><h3 style="margin-top:0">Votre panier</h3><div class="cart-lines"></div><div class="cart-total"><span>Total</span><span class="cart-sum">0 €</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small cart-order" type="button">Commander</button><button class="btn small ghost cart-clear" type="button">Vider</button></div></div><div class="cart-bar"><button class="btn" type="button" aria-label="Ouvrir le panier">🛒 Panier (<span class="cart-count">0</span>)</button></div>`
      : '';

  const config = {
    contactKind: contact.kind,
    contact: contact.value,
    products: Object.fromEntries(items.map((it, i) => [`p${i}`, { title: it.title, price: it.price }])),
  };
  const script = PAGE_SCRIPT.replace('/*__CFG__*/null', jsonForScript(config));

  const description = escapeHtml(notes || sector.sub).slice(0, 160);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${eName}</title>
<meta name="description" content="${description}">
<meta property="og:title" content="${eName}">
<meta property="og:description" content="${description}">
<style>${buildCss(theme, ambiance)}</style>
</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="#top"><span aria-hidden="true">${sector.emoji}</span> ${eName}</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-label="Menu">☰</button>
    <nav class="main" aria-label="Navigation principale">
      ${nav.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join('')}
      <a class="btn small" href="${mainCta[0]}">${escapeHtml(mainCta[1])}</a>
    </nav>
  </div>
</header>
<main id="contenu">
<div id="top" class="hero">
  <div class="wrap">
    <span class="eyebrow">${sector.emoji} ${eName}</span>
    <h1>${escapeHtml(sector.headline)}</h1>
    <p class="lead">${intro}</p>
    <div class="cta-row">
      <a class="btn" href="${mainCta[0]}">${escapeHtml(mainCta[1])}</a>
      <a class="btn ghost" href="#${offerId}">${escapeHtml(sector.offerTitle)}</a>
    </div>
  </div>
</div>
<section class="alt" aria-label="Nos atouts"><div class="wrap"><div class="grid g3">${features}</div></div></section>
${objective === 'vitrine' ? actionSection + offerSection : offerSection + actionSection}
<section id="avis"><div class="wrap"><h2>Ils nous font confiance</h2><p class="sub">Les avis ci-dessous sont des exemples à remplacer par ceux de vos clients.</p><div class="grid g3">${reviews}</div></div></section>
<section id="faq" class="alt"><div class="wrap"><h2>Questions fréquentes</h2><p class="sub"></p>${faq}</div></section>
${contactSection}
</main>
<footer><div class="wrap foot"><span>© ${year} ${eName}. Tous droits réservés.</span><a href="#top">Retour en haut ↑</a></div></footer>
${cart}
<script>${script}</script>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* Brief déduit d'une phrase libre (mode « prompt rapide »)             */
/* ------------------------------------------------------------------ */

const SECTOR_KEYWORDS: Array<[SectorId, string[]]> = [
  ['btp', ['bâtiment', 'batiment', 'btp', 'travaux', 'outil', 'chantier', 'plomb', 'électri', 'electri', 'maçon', 'macon']],
  ['immo', ['immobili', 'agence immo', 'architect', 'appartement', 'location de ', 'agent immo']],
  ['sante', ['cosmétique', 'cosmetique', 'beauté', 'beaute', 'soin', 'coiff', 'massage', 'santé', 'sante', 'bien-être', 'spa']],
  ['resto', ['restaurant', 'café', 'cafe', 'boulang', 'pizz', 'traiteur', 'cuisine', 'bar ', 'brasserie']],
  ['tech', ['saas', 'logiciel', 'application', 'startup', 'cloud', 'plateforme', 'app ']],
  ['mode', ['mode', 'vêtement', 'vetement', 'boutique', 'sneaker', 'bijou', 'luxe', 'e-commerce', 'ecommerce']],
];

export function inferBrief(prompt: string): SiteBrief {
  const text = clip(prompt, 300);
  const low = text.toLowerCase();

  let sector: SectorId = 'mode';
  for (const [id, words] of SECTOR_KEYWORDS) {
    if (words.some((w) => low.includes(w))) {
      sector = id;
      break;
    }
  }

  let objective: ObjectiveId = 'vitrine';
  if (/(devis|catalogue)/.test(low)) objective = 'devis';
  else if (/(rendez-vous|rdv|réserv|reserv)/.test(low)) objective = 'rdv';
  else if (/(vend|vente|boutique|e-commerce|ecommerce|panier|commande)/.test(low)) objective = 'vente';

  let ambiance: AmbianceId = 'dark';
  if (/(clair|lumineux|blanc|épuré|epure)/.test(low)) ambiance = 'clean';
  else if (/(néon|neon|futur|cyber)/.test(low)) ambiance = 'neon';
  else if (/(robuste|industriel|chantier|btp)/.test(low)) ambiance = 'industriel';

  const quoted = text.match(/["«“]([^"»”]{2,60})["»”]/);
  const named = text.match(/(?:s['’]appelle|nommé|nommée|appelé|appelée)\s+([A-Za-zÀ-ÿ0-9][\wÀ-ÿ' -]{1,40})/i);
  const name = quoted ? quoted[1] : named ? named[1].trim() : '';

  return { name, sector, objective, ambiance, notes: text, contact: '' };
}
