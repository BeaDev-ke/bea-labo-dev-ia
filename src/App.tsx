import React, { useState, useEffect } from 'react';
import { AndreaHeader } from './components/AndreaHeader';
import { AndreaSidebar, MainNavTab } from './components/AndreaSidebar';
import { AndreaChat } from './components/AndreaChat';
import { MontageStudio } from './components/MontageStudio';
import { CodeWorkspacePage, ActiveCodeProject } from './components/CodeWorkspacePage';
import { AccountPage } from './components/AccountPage';
import { MemoryPage } from './components/MemoryPage';
import { AIParametersPage } from './components/AIParametersPage';
import { OnboardingModal } from './components/OnboardingModal';
import { VitrinePage } from './components/VitrinePage';
import { UserPreferences, PlanType, AIParameters, AppTheme, AppLanguage } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('andrea_logged_in');
      if (stored === 'false') return false;
      return true;
    }
    return true;
  });

  // Vitrine par défaut sur "/", Portail Dev sur "/portail-dev"
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith('/portail-dev') ? '/portail-dev' : '/';
    }
    return '/';
  });

  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('andrea_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

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
      objective: 'Avancer concrètement chaque jour sur mes projets',
      language: 'fr',
    };
  });

  const [plan, setPlan] = useState<PlanType>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('andrea_plan') as PlanType) || 'free';
    }
    return 'free';
  });

  const [aiParams, setAiParams] = useState<AIParameters>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('andrea_ai_params');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      modelSpeed: 'puissant',
      creativity: 0.7,
      useMemory: true,
      hfToken: '',
      language: 'fr',
      posture: 'Pédagogique & Détaillé',
    };
  });

  const [activeTab, setActiveTab] = useState<MainNavTab>('discussion');
  const [isVisualStudioOpen, setIsVisualStudioOpen] = useState(false);
  const [activeCodeProject, setActiveCodeProject] = useState<ActiveCodeProject | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [chatKey, setChatKey] = useState(1);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('theme-light', theme === 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('andrea_theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.startsWith('/portail-dev') ? '/portail-dev' : '/';
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const navigateTo = (path: string, tab?: MainNavTab) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    if (tab) {
      setActiveCodeProject(null);
      setIsVisualStudioOpen(false);
      setActiveTab(tab);
    }
  };

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

  const handleSaveAIParameters = (params: AIParameters) => {
    setAiParams(params);
    if (typeof window !== 'undefined') {
      localStorage.setItem('andrea_ai_params', JSON.stringify(params));
    }
    if (params.language && params.language !== preferences.language) {
      const updated = { ...preferences, language: params.language };
      setPreferences(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('andrea_preferences', JSON.stringify(updated));
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('andrea_logged_in', 'false');
    }
    navigateTo('/');
  };

  const handleNewChat = () => {
    setActiveCodeProject(null);
    setIsVisualStudioOpen(false);
    setChatKey((prev) => prev + 1);
    setActiveTab('discussion');
  };

  const activeLanguage: AppLanguage = aiParams.language || preferences.language || 'fr';
  const sidebarCollapsed = activeTab === 'montage' && isVisualStudioOpen;

  // PAGE 1: Vitrine par défaut sur "/"
  if (currentPath === '/') {
    return (
      <div className="min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden overflow-x-hidden bg-[#0d091e] text-slate-100 font-sans antialiased selection:bg-[#5A33FF] selection:text-white">
        <VitrinePage
          onLogin={(email, newPrefs, newPlan) => {
            handleSavePreferences(email, newPrefs || preferences, newPlan || plan);
            navigateTo('/portail-dev', 'discussion');
          }}
          savedPreferences={preferences}
          savedEmail={userEmail}
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

  // PAGE 2: Portail Dev sur "/portail-dev"
  return (
    <div className="h-screen overflow-hidden bg-[#070914] text-slate-100 flex flex-col font-sans antialiased selection:bg-[#3b82f6] selection:text-white">
      <AndreaHeader
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onNavigateHome={() => navigateTo('/')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <AndreaSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveCodeProject(null);
            if (tab !== 'montage') setIsVisualStudioOpen(false);
            setActiveTab(tab);
          }}
          onNewChat={handleNewChat}
          displayName={preferences.displayName}
          plan={plan}
          collapsed={sidebarCollapsed}
        />

        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto md:overflow-hidden overflow-x-hidden p-2 sm:p-3 bg-[#090d1f] flex flex-col">
          {activeCodeProject ? (
            <CodeWorkspacePage
              project={activeCodeProject}
              onUpdateProject={(next) => setActiveCodeProject(next)}
              onBackToDiscussion={() => {
                setActiveCodeProject(null);
                setActiveTab('discussion');
              }}
            />
          ) : (
            <>
              {activeTab === 'discussion' && (
                <AndreaChat
                  key={chatKey}
                  userProfile={preferences.profile}
                  displayName={preferences.displayName}
                  language={activeLanguage}
                  onOpenCodeBuilder={(project) => {
                    setActiveCodeProject(project);
                  }}
                />
              )}

              {activeTab === 'montage' && (
                <MontageStudio
                  onViewModeChange={(mode) => setIsVisualStudioOpen(mode === 'fullscreen_studio')}
                />
              )}

              {activeTab === 'tarifs' && (
                <AccountPage
                  currentPlan={plan}
                  onUpgrade={(newPlan) => setPlan(newPlan)}
                  chatUsed={42}
                  chatLimit={1000}
                  codeUsed={18}
                  codeLimit={150}
                  onClearHistory={() => setChatKey((prev) => prev + 1)}
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
                  parameters={{ ...aiParams, language: activeLanguage }}
                  onSaveParameters={handleSaveAIParameters}
                />
              )}
            </>
          )}
        </main>
      </div>

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
