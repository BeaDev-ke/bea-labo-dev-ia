import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Flame, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  Star,
  Award,
  ChevronDown
} from 'lucide-react';
import { SALES_PLANS, SalesPlan } from '../data/profilesData';
import { UserProfile } from '../types/bea';

interface SalesOffersProps {
  currentPlan?: 'basique' | 'pro' | 'ultra' | 'free' | 'bea' | 'abo';
  userProfile?: UserProfile;
  onSelectPlan?: (planId: 'basique' | 'pro' | 'ultra' | 'free' | 'bea' | 'abo') => void;
}

export const SalesOffers: React.FC<SalesOffersProps> = ({
  currentPlan = 'free',
  userProfile,
  onSelectPlan,
}) => {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getProfileSpecificPitch = () => {
    if (!userProfile) return null;
    switch (userProfile.profileType) {
      case 'etudiant':
        return {
          title: '🎓 Recommandation Étudiant : Réussir ses devoirs et examens sans stress',
          text: 'Avec le plan Andrea Pro, accédez aux micro-défis cognitifs, aux explications de cours adaptées au programme de votre pays et gagnez 2h de temps libre chaque soir.',
          recommendedPlanId: 'pro',
        };
      case 'createur':
        return {
          title: '🎬 Recommandation Créateur : Publier chaque jour sans blocage de montage',
          text: 'Le plan Andrea Pro intègre le Studio de Design Visuel, les formats multi-écrans et la génération de hooks qui captent l’attention dès les 3 premières secondes.',
          recommendedPlanId: 'pro',
        };
      case 'independant':
      case 'entreprise':
        return {
          title: '💼 Recommandation Business : Analyser les objections et convertir plus de prospects',
          text: 'Bénéficiez des analyses psychologiques de prospects, de la levée d’objections en direct et de la formulation d’offres à haute valeur perçue.',
          recommendedPlanId: 'pro',
        };
      case 'developpeur':
        return {
          title: '💻 Recommandation Tech : Bâtisseur de site en 1 prompt & Coach code illimité',
          text: 'Avec Andrea Ultra, concevez des sites complets prêts à convertir et déboguez vos scripts complexes en temps réel sans aucune limite de tokens.',
          recommendedPlanId: 'abo',
        };
      default:
        return null;
    }
  };

  const profilePitch = getProfileSpecificPitch();

  const faqs = [
    {
      q: 'Puis-je changer d’offre ou résilier à tout moment ?',
      a: 'Oui, absolument. Tous nos forfaits sont 100% sans engagement. Vous pouvez annuler en un seul clic depuis votre espace membre sans justificatif.',
    },
    {
      q: 'Pourquoi Andrea est-elle différente d’une autre IA standard ?',
      a: 'Une IA classique donne des réponses génériques et passives. Andrea est une IA comportementale de BehaviorLab AI : elle identifie précisément vos biais de blocage, élimine la friction de démarrage et vous fait passer à l’action en moins de 10 minutes avec des étapes concrètes.',
    },
    {
      q: "Comment fonctionne la synthèse vocale d'Andrea ?",
      a: "La voix d'Andrea est 100% gratuite et intégrée nativement via la synthèse vocale de pointe de votre navigateur. Vous n’avez aucun abonnement supplémentaire à payer pour écouter ses réponses.",
    },
    {
      q: 'Mes données et mes projets sont-ils protégés ?',
      a: 'Oui. Andrea intègre un bouclier de sécurité anti-piratage multi-niveaux : désinfection XSS, pare-feu prompt injection, chiffrement d’intégrité des quotas et isolation sandbox stricte.',
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2">
      {/* HERO SECTION PERSUASIVE */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold shadow">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Neuro-Productivité & Action Immédiate</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Investissez dans l'IA qui vous fait{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#a855f7]">
            passer à l'action
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#c4b5fd] leading-relaxed">
          Des formules claires, adaptées à votre profil et sans engagement pour libérer votre créativité et atteindre vos objectifs.
        </p>

        {/* FACTUAL TRANSPARENCY MICRO-BANNER */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-[#a78bfa]">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Sans engagement · Résiliation en 1 clic
          </span>
          <span className="flex items-center gap-1.5 font-bold text-white">
            <Zap className="w-4 h-4 text-purple-400" />
            Accès instantané à tous les outils
          </span>
          <span className="flex items-center gap-1.5 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Paiement 100% sécurisé par Stripe
          </span>
        </div>
      </div>

      {/* RECOMMANDATION PERSONNALISÉE PAR PROFIL */}
      {profilePitch && (
        <div className="bg-gradient-to-r from-[#201445] via-[#2a1754] to-[#1e143b] border-2 border-[#a855f7] p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">{profilePitch.title}</h3>
            </div>
            <p className="text-xs text-[#d8ccff] leading-relaxed">{profilePitch.text}</p>
          </div>
          <a
            href={profilePitch.recommendedPlanId === 'abo' ? SALES_PLANS[2].stripeUrl : SALES_PLANS[1].stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-md transition shrink-0 flex items-center gap-1.5"
          >
            <span>Activer l'offre recommandée</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* HEADER SECTION TARIFS CLAIRS & SANS SURPRISE MATCHING PHOTO 3 */}
      <div className="text-center space-y-3 pt-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Tarifs Clairs & Sans Surprise
        </h2>
        <p className="text-xs sm:text-sm text-[#c4b5fd]">
          Basculez entre facturation mensuelle et annuelle pour économiser 20%.
        </p>

        {/* COMMUTATEUR MENSUEL / ANNUEL (-20%) */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#140e2b] border border-[#5A33FF44] shadow-md mt-2">
          <button
            type="button"
            onClick={() => setSelectedBilling('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedBilling === 'monthly'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                : 'text-[#c4b5fd] hover:text-white'
            }`}
          >
            Facturation Mensuelle
          </button>
          <button
            type="button"
            onClick={() => setSelectedBilling('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              selectedBilling === 'annual'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                : 'text-[#c4b5fd] hover:text-white'
            }`}
          >
            <span>Annuel</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* CARDS GRILLE DES 3 OFFRES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {SALES_PLANS.map((plan) => {
          const isPro = plan.id === 'pro';
          const isAbo = plan.id === 'ultra' || plan.id === 'abo';

          // Calcul réduction 20% en annuel
          const displayedPrice = selectedBilling === 'annual'
            ? (plan.priceMonthly * 0.8).toLocaleString('fr-FR', { minimumFractionDigits: plan.priceMonthly === 14.9 ? 2 : 2, maximumFractionDigits: 2 }) + ' €'
            : plan.priceFormatted;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                isPro
                  ? 'bg-gradient-to-b from-[#211648] via-[#1a1238] to-[#120c27] border-2 border-purple-400 shadow-2xl shadow-purple-900/50 scale-[1.02] z-10'
                  : 'bg-[#15112a] border border-[#7c3aed]/50 hover:border-[#7c3aed] shadow-lg'
              }`}
            >
              {/* BADGE POPULAIRE */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 ${plan.badgeColor}`}>
                  <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                {/* Header Offre */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white">{plan.name}</h3>
                    {currentPlan === plan.id && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Plan Actuel
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#c4b5fd] min-h-[32px]">{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="my-5 pb-5 border-b border-[#7c3aed]/30">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {displayedPrice}
                    </span>
                    <span className="text-xs text-[#a78bfa] font-medium">
                      / mois {selectedBilling === 'annual' && '(facturé annuellement)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{plan.highlightRoi}</span>
                  </div>
                </div>

                {/* Transformation pitch */}
                <div className="bg-[#100b24] p-3 rounded-xl border border-[#7c3aed]/30 mb-5 text-[11px] text-purple-200">
                  <strong className="text-amber-300 block mb-0.5">La transformation :</strong>
                  {plan.transformation}
                </div>

                {/* Feature Checklist */}
                <div className="space-y-2.5 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#a78bfa]">Inclus dans cette offre :</div>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-[#e2d6ff]">
                      <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-8 pt-4 border-t border-[#7c3aed]/20 space-y-2">
                <a
                  href={plan.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl text-center text-xs font-black transition flex items-center justify-center gap-2 shadow-lg ${
                    isPro
                      ? 'bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#ec4899] hover:opacity-95 text-white ring-2 ring-purple-400/50'
                      : 'bg-[#231a4a] hover:bg-[#322369] text-white border border-[#7c3aed]'
                  }`}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <div className="text-center text-[10px] text-[#8a7ab8]">{plan.ctaSubtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PSYCHOLOGICAL LOSS AVERSION CALLOUT */}
      <div className="bg-[#140e2b] border border-[#7c3aed]/40 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-400" />
          <span>Le coût invisible de la procrastination vs. L'effet Andrea</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#1e1026] p-4 rounded-2xl border border-rose-500/30 space-y-2">
            <span className="text-rose-400 font-bold block uppercase text-[10px]">Sans Andrea (Ce que vous perdez) :</span>
            <ul className="space-y-1.5 text-rose-200">
              <li>• 3 à 5 heures perdues par projet à hésiter sur la première étape</li>
              <li>• Épuisement mental causé par des tâches reportées au lendemain</li>
              <li>• Des vidéos non publiées et des prospects perdus faute de relance</li>
              <li>• Révisions stressantes la veille des contrôles</li>
            </ul>
          </div>

          <div className="bg-[#0f1f28] p-4 rounded-2xl border border-emerald-500/30 space-y-2">
            <span className="text-emerald-400 font-bold block uppercase text-[10px]">Avec Andrea (Ce que vous gagnez) :</span>
            <ul className="space-y-1.5 text-emerald-200">
              <li>• Passage à l'action garanti en moins de 10 minutes avec des étapes simples</li>
              <li>• Sérénité d'esprit : un plan clair et zéro charge mentale inutile</li>
              <li>• Des visuels professionnels prêts en 1 clic et des hooks viraux optimisés</li>
              <li>• Notes et résultats en forte hausse grâce à l'ancrage régulier</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FOIRE AUX QUESTIONS (FAQ) POUR LEVER TOUTES LES OBJECTIONS */}
      <div className="bg-[#15112a] border border-[#7c3aed]/40 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <span>Questions fréquentes avant de s'abonner</span>
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="bg-[#100b24] border border-[#7c3aed]/30 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 text-xs sm:text-sm font-bold text-white flex items-center justify-between hover:bg-[#181135] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#c4b5fd] leading-relaxed border-t border-[#7c3aed]/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
