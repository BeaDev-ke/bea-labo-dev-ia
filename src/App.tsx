import React, { useState, useEffect } from 'react';
import { AndreaHeader } from './components/AndreaHeader';
import { AndreaSidebar, MainNavTab } from './components/AndreaSidebar';
import { AndreaChat } from './components/AndreaChat';
import { MontageStudio } from './components/MontageStudio';
import { CodeUltraView } from './components/CodeUltraView';
import { AccountPage } from './components/AccountPage';
import { MemoryPage } from './components/MemoryPage';
import { AIParametersPage } from './components/AIParametersPage';
import { DevLab } from './components/DevLab';
import { OnboardingModal } from './components/OnboardingModal';
import { VitrinePage } from './components/VitrinePage';
import { UserPreferences, PlanType, AIParameters } from './types';

export default function App() {
  // Session Persistence: Refreshing does NOT log the user out
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('andrea_logged_in');
      if (stored === 'false') return false;
      return true; // Reconnexion automatique par défaut
    }
    return true;
  });

  // Routing: Reconnexion automatique active -> arrivée DIRECTE sur la discussion
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('andrea_logged_in');
      if (stored === 'false') {
        return window.location.pathname.startsWith('/portail-dev') ? '/portail-dev' : '/';
      }
      // Arrivée directe sur le workspace et la discussion
      return '/portail-dev';
    }
    return '/portail-dev';
  });

  // User Authentication State
  const [userEmail, setUserEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('andrea_user_email') || 'saydoukebe31@gmail.com';
    }
    return 'saydoukebe31@gmail.com';
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('andrea_preferences');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      displayName: 'Saydoukebe31',
      profile: 'createur',
      tone: 'expert',
      objective: 'Publier chaque jour sans blocage de montage et maximiser la rétention',
    };
  });

  const [plan, setPlan] = useState<PlanType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('andrea_plan') as PlanType) || 'free';
    }
    return 'free';
  });

  const [aiParams, setAiParams] = useState<AIParameters>({
    modelSpeed: 'puissant',
    creativity: 0.7,
    useMemory: true,
    hfToken: '',
  });

  // Navigation State inside Portail Dev
  const [activeTab, setActiveTab] = useState<MainNavTab>('discussion');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [chatKey, setChatKey] = useState(1);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.startsWith('/portail-dev') ? '/portail-dev' : '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string, tab?: MainNavTab) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    if (tab) {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save changes to localStorage & log in
  const handleSavePreferences = (email: string, newPrefs: UserPreferences, newPlan: PlanType) => {
    setUserEmail(email);
    setPreferences(newPrefs);
    setPlan(newPlan);
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('andrea_user_email', email);
      localStorage.setItem('andrea_preferences', JSON.stringify(newPrefs));
      localStorage.setItem('andrea_plan', newPlan);
      localStorage.setItem('andrea_logged_in', 'true');
    }
  };

  // Logout sends the user directly to the Vitrine page at "/"
  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('andrea_logged_in', 'false');
    }
    navigateTo('/');
  };

  const handleNewChat = () => {
    setChatKey((prev) => prev + 1);
    setActiveTab('discussion');
  };

  // Check if current user is admin
  const isDevAdmin = userEmail.trim().toLowerCase() === 'saydoukebe31@gmail.com';

  // PAGE 1: Vitrine by default on "/"
  if (currentPath === '/') {
    return (
      <div className="min-h-screen bg-[#0d091e] text-slate-100 font-sans antialiased selection:bg-[#5A33FF] selection:text-white">
        <VitrinePage
          onLogin={(email, newPrefs, newPlan) => {
            handleSavePreferences(email, newPrefs || preferences, newPlan || plan);
            navigateTo('/portail-dev');
          }}
          savedEmail={userEmail}
          savedPreferences={preferences}
          isLoggedIn={isLoggedIn}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          currentEmail={userEmail}
          preferences={preferences}
          currentPlan={plan}
          onSave={handleSavePreferences}
        />
      </div>
    );
  }

  // PAGE 2: Portail Dev on "/portail-dev"
  return (
    <div className="min-h-screen bg-[#070914] text-slate-100 flex flex-col font-sans antialiased selection:bg-[#3b82f6] selection:text-white">
      {/* Top Header matching Photos */}
      <AndreaHeader
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onNavigateHome={() => navigateTo('/')}
      />

      {/* Main Layout: Sidebar on Left, Content on Right */}
      <div className="flex-1 flex overflow-hidden">
        <AndreaSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onNewChat={handleNewChat}
          displayName={preferences.displayName}
          plan={plan}
          userEmail={userEmail}
          onOpenDevLab={() => setActiveTab('dev_lab')}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar bg-[#090d1f]">
          {activeTab === 'discussion' && (
            <AndreaChat
              key={chatKey}
              userProfile={preferences.profile}
              displayName={preferences.displayName}
            />
          )}

          {activeTab === 'montage' && <MontageStudio />}

          {activeTab === 'code' && <CodeUltraView />}

          {activeTab === 'tarifs' && (
            <AccountPage
              currentPlan={plan}
              onUpgrade={(newPlan) => setPlan(newPlan)}
              chatUsed={42}
              chatLimit={1000}
              codeUsed={18}
              codeLimit={150}
              onClearHistory={() => alert('Historique effacé.')}
            />
          )}

          {activeTab === 'memoire' && (
            <MemoryPage
              preferences={preferences}
              plan={plan}
              onOpenEditModal={() => setIsOnboardingOpen(true)}
            />
          )}

          {activeTab === 'parametres' && (
            <AIParametersPage
              parameters={aiParams}
              onSaveParameters={(params) => setAiParams(params)}
            />
          )}

          {/* Dev Lab view: ONLY accessible if logged in as saydoukebe31@gmail.com */}
          {activeTab === 'dev_lab' && isDevAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b356d]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-purple-900/40 text-purple-300 font-mono text-xs font-bold border border-purple-500/40">
                    Mode Admin Actif
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{userEmail}</span>
                </div>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className="px-3 py-1.5 bg-[#141b3d] hover:bg-[#202959] text-xs font-bold text-white rounded-xl cursor-pointer"
                >
                  ← Retour au Chat
                </button>
              </div>
              <DevLab onNavigateToPortal={() => setActiveTab('discussion')} />
            </div>
          )}
        </main>
      </div>

      {/* Onboarding & Prompt Personalization Questions Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentEmail={userEmail}
        preferences={preferences}
        currentPlan={plan}
        onSave={handleSavePreferences}
      />
    </div>
  );
}
