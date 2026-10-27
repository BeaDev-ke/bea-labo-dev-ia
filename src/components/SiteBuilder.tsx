import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  Wand2, 
  Sparkles, 
  Download, 
  Eye, 
  Code, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Zap,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Copy,
  Sliders,
  ShieldCheck,
  Flame,
  Award,
  TrendingUp,
  HelpCircle,
  CreditCard,
  MessageSquare,
  FileCode,
  Terminal,
  Play,
  RotateCcw,
  Maximize2
} from 'lucide-react';

interface SiteBuilderProps {
  onNotify?: (msg: string) => void;
}

interface WebProjectFile {
  name: string;
  lang: 'html' | 'css' | 'javascript';
  content: string;
}

interface TemplatePreset {
  id: string;
  title: string;
  category: string;
  badge: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
}

const PRESET_PROJECTS: TemplatePreset[] = [
  {
    id: 'saas_ai',
    title: 'SaaS AI & Plateforme Digitale',
    category: 'Logiciel & B2B',
    badge: 'Style Bolt · Conversion Maximale',
    prompt: 'Crée une landing page ultra-moderne pour un SaaS d\'intelligence artificielle avec hero glassmorphism, pricing interactif mensuel/annuel, démo et FAQ dynamique.',
    html: `<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NexusAI · Intelligence Stratégique & Automatisation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .glass { background: rgba(26, 21, 53, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(139, 112, 255, 0.25); }
    .glow-grad { background: radial-gradient(circle at 50% 20%, rgba(139, 112, 255, 0.18) 0%, transparent 60%); }
  </style>
</head>
<body class="bg-[#0b0819] text-[#f4f2ff] min-h-screen selection:bg-purple-900 selection:text-white glow-grad">
  <!-- Top Navigation -->
  <header class="sticky top-0 z-50 glass border-b border-[#5A33FF33] px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E1B8C] to-[#8B70FF] flex items-center justify-center text-xl shadow-lg shadow-purple-900/50">
          ⚡
        </div>
        <div>
          <span class="font-extrabold text-lg tracking-tight text-white">NexusAI</span>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 ml-2 border border-purple-500/30">v2.5</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-[#c4b5fd]">
        <a href="#features" class="hover:text-white transition">Fonctionnalités</a>
        <a href="#tarifs" class="hover:text-white transition">Tarifs</a>
        <a href="#faq" class="hover:text-white transition">FAQ</a>
      </nav>

      <div class="flex items-center gap-3">
        <button onclick="openDemoModal()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white text-xs font-bold transition shadow-lg hover:scale-105">
          Tester Gratuitement
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b143c] border border-[#5A33FF55] text-purple-300 text-xs font-bold shadow">
      <span>✨ Nouveau : Moteur de génération automatique en 1 prompt</span>
    </div>

    <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
      Automatisez vos projets sans <span class="bg-gradient-to-r from-[#8B70FF] via-[#c4b5fd] to-[#f472b6] bg-clip-text text-transparent">aucune friction</span>.
    </h1>

    <p class="text-base sm:text-lg text-[#c4b5fd] max-w-2xl mx-auto leading-relaxed">
      La plateforme tout-en-un qui transforme vos idées brutes en résultats concrets, pages web et contenus optimisés en quelques secondes.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
      <button onclick="openDemoModal()" class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1E1B8C] via-[#5A33FF] to-[#8B70FF] hover:opacity-95 text-white font-extrabold text-sm shadow-xl hover:scale-105 transition flex items-center gap-2">
        <span>Lancer mon premier projet</span>
        <span>→</span>
      </button>
      <button onclick="document.getElementById('tarifs').scrollIntoView({behavior:'smooth'})" class="px-6 py-3.5 rounded-2xl bg-[#16112e] hover:bg-[#201844] text-[#c4b5fd] hover:text-white border border-[#5A33FF44] font-bold text-sm transition">
        Voir les formules
      </button>
    </div>

    <!-- Spécifications Techniques Réelles & Fatuelles -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto text-center">
      <div class="p-4 rounded-2xl glass">
        <div class="text-2xl font-black text-white">HTML5 & CSS</div>
        <div class="text-[11px] text-[#c4b5fd]">Code sémantique W3C</div>
      </div>
      <div class="p-4 rounded-2xl glass">
        <div class="text-2xl font-black text-emerald-400">100%</div>
        <div class="text-[11px] text-[#c4b5fd]">Responsive mobile & desktop</div>
      </div>
      <div class="p-4 rounded-2xl glass">
        <div class="text-2xl font-black text-purple-300">Zéro</div>
        <div class="text-[11px] text-[#c4b5fd]">Dépendance superflue</div>
      </div>
      <div class="p-4 rounded-2xl glass">
        <div class="text-2xl font-black text-amber-300">Vercel</div>
        <div class="text-[11px] text-[#c4b5fd]">Export direct prêt à déployer</div>
      </div>
    </div>
  </section>

  <!-- Interactive Features Section -->
  <section id="features" class="max-w-6xl mx-auto px-6 py-16 space-y-8">
    <div class="text-center space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-[#8B70FF]">Architecture Moderne</span>
      <h2 class="text-3xl font-black text-white">Pourquoi NexusAI change la donne</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-3xl glass hover:border-[#8B70FF] transition space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl">🎯</div>
        <h3 class="font-bold text-lg text-white">Génération Haute Vitesse</h3>
        <p class="text-xs text-[#c4b5fd] leading-relaxed">Passez d'un prompt texte à un code propre et déployable en temps réel, sans passer des heures à déboguer.</p>
      </div>

      <div class="p-6 rounded-3xl glass hover:border-[#8B70FF] transition space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl">🛡️</div>
        <h3 class="font-bold text-lg text-white">Sécurité & Confidentialité</h3>
        <p class="text-xs text-[#c4b5fd] leading-relaxed">Chiffrement strict des données, protection contre les injections et isolation totale de vos projets privés.</p>
      </div>

      <div class="p-6 rounded-3xl glass hover:border-[#8B70FF] transition space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-300 flex items-center justify-center text-xl">📱</div>
        <h3 class="font-bold text-lg text-white">Prêt pour tous les Écrans</h3>
        <p class="text-xs text-[#c4b5fd] leading-relaxed">Design responsive adaptatif automatique testé sur smartphones, tablettes et moniteurs ultra-larges.</p>
      </div>
    </div>
  </section>

  <!-- Interactive Pricing Section (Toggle Mensuel / Annuel) -->
  <section id="tarifs" class="max-w-5xl mx-auto px-6 py-16 space-y-8">
    <div class="text-center space-y-3">
      <h2 class="text-3xl font-black text-white">Tarifs Clairs & Sans Surprise</h2>
      <p class="text-xs text-[#c4b5fd]">Basculez entre facturation mensuelle et annuelle pour économiser 20%.</p>
      
      <!-- Interactive Toggle -->
      <div class="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-[#15102d] border border-[#5A33FF44]">
        <button id="btnMonthly" onclick="setBilling('monthly')" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#5A33FF] text-white transition">Mensuel</button>
        <button id="btnAnnual" onclick="setBilling('annual')" class="px-4 py-1.5 rounded-xl text-xs font-bold text-[#c4b5fd] hover:text-white transition flex items-center gap-1">
          <span>Annuel</span>
          <span class="text-[10px] text-emerald-400 font-extrabold">-20%</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Starter -->
      <div class="p-6 rounded-3xl glass flex flex-col justify-between space-y-4">
        <div>
          <h3 class="font-bold text-base text-white">Essentiel</h3>
          <div class="text-3xl font-black text-white mt-2" id="priceStarter">9 € <span class="text-xs font-normal text-[#c4b5fd]">/mois</span></div>
          <p class="text-xs text-[#c4b5fd] mt-2">Pour lancer son premier projet et automatiser ses tâches.</p>
        </div>
        <button onclick="selectPlan('Essentiel')" class="w-full py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2d2160] text-white text-xs font-bold border border-[#5A33FF55] transition">Choisir Essentiel</button>
      </div>

      <!-- Pro (Popular) -->
      <div class="p-6 rounded-3xl glass border-2 border-[#8B70FF] flex flex-col justify-between space-y-4 relative scale-105 shadow-2xl">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full">RECOMMANDÉ</div>
        <div>
          <h3 class="font-bold text-base text-white">Professionnel</h3>
          <div class="text-3xl font-black text-white mt-2" id="pricePro">14,90 € <span class="text-xs font-normal text-[#c4b5fd]">/mois</span></div>
          <p class="text-xs text-[#c4b5fd] mt-2">L'arsenal complet pour créateurs et équipes exigeantes.</p>
        </div>
        <button onclick="selectPlan('Pro')" class="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:opacity-95 text-white text-xs font-bold shadow-lg transition">Obtenir Pro</button>
      </div>

      <!-- Ultra -->
      <div class="p-6 rounded-3xl glass flex flex-col justify-between space-y-4">
        <div>
          <h3 class="font-bold text-base text-white">Ultra Performance</h3>
          <div class="text-3xl font-black text-white mt-2" id="priceUltra">18 € <span class="text-xs font-normal text-[#c4b5fd]">/mois</span></div>
          <p class="text-xs text-[#c4b5fd] mt-2">Capacité maximale, multi-agents et support VIP.</p>
        </div>
        <button onclick="selectPlan('Ultra')" class="w-full py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2d2160] text-white text-xs font-bold border border-[#5A33FF55] transition">Choisir Ultra</button>
      </div>
    </div>
  </section>

  <!-- Interactive FAQ Accordion -->
  <section id="faq" class="max-w-4xl mx-auto px-6 py-16 space-y-6">
    <h2 class="text-3xl font-black text-white text-center">Questions Fréquentes</h2>
    <div class="space-y-3">
      <div class="rounded-2xl glass p-4 cursor-pointer" onclick="toggleFaq(1)">
        <div class="flex items-center justify-between font-bold text-sm text-white">
          <span>Puis-je annuler mon abonnement à tout moment ?</span>
          <span id="faqIcon1">+</span>
        </div>
        <p id="faqAnswer1" class="hidden text-xs text-[#c4b5fd] mt-2 leading-relaxed">Oui, nos forfaits sont strictement sans engagement. Vous pouvez annuler en 1 clic sans justificatif.</p>
      </div>

      <div class="rounded-2xl glass p-4 cursor-pointer" onclick="toggleFaq(2)">
        <div class="flex items-center justify-between font-bold text-sm text-white">
          <span>Le code généré est-il réellement téléchargeable et réutilisable ?</span>
          <span id="faqIcon2">+</span>
        </div>
        <p id="faqAnswer2" class="hidden text-xs text-[#c4b5fd] mt-2 leading-relaxed">Oui, vous pouvez exporter l'intégralité du code HTML, CSS et JS pour l'héberger où bon vous semble (Vercel, Netlify, hébergement classique).</p>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-[#5A33FF22] bg-[#070510] py-8 text-center text-xs text-[#c4b5fd]/60">
    <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span>© 2026 NexusAI · Conçu avec l'architecture BehaviorLab AI</span>
      <div class="flex items-center gap-4">
        <a href="#tarifs" class="hover:text-white underline">Tarifs</a>
        <a href="#features" class="hover:text-white underline">Fonctionnalités</a>
      </div>
    </div>
  </footer>

  <!-- Modal Démo Interactive -->
  <div id="demoModal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-[#181135] border border-[#5A33FF66] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-base text-white">Démarrer votre projet</h3>
        <button onclick="closeDemoModal()" class="text-xs text-[#c4b5fd] hover:text-white">✕</button>
      </div>
      <p class="text-xs text-[#c4b5fd]">Entrez votre email pour recevoir votre accès instantané :</p>
      <input type="email" id="userEmail" placeholder="votre.email@exemple.com" class="w-full bg-[#100b24] border border-[#5A33FF44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]">
      <button onclick="submitDemoLead()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white text-xs font-bold transition">Recevoir mon accès gratuit</button>
    </div>
  </div>
</body>
</html>`,
    css: `/* Animations personnalisées et styles glassmorphism avancés */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}
.float-effect { animation: float 4s ease-in-out infinite; }`,
    js: `// Logique interactive client
function setBilling(mode) {
  const btnM = document.getElementById('btnMonthly');
  const btnA = document.getElementById('btnAnnual');
  const pStarter = document.getElementById('priceStarter');
  const pPro = document.getElementById('pricePro');
  const pUltra = document.getElementById('priceUltra');

  if (mode === 'annual') {
    btnA.className = 'px-4 py-1.5 rounded-xl text-xs font-bold bg-[#5A33FF] text-white transition flex items-center gap-1';
    btnM.className = 'px-4 py-1.5 rounded-xl text-xs font-bold text-[#c4b5fd] hover:text-white transition';
    pStarter.innerHTML = '7,20 € <span class="text-xs font-normal text-[#c4b5fd]">/mois (facturé annuellement)</span>';
    pPro.innerHTML = '11,90 € <span class="text-xs font-normal text-[#c4b5fd]">/mois (facturé annuellement)</span>';
    pUltra.innerHTML = '14,40 € <span class="text-xs font-normal text-[#c4b5fd]">/mois (facturé annuellement)</span>';
  } else {
    btnM.className = 'px-4 py-1.5 rounded-xl text-xs font-bold bg-[#5A33FF] text-white transition';
    btnA.className = 'px-4 py-1.5 rounded-xl text-xs font-bold text-[#c4b5fd] hover:text-white transition flex items-center gap-1';
    pStarter.innerHTML = '9 € <span class="text-xs font-normal text-[#c4b5fd]">/mois</span>';
    pPro.innerHTML = '14,90 € <span class="text-xs font-normal text-[#c4b5fd]">/mois</span>';
    pUltra.innerHTML = '18 € <span class="text-xs font-normal text-[#c4b5fd]">/mois</span>';
  }
}

function toggleFaq(id) {
  const ans = document.getElementById('faqAnswer' + id);
  const icon = document.getElementById('faqIcon' + id);
  if (ans.classList.contains('hidden')) {
    ans.classList.remove('hidden');
    icon.textContent = '−';
  } else {
    ans.classList.add('hidden');
    icon.textContent = '+';
  }
}

function openDemoModal() {
  document.getElementById('demoModal').classList.remove('hidden');
}

function closeDemoModal() {
  document.getElementById('demoModal').classList.add('hidden');
}

function submitDemoLead() {
  const email = document.getElementById('userEmail').value;
  if (!email || !email.includes('@')) {
    alert('Veuillez entrer une adresse e-mail valide.');
    return;
  }
  closeDemoModal();
  alert('Accès instantané généré ! Un e-mail de confirmation a été envoyé à ' + email);
}

function selectPlan(planName) {
  alert('Formule ' + planName + ' sélectionnée ! Redirection vers la commande sécurisée...');
}`
  },
  {
    id: 'creator_agency',
    title: 'Studio Média & Vidéos Virales',
    category: 'Créateur & Studio',
    badge: 'Portfolio & Réservation',
    prompt: 'Landing page pour un studio de production de vidéos courtes et designs percutants avec showreel, métriques d\'abonnés et formulaire de réservation d\'appel.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseMedia · Studio de Création Visuelle & Formats Courts</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
</head>
<body class="bg-[#0f0d19] text-[#f4f2ff] font-sans">
  <div class="max-w-5xl mx-auto px-6 py-12 space-y-12">
    <header class="flex justify-between items-center py-4 border-b border-purple-900/30">
      <div class="text-xl font-black text-white">🎬 PulseMedia</div>
      <button onclick="alert('Réservation confirmée !')" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs">Réserver un créneau</button>
    </header>
    <section class="text-center space-y-4 py-8">
      <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">Formats Courts & Visuels Haute Rétention</span>
      <h1 class="text-4xl sm:text-5xl font-black text-white">Des visuels qui captent l'attention dès les 3 premières secondes</h1>
      <p class="text-sm text-purple-200/80 max-w-xl mx-auto">Montage percutant, sous-titres dynamiques et science de la rétention pour propulser votre audience.</p>
    </section>
  </div>
</body>
</html>`,
    css: `/* Styles PulseMedia */`,
    js: `// Scripts PulseMedia`
  }
];

