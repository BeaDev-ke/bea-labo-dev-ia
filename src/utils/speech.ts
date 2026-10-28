/**
 * Moteur Vocal Multilingue Haute Fidélité pour Andrea (Style Gemini)
 * Voix ultra-naturelle, fluide, sans micro-coupures ni arrêts brutaux entre les phrases.
 * Supporte les 15 langues disposant d'une synthèse vocale à haute voix vérifiée.
 * Intègre un lisseur de prosodie, un heartbeat anti-pause Chrome/Safari,
 * et une sélection prioritaire des voix neuronales (Google Cloud / Natural / Apple Enhanced).
 */

import { SupportedLanguageCode, SUPPORTED_LANGUAGES } from '../types/bea';

export interface VoiceOption {
  name: string;
  lang: string;
}

export type VoiceGender = 'feminine' | 'masculine';

class AndreaGeminiVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private listeners: ((speaking: boolean) => void)[] = [];
  private selectedGender: VoiceGender = 'feminine';
  private currentLanguage: SupportedLanguageCode = 'fr';
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private heartbeatInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      try {
        const savedGender = localStorage.getItem('andrea_voice_gender');
        if (savedGender === 'masculine' || savedGender === 'feminine') {
          this.selectedGender = savedGender;
        }
        const savedLang = localStorage.getItem('andrea_language') as SupportedLanguageCode;
        if (savedLang) {
          this.currentLanguage = savedLang;
        }
      } catch {}

      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        this.cachedVoices = voices;
      }
    } catch {}
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public setGender(gender: VoiceGender): void {
    this.selectedGender = gender;
    try {
      localStorage.setItem('andrea_voice_gender', gender);
    } catch {}
  }

  public getGender(): VoiceGender {
    return this.selectedGender;
  }

  public setLanguage(lang: SupportedLanguageCode): void {
    this.currentLanguage = lang;
    try {
      localStorage.setItem('andrea_language', lang);
    } catch {}
  }

  public getLanguage(): SupportedLanguageCode {
    return this.currentLanguage;
  }

  public subscribe(listener: (speaking: boolean) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach(l => l(speaking));
  }

  public getAllVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    this.loadVoices();
    return this.cachedVoices;
  }

  /**
   * Classement des voix selon la langue ciblée
   */
  private scoreVoice(voice: SpeechSynthesisVoice, targetGender: VoiceGender, langCode: string): number {
    let score = 0;
    const name = voice.name.toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();
    const lang = voice.lang.toLowerCase();

    // Doit correspondre au code de langue (ex: fr, en, es, de, etc.)
    if (!lang.startsWith(langCode.toLowerCase())) {
      return -100;
    }

    // 1. Voix neuronales modernes haute fidélité (Google Cloud / Gemini, Azure Neural, Apple Enhanced)
    const isGoogle = name.includes('google') || uri.includes('google');
    const isNatural = name.includes('natural') || uri.includes('natural');
    const isNeural = name.includes('neural') || uri.includes('neural');
    const isOnline = name.includes('online') || uri.includes('online');
    const isEnhanced = name.includes('enhanced') || uri.includes('enhanced');
    const isSiri = name.includes('siri') || uri.includes('siri');

    if (isGoogle) score += 75;
    if (isNatural) score += 65;
    if (isNeural) score += 60;
    if (isOnline) score += 50;
    if (isEnhanced) score += 45;
    if (isSiri) score += 40;

    // Détection du genre
    const maleKeywords = ['male', 'homme', 'henri', 'thomas', 'alain', 'claude', 'jerome', 'paul', 'nicolas', 'david', 'george', 'stefan', 'jorge'];
    const femaleKeywords = ['female', 'femme', 'denise', 'julie', 'audrey', 'hortense', 'brigitte', 'eloise', 'coralie', 'amelie', 'samantha', 'jenny', 'maria', 'katja', 'helena'];

    if (targetGender === 'masculine') {
      if (maleKeywords.some(m => name.includes(m) || uri.includes(m))) score += 40;
      if (femaleKeywords.some(f => name.includes(f) || uri.includes(f))) score -= 50;
    } else {
      if (femaleKeywords.some(f => name.includes(f) || uri.includes(f))) score += 40;
      if (maleKeywords.some(m => name.includes(m) || uri.includes(m))) score -= 50;
    }

    // Pénaliser les anciennes voix robotiques
    if (name.includes('desktop') && !isNatural && !isNeural) {
      score -= 40;
    }

    return score;
  }

  public selectBestVoice(gender: VoiceGender = this.selectedGender, langCode: string = this.currentLanguage): SpeechSynthesisVoice | null {
    const allVoices = this.getAllVoices();
    if (allVoices.length === 0) return null;

    const matching = allVoices.filter(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    if (matching.length === 0) {
      // Fallback
      return allVoices[0];
    }

    const ranked = [...matching].sort((a, b) => {
      return this.scoreVoice(b, gender, langCode) - this.scoreVoice(a, gender, langCode);
    });

    return ranked[0] || matching[0];
  }

  /**
   * Lissage style Gemini : supprime les artefacts textuels, lissages des respirations
   */
  public humanizeTextForSpeech(text: string): string {
    return text
      // Balises markdown
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[-*•]\s+/g, ', ')
      // Ponctuations heurtées
      .replace(/\.{2,}/g, ', ')
      .replace(/!{2,}/g, ' !')
      .replace(/\?{2,}/g, ' ?')
      .replace(/:\s*/g, ', ')
      .replace(/;\s*/g, ', ')
      .replace(/\n+/g, ', ')
      .replace(/,\s*,+/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Heartbeat pour éviter les coupures de lecture
   */
  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.synth && this.synth.speaking && !this.synth.paused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 4500);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public speak(
    text: string, 
    onEnd?: () => void,
    options?: { pitch?: number; rate?: number; gender?: VoiceGender; lang?: SupportedLanguageCode }
  ): void {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const humanized = this.humanizeTextForSpeech(text);
    if (!humanized) {
      if (onEnd) onEnd();
      return;
    }

    const targetLang = options?.lang ?? this.currentLanguage;
    const targetGender = options?.gender ?? this.selectedGender;

    const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);
    const voiceCode = langMeta?.voiceCode || 'fr-FR';

    const utterance = new SpeechSynthesisUtterance(humanized);
    utterance.lang = voiceCode;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.rate = options?.rate ?? 1.03;

    const bestVoice = this.selectBestVoice(targetGender, targetLang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    let hasEnded = false;
    const triggerEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        this.stopHeartbeat();
        this.notify(false);
        if (onEnd) onEnd();
      }
    };

    utterance.onstart = () => {
      this.notify(true);
      this.startHeartbeat();
    };

    utterance.onend = () => {
      triggerEnd();
    };

    utterance.onerror = () => {
      triggerEnd();
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
    } catch {
      triggerEnd();
    }
  }

  public testVoice(
    gender: VoiceGender = this.selectedGender,
    lang: SupportedLanguageCode = this.currentLanguage,
    onEnd?: () => void
  ): void {
    const samples: Record<string, string> = {
      fr: "Bonjour ! Je suis Andrea. Mon moteur vocal est synchronisé avec la diction fluide de Gemini pour vous guider en continu sans interruption.",
      en: "Hello! I am Andrea. My voice engine is fully fluid and natural, designed to assist you seamlessly.",
      es: "¡Hola! Soy Andrea. Mi síntesis vocal fluida te acompaña en tus proyectos y creaciones.",
      de: "Hallo! Ich bin Andrea. Meine Stimme ist natürlich und flüssig, um Sie kontinuierlich zu begleiten.",
      it: "Ciao! Sono Andrea. La mia voce è naturale e fluida per guidarti senza interruzioni.",
      pt: "Olá! Eu sou Andrea. Minha voz natural e fluida está pronta para acompanhar você.",
      nl: "Hallo! Ik ben Andrea. Mijn stem is natuurlijk en vloeiend om je continu te begeleiden.",
      ar: "مرحباً! أنا أندريا. صوتي طبيعي وسلس لمرافقتك في جميع مشاريعك.",
      zh: "你好！我是Andrea。我的语音自然流畅，随时为你提供智能指引。",
      ja: "こんにちは！Andreaです。自然で流暢な音声であなたをサポートします。",
      ko: "안녕하세요! 안드레아입니다. 자연스럽고 매끄러운 음성으로 여러분을 안내합니다.",
      ru: "Здравствуйте! Я Андреа. Мой естественный и плавный голос готов помочь вам.",
      hi: "नमस्ते! मैं एंड्रिया हूँ। मेरी स्वाभाविक और स्पष्ट आवाज़ आपकी सहायता के लिए तैयार है।",
      tr: "Merhaba! Ben Andrea. Akıcı ve doğal sesimle projelerinizde size eşlik ediyorum.",
      pl: "Cześć! Jestem Andrea. Mój naturalny i płynny głos jest gotowy, aby Ci towarzyszyć.",
    };
    const sample = samples[lang] || samples.fr;
    this.speak(sample, onEnd, { gender, lang });
  }

  public stop(): void {
    this.stopHeartbeat();
    if (!this.synth) return;
    try {
      this.synth.cancel();
    } catch {}
    this.notify(false);
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const andreaVoice = new AndreaGeminiVoiceEngine();
export const beaVoice = andreaVoice;
