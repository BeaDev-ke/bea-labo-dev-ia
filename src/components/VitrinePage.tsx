import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  Zap,
  Target,
  Rocket,
  Compass,
  Film,
  Code2,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserPreferences, PlanType } from '../types';

interface VitrinePageProps {
  onLogin: (email: string, prefs?: UserPreferences, plan?: PlanType) => void;
  savedEmail?: string;
  savedPreferences?: UserPreferences;
  isLoggedIn?: boolean;
}

export const VitrinePage: React.FC<VitrinePageProps> = ({
  onLogin,
  savedEmail = 'saydoukebe31@gmail.com',
  savedPreferences,
  isLoggedIn = false,
}) => {
  // Connection box states - empty initial inputs (no pre-filled credentials)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration / Personalization fields
  const [callName, setCallName] = useState(savedPreferences?.displayName || 'Saydoukebe31');
  const [selectedRole, setSelectedRole] = useState(savedPreferences?.profile || 'createur');
  const [selectedStyle, setSelectedStyle] = useState(savedPreferences?.tone || 'expert');
  const [selectedGoal, setSelectedGoal] = useState(
    savedPreferences?.objective || 'Publier chaque jour sans blocage de montage et maximiser la rétention'
  );
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

    setSuccessMsg('Connexion réussie ! Chargement de votre espace Andrea...');
    setTimeout(() => {
      onLogin(cleanEmail, savedPreferences, 'free');
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    const cleanName = callName.trim();

    if (!cleanEmail || !cleanName) {
      setErrorMsg('Veuillez remplir votre prénom d\'appel et votre e-mail.');
      return;
    }

    const newPrefs: UserPreferences = {
      displayName: cleanName,
      profile: selectedRole,
      tone: selectedStyle,
      objective: selectedGoal,
    };

    setSuccessMsg(`Bienvenue ${cleanName} ! Votre espace Andrea sur-mesure est prêt.`);
    setTimeout(() => {
      onLogin(cleanEmail, newPrefs, 'free');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0d091e] text-slate-100 flex flex-col font-sans selection:bg-[#5A33FF] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-[#5A33FF33] bg-[#0c081e]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/logo_andrea.svg"
              alt="Andrea Logo"
              className="w-9 h-9 rounded-xl object-contain drop-shadow"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d091e]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">Andrea</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1e1744] text-[#c4b5fd] border border-[#5A33FF55]">
                Stratégique & Créative
              </span>
            </div>
            <p className="text-[11px] text-[#c4b5fd] hidden sm:block">
              L'IA qui vous accompagne pas à pas vers la réussite concrète
            </p>
          </div>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-[#161036] px-3 py-1.5 rounded-xl border border-[#5A33FF33]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Connexion Sécurisée</span>
          </div>

          <a
            href="#connexion"
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-md shadow-[#5A33FF33] flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isLoggedIn ? 'Mon Espace' : 'Connexion'}</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* HERO SECTION + CASE CONNEXION RESTAURÉE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Description & Accompagnement vers la réussite */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1442] border border-[#5A33FF66] text-[#c4b5fd] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Intelligence Stratégique & Neuro-Comportementale · BehaviorLab AI</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[44px] font-black text-white tracking-tight leading-[1.15]">
              L'IA qui vous propulse vers la{' '}
              <span className="bg-gradient-to-r from-[#8B70FF] via-[#a78bfa] to-[#c4b5fd] bg-clip-text text-transparent">
                réussite concrète
              </span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Peu importe votre objectif — création de contenu percutant, production et montage vidéo 9:16, développement de code, rédaction stratégique ou concrétisation de vos ambitions quotidiennes — <span className="text-white font-semibold">Andrea s'adapte à votre vision</span> et vous accompagne pas à pas pour surmonter chaque blocage et atteindre un succès mesurable.
            </p>

            {/* Polyvalent Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#20174c] text-purple-300 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Accompagnement sur-mesure</div>
                  <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    S'aligne sur vos méthodes, votre ton et vos priorités d'action.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#20174c] text-sky-300 shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Création & Montage Vidéo</div>
                  <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Hooks accrocheurs, découpage en scènes et formats verticaux 9:16.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#20174c] text-emerald-300 shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Code & Outils Web</div>
                  <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Éditeur Python, conception de sites et automatisation fluide.
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#171038] border border-[#5A33FF33] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#20174c] text-amber-300 shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Passage à l'action garanti</div>
                  <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Clarté mentale, anti-procrastination et progression continue.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Case Connexion Restaurée */}
          <div className="lg:col-span-5" id="connexion">
            <div className="bg-[#171038] border border-[#5A33FF55] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-[#5A33FF33] pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span className="font-extrabold text-sm text-white">Espace Membre Andrea</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Actif
                </span>
              </div>

              {/* Tabs switcher: Se connecter / Créer un compte */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0f0b24] rounded-2xl border border-[#5A33FF33]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMsg(null);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
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
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                      : 'text-[#c4b5fd] hover:text-white'
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {/* Notification messages */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. SE CONNECTER FORM */}
              {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <div className="space-y-1.5">
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
                        className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b5fd] hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg shadow-[#5A33FF33] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Accéder à mon espace Andrea</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-center pt-1 text-[11px] text-[#c4b5fd]">
                    <span>Accès direct et sécurisé à votre espace et vos projets</span>
                  </div>
                </form>
              )}

              {/* 2. CRÉER UN COMPTE AVEC LES QUESTIONS DE PERSONNALISATION */}
              {authMode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
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
                      placeholder="Ex : Saydoukebe31, Alexandre, Marie..."
                      className="w-full bg-[#0f0b24] border border-[#5A33FF66] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white">Rôle principal</label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                      >
                        <option value="createur">Créateur de contenu</option>
                        <option value="developpeur">Développeur / Tech</option>
                        <option value="independant">Indépendant / Freelance</option>
                        <option value="entreprise">Entrepreneur / PME</option>
                        <option value="etudiant">Étudiant / Formation</option>
                        <option value="autre">Autre objectif</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white">Style préféré</label>
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                      >
                        <option value="expert">Expert & Stratégique</option>
                        <option value="bienveillant">Bienveillant & Motivant</option>
                        <option value="synthetique">Synthétique & Direct</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-white">Votre objectif principal</label>
                    <input
                      type="text"
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      placeholder="Ex : Réussir mes vidéos et lancer mes projets"
                      className="w-full bg-[#0f0b24] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg shadow-[#5A33FF33] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Créer mon compte et démarrer</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* SECTION POLYVALENCE & RÉUSSITE CONCRÈTE */}
        <section className="pt-6 border-t border-[#5A33FF33] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#8B70FF] uppercase tracking-wider">
              Polyvalence Totale
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Une intelligence artificielle conçue pour vous accompagner partout.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Qu'il s'agisse de réaliser des formats courts viraux, de développer des architectures complexes ou de structurer vos plans d'action, Andrea met à votre disposition les outils les plus performants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#150f33] border border-[#5A33FF44] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#20174c] text-purple-300 flex items-center justify-center font-bold">
                <Film className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="text-base font-bold text-white">Vidéo 9:16 & Montage Assisté</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Génération de concepts visuels, accroches percutantes, découpage de scènes automatique et sous-titres Whisper pour captiver l'attention dès les 3 premières secondes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#150f33] border border-[#5A33FF44] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#20174c] text-purple-300 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">Code Ultra & Solutions Web</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Éditeur Python avec exécution, génération de sites web réactifs en Tailwind et support pour transformer une simple idée en produit déployable.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#150f33] border border-[#5A33FF44] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#20174c] text-purple-300 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5 text-[#c4b5fd]" />
              </div>
              <h3 className="text-base font-bold text-white">Neuro-Productivité & Clarté</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Élimination de la surcharge cognitive, structuration d'objectifs journaliers et mémoire contextuelle continue pour ne plus jamais repartir de zéro.
              </p>
            </div>
          </div>
        </section>

        {/* ENGAGEMENT & SÉCURITÉ */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171038] to-[#20174c] border border-[#5A33FF44] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="text-sm font-extrabold text-white">
              Prêt à concrétiser vos projets avec Andrea ?
            </div>
            <p className="text-xs text-[#c4b5fd]">
              Connectez-vous avec votre compte ou créez votre profil en 30 secondes pour débuter.
            </p>
          </div>
          <a
            href="#connexion"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg shadow-[#5A33FF33] flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Accéder à Andrea</span>
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#5A33FF33] bg-[#0c081e] px-6 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Andrea · Intelligence Stratégique & Créative. Tous droits réservés.</p>
      </footer>
    </div>
  );
};
