import { ModifLevel } from '../types/bea';

export const LAB_LEVELS: Record<string, ModifLevel> = {
  '1': {
    id: '1',
    title: '🎨 Niveau 1 : Cosmétique, Design System & UI',
    badge: 'Niveau 1 — Zéro risque',
    scope: 'Textes, boutons, couleurs, styles CSS, disposition, micro-interactions',
    description: 'Modifie l\'interface utilisateur, les palettes de couleurs, les micro-copies et le design system sans toucher à la logique Python.',
    color: 'from-zinc-700/40 to-zinc-800/40 border-zinc-700 text-zinc-200',
    targets: {
      'Styles CSS globaux (classes, fonds, bordures)': 'CSS_STYLES',
      'Cartes d\'accroche (STARTER_CARDS)': 'STARTER_CARDS',
      'Styles de réponse de Bea (STYLE_HINT)': 'STYLE_HINT',
      'Textes de la page d\'accueil (page_vitrine)': 'page_vitrine',
      'Barre latérale & badges (render_sidebar)': 'render_sidebar',
    },
    presets: [
      'Passer toute l\'interface sur une palette épurée monochrome & minimaliste',
      'Remplacer le texte d\'accueil par une formulation orientée action immédiate',
      'Ajouter des raccourcis clavier visuels sous la case d\'envoi',
      'Augmenter le contraste des boutons d\'action et adoucir les bordures',
    ],
    subLevels: [
      {
        id: '1.1',
        title: 'Palette & Tokens de Couleur',
        description: 'Bordures subtiles #383838, fonds sombres #121214 / #212121, contrastes WCAG AAA.',
        target: 'CSS_STYLES',
        defaultPreset: 'Appliquer des tons neutres sombres ultra-propres et supprimer les reflets colorés.',
      },
      {
        id: '1.2',
        title: 'Typographie & Micro-Copies',
        description: 'Phrases d\'accroche concrètes, questions initiales, placeholders et textes d\'onboarding.',
        target: 'STARTER_CARDS',
        defaultPreset: 'Ajouter des accroches directes pour entrepreneurs, étudiants et créateurs de contenu.',
      },
      {
        id: '1.3',
        title: 'Micro-Interactions & États',
        description: 'Effets hover, micro-rebonds, transitions d\'envoi et animations de saisie.',
        target: 'CSS_STYLES',
        defaultPreset: 'Fluidifier les transitions des boutons d\'action et ajouter un retour haptique visuel.',
      },
      {
        id: '1.4',
        title: 'Disposition Responsive & Espacement',
        description: 'Alignement à droite des menus, espacements d\'écran mobile, barres latérales adaptatives.',
        target: 'render_sidebar',
        defaultPreset: 'Optimiser l\'affichage pour smartphone avec barre latérale repliable fluide.',
      },
    ],
  },

  '2': {
    id: '2',
    title: '🧩 Niveau 2 : Page ou Fonction Isolée',
    badge: 'Niveau 2 — Chirurgical',
    scope: 'Une fonction de page ciblée (chat, studio, code, onboarding, compte...)',
    description: 'Isole et modifie uniquement la fonction ciblée. Aucun risque de tronquer les 2500 lignes de app.py !',
    color: 'from-blue-900/30 to-zinc-800/40 border-blue-500/40 text-blue-300',
    targets: {
      '💬 Page Chat (page_chat)': 'page_chat',
      '🎬 Page Studio Créateur (page_studio)': 'page_studio',
      '💻 Page Éditeur de Code (page_code)': 'page_code',
      '🌐 Page Atelier Web HTML (page_app)': 'page_app',
      '🎓 Page Parcours d\'Accueil (page_onboarding)': 'page_onboarding',
      '🎨 Page Personnalisation (page_perso)': 'page_perso',
      '💎 Page Compte & Offres (page_compte)': 'page_compte',
      '🧠 Page Mémoire (page_memoire)': 'page_memoire',
      '📁 Page Projets Enregistrés (page_projets)': 'page_projets',
      '🚪 Page Portail Développeur (page_dev_portal)': 'page_dev_portal',
      '📌 Barre Latérale Complète (render_sidebar)': 'render_sidebar',
      '🌐 Page Vitrine & Auth (page_vitrine)': 'page_vitrine',
    },
    presets: [
      'Ajouter un bouton pour copier la réponse en format Markdown dans page_chat',
      'Ajouter un compteur de caractères sous la zone de texte dans page_code',
      'Ajouter un filtre par format de réseau social dans page_studio',
      'Ajouter un bouton de test rapide dans la page de personnalisation',
    ],
    subLevels: [
      {
        id: '2.1',
        title: 'Moteur de Chat & Dictée Vocale',
        description: 'Logique d\'envoi, gestion du flux streaming, micro vocal et transcription instantanée.',
        target: 'page_chat',
        defaultPreset: 'Intégrer le support de la dictée vocale sans coupure et l\'export PDF du dialogue.',
      },
      {
        id: '2.2',
        title: 'Studio Visuel & Formats Médias',
        description: 'Générateur de miniatures, sous-titres Whisper SRT/VTT, canevas 9:16 et 16:9.',
        target: 'page_studio',
        defaultPreset: 'Ajouter l\'export en bundle ZIP et le découpage par scènes pour les réseaux sociaux.',
      },
      {
        id: '2.3',
        title: 'Console de Code & Sandbox Python',
        description: 'Exécution simulée, coloration syntaxique, historique de révisions de scripts.',
        target: 'page_code',
        defaultPreset: 'Ajouter une analyse de complexité algorithmique et des suggestions de refactoring.',
      },
      {
        id: '2.4',
        title: 'Parcours d\'Onboarding en 4 Étapes',
        description: 'Collecte du profil utilisateur, du style d\'accompagnement et de l\'objectif initial.',
        target: 'page_onboarding',
        defaultPreset: 'Accélérer l\'onboarding en 1 clic pour les utilisateurs pressés avec profil auto-détecté.',
      },
    ],
  },

  '3': {
    id: '3',
    title: '🧠 Niveau 3 : Moteur Comportemental & Psychologie IA',
    badge: 'Niveau 3 — Cœur Psychologique',
    scope: 'Prompts système, détection de biais, protocole 5 étapes, relances d\'action',
    description: 'Ajuste la psychologie et la méthode d\'analyse de Bea (biais cognitifs, 5 étapes, cadrage, relances).',
    color: 'from-emerald-900/30 to-zinc-800/40 border-emerald-500/40 text-emerald-300',
    targets: {
      'Système de prompt dynamique (system_behavior)': 'system_behavior',
      'Comportement de base de Bea (SYSTEM_BEHAVIOR_BASE)': 'SYSTEM_BEHAVIOR_BASE',
      'Cas d\'usage spécialisés (SYSTEM_USE_CASES)': 'SYSTEM_USE_CASES',
      'Prompt de l\'IA Code (SYSTEM_CODE)': 'SYSTEM_CODE',
      'Prompt du Monteur Vidéo (SYSTEM_MONTAGE)': 'SYSTEM_MONTAGE',
      'Prompt du Bâtisseur d\'App Web (SYSTEM_APP)': 'SYSTEM_APP',
    },
    presets: [
      'Renforcer l\'analyse des biais cognitifs (ancrage, aversion à la perte, statu quo) dans SYSTEM_USE_CASES',
      'Intégrer le modèle de comportement BJ Fogg (Motivation × Capacité × Déclencheur)',
      'Ajouter une étape \'Micro-défi de 15 minutes\' dans SYSTEM_BEHAVIOR_BASE',
      'Personnaliser le ton selon le niveau de fatigue ou de surcharge cognitive détecté',
    ],
    subLevels: [
      {
        id: '3.1',
        title: 'Modèle Comportemental de Fogg (B=MAP)',
        description: 'Analyse si le blocage vient de la Motivation, de la Capacité (friction) ou du Déclencheur.',
        target: 'SYSTEM_BEHAVIOR_BASE',
        defaultPreset: 'Insérer une grille de diagnostic Fogg pour chaque problème soumis.',
      },
      {
        id: '3.2',
        title: 'Détection des 12 Biais Cognitifs Majeurs',
        description: 'Biais d\'ancrage, illusion de planification, coût irrécupérable, validation sociale...',
        target: 'SYSTEM_USE_CASES',
        defaultPreset: 'Nommer explicitement le biais cognitif à l\'œuvre et donner le contre-poison immédiat.',
      },
      {
        id: '3.3',
        title: 'Protocole d\'Exécution en 5 Étapes',
        description: 'Reformulation empathique -> Diagnostics -> Leviers -> 3 actions aujourd\'hui -> Question d\'engagement.',
        target: 'SYSTEM_BEHAVIOR_BASE',
        defaultPreset: 'Forcer des actions de moins de 15 minutes pour briser toute inertie de démarrage.',
      },
      {
        id: '3.4',
        title: 'Nudges Anti-Procrastination & Momentum',
        description: 'Déclencheurs comportementaux doux, renforcement positif et maintien de la série (streak).',
        target: 'system_behavior',
        defaultPreset: 'Calculer un score d\'élan (Momentum Score) basé sur la régularité des progrès.',
      },
    ],
  },

  '4': {
    id: '4',
    title: '💾 Niveau 4 : Mémoire Contextuelle (RAG) & Profils',
    badge: 'Niveau 4 — Mémoire Profonde',
    scope: 'Mémoire vectorielle, profilage adaptatif, historique des blocages résolus',
    description: 'Gère la mémoire durable de Bea pour qu\'elle se souvienne des projets, forces, faiblesses et habitudes de l\'utilisateur.',
    color: 'from-amber-900/30 to-zinc-800/40 border-amber-500/40 text-amber-300',
    targets: {
      'Page Mémoire Utilisateur (page_memoire)': 'page_memoire',
      'Gestion des Préférences (save_onboarding)': 'save_onboarding',
      'Table Mémoires Supabase (memories)': 'memories',
      'Options de Profils (PROFILE_OPTIONS)': 'PROFILE_OPTIONS',
    },
    presets: [
      'Connecter un graphe de connaissances personnel qui relie les projets et les blocages récurrents',
      'Ajouter la détection automatique des victoires et réussites pour les stocker en mémoire positive',
      'Créer un bouton \'Purger la mémoire\' pour respecter la vie privée et le RGPD en 1 clic',
    ],
    subLevels: [
      {
        id: '4.1',
        title: 'Mémoire Sémantique Long Terme',
        description: 'Indexation des décisions passées, des engagements pris et des objectifs à 30 jours.',
        target: 'page_memoire',
        defaultPreset: 'Afficher les 5 apprentissages clés que Bea a mémorisés sur vous.',
      },
      {
        id: '4.2',
        title: 'Graphe d\'Habitudes & Suivi de Momentum',
        description: 'Visualisation de la série de jours actifs, des patterns de réussite et des heures propices.',
        target: 'page_memoire',
        defaultPreset: 'Ajouter une courbe visuelle de régularité hebdomadaire.',
      },
      {
        id: '4.3',
        title: 'Profils Métiers Hyper-Spécialisés',
        description: 'Créateur solo, développeur indépendant, cadre dirigeant, étudiant concours...',
        target: 'PROFILE_OPTIONS',
        defaultPreset: 'Ajouter les profils Consultant B2B et Chercheur / Universitaire avec vocabulaire ciblé.',
      },
      {
        id: '4.4',
        title: 'Souveraineté des Données & Droit à l\'Oubli',
        description: 'Chiffrement de bout en bout, export JSON/CSV complet, suppression sélective.',
        target: 'page_memoire',
        defaultPreset: 'Permettre d\'éditer ou de supprimer une mémoire précise d\'un simple clic.',
      },
    ],
  },

  '5': {
    id: '5',
    title: '🤖 Niveau 5 : Multi-Agents Autonomes & Orchestration',
    badge: 'Niveau 5 — Intelligence Collective',
    scope: 'Agents spécialisés collaboratifs : Analyste, Critique, Bâtisseur, Stratège',
    description: 'Fait collaborer plusieurs sous-agents IA spécialisés pour valider, challenger et enrichir les solutions de Bea.',
    color: 'from-purple-900/30 to-zinc-800/40 border-purple-500/40 text-purple-300',
    targets: {
      'Système Multi-Agents': 'MULTI_AGENTS',
      'Agent Critique de Prompts (agent_critic)': 'agent_critic',
      'Agent Analyste Comportemental (agent_psycho)': 'agent_psycho',
      'Agent Bâtisseur de Solution (agent_builder)': 'agent_builder',
    },
    presets: [
      'Ajouter un Agent Critique qui challenge le plan d\'action avant de l\'afficher à l\'utilisateur',
      'Activer une double-lecture : un agent psychologue + un agent pragmatique orienté ROI',
      'Intégrer un agent de veille qui suggère des modèles mentaux applicables',
    ],
    subLevels: [
      {
        id: '5.1',
        title: 'Agent Analyste Comportemental',
        description: 'Détecte les signaux faibles, les non-dits et les paradoxes dans les messages utilisateurs.',
        target: 'MULTI_AGENTS',
        defaultPreset: 'Fournir un diagnostic en 3 points : Friction perçue, Ressource manquante, Déclencheur idéal.',
      },
      {
        id: '5.2',
        title: 'Agent Critique & Red Team',
        description: 'Challenger amicalement le plan proposé pour s\'assurer qu\'il est 100% réaliste.',
        target: 'MULTI_AGENTS',
        defaultPreset: 'Poser la question test : \'Si tu n\'as que 50% de ton énergie demain, pourras-tu quand même le faire ?\'',
      },
      {
        id: '5.3',
        title: 'Agent Bâtisseur de Prototypes',
        description: 'Génère instantanément le squelette de code, de page web ou de script associé.',
        target: 'MULTI_AGENTS',
        defaultPreset: 'Produire un livrable clé en main (code, texte, email ou template) dès la première réponse.',
      },
      {
        id: '5.4',
        title: 'Agent Stratège Contenu & Croissance',
        description: 'Optimisation de la diffusion, des angles d\'accroche et de la conversion.',
        target: 'MULTI_AGENTS',
        defaultPreset: 'Structurer un calendrier d\'exécution sur 7 jours avec jalons vérifiables.',
      },
    ],
  },

  '6': {
    id: '6',
    title: '🌐 Niveau 6 : Bâtisseur de Sites & Apps Web Ultra',
    badge: 'Niveau 6 — Studio No-Code / Code',
    scope: 'Générateur de landing pages, applications interactives, audits de conversion',
    description: 'Transforme n\'importe quel projet ou offre en un site web complet responsive avec formulaires, grilles de prix et audit psychologique.',
    color: 'from-cyan-900/30 to-zinc-800/40 border-cyan-500/40 text-cyan-300',
    targets: {
      'Moteur Bâtisseur de Site (SiteBuilder)': 'SiteBuilder',
      'Prompt Système Bâtisseur Web (SYSTEM_APP)': 'SYSTEM_APP',
      'Page Atelier Web (page_app)': 'page_app',
    },
    presets: [
      'Ajouter un sélecteur de style (Cyberpunk, Minimalist SaaS, Apple Clean, Luxe)',
      'Intégrer un audit automatique du score de conversion psychologique (sur 100)',
      'Permettre le téléchargement en 1 clic du code HTML complet ou bundle ZIP',
    ],
    subLevels: [
      {
        id: '6.1',
        title: 'Moteur de Templates Haute Conversion',
        description: 'Bibliothèque de structures testées (SaaS, formation, portfolio, produit unique, agence).',
        target: 'SiteBuilder',
        defaultPreset: 'Ajouter 6 variantes de héros avec compte à rebours, avatars animés et badges de réassurance.',
      },
      {
        id: '6.2',
        title: 'Composants Interactifs & Formulairés',
        description: 'FAQ accordéon, comparateur de tarifs mensuel/annuel, modale de réservation d\'appel.',
        target: 'SiteBuilder',
        defaultPreset: 'Insérer un calculateur de devis dynamique directement utilisable par le visiteur.',
      },
      {
        id: '6.3',
        title: 'Audit Psychologique de Conversion',
        description: 'Score de friction, clarté de la proposition de valeur, présence de preuves sociales.',
        target: 'SiteBuilder',
        defaultPreset: 'Générer un rapport d\'audit en 5 points avec recommandations d\'amélioration.',
      },
      {
        id: '6.4',
        title: 'Export Multi-Formats (HTML, React, Tailwind)',
        description: 'Exportation prête à déployer sur Vercel, Netlify ou hébergement classique.',
        target: 'SiteBuilder',
        defaultPreset: 'Fournir le fichier index.html autonome sans aucune dépendance externe lourde.',
      },
    ],
  },

  '7': {
    id: '7',
    title: '🌍 Niveau 7 : Moteur Multilingue & Internationalisation',
    badge: 'Niveau 7 — Présence Mondiale',
    scope: '15 langues majeures des modèles IA, adaptation culturelle des idiomes comportementaux',
    description: 'Permet à Bea de dialoguer et d\'analyser dans les 15 langues majeures parlées par les meilleurs modèles de pointe mondiaux.',
    color: 'from-indigo-900/30 to-zinc-800/40 border-indigo-500/40 text-indigo-300',
    targets: {
      'Sélecteur de Langue Vitrine (page_vitrine)': 'page_vitrine',
      'Système Multilingue (LANGUAGES)': 'LANGUAGES',
      'Prompt Multilingue Bea (system_behavior)': 'system_behavior',
    },
    presets: [
      'Ajouter le sélecteur des 15 langues dans la barre latérale du site visiteur',
      'Adapter les expressions comportementales aux spécificités culturelles de chaque pays',
      'Activer la détection automatique de la langue de l\'utilisateur dès sa première phrase',
    ],
    subLevels: [
      {
        id: '7.1',
        title: 'Les 15 Langues Majeures des LLMs',
        description: 'Français, English, Español, Deutsch, Português, Italiano, Nederlands, العربية, 中文, 日本語, 한국어, Русский, हिन्दी, Türkçe, Wolof.',
        target: 'LANGUAGES',
        defaultPreset: 'Configurer le dictionnaire de traduction pour tous les boutons et en-têtes.',
      },
      {
        id: '7.2',
        title: 'Adaptation Culturelle des Biais',
        description: 'Nuances des déclencheurs de confiance et de passage à l\'action selon les zones géographiques.',
        target: 'system_behavior',
        defaultPreset: 'Prendre en compte les styles de communication directs vs indirects selon la langue.',
      },
      {
        id: '7.3',
        title: 'Détection & Switch Instantané',
        description: 'Changement de langue en temps réel sans rechargement de page.',
        target: 'page_vitrine',
        defaultPreset: 'Synchroniser la langue de l\'interface avec la préférence du navigateur de l\'utilisateur.',
      },
      {
        id: '7.4',
        title: 'Transcription Multilingue Whisper',
        description: 'Reconnaissance vocale multilingue avec horodatage pour tous les formats audio.',
        target: 'page_studio',
        defaultPreset: 'Activer la transcription automatique avec détection de la langue source.',
      },
    ],
  },

  '8': {
    id: '8',
    title: '🏛️ Niveau 8 : Architecture Globale, Sécurité AST & Sandbox',
    badge: 'Niveau 8 — Gardien du Système',
    scope: 'Fichier complet app.py, bouclier AST Python, rollbacks infinis, quotas Supabase',
    description: 'Modifications transversales avec contrôle syntaxique rigoureux (ast.parse) et rollbacks automatiques en cas d\'erreur.',
    color: 'from-rose-900/30 to-zinc-800/40 border-rose-500/40 text-rose-300',
    targets: {
      'Fichier complet app.py (Architecture)': 'FULL_FILE',
      'Validation AST Python (ast_check)': 'ast_check',
      'Système de Quotas & Tokens (quota_consume)': 'quota_consume',
    },
    presets: [
      'Renforcer le bouclier AST pour bloquer toute commande dangereuse avant exécution',
      'Ajouter un snapshot automatique à chaque modification avec restauration en 1 clic',
      'Optimiser la gestion de session cookie persistante pour éviter les déconnexions',
    ],
    subLevels: [
      {
        id: '8.1',
        title: 'Validation Syntaxique AST Intégrale',
        description: 'Vérification ast.parse(code) pour garantir zéro erreur de syntaxe ou indentation.',
        target: 'FULL_FILE',
        defaultPreset: 'Empêcher la sauvegarde de tout code générant un SyntaxError ou IndentationError.',
      },
      {
        id: '8.2',
        title: 'Prompt Shield & Détection d\'Injection',
        description: 'Filtre anti-jailbreak pour protéger les instructions système fondamentales de Bea.',
        target: 'FULL_FILE',
        defaultPreset: 'Bloquer toute tentative de modification non autorisée des clés d\'accès.',
      },
      {
        id: '8.3',
        title: 'Historique de Sauvegardes & Rollback Instantané',
        description: 'Création automatique de points de restauration avant chaque modification.',
        target: 'FULL_FILE',
        defaultPreset: 'Permettre de restaurer n\'importe quelle version précédente en 1 clic.',
      },
      {
        id: '8.4',
        title: 'Quotas, Rate-Limiting & Supabase RPC',
        description: 'Gestion robuste des limites d\'appels, du cache mémoire et des flux de données.',
        target: 'FULL_FILE',
        defaultPreset: 'Ajouter une file d\'attente avec exponential backoff en cas de saturation de l\'API.',
      },
    ],
  },
};

