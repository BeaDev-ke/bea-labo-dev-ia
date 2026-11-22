import React from 'react';
import { Sparkles, Shield, Zap, Lock, ArrowRight, CheckCircle2, Crown, ExternalLink } from 'lucide-react';
import { PlanType } from '../types';

interface AccountPageProps {
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
  chatUsed: number;
  chatLimit: number;
  codeUsed: number;
  codeLimit: number;
  onClearHistory: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ currentPlan, onUpgrade }) => {
  const plans = [
    {
      id: 'bea' as PlanType,
      name: 'Andrea Essentiel',
      price: '9 €',
      period: '/ mois',
      desc: 'Idéal pour débloquer vos situations et démarrer la création vidéo.',
      features: [
        '100 messages discussion / mois',
        'Studio vidéo 9:16 avec 10 mouvements caméra',
        'Création de sites et apps sur demande en discussion',
        'Accès mémoire contextuelle',
      ],
    },
    {
      id: 'pro' as PlanType,
      name: 'Andrea Pro',
      price: '14,90 €',
      period: '/ mois',
      popular: true,
      desc: 'Pour les créateurs et indépendants produisant activement vidéos et visuels.',
      features: [
        'Discussion illimitée pour débloquer chaque projet',
        'Studio Montage complet & découpage automatique',
        'Voix off humaine & sous-titres synchronisés',
        'Visuels sur mesure & recherche audio universelle',
      ],
    },
    {
      id: 'abo' as PlanType,
      name: 'Andrea Ultra',
      price: '16 €',
      period: '/ mois',
      desc: 'La puissance intégrale sans aucune limite de production.',
      features: [
        'Tout Andrea Pro en illimité',
        'Création de sites et applications web sans plafond',
        'Rendu vidéo haute priorité & export multi-formats',
        'Sauvegarde permanente de tous vos projets',
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between gap-3 max-w-6xl mx-auto overflow-y-auto lg:overflow-hidden overflow-x-hidden">
      {/* Compact Header */}
      <div className="shrink-0 text-center space-y-1.5 pt-1">
        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          Investissez dans l'IA qui vous fait passer{' '}
          <span className="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
            à l'action
          </span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Sans engagement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Accès instantané aux outils</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paiement sécurisé</span>
          </div>
        </div>
      </div>

      {/* Creator Recommendation Card */}
      <div className="shrink-0 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#171f4c] to-[#252f75] border border-[#3a499c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-0.5">
          <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Recommandation : Débloquer chaque situation &amp; monter vos vidéos sans friction</span>
          </div>
          <p className="text-[11px] text-slate-200">
            Andrea Pro réunit le studio de montage complet, les animations visuelles et la création dynamique sur simple demande.
          </p>
        </div>

        <button
          onClick={() => onUpgrade('pro')}
          className="px-4 py-2 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-extrabold text-xs rounded-xl cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5"
        >
          <span>Activer l'offre recommandée</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="flex-1 min-h-0 flex flex-col gap-2 lg:overflow-hidden">
        <h2 className="shrink-0 text-center text-base sm:text-lg font-black text-white">Offres pour plus d'avantages</h2>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:overflow-hidden">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
                  p.popular
                    ? 'bg-[#151c44] border-[#4456ba] ring-1 ring-indigo-400/40'
                    : 'bg-[#0f1430] border-[#222c5e]'
                }`}
              >
                {p.popular && (
                  <div className="self-start mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-[10px] font-black uppercase text-white flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>Recommandé</span>
                  </div>
                )}

                <div className="space-y-2">
                  <div>
                    <h3 className="text-base font-black text-white">{p.name}</h3>
                    <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 tabular-nums">
                    <span className="text-2xl font-black text-white">{p.price}</span>
                    <span className="text-xs text-slate-400">{p.period}</span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#222c5e]">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#222c5e]">
                  {isCurrent ? (
                    <div className="w-full py-2 text-center text-xs font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                      Forfait actif
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpgrade(p.id)}
                      className="w-full py-2 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Sélectionner {p.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
