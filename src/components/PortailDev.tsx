import React, { useState } from 'react';
import {
  Bot,
  Globe,
  Film,
  Camera,
  Mic,
  ArrowLeft,
  Sparkles,
  Layers,
  Code as CodeIcon,
  FlaskConical,
  FolderArchive,
  Brain,
  Palette,
  Settings,
  Gem,
  Scissors
} from 'lucide-react';
import { AndreaChat } from './AndreaChat';
import { WebsiteGenerator } from './WebsiteGenerator';
import { VideoStudio } from './VideoStudio';
import { MontageStudio } from './MontageStudio';
import { VoiceStudio } from './VoiceStudio';
import { CodeEditor } from './CodeEditor';
import { AppBuilder } from './AppBuilder';
import { CreatorStudio } from './CreatorStudio';
import { DevLab } from './DevLab';
import { ProjectsPage } from './ProjectsPage';
import { MemoryPage } from './MemoryPage';
import { PersonalizationPage } from './PersonalizationPage';
import { AIParametersPage } from './AIParametersPage';
import { AccountPage } from './AccountPage';
import { PlanType, UserPreferences, AIParameters, StudioSectionId } from '../types';

export type PortailTab =
  | 'chat'
  | 'website'
  | 'montage'
  | 'video'
  | 'voice'
  | 'code'
  | 'app'
  | 'studio'
  | 'labo'
  | 'projets'
  | 'memoire'
  | 'perso'
  | 'parametres'
  | 'compte';

interface PortailDevProps {
  onNavigateHome: () => void;
  initialTab?: PortailTab;
}

