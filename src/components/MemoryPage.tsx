import React, { useState } from 'react';
import {
  Globe,
  Pencil,
  Plus,
  Trash2,
  Check,
  Brain,
  Sparkles,
  Briefcase
} from 'lucide-react';
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
      content: 'Publication de 3 réels et TikToks 9:16 par semaine avec accroche percutante et sous-titres synchronisés.',
      date: '05 nov. 2026',
    },
    {
      id: 'm_2',
      category: 'Identité visuelle',
      content: 'Couleurs officielles : bleu nuit #0A0D1E et indigo électrique #3B82F6, style cinématographique.',
      date: '04 nov. 2026',
    },
    {
      id: 'm_3',
      category: 'Tonalité',
      content: 'Préfère des réponses directes, concises et sans flatterie superficielle, axées sur le passage à l\'action.',
      date: '02 nov. 2026',
    },
  ]);

  const [newContent, setNewContent] = useState('');

  const handleAdd = () => {
    if (!newContent.trim()) return;
    setMemories([
      {
        id: `m_${Date.now()}`,
        category: 'Information personnalisée',
        content: newContent.trim(),
        date: 'Aujourd\'hui',
      },
      ...memories,
    ]);
    setNewContent('');
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header matching Photo 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1d254f] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#1e2a66] flex items-center justify-center">
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Mémoire contextuelle d'Andrea
          </h2>
        </div>

        <button
          onClick={onOpenEditModal}
          className="px-4 py-2 bg-[#202f78] hover:bg-[#2b3ea1] border border-[#384fa6] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Modifier mes informations</span>
        </button>
      </div>

      <p className="text-xs text-slate-300">
        Informations enregistrées pour adapter vos conseils et montages :
      </p>

      {/* Main 4 Structured Context Cards matching Photo 2 */}
      <div className="space-y-3">
        {/* Prénom préféré */}
        <div className="p-4 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Prénom préféré :</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-100">
              « {preferences.displayName || 'Saydoukebe31'} »
            </span>
            <button
              onClick={onOpenEditModal}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rôle principal */}
        <div className="p-4 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Rôle principal :</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {preferences.profile === 'createur'
                  ? 'Créateur de contenu'
                  : preferences.profile === 'entreprise'
                  ? 'Dirigeant & Entreprise'
                  : preferences.profile === 'independant'
                  ? 'Indépendant & Freelance'
                  : preferences.profile || 'Créateur de contenu'}
              </span>
            </span>
            <button
              onClick={onOpenEditModal}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Style préféré */}
        <div className="p-4 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Style préféré :</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-100">
              {preferences.tone || 'expert'}
            </span>
            <button
              onClick={onOpenEditModal}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Formule active */}
        <div className="p-4 bg-[#101636] border border-[#222c5e] rounded-2xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Formule active :</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black font-mono text-[#10b981]">
              {PLAN_LABELS[plan] || 'FREE'}
            </span>
            <button
              onClick={onOpenEditModal}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Additional Behavioral Memories */}
      <div className="pt-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Brain className="w-4 h-4 text-sky-400" />
          <span>Faits clés mémorisés dynamiquement</span>
        </h3>

        {/* Add Memory Form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Ajouter une consigne spécifique à mémoriser..."
            className="flex-1 px-4 py-2.5 bg-[#101636] border border-[#222c5e] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#4255b3]"
          />
          <button
            onClick={handleAdd}
            disabled={!newContent.trim()}
            className="px-4 py-2.5 bg-[#202f78] hover:bg-[#2b3ea1] text-white text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            Ajouter
          </button>
        </div>

        {/* List of items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {memories.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-[#0d122c] border border-[#1e2754] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                  <span className="text-sky-300 font-semibold">{m.category}</span>
                  <span>{m.date}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{m.content}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-[#1e2754] flex justify-end">
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
