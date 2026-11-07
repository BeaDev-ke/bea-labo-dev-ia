import React from 'react';
import {
  MessageSquare,
  Film,
  Code2,
  CreditCard,
  Globe,
  Sliders,
  Plus,
  Wand2,
  Bell
} from 'lucide-react';
import { PlanType } from '../types';

export type MainNavTab = 'discussion' | 'montage' | 'code' | 'tarifs' | 'memoire' | 'parametres' | 'dev_lab';

interface AndreaSidebarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onNewChat: () => void;
  displayName: string;
  plan: PlanType;
  userEmail: string;
  onOpenDevLab: () => void;
}

export const AndreaSidebar: React.FC<AndreaSidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  displayName,
  plan,
  userEmail,
  onOpenDevLab,
}) => {
  const isDevAdmin = userEmail.trim().toLowerCase() === 'saydoukebe31@gmail.com';

  const PLAN_TAGS: Record<PlanType, { label: string; color: string }> = {
    free: { label: 'FREE', color: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40' },
    bea: { label: 'ANDREA', color: 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/40' },
    pro: { label: 'PRO', color: 'bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/40' },
    abo: { label: 'ULTRA', color: 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/40' },
  };

  const planTag = PLAN_TAGS[plan] || PLAN_TAGS.free;

  const navItems = [
    {
      id: 'discussion' as MainNavTab,
      label: 'Discussion',
      icon: MessageSquare,
      hasBadge: false,
    },
    {
      id: 'montage' as MainNavTab,
      label: 'Montage',
      icon: Film,
      hasBadge: false,
    },
    {
      id: 'code' as MainNavTab,
      label: 'Code (Ultra)',
      icon: Code2,
      hasBadge: true,
      badgeText: 'Ultra',
    },
    {
      id: 'tarifs' as MainNavTab,
      label: 'Offres & Tarifs',
      icon: CreditCard,
      hasBadge: false,
    },
    {
      id: 'memoire' as MainNavTab,
      label: 'Mémoire',
      icon: Globe,
      hasBadge: false,
    },
    {
      id: 'parametres' as MainNavTab,
      label: 'Paramètres',
      icon: Sliders,
      hasBadge: false,
    },
  ];

  return (
    <aside className="w-64 sm:w-72 bg-[#090c1b] border-r border-[#1a2044] flex flex-col h-[calc(100vh-3.5rem)] select-none shrink-0 overflow-y-auto no-scrollbar text-white justify-between">
      {/* Top User Info & New Chat Button */}
      <div className="p-4 space-y-4">
        {/* User Card */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-white tracking-tight truncate">
              {displayName || 'Saydoukebe31'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${planTag.color}`}
            >
              {planTag.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>Appel :</span>
            <span className="text-slate-300 font-semibold truncate">« {displayName || 'Saydoukebe31'} »</span>
            <div className="flex items-center gap-0.5 text-amber-400 font-bold ml-auto shrink-0 text-[11px]">
              <Bell className="w-3 h-3 fill-amber-400" />
              <span>1j</span>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full py-2.5 px-3 bg-[#131835] hover:bg-[#1a2147] text-slate-100 hover:text-white border border-[#232b5c] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Nouvelle discussion</span>
        </button>

        {/* Navigation List */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#1b2668] text-white shadow-md border border-[#2e40a6]'
                    : 'text-slate-300 hover:bg-[#131735] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.hasBadge && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#253380] text-sky-300 border border-[#3b4db8]">
                    {item.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: ONLY show Labo Dev Admin if userEmail is saydoukebe31@gmail.com */}
      <div className="p-4 border-t border-[#1a2044]">
        {isDevAdmin ? (
          <button
            onClick={onOpenDevLab}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[#291b54] to-[#432378] hover:from-[#36236e] hover:to-[#552d96] border border-[#6b35bf]/50 text-purple-200 text-xs font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-lg shadow-purple-950/40 transition-all hover:scale-[1.01]"
            title="Accès Administrateur Développeur"
          >
            <div className="flex items-center gap-1.5 font-extrabold text-white">
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Labo Dev Admin</span>
            </div>
            <span className="text-[10px] text-purple-300 font-mono">saydoukebe31@gmail.com</span>
          </button>
        ) : (
          <div className="text-center text-[10px] text-slate-500 font-mono">
            Andrea v2.4 · BehaviorLab AI
          </div>
        )}
      </div>
    </aside>
  );
};
