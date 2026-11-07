import React from 'react';
import {
  Sparkles,
  Shield,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Crown,
  ExternalLink
} from 'lucide-react';
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

export const AccountPage: React.FC<AccountPageProps> = ({
  currentPlan,
  onUpgrade,
}) => {
  const plans = [
    {
      id: 'bea' as PlanType,
      name: 'Andrea',
      price: '9 €',
      period: '/ mois',
      desc: 'Idéal pour démarrer avec les conseils comportementaux et la création de base.',
      features: [
        '100 messages chat / mois',
        '30 audits & générations de code',
        'Générateur Wan 2.1 vidéo 9:16',
        '10 mouvements de caméra cinéma',
        'Accès mémoire comportementale',
      ],
      stripeLink: 'https://buy.stripe.com/test_andrea_9',
    },
    {
      id: 'pro' as PlanType,
      name: 'Andrea Pro',
      price: '14,90 €',
      period: '/ mois',
      popular: true,
      desc: 'Pour les créateurs et indépendants produisant activement du contenu vidéo et web.',
      features: [
        'Chat illimité avec modèle puissant',
        'Wan 2.1 9:16 HD sans watermark',
        'Voix off humaine F5-TTS SWIVID & XTTS-v2',
        'Sous-titres automatiques Whisper & export .SRT',
        'Menu Montage avec découpage automatique de scènes',
        'Studio de visuels Flux 1 Schnell',
      ],
      stripeLink: 'https://buy.stripe.com/test_andrea_pro_1490',
    },
    {
      id: 'abo' as PlanType,
      name: 'Andrea Ultra',
      price: '16 €',
      period: '/ mois',
      desc: 'La suite intégrale : application web autonome, code copilot et studio complet.',
      features: [
        'Tout Andrea Pro en illimité',
        'Créateur de site web pro (style IONOS)',
        'Éditeur Python & Streamlit Copilote',
        'Studio de composition plein écran multi-formats',
        'Accès prioritaire file d\'attente Wan 2.1',
      ],
      stripeLink: 'https://buy.stripe.com/test_andrea_ultra_16',
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Center Kicker & Title matching Photo 3 */}
      <div className="text-center space-y-4 pt-4">
        {/* Neuro-Productivité badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1e2759] border border-[#344499] text-xs font-bold text-amber-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
          <span>Neuro-Productivité & Action Immédiate</span>
        </div>

        {/* Big headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Investissez dans l'IA qui vous fait passer <span className="bg-gradient-to-r from-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">à l'action</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Des formules claires, adaptées à votre profil et sans engagement pour libérer votre créativité et atteindre vos objectifs.
        </p>

        {/* 3 Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Sans engagement · Résiliation en 1 clic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Accès instantané à tous les outils</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paiement 100% sécurisé par Stripe</span>
          </div>
        </div>
      </div>

      {/* Creator Recommendation Card matching Photo 3 */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171f4c] to-[#252f75] border border-[#3a499c] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-extrabold text-white">
            <span className="text-base">🎬</span>
            <span>Recommandation Créateur : Publier chaque jour sans blocage de montage</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            Le plan Andrea Pro intègre le Studio de Design Visuel, les formats multi-écrans et la génération de hooks qui captent l'attention dès les 3 premières secondes.
          </p>
        </div>

        <button
          onClick={() => onUpgrade('pro')}
          className="px-6 py-3 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] hover:from-[#db2777] hover:to-[#7c3aed] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>Activer l'offre recommandée</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* USER REQUIREMENT: Dans le menu tarif le titre ne mets pas tarifs clairs et ... Mets juste "Offres pour plus d'avantages" */}
      <div className="pt-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Offres pour plus d'avantages
          </h2>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative ${
                  p.popular
                    ? 'bg-[#151c44] border-[#4456ba] shadow-2xl shadow-indigo-950/60 ring-1 ring-indigo-400/40'
                    : 'bg-[#0f1430] border-[#222c5e]'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-[10px] font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>Recommandé</span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-black text-white">{p.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>

                  <div className="mt-4 mb-6 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{p.price}</span>
                    <span className="text-xs text-slate-400 font-medium">{p.period}</span>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-[#222c5e]">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#222c5e]">
                  {isCurrent ? (
                    <div className="w-full py-2.5 text-center text-xs font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 rounded-xl">
                      ✓ Forfait actif
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpgrade(p.id)}
                      className="w-full py-2.5 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] hover:from-[#2a45c7] hover:to-[#4e6df5] text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
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
