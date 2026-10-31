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
      "Styles de réponse d'Andrea (STYLE_HINT)": 'STYLE_HINT',
      'Textes de la page d\'accueil (page_vitrine)': 'page_vitrine',
      'Barre latérale & badges (render_sidebar)': 'render_sidebar',
    },
    presets: [
      'Passer toute l\'interface sur une palette épurée violet profond (#181135 / #201844)',
      'Ajuster la case de discussion en grand bloc à 2 étages avec boutons circulaires 36px',
      'Remplacer le texte d\'accueil par une formulation orientée action immédiate',
      'Augmenter le contraste des boutons d\'action et adoucir les bordures',
    ],
    deepGuide: {
      summary: 'Le Niveau 1 est le niveau à risque zéro absolu. Il cible uniquement les styles CSS, les variables de couleurs, les micro-copies de l\'interface et la disposition visuelle, sans toucher aux fonctions Python.',
      mentalModel: 'Comme repeindre et réaménager la décoration d\'un espace de travail sans toucher aux murs porteurs ni aux circuits électriques.',
      whenToUse: [
        'Ajuster la palette de couleurs (ex. fond violet sombre #181135 au lieu de noir absolu).',
        'Redimensionner et aligner les boutons d\'action (+, micro, envoyer) pour éviter toute superposition.',
        'Modifier les micro-copies : accroches, questions initiales, placeholders et badges.',
        'Harmoniser les bordures, ombres portées et rayons de courbure des cartes.',
      ],
      safeGuards: [
        'Aucune logique Python métier n\'est altérée.',
        'Protection syntaxique f-string automatique (doublage strict des accolades {{ et }}).',
        'Rendu visuel instantané et prévisualisation directe.',
      ],
      targetedFiles: [
        'app.py (bloc CSS injecté via st.markdown)',
        'andrea_generator.py (palettes graphiques et dégradés)',
        'src/index.css & configuration Tailwind',
      ],
      commonPitfalls: [
        'Oublier de doubler les accolades {{ }} dans les sélecteurs CSS à l\'intérieur d\'une f-string Python (provoque une NameError critique sur Streamlit Cloud).',
        'Utiliser un sélecteur trop générique écrasant les styles d\'autres composants.',
        'Mettre un fond noir absolu (#000000) au lieu du violet profond signature d\'Andrea (#181135 / #201844).',
      ],
      practicalExample: {
        userPrompt: 'Passe le fond de la case de discussion en violet profond #201844 et fixe les boutons à 36px de diamètre.',
        actionDescription: 'Cible le bloc div[data-testid="stChatInput"] avec accolades échappées {{ }} et positionnement absolu des boutons.',
        codeSample: `div[data-testid="stChatInput"] {{
    background: #201844 !important;
    border: 1px solid #5A33FF55 !important;
    border-radius: 24px !important;
    padding-bottom: 48px !important;
    min-height: 98px !important;
}}`,
      },
    },
    subLevels: [
      {
        id: '1.1',
        title: 'Palette & Tokens de Couleur',
        description: 'Bordures subtiles #5A33FF44, fonds sombres #181135 / #201844, contrastes WCAG AAA.',
        target: 'CSS_STYLES',
        defaultPreset: 'Appliquer les tons violets profonds élégants et supprimer les reflets agressifs.',
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
        defaultPreset: 'Fluidifier les transitions des boutons d\'action et ajouter un retour visuel soigné.',
      },
      {
        id: '1.4',
        title: 'Disposition Responsive & Espacement',
        description: 'Alignement à droite des menus, espacements smartphone, barres d\'outils adaptatives.',
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
    deepGuide: {
      summary: 'Le Niveau 2 intervient de manière chirurgicale sur une fonction autonome de l\'application (page_chat, page_studio, etc.). Seul le sous-arbre AST de la fonction est réécrit.',
      mentalModel: 'Comme une opération en micro-chirurgie : on n\'ouvre que la partie concernée, on opère sous microscope avec vérification automatique, et on referme sans affecter le reste de l\'organisme.',
      whenToUse: [
        'Ajouter une fonctionnalité à un onglet précis (ex. export PDF ou dictée vocale dans le chat).',
        'Modifier le workflow de création du studio de publication.',
        'Ajouter un champ ou une étape dans le parcours d\'onboarding initial.',
        'Optimiser la console d\'exécution de code Python.',
      ],
      safeGuards: [
        'Isolation AST stricte : les autres pages et fonctions ne sont pas touchées.',
        'Contrôle syntaxique préalable avant réinsertion dans le fichier principal.',
        'Création systématique d\'un point de restauration avant réécriture.',
      ],
      targetedFiles: [
        'app.py (fonctions page_chat, page_studio, page_code, page_onboarding)',
        'andrea_voice.py (moteur de voix)',
        'andrea_utils.py (outils de transformation)',
      ],
      commonPitfalls: [
        'Introduire des variables d\'état non initialisées dans st.session_state.',
        'Créer des dépendances circulaires avec des modules externes non installés.',
      ],
      practicalExample: {
        userPrompt: 'Ajoute un bouton de téléchargement en PDF de la discussion dans page_chat().',
        actionDescription: 'Modifie la section finale de page_chat pour injecter un bouton st.download_button avec mise en page soignée.',
        codeSample: `if st.session_state.messages:
    pdf_bytes = export_chat_to_pdf(st.session_state.messages)
    st.download_button("⬇️ Télécharger le dialogue (PDF)", pdf_bytes, file_name="andrea_dialogue.pdf")`,
      },
    },
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
    description: "Ajuste la psychologie et la méthode d'analyse d'Andrea (biais cognitifs, 5 étapes, cadrage, relances).",
    color: 'from-emerald-900/30 to-zinc-800/40 border-emerald-500/40 text-emerald-300',
    targets: {
      'Système de prompt dynamique (system_behavior)': 'system_behavior',
      "Comportement de base d'Andrea (SYSTEM_BEHAVIOR_BASE)": 'SYSTEM_BEHAVIOR_BASE',
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
    deepGuide: {
      summary: 'Le Niveau 3 est le cerveau psychologique et comportemental d\'Andrea. Il pilote les instructions système fondamentales, l\'éthique d\'accompagnement, les modèles mentaux et les déclencheurs de passage à l\'action.',
      mentalModel: 'Comme définir la philosophie, les principes d\'éthique et la méthode d\'un mentor de classe mondiale : il ne pose aucun diagnostic médical, n\'invente aucun faux obstacle, mais sait guider avec une clarté redoutable.',
      whenToUse: [
        'Ajuster les 4 tonalités d\'Andrea (Direct, Doux, Détaillé, Expert comportemental).',
        'Enrichir la détection des biais cognitifs majeurs (ancrage, preuve sociale, aversion à la perte).',
        'Renforcer la règle capitale : ne jamais inventer de blocage artificiel si l\'utilisateur n\'en exprime aucun.',
        'Spécialiser les protocoles de réponse pour les entrepreneurs, créateurs ou lycéens/étudiants.',
      ],
      safeGuards: [
        'Garde-fous éthiques stricts : aucune promesse médicale, renvoi vers les numéros d\'urgence (3114, 15, 112) en cas de détresse.',
        'Interdiction d\'inventer des statistiques ou des chiffres non vérifiés.',
        'Alignement permanent avec la langue choisie par l\'utilisateur.',
      ],
      targetedFiles: [
        'app.py (constantes SYSTEM_BEHAVIOR_BASE, SYSTEM_USE_CASES, STYLE_HINT)',
        'andrea_i18n.py (adaptation des nuances linguistiques)',
      ],
      commonPitfalls: [
        'Créer des prompts trop directifs ou mécaniques qui transforment Andrea en robot rigide.',
        'Forcer un diagnostic de problème psychologique quand l\'utilisateur demande simplement une formule mathématique ou un bout de code.',
      ],
      practicalExample: {
        userPrompt: 'Assure-toi qu\'Andrea ne diagnostique un blocage que si l\'utilisateur exprime expressément un doute ou une friction.',
        actionDescription: 'Ajoute la clause de discernement dans SYSTEM_BEHAVIOR_BASE.',
        codeSample: `RÈGLE CAPITALE SUR LES BLOCAGES :
- N'INVENTE JAMAIS DE BLOCAGE ARTIFICIEL. Si l'utilisateur ne mentionne ni blocage, ni difficulté, réponds directement à sa question.
- Tu n'explores les mécanismes psychologiques QUE si l'utilisateur exprime expressément un frein.`,
      },
    },
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
    description: "Gère la mémoire durable d'Andrea pour qu'elle se souvienne des projets, forces, faiblesses et habitudes de l'utilisateur.",
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
    deepGuide: {
      summary: 'Le Niveau 4 confère à Andrea une mémoire évolutive et personnalisée : historique des projets, profils types, forces, faiblesses récurrentes et capitalisation des victoires.',
      mentalModel: 'Comme le carnet de suivi confidentiel d\'un coach qui retient exactement où vous en êtes, ce qui vous stimule et ce qui vous a débloqué la dernière fois.',
      whenToUse: [
        'Ajouter de nouvelles filières ou profils métiers (Créateur, Étudiant, Indépendant, Développeur).',
        'Gérer la persistance sécurisée via HMAC / enveloppe signée ou table Supabase.',
        'Ajouter un tableau de bord visuel des mémoires acquises avec option d\'édition.',
        'Garantir le droit à l\'effacement complet (RGPD) en 1 clic.',
      ],
      safeGuards: [
        'Chiffrement et intégrité signée pour empêcher toute injection locale falsifiée.',
        'Isolation stricte des données par identifiant utilisateur.',
        'Confirmation explicite avant toute suppression irréversible de mémoire.',
      ],
      targetedFiles: [
        'app.py (page_memoire, DEFAULT_PREFS, save_onboarding)',
        'src/data/profilesData.ts',
        'src/utils/security.ts',
      ],
      commonPitfalls: [
        'Surcharger le contexte LLM avec des mémoires obsolètes ou non pertinentes.',
        'Oublier de vérifier l\'intégrité des données stockées dans le stockage local.',
      ],
      practicalExample: {
        userPrompt: 'Permets à l\'utilisateur d\'effacer une mémoire précise ou de réinitialiser son profil en 1 clic.',
        actionDescription: 'Ajoute les handlers de suppression granulaire dans page_memoire().',
        codeSample: `def delete_memory(mem_id):
    st.session_state.memories = [m for m in st.session_state.memories if m['id'] != mem_id]
    st.success("Mémoire supprimée avec succès.")`,
      },
    },
    subLevels: [
      {
        id: '4.1',
        title: 'Mémoire Sémantique Long Terme',
        description: 'Indexation des décisions passées, des engagements pris et des objectifs à 30 jours.',
        target: 'page_memoire',
        defaultPreset: 'Afficher les 5 apprentissages clés qu\'Andrea a mémorisés sur vous.',
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
    description: "Fait collaborer plusieurs sous-agents IA spécialisés pour valider, challenger et enrichir les solutions d'Andrea.",
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
    deepGuide: {
      summary: 'Le Niveau 5 déploie une équipe d\'agents IA collaboratifs dotés de rôles complémentaires pour analyser en profondeur, critiquer les failles et formuler la réponse la plus solide.',
      mentalModel: 'Comme un cabinet d\'experts de haut vol : l\'analyste diagnostique le problème réel, le critique vérifie si le plan est réaliste, et le bâtisseur produit immédiatement le livrable.',
      whenToUse: [
        'Mettre en place une validation croisée (ex. Red Teaming amical avant de livrer un plan).',
        'Créer des livrables doubles : diagnostic stratégique d\'un côté, code ou script de l\'autre.',
        'Ajuster la répartition des rôles entre l\'analyste, le critique et le bâtisseur.',
      ],
      safeGuards: [
        'Gestion des timeouts pour éviter toute attente prolongée.',
        'Contrôle des quotas et consommation de jetons Groq/Llama.',
        'Synthèse finale toujours limpide et unifiée pour l\'utilisateur.',
      ],
      targetedFiles: [
        'app.py (orchestration multi-agents)',
        'andrea_generator.py (agents créatifs)',
      ],
      commonPitfalls: [
        'Multiplier les allers-retours entre agents créant un effet de bavardage artificiel.',
        'Oublier de masquer les traces techniques internes pour l\'utilisateur final.',
      ],
      practicalExample: {
        userPrompt: 'Insère un Agent Critique amical qui vérifie si le plan proposé peut être exécuté même un jour de faible motivation.',
        actionDescription: 'Configure l\'agent Red Team pour poser la question test d\'adhérence.',
        codeSample: `def agent_critique_check(plan):
    prompt = f"Tu es l'Agent Critique bienveillant. Challenge ce plan : {plan}. Est-il faisable avec 50% d'énergie ?"
    return ask_llm(prompt)`,
      },
    },
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
    deepGuide: {
      summary: 'Le Niveau 6 pilote la génération autonome de pages web, landing pages et interfaces interactives avec audit de friction psychologique et export instantané.',
      mentalModel: 'Comme un studio web intégré clé en main : vous décrivez votre offre ou votre idée, et Andrea assemble les composants HTML/Tailwind, rédige l\'accroche et génère le fichier prêt à déployer.',
      whenToUse: [
        'Ajouter de nouveaux modèles de sites (SaaS, portfolio, formation en ligne, agence).',
        'Intégrer des composants riches : tarification mensuelle/annuelle, accordéons FAQ, formulaires de contact.',
        'Ajouter un score d\'audit de conversion basé sur les principes de clarté et de preuve sociale.',
        'Exporter un fichier .html unique autonome sans configuration serveur.',
      ],
      safeGuards: [
        'Sanitisation XSS stricte sur tous les codes générés.',
        'Aperçu sécurisé dans un iframe isolé (sandbox).',
        'Génération 100% autonome sans clé tierce requise.',
      ],
      targetedFiles: [
        'src/components/SiteBuilder.tsx',
        'app.py (page_app, SYSTEM_APP)',
      ],
      commonPitfalls: [
        'Inclure des scripts externes susceptibles de bloquer le chargement.',
        'Créer des éléments avec disposition non responsive cassant sur mobile.',
      ],
      practicalExample: {
        userPrompt: 'Ajoute un audit automatique du score de clarté et de réassurance sur le site généré.',
        actionDescription: 'Calcule les points clés de conversion (présence de CTA clair, témoignages, FAQ).',
        codeSample: `const score = (hasCta ? 40 : 0) + (hasTestimonials ? 30 : 0) + (hasFaq ? 30 : 0);
return <div className="conversion-score">Score d'impact : {score}/100</div>;`,
      },
    },
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
        title: 'Composants Interactifs & Formulaires',
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
        description: 'Exportation prête à déployer en ligne, sur le Cloud ou hébergement classique.',
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
    description: 'Permet à Andrea de dialoguer et d\'analyser dans les 15 langues majeures parlées par les meilleurs modèles de pointe mondiaux.',
    color: 'from-indigo-900/30 to-zinc-800/40 border-indigo-500/40 text-indigo-300',
    targets: {
      'Sélecteur de Langue Vitrine (page_vitrine)': 'page_vitrine',
      'Système Multilingue (LANGUAGES)': 'LANGUAGES',
      'Prompt Multilingue Andrea (system_behavior)': 'system_behavior',
      'Moteur i18n Andrea (andrea_i18n.py)': 'andrea_i18n',
    },
    presets: [
      'Ajouter le sélecteur des 15 langues dans la barre latérale du site visiteur',
      'Adapter les expressions comportementales aux spécificités culturelles de chaque pays',
      'Activer la détection automatique de la langue de l\'utilisateur dès sa première phrase',
    ],
    deepGuide: {
      summary: 'Le Niveau 7 gère l\'internationalisation et l\'universalité d\'Andrea à travers 15 langues majeures avec adaptation culturelle, traduction en cache et synthèse vocale neuronale multilingue.',
      mentalModel: 'Comme un conseiller polyglotte qui ne se contente pas de traduire des mots, mais adopte les tournures de pensée, les métaphores et le niveau de franchise approprié à chaque culture.',
      whenToUse: [
        'Ajouter ou affiner les 15 langues supportées (FR, EN, ES, DE, PT, IT, NL, AR, ZH, JA, KO, RU, HI, TR, WO).',
        'Configurer la synthèse vocale Edge TTS / MiniMax adaptée à chaque dialecte.',
        'Optimiser le cache persistant .andrea_i18n_cache.json pour zéro temps de latence.',
        'Gérer la direction d\'écriture de droite à gauche (RTL) pour l\'arabe.',
      ],
      safeGuards: [
        'Cache mémoire persistant évitant toute surcharge réseau.',
        'Fallback automatique vers le français en cas de terme manquant.',
        'Support complet UTF-8 et gestion des alphabets non-latins.',
      ],
      targetedFiles: [
        'andrea_i18n.py (moteur de traduction et patch transparent)',
        'andrea_voice.py (voix neuronales multilingues)',
        'app.py (render_language_selector)',
      ],
      commonPitfalls: [
        'Traduire les noms de variables techniques ou d\'identifiants de widget.',
        'Oublier d\'enregistrer la clé d\'état dans st.session_state["andrea_lang"].',
      ],
      practicalExample: {
        userPrompt: 'Assure-toi que la langue sélectionnée persiste dans andrea_lang et synchronise la voix correspondante.',
        actionDescription: 'Configure la synchronisation de langue entre andrea_i18n et andrea_voice.',
        codeSample: `selected = render_language_selector()
if selected:
    st.session_state["andrea_lang"] = selected
    set_voice_language(selected)`,
      },
    },
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
      'Valider la syntaxe intégrale de app.py avec le scanner AST avant tout déploiement',
      'Renforcer le bouclier AST pour bloquer toute commande dangereuse avant exécution',
      'Ajouter un snapshot automatique à chaque modification avec restauration en 1 clic',
      'Optimiser la gestion de session cookie persistante pour éviter les déconnexions',
    ],
    deepGuide: {
      summary: 'Le Niveau 8 est la tour de contrôle du système. Il garantit la stabilité absolue des 2500+ lignes de app.py et des modules andrea_*.py grâce à l\'analyse statique AST, l\'historique des rollbacks et le contrôle des quotas.',
      mentalModel: 'Le responsable de la sécurité des vols : rien ne décolle sans que chaque écrou, chaque chaîne de caractères et chaque fonction n\'ait passé avec succès les tests de résistance.',
      whenToUse: [
        'Inspecter et corriger une erreur globale de compilation ou de démarrage (ex. f-string NameError sur Streamlit Cloud).',
        'Restaurer une version précédente saine grâce à l\'historique des snapshots horodatés.',
        'Mettre à jour la logique de session persistante (cookies sécurisés SameSite=Lax).',
        'Synchroniser app.py et public/app.py pour garantir des téléchargements 100% fidèles.',
      ],
      safeGuards: [
        'Validation ast.parse obligatoire : aucune version invalide ne peut écraser un fichier fonctionnel.',
        'Création systématique d\'un fichier de secours avant écriture.',
        'Bouclier contre les injections de code et exécutions arbitraires.',
      ],
      targetedFiles: [
        'app.py (coeur 2800+ lignes)',
        'public/app.py (miroir de téléchargement)',
        'andrea_*.py (modules satellites)',
        'requirements.txt & packages.txt',
      ],
      commonPitfalls: [
        'Déployer sur Streamlit Cloud sans avoir exécuté une validation AST complète.',
        'Modifier app.py sans synchroniser public/app.py.',
      ],
      practicalExample: {
        userPrompt: 'Vérifie que app.py ne contient aucune erreur de syntaxe et que toutes les accolades de blocs CSS sont doublées.',
        actionDescription: 'Exécute l\'analyse statique Python et vérifie l\'échappement dans les f-strings.',
        codeSample: `import ast
with open('app.py', 'r', encoding='utf-8') as f:
    ast.parse(f.read())
print("✅ Validation AST réussie : zéro erreur de syntaxe.")`,
      },
    },
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
        description: "Filtre anti-jailbreak pour protéger les instructions système fondamentales d'Andrea.",
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
.stApp {{ background: #181135 !important; }}
[data-testid="stSidebar"] {{ background: #120e28 !important; border-right: 1px solid #5A33FF33 !important; }}
div[data-testid="stButton"]>button {{ background: #231a4a !important; color: #FFFFFF !important; border-radius: 12px !important; border: 1px solid #5A33FF66 !important; }}
div[data-testid="stChatMessage"] {{ background: #1b143c !important; border: 1px solid #5A33FF33 !important; border-radius: 16px !important; }}
div[data-testid="stChatInput"] {{ background: #201844 !important; border: 1px solid #5A33FF55 !important; border-radius: 24px !important; }}
</style>`,

  page_chat: `def page_chat():
    st.markdown("### 💬 Discussion avec Andrea")
    if not st.session_state.messages:
        pt = (st.session_state.prefs or {}).get("profile_type") or "createur"
        st.info("Bonjour, je suis Andrea. Décris-moi un projet ou un blocage et je t'aide à repérer ce qui te freine, puis à construire un plan d'action mesurable.")
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
        # Studio de Design Visuel Andrea
        ...
    elif menu == "sous_titres":
        # Module de transcription automatique Whisper SRT/VTT
        ...`,

  page_code: `def page_code():
    st.markdown("### 💻 Éditeur & Bac à Sable Python")
    code_input = st.text_area("Code source", value=DEFAULT_CODE, height=220)
    if st.button("▶️ Exécuter le code"):
        run_sandbox(code_input)`,

  page_app: `def page_app():
    st.markdown("### 🌐 Atelier Web HTML & Applications")
    st.caption("Génère une page web complète autonome avec boutons d'appel à l'action et styles élégants.")`,

  page_onboarding: `def page_onboarding():
    st.markdown("### 🎓 Parcours d'accueil personnalisé")
    p_type = st.radio("Ton profil principal :", list(PROFILE_OPTIONS.keys()))
    if st.button("Valider mon profil"):
        save_onboarding(p_type)`,

  page_perso: `def page_perso():
    st.markdown("### 🎨 Personnalisation d'Andrea")
    st.selectbox("Style de réponse préféré", list(STYLE_HINT.keys()))`,

  page_compte: `def page_compte():
    st.markdown("### 💎 Mon Compte & Formules Andrea")
    st.caption("Choisis ton niveau d'accès : Gratuit, Pro ou Ultra.")`,

  page_memoire: `def page_memoire():
    st.markdown("### 🧠 Mémoire Contextuelle & Apprentissages")
    st.caption("Consulte et gère les informations qu'Andrea a retenues pour personnaliser ses réponses.")`,

  page_projets: `def page_projets():
    st.markdown("### 📁 Mes Projets & Livrables Enregistrés")`,

  page_dev_portal: `def page_dev_portal():
    st.markdown("### 🚪 Portail Développeur & Outils Avancés")`,

  render_sidebar: `def render_sidebar():
    with st.sidebar:
        st.image(LOGO, width=42)
        st.markdown("**Andrea** · BehaviorLab AI")
        ...`,

  page_vitrine: `def page_vitrine():
    st.markdown("<div class='landing-copy'>...</div>", unsafe_allow_html=True)
    ...`,

  system_behavior: `def system_behavior(style_choice="Direct", profile_type="createur"):
    base = SYSTEM_BEHAVIOR_BASE
    extra = SYSTEM_USE_CASES.get(profile_type, "")
    hint = STYLE_HINT.get(style_choice, "")
    return f"{base}\\n\\n{extra}\\n\\nConsigne de style : {hint}"`,

  SYSTEM_BEHAVIOR_BASE: `Tu es Andrea, une IA stratégique et comportementale d'exception conçue par BehaviorLab AI.
RÈGLE CAPITALE SUR LES BLOCAGES :
- N'INVENTE JAMAIS DE BLOCAGE ARTIFICIEL. Si l'utilisateur ne mentionne ni blocage, ni difficulté, réponds directement à sa question sans introduire de diagnostic imaginaire.
- Tu n'explores les mécanismes psychologiques QUE si l'utilisateur exprime expressément un frein.`,

  SYSTEM_USE_CASES: `SYSTEM_USE_CASES = {
    "clients": "MODE ANALYSE CLIENTS / PROSPECTS...",
    "contenu": "MODE STRATÈGE CONTENU CRÉATEUR...",
    "site": "MODE BÂTISSEUR DE SITE / PAGE...",
    "code": "MODE MENTOR CODE & LOGIQUE...",
    "scolaire": "MODE ACCOMPAGNEMENT SCOLAIRE..."
}`,

  SYSTEM_CODE: `Tu es le Mentor Code d'Andrea. Tu produis un code propre, modulaire et commenté.`,
  SYSTEM_MONTAGE: `Tu es le Monteur Vidéo & Graphiste d'Andrea. Tu découpes les scripts en scènes rythmées.`,
  SYSTEM_APP: `Tu es le Bâtisseur Web d'Andrea. Tu crées des pages HTML responsive avec Tailwind CSS.`,

  save_onboarding: `def save_onboarding(prefs):
    st.session_state.prefs = prefs
    st.success("Profil enregistré !")`,

  memories: `# Table Supabase 'memories'
# colonnes: id, user_id, memory_type, content, score, created_at`,

  PROFILE_OPTIONS: `PROFILE_OPTIONS = {
    "createur": "Créateur de Contenu & Vidéaste",
    "etudiant": "Lycéen ou Étudiant",
    "independant": "Freelance, Consultant ou Coach",
    "entreprise": "Entrepreneur ou Dirigeant",
    "developpeur": "Développeur ou Tech Builder"
}`,

  MULTI_AGENTS: `# Architecture Multi-Agents Andrea
def run_multi_agent_pipeline(user_query):
    friction = agent_psycho.analyze(user_query)
    critique = agent_critic.evaluate(friction)
    solution = agent_builder.construct(critique)
    return solution`,

  LANGUAGES: `# Dictionnaire 15 Langues des Grands Modèles IA
SUPPORTED_LANGS = [
    "Français", "English", "Español", "Deutsch", "Português",
    "Italiano", "Nederlands", "العربية", "中文", "日本語",
    "한국어", "Русский", "हिन्दी", "Türkçe", "Wolof"
]`,

  SiteBuilder: `// Moteur Bâtisseur de Site Web Andrea
export const SiteBuilder = () => {
    // Générateur complet de landing pages avec audit de conversion
};`,

  andrea_i18n: `# Module d'internationalisation Andrea
from andrea_i18n import setup_i18n, tr, current_lang`,

  FULL_FILE: `# Fichier complet app.py (2800+ lignes)
# Architecture BehaviorLab AI avec Validation AST Strict
import ast, base64, difflib, html, io, json, os, re, time, zipfile
from collections import deque
from datetime import datetime, timezone
import streamlit as st
...`,

  ast_check: `def ast_check(code_str):
    try:
        ast.parse(code_str)
        return True, "Code syntaxiquement valide"
    except SyntaxError as e:
        return False, f"Erreur de syntaxe ligne {e.lineno}: {e.msg}"`,

  quota_consume: `def quota_consume(user_id, tokens):
    # Gestion des limites d'appels Supabase RPC
    pass`,

  STARTER_CARDS: `STARTER_CARDS = {
    "createur": ["Comment accrocher en 3 secondes ?", "Idées de vidéos pour percer", "Découper mon script en 5 scènes"],
    "etudiant": ["Vaincre la procrastination des devoirs", "Méthode de mémorisation active", "Préparer un examen sans stress"],
    "independant": ["Analyser le message d'un prospect", "Rédiger une offre irrésistible", "Répondre à une objection de prix"],
    "entreprise": ["Stratégie d'acquisition client", "Déléguer sans perdre le contrôle", "Identifier le goulot d'étranglement"]
}`,

  STYLE_HINT: `STYLE_HINT = {
    "Direct": "Va droit au but, phrases courtes, sans détour.",
    "Doux": "Ton bienveillant et encourageant, sans jamais être complaisant.",
    "Détaillé": "Explique en détail ta lecture de la situation et le raisonnement.",
    "Expert comportemental": "Utilise le vocabulaire de la psychologie comportementale en l'expliquant simplement."
}`
};