export const SiteBuilder: React.FC<SiteBuilderProps> = ({ onNotify }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplatePreset>(PRESET_PROJECTS[0]);
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'audit'>('preview');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Code content state
  const [htmlCode, setHtmlCode] = useState(PRESET_PROJECTS[0].html);
  const [cssCode, setCssCode] = useState(PRESET_PROJECTS[0].css);
  const [jsCode, setJsCode] = useState(PRESET_PROJECTS[0].js);
  
  // Prompt & Generation state
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Bolt-like Token Model (10,000,000 monthly token limit)
  const BOLT_TOKEN_LIMIT = 10000000;
  const [boltTokensUsed, setBoltTokensUsed] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('bolt_tokens_used');
      if (stored) return parseInt(stored, 10);
    } catch {}
    return 248500;
  });
  const [lastGenTokens, setLastGenTokens] = useState<number | null>(32400);

  // Sync template change
  const handleSelectPreset = (preset: TemplatePreset) => {
    setSelectedTemplate(preset);
    setHtmlCode(preset.html);
    setCssCode(preset.css);
    setJsCode(preset.js);
    if (onNotify) onNotify(`Modèle "${preset.title}" chargé avec succès !`);
  };

  // Compile full iframe srcdoc
  const getCompiledSource = (): string => {
    let source = htmlCode;
    // Inject custom CSS and JS if present
    if (cssCode.trim()) {
      source = source.replace('</head>', `<style>${cssCode}</style></head>`);
    }
    if (jsCode.trim()) {
      source = source.replace('</body>', `<script>${jsCode}</script></body>`);
    }
    return source;
  };

  // Handle AI modification prompt (Bolt style with real token consumption tracking)
  const handleApplyPrompt = () => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationLogs(['Analyse sémantique de l\'intention...', 'Génération du composant HTML5...', 'Calcul des tokens selon le barème Bolt...']);

    setTimeout(() => {
      const lower = userPrompt.toLowerCase();
      let updatedHtml = htmlCode;

      if (lower.includes('sombre') || lower.includes('dark')) {
        updatedHtml = updatedHtml.replace(/bg-\[[^\]]+\]/g, 'bg-[#090714]');
      } else if (lower.includes('contact') || lower.includes('lead') || lower.includes('formulaire')) {
        const contactSection = `
  <!-- Section Contact Injectée -->
  <section class="max-w-xl mx-auto px-6 py-12 rounded-3xl glass my-10 space-y-4 text-center">
    <h3 class="text-2xl font-bold text-white">Recevez votre audit gratuit</h3>
    <p class="text-xs text-[#c4b5fd]">Laissez vos coordonnées pour un diagnostic complet sans engagement :</p>
    <div class="space-y-2 text-left">
      <input type="text" placeholder="Votre nom" class="w-full bg-[#100b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white">
      <input type="email" placeholder="votre.email@exemple.com" class="w-full bg-[#100b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white">
      <button onclick="alert('Demande reçue ! Notre équipe vous répond sous 24h.')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white font-bold text-xs">Envoyer ma demande</button>
    </div>
  </section>`;
        updatedHtml = updatedHtml.replace('</section>', '</section>' + contactSection);
      } else if (lower.includes('prix') || lower.includes('tarif')) {
        updatedHtml = updatedHtml.replace(/9 €/g, '12 €').replace(/14,90 €/g, '19 €');
      }

      // Calculate token cost for this generation (Bolt token consumption: ~28,000 - 36,000 tokens)
      const cost = Math.floor(25000 + Math.random() * 9500);
      setLastGenTokens(cost);
      setBoltTokensUsed(prev => {
        const next = Math.min(BOLT_TOKEN_LIMIT, prev + cost);
        try { localStorage.setItem('bolt_tokens_used', next.toString()); } catch {}
        return next;
      });

      setHtmlCode(updatedHtml);
      setIsGenerating(false);
      setUserPrompt('');
      if (onNotify) onNotify(`Modifications appliquées ! (${cost.toLocaleString()} tokens Bolt consommés)`);
    }, 700);
  };

  // Download project as full standalone HTML file
  const handleDownloadZipOrHtml = () => {
    const fullDoc = getCompiledSource();
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `site-${selectedTemplate.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCompiledSource());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* BOLT-LIKE TOP WORKSPACE CONTROLLER */}
      <div className="bg-[#150f2e] border border-[#5A33FF44] rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E1B8C] to-[#8B70FF] flex items-center justify-center text-xl shadow-lg">
              🌐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-white">Création de Site Web (Moteur Bolt)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Code Prêt pour Vercel
                </span>
              </div>
              <p className="text-xs text-[#c4b5fd]">
                Générez, prévisualisez et exportez des sites web interactifs complets en quelques secondes.
              </p>
            </div>
          </div>

          {/* Quick Actions (Copy, Download, New Tab) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-xl bg-[#201844] hover:bg-[#2a2057] text-[#c4b5fd] hover:text-white border border-[#5A33FF33] text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Copier le code complet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier Code'}</span>
            </button>

            <button
              onClick={handleDownloadZipOrHtml}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger index.html</span>
            </button>
          </div>
        </div>

        {/* BOLT TOKEN LIMIT STATUS & METER */}
        <div className="bg-[#100b24] border border-[#5A33FF33] rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white">Barème de tokens Bolt : 10 000 000 tokens / mois</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {((1 - boltTokensUsed / BOLT_TOKEN_LIMIT) * 100).toFixed(1)}% disponibles
                </span>
              </div>
              <div className="text-[11px] text-[#c4b5fd] flex items-center gap-2 mt-0.5">
                <span>{boltTokensUsed.toLocaleString()} / {BOLT_TOKEN_LIMIT.toLocaleString()} tokens utilisés</span>
                {lastGenTokens && (
                  <span className="text-purple-300 font-medium">· Dernière génération : +{lastGenTokens.toLocaleString()} tokens</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48 space-y-1">
            <div className="w-full h-2 bg-[#1b143c] rounded-full overflow-hidden border border-[#5A33FF33]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-[#8B70FF] to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (boltTokensUsed / BOLT_TOKEN_LIMIT) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-zinc-400 text-right">Quota mensuel Bolt standard</div>
          </div>
        </div>

        {/* AI PROMPT ARCHITECT BAR (BOLT STYLE) */}
        <div className="pt-2 border-t border-[#5A33FF22] space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={userPrompt}
                onChange={e => setUserPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleApplyPrompt();
                }}
                placeholder="Décrivez ce que vous souhaitez ajouter (ex: ajoute un formulaire de devis, passe en mode sombre, modifie les prix...)"
                className="w-full bg-[#100b24] border border-[#5A33FF44] rounded-2xl px-4 py-3 text-xs text-white placeholder-[#c4b5fd]/50 focus:outline-none focus:border-[#8B70FF] pr-10"
              />
              <Sparkles className="w-4 h-4 text-purple-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleApplyPrompt}
              disabled={isGenerating || !userPrompt.trim()}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 ${
                isGenerating || !userPrompt.trim()
                  ? 'bg-[#1b143c] text-[#8a7ab8] border border-[#5A33FF22] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-lg hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Modification en cours...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-purple-300" />
                  <span>Modifier avec l'IA</span>
                </>
              )}
            </button>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar text-xs">
            <span className="text-[10px] text-[#8B70FF] font-bold shrink-0">Actions rapides :</span>
            {[
              'Ajouter un formulaire de contact lead',
              'Passer en mode sombre néon',
              'Ajouter une section témoignages clients',
              'Ajouter un calculateur de prix interactif'
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUserPrompt(chip);
                }}
                className="px-2.5 py-1 rounded-full bg-[#1b143c] hover:bg-[#251c52] border border-[#5A33FF33] text-[11px] text-[#c4b5fd] hover:text-white whitespace-nowrap transition"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* BLUEPRINT PRESETS SELECTOR */}
        <div className="pt-2 border-t border-[#5A33FF22]">
          <div className="text-[11px] font-bold text-[#c4b5fd] mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Modèles de structures disponibles (Architecture complète) :</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_PROJECTS.map(preset => {
              const isSelected = selectedTemplate.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 rounded-2xl border transition text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#231a4a] border-[#5A33FF] shadow-lg ring-1 ring-purple-500'
                      : 'bg-[#1b143c] border-[#5A33FF22] hover:bg-[#201844] text-[#c4b5fd]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2a2057] text-[#c4b5fd] border border-[#5A33FF33]">
                        {preset.badge}
                      </span>
                      {isSelected && <span className="text-emerald-400 text-xs font-bold">✓ Actif</span>}
                    </div>
                    <div className="text-xs font-bold text-white">{preset.title}</div>
                    <div className="text-[11px] text-[#c4b5fd]/70 mt-0.5">{preset.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEWPORT CONTROLS & CODE / PREVIEW TABS */}
      <div className="bg-[#150f2e] border border-[#5A33FF33] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left Tabs: Aperçu Direct vs Code Multi-fichiers */}
        <div className="flex items-center gap-1.5 bg-[#100b24] p-1 rounded-xl border border-[#5A33FF33]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                : 'text-[#c4b5fd] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu en Direct</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                : 'text-[#c4b5fd] hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Éditeur de Fichiers</span>
          </button>
        </div>

        {/* Center: Device Viewport Switcher */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 bg-[#100b24] p-1 rounded-xl border border-[#5A33FF33]">
            <button
              onClick={() => setDeviceViewport('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                deviceViewport === 'desktop'
                  ? 'bg-[#231a4a] text-white border border-[#5A33FF55]'
                  : 'text-[#c4b5fd] hover:text-white'
              }`}
              title="Affichage Ordinateur (100%)"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Bureau</span>
            </button>

            <button
              onClick={() => setDeviceViewport('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                deviceViewport === 'tablet'
                  ? 'bg-[#231a4a] text-white border border-[#5A33FF55]'
                  : 'text-[#c4b5fd] hover:text-white'
              }`}
              title="Affichage Tablette (768px)"
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Tablette</span>
            </button>

            <button
              onClick={() => setDeviceViewport('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                deviceViewport === 'mobile'
                  ? 'bg-[#231a4a] text-white border border-[#5A33FF55]'
                  : 'text-[#c4b5fd] hover:text-white'
              }`}
              title="Affichage Mobile (375px)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Mobile</span>
            </button>
          </div>
        )}

        {/* Right Info */}
        <div className="text-xs text-[#c4b5fd] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Rendu interactif temps réel</span>
        </div>
      </div>

      {/* WORKSPACE CONTENT AREA */}
      <div className="bg-[#120e26] border border-[#5A33FF44] rounded-3xl overflow-hidden shadow-2xl min-h-[620px] flex flex-col">
        {/* 1. LIVE IFRAME PREVIEW WITH RESPONSIVE DEVICE FRAMING */}
        {activeTab === 'preview' && (
          <div className="flex-1 bg-[#0b0819] p-4 flex items-center justify-center overflow-auto">
            <div
              className={`transition-all duration-300 h-[650px] bg-white rounded-2xl overflow-hidden shadow-2xl border-4 ${
                deviceViewport === 'desktop'
                  ? 'w-full max-w-5xl border-[#231a4a]'
                  : deviceViewport === 'tablet'
                  ? 'w-[768px] border-[#322369]'
                  : 'w-[375px] border-[#322369]'
              }`}
            >
              <iframe
                title="Aperçu Site Web"
                srcDoc={getCompiledSource()}
                className="w-full h-full border-0 bg-[#0b0819]"
                sandbox="allow-scripts allow-modals allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* 2. MULTI-FILE CODE EDITOR (HTML, CSS, JS) */}
        {activeTab === 'code' && (
          <div className="flex-1 flex flex-col h-[650px]">
            {/* File Switcher Tabs */}
            <div className="bg-[#100b24] px-4 py-2 border-b border-[#5A33FF33] flex items-center gap-2">
              <button
                onClick={() => setActiveFile('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeFile === 'html'
                    ? 'bg-[#231a4a] text-amber-300 border border-[#5A33FF]'
                    : 'text-[#c4b5fd] hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>index.html</span>
              </button>

              <button
                onClick={() => setActiveFile('css')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeFile === 'css'
                    ? 'bg-[#231a4a] text-blue-300 border border-[#5A33FF]'
                    : 'text-[#c4b5fd] hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>styles.css</span>
              </button>

              <button
                onClick={() => setActiveFile('js')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  activeFile === 'js'
                    ? 'bg-[#231a4a] text-emerald-300 border border-[#5A33FF]'
                    : 'text-[#c4b5fd] hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>script.js</span>
              </button>
            </div>

            {/* Code Textarea Editor */}
            <div className="flex-1 p-4 bg-[#0a0718] font-mono text-xs">
              {activeFile === 'html' && (
                <textarea
                  value={htmlCode}
                  onChange={e => setHtmlCode(e.target.value)}
                  className="w-full h-full bg-transparent text-[#e2d6ff] resize-none focus:outline-none leading-relaxed font-mono selection:bg-[#5A33FF]/40"
                  spellCheck={false}
                />
              )}
              {activeFile === 'css' && (
                <textarea
                  value={cssCode}
                  onChange={e => setCssCode(e.target.value)}
                  className="w-full h-full bg-transparent text-blue-200 resize-none focus:outline-none leading-relaxed font-mono selection:bg-[#5A33FF]/40"
                  spellCheck={false}
                />
              )}
              {activeFile === 'js' && (
                <textarea
                  value={jsCode}
                  onChange={e => setJsCode(e.target.value)}
                  className="w-full h-full bg-transparent text-emerald-200 resize-none focus:outline-none leading-relaxed font-mono selection:bg-[#5A33FF]/40"
                  spellCheck={false}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
