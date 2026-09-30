import React from 'react';
import {
  LayoutDashboard,
  Grid,
  RotateCw,
  ClipboardList,
  IndianRupee,
  Wrench
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'fields', label: 'Fields', icon: Grid },
    { id: 'rotation', label: 'Rotation', icon: RotateCw },
    { id: 'operations', label: 'Operations', icon: ClipboardList },
    { id: 'finances', label: 'Finances', icon: IndianRupee },
    { id: 'equipment', label: 'Equipment', icon: Wrench }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-900/10 px-1.5 py-1.5 shadow-lg pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]">
      <div className="flex items-center justify-between max-w-lg mx-auto gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[10px] leading-tight truncate w-full text-center tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
