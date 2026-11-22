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
  hasDailyChallenge: boolean;
  starterPrompts: string[];
}

export const PROFILE_METAS: Record<ProfileType, ProfileMeta> = {
  etudiant: {
    id: 'etudiant',
    label: 'Étudiant / Élève',
    badge: 'Scolaire & Examens',
    icon: '🎓',
    tagline: 'Comprendre plus vite, mémoriser durablement et réussir ses examens.',
    description: 'Accompagnement pédagogique sur-mesure.',
    defaultUseCase: 'scolaire',
    hasStreak: true,
    hasDailyChallenge: true,
    starterPrompts: [
      "Je dois réviser pour mon contrôle mais je n'arrive pas à m'y mettre, aide-moi.",
      'Explique-moi cette notion étape par étape de manière claire.',
      'Comment organiser mes révisions sans surcharge ?',
    ],
  },
  createur: {
    id: 'createur',
    label: 'Créateur de contenu',
    badge: 'Création & Rétention',
    icon: '🎬',
    tagline: 'Capter l’attention dès les premières secondes et publier avec régularité.',
    description: 'Hooks, scripts vidéo, studio de montage et création visuelle.',
    defaultUseCase: 'contenu',
    hasStreak: true,
    hasDailyChallenge: false,
    starterPrompts: [
      'Trouve-moi 5 hooks psychologiques percutants pour ma prochaine vidéo.',
      'Comment diviser mon temps de montage par 3 ?',
      'Analyse ce script et propose une structure plus rythmée.',
    ],
  },
  independant: {
    id: 'independant',
    label: 'Indépendant / Freelance',
    badge: 'Business & Ventes',
    icon: '💼',
    tagline: 'Convertir plus de prospects et fixer ses prix avec assurance.',
    description: 'Analyse comportementale des objections clients.',
    defaultUseCase: 'clients',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      'Que répondre à un prospect qui hésite sur le tarif ?',
      'Comment formuler une relance efficace sans paraître insistant ?',
      "Plan d'action rapide pour relancer ma prospection.",
    ],
  },
  entreprise: {
    id: 'entreprise',
    label: 'Entreprise / Organisation',
    badge: 'Management & Équipes',
    icon: '🏢',
    tagline: 'Débloquer l’exécution collective et fluidifier la prise de décision.',
    description: 'Alignement des priorités et résolution des blocages.',
    defaultUseCase: 'clients',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Comment déléguer plus efficacement sans m'épuiser ?",
      'Structurer notre point hebdomadaire en 20 minutes.',
      'Accompagner un changement interne sans friction.',
    ],
  },
  salarie: {
    id: 'salarie',
    label: 'Salarié',
    badge: 'Carrière & Clarté',
    icon: '🧑‍💼',
    tagline: 'Reprendre le contrôle de son temps et évoluer sereinement.',
    description: 'Gestion de la charge mentale et priorisation.',
    defaultUseCase: 'general',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      'Comment reprendre la main sur mon agenda ?',
      'Préparer mon entretien annuel avec des arguments clairs.',
      'Poser des limites saines face aux urgences.',
    ],
  },
  developpeur: {
    id: 'developpeur',
    label: 'Développeur',
    badge: 'Code & Architecture',
    icon: '💻',
    tagline: 'Concevoir des applications web complètes directement en discussion.',
    description: 'Architecture propre et génération d’applications sur mesure.',
    defaultUseCase: 'code',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      'Créer une application web interactive de gestion de projets.',
      'Optimiser cette architecture logicielle.',
      'Concevoir un site vitrine moderne en quelques secondes.',
    ],
  },
  recherche_emploi: {
    id: 'recherche_emploi',
    label: 'En recherche d’emploi',
    badge: 'Candidatures & Entretiens',
    icon: '🔎',
    tagline: 'Décrocher des entretiens et convaincre avec impact.',
    description: 'Optimisation de pitch et simulations d’entretiens.',
    defaultUseCase: 'general',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      'Structurer mon pitch de présentation en 90 secondes.',
      'Quelles questions poser en fin d’entretien ?',
      'Réajuster ma stratégie de candidature.',
    ],
  },
  parent: {
    id: 'parent',
    label: 'Parent',
    badge: 'Éducation & Famille',
    icon: '👨‍👩‍👧',
    tagline: 'Accompagner la scolarité sans tension quotidienne.',
    description: 'Méthodes de dialogue constructif et rituels sereins.',
    defaultUseCase: 'scolaire',
    hasStreak: true,
    hasDailyChallenge: false,
    starterPrompts: [
      'Comment installer une routine de devoirs apaisée ?',
      'Aider à mémoriser une leçon plus vite.',
      'Réduire les tensions du soir.',
    ],
  },
  enseignant: {
    id: 'enseignant',
    label: 'Enseignant / Formateur',
    badge: 'Pédagogie & Cours',
    icon: '📚',
    tagline: 'Concevoir des cours captivants et stimuler l’engagement.',
    description: 'Scénarisation de séquences et pédagogie active.',
    defaultUseCase: 'scolaire',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      "Propose une activité d'introduction de 10 minutes.",
      'Simplifier une notion abstraite.',
      'Créer un quiz en 5 questions.',
    ],
  },
  autre: {
    id: 'autre',
    label: 'Autre projet personnel',
    badge: 'Habitudes & Focus',
    icon: '✨',
    tagline: 'Transformer ses intentions en routines solides.',
    description: 'Suppression des frictions et passage à l’action.',
    defaultUseCase: 'general',
    hasStreak: false,
    hasDailyChallenge: false,
    starterPrompts: [
      'Passer à l’action sur un projet reporté depuis trop longtemps.',
      'Structurer mes 3 prochaines semaines.',
      'Identifier le levier prioritaire.',
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
    name: 'Essentiel',
    tagline: 'Le déclencheur d’action quotidien pour vaincre la procrastination.',
    priceMonthly: 9,
    priceFormatted: '9 €',
    period: '/ mois',
    recommendedFor: 'Idéal pour démarrer et débloquer ses habitudes.',
    transformation: 'Passez de l’hésitation à l’action en quelques minutes.',
    highlightRoi: 'Clarté et passage à l’action au quotidien.',
    features: [
      'Discussion stratégique personnalisée',
      'Plans d’action concrets en 3 étapes',
      'Synthèse vocale illimitée',
      'Création de sites et apps sur demande en discussion',
    ],
    ctaLabel: 'Choisir Essentiel (9 €/mois)',
    ctaSubtext: 'Accès immédiat · Sans engagement',
    stripeUrl: '#essentiel',
  },
  {
    id: 'pro',
    name: 'Professionnel',
    tagline: 'La suite complète pour le montage vidéo et la retouche visuelle.',
    isPopular: false,
    priceMonthly: 14.9,
    priceFormatted: '14,90 €',
    period: '/ mois',
    recommendedFor: 'Recommandé pour les créateurs et indépendants.',
    transformation: 'Divisez votre temps de montage et de création par 3.',
    highlightRoi: 'Studio vidéo, musique et retouche photo réunis.',
    features: [
      'Tout Essentiel inclus',
      'Studio de Montage complet avec pistes et transitions',
      'Illustration vidéo de texte en 1 clic',
      'Retouche & gomme de texte sur photo (100% local)',
      'Recherche musicale en ligne et sous-titres synchronisés',
    ],
    ctaLabel: 'Choisir Professionnel (14,90 €/mois)',
    ctaSubtext: 'Sans engagement',
    stripeUrl: '#pro',
  },
  {
    id: 'ultra',
    name: 'Ultra Performance',
    tagline: 'Puissance illimitée pour toutes vos créations vidéo, web et audio.',
    badge: 'Illimité',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    priceMonthly: 18,
    priceFormatted: '18 €',
    period: '/ mois',
    recommendedFor: 'Pour produire sans plafond.',
    transformation: 'Créez vidéos, visuels et applications sans restriction.',
    highlightRoi: 'Tout en illimité sur une seule interface.',
    features: [
      'Tout Professionnel sans aucune restriction',
      'Création et itération de sites et apps en discussion sans limite',
      'Exports haute définition multi-formats',
      'Sauvegarde permanente et mémoire complète',
    ],
    ctaLabel: 'Choisir Ultra Performance (18 €/mois)',
    ctaSubtext: 'Sans engagement',
    stripeUrl: '#ultra',
  },
];
