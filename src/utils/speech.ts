/**
 * Moteur Vocal 100% Gratuit pour Andrea
 * Utilise l'API standard Web Speech Synthesis du navigateur :
 * - 0 € pour toujours (aucun abonnement, aucun token payant)
 * - Aucune clé API requise
 * - Fonctionne instantanément en local sur n'importe quel appareil
 */

export interface VoiceOption {
  name: string;
  lang: string;
  isFrench: boolean;
}

export type VoiceGender = 'feminine' | 'masculine';

class BeaVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private listeners: ((speaking: boolean) => void)[] = [];
  private selectedGender: VoiceGender = 'feminine';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      try {
        const saved = localStorage.getItem('andrea_voice_gender');
        if (saved === 'masculine' || saved === 'feminine') {
          this.selectedGender = saved;
        }
      } catch {}
    }
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

  public getFrenchVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    return voices.filter(v => v.lang.startsWith('fr') || v.lang.startsWith('FR'));
  }

  public cleanTextForSpeech(text: string): string {
    // Nettoie le markdown pour que la voix lise fluidement
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[-*•]\s/g, '. ')
      .trim();
  }

  public speak(
    text: string, 
    onEnd?: () => void,
    options?: { pitch?: number; rate?: number; gender?: VoiceGender }
  ): void {
    if (!this.synth) return;

    this.stop();

    const clean = this.cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'fr-FR';
    
    const targetGender = options?.gender ?? this.selectedGender;
    
    // Calibrer la tonalité selon le genre
    if (targetGender === 'masculine') {
      utterance.pitch = options?.pitch ?? 0.85; // Tonalité masculine plus grave et posée
      utterance.rate = options?.rate ?? 0.98;
    } else {
      utterance.pitch = options?.pitch ?? 1.15; // Tonalité féminine plus claire et dynamique
      utterance.rate = options?.rate ?? 1.02;
    }

    // Choisir la voix la plus adaptée disponible dans le système
    const frenchVoices = this.getFrenchVoices();
    if (frenchVoices.length > 0) {
      if (targetGender === 'masculine') {
        const maleVoice = frenchVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('thomas') || 
                 name.includes('paul') || 
                 name.includes('henri') || 
                 name.includes('claude') || 
                 name.includes('nicolas') || 
                 name.includes('mathieu') || 
                 name.includes('male');
        });
        if (maleVoice) utterance.voice = maleVoice;
        else utterance.voice = frenchVoices[0];
      } else {
        const femaleVoice = frenchVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('hortense') || 
                 name.includes('julie') || 
                 name.includes('denise') || 
                 name.includes('audrey') || 
                 name.includes('celine') || 
                 name.includes('female');
        });
        if (femaleVoice) utterance.voice = femaleVoice;
        else utterance.voice = frenchVoices[0];
      }
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public testVoice(
    gender: VoiceGender = this.selectedGender,
    onEnd?: () => void
  ): void {
    const sample = gender === 'masculine'
      ? "Bonjour, je suis Andrea avec ma voix masculine. Je vous accompagne dans votre stratégie et la création de vos projets."
      : "Bonjour, je suis Andrea avec ma voix féminine. Je vous accompagne avec clarté pour transformer vos idées en actions concrètes.";
    this.speak(sample, onEnd, { gender });
  }

  public stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.notify(false);
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const andreaVoice = new BeaVoiceEngine();
export const beaVoice = andreaVoice;
