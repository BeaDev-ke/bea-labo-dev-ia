/**
 * Moteur Vocal Haute Fidélité pour Andrea (Style ChatGPT)
 * Sélectionne en priorité absolue les voix neuronales et naturelles (Natural / Neural / Online / Google / Enhanced)
 * et applique un phrasé humain avec micro-pauses et intonation chaleureuse.
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
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      try {
        const saved = localStorage.getItem('andrea_voice_gender');
        if (saved === 'masculine' || saved === 'feminine') {
          this.selectedGender = saved;
        }
      } catch {}

      // Pré-charger et surveiller le chargement des voix du système
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
        this.cachedVoices = voices.filter(v => {
          const l = v.lang.toLowerCase();
          return l.startsWith('fr') || l.includes('french');
        });
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
    this.loadVoices();
    return this.cachedVoices;
  }

  /**
   * Évalue la qualité et le réalisme d'une voix selon son type de modèle
   * Privilégie les voix neuronales (Neural, Natural, Google Cloud TTS, Apple Enhanced)
   * et pénalise les synthétiseurs robotiques Desktop des années 2000.
   */
  private scoreVoice(voice: SpeechSynthesisVoice, targetGender: VoiceGender): number {
    let score = 0;
    const name = voice.name.toLowerCase();
    const uri = (voice.voiceURI || '').toLowerCase();
    const lang = voice.lang.toLowerCase();

    // Doit être française
    if (!lang.startsWith('fr') && !lang.includes('french')) {
      return -100;
    }

    // 1. Voix neuronales ultra-réalistes modernes (Azure Natural, Google Cloud, Apple Enhanced)
    const isNatural = name.includes('natural') || uri.includes('natural');
    const isNeural = name.includes('neural') || uri.includes('neural');
    const isOnline = name.includes('online') || uri.includes('online');
    const isEnhanced = name.includes('enhanced') || uri.includes('enhanced');
    const isGoogle = name.includes('google') || uri.includes('google');
    const isSiri = name.includes('siri') || uri.includes('siri');

    if (isNatural) score += 60;
    if (isNeural) score += 50;
    if (isOnline) score += 40;
    if (isEnhanced) score += 45;
    if (isGoogle) score += 40;
    if (isSiri) score += 35;

    // Détection du genre ciblé
    if (targetGender === 'masculine') {
      const maleNames = ['henri', 'thomas', 'alain', 'claude', 'jerome', 'paul', 'nicolas', 'maurice', 'yves', 'yvon', 'celestin', 'mathieu'];
      if (maleNames.some(m => name.includes(m) || uri.includes(m))) {
        score += 35;
      }
      if (name.includes('male') && !name.includes('female')) {
        score += 25;
      }
      // Pénaliser les voix féminines si l'utilisateur demande masculine
      const femaleNames = ['denise', 'julie', 'audrey', 'hortense', 'brigitte', 'eloise', 'coralie', 'jacqueline', 'amelie', 'female'];
      if (femaleNames.some(f => name.includes(f) || uri.includes(f))) {
        score -= 50;
      }
    } else {
      // Féminin par défaut
      const femaleNames = ['denise', 'julie', 'audrey', 'brigitte', 'eloise', 'coralie', 'jacqueline', 'amelie', 'hortense'];
      if (femaleNames.some(f => name.includes(f) || uri.includes(f))) {
        score += 35;
      }
      if (name.includes('female')) {
        score += 25;
      }
      // Pénaliser les voix masculines si l'utilisateur demande féminine
      const maleNames = ['henri', 'thomas', 'alain', 'claude', 'jerome', 'paul', 'nicolas', 'male'];
      if (maleNames.some(m => name.includes(m) || uri.includes(m))) {
        score -= 50;
      }
    }

    // Pénaliser fortement les anciennes voix synthétiques robotiques desktop
    if (name.includes('desktop') && !isNatural && !isNeural) {
      score -= 30;
    }

    // Préférence pour le français métropolitain (France)
    if (lang === 'fr-fr' || lang === 'fr_fr') {
      score += 10;
    }

    return score;
  }

  /**
   * Trouve la voix neuronale / naturelle la plus humaine et expressive (style ChatGPT)
   */
  public selectBestVoice(gender: VoiceGender): SpeechSynthesisVoice | null {
    const frenchVoices = this.getFrenchVoices();
    if (frenchVoices.length === 0) return null;

    // Trier les voix selon leur score de réalisme
    const ranked = [...frenchVoices].sort((a, b) => {
      return this.scoreVoice(b, gender) - this.scoreVoice(a, gender);
    });

    return ranked[0] || frenchVoices[0];
  }

  /**
   * Humanise le texte pour supprimer les hésitations synthétiques
   * et prononcer naturellement comme un humain (ChatGPT Voice style)
   */
  public humanizeTextForSpeech(text: string): string {
    return text
      // Suppression du markdown
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[-*•]\s+/g, ', ')
      // Remplacement des acronymes et termes techniques par leur prononciation naturelle
      .replace(/\bBehaviorLab AI\b/gi, 'Andrea')
      .replace(/\bBehaviorLab\b/gi, 'Andrea')
      .replace(/\bNexusAI\b/gi, 'Andrea')
      .replace(/\bAI\b/g, 'intelligence')
      .replace(/\bIA\b/g, 'intelligence')
      .replace(/\b1 prompt\b/gi, 'un prompt')
      .replace(/\b1 clic\b/gi, 'un clic')
      .replace(/\b3 étapes\b/gi, 'trois étapes')
      .replace(/\b15 minutes\b/gi, 'quinze minutes')
      .replace(/\b9:16\b/g, 'neuf seizièmes')
      .replace(/\bHTML5\b/gi, 'HTML cinq')
      .replace(/\bCSS3\b/gi, 'CSS trois')
      .replace(/\bVercel\b/gi, 'Vercel')
      .replace(/\bSaaS\b/gi, 'logiciel en ligne')
      // Remplacement des deux-points et points-virgules par des virgules pour créer des respirations naturelles
      .replace(/:\s*/g, ', ')
      .replace(/;\s*/g, ', ')
      // Éviter les doubles virgules ou espaces
      .replace(/,\s*,/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(
    text: string, 
    onEnd?: () => void,
    options?: { pitch?: number; rate?: number; gender?: VoiceGender }
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

    const utterance = new SpeechSynthesisUtterance(humanized);
    utterance.lang = 'fr-FR';
    
    const targetGender = options?.gender ?? this.selectedGender;
    
    // Cadence naturelle et fluide (style ChatGPT) :
    // PITCH = 1.0 (neutre / timbre naturel d'origine)
    // RATE = 1.0 (vitesse fluide conversationnelle standard)
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.rate = options?.rate ?? 1.0;

    // Sélection de la meilleure voix neuronale disponible
    const bestVoice = this.selectBestVoice(targetGender);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    let hasEnded = false;
    const triggerEnd = () => {
      if (!hasEnded) {
        hasEnded = true;
        this.notify(false);
        if (onEnd) onEnd();
      }
    };

    utterance.onstart = () => {
      this.notify(true);
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
    onEnd?: () => void
  ): void {
    const sample = gender === 'masculine'
      ? "Bonjour ! Je suis Andrea. Je vous accompagne avec clarté pour structurer votre travail et concrétiser vos projets."
      : "Bonjour ! Je suis Andrea. Je vous accompagne avec clarté pour structurer votre travail et concrétiser vos projets.";
    this.speak(sample, onEnd, { gender });
  }

  public stop(): void {
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

export const andreaVoice = new BeaVoiceEngine();
export const beaVoice = andreaVoice;
