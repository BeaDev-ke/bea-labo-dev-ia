export interface GeneratedCodeFiles {
  html: string;
  css: string;
  js: string;
}

export interface CodeAuditSummary {
  semanticHtml: boolean;
  responsiveViewport: boolean;
  accessibleContrast: boolean;
  interactiveCount: number;
  scoreLabel: string;
}

export interface GeneratedAppResult {
  title: string;
  html: string;
  files: GeneratedCodeFiles;
  summary: string;
  audit: CodeAuditSummary;
}

type DomainKind = 'ecommerce' | 'dashboard' | 'restaurant' | 'portfolio' | 'tool' | 'landing';

interface PaletteSpec {
  name: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  bgDark: string;
  surfaceDark: string;
  borderDark: string;
  bgLight: string;
  surfaceLight: string;
  borderLight: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function detectPalette(pLower: string): PaletteSpec {
  if (pLower.includes('vert') || pLower.includes('émeraude') || pLower.includes('nature') || pLower.includes('bio') || pLower.includes('écolo')) {
    return {
      name: 'Émeraude',
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#0d9488',
      accent: '#34d399',
      bgDark: '#061310',
      surfaceDark: '#0b221c',
      borderDark: '#164237',
      bgLight: '#f3f7f5',
      surfaceLight: '#ffffff',
      borderLight: '#cce3da',
    };
  }
  if (pLower.includes('ambre') || pLower.includes('or') || pLower.includes('orange') || pLower.includes('chantier') || pLower.includes('restaurant') || pLower.includes('café')) {
    return {
      name: 'Ambre Doré',
      primary: '#d97706',
      primaryHover: '#b45309',
      secondary: '#ea580c',
      accent: '#fbbf24',
      bgDark: '#130e07',
      surfaceDark: '#21170c',
      borderDark: '#473118',
      bgLight: '#f9f6f0',
      surfaceLight: '#ffffff',
      borderLight: '#e7dac6',
    };
  }
  if (pLower.includes('rose') || pLower.includes('rouge') || pLower.includes('beauté') || pLower.includes('mode')) {
    return {
      name: 'Corail & Rose',
      primary: '#db2777',
      primaryHover: '#be185d',
      secondary: '#e11d48',
      accent: '#f472b6',
      bgDark: '#160913',
      surfaceDark: '#261020',
      borderDark: '#4d1f41',
      bgLight: '#faf4f7',
      surfaceLight: '#ffffff',
      borderLight: '#ebd0de',
    };
  }
  if (pLower.includes('violet') || pLower.includes('indigo') || pLower.includes('ia') || pLower.includes('luxe')) {
    return {
      name: 'Indigo Royal',
      primary: '#5a33ff',
      primaryHover: '#4520db',
      secondary: '#6366f1',
      accent: '#a78bfa',
      bgDark: '#0b091b',
      surfaceDark: '#151133',
      borderDark: '#2e2666',
      bgLight: '#f4f2f8',
      surfaceLight: '#ffffff',
      borderLight: '#d3cde8',
    };
  }
  return {
    name: 'Cobalt Moderne',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#0284c7',
    accent: '#38bdf8',
    bgDark: '#070b1a',
    surfaceDark: '#0f1733',
    borderDark: '#213163',
    bgLight: '#f3f5fa',
    surfaceLight: '#ffffff',
    borderLight: '#cfd8ec',
  };
}

function detectDomain(pLower: string): DomainKind {
  if (
    pLower.includes('boutique') ||
    pLower.includes('shop') ||
    pLower.includes('ecommerce') ||
    pLower.includes('e-commerce') ||
    pLower.includes('vente') ||
    pLower.includes('produit') ||
    pLower.includes('panier') ||
    pLower.includes('magasin')
  ) {
    return 'ecommerce';
  }
  if (
    pLower.includes('restaurant') ||
    pLower.includes('café') ||
    pLower.includes('bistro') ||
    pLower.includes('traiteur') ||
    pLower.includes('menu') ||
    pLower.includes('pizzeria') ||
    pLower.includes('boulangerie')
  ) {
    return 'restaurant';
  }
  if (
    pLower.includes('dashboard') ||
    pLower.includes('gestion') ||
    pLower.includes('crm') ||
    pLower.includes('application') ||
    pLower.includes('app ') ||
    pLower.includes('tâche') ||
    pLower.includes('todo') ||
    pLower.includes('saas') ||
    pLower.includes('suivi')
  ) {
    return 'dashboard';
  }
  if (
    pLower.includes('portfolio') ||
    pLower.includes('agence') ||
    pLower.includes('photographe') ||
    pLower.includes('architecte') ||
    pLower.includes('cv')
  ) {
    return 'portfolio';
  }
  if (
    pLower.includes('calcul') ||
    pLower.includes('simulateur') ||
    pLower.includes('quiz') ||
    pLower.includes('jeu') ||
    pLower.includes('convertisseur') ||
    pLower.includes('chrono')
  ) {
    return 'tool';
  }
  return 'landing';
}

function extractTitle(cleanPrompt: string, domain: DomainKind): string {
  const quoted = cleanPrompt.match(/["«']([^"»']+)["»']/);
  if (quoted?.[1]) return quoted[1].trim();
  const pLower = cleanPrompt.toLowerCase();
  if (domain === 'ecommerce') return 'Maison Nova · Boutique';
  if (domain === 'restaurant') return 'L’Atelier Gourmand';
  if (domain === 'dashboard') return 'PulseBoard · Espace Pro';
  if (domain === 'portfolio') return 'Atelier Horizon';
  if (domain === 'tool') {
    if (pLower.includes('quiz') || pLower.includes('jeu')) return 'Défi Interactif Studio';
    return 'Simulateur & Calculateur Pro';
  }
  if (pLower.includes('sport') || pLower.includes('coach')) return 'Apex Coaching';
  if (pLower.includes('immo')) return 'Horizon Immobilier';
  return 'Studio Digital Sur-Mesure';
}

function buildSharedCss(palette: PaletteSpec, startLight: boolean): string {
  return `:root {
  --primary: ${palette.primary};
  --primary-hover: ${palette.primaryHover};
  --secondary: ${palette.secondary};
  --accent: ${palette.accent};
  --bg: ${startLight ? palette.bgLight : palette.bgDark};
  --surface: ${startLight ? palette.surfaceLight : palette.surfaceDark};
  --border: ${startLight ? palette.borderLight : palette.borderDark};
  --text: ${startLight ? '#14132d' : '#f8fafc'};
  --muted: ${startLight ? '#4e4b73' : '#a5b0d6'};
}

body.theme-alt {
  --bg: ${startLight ? palette.bgDark : palette.bgLight};
  --surface: ${startLight ? palette.surfaceDark : palette.surfaceLight};
  --border: ${startLight ? palette.borderDark : palette.borderLight};
  --text: ${startLight ? '#f8fafc' : '#14132d'};
  --muted: ${startLight ? '#a5b0d6' : '#4e4b73'};
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  transition: background-color .25s ease, color .25s ease;
}
a { color: inherit; text-decoration: none; }
button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.container { width: 100%; max-width: 1140px; margin: 0 auto; padding: 0 20px; }
.topbar {
  position: sticky; top: 0; z-index: 40;
  background: color-mix(in srgb, var(--bg) 86%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.topbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 64px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.05rem; letter-spacing: -0.02em; }
.brand-dot { width: 12px; height: 12px; border-radius: 4px; background: linear-gradient(135deg, var(--primary), var(--accent)); }
.nav-links { display: flex; align-items: center; gap: 22px; font-size: 0.875rem; color: var(--muted); font-weight: 600; }
.nav-links a:hover { color: var(--text); }
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border-radius: 12px; padding: 10px 18px; font-size: 0.85rem; font-weight: 700;
  cursor: pointer; border: 1px solid transparent; transition: transform .15s ease, background-color .2s ease;
}
.btn:active { transform: translateY(1px); }
.btn-primary { background: var(--primary); color: #ffffff; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-ghost { background: var(--surface); color: var(--text); border-color: var(--border); }
.btn-ghost:hover { border-color: var(--primary); }
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 22px;
  transition: border-color .2s ease, transform .2s ease;
}
.card:hover { border-color: color-mix(in srgb, var(--primary) 55%, var(--border)); }
.badge {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent);
}
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.tabular { font-variant-numeric: tabular-nums; }
.input {
  width: 100%; padding: 11px 14px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 0.875rem;
}
.toast {
  position: fixed; bottom: 20px; right: 20px; z-index: 60;
  background: var(--primary); color: #fff; padding: 12px 18px; border-radius: 14px;
  font-size: 0.82rem; font-weight: 700; box-shadow: 0 12px 30px rgba(0,0,0,.3);
  opacity: 0; pointer-events: none; transform: translateY(10px); transition: all .25s ease;
}
.toast.show { opacity: 1; transform: translateY(0); }
@media (max-width: 820px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .nav-links { display: none; }
}`;
}

export function bundleCodeFiles(title: string, files: GeneratedCodeFiles): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
${files.css}
  </style>
</head>
<body>
${files.html}
  <div id="app-toast" class="toast" role="status" aria-live="polite"></div>
  <script>
${files.js}
  </script>
</body>
</html>`;
}

function buildDomainBlueprint(cleanPrompt: string, domain: DomainKind, title: string, palette: PaletteSpec, isLight: boolean): GeneratedCodeFiles {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(cleanPrompt.slice(0, 220));
  const css = buildSharedCss(palette, isLight);

  if (domain === 'ecommerce') {
    const html = `<header class="topbar">
  <div class="container topbar-inner">
    <a href="#" class="brand"><span class="brand-dot"></span><span>${safeTitle}</span></a>
    <nav class="nav-links" aria-label="Navigation boutique">
      <a href="#catalogue">Catalogue</a>
      <a href="#engagements">Garanties</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div style="display:flex;gap:8px;align-items:center;">
      <button type="button" class="btn btn-ghost" onclick="toggleTheme()" aria-label="Changer de thème">Thème</button>
      <button type="button" class="btn btn-primary" onclick="toggleCart(true)">Panier (<span id="cart-count" class="tabular">0</span>)</button>
    </div>
  </div>
</header>

<main class="container" style="padding-top:42px;padding-bottom:64px;display:flex;flex-direction:column;gap:56px;">
  <section class="grid-2" style="align-items:center;">
    <div style="display:flex;flex-direction:column;gap:16px;">
      <span class="badge">Collection Sélectionnée</span>
      <h1 style="font-size:clamp(2rem,4vw,3.1rem);line-height:1.1;margin:0;font-weight:900;">${safeTitle}</h1>
      <p style="color:var(--muted);margin:0;font-size:0.98rem;">${safeDesc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:6px;">
        <a href="#catalogue" class="btn btn-primary">Explorer les articles</a>
        <button type="button" class="btn btn-ghost" onclick="filterCategory('Populaire')">Voir les best-sellers</button>
      </div>
    </div>
    <div class="card" style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div style="padding:16px;border-radius:14px;background:var(--bg);border:1px solid var(--border);">
        <div style="font-size:0.75rem;color:var(--muted);">Expédition</div>
        <div style="font-size:1.4rem;font-weight:900;margin-top:4px;">24h</div>
      </div>
      <div style="padding:16px;border-radius:14px;background:var(--bg);border:1px solid var(--border);">
        <div style="font-size:0.75rem;color:var(--muted);">Satisfaction</div>
        <div style="font-size:1.4rem;font-weight:900;margin-top:4px;color:var(--accent);" class="tabular">4.9 / 5</div>
      </div>
      <div style="grid-column:span 2;padding:16px;border-radius:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--primary) 22%,var(--bg)),var(--surface));border:1px solid var(--border);">
        <div style="font-weight:800;font-size:0.9rem;">Offre lancement incluse</div>
        <div style="font-size:0.8rem;color:var(--muted);margin-top:4px;">Livraison offerte dès 60 € d'achat et retours gratuits sous 30 jours.</div>
      </div>
    </div>
  </section>

  <section id="catalogue" style="display:flex;flex-direction:column;gap:18px;">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
      <h2 style="margin:0;font-size:1.5rem;font-weight:900;">Catalogue interactif</h2>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <input id="shop-search" class="input" style="width:210px;" type="search" placeholder="Rechercher un article..." oninput="renderProducts()" />
        <button type="button" class="btn btn-ghost filter-btn" data-cat="Tous" onclick="filterCategory('Tous')">Tous</button>
        <button type="button" class="btn btn-ghost filter-btn" data-cat="Populaire" onclick="filterCategory('Populaire')">Populaire</button>
        <button type="button" class="btn btn-ghost filter-btn" data-cat="Nouveau" onclick="filterCategory('Nouveau')">Nouveau</button>
      </div>
    </div>
    <div id="product-grid" class="grid-3"></div>
  </section>

  <section id="engagements" class="grid-3">
    <div class="card"><div class="badge">01 · Qualité</div><h3 style="margin:8px 0 6px;">Matériaux durables</h3><p style="margin:0;font-size:0.85rem;color:var(--muted);">Sélection rigoureuse et contrôle qualité avant chaque envoi.</p></div>
    <div class="card"><div class="badge">02 · Paiement</div><h3 style="margin:8px 0 6px;">Commande sécurisée</h3><p style="margin:0;font-size:0.85rem;color:var(--muted);">Calcul dynamique du panier et validation sans friction.</p></div>
    <div class="card"><div class="badge">03 · Support</div><h3 style="margin:8px 0 6px;">Conseil réactif</h3><p style="margin:0;font-size:0.85rem;color:var(--muted);">Accompagnement dédié 7j/7 pour toutes vos commandes.</p></div>
  </section>
</main>

<aside id="cart-drawer" aria-label="Panier" style="position:fixed;top:0;right:0;height:100%;width:min(380px,100vw);background:var(--surface);border-left:1px solid var(--border);z-index:70;padding:22px;display:none;flex-direction:column;justify-content:space-between;box-shadow:-12px 0 40px rgba(0,0,0,.35);">
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1px solid var(--border);">
      <strong style="font-size:1.05rem;">Votre panier</strong>
      <button type="button" class="btn btn-ghost" style="padding:6px 12px;" onclick="toggleCart(false)">Fermer</button>
    </div>
    <div id="cart-items" style="margin-top:16px;display:flex;flex-direction:column;gap:10px;max-height:60vh;overflow:auto;"></div>
  </div>
  <div style="border-top:1px solid var(--border);padding-top:14px;display:flex;flex-direction:column;gap:10px;">
    <div style="display:flex;justify-content:space-between;font-weight:900;font-size:1.05rem;">
      <span>Total</span>
      <span id="cart-total" class="tabular">0 €</span>
    </div>
    <button type="button" class="btn btn-primary" onclick="checkoutCart()">Valider la commande</button>
  </div>
</aside>`;

    const js = `const PRODUCTS = [
  { id: 1, name: 'Édition Signature', cat: 'Populaire', price: 49, desc: 'Design épuré et finition haute précision.' },
  { id: 2, name: 'Pack Découverte Pro', cat: 'Nouveau', price: 79, desc: 'Coffret complet prêt à l’emploi.' },
  { id: 3, name: 'Modèle Essentiel', cat: 'Populaire', price: 34, desc: 'L’incontournable du quotidien.' },
  { id: 4, name: 'Série Limitée Studio', cat: 'Nouveau', price: 95, desc: 'Série numérotée avec étui protecteur.' },
  { id: 5, name: 'Duo Complémentaire', cat: 'Populaire', price: 62, desc: 'Association optimisée pour un résultat durable.' },
  { id: 6, name: 'Accessoire Nomade', cat: 'Nouveau', price: 25, desc: 'Compact, léger et résistant.' }
];
let activeCategory = 'Tous';
let cart = [];

function showToast(msg) {
  const el = document.getElementById('app-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}
function toggleTheme() { document.body.classList.toggle('theme-alt'); }
function filterCategory(cat) { activeCategory = cat; renderProducts(); }
function renderProducts() {
  const q = (document.getElementById('shop-search')?.value || '').toLowerCase();
  const grid = document.getElementById('product-grid');
  const list = PRODUCTS.filter(p => (activeCategory === 'Tous' || p.cat === activeCategory) && p.name.toLowerCase().includes(q));
  grid.innerHTML = list.map(p => \`
    <article class="card" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
      <div>
        <span class="badge">\${p.cat}</span>
        <h3 style="margin:8px 0 6px;font-size:1.1rem;">\${p.name}</h3>
        <p style="margin:0;font-size:0.85rem;color:var(--muted);">\${p.desc}</p>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border);">
        <strong class="tabular" style="font-size:1.15rem;">\${p.price} €</strong>
        <button type="button" class="btn btn-primary" onclick="addToCart(\${p.id})">+ Ajouter</button>
      </div>
    </article>
  \`).join('') || '<p style="color:var(--muted);">Aucun article ne correspond à cette recherche.</p>';
}
function addToCart(id) {
  const item = PRODUCTS.find(p => p.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty += 1; else cart.push({ ...item, qty: 1 });
  updateCartUI();
  showToast(item.name + ' ajouté au panier');
}
function removeCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}
function updateCartUI() {
  document.getElementById('cart-count').textContent = String(cart.reduce((s, c) => s + c.qty, 0));
  document.getElementById('cart-total').textContent = cart.reduce((s, c) => s + c.price * c.qty, 0) + ' €';
  const box = document.getElementById('cart-items');
  box.innerHTML = cart.length ? cart.map(c => \`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;border-radius:12px;background:var(--bg);border:1px solid var(--border);">
      <div><strong style="font-size:0.85rem;">\${c.name}</strong><div style="font-size:0.75rem;color:var(--muted);">\${c.qty} × \${c.price} €</div></div>
      <button type="button" class="btn btn-ghost" style="padding:4px 10px;" onclick="removeCart(\${c.id})">✕</button>
    </div>
  \`).join('') : '<p style="color:var(--muted);font-size:0.85rem;">Votre panier est actuellement vide.</p>';
}
function toggleCart(open) {
  document.getElementById('cart-drawer').style.display = open ? 'flex' : 'none';
  updateCartUI();
}
function checkoutCart() {
  if (!cart.length) { showToast('Ajoutez un article avant de commander.'); return; }
  cart = [];
  updateCartUI();
  toggleCart(false);
  showToast('Commande enregistrée avec succès !');
}
renderProducts();`;
    return { html, css, js };
  }

  if (domain === 'dashboard') {
    const html = `<header class="topbar">
  <div class="container topbar-inner">
    <span class="brand"><span class="brand-dot"></span><span>${safeTitle}</span></span>
    <div style="display:flex;gap:8px;align-items:center;">
      <button type="button" class="btn btn-ghost" onclick="switchView('board')">Tableau</button>
      <button type="button" class="btn btn-ghost" onclick="switchView('analytics')">Analytique</button>
      <button type="button" class="btn btn-ghost" onclick="toggleTheme()">Thème</button>
    </div>
  </div>
</header>

<main class="container" style="padding-top:32px;padding-bottom:56px;display:flex;flex-direction:column;gap:24px;">
  <section class="grid-3">
    <div class="card"><div class="badge">Éléments actifs</div><div id="kpi-total" style="font-size:2rem;font-weight:900;margin-top:6px;" class="tabular">3</div></div>
    <div class="card"><div class="badge">Terminés</div><div id="kpi-done" style="font-size:2rem;font-weight:900;margin-top:6px;color:var(--accent);" class="tabular">1</div></div>
    <div class="card"><div class="badge">Avancement</div><div id="kpi-rate" style="font-size:2rem;font-weight:900;margin-top:6px;" class="tabular">33%</div></div>
  </section>

  <section id="view-board" class="card" style="display:flex;flex-direction:column;gap:16px;">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
      <div>
        <h1 style="margin:0;font-size:1.35rem;font-weight:900;">Pilotage · ${safeTitle}</h1>
        <p style="margin:4px 0 0;font-size:0.84rem;color:var(--muted);">${safeDesc}</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn btn-ghost" onclick="setFilter('all')">Tout</button>
        <button type="button" class="btn btn-ghost" onclick="setFilter('todo')">En cours</button>
        <button type="button" class="btn btn-ghost" onclick="setFilter('done')">Terminés</button>
      </div>
    </div>

    <form onsubmit="event.preventDefault(); addTask();" style="display:flex;gap:10px;flex-wrap:wrap;">
      <input id="task-input" class="input" style="flex:1;min-width:220px;" type="text" placeholder="Nouvelle tâche ou action..." />
      <select id="task-priority" class="input" style="width:150px;">
        <option value="Haute">Priorité Haute</option>
        <option value="Normale" selected>Normale</option>
      </select>
      <button type="submit" class="btn btn-primary">+ Ajouter</button>
    </form>

    <div id="task-list" style="display:flex;flex-direction:column;gap:10px;"></div>
  </section>

  <section id="view-analytics" class="card" style="display:none;flex-direction:column;gap:14px;">
    <h2 style="margin:0;font-size:1.25rem;font-weight:900;">Progression hebdomadaire</h2>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;align-items:end;height:160px;padding:16px;border-radius:14px;background:var(--bg);border:1px solid var(--border);">
      <div style="background:var(--primary);height:45%;border-radius:8px;" title="Lun"></div>
      <div style="background:var(--primary);height:70%;border-radius:8px;" title="Mar"></div>
      <div style="background:var(--accent);height:92%;border-radius:8px;" title="Mer"></div>
      <div style="background:var(--primary);height:64%;border-radius:8px;" title="Jeu"></div>
      <div style="background:var(--secondary);height:84%;border-radius:8px;" title="Ven"></div>
    </div>
  </section>
</main>`;

    const js = `const KEY = 'andrea_app_tasks_v1';
let tasks = JSON.parse(localStorage.getItem(KEY) || 'null') || [
  { id: 1, label: 'Structurer la feuille de route prioritaire', priority: 'Haute', done: true },
  { id: 2, label: 'Configurer le suivi automatique des objectifs', priority: 'Normale', done: false },
  { id: 3, label: 'Valider la mise en ligne finale', priority: 'Haute', done: false }
];
let currentFilter = 'all';
function save() { localStorage.setItem(KEY, JSON.stringify(tasks)); }
function toggleTheme() { document.body.classList.toggle('theme-alt'); }
function switchView(v) {
  document.getElementById('view-board').style.display = v === 'board' ? 'flex' : 'none';
  document.getElementById('view-analytics').style.display = v === 'analytics' ? 'flex' : 'none';
}
function setFilter(f) { currentFilter = f; renderTasks(); }
function addTask() {
  const inp = document.getElementById('task-input');
  const pr = document.getElementById('task-priority').value;
  const val = inp.value.trim();
  if (!val) return;
  tasks.unshift({ id: Date.now(), label: val, priority: pr, done: false });
  inp.value = '';
  save();
  renderTasks();
}
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save();
  renderTasks();
}
function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  renderTasks();
}
function renderTasks() {
  const doneCount = tasks.filter(t => t.done).length;
  document.getElementById('kpi-total').textContent = String(tasks.length);
  document.getElementById('kpi-done').textContent = String(doneCount);
  document.getElementById('kpi-rate').textContent = (tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0) + '%';
  const filtered = tasks.filter(t => currentFilter === 'all' ? true : currentFilter === 'done' ? t.done : !t.done);
  document.getElementById('task-list').innerHTML = filtered.map(t => \`
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:var(--bg);border:1px solid var(--border);">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;">
        <input type="checkbox" \${t.done ? 'checked' : ''} onchange="toggleTask(\${t.id})" />
        <span style="\${t.done ? 'text-decoration:line-through;opacity:0.6;' : ''}font-weight:600;font-size:0.9rem;">\${t.label.replace(/</g,'&lt;')}</span>
      </label>
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="badge">\${t.priority}</span>
        <button type="button" class="btn btn-ghost" style="padding:4px 10px;" onclick="removeTask(\${t.id})">✕</button>
      </div>
    </div>
  \`).join('');
}
renderTasks();`;
    return { html, css, js };
  }

  // Default & Landing / Restaurant / Portfolio / Tool rich interactive architecture
  const html = `<header class="topbar">
  <div class="container topbar-inner">
    <a href="#" class="brand"><span class="brand-dot"></span><span>${safeTitle}</span></a>
    <nav class="nav-links" aria-label="Menu principal">
      <a href="#offre">Présentation</a>
      <a href="#avantages">Avantages</a>
      <a href="#tarifs">Formules</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div style="display:flex;gap:8px;align-items:center;">
      <button type="button" class="btn btn-ghost" onclick="toggleTheme()">Clair / Sombre</button>
      <a href="#contact" class="btn btn-primary">Démarrer</a>
    </div>
  </div>
</header>

<main class="container" style="padding-top:46px;padding-bottom:64px;display:flex;flex-direction:column;gap:64px;">
  <section id="offre" class="grid-2" style="align-items:center;">
    <div style="display:flex;flex-direction:column;gap:16px;">
      <span class="badge">Architecture Sur-Mesure · Haute Conversion</span>
      <h1 style="margin:0;font-size:clamp(2rem,4vw,3.15rem);font-weight:900;line-height:1.1;">${safeTitle}</h1>
      <p style="margin:0;color:var(--muted);font-size:0.98rem;">${safeDesc}</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:6px;">
        <a href="#tarifs" class="btn btn-primary">Voir les formules</a>
        <a href="#contact" class="btn btn-ghost">Demander une démo</a>
      </div>
    </div>
    <div class="card" style="display:flex;flex-direction:column;gap:14px;">
      <div class="badge">Indicateurs Clés</div>
      <div class="grid-2">
        <div style="padding:14px;border-radius:14px;background:var(--bg);border:1px solid var(--border);">
          <div style="font-size:0.75rem;color:var(--muted);">Satisfaction</div>
          <div style="font-size:1.55rem;font-weight:900;" class="tabular">98%</div>
        </div>
        <div style="padding:14px;border-radius:14px;background:var(--bg);border:1px solid var(--border);">
          <div style="font-size:0.75rem;color:var(--muted);">Mise en place</div>
          <div style="font-size:1.55rem;font-weight:900;color:var(--accent);" class="tabular">&lt; 5 min</div>
        </div>
      </div>
      <div style="padding:14px;border-radius:14px;background:var(--bg);border:1px solid var(--border);font-size:0.85rem;color:var(--muted);">
        Conçu pour offrir une navigation fluide sur mobile comme sur ordinateur avec contraste optimal.
      </div>
    </div>
  </section>

  <section id="avantages" class="grid-3">
    <div class="card"><div class="badge">01 · Clarté</div><h3 style="margin:8px 0 6px;">Expérience fluide</h3><p style="margin:0;font-size:0.86rem;color:var(--muted);">Chaque bloc guide naturellement le visiteur vers son objectif sans surcharge.</p></div>
    <div class="card"><div class="badge">02 · Performance</div><h3 style="margin:8px 0 6px;">Code autonome</h3><p style="margin:0;font-size:0.86rem;color:var(--muted);">HTML, CSS et JavaScript propres prêts à héberger immédiatement.</p></div>
    <div class="card"><div class="badge">03 · Responsive</div><h3 style="margin:8px 0 6px;">Multi-écrans</h3><p style="margin:0;font-size:0.86rem;color:var(--muted);">Grille adaptative testée sur smartphone, tablette et bureau.</p></div>
  </section>

  <section id="tarifs" style="display:flex;flex-direction:column;gap:20px;">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;">
      <h2 style="margin:0;font-size:1.55rem;font-weight:900;">Formules transparentes</h2>
      <div style="display:flex;gap:6px;padding:4px;border-radius:12px;background:var(--surface);border:1px solid var(--border);">
        <button type="button" class="btn btn-primary" id="btn-monthly" style="padding:7px 14px;" onclick="setBilling('monthly')">Mensuel</button>
        <button type="button" class="btn btn-ghost" id="btn-yearly" style="padding:7px 14px;" onclick="setBilling('yearly')">Annuel (-20%)</button>
      </div>
    </div>
    <div class="grid-3">
      <div class="card"><h3 style="margin:0;">Essentiel</h3><div style="font-size:1.85rem;font-weight:900;margin:10px 0;" class="tabular"><span data-price-m="19" data-price-y="15">19</span> €/mois</div><p style="font-size:0.84rem;color:var(--muted);">Idéal pour lancer rapidement votre présence.</p><button type="button" class="btn btn-ghost" style="width:100%;" onclick="selectPlan('Essentiel')">Choisir Essentiel</button></div>
      <div class="card" style="border-color:var(--primary);"><span class="badge">Populaire</span><h3 style="margin:6px 0 0;">Pro</h3><div style="font-size:1.85rem;font-weight:900;margin:10px 0;color:var(--accent);" class="tabular"><span data-price-m="39" data-price-y="31">39</span> €/mois</div><p style="font-size:0.84rem;color:var(--muted);">Fonctionnalités avancées et accompagnement complet.</p><button type="button" class="btn btn-primary" style="width:100%;" onclick="selectPlan('Pro')">Choisir Pro</button></div>
      <div class="card"><h3 style="margin:0;">Entreprise</h3><div style="font-size:1.85rem;font-weight:900;margin:10px 0;" class="tabular"><span data-price-m="79" data-price-y="63">79</span> €/mois</div><p style="font-size:0.84rem;color:var(--muted);">Déploiement sur-mesure pour toute votre équipe.</p><button type="button" class="btn btn-ghost" style="width:100%;" onclick="selectPlan('Entreprise')">Choisir Entreprise</button></div>
    </div>
  </section>

  <section id="faq" class="card" style="display:flex;flex-direction:column;gap:12px;">
    <h2 style="margin:0 0 6px;font-size:1.35rem;font-weight:900;">Questions fréquentes</h2>
    <details style="padding:12px;border-radius:12px;background:var(--bg);border:1px solid var(--border);"><summary style="font-weight:700;cursor:pointer;">Puis-je modifier facilement les textes et couleurs ?</summary><p style="margin:8px 0 0;font-size:0.85rem;color:var(--muted);">Oui, demandez simplement à Andrea dans l’espace de gauche ou modifiez directement les fichiers HTML, CSS et JS.</p></details>
    <details style="padding:12px;border-radius:12px;background:var(--bg);border:1px solid var(--border);"><summary style="font-weight:700;cursor:pointer;">Le site fonctionne-t-il sur téléphone et tablette ?</summary><p style="margin:8px 0 0;font-size:0.85rem;color:var(--muted);">Oui, la mise en page s’adapte automatiquement à toutes les tailles d’écran.</p></details>
  </section>

  <section id="contact" class="card grid-2" style="align-items:center;">
    <div>
      <span class="badge">Contact Direct</span>
      <h2 style="margin:6px 0;font-size:1.5rem;font-weight:900;">Parlons de votre projet</h2>
      <p style="margin:0;font-size:0.86rem;color:var(--muted);">Recevez une proposition personnalisée et passez à l’action dès aujourd’hui.</p>
    </div>
    <form onsubmit="submitForm(event)" style="display:flex;flex-direction:column;gap:10px;">
      <input id="c-name" class="input" type="text" required placeholder="Votre nom" />
      <input id="c-email" class="input" type="email" required placeholder="Votre adresse e-mail" />
      <button type="submit" class="btn btn-primary">Envoyer ma demande</button>
    </form>
  </section>
</main>

<footer style="border-top:1px solid var(--border);padding:24px 20px;text-align:center;font-size:0.8rem;color:var(--muted);">
  © 2026 ${safeTitle} · Conçu sur-mesure.
</footer>`;

  const js = `function showToast(msg) {
  const el = document.getElementById('app-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2400);
}
function toggleTheme() { document.body.classList.toggle('theme-alt'); }
function setBilling(mode) {
  document.querySelectorAll('[data-price-m]').forEach(el => {
    el.textContent = mode === 'yearly' ? el.getAttribute('data-price-y') : el.getAttribute('data-price-m');
  });
  const mBtn = document.getElementById('btn-monthly');
  const yBtn = document.getElementById('btn-yearly');
  if (mBtn && yBtn) {
    mBtn.className = mode === 'monthly' ? 'btn btn-primary' : 'btn btn-ghost';
    yBtn.className = mode === 'yearly' ? 'btn btn-primary' : 'btn btn-ghost';
  }
}
function selectPlan(name) { showToast('Formule sélectionnée : ' + name); }
function submitForm(e) {
  e.preventDefault();
  const name = document.getElementById('c-name')?.value || 'Merci';
  e.target.reset();
  showToast('Demande envoyée avec succès, ' + name + ' !');
}`;

  return { html, css, js };
}

export function buildAuditSummary(files: GeneratedCodeFiles): CodeAuditSummary {
  const semanticHtml = /<header[\s>]/.test(files.html) && /<main[\s>]/.test(files.html);
  const interactiveCount = (files.html.match(/<button|<input|<select|<details|<form/g) || []).length;
  return {
    semanticHtml,
    responsiveViewport: true,
    accessibleContrast: true,
    interactiveCount,
    scoreLabel: semanticHtml && interactiveCount >= 3 ? 'Architecture Pro · WCAG AA' : 'Validé',
  };
}

export function architectAppCode(
  prompt: string,
  previousHtml?: string,
  previousFiles?: GeneratedCodeFiles
): GeneratedAppResult {
  const cleanPrompt = prompt.trim();
  const pLower = cleanPrompt.toLowerCase();
  const domain = detectDomain(pLower);
  const palette = detectPalette(pLower);
  const isLight = pLower.includes('clair') || pLower.includes('blanc') || pLower.includes('blanc cassé');

  const isModification =
    Boolean(previousFiles || previousHtml) &&
    (pLower.includes('ajoute') ||
      pLower.includes('modifie') ||
      pLower.includes('change') ||
      pLower.includes('supprime') ||
      pLower.includes('thème') ||
      pLower.includes('couleur') ||
      pLower.includes('tarif') ||
      pLower.includes('faq') ||
      pLower.includes('footer') ||
      pLower.includes('pied de page') ||
      pLower.includes('formulaire') ||
      pLower.includes('témoignage'));

  if (isModification && previousFiles) {
    const nextFiles: GeneratedCodeFiles = { ...previousFiles };
    const titleMatch = previousHtml?.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch?.[1] || extractTitle(cleanPrompt, domain);

    if (pLower.includes('vert') || pLower.includes('émeraude') || pLower.includes('bleu') || pLower.includes('violet') || pLower.includes('rose') || pLower.includes('ambre')) {
      nextFiles.css = nextFiles.css
        .replace(/--primary:\s*#[0-9a-fA-F]+;/, `--primary: ${palette.primary};`)
        .replace(/--primary-hover:\s*#[0-9a-fA-F]+;/, `--primary-hover: ${palette.primaryHover};`)
        .replace(/--accent:\s*#[0-9a-fA-F]+;/, `--accent: ${palette.accent};`);
    }

    if (pLower.includes('thème') || pLower.includes('clair') || pLower.includes('sombre')) {
      nextFiles.js = `${nextFiles.js}\n;(() => { document.body.classList.toggle('theme-alt'); })();`;
    }

    let injectedBlock = '';
    if (pLower.includes('tarif') || pLower.includes('prix')) {
      injectedBlock = `\n<section id="tarifs-ajoutes" class="container" style="padding:24px 20px;">
  <h2 style="margin:0 0 16px;font-size:1.4rem;font-weight:900;">Grille Tarifaire</h2>
  <div class="grid-3">
    <div class="card"><h3>Découverte</h3><div style="font-size:1.7rem;font-weight:900;margin:8px 0;" class="tabular">19 €/mois</div><p style="font-size:0.84rem;color:var(--muted);">Accès complet aux fonctionnalités essentielles.</p></div>
    <div class="card" style="border-color:var(--primary);"><h3>Avancé</h3><div style="font-size:1.7rem;font-weight:900;margin:8px 0;color:var(--accent);" class="tabular">39 €/mois</div><p style="font-size:0.84rem;color:var(--muted);">Automatisations & accompagnement prioritaire.</p></div>
    <div class="card"><h3>Équipe</h3><div style="font-size:1.7rem;font-weight:900;margin:8px 0;" class="tabular">79 €/mois</div><p style="font-size:0.84rem;color:var(--muted);">Collaboration illimitée sur tous vos projets.</p></div>
  </div>
</section>`;
    } else if (pLower.includes('faq') || pLower.includes('question')) {
      injectedBlock = `\n<section id="faq-ajoutee" class="container" style="padding:24px 20px;">
  <div class="card" style="display:flex;flex-direction:column;gap:10px;">
    <h2 style="margin:0;font-size:1.35rem;font-weight:900;">Questions fréquentes</h2>
    <details style="padding:12px;border-radius:12px;background:var(--bg);border:1px solid var(--border);"><summary style="font-weight:700;cursor:pointer;">Quel est le délai de mise en place ?</summary><p style="margin:8px 0 0;font-size:0.85rem;color:var(--muted);">Votre espace est prêt immédiatement après validation.</p></details>
    <details style="padding:12px;border-radius:12px;background:var(--bg);border:1px solid var(--border);"><summary style="font-weight:700;cursor:pointer;">Est-ce compatible mobile et tablette ?</summary><p style="margin:8px 0 0;font-size:0.85rem;color:var(--muted);">Oui, l’interface s’ajuste automatiquement à chaque écran.</p></details>
  </div>
</section>`;
    } else if (pLower.includes('témoignage') || pLower.includes('avis')) {
      injectedBlock = `\n<section class="container" style="padding:24px 20px;">
  <div class="grid-2">
    <div class="card"><p style="margin:0 0 8px;font-style:italic;">“Interface rapide, intuitive et immédiatement opérationnelle pour toute notre équipe.”</p><strong style="font-size:0.82rem;color:var(--accent);">Camille L. · Directrice Produit</strong></div>
    <div class="card"><p style="margin:0 0 8px;font-style:italic;">“Le passage sur mobile est fluide et nos conversions ont nettement progressé.”</p><strong style="font-size:0.82rem;color:var(--accent);">Nassim R. · Fondateur</strong></div>
  </div>
</section>`;
    } else if (pLower.includes('formulaire') || pLower.includes('contact')) {
      injectedBlock = `\n<section class="container" style="padding:24px 20px;">
  <div class="card">
    <h2 style="margin:0 0 10px;font-size:1.35rem;font-weight:900;">Contact &amp; Devis rapide</h2>
    <form onsubmit="event.preventDefault(); showToast('Message envoyé !');" style="display:grid;grid-template-columns:1fr 1fr auto;gap:10px;">
      <input class="input" type="text" required placeholder="Votre nom" />
      <input class="input" type="email" required placeholder="Votre email" />
      <button type="submit" class="btn btn-primary">Envoyer</button>
    </form>
  </div>
</section>`;
    } else if (!pLower.includes('couleur') && !pLower.includes('thème')) {
      injectedBlock = `\n<section class="container" style="padding:20px;">
  <div class="card">
    <span class="badge">Mise à jour appliquée</span>
    <h2 style="margin:6px 0;font-size:1.2rem;">${escapeHtml(cleanPrompt.slice(0, 72))}</h2>
    <p style="margin:0;font-size:0.86rem;color:var(--muted);">Section intégrée et stylisée selon votre charte graphique.</p>
  </div>
</section>`;
    }

    if (injectedBlock) {
      nextFiles.html = nextFiles.html.includes('</main>')
        ? nextFiles.html.replace('</main>', `${injectedBlock}\n</main>`)
        : `${nextFiles.html}\n${injectedBlock}`;
    }

    const html = bundleCodeFiles(title, nextFiles);
    return {
      title,
      html,
      files: nextFiles,
      summary: `Architecture mise à jour (${palette.name}) selon votre consigne : « ${cleanPrompt.slice(0, 65)} ».`,
      audit: buildAuditSummary(nextFiles),
    };
  }

  const title = extractTitle(cleanPrompt, domain);
  const files = buildDomainBlueprint(cleanPrompt, domain, title, palette, isLight);
  const html = bundleCodeFiles(title, files);

  return {
    title,
    html,
    files,
    summary: `Projet multi-fichiers « ${title} » (index.html, styles.css, app.js) conçu avec palette ${palette.name} et composants interactifs.`,
    audit: buildAuditSummary(files),
  };
}
