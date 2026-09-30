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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-900/10 px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                  : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
