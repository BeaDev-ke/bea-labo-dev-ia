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

export type ClipTransitionType =
  | 'cut'
  | 'masking'
  | 'slide'
  | 'push'
  | 'zoom_in'
  | 'zoom_out'
  | 'fade'
  | 'white_flash'
  | 'whip_pan';

export interface MaskConfig {
  type: 'none' | 'rect' | 'circle';
  feather: number;
  scale: number;
  x: number;
  y: number;
}

export interface KeyframePoint {
  id: string;
  time: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export interface SceneAnimationConfig {
  inAnim: string;
  outAnim: string;
  comboAnim: string;
  duration: number;
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
  transitionToNext?: ClipTransitionType;
  transitionDuration?: number;
  speed?: number;
  speedCurve?: 'normal' | 'montage' | 'hero' | 'bullet' | 'jump' | 'flash';
  isReversed?: boolean;
  isFrozen?: boolean;
  cropRatio?: AspectRatio;
  mask?: MaskConfig;
  animation?: SceneAnimationConfig;
  keyframes?: KeyframePoint[];
  motionBlur?: number;
  pipOverlayUrl?: string;
  pipOpacity?: number;
}

export interface ReplicaBlueprint {
  id: string;
  targetName: string;
  brandName: string;
  sector: string;
  architectureStack: string[];
  coreFlows: string[];
  parityChecklist: { label: string; status: 'done' | 'verified' }[];
  generatedHtml: string;
  createdAt: number;
}

export type OpuscarStyleId =
  | 'edit_documentary'
  | 'painting_illustration'
  | 'sketch_board'
  | 'line_diagrams'
  | 'print_printmaking';

export interface OpuscarScene {
  id: string;
  sceneNumber: number;
  title: string;
  narration: string;
  visualDirective: string;
  duration: number;
  accentColor: string;
}

export interface OpuscarProject {
  id: string;
  title: string;
  style: OpuscarStyleId;
  styleLabel: string;
  scenes: OpuscarScene[];
  videoUrl: string;
  audioUrl?: string;
  subtitles?: SubtitleCue[];
  srtContent?: string;
  totalDuration: number;
  createdAt: number;
}

export interface PhototextEraseBox {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  sampledColor: string;
  label?: string;
}

export interface PhototextLayer {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number;
  fontFamily: string;
  color: string;
  gradientEnabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  strokeEnabled: boolean;
  strokeColor: string;
  strokeWidth: number;
  shadowEnabled: boolean;
  shadowColor: string;
  curveAngle: number; // -120 to 120
  rotateX: number; // -45 to 45
  rotateY: number; // -45 to 45
  rotateZ: number; // -180 to 180
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  replacedOriginalText?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'andrea';
  text: string;
  timestamp: number;
  hook?: string;
  video?: VideoGenerationResult;
  imageUrl?: string;
  replica?: ReplicaBlueprint;
  opuscar?: OpuscarProject;
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

export type AppLanguage = 'fr' | 'en' | 'es' | 'de' | 'pt' | 'ar';
export type AppTheme = 'dark' | 'light';

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
  language?: AppLanguage;
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
  language?: AppLanguage;
  posture?: string;
  theme?: AppTheme;
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
