import React from 'react';
import { Zap, ShieldCheck, LogOut, User, ArrowLeft, Sun, Moon } from 'lucide-react';
import { AppTheme } from '../types';

interface AndreaHeaderProps {
  onOpenProfile: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  userEmail: string;
  onNavigateHome?: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const AndreaHeader: React.FC<AndreaHeaderProps> = ({
  onOpenProfile,
  onLogout,
  isLoggedIn,
  userEmail,
  onNavigateHome,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="h-14 bg-[#0a0d1e] border-b border-[#1d254f] px-2.5 sm:px-6 flex items-center justify-between gap-2 select-none z-30 shrink-0 overflow-hidden">
      {/* Left: Accueil Vitrine, Andrea Logo & Profil button */}
      <div className="flex items-center gap-1.5 sm:gap-5 min-w-0">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="text-xs font-semibold text-slate-300 hover:text-white p-1.5 sm:px-2.5 sm:py-1 rounded-lg hover:bg-[#161c3b] transition-colors cursor-pointer flex items-center gap-1.5 border border-[#1d254f] whitespace-nowrap shrink-0"
            title="Revenir sur la page vitrine d'accueil (/)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="hidden md:inline">Accueil Vitrine</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <img
            src="/logo_andrea.svg"
            alt="Andrea"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
          />
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">Andrea</span>
        </div>

        <button
          onClick={onOpenProfile}
          className="text-xs font-semibold text-slate-300 hover:text-white px-2 sm:px-3 py-1 rounded-lg hover:bg-[#161c3b] transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
          title="Modifier les questions de personnalisation du prompt"
        >
          <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="hidden xs:inline sm:inline">Profil</span>
        </button>
      </div>

      {/* Right status tokens, security, Clair/Sombre toggle, logout */}
      <div className="flex items-center gap-1.5 sm:gap-3.5 text-xs shrink-0">
        {/* Tokens */}
        <div className="flex items-center gap-1 text-slate-300 font-medium shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
          <span className="hidden lg:inline text-slate-400">Tokens +0 série |</span>
          <span className="font-bold text-slate-100 tabular-nums text-[11px] sm:text-xs">
            10 000<span className="hidden md:inline"> restants</span>
          </span>
        </div>

        {/* Security badge */}
        <div className="hidden md:flex items-center gap-1.5 text-emerald-400 font-semibold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">Sécurisé</span>
        </div>

        {/* Light / Dark Toggle right before Déconnexion */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-[#1d254f] bg-[#141b3d] hover:bg-[#1e2959] text-slate-200 font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          title={theme === 'dark' ? 'Passer au mode Clair' : 'Passer au mode Sombre'}
          aria-label={theme === 'dark' ? 'Passer au mode Clair' : 'Passer au mode Sombre'}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Clair</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline">Sombre</span>
            </>
          )}
        </button>

        {/* Logout / Login button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer font-medium pl-1.5 sm:pl-3 border-l border-[#1d254f] whitespace-nowrap shrink-0"
          title={isLoggedIn ? `Connecté (${userEmail}) - Déconnexion` : 'Se connecter'}
          aria-label={isLoggedIn ? 'Déconnexion' : 'Connexion'}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">{isLoggedIn ? 'Déconnexion' : 'Connexion'}</span>
        </button>
      </div>
    </header>
  );
};
