import React from 'react';
import {
  MessageSquare,
  Film,
  CreditCard,
  Globe,
  Sliders,
  Plus,
  Bell,
} from 'lucide-react';
import { PlanType } from '../types';

export type MainNavTab = 'discussion' | 'montage' | 'tarifs' | 'memoire' | 'parametres';

interface AndreaSidebarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onNewChat: () => void;
  displayName: string;
  plan: PlanType;
  collapsed?: boolean;
}

export const AndreaSidebar: React.FC<AndreaSidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewChat,
  displayName,
  plan,
  collapsed = false,
}) => {
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
    },
    {
      id: 'montage' as MainNavTab,
      label: 'Montage',
      icon: Film,
    },
    {
      id: 'tarifs' as MainNavTab,
      label: 'Offres & Tarifs',
      icon: CreditCard,
    },
    {
      id: 'memoire' as MainNavTab,
      label: 'Mémoire',
      icon: Globe,
    },
    {
      id: 'parametres' as MainNavTab,
      label: 'Paramètres',
      icon: Sliders,
    },
  ];

  // Sur téléphone (< md) ou en mode Création de visuels (collapsed), la barre se rétrécit aux logos seuls
  const railWidth = collapsed ? 'w-12 sm:w-14' : 'w-12 md:w-56';

  return (
    <aside
      className={`${railWidth} bg-[#0c0b17] border-r border-[#5A33FF33] flex flex-col h-full min-h-0 select-none shrink-0 overflow-hidden text-white transition-all duration-200`}
    >
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden bea-scroll ${collapsed ? 'p-1.5 space-y-2' : 'p-1.5 md:p-3.5 space-y-2 md:space-y-3'}`}>
        {/* User Card: avatar initial on icon rail, full card on expanded desktop */}
        {collapsed ? (
          <div
            className="w-9 h-9 mx-auto rounded-xl bg-[#2a2057] border border-[#5A33FF66] flex items-center justify-center font-black text-xs text-white"
            title={`${displayName || 'Utilisateur'} (${planTag.label})`}
          >
            {(displayName || 'A').slice(0, 1).toUpperCase()}
          </div>
        ) : (
          <>
            <div
              className="md:hidden w-9 h-9 mx-auto rounded-xl bg-[#2a2057] border border-[#5A33FF66] flex items-center justify-center font-black text-xs text-white"
              title={`${displayName || 'Utilisateur'} (${planTag.label})`}
            >
              {(displayName || 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden md:block space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm text-white tracking-tight truncate">
                  {displayName || 'Utilisateur'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border shrink-0 ${planTag.color}`}
                >
                  {planTag.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Appel :</span>
                <span className="text-slate-300 font-semibold truncate">« {displayName || 'Utilisateur'} »</span>
                <div className="flex items-center gap-0.5 text-amber-400 font-bold ml-auto shrink-0 text-[11px] tabular-nums">
                  <Bell className="w-3 h-3 fill-amber-400" />
                  <span>1j</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          title="Nouvelle discussion"
          aria-label="Nouvelle discussion"
          className={`w-full bea-btn-primary text-white rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer whitespace-nowrap ${
            collapsed ? 'p-2.5' : 'p-2.5 md:py-2 md:px-3 md:gap-2'
          }`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="hidden md:inline">Nouvelle discussion</span>}
        </button>

        {/* Navigation List */}
        <nav aria-label="Navigation principale" className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full rounded-xl text-xs font-bold transition-all flex items-center cursor-pointer whitespace-nowrap ${
                  collapsed
                    ? 'justify-center p-2.5'
                    : 'justify-center md:justify-start p-2.5 md:px-3 md:py-2.5 md:gap-3'
                } ${
                  isActive
                    ? 'bg-[#2a2057] text-white shadow-md border border-[#5A33FF66]'
                    : 'text-slate-300 border border-transparent hover:bg-[#1A1930] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#a78bfa]' : 'text-slate-400'}`} />
                {!collapsed && <span className="hidden md:inline truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer brand mark */}
      <div className="p-2.5 border-t border-[#5A33FF33] shrink-0 flex items-center justify-center">
        {collapsed ? (
          <img src="/logo_andrea.svg" alt="Andrea" className="w-6 h-6 object-contain opacity-90" />
        ) : (
          <>
            <img src="/logo_andrea.svg" alt="Andrea" className="md:hidden w-6 h-6 object-contain opacity-90" />
            <div className="hidden md:block text-center text-[10px] text-slate-400 font-mono">
              Andrea Studio
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
