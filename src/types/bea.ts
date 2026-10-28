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

export interface WebSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachmentName?: string;
  securityShield?: boolean;
  webSources?: WebSource[];
  usedWebSearch?: boolean;
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
  theme?: 'dark' | 'light' | 'system';
  fontSize?: 'normal' | 'compact' | 'comfortable';
  soundEffects?: boolean;
  language?: SupportedLanguageCode;
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
  | 'pl';

export interface LanguageMeta {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  tag: string;
  voiceCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', tag: 'Par défaut', voiceCode: 'fr-FR' },
  { code: 'en', name: 'Anglais', nativeName: 'English (US/UK)', flag: '🇬🇧', tag: 'Global', voiceCode: 'en-US' },
  { code: 'es', name: 'Espagnol', nativeName: 'Español', flag: '🇪🇸', tag: 'Mondial', voiceCode: 'es-ES' },
  { code: 'de', name: 'Allemand', nativeName: 'Deutsch', flag: '🇩🇪', tag: 'Europe', voiceCode: 'de-DE' },
  { code: 'pt', name: 'Portugais', nativeName: 'Português', flag: '🇧🇷', tag: 'Amérique / Europe', voiceCode: 'pt-BR' },
  { code: 'it', name: 'Italien', nativeName: 'Italiano', flag: '🇮🇹', tag: 'Europe', voiceCode: 'it-IT' },
  { code: 'nl', name: 'Néerlandais', nativeName: 'Nederlands', flag: '🇳🇱', tag: 'Europe', voiceCode: 'nl-NL' },
  { code: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇸🇦', tag: 'Moyen-Orient', voiceCode: 'ar-SA' },
  { code: 'zh', name: 'Chinois', nativeName: '中文 (Mandarin)', flag: '🇨🇳', tag: 'Asie', voiceCode: 'zh-CN' },
  { code: 'ja', name: 'Japonais', nativeName: '日本語', flag: '🇯🇵', tag: 'Asie', voiceCode: 'ja-JP' },
  { code: 'ko', name: 'Coréen', nativeName: '한국어', flag: '🇰🇷', tag: 'Asie', voiceCode: 'ko-KR' },
  { code: 'ru', name: 'Russe', nativeName: 'Русский', flag: '🇷🇺', tag: 'Eurasie', voiceCode: 'ru-RU' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', tag: 'Asie du Sud', voiceCode: 'hi-IN' },
  { code: 'tr', name: 'Turc', nativeName: 'Türkçe', flag: '🇹🇷', tag: 'Eurasie', voiceCode: 'tr-TR' },
  { code: 'pl', name: 'Polonais', nativeName: 'Polski', flag: '🇵🇱', tag: 'Europe', voiceCode: 'pl-PL' },
];
