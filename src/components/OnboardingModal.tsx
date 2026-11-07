import React, { useState } from 'react';
import { Sparkles, User, Mail, Shield, Check, Crown, Target, HeartHandshake } from 'lucide-react';
import { UserPreferences, PlanType } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  preferences: UserPreferences;
  currentPlan: PlanType;
  onSave: (email: string, prefs: UserPreferences, plan: PlanType) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  preferences,
  currentPlan,
  onSave,
}) => {
  const [email, setEmail] = useState(currentEmail || 'saydoukebe31@gmail.com');
  const [displayName, setDisplayName] = useState(preferences.displayName || 'Saydoukebe31');
  const [profile, setProfile] = useState(preferences.profile || 'createur');
  const [tone, setTone] = useState(preferences.tone || 'expert');
  const [objective, setObjective] = useState(
    preferences.objective || 'Publier chaque jour sans blocage de montage et maximiser la rétention'
  );
  const [plan, setPlan] = useState<PlanType>(currentPlan || 'free');

  if (!isOpen) return null;

  const handleQuickAdmin = () => {
    setEmail('saydoukebe31@gmail.com');
    setDisplayName('Saydoukebe31');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      email.trim().toLowerCase(),
      {
        displayName: displayName.trim() || 'Saydoukebe31',
        profile,
        tone,
        objective,
      },
      plan
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1329] border border-[#2b356d] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#18204d] to-[#252f75] border-b border-[#2b356d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3245a4] flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Connexion & Personnalisation</h3>
              <p className="text-xs text-[#9eb2f7]">Configurez vos réponses pour adapter le prompt d'Andrea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar text-xs">
          {/* Quick admin fill button */}
          <div className="p-3 bg-[#131b3e] border border-[#2b356d] rounded-2xl flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Compte Développeur Administrateur</span>
              <span className="text-[11px] text-[#9eb2f7]">Débloque l'accès Labo Dev Admin pour saydoukebe31@gmail.com</span>
            </div>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="px-3 py-1.5 rounded-xl bg-[#2e3e94] hover:bg-[#384bb5] text-white font-bold text-[11px] transition-colors cursor-pointer"
            >
              Remplir
            </button>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>Adresse Email de connexion :</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: saydoukebe31@gmail.com"
              className="w-full px-3.5 py-2.5 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#4d63df]"
            />
            {email.toLowerCase() === 'saydoukebe31@gmail.com' ? (
              <span className="text-[11px] text-emerald-400 font-bold block">
                ✓ Compte Administrateur reconnu : Labo Dev Admin sera visible dans la barre latérale.
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 block">
                Portail Dev restera masqué pour les utilisateurs standards.
              </span>
            )}
          </div>

          {/* Prénom préféré */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>Prénom ou Pseudo préféré (Appel) :</span>
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Saydoukebe31"
              className="w-full px-3.5 py-2.5 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#4d63df]"
            />
          </div>

          {/* Rôle principal */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Rôle principal :</label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white focus:outline-none cursor-pointer"
            >
              <option value="createur">🎬 Créateur de contenu (Vidéos 9:16, Hooks, Rétention)</option>
              <option value="independant">💼 Indépendant & Freelance</option>
              <option value="entreprise">🏢 Dirigeant & Entreprise</option>
              <option value="etudiant">🎓 Étudiant</option>
              <option value="salarie">👔 Salarié & Manager</option>
              <option value="recherche_emploi">🔍 En recherche d'emploi</option>
              <option value="parent">👨‍👩‍👦 Parent actif</option>
              <option value="enseignant">📚 Enseignant & Formateur</option>
              <option value="autre">⚡ Autre projet</option>
            </select>
          </div>

          {/* Style préféré */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Style préféré de posture & réponse :</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white focus:outline-none cursor-pointer"
            >
              <option value="expert">Expert comportemental (Recommandé)</option>
              <option value="direct">Direct & Stratégique</option>
              <option value="bienveillant">Bienveillant & Pédagogue</option>
              <option value="challengeur">Challengeur sans compromis</option>
            </select>
          </div>

          {/* Objectif prioritaire */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Objectif prioritaire enregistré dans la mémoire :</span>
            </label>
            <textarea
              rows={2}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Publier chaque jour sans blocage de montage..."
              className="w-full p-3 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white focus:outline-none focus:border-[#4d63df] resize-none"
            />
          </div>

          {/* Formule active */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Formule active :</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlan('free')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  plan === 'free'
                    ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                    : 'bg-[#141b3d] border-[#2b356d] text-slate-400'
                }`}
              >
                FREE
              </button>
              <button
                type="button"
                onClick={() => setPlan('pro')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  plan === 'pro'
                    ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#3b82f6]'
                    : 'bg-[#141b3d] border-[#2b356d] text-slate-400'
                }`}
              >
                Andrea Pro
              </button>
              <button
                type="button"
                onClick={() => setPlan('abo')}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                  plan === 'abo'
                    ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]'
                    : 'bg-[#141b3d] border-[#2b356d] text-slate-400'
                }`}
              >
                Ultra
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-[#2b356d] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] hover:from-[#2a45c7] hover:to-[#4e6df5] text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Valider & Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
