import { ProfileType, UseCaseType } from '../types/bea';

export interface ProfileMeta {
  id: ProfileType;
  label: string;
  badge: string;
  icon: string;
  tagline: string;
  description: string;
  defaultUseCase: UseCaseType;
  hasStreak: boolean;
  hasDailyChallenge: boolean; // UNIQUEMENT 'etudiant' / 'scolaire'
  starterPrompts: string[];
}

export const PROFILE_METAS: Record<ProfileType, ProfileMeta> = {
  etudiant: {
    id: 'etudiant',
    label: '🎓 Étudiant / Élève',
    badge: 'Scolaire & Examens',
    icon: '🎓',
    tagline: 'Comprendre plus vite, mémoriser durablement et réussir ses devoirs & examens.',
    description: 'Accompagnement pédagogique sur-mesure adapté au programme de votre pays (Collège, Lycée, Supérieur).',
    defaultUseCase: 'scolaire',
    hasStreak: true, // Série activée pour l'accompagnement scolaire
    hasDailyChallenge: true, // LES DÉFIS UNIQUEMENT ICI !
    starterPrompts: [
      "Je dois réviser pour mon contrôle mais je n'arrive pas à m'y mettre, aide-moi.",
      "Explique-moi ce théorème/formule étape par étape avec un exemple concret.",
      "Comment organiser mes devoirs pour ne plus réviser à la dernière minute ?",
      "Teste mes connaissances avec 3 questions clés sur mon chapitre.",
    ],
  },
  createur: {
    id: 'createur',
    label: '🎬 Créateur de contenu',
    badge: 'Réseaux & Monétisation',
    icon: '🎬',
    tagline: 'Capter l’attention dès les 3 premières secondes et publier avec régularité.',
    description: 'Hooks viraux, scripts pour vidéos courtes et longues, analyses de rétention et studio visuel Andrea.',
    defaultUseCase: 'contenu',
    hasStreak: true, // Série publications activée
    hasDailyChallenge: false, // Pas de micro-défis ici (réservé à scolaire)
    starterPrompts: [
      "Trouve-moi 5 hooks psychologiques percutants pour ma prochaine vidéo.",
      "Mon montage me prend 5h, comment diviser ce temps par 3 grâce au batching ?",
      "Analyse ce script et dis-moi pourquoi les spectateurs risquent de décrocher à 0:10.",
    ],
  },
  independant: {
    id: 'independant',
    label: '💼 Indépendant / Freelance',
    badge: 'Business & Ventes',
    icon: '💼',
    tagline: 'Convertir plus de prospects et fixer ses prix sans culpabiliser.',
    description: 'Analyse comportementale des objections clients, psychologie d’achat et closing.',
    defaultUseCase: 'clients',
    hasStreak: false, // Pas de streak
    hasDailyChallenge: false,
    starterPrompts: [
      "Mon prospect me dit 'c'est trop cher', que répondre pour valoriser mon offre ?",
      "Comment formuler mon email de relance sans paraître insistant ?",
      "Je procrastine sur la prospection, donne-moi un plan d'action en 15 minutes.",
    ],
  },
  entreprise: {
    id: 'entreprise',
    label: '🏢 Entreprise / Organisation',
    badge: 'Management & Équipes',
    icon: '🏢',
    tagline: 'Débloquer l’exécution collective et fluidifier la prise de décision.',
    description: 'Alignement des priorités, résolution des blocages d’équipe et communication interne.',
    defaultUseCase: 'clients',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Je n'arrive pas à déléguer, je fais tout moi-même et je m'épuise.",
      "Comment structurer notre réunion hebdomadaire pour qu'elle dure 20 min chrono ?",
      "Comment annoncer un changement stratégique sans créer de résistance ?",
    ],
  },
  salarie: {
    id: 'salarie',
    label: '🧑‍💼 Salarié',
    badge: 'Carrière & Clarté',
    icon: '🧑‍💼',
    tagline: 'Reprendre le contrôle de son temps et négocier son évolution sereinement.',
    description: 'Gestion de la charge mentale, priorisation sans stress et assertivité professionnelle.',
    defaultUseCase: 'general',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Je me sens débordé par les réunions et les urgences, comment reprendre la main ?",
      "Comment préparer mon entretien annuel pour demander une augmentation justifiée ?",
      "Je n'ose pas dire non à un projet supplémentaire, que dire diplomatiquement ?",
    ],
  },
  developpeur: {
    id: 'developpeur',
    label: '💻 Développeur',
    badge: 'Code & Architecture',
    icon: '💻',
    tagline: 'Résoudre les bugs complexes et concevoir des applications web en 1 prompt.',
    description: 'Assistance Python, TypeScript, refactoring propre et architecturation de solutions.',
    defaultUseCase: 'code',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Voici mon code, il lève une erreur inattendue. Trouve la cause racine.",
      "Optimise cet algorithme pour réduire la complexité temporelle et mémoire.",
      "Génère une maquette de composant interactif avec gestion d'état propre.",
    ],
  },
  recherche_emploi: {
    id: 'recherche_emploi',
    label: '🔎 En recherche d’emploi',
    badge: 'Candidatures & Entretiens',
    icon: '🔎',
    tagline: 'Décrocher des entretiens et convaincre les recruteurs avec impact.',
    description: 'Optimisation de CV, pitch percutant et simulations d’entretiens réalistes.',
    defaultUseCase: 'general',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Révise mon pitch de présentation pour qu'il marque les esprits en 90 secondes.",
      "Quelles questions poser au recruteur pour prouver mon expertise et ma valeur ?",
      "Je n'ai pas de réponse après 10 candidatures, que réajuster en priorité ?",
    ],
  },
  parent: {
    id: 'parent',
    label: '👨‍👩‍👧 Parent',
    badge: 'Éducation & Famille',
    icon: '👨‍👩‍👧',
    tagline: 'Accompagner la scolarité de son enfant sans conflits ni stress quotidien.',
    description: 'Méthodes de dialogue constructif, rituels de devoirs apaisés et motivation scolaire.',
    defaultUseCase: 'scolaire',
    hasStreak: true,
    hasDailyChallenge: false,
    starterPrompts: [
      "Mon enfant refuse de faire ses devoirs dès que je lui demande, comment réagir ?",
      "Comment l'aider à mémoriser ses leçons sans lui faire de reproches ?",
      "Quels rituels simples mettre en place pour limiter le temps d'écran le soir ?",
    ],
  },
  enseignant: {
    id: 'enseignant',
    label: '📚 Enseignant / Formateur',
    badge: 'Pédagogie & Cours',
    icon: '📚',
    tagline: 'Concevoir des cours captivants et susciter l’engagement actif des élèves.',
    description: 'Scénarisation de séquences, différenciation pédagogique et exercices stimulants.',
    defaultUseCase: 'scolaire',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Propose-moi une activité d'introduction de 10 min pour lancer ce chapitre difficile.",
      "Comment expliquer ce concept abstrait avec une métaphore de la vie courante ?",
      "Crée un quiz interactif en 5 questions pour valider les prérequis.",
    ],
  },
  autre: {
    id: 'autre',
    label: '✨ Autre projet personnel',
    badge: 'Habitudes & Focus',
    icon: '✨',
    tagline: 'Transformer ses intentions en routines solides et franchir ses paliers.',
    description: 'Psychologie de l’habitude, suppression des frictions et clarté d’action.',
    defaultUseCase: 'general',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "J'ai un projet qui me tient à cœur mais je le reporte sans cesse.",
      "Comment structurer mes 3 prochaines semaines pour tenir mes engagements ?",
      "Aide-moi à identifier l'habitude clé qui débloquera tout le reste.",
    ],
  },
};