export const PortailDev: React.FC<PortailDevProps> = ({ onNavigateHome, initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState<PortailTab>(initialTab);
  const [plan, setPlan] = useState<PlanType>('pro');
  const [studioSection, setStudioSection] = useState<StudioSectionId>('importer');

  const [preferences, setPreferences] = useState<UserPreferences>({
    profile: 'createur',
    displayName: 'Saydou',
    tone: 'Stratégique et direct (recommandé)',
    objective: 'Créer des vidéos 9:16 virales avec Wan 2.1 et F5-TTS',
  });

  const [aiParams, setAiParams] = useState<AIParameters>({
    modelSpeed: 'puissant',
    creativity: 0.7,
    useMemory: true,
    hfToken: '',
  });

  const [chatUsage, setChatUsage] = useState({ used: 42, limit: 1000 });
  const [codeUsage, setCodeUsage] = useState({ used: 18, limit: 150 });

  return (
    <div className="min-h-screen bg-[#0c0b17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <header className="border-b border-[#5A33FF33] bg-[#0c0b17]/90 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            title="Revenir sur la page vitrine d'accueil (/)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Accueil Vitrine</span>
          </button>
          <div className="h-4 w-px bg-[#5A33FF33]" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5A33FF] animate-pulse" />
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white whitespace-nowrap">
              Bea Labo Dev IA · <span className="text-[#c4b5fd] font-normal">Portail Dev</span>
            </span>
          </div>
        </div>

        {/* Main Quick Tabs (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Andrea (9:16)</span>
          </button>

          <button
            onClick={() => setActiveTab('montage')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'montage'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-sky-400" />
            <span>Montage Scènes</span>
          </button>

          <button
            onClick={() => setActiveTab('website')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'website'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Générateur Web</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span>Wan 2.1 & Caméra</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'voice'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Voix F5-TTS</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <CodeIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>Code</span>
          </button>

          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'app'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>App Web</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-rose-400" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('labo')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'labo'
                ? 'bg-gradient-to-r from-[#1E1B8C] to-[#5A33FF] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A1930]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-sky-400" />
            <span>Labo IA (L1-L5)</span>
          </button>
        </nav>

        {/* Action button: Vitrine link */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('compte')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'compte'
                ? 'bg-[#5A33FF] text-white'
                : 'bg-[#201844] hover:bg-[#2c2060] text-slate-200 border border-[#5A33FF44]'
            }`}
          >
            <Gem className="w-3.5 h-3.5 text-[#c4b5fd]" />
            <span className="hidden sm:inline">Offres</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="px-3 py-1.5 bg-[#14132b] hover:bg-[#1e1b42] text-slate-300 hover:text-white border border-[#5A33FF44] rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Vitrine (/)
          </button>
        </div>
      </header>

      {/* Secondary Horizontal Scroll Navigation for all tabs & mobile */}
      <div className="border-b border-[#5A33FF22] bg-[#14132b]/80 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'chat' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          💬 Chat Andrea (9:16)
        </button>
        <button
          onClick={() => setActiveTab('montage')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'montage' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          ✂️ Montage & Découpage Scènes
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'website' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🌐 Générateur de Sites
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'video' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎥 Wan 2.1 & Caméras Higgsfield
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'voice' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎙️ Voix F5-TTS SWIVID & Whisper
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'code' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          💻 Éditeur Code
        </button>
        <button
          onClick={() => setActiveTab('app')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'app' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🚀 App Web Autonome
        </button>
        <button
          onClick={() => setActiveTab('studio')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'studio' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎬 Studio Créateur (14 outils)
        </button>
        <button
          onClick={() => setActiveTab('labo')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'labo' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🧪 Labo IA (Niveaux 1-5)
        </button>
        <button
          onClick={() => setActiveTab('projets')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'projets' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          📁 Projets
        </button>
        <button
          onClick={() => setActiveTab('memoire')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'memoire' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🧠 Mémoire
        </button>
        <button
          onClick={() => setActiveTab('perso')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'perso' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎨 Personnalisation
        </button>
        <button
          onClick={() => setActiveTab('parametres')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'parametres' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚙️ Paramètres IA
        </button>
        <button
          onClick={() => setActiveTab('compte')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'compte' ? 'bg-[#5A33FF] text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          💎 Compte & Offres
        </button>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'chat' && (
          <AndreaChat
            userProfile={preferences.profile}
            displayName={preferences.displayName}
          />
        )}
        {activeTab === 'montage' && <MontageStudio />}
        {activeTab === 'website' && <WebsiteGenerator />}
        {activeTab === 'video' && <VideoStudio />}
        {activeTab === 'voice' && <VoiceStudio />}
        {activeTab === 'code' && <CodeEditor />}
        {activeTab === 'app' && <AppBuilder />}
        {activeTab === 'studio' && (
          <CreatorStudio
            activeSection={studioSection}
            plan={plan}
            onOpenSection={(sec) => setStudioSection(sec)}
          />
        )}
        {activeTab === 'labo' && <DevLab onNavigateToPortal={() => setActiveTab('chat')} />}
        {activeTab === 'projets' && (
          <ProjectsPage
            onOpenApp={() => setActiveTab('app')}
            onOpenMontage={() => setActiveTab('montage')}
          />
        )}
        {activeTab === 'memoire' && <MemoryPage />}
        {activeTab === 'perso' && (
          <PersonalizationPage
            preferences={preferences}
            onSavePreferences={(p) => setPreferences(p)}
          />
        )}
        {activeTab === 'parametres' && (
          <AIParametersPage
            parameters={aiParams}
            onSaveParameters={(params) => setAiParams(params)}
          />
        )}
        {activeTab === 'compte' && (
          <AccountPage
            currentPlan={plan}
            onUpgrade={(newPlan) => setPlan(newPlan)}
            chatUsed={chatUsage.used}
            chatLimit={chatUsage.limit}
            codeUsed={codeUsage.used}
            codeLimit={codeUsage.limit}
            onClearHistory={() => {
              setChatUsage({ used: 0, limit: chatUsage.limit });
              alert('Historique des conversations effacé avec succès.');
            }}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-[#5A33FF22] bg-[#0c0b17] px-6 py-4 text-center text-xs text-slate-500">
        Bea Labo Dev IA · Portail Développement & Création · Wan 2.1 · F5-TTS · Whisper SRT · Flux 1 Schnell
      </footer>
    </div>
  );
};
