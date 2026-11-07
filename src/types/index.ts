export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type CameraMovementId =
  | 'orbit'
  | 'crash_zoom'
  | 'fpv_drone'
  | 'dolly_in'
  | 'dolly_out'
  | 'whip_pan'
  | 'dutch_angle'
  | 'vertigo_zoom'
  | 'tilt_up'
  | 'tracking_shot';

export interface CameraMovement {
  id: CameraMovementId;
  name: string;
  frenchName: string;
  description: string;
  promptModifier: string;
  intensity: 'subtle' | 'dynamic' | 'intense';
  category: 'rotation' | 'zoom' | 'motion' | 'angle';
}

export interface SubtitleCue {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface VideoGenerationOptions {
  prompt: string;
  cameraMovement?: CameraMovementId;
  aspectRatio?: AspectRatio;
  durationSeconds?: number;
  enableAudioVoiceover?: boolean;
  voiceText?: string;
  modelPreference?: 'wan2.1' | 'cogvideox' | 'animatediff';
  negativePrompt?: string;
}

export interface VideoGenerationResult {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  prompt: string;
  cameraMovement?: CameraMovement;
  aspectRatio: AspectRatio;
  duration: number;
  providerUsed: 'Wan 2.1 (HF Space)' | 'CogVideoX-5B (HF)' | 'AnimateDiff SD1.5' | 'Client Synthesis Fallback';
  hookText?: string;
  subtitles?: SubtitleCue[];
  srtContent?: string;
  audioUrl?: string;
  isCached: boolean;
  createdAt: number;
}

export interface VoiceGenerationOptions {
  text: string;
  voiceStyle?: 'natural_french_female' | 'natural_french_male' | 'energetic_creator' | 'deep_narrator';
  modelPreference?: 'f5-tts' | 'xtts-v2';
}

export interface VoiceGenerationResult {
  id: string;
  audioUrl: string;
  providerUsed: 'F5-TTS (HF Swivid)' | 'Coqui XTTS-v2' | 'Web Audio Synthesis';
  duration: number;
  text: string;
  createdAt: number;
}

export interface VideoScene {
  id: string;
  sceneNumber: number;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnailUrl: string;
  description: string;
  cameraMovement: string;
  colorGrade: string;
  subtitleSnippet?: string;
  transitionToNext?: 'cut' | 'fade' | 'whip_pan' | 'zoom_in';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'andrea';
  text: string;
  timestamp: number;
  hook?: string;
  video?: VideoGenerationResult;
  queueStatus?: string;
  isLoading?: boolean;
  attachmentName?: string;
  feedback?: 1 | -1;
}

export interface GeneratedWebsite {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  category?: string;
  accentColor?: string;
  html?: string;
  htmlCode?: string;
  previewUrl?: string;
  createdAt: string | number;
}

export interface CodeProject {
  id: string;
  name?: string;
  title?: string;
  language: string;
  content?: string;
  code?: string;
  updatedAt: string;
}

export interface MemoryItem {
  id: string;
  content: string;
  createdAt?: string;
  category?: string;
  date?: string;
}

export interface UserPreferences {
  displayName: string;
  style?: 'Direct' | 'Doux' | 'Détaillé' | 'Expert comportemental';
  goal?: string;
  profileType?: 'entreprise' | 'independant' | 'salarie' | 'etudiant' | 'createur' | 'developpeur' | 'recherche_emploi' | 'parent' | 'enseignant' | 'autre';
  useCase?: 'clients' | 'contenu' | 'site' | 'code' | 'scolaire' | 'general';
  schoolCountry?: string;
  studyCountry?: string;
  studyLevel?: string;
  profile?: string;
  tone?: string;
  objective?: string;
}

export interface AIParameters {
  model?: 'rapide' | 'puissant';
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  streaming?: boolean;
  systemInstructions?: string;
  modelSpeed?: 'rapide' | 'puissant';
  creativity?: number;
  useMemory?: boolean;
  hfToken?: string;
}

export type PlanType = 'free' | 'bea' | 'pro' | 'abo';

export type AppPage =
  | 'chat'
  | 'code'
  | 'app'
  | 'studio'
  | 'projets'
  | 'memoire'
  | 'perso'
  | 'parametres'
  | 'compte'
  | 'dev_portal'
  | 'dev_lab';

export type StudioSectionId =
  | 'composer'
  | 'importer'
  | 'sous_titres'
  | 'miniature'
  | 'plan_ia'
  | 'visuel_flux'
  | 'audio'
  | 'texte'
  | 'effets'
  | 'transitions'
  | 'filtres'
  | 'ajustement'
  | 'autocollants'
  | 'modeles';
