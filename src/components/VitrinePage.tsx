import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  Target,
  Rocket,
  Film,
  Code2,
  Brain,
  ArrowRight
} from 'lucide-react';
import { UserPreferences, PlanType } from '../types';

interface VitrinePageProps {
  onLogin: (email: string, prefs?: UserPreferences, plan?: PlanType) => void;
  savedPreferences?: UserPreferences;
  savedEmail?: string;
  isLoggedIn?: boolean;
}

export const VitrinePage: React.FC<VitrinePageProps> = ({
  onLogin,
  savedPreferences,
  savedEmail = '',
  isLoggedIn = false,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(savedEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [callName, setCallName] = useState(savedPreferences?.displayName || '');
  const [selectedRole, setSelectedRole] = useState(savedPreferences?.profile || 'createur');
  const [selectedStyle, setSelectedStyle] = useState(savedPreferences?.tone || 'expert');
  const [selectedGoal, setSelectedGoal] = useState(savedPreferences?.objective || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Veuillez renseigner votre adresse e-mail.');
      return;
    }

    const updatedPrefs: UserPreferences | undefined = callName.trim()
      ? {
          ...(savedPreferences || { profile: selectedRole, tone: selectedStyle }),
          displayName: callName.trim(),
        }
      : savedPreferences;

    setSuccessMsg(
      updatedPrefs?.displayName
        ? `Connexion réussie, ${updatedPrefs.displayName} ! Chargement de votre espace Andrea...`
        : 'Connexion réussie ! Chargement de votre espace Andrea...'
    );
    setTimeout(() => {
      onLogin(cleanEmail, updatedPrefs, 'free');
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    const cleanName = callName.trim();

    if (!cleanEmail || !cleanName) {
      setErrorMsg("Veuillez remplir votre prénom d'appel et votre e-mail.");
      return;
    }

    const newPrefs: UserPreferences = {
      displayName: cleanName,
      profile: selectedRole,
      tone: selectedStyle,
      objective: selectedGoal || 'Avancer concrètement chaque jour sur mes projets',
    };

    setSuccessMsg(`Bienvenue ${cleanName} ! Votre espace Andrea est prêt.`);
    setTimeout(() => {
      onLogin(cleanEmail, newPrefs, 'free');
    }, 350);
  };

  return (
    <div className="min-h-screen lg:h-screen bg-[#0d091e] text-slate-100 flex flex-col justify-between overflow-y-auto lg:overflow-hidden overflow-x-hidden font-sans selection:bg-[#5A33FF] selection:text-white">
      {/* Top Header */}
      <header className="shrink-0 border-b border-[#5A33FF33] bg-[#0c081e]/90 px-3 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <img
            src="/logo_andrea.svg"
            alt="Andrea"
            className="w-8 h-8 object-contain shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">Andrea</span>
              <span className="text-[11px] font-semibold text-[#c4b5fd] truncate">
                Stratégique & Créative
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              L'IA qui vous accompagne pas à pas vers la réussite concrète
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold bg-[#161036] px-3 py-1.5 rounded-xl border border-[#5A33FF33]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Connexion Sécurisée</span>
          </div>

          {isLoggedIn && (
            <button
              type="button"
              onClick={() =>
                onLogin(
                  email.trim() || savedEmail || 'utilisateur@andrea.app',
                  savedPreferences,
                  'free'
                )
              }
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Accéder à mon espace</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 max-w-6xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 flex flex-col justify-center gap-5 lg:overflow-hidden">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#c4b5fd] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Intelligence Stratégique & Créative</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-[1.12]">
              L'IA qui vous propulse vers la{' '}
              <span className="bg-gradient-to-r from-[#8B70FF] via-[#a78bfa] to-[#c4b5fd] bg-clip-text text-transparent">
                réussite concrète
              </span>.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Création de contenu percutant, montage vidéo 9:16, conception de sites et d'applications en un message, rédaction stratégique ou organisation quotidienne — <span className="text-white font-semibold">Andrea s'adapte à votre vision</span> pour débloquer chaque situation et passer à l'action.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#20174c] text-purple-300 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Accompagnement sur-mesure</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    S'aligne sur vos méthodes et priorités.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#20174c] text-sky-300 shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Montage & Visuels 9:16</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Découpage de scènes, audio universel et sous-titres.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#20174c] text-emerald-300 shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sites & Apps à la demande</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Aperçu en direct dès que vous le demandez.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#20174c] text-amber-300 shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Passage à l'action immédiat</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Clarté mentale et progression continue.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login / Register Card */}
          <div className="lg:col-span-5" id="connexion">
            <div className="bg-[#171038] border border-[#5A33FF55] rounded-3xl p-5 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#5A33FF33] pb-2.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="font-extrabold text-sm text-white">Espace Membre Andrea</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">Actif</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0f0b24] rounded-xl border border-[#5A33FF33]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMsg(null);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre adresse e-mail"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-white">Mot de passe</label>
                      <span className="text-[10px] text-[#c4b5fd]/70">Sécurisé</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b5fd] hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Accéder à mon espace Andrea</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>Comment Andrea doit-elle vous appeler ?</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={callName}
                      onChange={(e) => setCallName(e.target.value)}
                      placeholder="Votre prénom ou pseudo"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF66] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre adresse e-mail"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-white">Rôle principal</label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="createur">Créateur de contenu</option>
                        <option value="developpeur">Développeur / Tech</option>
                        <option value="independant">Indépendant</option>
                        <option value="entreprise">Entrepreneur / PME</option>
                        <option value="etudiant">Étudiant</option>
                        <option value="autre">Autre objectif</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-white">Style préféré</label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="expert">Expert & Stratégique</option>
                        <option value="bienveillant">Bienveillant & Motivant</option>
                        <option value="synthetique">Synthétique & Direct</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white">Votre objectif principal</label>
                    <input
                      type="text"
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      placeholder="Décrivez votre objectif principal"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Créer mon compte et démarrer</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Bottom 3-Card Summary Row fitting cleanly in viewport */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#5A33FF33]">
          <div className="p-3.5 rounded-2xl bg-[#150f33] border border-[#5A33FF44] flex items-start gap-3">
            <Film className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">Montage & Vidéo 9:16</h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Découpage de scènes, recherche musicale et sous-titres synchronisés.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#150f33] border border-[#5A33FF44] flex items-start gap-3">
            <Code2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">Création de Sites & Apps</h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Demandez une application dans la discussion pour l'éditer en direct.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#150f33] border border-[#5A33FF44] flex items-start gap-3">
            <Brain className="w-5 h-5 text-[#c4b5fd] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-white">Clarté & Passage à l'action</h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Suppression de la surcharge mentale et mémoire contextuelle continue.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-[#5A33FF33] bg-[#0c081e] px-6 py-2.5 text-center text-[11px] text-slate-400">
        <p>© 2026 Andrea · Intelligence Stratégique & Créative. Tous droits réservés.</p>
      </footer>
    </div>
  );
};
