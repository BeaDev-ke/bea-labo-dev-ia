export type ModifLevelId = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export interface SubLevelItem {
  id: string;
  title: string;
  description: string;
  target: string;
  defaultPreset: string;
}

export interface LevelDeepGuide {
  summary: string;
  mentalModel: string;
  whenToUse: string[];
  safeGuards: string[];
  targetedFiles: string[];
  commonPitfalls: string[];
  practicalExample: {
    userPrompt: string;
    actionDescription: string;
    codeSample: string;
  };
}

export interface ModifLevel {
  id: ModifLevelId;
  title: string;
  badge: string;
  scope: string;
  description: string;
  color: string;
  targets: Record<string, string>;
  presets: string[];
  subLevels: SubLevelItem[];
  deepGuide?: LevelDeepGuide;
}

export interface BackupItem {
  id: string;
  name: string;
  timestamp: string;
  level: ModifLevelId;
  target: string;
  summary: string;
  codeSnippet: string;
}

export interface DiffLine {
  type: 'same' | 'add' | 'remove';
  text: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachmentName?: string;
  securityShield?: boolean;
}

export type ProfileType = 
  | 'etudiant'
  | 'createur'
  | 'independant'
  | 'entreprise'
  | 'salarie'
  | 'developpeur'
  | 'recherche_emploi'
  | 'parent'
  | 'enseignant'
  | 'autre';

export type UseCaseType = 'scolaire' | 'contenu' | 'clients' | 'general' | 'site' | 'code';

export interface UserProfile {
  id: string;
  displayName: string;
  preferredCallName?: string; // Le nom d'usage par lequel Andrea/Bea appelle le client
  email: string;
  profileType: ProfileType;
  useCase: UseCaseType;
  goal: string;
  biggestChallenge?: string; // Plus grand défi ou blocage actuel
  schoolCountry?: string;
  studyCountry?: string;
  studyLevel?: string;
  preferredStyle: 'expert' | 'bienveillant' | 'synthetique' | 'socratique';
  plan: 'basique' | 'pro' | 'ultra' | 'free' | 'bea' | 'abo';
  lastActive: string;
  streakDays: number;
  momentumPoints: number;
}

export type PageView = 
  | 'chat' 
  | 'creative_hub'
  | 'studio' 
  | 'modeles'
  | 'code' 
  | 'app' 
  | 'projets' 
  | 'perso' 
  | 'compte' 
  | 'profil' 
  | 'securite' 
  | 'memoire'
  | 'parametres';

export type SupportedLanguageCode = 
  | 'fr' 
  | 'en' 
  | 'es' 
  | 'de' 
  | 'pt' 
  | 'it' 
  | 'nl' 
  | 'ar' 
  | 'zh' 
  | 'ja' 
  | 'ko' 
  | 'ru' 
  | 'hi' 
  | 'tr' 
  | 'wo';

export interface LanguageMeta {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  tag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', tag: 'Langue par défaut' },
  { code: 'en', name: 'Anglais', nativeName: 'English (US/UK)', flag: '🇬🇧', tag: 'Global' },
  { code: 'es', name: 'Espagnol', nativeName: 'Español', flag: '🇪🇸', tag: 'Mondial' },
  { code: 'de', name: 'Allemand', nativeName: 'Deutsch', flag: '🇩🇪', tag: 'Europe' },
  { code: 'pt', name: 'Portugais', nativeName: 'Português', flag: '🇧🇷', tag: 'Amérique / Europe' },
  { code: 'it', name: 'Italien', nativeName: 'Italiano', flag: '🇮🇹', tag: 'Europe' },
  { code: 'nl', name: 'Néerlandais', nativeName: 'Nederlands', flag: '🇳🇱', tag: 'Europe' },
  { code: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇸🇦', tag: 'Moyen-Orient / Afrique' },
  { code: 'zh', name: 'Chinois', nativeName: '中文 (Mandarin)', flag: '🇨🇳', tag: 'Asie' },
  { code: 'ja', name: 'Japonais', nativeName: '日本語', flag: '🇯🇵', tag: 'Asie' },
  { code: 'ko', name: 'Coréen', nativeName: '한국어', flag: '🇰🇷', tag: 'Asie' },
  { code: 'ru', name: 'Russe', nativeName: 'Русский', flag: '🇷🇺', tag: 'Eurasie' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', tag: 'Asie du Sud' },
  { code: 'tr', name: 'Turc', nativeName: 'Türkçe', flag: '🇹🇷', tag: 'Eurasie' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof', flag: '🇸🇳', tag: 'Afrique de l\'Ouest' },
];
