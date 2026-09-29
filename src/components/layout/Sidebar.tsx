import React from 'react';
import {
  LayoutDashboard,
  Grid,
  RotateCw,
  ClipboardList,
  IndianRupee,
  Leaf,
  Info
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSystemInfo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSystemInfo
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Overview & Journal',
      icon: LayoutDashboard
    },
    {
      id: 'fields',
      label: 'Fields & Crops',
      subtitle: 'Manage Plots & Sowing',
      icon: Grid
    },
    {
      id: 'rotation',
      label: 'Rotation Planner',
      subtitle: 'Soil & Crop History',
      icon: RotateCw
    },
    {
      id: 'operations',
      label: 'Field Operations',
      subtitle: 'Fertilizer, Spray, Harvest',
      icon: ClipboardList
    },
    {
      id: 'finances',
      label: 'Cost & Yield',
      subtitle: 'Expenses & Revenue',
      icon: IndianRupee
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 p-4 shrink-0">
      <div className="clay-card p-3 flex flex-col gap-1.5 h-full border border-emerald-100">
        <div className="px-3 py-2 border-b border-emerald-100 mb-1">
          <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" /> Farm Modules
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white shadow-md shadow-emerald-900/20 font-semibold scale-[1.02]'
                    : 'text-emerald-950 hover:bg-emerald-100/60 font-medium'
                }`}
              >
                <div
                  className={`p-2 rounded-xl flex items-center justify-center ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#d8f3dc]/70 text-[#1b4332]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm leading-snug">{item.label}</div>
                  <div
                    className={`text-[11px] font-normal ${
                      isActive ? 'text-emerald-200' : 'text-emerald-700/80'
                    }`}
                  >
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Bottom Spring Boot Architecture Box */}
        <div className="mt-auto pt-3 border-t border-emerald-100">
          <div
            onClick={onOpenSystemInfo}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#d8f3dc] border border-emerald-300/60 cursor-pointer hover:shadow-md transition-all text-xs"
          >
            <div className="flex items-center gap-1.5 font-bold text-[#1b4332] mb-1">
              <Info className="w-4 h-4 text-[#2d6a4f]" /> Spring Boot Ready
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight">
              Abstracted Service Layer ready for Java Spring Boot REST API integration.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
