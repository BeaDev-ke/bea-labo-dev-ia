import React, { useState, useEffect } from 'react';
import { Sparkles, Check, HelpCircle, X, ChevronRight, Zap } from 'lucide-react';

export interface DidacticielStep {
  id: string;
  title: string;
  description: string;
  advantage: string;
  badge?: string;
}

export const DIDACTICIEL_STEPS: Record<string, DidacticielStep> = {
  tokens: {
    id: 'tokens',
    title: 'Compteur & Quota de Tokens Évolutif',
    description: 'Chaque réponse d\'Andrea consomme des tokens. Votre quota se recharge tous les jours à minuit.',
    advantage: 'Plus votre série de connexion consécutive augmente, plus votre quota de tokens quotidiens augmente (+2 500 tokens/j en Basique jusqu\'à 50k, +5 000/j en Pro jusqu\'à 120k). L\'offre Ultra bénéficie de Tokens 100% ILLIMITÉS sans aucune restriction.',
    badge: 'Avantage Série'
  },
  chat: {
    id: 'chat',
    title: 'Discussion avec Andrea',
    description: 'Votre copilote stratégique comportemental. Andrea adapte ses conseils à votre profil et vous appelle par votre prénom.',
    advantage: 'Gagnez du temps en éliminant la procrastination, les blocages de montage et les hésitations stratégiques.',
    badge: 'Stratégie'
  },
  site: {
    id: 'site',
    title: 'Création de Site Web en 1 Prompt',
    description: 'Générez et éditez des applications et landing pages complètes avec code multi-fichiers (HTML, CSS, JS) et aperçu responsive.',
    advantage: 'Remplace une agence web ou des journées de codage. Téléchargez les fichiers prêts à être déployés en ligne.',
    badge: 'Production'
  },
  montage: {
    id: 'montage',
    title: 'Studio de Montage Vidéo & Visuels',
    description: 'Studio plein écran avec sous-titres dynamiques (Jaune Impact MrBeast, Boîte Noire, Néon Cyber), filtres vidéo, stickers et effets sonores SFX.',
    advantage: 'Multiplie par 3 le taux de rétention de vos vidéos grâce à des hooks et des découpes calibrées pour les formats mobiles.',
    badge: 'Rétention'
  },
  creative_hub: {
    id: 'creative_hub',
    title: 'Labo d\'IA & Accroches Virales',
    description: 'Boîte à outils d\'actions rapides : générez des titres percutants, des structures de scripts et clarifiez des concepts complexes.',
    advantage: 'Passez de l\'idée au plan d\'action en moins de 3 minutes chrono.',
    badge: 'Créativité'
  },
  offres: {
    id: 'offres',
    title: 'Formules & Évolution du Compte',
    description: 'Choisissez entre Basique (9 €), Pro (14.90 €) et Ultra (18 €).',
    advantage: 'L\'offre Ultra débloque les Tokens ILLIMITÉS (∞), la vitesse de réponse prioritaire et tous les modules sans plafonnement.',
    badge: 'Formules'
  },
  espace_perso: {
    id: 'espace_perso',
    title: 'Espace Personnel & Cas d\'Usage',
    description: 'Andrea personnalise son ton, ses questions de relance et ses suggestions selon votre cas d\'usage sélectionné.',
    advantage: 'Un accompagnement chirurgical adapté à votre situation (créateur, étudiant, indépendant ou entrepreneur).',
    badge: 'Sur-Mesure'
  }
};

interface TooltipProps {
  stepId: keyof typeof DIDACTICIEL_STEPS;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'right' | 'left';
  className?: string;
}

export const DidacticielWrapper: React.FC<TooltipProps> = ({ 
  stepId, 
  children, 
  placement = 'bottom',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const step = DIDACTICIEL_STEPS[stepId];

  useEffect(() => {
    try {
      const seen = localStorage.getItem(`andrea_didacticiel_${stepId}`);
      if (seen) setHasInteracted(true);
    } catch {}
  }, [stepId]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setHasInteracted(true);
    try {
      localStorage.setItem(`andrea_didacticiel_${stepId}`, 'true');
    } catch {}
  };

  if (!step) return <>{children}</>;

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
  }[placement];

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div 
          className={`absolute z-50 w-72 sm:w-80 p-3.5 rounded-2xl bg-[#140e2e]/98 text-white border border-[#5A33FF88] shadow-2xl backdrop-blur-xl pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150 ${placementClasses}`}
          style={{ minWidth: '280px' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#1E1B8C] to-[#5A33FF] flex items-center justify-center text-[10px]">
                💡
              </span>
              <span className="text-xs font-extrabold text-white leading-tight">
                {step.title}
              </span>
            </div>
            {step.badge && (
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 shrink-0">
                {step.badge}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[11px] text-zinc-300 leading-relaxed mb-2">
            {step.description}
          </p>

          {/* Key Advantage (Mise en avant des avantages comme demandé par l'utilisateur) */}
          <div className="p-2 rounded-xl bg-[#201844] border border-[#5A33FF44] text-[10px] text-[#d8ccff] space-y-1">
            <div className="flex items-center gap-1 text-amber-300 font-bold uppercase tracking-wider text-[9px]">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>Avantage Spécifique :</span>
            </div>
            <div className="leading-snug">
              {step.advantage}
            </div>
          </div>

          {/* Footer with dismiss */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px]">
            <span className="text-zinc-400 italic">
              {hasInteracted ? 'Déjà consulté' : 'Premier survol découvert'}
            </span>
            <button
              onClick={handleDismiss}
              className="px-2 py-0.5 rounded-lg bg-[#5A33FF] hover:bg-[#6e4afd] text-white font-bold transition flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Compris</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
