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

class BeaVoiceEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private listeners: ((speaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return this.synth !== null;
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
    options?: { pitch?: number; rate?: number }
  ): void {
    if (!this.synth) return;

    this.stop();

    const clean = this.cleanTextForSpeech(text);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'fr-FR';
    utterance.pitch = options?.pitch ?? 1.05; // Voix légèrement plus chaleureuse
    utterance.rate = options?.rate ?? 1.0; // Rythme naturel

    // Choisit la meilleure voix française disponible
    const frenchVoices = this.getFrenchVoices();
    if (frenchVoices.length > 0) {
      // Préférer les voix neurales haute qualité si présentes
      const preferred = frenchVoices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Neural') || 
        v.name.includes('Hortense') ||
        v.name.includes('Thomas') ||
        v.name.includes('Julie')
      ) || frenchVoices[0];
      utterance.voice = preferred;
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

  public stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.notify(false);
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const beaVoice = new BeaVoiceEngine();
