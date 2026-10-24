import React from 'react';
import { 
  Globe, 
  Wand2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  Layers,
  FileCode,
  User,
  CreditCard,
  Trophy
} from 'lucide-react';

interface DevPortalProps {
  onGoToProd: () => void;
  onGoToLab: () => void;
  onGoToCode: () => void;
  onGoToVisitor?: () => void;
  userEmail?: string;
}

export const DevPortal: React.FC<DevPortalProps> = ({ 
  onGoToProd, 
  onGoToLab, 
  onGoToCode,
  onGoToVisitor,
  userEmail = 'saydoukebe31@gmail.com' 
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Welcome & Developer Recognition */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Développeur reconnu : <strong className="text-white">{userEmail}</strong></span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          🛠️ Portail Développeur — Bea
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Bienvenue dans votre centre de contrôle BehaviorLab AI. Vous disposez d'un accès complet à tous les environnements :
        </p>
      </div>

      {/* The Main Cards: 3 Key Environments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: SITE VISITEUR (VITRINE) */}
        <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shadow">
              👤
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Sidebar Gauche
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  15 Langues
                </span>
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
                Site Visiteur (Vitrine)
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Interface publique avec barre latérale à gauche regroupant <strong>💎 Offres</strong>, <strong>🧠 BehaviorLab AI</strong>, Connexion et le sélecteur des 15 langues IA.
              </p>
            </div>

            <div className="pt-2 space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Boutons Offres & Vision à gauche</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>15 langues supportées (FR, EN, ES, AR, ZH...)</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToVisitor || onGoToProd}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <span>Voir le Site Visiteur</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: LABO DEV IA (8 NIVEAUX & TOP 10) */}
        <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shadow">
                🧪
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                Top 10 Mondial
              </span>
            </div>

            <div>
              <div className="text-[10px] font-bold text-zinc-400 mb-1">8 NIVEAUX & SOUS-NIVEAUX</div>
              <h2 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
                Labo Dev IA Bea
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Intervention chirurgicale sur les 8 niveaux (Design, Chat, Fogg, Mémoire, Multi-Agents, Bâtisseur Web, 15 Langues, Sécurité AST).
              </p>
            </div>

            <div className="pt-2 space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Roadmap pour intégrer le Top 10 Mondial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Validation Python AST automatique</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToLab}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <span>Ouvrir le Labo Dev IA</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: SITE FONCTIONNEL PROD */}
        <div className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-3xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shadow">
              🌐
            </div>
            <div>
              <div className="text-[10px] font-bold text-zinc-400 mb-1">SESSION ACTIVE</div>
              <h2 className="text-lg font-bold text-white group-hover:text-zinc-200 transition-colors">
                Application Bea (Prod)
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Accédez à l'application complète telle qu'utilisée : chat avec dictée vocale, studio visuel, atelier web, code et gestion de compte.
              </p>
            </div>

            <div className="pt-2 space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Chat & Expérience conversationnelle Bea</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Bâtisseur de sites & Studio interactif</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onGoToProd}
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
            >
              <span>Ouvrir l'App (Prod)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Code Inspector Banner */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>Fichier source principal : <strong className="text-white font-mono">app.py</strong> (2500+ lignes · Streamlit & BehaviorLab AI)</span>
        </div>
        <button
          onClick={onGoToCode}
          className="text-xs font-semibold text-zinc-200 hover:text-white underline inline-flex items-center gap-1 self-start sm:self-auto"
        >
          Inspecter ou télécharger le fichier
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