export const STUDY_COUNTRIES = [
  'France',
  'Belgique',
  'Suisse',
  'Canada',
  'Maroc',
  'Sénégal',
  "Côte d'Ivoire",
  'Cameroun',
  'Tunisie',
  'Algérie',
  'Autre',
];

export const STUDY_LEVELS = [
  'Collège - 6ème',
  'Collège - 5ème',
  'Collège - 4ème',
  'Collège - 3ème (Brevet)',
  'Lycée - Seconde',
  'Lycée - Première (Bac)',
  'Lycée - Terminale (Bac)',
  'Supérieur - Licence / Prépa / BTS',
  'Supérieur - Master / Grande École',
];

/**
 * PSYCHOLOGICALLY OPTIMIZED HIGH-CONVERTING PLANS
 * Basés sur la valeur concrète, l'inversion du risque, la preuve sociale et l'urgence positive.
 */
export interface SalesPlan {
  id: 'basique' | 'pro' | 'ultra' | 'free' | 'bea' | 'abo';
  name: string;
  tagline: string;
  badge?: string;
  badgeColor?: string;
  priceMonthly: number;
  priceFormatted: string;
  period: string;
  recommendedFor: string;
  transformation: string;
  highlightRoi: string;
  features: string[];
  ctaLabel: string;
  ctaSubtext: string;
  isPopular?: boolean;
  stripeUrl: string;
}

