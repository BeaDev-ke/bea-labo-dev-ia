import React from 'react';
import { Zap, ShieldCheck, LogOut, User, ArrowLeft } from 'lucide-react';

interface AndreaHeaderProps {
  onOpenProfile: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  userEmail: string;
  onNavigateHome?: () => void;
}

export const AndreaHeader: React.FC<AndreaHeaderProps> = ({
  onOpenProfile,
  onLogout,
  isLoggedIn,
  userEmail,
  onNavigateHome,
}) => {
  return (
    <header className="h-14 bg-[#0a0d1e] border-b border-[#1d254f] px-4 sm:px-6 flex items-center justify-between select-none z-30 shrink-0">
      {/* Left: Accueil Vitrine, Andrea Logo & Profil button */}
      <div className="flex items-center gap-3 sm:gap-6">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg hover:bg-[#161c3b] transition-colors cursor-pointer flex items-center gap-1.5 border border-[#1d254f]"
            title="Revenir sur la page vitrine d'accueil (/)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Accueil Vitrine</span>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <img
            src="/logo_andrea.svg"
            alt="Andrea Logo"
            className="w-7 h-7 rounded-xl object-contain drop-shadow"
          />
          <span className="font-extrabold text-base tracking-tight text-white">Andrea</span>
        </div>

        <button
          onClick={onOpenProfile}
          className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1 rounded-lg hover:bg-[#161c3b] transition-colors cursor-pointer flex items-center gap-1.5"
          title="Modifier les questions de personnalisation du prompt"
        >
          <User className="w-3.5 h-3.5 text-indigo-400" />
          <span>Profil</span>
        </button>
      </div>

      {/* Right status tokens, security, logout */}
      <div className="flex items-center gap-3 sm:gap-5 text-xs">
        {/* Tokens */}
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="hidden sm:inline text-slate-400">Tokens +0 série |</span>
          <span className="font-bold text-slate-100">10 000 restants</span>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Sécurisé</span>
        </div>

        {/* Logout / Login button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer font-medium pl-2 sm:pl-3 border-l border-[#1d254f]"
          title={isLoggedIn ? `Connecté (${userEmail}) - Déconnexion` : 'Se connecter'}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isLoggedIn ? 'Déconnexion' : 'Connexion'}</span>
        </button>
      </div>
    </header>
  );
};
