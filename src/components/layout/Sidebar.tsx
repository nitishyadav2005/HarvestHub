import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Grid,
  RotateCw,
  ClipboardList,
  IndianRupee,
  Leaf,
  Info,
  Wrench,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSystemInfo: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSystemInfo,
  isMobileOpen = false,
  onCloseMobile
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
    },
    {
      id: 'equipment',
      label: 'Equipment',
      subtitle: 'Maintenance & Service',
      icon: Wrench
    }
  ];

  // Close on Escape key when mobile sidebar is open
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavContent = (isMobile = false) => (
    <div className="clay-card p-3.5 flex flex-col gap-2 border border-emerald-100/80 shadow-md">
      {/* Title & Close Header */}
      <div className="px-3 py-2 border-b border-emerald-100 flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" /> Farm Modules
        </span>
        {isMobile && onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-colors"
            title="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white shadow-md shadow-emerald-900/20 font-semibold scale-[1.01]'
                  : 'text-emerald-950 hover:bg-emerald-100/70 font-medium'
              }`}
            >
              <div
                className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#d8f3dc]/70 text-[#1b4332]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm leading-snug truncate font-bold">{item.label}</div>
                <div
                  className={`text-[11px] font-normal truncate ${
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

      {/* Bottom Farm Journal Information & Backup */}
      <div className="pt-3 border-t border-emerald-100 mt-1">
        <div
          onClick={() => {
            onOpenSystemInfo();
            if (isMobile && onCloseMobile) onCloseMobile();
          }}
          className="p-3 rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#d8f3dc] border border-emerald-300/60 cursor-pointer hover:shadow-md transition-all text-xs group"
        >
          <div className="flex items-center gap-1.5 font-bold text-[#1b4332] mb-0.5">
            <Info className="w-4 h-4 text-[#2d6a4f] group-hover:scale-110 transition-transform" /> Green Valley Farm
          </div>
          <p className="text-[11px] text-emerald-800 leading-tight">
            Local offline farm journal. Tap for data backup & storage info.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 self-start sticky top-[4.75rem] max-h-[calc(100vh-5.5rem)] overflow-y-auto">
        {renderNavContent(false)}
      </aside>

      {/* Mobile & Tablet Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] p-4 bg-[#f2f6f3] shadow-2xl flex flex-col z-10 overflow-y-auto">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
