import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Code2, 
  FileCode, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Wand2, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { DevPortal } from './components/DevPortal';
import { DevLab } from './components/DevLab';
import { BeaAppPreview } from './components/BeaAppPreview';
import { AppPyViewer } from './components/AppPyViewer';
import { VisitorLanding } from './components/VisitorLanding';

type MainView = 'portal' | 'visiteur' | 'lab' | 'prod' | 'code';

export default function App() {
  const [currentView, setCurrentView] = useState<MainView>('portal');

  return (
    <div className="min-h-screen bg-[#0f0a1e] text-[#f5f3ff] flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0d0d14]/90 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('portal')}
              className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl shadow-md hover:scale-105 transition-transform"
              title="Retour au Portail Développeur"
            >
              🧠
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Bea</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  BehaviorLab AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden sm:inline-block">
                  AST Shield Actif
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Plateforme Développeur & IA d'Analyse Comportementale
              </p>
            </div>
          </div>

          {/* Mode Switcher aligned to the right without flashy colors */}
          <div className="flex items-center bg-[#18181b] border border-zinc-800 p-1 rounded-xl shadow-sm gap-1 flex-wrap sm:ml-auto justify-end">
            <button
              onClick={() => setCurrentView('portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'portal'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <span>🛠️ Portail Dev</span>
            </button>

            <button
              onClick={() => setCurrentView('visiteur')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'visiteur'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
              title="Site visiteur avec sidebar Offres & BehaviorLab AI et 15 langues"
            >
              <span>👤 Site Visiteur</span>
            </button>

            <button
              onClick={() => setCurrentView('prod')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'prod'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>🌐 App (Prod)</span>
            </button>

            <button
              onClick={() => setCurrentView('lab')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'lab'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>🧪 Labo Dev (8 Niveaux)</span>
            </button>

            <button
              onClick={() => setCurrentView('code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                currentView === 'code'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>📄 app.py</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-2 sm:p-4 md:p-6 space-y-4">
        {currentView === 'portal' && (
          <DevPortal
            onGoToProd={() => setCurrentView('prod')}
            onGoToLab={() => setCurrentView('lab')}
            onGoToCode={() => setCurrentView('code')}
            onGoToVisitor={() => setCurrentView('visiteur')}
          />
        )}

        {currentView === 'visiteur' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#18181b] border border-zinc-800 p-3 rounded-2xl text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vous visualisez le <strong>Site Visiteur</strong> avec boutons <strong>Offres & BehaviorLab AI dans la barre latérale gauche</strong> et sélecteur des 15 langues IA.</span>
              </div>
              <button
                onClick={() => setCurrentView('lab')}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition flex items-center gap-1.5 border border-zinc-700"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Modifier au Labo</span>
              </button>
            </div>
            <VisitorLanding 
              onEnterApp={() => setCurrentView('prod')} 
              onOpenLab={() => setCurrentView('lab')} 
            />
          </div>
        )}

        {currentView === 'lab' && (
          <DevLab 
            onGoToProd={() => setCurrentView('prod')}
            onViewFullCode={() => setCurrentView('code')}
          />
        )}

        {currentView === 'prod' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#15112a] border border-[#7c3aed]/40 p-3.5 rounded-xl text-xs text-[#c4b5fd]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vous visualisez le <strong>Site Fonctionnel (Prod) de Bea</strong>. Cliquez sur le bouton pour demander une modification au Labo.</span>
              </div>
              <button
                onClick={() => setCurrentView('lab')}
                className="px-3 py-1.5 rounded-lg bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Ouvrir le Labo Dev
              </button>
            </div>
            <BeaAppPreview onOpenLab={() => setCurrentView('lab')} />
          </div>
        )}

        {currentView === 'code' && (
          <AppPyViewer />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[#7c3aed]/30 py-4 px-6 text-center text-xs text-[#8a7ab8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BehaviorLab AI · Système Bea Labo Dev IA (Modifications par Niveau)</span>
          <span className="text-[#a78bfa]">Moteur IA Comportementale Bea · ast.parse Anti-Plantage</span>
        </div>
      </footer>
    </div>
  );
}