export const SAMPLE_TARGET_SNIPPETS: Record<string, string> = {
  CSS_STYLES: `<style>
.stApp { background: #121214 !important; }
[data-testid="stSidebar"] { background: #121214 !important; border-right: 1px solid #27272a !important; }
div[data-testid="stButton"]>button { background: #212121 !important; color: #f4f4f5 !important; border-radius: 12px !important; border: 1px solid #383838 !important; }
div[data-testid="stChatMessage"] { background: #18181b !important; border: 1px solid #27272a !important; border-radius: 16px !important; }
div[data-testid="stChatInput"] { background: #212121 !important; border: 1px solid #383838 !important; border-radius: 26px !important; }
</style>`,

  page_chat: `def page_chat():
    st.markdown("### 💬 Discussion avec Bea")
    if not st.session_state.messages:
        pt = (st.session_state.prefs or {}).get("profile_type") or "createur"
        st.info("Bonjour, je suis Bea. Décris-moi un projet ou un blocage et je t'aide à repérer ce qui te freine, puis à construire un plan d'action mesurable.")
        cols = st.columns(3)
        for i, q in enumerate(STARTER_CARDS.get(pt, [])):
            with cols[i % 3]:
                if st.button(q, key=f"starter_{pt}_{i}"):
                    handle_send(q, None)
    else:
        for idx, m in enumerate(st.session_state.messages):
            render_message(m, idx)
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            if st.button("🔄 Régénérer"):
                ...`,

  page_studio: `def page_studio():
    menu = st.session_state.studio_menu
    st.markdown(f"### 🎬 Studio créateur — {studio_section_label(menu)}")
    if menu == "composer":
        # Studio de Design Visuel Bea
        ...
    elif menu == "sous_titres":
        # Module de transcription automatique Whisper SRT/VTT
        ...
    elif menu == "miniature":
        # Générateur 1280x720 haute conversion
        ...`,

  SYSTEM_BEHAVIOR_BASE: `SYSTEM_BEHAVIOR_BASE = """Tu es Bea, une IA d'analyse comportementale créée par BehaviorLab AI. Tu aides les entreprises, les indépendants et les créateurs de contenu à avancer sur leurs projets.

PRINCIPE CENTRAL : tu apportes de la valeur dès ta toute première réponse. Tu ne poses JAMAIS de questions avant d'aider et tu ne conditionnes jamais ta réponse à des précisions.

FORMAT PAR DÉFAUT :
1. Une phrase qui reformule la situation.
2. Problèmes possibles (4 à 6 blocages comportementaux identifiés).
3. Leviers d'action concrets (4 à 6 leviers applicables sans attendre).
4. Plan de démarrage (3 actions simples pour aujourd'hui ou cette semaine).
5. UNE seule question facultative pour affiner."""`,

  SYSTEM_USE_CASES: `SYSTEM_USE_CASES = {
    "clients": "MODE ANALYSE CLIENTS / PROSPECTS. Mobilise les biais cognitifs d'achat...",
    "contenu": "MODE STRATÈGE CONTENU CRÉATEUR. Hooks qui arrêtent le scroll...",
    "scolaire": "MODE ACCOMPAGNEMENT SCOLAIRE. Adaptation au programme du pays...",
    "site": "MODE BÂTISSEUR DE SITE. Psychologie de la conversion...",
    "code": "MODE COACH CODE. Debug et explications pas à pas...",
  }`,

  SiteBuilder: `<!-- Moteur Bâtisseur de Site Web Bea BehaviorLab AI -->
<section class="hero-section">
  <div class="badge">🔥 CONVERSION MAXIMALE · SCORE 98/100</div>
  <h1>Transformez vos visiteurs en clients fidèles</h1>
  <p>Une architecture validée par les sciences comportementales pour maximiser l'action.</p>
  <div class="cta-group">
    <a href="#tarifs" class="btn-primary">Démarrer maintenant</a>
    <a href="#demo" class="btn-secondary">Voir la démo</a>
  </div>
</section>`,

  MULTI_AGENTS: `# Orchestration Multi-Agents BehaviorLab AI
def orchestrate_agents(user_prompt, context):
    analysis = agent_psycho.analyze(user_prompt)
    critique = agent_critic.evaluate(analysis)
    solution = agent_builder.construct(critique)
    return solution`,

  LANGUAGES: `# Dictionnaire 15 Langues des Grands Modèles IA
SUPPORTED_LANGS = [
    "Français", "English", "Español", "Deutsch", "Português",
    "Italiano", "Nederlands", "العربية", "中文", "日本語",
    "한국어", "Русский", "हिन्दी", "Türkçe", "Wolof"
]`,

  FULL_FILE: `# Fichier complet app.py (2500+ lignes)
# Architecture BehaviorLab AI avec Validation AST Strict
import ast, base64, difflib, html, io, json, os, re, time, zipfile
from collections import deque
from datetime import datetime, timezone
import streamlit as st
...`,
};
