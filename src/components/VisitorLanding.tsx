import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  User, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Check, 
  Film, 
  Code2, 
  ShieldCheck, 
  Shield, 
  Zap,
  HelpCircle,
  Clock,
  Compass,
  Smile
} from 'lucide-react';
import { UserProfile, ProfileType, UseCaseType } from '../types/bea';
import { SALES_PLANS } from '../data/profilesData';

interface VisitorLandingProps {
  onEnterApp: (user?: UserProfile) => void;
  onOpenLab: () => void;
  onOpenStudio?: () => void;
  onGoToDevPortal?: () => void;
}

export const VisitorLanding: React.FC<VisitorLandingProps> = ({ 
  onEnterApp, 
  onOpenLab,
  onOpenStudio,
  onGoToDevPortal
}) => {
  // Auth Form State (Active on arrival on "/" as requested)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferredCallName, setPreferredCallName] = useState('');
  const [selectedRole, setSelectedRole] = useState<ProfileType>('createur');
  const [selectedGoal, setSelectedGoal] = useState('Passer à l\'action et concrétiser mes projets.');
  const [biggestChallenge, setBiggestChallenge] = useState('Vaincre la procrastination et démarrer sans hésiter.');
  const [preferredStyle, setPreferredStyle] = useState<'expert' | 'bienveillant' | 'synthetique'>('expert');
  const [selectedPlan, setSelectedPlan] = useState<'basique' | 'pro' | 'ultra'>('basique');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Payment Simulation State (Basique 9€, Pro 14.90€, Ultra 18€)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Active view tab in landing (defaults to 'home')
  const [landingSection, setLandingSection] = useState<'home' | 'offers' | 'about'>('home');

  const getPlanPriceLabel = (plan: 'basique' | 'pro' | 'ultra'): string => {
    switch (plan) {
      case 'basique': return '9 €/mois';
      case 'pro': return '14,90 €/mois';
      case 'ultra': return '18 €/mois';
      default: return '9 €/mois';
    }
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('andrea_users_db');
      const users: Record<string, UserProfile & { passwordHash?: string }> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
      
      const foundUser = users[email.trim().toLowerCase()];
      if (foundUser) {
        setAuthSuccess(`Bienvenue de retour, ${foundUser.preferredCallName || foundUser.displayName} !`);
        localStorage.setItem('andrea_active_session', JSON.stringify(foundUser));
        localStorage.setItem('andrea_user_profile_secure', JSON.stringify(foundUser));
        setTimeout(() => {
          onEnterApp(foundUser);
        }, 500);
        return;
      }

      // If user doesn't exist yet, automatically create an instant profile
      const derivedName = email.split('@')[0].replace(/[._-]/g, ' ');
      const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        displayName: capitalized || 'Membre Andrea',
        preferredCallName: capitalized || 'Membre Andrea',
        email: email.trim().toLowerCase(),
        profileType: 'createur',
        useCase: 'contenu',
        goal: 'Créer du contenu percutant et structurer mes projets.',
        biggestChallenge: 'Vaincre la procrastination et passer à l\'action.',
        preferredStyle: 'expert',
        plan: 'basique',
        lastActive: 'À l\'instant',
        streakDays: 1,
        momentumPoints: 50,
      };

      users[newUser.email] = newUser;
      localStorage.setItem('andrea_users_db', JSON.stringify(users));
      localStorage.setItem('andrea_active_session', JSON.stringify(newUser));
      localStorage.setItem('andrea_user_profile_secure', JSON.stringify(newUser));

      setAuthSuccess(`Compte créé avec succès ! Bienvenue, ${newUser.preferredCallName}.`);
      setTimeout(() => {
        onEnterApp(newUser);
      }, 500);
    } catch {
      onEnterApp();
    }
  };

  // Handle Register Initiation
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim() || !fullName.trim()) {
      setAuthError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    // Propose payment modal for selected plan, while allowing free immediate access inside modal
    setShowPaymentModal(true);
  };

  // Finalize Registration (With or without card payment)
  const finalizeAccountCreation = (plan: 'basique' | 'pro' | 'ultra', paid: boolean) => {
    const cleanName = fullName.trim();
    const cleanCallName = preferredCallName.trim() || cleanName.split(' ')[0] || cleanName;
    const cleanEmail = email.trim().toLowerCase();

    const roleToUseCase: Record<ProfileType, UseCaseType> = {
      createur: 'contenu',
      etudiant: 'scolaire',
      independant: 'clients',
      entreprise: 'general',
      developpeur: 'code',
      salarie: 'general',
      recherche_emploi: 'general',
      parent: 'scolaire',
      enseignant: 'scolaire',
      autre: 'general'
    };

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      displayName: cleanName,
      preferredCallName: cleanCallName,
      email: cleanEmail,
      profileType: selectedRole,
      useCase: roleToUseCase[selectedRole] || 'general',
      goal: selectedGoal || 'Concrétiser mes projets et avancer sans blocage.',
      biggestChallenge: biggestChallenge || 'Démarrer et maintenir un bon rythme.',
      preferredStyle: preferredStyle || 'expert',
      plan: plan,
      lastActive: 'À l\'instant',
      streakDays: 1,
      momentumPoints: paid ? 150 : 60,
    };

    try {
      const storedUsersRaw = localStorage.getItem('andrea_users_db');
      const users: Record<string, UserProfile> = storedUsersRaw ? JSON.parse(storedUsersRaw) : {};
      users[cleanEmail] = newUser;
      localStorage.setItem('andrea_users_db', JSON.stringify(users));
      localStorage.setItem('andrea_active_session', JSON.stringify(newUser));
      localStorage.setItem('andrea_user_profile_secure', JSON.stringify(newUser));
    } catch {}

    setShowPaymentModal(false);
    setAuthSuccess(`Bienvenue ${cleanCallName} ! Votre espace Andrea est prêt.`);
    setTimeout(() => {
      onEnterApp(newUser);
    }, 500);
  };

  // Guest instant access for testing
  const handleGuestAccess = () => {
    const guestUser: UserProfile = {
      id: `usr-invite-${Date.now()}`,
      displayName: 'Invité',
      preferredCallName: 'Invité',
      email: 'invite@andrea.ai',
      profileType: 'createur',
      useCase: 'contenu',
      goal: 'Découvrir la méthode comportementale Andrea et créer des visuels.',
      biggestChallenge: 'Passer à l\'action immédiatement.',
      preferredStyle: 'expert',
      plan: 'pro',
      lastActive: 'À l\'instant',
      streakDays: 1,
      momentumPoints: 50,
    };
    onEnterApp(guestUser);
  };

  return (
    <div className="min-h-[85vh] flex flex-col bg-[#140e2d] text-[#f5f3ff] rounded-3xl overflow-hidden border border-[#5A33FF33] shadow-2xl">
      {/* Top Banner Navigation */}
      <div className="bg-[#100b24] px-4 sm:px-8 py-3.5 border-b border-[#5A33FF33] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#201844] border border-[#5A33FF55] flex items-center justify-center text-xl shadow-md">
            🧠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white tracking-tight">Andrea</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd] border border-[#5A33FF44]">
                BehaviorLab AI
              </span>
            </div>
            <p className="text-[11px] text-[#c4b5fd]">
              Intelligence Stratégique & Créative
            </p>
          </div>
        </div>

        {/* Quick actions on header */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setLandingSection('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              landingSection === 'home'
                ? 'bg-[#231a4a] text-white border border-[#5A33FF]'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
          >
            Accueil & Connexion
          </button>

          <button
            onClick={() => setLandingSection('offers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              landingSection === 'offers'
                ? 'bg-[#231a4a] text-white border border-[#5A33FF]'
                : 'text-[#c4b5fd] hover:text-white hover:bg-[#201844]'
            }`}
          >
            Formules & Tarifs
          </button>




        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-10">
        {/* HERO SECTION WITH DIRECT AUTHENTICATION / REGISTRATION */}
        {landingSection === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Left Column: Clear Presentation & Description */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#201844] border border-[#5A33FF55] text-[#c4b5fd] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Plateforme officielle Andrea · Version 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                L'intelligence qui transforme vos idées en <span className="bg-gradient-to-r from-[#8B70FF] to-[#c4b5fd] bg-clip-text text-transparent">actions concrètes</span>.
              </h1>

              <p className="text-sm sm:text-base text-[#c4b5fd] leading-relaxed max-w-xl">
                Conçue par <strong>BehaviorLab AI</strong>, Andrea s'adapte à votre profil et vous appelle directement par votre prénom. Que vous soyez <strong>créateur de contenu</strong>, <strong>lycéen ou étudiant</strong>, <strong>freelance</strong> ou <strong>entrepreneur</strong>, découvrez des conseils clairs, un studio de création visuelle et un accompagnement sans stress.
              </p>

              {/* Direct guest preview button */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleGuestAccess}
                  className="px-4 py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2d2160] text-white border border-[#5A33FF55] text-xs font-bold transition flex items-center gap-2 shadow"
                >
                  <span>Tester sans inscription (Mode Invité)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>


              </div>
            </div>

            {/* Right Column: Direct Login / Register Box (PAS CACHÉ, PRÉSENT DE SUITE !) */}
            <div className="lg:col-span-5">
              <div className="bg-[#1b143c] border border-[#5A33FF55] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
                {/* Tabs switcher: Se connecter / Créer un compte */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#100b24] rounded-2xl border border-[#5A33FF33]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      authMode === 'login'
                        ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                        : 'text-[#c4b5fd] hover:text-white'
                    }`}
                  >
                    Se connecter
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError(null);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      authMode === 'register'
                        ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow'
                        : 'text-[#c4b5fd] hover:text-white'
                    }`}
                  >
                    Créer un compte
                  </button>
                </div>

                {/* Notifications */}
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 text-rose-200 text-xs">
                    {authError}
                  </div>
                )}
                {authSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{authSuccess}</span>
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
                        onChange={e => setEmail(e.target.value)}
                        placeholder="votre.email@exemple.com"
                        className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
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
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF] pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4b5fd] hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01]"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Accéder à mon espace Andrea</span>
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode('register')}
                        className="text-xs text-[#c4b5fd] hover:text-white underline"
                      >
                        Pas encore de compte ? S'inscrire
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. CRÉER UN COMPTE FORM AVEC LES QUESTIONS DE PROFIL COMPLÈTES */}
                {authMode === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    {/* Question clé : Nom par lequel Andrea appelle le client */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5 text-purple-400" />
                        <span>Comment Andrea doit-elle vous appeler ?</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={preferredCallName}
                        onChange={e => {
                          setPreferredCallName(e.target.value);
                          if (!fullName) setFullName(e.target.value);
                        }}
                        placeholder="Ex : Marie, Thomas, Alex..."
                        className="w-full bg-[#120d28] border border-[#5A33FF66] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white">Nom complet</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="Ex : Marie Dupont"
                        className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-white">Adresse e-mail</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="votre.email@exemple.com"
                          className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-white">Mot de passe</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="6 caractères min."
                          className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3 py-2 text-xs text-white placeholder-[#c4b5fd]/40 focus:outline-none focus:border-[#8B70FF]"
                        />
                      </div>
                    </div>

                    {/* Questions de profil : Profil principal */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        <span>Votre profil principal</span>
                      </label>
                      <select
                        value={selectedRole}
                        onChange={e => setSelectedRole(e.target.value as ProfileType)}
                        className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                      >
                        <option value="createur">🎬 Créateur de Contenu & Vidéaste</option>
                        <option value="etudiant">🎓 Lycéen ou Étudiant (Devoirs & Révisions)</option>
                        <option value="independant">💼 Indépendant, Freelance ou Coach</option>
                        <option value="entreprise">🏢 Entrepreneur ou Dirigeant</option>
                        <option value="developpeur">💻 Développeur & Tech Builder</option>
                        <option value="salarie">🧑‍💼 Salarié & Évolution de carrière</option>
                      </select>
                    </div>

                    {/* Question de profil : Objectif prioritaire */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-purple-400" />
                        <span>Votre objectif prioritaire</span>
                      </label>
                      <select
                        value={selectedGoal}
                        onChange={e => setSelectedGoal(e.target.value)}
                        className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                      >
                        <option value="Passer à l'action et vaincre la procrastination.">Vaincre la procrastination & passer à l'action immédiate</option>
                        <option value="Créer du contenu régulier et booster mon audience.">Publier du contenu régulier & développer mon audience</option>
                        <option value="Réussir mes cours et mes examens sereinement.">Réussir mes cours & examens sans surcharge mentale</option>
                        <option value="Trouver des clients et signer des devis.">Trouver des clients et développer mes ventes</option>
                        <option value="Concevoir et coder mes applications rapidement.">Développer et coder mes applications plus vite</option>
                      </select>
                    </div>

                    {/* Question de profil : Plus grand défi */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>Votre plus grand défi actuel</span>
                      </label>
                      <select
                        value={biggestChallenge}
                        onChange={e => setBiggestChallenge(e.target.value)}
                        className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8B70FF]"
                      >
                        <option value="Démarrer la tâche sans remettre au lendemain.">Démarrer la tâche sans remettre au lendemain</option>
                        <option value="Trop d'idées en tête et dispersion mentale.">Trop d'idées en tête et dispersion mentale</option>
                        <option value="Manque de temps et surcharge d'urgences.">Manque de temps et surcharge au quotidien</option>
                        <option value="Peur de mal faire et perfectionnisme bloquant.">Peur de mal faire et perfectionnisme bloquant</option>
                      </select>
                    </div>

                    {/* Choix de la formule avec les tarifs demandés : Basique 9€, Pro 14.90€, Ultra 18€ */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-semibold text-white flex items-center justify-between">
                        <span>Formule choisie</span>
                        <span className="text-[10px] text-emerald-400">Sans engagement</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPlan('basique')}
                          className={`p-2 rounded-xl text-left border transition ${
                            selectedPlan === 'basique'
                              ? 'bg-[#231a4a] border-[#5A33FF] ring-1 ring-purple-400'
                              : 'bg-[#120d28] border-[#5A33FF22] text-[#c4b5fd]'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-white">Basique</div>
                          <div className="text-xs font-extrabold text-purple-300">9 €/m</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPlan('pro')}
                          className={`p-2 rounded-xl text-left border transition ${
                            selectedPlan === 'pro'
                              ? 'bg-[#231a4a] border-[#5A33FF] ring-1 ring-purple-400'
                              : 'bg-[#120d28] border-[#5A33FF22] text-[#c4b5fd]'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-white">Pro</div>
                          <div className="text-xs font-extrabold text-emerald-400">14,90 €/m</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPlan('ultra')}
                          className={`p-2 rounded-xl text-left border transition ${
                            selectedPlan === 'ultra'
                              ? 'bg-[#231a4a] border-[#5A33FF] ring-1 ring-purple-400'
                              : 'bg-[#120d28] border-[#5A33FF22] text-[#c4b5fd]'
                          }`}
                        >
                          <div className="text-[10px] font-bold text-white">Ultra</div>
                          <div className="text-xs font-extrabold text-amber-300">18 €/m</div>
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 space-y-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01]"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Créer mon compte & Choisir {selectedPlan.toUpperCase()} ({getPlanPriceLabel(selectedPlan)})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => finalizeAccountCreation('basique', false)}
                        className="w-full py-2 rounded-xl bg-transparent hover:bg-[#201844] text-[#c4b5fd] hover:text-white border border-[#5A33FF33] text-xs font-medium transition"
                      >
                        Tester immédiatement sans payer (Accès libre)
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: FORMULES & TARIFS OFFICIELLES (BASIQUE 9€, PRO 14.90€, ULTRA 18€) */}
        {landingSection === 'offers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Tarification Officielle
              </span>
              <h2 className="text-3xl font-extrabold text-white">Choisissez la formule adaptée à votre rythme</h2>
              <p className="text-xs text-[#c4b5fd] max-w-lg mx-auto">
                Des tarifs clairs et sans surprise. Testez librement ou débloquez l'arsenal créatif complet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Plan 1: Andrea Basique - 9 € */}
              <div className="bg-[#1b143c] border border-[#5A33FF33] rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">Andrea Basique</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd]">Essentiel</span>
                  </div>
                  <div className="text-3xl font-black text-white">9 € <span className="text-xs font-normal text-[#c4b5fd]">/mois</span></div>
                  <p className="text-xs text-[#c4b5fd] leading-relaxed">
                    Le déclencheur d’action quotidien pour vaincre la procrastination et échanger avec Andrea.
                  </p>
                  <ul className="space-y-2 text-xs text-[#e2d6ff] pt-3 border-t border-[#5A33FF22]">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Humaniseur de texte chaleureux & personnel</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Synthèse vocale 100% gratuite</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Plans d'action en 3 étapes directes</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Accès sans engagement, résiliation en 1 clic</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan('basique');
                    setAuthMode('register');
                    setLandingSection('home');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2d2160] text-white font-bold text-xs transition border border-[#5A33FF55]"
                >
                  Choisir Andrea Basique (9 €)
                </button>
              </div>

              {/* Plan 2: Andrea Pro - 14,90 € (Mise en avant) */}
              <div className="bg-[#1f1647] border-2 border-[#8B70FF] rounded-3xl p-6 flex flex-col justify-between space-y-5 relative shadow-2xl scale-[1.02]">
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow">
                  LE PLUS POPULAIRE
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">Andrea Pro</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Populaire</span>
                  </div>
                  <div className="text-3xl font-black text-white">14,90 € <span className="text-xs font-normal text-[#c4b5fd]">/mois</span></div>
                  <p className="text-xs text-[#c4b5fd] leading-relaxed">
                    L'arsenal complet pour créateurs, étudiants et indépendants voulant produire sans interruption.
                  </p>
                  <ul className="space-y-2 text-xs text-[#e2d6ff] pt-3 border-t border-[#5A33FF44]">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Tout ce qui est dans Andrea Basique</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-300" /> Outil de Montage Vidéo & Visuels (tous formats)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-300" /> Téléchargements d'images HD sans filigrane</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-300" /> Compteur de série & dynamique positive</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-300" /> Analyses psychologiques et objections clients</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan('pro');
                    setAuthMode('register');
                    setLandingSection('home');
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg"
                >
                  Choisir Andrea Pro (14,90 €)
                </button>
              </div>

              {/* Plan 3: Andrea Ultra - 18 € */}
              <div className="bg-[#1b143c] border border-[#5A33FF33] rounded-3xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">Andrea Ultra</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Illimité</span>
                  </div>
                  <div className="text-3xl font-black text-white">18 € <span className="text-xs font-normal text-[#c4b5fd]">/mois</span></div>
                  <p className="text-xs text-[#c4b5fd] leading-relaxed">
                    Puissance maximale pour générer des sites web en 1 prompt et coder sans aucune limite.
                  </p>
                  <ul className="space-y-2 text-xs text-[#e2d6ff] pt-3 border-t border-[#5A33FF22]">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Tout ce qui est dans Andrea Pro</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> Bâtisseur de Sites Web en 1 clic</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> Éditeur de Code IA & Débogueur</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-300" /> Support prioritaire VIP</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan('ultra');
                    setAuthMode('register');
                    setLandingSection('home');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#231a4a] hover:bg-[#2d2160] text-white font-bold text-xs transition border border-[#5A33FF55]"
                >
                  Choisir Andrea Ultra (18 €)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE PAIEMENT SÉCURISÉ (BASIQUE 9€, PRO 14.90€, ULTRA 18€) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1b143c] border border-[#5A33FF66] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base text-white">Validation de votre formule</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-xs text-[#c4b5fd] hover:text-white"
              >
                Fermer
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#140e2d] border border-[#5A33FF33] space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c4b5fd]">Formule sélectionnée :</span>
                <span className="font-bold text-white uppercase">
                  Andrea {selectedPlan} ({getPlanPriceLabel(selectedPlan)})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c4b5fd]">Appelé au quotidien :</span>
                <span className="font-semibold text-white">« {preferredCallName || fullName} »</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white">Numéro de carte</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#8B70FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">Expiration</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#8B70FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    className="w-full bg-[#120d28] border border-[#5A33FF44] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#8B70FF]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                disabled={isProcessingPayment}
                onClick={() => {
                  setIsProcessingPayment(true);
                  setTimeout(() => {
                    finalizeAccountCreation(selectedPlan, true);
                    setIsProcessingPayment(false);
                  }, 800);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] hover:from-[#2a24bf] hover:to-[#7048ff] text-white font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span>Validation sécurisée en cours...</span>
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Confirmer et Activer ({getPlanPriceLabel(selectedPlan)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => finalizeAccountCreation(selectedPlan, false)}
                className="w-full py-2 rounded-xl bg-transparent hover:bg-[#201844] text-[#c4b5fd] hover:text-white text-xs font-medium transition"
              >
                Ou activer en mode découverte sans payer maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