export const SALES_PLANS: SalesPlan[] = [
  {
    id: 'basique',
    name: 'Andrea Basique',
    tagline: 'Le déclencheur d’action quotidien pour vaincre la procrastination.',
    priceMonthly: 9,
    priceFormatted: '9 €',
    period: '/ mois',
    recommendedFor: 'Idéal pour démarrer sans risque et débloquer ses habitudes.',
    transformation: 'Passez de l’hésitation à l’action en moins de 10 minutes chaque matin.',
    highlightRoi: 'Rentabilisé dès la première heure de procrastination évitée.',
    features: [
      '⚡ 10 000 tokens/jour (+2 500 tokens par jour de série, max 50 000)',
      'IA Comportementale complète (Méthode BehaviorLab)',
      'Humaniseur de dialogue naturel & personnalisé',
      'Plans d’action en 3 étapes concrètes (sans blabla)',
      'Synthèse vocale Andrea 100% Gratuite & Illimitée',
      'Accès mobile & desktop fluide',
      'Sans engagement · Annulation en 1 clic',
    ],
    ctaLabel: 'Activer Andrea Basique (9 €)',
    ctaSubtext: 'Accès immédiat · 0 engagement · 0 frais caché',
    stripeUrl: 'https://buy.stripe.com/test_8x27sMei58IC6Rg3OM3wQ01',
  },
  {
    id: 'pro',
    name: 'Andrea Pro',
    tagline: 'L’arsenal complet des créateurs, étudiants ambitieux et indépendants.',
    badge: '🔥 Le plus choisi par 87% des utilisateurs',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-rose-500',
    isPopular: true,
    priceMonthly: 14.9,
    priceFormatted: '14,90 €',
    period: '/ mois',
    recommendedFor: 'Recommandé pour Créateurs de contenu, Étudiants et Freelances.',
    transformation: 'Divisez par 3 votre temps de travail et multipliez vos résultats visibles.',
    highlightRoi: 'Économisez plus de 15h de travail pénible chaque semaine.',
    features: [
      '⚡ 35 000 tokens/jour (+5 000 tokens par jour de série, max 120 000)',
      'Tout ce qui est dans Andrea Basique',
      '🎬 Outil de Montage Vidéo & Visuel Plein Écran (Tous formats)',
      '🎓 Mode Accompagnement Scolaire avec Micro-Défis',
      '🔥 Compteur de série & Momentum Dopamine',
      '💼 Analyse psychologique des clients & réponses anti-objection',
      '⚡ Multi-cadres & exports haute définition sans filigrane',
      'Support prioritaire 7j/7 par l’équipe fondatrice',
    ],
    ctaLabel: 'Obtenir Andrea Pro (14,90 €) — Débloquer Tout',
    ctaSubtext: 'Garantie sérénité · Rentabilisé dès le 1er jour',
    stripeUrl: 'https://buy.stripe.com/test_cNieVea1P0c62B08523wQ00',
  },
  {
    id: 'ultra',
    name: 'Andrea Ultra',
    tagline: 'Puissance maximale : Bâtisseur de site en 1 prompt et Coach Code illimité.',
    badge: '👑 Puissance Illimitée',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    priceMonthly: 18,
    priceFormatted: '18 €',
    period: '/ mois',
    recommendedFor: 'Pour ceux qui veulent créer des sites web complets et coder sans limite.',
    transformation: 'Lancez votre site web prêt à convertir en 30 secondes chrono à partir d’un simple prompt.',
    highlightRoi: 'Remplace une agence web à 1 500 € et un développeur freelance.',
    features: [
      '⚡ TOKENS 100% ILLIMITÉS (∞ Aucun plafond, aucune restriction)',
      'Tout ce qui est dans Andrea Pro sans aucune restriction',
      '🌐 Bâtisseur de Site Web en 1 Prompt (Code complet téléchargeable)',
      '💻 Éditeur de Code IA & Débogueur chirurgical',
      '🚀 Accès au Moteur Andrea Ultra Haute Vitesse',
      '💾 Sauvegarde illimitée de projets et mémoire permanente',
      '🧪 Accès en avant-première à toutes les nouveautés',
    ],
    ctaLabel: 'Passer à Andrea Ultra (18 €) — Accès Illimité',
    ctaSubtext: 'Offre complète sans compromis · Annulable à tout moment',
    stripeUrl: 'https://buy.stripe.com/test_8x27sMei58IC6Rg3OM3wQ01',
  },
];
