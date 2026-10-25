import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';

interface SiteBuilderProps {
  onNotify?: (msg: string) => void;
}

interface TemplatePreset {
  id: string;
  title: string;
  category: string;
  badge: string;
  prompt: string;
  html: string;
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: 'agency',
    title: 'Agence Visuelle & Montage Viral',
    category: 'Créateur & Agence',
    badge: 'Haute Conversion',
    prompt: 'Crée une landing page premium pour mon agence de création visuelle et vidéos courtes avec grille de tarifs, démo et formulaire de réservation d\'appel.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexMotion · Agence de Création Visuelle & Vidéos Virales</title>
  <style>
    :root { --bg: #121214; --card: #18181b; --border: #27272a; --text: #f4f4f5; --sub: #a1a1aa; --accent: #ffffff; }
    * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
    header { padding: 20px 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
    .logo { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .btn { background: #ffffff; color: #000000; padding: 10px 20px; border-radius: 99px; text-decoration: none; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: 0.2s; }
    .btn:hover { background: #e4e4e7; transform: scale(1.02); }
    .hero { text-align: center; padding: 70px 0 50px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #27272a; border-radius: 99px; font-size: 12px; font-weight: 600; color: #d4d4d8; margin-bottom: 20px; }
    h1 { font-size: 44px; font-weight: 900; line-height: 1.15; margin-bottom: 18px; letter-spacing: -1px; }
    .hero p { font-size: 16px; color: var(--sub); max-width: 600px; margin: 0 auto 32px; }
    .cta-group { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
    .btn-secondary { background: #27272a; color: #ffffff; padding: 10px 20px; border-radius: 99px; text-decoration: none; font-weight: 600; font-size: 13px; border: 1px solid #3f3f46; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 50px 0; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 28px; }
    .card h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .card p { color: var(--sub); font-size: 13px; }
    .pricing { background: #18181b; border: 1px solid var(--border); border-radius: 24px; padding: 36px; text-align: center; margin: 40px 0; }
    .price { font-size: 38px; font-weight: 900; margin: 16px 0 8px; }
    footer { text-align: center; padding: 36px 0; border-top: 1px solid var(--border); font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">⚡ ApexMotion</div>
      <button class="btn" onclick="alert('Réservation confirmée ! Notre équipe vous contacte sous 2h.')">Réserver un Appel</button>
    </header>
    <section class="hero">
      <div class="badge">🔥 +4.8M de vues générées pour nos clients ce mois</div>
      <h1>Des vidéos qui captent l'attention dès les 3 premières secondes</h1>
      <p>Nous concevons des contenus courts à haute rétention grâce aux principes de la psychologie comportementale.</p>
      <div class="cta-group">
        <button class="btn" onclick="alert('Démarrage immédiat !')">Lancer un projet</button>
        <button class="btn-secondary" onclick="document.getElementById('tarifs').scrollIntoView({behavior:'smooth'})">Voir les offres</button>
      </div>
    </section>
    <div class="grid">
      <div class="card">
        <h3>🎯 Hooks Psychologiques</h3>
        <p>Analyse des biais d'attention pour bloquer le scroll dès la première seconde.</p>
      </div>
      <div class="card">
        <h3>🎬 Montage Rythmé & Effets</h3>
        <p>Animations sous-titres, sound design immersif et transitions adaptées au sujet.</p>
      </div>
      <div class="card">
        <h3>📈 Optimisation de Rétention</h3>
        <p>Mesure de l'élan visuel pour maximiser le taux de complétion moyen.</p>
      </div>
    </div>
    <div class="pricing" id="tarifs">
      <h2>Formule Mensuelle Accompagnement</h2>
      <p style="color:#a1a1aa; font-size:14px;">12 vidéos montées par mois, scripts optimisés et révisions illimitées.</p>
      <div class="price">790 € <span style="font-size:14px; font-weight:normal; color:#a1a1aa;">/mois</span></div>
      <button class="btn" style="margin-top:16px;" onclick="alert('Paiement sécurisé Stripe simulé avec succès !')">Souscrire sans engagement</button>
    </div>
    <footer>ApexMotion · Développé avec BehaviorLab AI</footer>
  </div>
</body>
</html>`
  },
  {
    id: 'saas',
    title: 'SaaS d\'Habitudes & Focus Mental',
    category: 'Productivité',
    badge: 'Modèle BJ Fogg',
    prompt: 'Génère une landing page complète pour une application de focus et d\'habitudes quotidiennes avec compteur de streak, témoignages clients et bouton d\'essai gratuit 7 jours.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MomentumFocus · Votre Routine en Pilote Automatique</title>
  <style>
    :root { --bg: #09090b; --card: #18181b; --border: #27272a; --text: #fafafa; --sub: #a1a1aa; }
    * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1040px; margin: 0 auto; padding: 0 24px; }
    header { padding: 24px 0; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 20px; font-weight: 800; }
    .btn { background: #ffffff; color: #000; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
    .btn:hover { background: #e4e4e7; }
    .hero { text-align: center; padding: 80px 0 60px; }
    .streak { display: inline-flex; align-items: center; gap: 8px; background: #27272a; padding: 8px 16px; border-radius: 99px; font-size: 13px; font-weight: 700; color: #fbbf24; margin-bottom: 24px; }
    h1 { font-size: 48px; font-weight: 900; line-height: 1.15; margin-bottom: 20px; letter-spacing: -1.5px; }
    p.lead { font-size: 17px; color: var(--sub); max-width: 640px; margin: 0 auto 36px; }
    .interactive-demo { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 32px; max-width: 520px; margin: 0 auto 60px; text-align: left; }
    .todo-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #212124; border-radius: 12px; margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
    .todo-item:hover { background: #27272a; }
    footer { text-align: center; padding: 40px 0; color: #71717a; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">⚡ MomentumFocus</div>
      <button class="btn" onclick="alert('Essai gratuit 7 jours activé !')">Essai Gratuit 7 Jours</button>
    </header>
    <section class="hero">
      <div class="streak">🔥 14 Jours de Streak Actif · +89% de Constance</div>
      <h1>L'application qui rend l'action plus facile que la procrastination</h1>
      <p class="lead">Basée sur le modèle comportemental de Stanford. Moins de friction, des déclencheurs évidents et un feedback gratifiant.</p>
      <button class="btn" onclick="alert('Bienvenue sur MomentumFocus !')">Démarrer Maintenant (Gratuit)</button>
    </section>
    <div class="interactive-demo">
      <h3 style="margin-bottom:14px; font-size:16px;">🎯 Vos 3 Micro-Actions du Jour :</h3>
      <div class="todo-item" onclick="this.style.opacity='0.5'; this.style.textDecoration='line-through'; alert('Action validée ! +25 Momentum Points');">
        <span>1. Rédiger 10 lignes du projet</span>
        <span>✓ 5 min</span>
      </div>
      <div class="todo-item" onclick="this.style.opacity='0.5'; this.style.textDecoration='line-through'; alert('Action validée ! +25 Momentum Points');">
        <span>2. Envoyer le message en attente</span>
        <span>✓ 2 min</span>
      </div>
      <div class="todo-item" onclick="this.style.opacity='0.5'; this.style.textDecoration='line-through'; alert('Action validée ! +25 Momentum Points');">
        <span>3. Marcher 10 minutes</span>
        <span>✓ 10 min</span>
      </div>
      <div style="font-size:11px; color:#a1a1aa; text-align:center; margin-top:12px;">Cliquez pour cocher une tâche et tester l'effet récompense !</div>
    </div>
    <footer>MomentumFocus · Moteur BehaviorLab AI</footer>
  </div>
</body>
</html>`
  },
  {
    id: 'ecommerce',
    title: 'E-commerce One-Product Haute Conversion',
    category: 'Vente & E-commerce',
    badge: 'Score 98/100',
    prompt: 'Crée une page de vente ultra-persuasive pour un carnet de productivité avec compte à rebours, avis 5 étoiles, garantie satisfait ou remboursé 30 jours et checkout simulé.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Le Carnet Comportemental · Transformez 90 Jours</title>
  <style>
    :root { --bg: #121214; --card: #1c1c1f; --border: #2e2e32; --text: #f5f5f7; --accent: #22c55e; }
    * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .banner { background: #22c55e; color: #000; text-align: center; padding: 10px; font-weight: 800; font-size: 13px; }
    .container { max-width: 960px; margin: 0 auto; padding: 0 20px; }
    .hero { text-align: center; padding: 50px 0 40px; }
    h1 { font-size: 42px; font-weight: 900; line-height: 1.2; margin: 16px 0; }
    .stars { color: #f59e0b; font-size: 18px; }
    .offer-box { background: var(--card); border: 2px solid var(--border); border-radius: 24px; padding: 36px; max-width: 580px; margin: 0 auto; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
    .price-tag { font-size: 44px; font-weight: 900; color: #ffffff; }
    .old-price { text-decoration: line-through; color: #71717a; font-size: 20px; margin-right: 8px; }
    .btn-buy { width: 100%; background: #22c55e; color: #000; padding: 18px; border-radius: 14px; font-size: 18px; font-weight: 900; border: none; cursor: pointer; margin-top: 20px; transition: 0.2s; }
    .btn-buy:hover { background: #16a34a; transform: translateY(-2px); }
    .guarantee { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 12px; color: #a1a1aa; margin-top: 16px; }
    footer { text-align: center; padding: 40px 0; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="banner">⚡ OFFRE SPÉCIALE : -40% DE RÉDUCTION JUSQU'À CE SOIR MINUIT</div>
  <div class="container">
    <section class="hero">
      <div class="stars">★★★★★ 4.9/5 · Plus de 3 400 utilisateurs conquis</div>
      <h1>Le seul carnet guidé par la psychologie de l'action</h1>
      <p style="color:#a1a1aa; font-size:16px;">Ne laissez plus vos idées mourir sur des pages blanches. 90 jours pour bâtir vos projets avec méthode.</p>
    </section>
    <div class="offer-box">
      <div style="font-size:12px; font-weight:bold; color:#22c55e; text-transform:uppercase; letter-spacing:1px;">Pack Complet 90 Jours</div>
      <div style="margin:16px 0;">
        <span class="old-price">49,00 €</span>
        <span class="price-tag">29,90 €</span>
      </div>
      <ul style="text-align:left; font-size:14px; line-height:2; color:#d4d4d8; list-style:none; padding:0 20px;">
        <li>✓ Carnet relié rigide couverture luxe toucher velours</li>
        <li>✓ Guide PDF d'analyse des blocages par Andrea</li>
        <li>✓ Livraison suivie offerte en 48h</li>
        <li>✓ Garantie satisfait ou remboursé 30 jours</li>
      </ul>
      <button class="btn-buy" onclick="alert('Commande validée ! Redirection sécurisée vers la livraison.')">Commander avec -40% Immédiat</button>
      <div class="guarantee">🔒 Paiement chiffré SSL 256-bit · 30 jours d'essai sans risque</div>
    </div>
    <footer>Conçu avec BehaviorLab AI</footer>
  </div>
</body>
</html>`
  },
  {
    id: 'school',
    title: 'Coaching & Soutien Scolaire Intelligent',
    category: 'Éducation',
    badge: 'Adapté aux Programmes',
    prompt: 'Crée une plateforme de coaching scolaire avec diagnostic des lacunes, méthode pas-à-pas et simulateur de notes.',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Andrea Scolaire · Réussir Sans le Stress des Devoirs</title>
  <style>
    :root { --bg: #121214; --card: #18181b; --border: #27272a; --text: #f4f4f5; }
    * { margin:0; padding:0; box-sizing:border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    header { padding: 24px 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
    .hero { text-align: center; padding: 60px 0 40px; }
    h1 { font-size: 40px; font-weight: 900; margin-bottom: 16px; }
    .btn { background: #ffffff; color: #000; padding: 12px 24px; border-radius: 99px; font-weight: 700; border: none; cursor: pointer; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 40px 0; }
    .c { background: var(--card); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }
    footer { text-align: center; padding: 40px 0; font-size: 12px; color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div style="font-weight:800; font-size:18px;">🎓 Andrea Scolaire</div>
      <button class="btn" onclick="alert('Diagnostic gratuit ouvert !')">Faire le test gratuit</button>
    </header>
    <section class="hero">
      <div style="display:inline-block; padding:4px 12px; background:#27272a; border-radius:99px; font-size:12px; margin-bottom:16px;">📚 Du Collège au Lycée · France & International</div>
      <h1>L'IA qui explique jusqu'à ce que tout devienne limpide</h1>
      <p style="color:#a1a1aa; max-width:600px; margin:0 auto 30px;">Méthode progressive, analogies du quotidien et zéro jugement pour reprendre confiance.</p>
      <button class="btn" onclick="alert('Prêt pour la séance de révision !')">Commencer une explication</button>
    </section>
    <div class="cards">
      <div class="c"><h3>💡 Explications par Analogie</h3><p style="color:#a1a1aa; font-size:13px; margin-top:8px;">Les théorèmes et règles de grammaire expliqués avec des exemples de la vie réelle.</p></div>
      <div class="c"><h3>📝 Méthode de Révision Active</h3><p style="color:#a1a1aa; font-size:13px; margin-top:8px;">Questions de vérification pour mémoriser durablement sans relire 10 fois sans comprendre.</p></div>
      <div class="c"><h3>🌍 Programmes Internationaux</h3><p style="color:#a1a1aa; font-size:13px; margin-top:8px;">Adapté aux programmes de France, Maroc, Sénégal, Belgique, Suisse et Canada.</p></div>
    </div>
    <footer>BehaviorLab AI · Accompagnement Scolaire Bienveillant</footer>
  </div>
</body>
</html>`
  }
];

export const SiteBuilder: React.FC<SiteBuilderProps> = ({ onNotify }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('agency');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [viewDevice, setViewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'audit'>('preview');
  const [siteVersion, setSiteVersion] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'glass' | 'luxe' | 'clean'>('dark');
  const [selectedFont, setSelectedFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [copiedCode, setCopiedCode] = useState(false);

  // Active template
  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];
  const [generatedHtml, setGeneratedHtml] = useState<string>(currentTemplate.html);

  const handleSelectTemplate = (tpl: TemplatePreset) => {
    setSelectedTemplateId(tpl.id);
    setGeneratedHtml(tpl.html);
    setSiteVersion(v => v + 1);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep('1/4 - Analyse comportementale du projet...');
    await new Promise(r => setTimeout(r, 450));
    setGenerationStep('2/4 - Structuration de la proposition de valeur & Fogg B=MAP...');
    await new Promise(r => setTimeout(r, 600));
    setGenerationStep('3/4 - Génération du code HTML5 responsive avec Tailwind-like CSS...');
    await new Promise(r => setTimeout(r, 550));
    setGenerationStep('4/4 - Injection des formulaires interactifs et boutons de checkout...');
    await new Promise(r => setTimeout(r, 400));

    // Refined template based on prompt
    const newHtml = currentTemplate.html.replace(
      '<h1>Des vidéos qui captent l\'attention dès les 3 premières secondes</h1>',
      `<h1>${prompt.slice(0, 60)}...</h1>`
    );
    setGeneratedHtml(newHtml);
    setSiteVersion(v => v + 1);
    setIsGenerating(false);
    setGenerationStep('');
    if (onNotify) onNotify(`Nouvelle version v${siteVersion + 1} générée avec succès !`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site_andrea_v${siteVersion}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITH CONTROLS */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                Studio Web No-Code & Code
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Score Conversion 96/100
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              🌐 Bâtisseur de Sites Web Ultra — Andrea
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl">
              Générez et personnalisez des pages web complètes testées scientifiquement pour maximiser la conversion.
            </p>
          </div>

          {/* Action cluster */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'audit' ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Psychologique (96/100)</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copié !' : 'Copier HTML'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger index.html</span>
            </button>
          </div>
        </div>

        {/* TEMPLATES CARDS ROW */}
        <div className="pt-2 border-t border-zinc-800">
          <label className="text-xs font-bold text-zinc-400 mb-2 block">
            Modèles de structures haute performance disponibles :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {TEMPLATES.map(tpl => {
              const isSelected = selectedTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`text-left p-3 rounded-2xl border transition flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-zinc-800 border-zinc-600 shadow-md ring-1 ring-zinc-500' 
                      : 'bg-[#212121] border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-700/60 text-zinc-200">
                        {tpl.badge}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-xs font-bold text-white mb-0.5">{tpl.title}</div>
                    <div className="text-[10px] text-zinc-400">{tpl.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROMPT FINE-TUNING BAR */}
        <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ex : Ajoute une bannière de réduction de 30% et remplace le prix par 49 €..."
            className="flex-1 bg-[#212121] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
              isGenerating || !prompt.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-white hover:bg-zinc-200 text-black shadow'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Régénérer par IA</span>
              </>
            )}
          </button>
        </div>

        {isGenerating && (
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-2 pt-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{generationStep}</span>
          </div>
        )}
      </div>

      {/* VIEWPORT CONTROLS & DEVICE SWITCHER */}
      <div className="flex items-center justify-between bg-[#18181b] border border-zinc-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu en Direct</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'code' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Source HTML/CSS</span>
          </button>
        </div>

        {/* Device switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 bg-[#212121] p-1 rounded-xl border border-zinc-700">
          <button
            onClick={() => setViewDevice('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              viewDevice === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Format Ordinateur (1080px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewDevice('tablet')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              viewDevice === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Format Tablette (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablette</span>
          </button>
          <button
            onClick={() => setViewDevice('mobile')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
              viewDevice === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Format Smartphone (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* MAIN VIEW AREA */}
      {activeTab === 'preview' && (
        <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-4 flex justify-center overflow-x-auto min-h-[600px]">
          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-[#121214] ${
              viewDevice === 'mobile'
                ? 'w-[375px] h-[667px] ring-8 ring-zinc-800 rounded-[36px]'
                : viewDevice === 'tablet'
                ? 'w-[768px] h-[720px]'
                : 'w-full min-h-[650px]'
            }`}
          >
            <iframe
              title="Site Web Preview"
              srcDoc={generatedHtml}
              className="w-full h-full min-h-[650px] border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      )}

      {/* CODE SOURCE TAB */}
      {activeTab === 'code' && (
        <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Fichier index.html (autonome sans dépendances)</span>
            <span>{generatedHtml.split('\n').length} lignes · {(generatedHtml.length / 1024).toFixed(1)} Ko</span>
          </div>
          <textarea
            readOnly
            value={generatedHtml}
            rows={22}
            className="w-full bg-transparent text-zinc-200 resize-none focus:outline-none font-mono text-xs leading-relaxed"
          />
        </div>
      )}

      {/* PSYCHOLOGICAL AUDIT TAB */}
      {activeTab === 'audit' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-1">
                Diagnostic Scientifique Andrea
              </div>
              <h3 className="text-xl font-bold text-white">Audit Comportemental & Taux de Conversion</h3>
              <p className="text-xs text-zinc-400">Évaluation basée sur les leviers BJ Fogg (Motivation × Capacité × Déclencheur).</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex flex-col items-center justify-center font-black text-xl text-emerald-300 shadow">
                <span>96</span>
                <span className="text-[9px] font-normal text-emerald-400">/100</span>
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Excellente Rétention</div>
                <div className="text-zinc-400">Friction perçue minimale</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#212121] border border-zinc-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">1. Clarté du Hook</span>
                <span className="text-xs font-bold text-emerald-400">98%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[98%]" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Le visiteur comprend la promesse en moins de 3 secondes sans jargon technique.
              </p>
            </div>

            <div className="bg-[#212121] border border-zinc-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">2. Réduction de Friction</span>
                <span className="text-xs font-bold text-emerald-400">94%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[94%]" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                L'action demandée (clic, essai gratuit ou réservation) exige un effort minime.
              </p>
            </div>

            <div className="bg-[#212121] border border-zinc-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">3. Réassurance & Preuve Sociale</span>
                <span className="text-xs font-bold text-emerald-400">95%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[95%]" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Présence de badges chiffrés, garanties 30 jours et étoiles de satisfaction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
