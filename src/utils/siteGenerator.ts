/**
 * Moteur de Génération de Sites Professionnels Andrea AI (Style IONOS / Wix Studio)
 * Produit des sites complets, interactifs, responsives et prêts pour publication (Vercel, PlayStore, Desktop, etc.)
 */

export interface SiteGenerationParams {
  projectName: string;
  industry: string;
  goal: string;
  style: string;
  sections: string[];
  customPrompt: string;
}

export function generateCompleteWebsite(params: SiteGenerationParams): string {
  const { projectName, industry, goal, style, customPrompt } = params;
  const promptLower = (customPrompt + ' ' + industry + ' ' + projectName).toLowerCase();

  // Détection du secteur travaux / outillage / chantier / bâtiment
  const isToolsOrConstruction = promptLower.includes('outil') || 
                                promptLower.includes('travaux') || 
                                promptLower.includes('chantier') || 
                                promptLower.includes('bâtiment') || 
                                promptLower.includes('batiment') || 
                                promptLower.includes('bricolage') || 
                                promptLower.includes('artisan') ||
                                promptLower.includes('renovation');

  if (isToolsOrConstruction) {
    return generateToolsWebsite(params);
  }

  // Site professionnel généraliste haut de gamme
  return generateGeneralWebsite(params);
}

