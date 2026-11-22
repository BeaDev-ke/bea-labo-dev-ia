import React, { useState, useEffect } from 'react';
import { Sparkles, User, Mail, Check, Target } from 'lucide-react';
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
  const [email, setEmail] = useState(currentEmail || '');
  const [displayName, setDisplayName] = useState(preferences.displayName || '');
  const [profile, setProfile] = useState(preferences.profile || 'createur');
  const [tone, setTone] = useState(preferences.tone || 'expert');
  const [objective, setObjective] = useState(
    preferences.objective || 'Progresser et avancer concrètement chaque jour'
  );
  const [plan, setPlan] = useState<PlanType>(currentPlan || 'free');

  useEffect(() => {
    if (isOpen) {
      setEmail(currentEmail || '');
      setDisplayName(preferences.displayName || '');
      setProfile(preferences.profile || 'createur');
      setTone(preferences.tone || 'expert');
      setObjective(preferences.objective || 'Progresser et avancer concrètement chaque jour');
      setPlan(currentPlan || 'free');
    }
  }, [isOpen, currentEmail, preferences, currentPlan]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenName = displayName.trim();
    if (!chosenName) return;
    onSave(
      (email || currentEmail).trim().toLowerCase(),
      {
        ...preferences,
        displayName: chosenName,
        profile,
        tone,
        objective: objective.trim() || 'Progresser et avancer concrètement chaque jour',
      },
      plan
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-[#0e1329] border border-[#2b356d] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-gradient-to-r from-[#18204d] to-[#252f75] border-b border-[#2b356d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3245a4] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Connexion &amp; Personnalisation</h3>
              <p className="text-[11px] text-[#9eb2f7]">
                {displayName.trim()
                  ? `Andrea s'adressera à vous sous le nom « ${displayName.trim()} »`
                  : 'Adaptez Andrea à votre profil et choisissez votre nom'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>Adresse Email :</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Nom choisi (Prénom ou Pseudo) :</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre prénom ou nom choisi"
                className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-200">Rôle principal :</label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white cursor-pointer"
              >
                <option value="createur">Créateur de contenu</option>
                <option value="independant">Indépendant &amp; Freelance</option>
                <option value="entreprise">Dirigeant &amp; Entreprise</option>
                <option value="etudiant">Étudiant</option>
                <option value="salarie">Salarié &amp; Manager</option>
                <option value="recherche_emploi">En recherche d'emploi</option>
                <option value="parent">Parent</option>
                <option value="enseignant">Enseignant</option>
                <option value="autre">Autre projet</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-200">Style de réponse :</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white cursor-pointer"
              >
                <option value="expert">Pédagogique &amp; Détaillé</option>
                <option value="bienveillant">Bienveillant &amp; Ludique</option>
                <option value="direct">Direct &amp; Stratégique</option>
                <option value="challengeur">Challengeur &amp; Socratique</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-200 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Objectif prioritaire :</span>
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3 py-2 bg-[#141b3d] border border-[#2b356d] rounded-xl text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-200">Formule active :</label>
            <div className="grid grid-cols-3 gap-2">
              {(['free', 'pro', 'abo'] as PlanType[]).map((pid) => (
                <button
                  key={pid}
                  type="button"
                  onClick={() => setPlan(pid)}
                  className={`py-1.5 px-3 rounded-xl border text-center font-bold cursor-pointer ${
                    plan === pid ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white' : 'bg-[#141b3d] border-[#2b356d] text-slate-400'
                  }`}
                >
                  {pid === 'free' ? 'FREE' : pid === 'pro' ? 'Andrea Pro' : 'Ultra'}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#2b356d] flex items-center justify-between">
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-slate-400 hover:text-white cursor-pointer font-semibold">
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#2036a1] to-[#3a58e8] text-white font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
