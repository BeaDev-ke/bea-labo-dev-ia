import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Wand2, 
  Code2, 
  FileCode, 
  Film,
  Lock,
  User,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { DevPortal } from './components/DevPortal';
import { DevLab } from './components/DevLab';
import { AndreaAppPreview } from './components/AndreaAppPreview';
import { AppPyViewer } from './components/AppPyViewer';
import { VisitorLanding } from './components/VisitorLanding';
import { FullScreenStudio } from './components/FullScreenStudio';
import { UserProfile } from './types/bea';

type MainView = 'visiteur' | 'prod' | 'studio' | 'portal' | 'lab' | 'code';

export default function App() {
  // Session state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('andrea_active_session');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  // Determine initial view from window.location.pathname
  const getInitialView = (): MainView => {
    if (typeof window === 'undefined') return 'visiteur';
    const path = window.location.pathname;

    if (path === '/portail-dev' || path.startsWith('/portail-dev')) {
      return 'portal';
    }
    if (path === '/studio') {
      return 'studio';
    }
    if (path === '/app') {
      return 'prod';
    }
    // Default on '/' is the Vitrine page with description and direct login
    return 'visiteur';
  };

  const [currentView, setCurrentView] = useState<MainView>(getInitialView);

  // Synchronize browser history and URL
  const navigateTo = (view: MainView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (view === 'portal' || view === 'lab' || view === 'code') {
        targetPath = '/portail-dev';
      } else if (view === 'studio') {
        targetPath = '/studio';
      } else if (view === 'prod') {
        targetPath = '/app';
      } else {
        targetPath = '/';
      }
      
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  // Listen to popstate (back / forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle successful login or account creation
  const handleEnterApp = (user?: UserProfile) => {
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('andrea_active_session', JSON.stringify(user));
    }
    navigateTo('prod');
  };

  // Handle sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('andrea_active_session');
    navigateTo('visiteur');
  };

  return (
    <div className="min-h-screen bg-[#181135] text-[#f5f3ff] flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Top Header / Navigation Bar (hidden in full-screen studio mode) */}
      {currentView !== 'studio' && (
        <header className="sticky top-0 z-50 bg-[#0d0d14]/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-3 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Logo & Identity */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigateTo('visiteur')}
                className="w-10 h-10 rounded-2xl bg-[#201844] border border-[#5A33FF44] flex items-center justify-center text-xl shadow-md hover:scale-105 transition-transform"
                title="Page d'accueil Andrea (/)"
              >
                🧠
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-white tracking-tight">Andrea</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#201844] text-[#c4b5fd] border border-[#5A33FF33]">
                    BehaviorLab AI
                  </span>
                  {currentUser && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {currentUser.displayName} ({currentUser.plan.toUpperCase()})
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#c4b5fd]">
                  Intelligence Stratégique & Créative
                </p>
              </div>
            </div>

            {/* Navigation Tabs aligned to the right with clear human labels */}
            <div className="flex items-center bg-[#18181b] border border-zinc-800 p-1 rounded-2xl shadow-sm gap-1 flex-wrap sm:ml-auto justify-end">
              {/* 1. Page Vitrine / Accueil (Default on /) */}
              <button
                onClick={() => navigateTo('visiteur')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'visiteur'
                    ? 'bg-[#2a2057] text-white shadow-sm border border-[#5A33FF66]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
                title="Page d'accueil avec description et connexion directe (/)"
              >
                <span>🏠 Accueil & Connexion</span>
              </button>

              {/* 2. Application Andrea en direct */}
              <button
                onClick={() => navigateTo('prod')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  currentView === 'prod'
                    ? 'bg-[#2a2057] text-white shadow-sm border border-[#5A33FF66]'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
                title="Accéder à l'application Andrea (/app)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>💬 App Andrea</span>
              </button>

              {/* 3. Studio Créateur Plein Écran */}
              <button
                onClick={() => navigateTo('studio')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-purple-950/40 text-purple-200 border border-purple-500/40 hover:bg-purple-900/50 hover:text-white"
                title="Ouvrir le Studio Créateur en Plein Écran"
              >
                <Film className="w-3.5 h-3.5 text-purple-300" />
                <span>🎨 Studio Visuel</span>
              </button>

              {/* 4. Portail Développeur (/portail-dev) */}
              <button
                onClick={() => navigateTo('portal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                  currentView === 'portal' || currentView === 'lab' || currentView === 'code'
                    ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
                title="Accéder au Portail Développeur (/portail-dev)"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>🛠️ Portail Dev (/portail-dev)</span>
              </button>

              {/* Sign out button if logged in */}
              {currentUser && (
                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 transition flex items-center gap-1"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full">
        {/* VIEW 1: VITRINE / ACCUEIL (DEFAULT SUR /) AVEC DESCRIPTION ET CONNEXION DE SUITE */}
        {currentView === 'visiteur' && (
          <div className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-4">
            <VisitorLanding 
              onEnterApp={handleEnterApp} 
              onOpenLab={() => navigateTo('lab')}
              onOpenStudio={() => navigateTo('studio')}
              onGoToDevPortal={() => navigateTo('portal')}
            />
          </div>
        )}

        {/* VIEW 2: APPLICATION FONCTIONNELLE ANDREA (/app) */}
        {currentView === 'prod' && (
          <div className="max-w-[1700px] mx-auto p-2 sm:p-4 md:p-6 space-y-3">
            <div className="flex items-center justify-between bg-[#15112a] border border-[#5A33FF44] p-3 rounded-2xl text-xs text-[#c4b5fd]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Connecté en tant que <strong>{currentUser?.preferredCallName || currentUser?.displayName || 'Membre Andrea'}</strong> ({currentUser?.email || 'client@andrea.ai'}). Formule : <strong>{currentUser?.plan ? currentUser.plan.toUpperCase() : 'BASIQUE'}</strong>.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateTo('studio')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 text-white font-bold text-xs transition flex items-center gap-1.5 border border-purple-500/50 shadow"
                >
                  <Film className="w-3.5 h-3.5 text-purple-300" />
                  <span>Studio Plein Écran</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-[#201844] hover:bg-rose-950/60 text-[#c4b5fd] hover:text-rose-200 text-xs font-semibold transition"
                >
                  Déconnexion
                </button>
              </div>
            </div>

            <AndreaAppPreview 
              onOpenLab={() => navigateTo('lab')} 
              onOpenStudio={() => navigateTo('studio')}
              onSignOut={handleSignOut}
              currentUser={currentUser || undefined}
            />
          </div>
        )}

        {/* VIEW 3: STUDIO CRÉATEUR PLEIN ÉCRAN (/studio) */}
        {currentView === 'studio' && (
          <FullScreenStudio onBackToApp={() => navigateTo('prod')} />
        )}

        {/* VIEW 4: PORTAIL DÉVELOPPEUR (/portail-dev) */}
        {currentView === 'portal' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between bg-[#18181b] border border-zinc-800 p-3 rounded-2xl text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-zinc-200 font-bold">/portail-dev</span>
                <span>· Portail Développeur & Outils d'Architecture Système</span>
              </div>
              <button
                onClick={() => navigateTo('visiteur')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition flex items-center gap-1.5 border border-zinc-700"
              >
                <span>← Retour au Site Principal (/)</span>
              </button>
            </div>

            <DevPortal
              onGoToProd={() => navigateTo('prod')}
              onGoToLab={() => navigateTo('lab')}
              onGoToCode={() => navigateTo('code')}
              onGoToVisitor={() => navigateTo('visiteur')}
            />
          </div>
        )}

        {/* VIEW 5: LABO DEV 8 NIVEAUX (/portail-dev#lab) */}
        {currentView === 'lab' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between bg-[#18181b] border border-zinc-800 p-3 rounded-2xl text-xs text-zinc-400">
              <span className="font-medium">
                Laboratoire de Modifications par Niveau (1 à 8) avec validation de syntaxe.
              </span>
              <button
                onClick={() => navigateTo('portal')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
              >
                ← Retour au Portail Dev
              </button>
            </div>

            <DevLab 
              onGoToProd={() => navigateTo('prod')}
              onViewFullCode={() => navigateTo('code')}
            />
          </div>
        )}

        {/* VIEW 6: CODE VIEWER */}
        {currentView === 'code' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between bg-[#18181b] border border-zinc-800 p-3 rounded-2xl text-xs text-zinc-400">
              <span className="font-medium">Inspecteur du fichier Python app.py</span>
              <button
                onClick={() => navigateTo('portal')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
              >
                ← Retour au Portail Dev
              </button>
            </div>
            <AppPyViewer />
          </div>
        )}
      </main>

      {/* Minimal Footer (hidden in full-screen studio) */}
      {currentView !== 'studio' && (
        <footer className="border-t border-[#5A33FF22] bg-[#100b24] py-4 px-6 text-center text-xs text-[#c4b5fd]/70 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>BehaviorLab AI · Système Andrea · Prêt pour déploiement Vercel</span>
            <div className="flex items-center gap-3">
              <button onClick={() => navigateTo('visiteur')} className="hover:text-white underline">
                Accueil (/)
              </button>
              <button onClick={() => navigateTo('studio')} className="hover:text-white underline">
                Studio Visuel (/studio)
              </button>
              <button onClick={() => navigateTo('portal')} className="hover:text-white underline">
                Portail Dev (/portail-dev)
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