function generateToolsWebsite(params: SiteGenerationParams): string {
  const title = params.projectName.trim() || "BatiTools Pro · Équipements & Outils de Travaux";
  const desc = params.customPrompt.trim() || "Catalogue complet de matériel et outils de travaux professionnels disponibles immédiatement pour artisans, entreprises du bâtiment et particuliers exigeants.";

  return `<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc.slice(0, 150)}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0f172a; color: #f8fafc; }
    .heading-font { font-family: 'Space Grotesk', sans-serif; }
    .badge-amber { background-color: #f59e0b; color: #000; font-weight: 800; }
    .card-tools { background: #1e293b; border: 1px solid rgba(255,255,255,0.08); transition: all 0.25s ease; }
    .card-tools:hover { transform: translateY(-4px); border-color: #f59e0b; box-shadow: 0 12px 30px -10px rgba(245, 158, 11, 0.25); }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#0b0f19]">

  <!-- HEADER NAVIGATION -->
  <header class="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
          🔨
        </div>
        <div>
          <span class="heading-font font-black text-lg sm:text-xl text-white tracking-tight">${params.projectName || 'BATIPRO OUTILS'}</span>
          <span class="hidden sm:block text-[10px] text-amber-400 font-bold uppercase tracking-wider">Matériel de Chantier Pro</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
        <a href="#catalogue" class="hover:text-amber-400 transition">Catalogue Outils</a>
        <a href="#services" class="hover:text-amber-400 transition">Services & Chantier</a>
        <a href="#tarifs" class="hover:text-amber-400 transition">Tarifs</a>
        <a href="#avis" class="hover:text-amber-400 transition">Avis Clients</a>
        <a href="#contact" class="hover:text-amber-400 transition">Contact & Devis</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="#devis-modal" onclick="openQuoteModal()" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center gap-2">
          <span>📋 Devis Express</span>
        </a>
      </div>
    </div>
  </header>

  <!-- HERO BANNER -->
  <section class="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[#111827] to-[#0b0f19] border-b border-slate-800">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 space-y-6">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
          <span>⚡ Équipements Disponibles Immédiatement</span>
        </div>
        <h1 class="heading-font text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Vos Outils de Travaux <span class="text-amber-400">Haute Performance</span> pour Réussir Chaque Chantier.
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          ${desc}
        </p>

        <!-- CTA & Garanties -->
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <a href="#catalogue" class="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl transition">
            Explorer les Outils
          </a>
          <a href="#contact" class="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition">
            Demander un Devis Gratuit
          </a>
        </div>

        <div class="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
          <div>
            <div class="text-xl sm:text-2xl font-black text-amber-400 heading-font">850+</div>
            <div class="text-[11px] text-slate-400 font-medium">Machines & Outils Pro</div>
          </div>
          <div>
            <div class="text-xl sm:text-2xl font-black text-amber-400 heading-font">2h</div>
            <div class="text-[11px] text-slate-400 font-medium">Livraison sur chantier</div>
          </div>
          <div>
            <div class="text-xl sm:text-2xl font-black text-amber-400 heading-font">100%</div>
            <div class="text-[11px] text-slate-400 font-medium">Matériel révisé & garanti</div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 relative">
        <div class="relative rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-800">
          <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80" alt="Outillage professionnel de chantier" class="w-full h-80 sm:h-96 object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs">
            <div class="flex items-center justify-between font-bold text-white mb-1">
              <span>Perforateur SDS-Max 1500W</span>
              <span class="text-amber-400 font-black">Disponible</span>
            </div>
            <p class="text-slate-400 text-[11px]">Idéal perçage béton armé et piquage intensif</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CATALOGUE INTERACTIF AVEC FILTRES -->
  <section id="catalogue" class="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-10">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="space-y-2">
        <span class="text-amber-400 font-bold text-xs uppercase tracking-wider">Parc Matériel Professionnel</span>
        <h2 class="heading-font text-2xl sm:text-4xl font-black text-white">Catalogue des Outils de Travaux</h2>
      </div>
      
      <!-- Filtres dynamiques -->
      <div class="flex flex-wrap items-center gap-2">
        <button onclick="filterCategory('all')" id="btn-all" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 transition">Tous</button>
        <button onclick="filterCategory('electro')" id="btn-electro" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition">Électroportatif</button>
        <button onclick="filterCategory('gros')" id="btn-gros" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition">Gros Œuvre & BTP</button>
        <button onclick="filterCategory('laser')" id="btn-laser" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition">Mesure & Laser</button>
        <button onclick="filterCategory('epi')" id="btn-epi" class="cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition">Sécurité & EPI</button>
      </div>
    </div>

    <!-- Grille des produits / outils -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <!-- Outil 1 -->
      <div class="tool-card electro card-tools rounded-3xl p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
            <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80" alt="Perforateur Burineur" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase">Électroportatif</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white heading-font">Perforateur Burineur SDS-Max 1500W</h3>
            <p class="text-xs text-slate-400 mt-1">Force de frappe 12 Joules, système anti-vibration actif et mandrin rapide.</p>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">Tarif indicatif</span>
            <span class="text-lg font-black text-amber-400 heading-font">35 € <span class="text-xs text-slate-400 font-normal">/ jour</span></span>
          </div>
          <button onclick="selectTool('Perforateur SDS-Max 1500W')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition">
            Réserver
          </button>
        </div>
      </div>

      <!-- Outil 2 -->
      <div class="tool-card electro card-tools rounded-3xl p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
            <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80" alt="Scie Circulaire sur Rail" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase">Électroportatif</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white heading-font">Scie Circulaire Plongeante + Rail 1.4m</h3>
            <p class="text-xs text-slate-400 mt-1">Coupe nette au millimètre pour panneaux, plans de travail et chevrons bois.</p>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">Tarif indicatif</span>
            <span class="text-lg font-black text-amber-400 heading-font">29 € <span class="text-xs text-slate-400 font-normal">/ jour</span></span>
          </div>
          <button onclick="selectTool('Scie Circulaire Plongeante')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition">
            Réserver
          </button>
        </div>
      </div>

      <!-- Outil 3 -->
      <div class="tool-card gros card-tools rounded-3xl p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
            <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80" alt="Bétonnière Pro" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[10px] font-black uppercase">Gros Œuvre</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white heading-font">Bétonnière Pro 350L Thermique</h3>
            <p class="text-xs text-slate-400 mt-1">Moteur Honda 4T, malaxage intensif de 2 sacs de ciment par gâchée.</p>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">Tarif indicatif</span>
            <span class="text-lg font-black text-amber-400 heading-font">55 € <span class="text-xs text-slate-400 font-normal">/ jour</span></span>
          </div>
          <button onclick="selectTool('Bétonnière Pro 350L')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition">
            Réserver
          </button>
        </div>
      </div>

      <!-- Outil 4 -->
      <div class="tool-card laser card-tools rounded-3xl p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
            <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80" alt="Niveau Laser Rotatif" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-black uppercase">Mesure & Laser</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white heading-font">Niveau Laser Rotatif 360° Extérieur</h3>
            <p class="text-xs text-slate-400 mt-1">Portée 500m avec cellule de réception et trépied manivelle aluminium.</p>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">Tarif indicatif</span>
            <span class="text-lg font-black text-amber-400 heading-font">45 € <span class="text-xs text-slate-400 font-normal">/ jour</span></span>
          </div>
          <button onclick="selectTool('Niveau Laser Rotatif')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition">
            Réserver
          </button>
        </div>
      </div>

      <!-- Outil 5 -->
      <div class="tool-card epi card-tools rounded-3xl p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
            <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80" alt="Kit Sécurité & EPI" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-blue-500 text-white text-[10px] font-black uppercase">Sécurité EPI</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white heading-font">Pack EPI Chantier & Harnais Anti-Chute</h3>
            <p class="text-xs text-slate-400 mt-1">Norme EN361, longe avec absorbeur d'énergie, mousquetons acier et casque.</p>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">Tarif indicatif</span>
            <span class="text-lg font-black text-amber-400 heading-font">18 € <span class="text-xs text-slate-400 font-normal">/ jour</span></span>
          </div>
          <button onclick="selectTool('Pack Sécurité & Harnais')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition">
            Réserver
          </button>
        </div>
      </div>

      <!-- Outil 6 -->
      <div class="tool-card gros card-tools rounded-3xl p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="h-48 rounded-2xl overflow-hidden bg-slate-900 relative">
            <img src="https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80" alt="Nettoyeur Haute Pression" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[10px] font-black uppercase">Gros Œuvre</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-white heading-font">Nettoyeur Haute Pression 250 Bars</h3>
            <p class="text-xs text-slate-400 mt-1">Décapage de façades, terrasses et matériel lourd. Buse rotative incluse.</p>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-slate-400 block">Tarif indicatif</span>
            <span class="text-lg font-black text-amber-400 heading-font">40 € <span class="text-xs text-slate-400 font-normal">/ jour</span></span>
          </div>
          <button onclick="selectTool('Nettoyeur Haute Pression 250B')" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition">
            Réserver
          </button>
        </div>
      </div>

    </div>
  </section>

  <!-- FORMULAIRE DE DEVIS EXPRESS -->
  <section id="contact" class="py-16 bg-[#111827] border-t border-slate-800 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <span class="text-amber-400 font-bold text-xs uppercase tracking-wider">Réponse sous 30 minutes</span>
        <h2 class="heading-font text-2xl sm:text-3xl font-black text-white">Demandez Votre Devis Outils</h2>
        <p class="text-slate-400 text-xs sm:text-sm">Remplissez ce formulaire pour bloquer vos outils et planifier la livraison sur votre chantier.</p>
      </div>

      <form onsubmit="handleFormSubmit(event)" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Votre Nom & Société :</label>
            <input type="text" required placeholder="Ex: Jean Dupont (Bati-Renov SAS)" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Numéro de Téléphone :</label>
            <input type="tel" required placeholder="06 12 34 56 78" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Outil(s) souhaité(s) :</label>
            <input id="selected-tool-input" type="text" placeholder="Ex: Perforateur 1500W, Bétonnière..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Durée ou date de début :</label>
            <input type="text" placeholder="Ex: À partir de lundi pour 3 jours" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Précisions sur votre chantier (adresse, étage, contraintes) :</label>
          <textarea rows="3" placeholder="Indiquez l'adresse de livraison ou vos questions..." class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"></textarea>
        </div>

        <button type="submit" class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl transition cursor-pointer">
          Envoyer ma demande de devis express
        </button>
      </form>
      <div id="form-success" class="hidden p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs text-center font-bold">
        ✅ Demande envoyée avec succès ! Un conseiller technique vous rappelle sous 30 minutes.
      </div>
    </div>
  </section>

  <!-- AVIS CLIENTS -->
  <section id="avis" class="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8">
    <div class="text-center space-y-2">
      <div class="text-amber-400 text-sm">★★★★★ 4.9/5 sur 240 avis vérifiés</div>
      <h2 class="heading-font text-2xl sm:text-3xl font-black text-white">Ce que disent les artisans du bâtiment</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card-tools p-6 rounded-3xl space-y-3">
        <div class="text-amber-400">★★★★★</div>
        <p class="text-xs text-slate-300 leading-relaxed">« Matériel livré directement sur notre chantier à 7h30. Les perforateurs et le laser ont tourné sans broncher pendant 2 semaines. Impeccable. »</p>
        <div class="text-xs font-bold text-white">— Marc V., Maçonnerie Générale</div>
      </div>

      <div class="card-tools p-6 rounded-3xl space-y-3">
        <div class="text-amber-400">★★★★★</div>
        <p class="text-xs text-slate-300 leading-relaxed">« Tarifs ultra clairs, zéro caution bloquée pendant des semaines. Service client réactif par WhatsApp et téléphone. »</p>
        <div class="text-xs font-bold text-white">— Karim D., Électricien Bâtiment</div>
      </div>

      <div class="card-tools p-6 rounded-3xl space-y-3">
        <div class="text-amber-400">★★★★★</div>
        <p class="text-xs text-slate-300 leading-relaxed">« Le niveau laser rotatif nous a fait gagner 2 jours sur le coulage de chape. Je ne passe plus que par eux pour mes locations d'outils. »</p>
        <div class="text-xs font-bold text-white">— Stéphane R., Plaquiste & Peintre</div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="mt-auto bg-[#070b14] border-t border-slate-800 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-3">
    <div class="flex items-center justify-center gap-2 text-white font-bold text-sm">
      <span>🔨 ${params.projectName || 'BATIPRO OUTILS'}</span>
      <span>·</span>
      <span class="text-slate-400 text-xs">Fournisseur d'Équipements & Outils de Travaux</span>
    </div>
    <p>© 2026 ${params.projectName || 'BatiPro Outils'}. Tous droits réservés. Site conçu et optimisé avec Andrea AI.</p>
  </footer>

  <script>
    function filterCategory(cat) {
      document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-amber-500', 'text-slate-950');
        btn.classList.add('bg-slate-800', 'text-slate-200');
      });
      const activeBtn = document.getElementById('btn-' + cat);
      if (activeBtn) {
        activeBtn.classList.remove('bg-slate-800', 'text-slate-200');
        activeBtn.classList.add('bg-amber-500', 'text-slate-950');
      }

      const cards = document.querySelectorAll('.tool-card');
      cards.forEach(card => {
        if (cat === 'all' || card.classList.contains(cat)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function selectTool(name) {
      const input = document.getElementById('selected-tool-input');
      if (input) {
        input.value = name;
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      document.getElementById('form-success').classList.remove('hidden');
    }
  </script>
</body>
</html>`;
}

