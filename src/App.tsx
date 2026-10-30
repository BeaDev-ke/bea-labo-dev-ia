import React, { useState, useEffect } from 'react';
import { 
  Lock
} from 'lucide-react';
import { DevPortal } from './components/DevPortal';
import { DevLab } from './components/DevLab';
import { AndreaAppPreview } from './components/AndreaAppPreview';
import { AppPyViewer } from './components/AppPyViewer';
import { VisitorLanding } from './components/VisitorLanding';
import { FullScreenStudio } from './components/FullScreenStudio';
import { UserProfile } from './types/bea';

type MainView = 'visiteur' | 'prod' | 'studio' | 'portal' | 'lab' | 'code';

// Purge immédiate et irréversible de tout vestige du client test Alexandre
if (typeof window !== 'undefined') {
  try {
    const keys = [
      'andrea_active_session',
      'andrea_user_profile_secure',
      'bea_user_profile_secure',
      'andrea_users_db',
      'andrea_chat_sessions'
    ];
    for (const k of keys) {
      const val = localStorage.getItem(k);
      if (val && (val.toLowerCase().includes('alexandre') || val.toLowerCase().includes('alex'))) {
        if (k === 'andrea_users_db') {
          try {
            const db = JSON.parse(val);
            let modified = false;
            for (const key of Object.keys(db)) {
              if (
                key.toLowerCase().includes('alex') || 
                db[key]?.displayName?.toLowerCase().includes('alex') || 
                db[key]?.preferredCallName?.toLowerCase().includes('alex')
              ) {
                delete db[key];
                modified = true;
              }
            }
            if (modified) {
              localStorage.setItem(k, JSON.stringify(db));
            }
          } catch {
            localStorage.removeItem(k);
          }
        } else {
          localStorage.removeItem(k);
        }
      }
    }
  } catch {}
}

export default function App() {
  // Session state (garanti sans aucun client test Alexandre)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('andrea_active_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed?.displayName?.toLowerCase().includes('alex') || 
          parsed?.preferredCallName?.toLowerCase().includes('alex') ||
          parsed?.email?.toLowerCase().includes('alex')
        ) {
          localStorage.removeItem('andrea_active_session');
          return null;
        }
        return parsed;
      }
    } catch {}
    return null;
  });

  // Strict Developer Admin verification
  const isDevAdmin = currentUser?.email?.toLowerCase().trim() === 'saydoukebe31@gmail.com';

  // Determine initial view from window.location.pathname
  // "/" -> Vitrine (Accueil par défaut)
  // "/portail-dev" -> Portail Développeur
  const getInitialView = (): MainView => {
    if (typeof window === 'undefined') return 'visiteur';
    const path = window.location.pathname;
    if (path === '/portail-dev' || path.startsWith('/portail-dev') || path === '/portal') {
      return 'portal';
    }
    if (path === '/studio') {
      return 'studio';
    }
    if (path === '/app') {
      return 'prod';
    }
    // Default on '/' is ALWAYS the Vitrine page
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
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Handle browser back/forward buttons
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
      // Éviter tout enregistrement d'Alexandre
      if (!user.displayName?.toLowerCase().includes('alex') && !user.email?.toLowerCase().includes('alex')) {
        setCurrentUser(user);
        try {
          localStorage.setItem('andrea_active_session', JSON.stringify(user));
        } catch {}
      }
    }
    navigateTo('prod');
  };

  // Handle sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('andrea_active_session');
    navigateTo('visiteur');
  };

  const isFullScreenApp = currentView === 'prod' || currentView === 'studio';

  return (
    <div className={`bg-[#181135] text-[#f5f3ff] flex flex-col font-sans selection:bg-purple-900 selection:text-white ${
      isFullScreenApp ? 'h-screen overflow-hidden' : 'min-h-screen'
    }`}>
      {/* Main Container */}
      <main className={`flex-1 w-full ${currentView === 'prod' ? 'h-full overflow-hidden' : ''}`}>
        {/* VIEW 1: VITRINE / ACCUEIL (PAR DÉFAUT SUR "/") */}
        {currentView === 'visiteur' && (
          <div className="max-w-7xl mx-auto p-3 sm:p-6 md:p-8 space-y-4">
            <VisitorLanding 
              onEnterApp={handleEnterApp} 
              onOpenLab={() => navigateTo('lab')}
              onGoToDevPortal={() => navigateTo('portal')}
            />
          </div>
        )}

        {/* VIEW 2: APPLICATION FONCTIONNELLE ANDREA (/app) */}
        {currentView === 'prod' && (
          <div className="h-full w-full flex flex-col overflow-hidden">
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

        {/* VIEW 4: PORTAIL DÉVELOPPEUR DÉPLACÉ SUR "/portail-dev" */}
        {currentView === 'portal' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between bg-[#18181b] border border-zinc-800 p-3 rounded-2xl text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-zinc-200 font-bold">/portail-dev</span>
                <span>· Portail Développeur & Architecture Système (BehaviorLab AI)</span>
              </div>
              <button
                onClick={() => navigateTo('visiteur')}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition flex items-center gap-1.5 border border-zinc-700"
              >
                <span>← Retour à la Vitrine (/)</span>
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
            {isDevAdmin ? (
              <>
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
              </>
            ) : (
              <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#140e2e] border border-[#5A33FF55] text-center space-y-4 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center mx-auto text-2xl">
                  <Lock className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Accès Restreint</h3>
                <p className="text-xs text-[#c4b5fd]">
                  Réservé au compte développeur <strong>saydoukebe31@gmail.com</strong>.
                </p>
                <button
                  onClick={() => navigateTo('visiteur')}
                  className="px-5 py-2.5 rounded-xl bg-[#5A33FF] text-white text-xs font-bold transition mx-auto"
                >
                  Retour à l'accueil
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: CODE VIEWER */}
        {currentView === 'code' && (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
            {isDevAdmin ? (
              <>
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
              </>
            ) : (
              <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#140e2e] border border-[#5A33FF55] text-center space-y-4 shadow-2xl">
                <h3 className="text-xl font-extrabold text-white">Accès Restreint</h3>
                <button
                  onClick={() => navigateTo('visiteur')}
                  className="px-5 py-2.5 rounded-xl bg-[#5A33FF] text-white text-xs font-bold transition mx-auto"
                >
                  Retour à l'accueil
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer épuré avec lien discret vers le Portail Dev */}
      {currentView === 'visiteur' && (
        <footer className="border-t border-[#5A33FF22] bg-[#100b24] py-4 px-6 text-center text-xs text-[#c4b5fd]/70 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Système Andrea · BehaviorLab AI</span>
            <div className="flex items-center gap-3">
              <button onClick={() => navigateTo('visiteur')} className="hover:text-white underline">
                Vitrine Accueil (/)
              </button>
              <button onClick={() => navigateTo('portal')} className="text-zinc-500 hover:text-zinc-300 transition">
                Accès Portail Dev (/portail-dev)
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
