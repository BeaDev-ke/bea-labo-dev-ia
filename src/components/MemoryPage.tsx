import React, { useState } from 'react';
import { Globe, Pencil, Trash2, Brain, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserPreferences, PlanType, MemoryItem } from '../types';

interface MemoryPageProps {
  preferences?: UserPreferences;
  plan?: PlanType;
  onOpenEditModal?: () => void;
}

export const MemoryPage: React.FC<MemoryPageProps> = ({
  preferences = { displayName: 'Saydoukebe31', profile: 'createur', tone: 'expert' },
  plan = 'free',
  onOpenEditModal = () => {},
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: 'm_1',
      category: 'Objectif de création',
      content: 'Publication de 3 vidéos 9:16 par semaine avec accroche percutante et sous-titres synchronisés.',
      date: '05 nov. 2026',
    },
    {
      id: 'm_2',
      category: 'Identité visuelle',
      content: 'Palette bleu nuit #0A0D1E et indigo électrique #3B82F6, rendu cinématographique.',
      date: '04 nov. 2026',
    },
    {
      id: 'm_3',
      category: 'Tonalité',
      content: "Préfère des réponses directes, concises et axées sur le passage à l'action immédiat.",
      date: '02 nov. 2026',
    },
  ]);

  const [newContent, setNewContent] = useState('');
  const [page, setPage] = useState(0);

  const handleAdd = () => {
    if (!newContent.trim()) return;
    setMemories([
      {
        id: `m_${Date.now()}`,
        category: 'Information personnalisée',
        content: newContent.trim(),
        date: "Aujourd'hui",
      },
      ...memories,
    ]);
    setNewContent('');
    setPage(0);
  };

  const handleDelete = (id: string) => {
    setMemories(memories.filter((m) => m.id !== id));
  };

  const PLAN_LABELS: Record<PlanType, string> = {
    free: 'FREE',
    bea: 'ANDREA',
    pro: 'PRO',
    abo: 'ULTRA',
  };

  const PER_PAGE = 3;
  const totalPages = Math.max(1, Math.ceil(memories.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleMemories = memories.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  return (
    <div className="h-full flex flex-col justify-between gap-3 max-w-5xl mx-auto overflow-y-auto md:overflow-hidden overflow-x-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2.5 border-b border-[#1d254f] pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#1e2a66] flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-base sm:text-xl font-black text-white truncate">Mémoire contextuelle d'Andrea</h2>
        </div>

        <button
          onClick={onOpenEditModal}
          className="px-3 sm:px-4 py-2 bg-[#202f78] hover:bg-[#2b3ea1] border border-[#384fa6] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Modifier mes informations</span>
        </button>
      </div>

      {/* 4 Structured Context Cards */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div className="p-3 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300">Prénom préféré :</span>
          <span className="text-xs font-mono font-bold text-slate-100 truncate">« {preferences.displayName || 'Utilisateur'} »</span>
        </div>

        <div className="p-3 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300">Rôle principal :</span>
          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">
              {preferences.profile === 'createur'
                ? 'Créateur de contenu'
                : preferences.profile === 'entreprise'
                ? 'Dirigeant & Entreprise'
                : preferences.profile || 'Créateur de contenu'}
            </span>
          </span>
        </div>

        <div className="p-3 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300">Style préféré :</span>
          <span className="text-xs font-mono font-bold text-slate-100 truncate">{preferences.tone || 'expert'}</span>
        </div>

        <div className="p-3 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-300">Formule active :</span>
          <span className="text-xs font-black font-mono text-[#10b981]">{PLAN_LABELS[plan] || 'FREE'}</span>
        </div>
      </div>

      {/* Dynamic Behavioral Memories */}
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-2.5 md:overflow-hidden">
        <div className="shrink-0 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Faits clés mémorisés dynamiquement</span>
          </h3>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 text-xs tabular-nums shrink-0">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={safePage === 0} className="p-1 rounded bg-[#141c45] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span className="font-mono text-slate-300">{safePage + 1}/{totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={safePage >= totalPages - 1} className="p-1 rounded bg-[#141c45] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </div>

        <div className="shrink-0 flex gap-2">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ajouter une consigne à mémoriser..."
            className="flex-1 min-w-0 px-3 sm:px-4 py-2 bg-[#101636] border border-[#222c5e] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4255b3]"
          />
          <button
            onClick={handleAdd}
            disabled={!newContent.trim()}
            className="px-3 sm:px-4 py-2 bg-[#202f78] hover:bg-[#2b3ea1] text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40 shrink-0"
          >
            Ajouter
          </button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-3 md:overflow-hidden">
          {visibleMemories.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-[#0d122c] border border-[#1e2754] flex flex-col justify-between group overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                  <span className="text-sky-300 font-semibold">{m.category}</span>
                  <span>{m.date}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed line-clamp-4">{m.content}</p>
              </div>
              <div className="pt-2 border-t border-[#1e2754] flex justify-end">
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