function generateGeneralWebsite(params: SiteGenerationParams): string {
  const title = params.projectName.trim() || "Plateforme Stratégique Pro";
  const desc = params.customPrompt.trim() || "Solution moderne, claire et performante conçue pour accélérer vos résultats et convertir vos visiteurs.";

  return `<!DOCTYPE html>
<html lang="fr" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0c081e; color: #f3f0ff; font-family: system-ui, sans-serif; }
    .glass { background: rgba(24, 17, 53, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(139, 112, 255, 0.25); }
    .glass:hover { border-color: rgba(139, 112, 255, 0.5); }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#0c081e]">

  <header class="sticky top-0 z-40 bg-[#100b27]/90 backdrop-blur-md border-b border-[#5A33FF33]">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xl">✨</span>
        <span class="font-extrabold text-white text-base tracking-tight">${params.projectName || 'PROJET OFFICIEL'}</span>
      </div>
      <a href="#action" class="px-4 py-2 rounded-xl bg-[#5A33FF] hover:bg-[#6e4bff] text-white font-bold text-xs shadow-md transition">
        Démarrer
      </a>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-16 sm:py-24 space-y-12 text-center">
    <div class="space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-bold">
        <span>🚀 ${params.industry || 'Solution Stratégique'}</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight">
        ${title}
      </h1>
      <p class="text-sm sm:text-base text-purple-200/90 leading-relaxed">
        ${desc}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      <div class="glass p-6 rounded-3xl space-y-2">
        <div class="text-2xl">⚡</div>
        <h3 class="font-bold text-white text-base">Efficacité Maximale</h3>
        <p class="text-xs text-purple-200">Processus fluide pensé pour obtenir des résultats immédiats sans perte de temps.</p>
      </div>

      <div class="glass p-6 rounded-3xl space-y-2">
        <div class="text-2xl">🎯</div>
        <h3 class="font-bold text-white text-base">${params.goal || 'Objectif Précis'}</h3>
        <p class="text-xs text-purple-200">Méthodes et fonctionnalités ciblées pour valider vos objectifs avec précision.</p>
      </div>

      <div class="glass p-6 rounded-3xl space-y-2">
        <div class="text-2xl">🔒</div>
        <h3 class="font-bold text-white text-base">Fiabilité & Clarté</h3>
        <p class="text-xs text-purple-200">Zéro friction, données sécurisées et expérience utilisateur optimale.</p>
      </div>
    </div>

    <div id="action" class="p-8 rounded-3xl glass max-w-2xl mx-auto space-y-4">
      <h3 class="text-xl font-extrabold text-white">Passez à l'action dès maintenant</h3>
      <p class="text-xs text-purple-200">Contactez-nous pour concrétiser votre démarche en toute simplicité.</p>
      <div class="flex items-center justify-center gap-3">
        <button class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold text-xs shadow-lg">
          Nous Contacter
        </button>
      </div>
    </div>
  </main>

  <footer class="mt-auto py-6 text-center text-xs text-purple-400/60 border-t border-[#5A33FF22]">
    © 2026 ${title}. Généré avec l'Agent IA Andrea Ultra.
  </footer>

</body>
</html>`;
}
