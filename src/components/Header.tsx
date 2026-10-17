import React from "react";
import { Plus } from "lucide-react";

interface HeaderProps {
  totalItems: number;
  avgConfidence: number;
  onOpenAddItemModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalItems,
  onOpenAddItemModal,
}) => {
  return (
    <header className="border-b-2 border-slate-800 bg-[#fbf8f1] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand in Hand-Drawn Sketchbook Style */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-200 border-2 border-slate-850 shadow-[2px_2px_0px_#1e293b] flex items-center justify-center text-slate-850 font-bold select-none text-base sm:text-lg shrink-0">
            🍳
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono truncate">
                智慧廚房
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.2 rounded-full bg-teal-100 text-teal-800 border border-teal-600 font-bold font-mono">
                STUDIO
              </span>
            </div>
            <h1 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1 sm:gap-1.5 truncate">
              <span className="truncate">智慧食材與食譜助手</span>
              <span className="text-[11px] sm:text-xs font-normal text-slate-500 font-serif italic hidden md:inline">
                Hand-Drawn Edition
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Clean User Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Inventory Count Indicator Chip */}
          <div className="hidden xs:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-slate-300 text-xs font-bold text-slate-700">
            <span>🥗</span>
            <span>庫存</span>
            <span className="px-1.5 py-0.2 bg-amber-200 text-slate-900 rounded-md font-mono text-[11px]">
              {totalItems}
            </span>
          </div>

          {/* Add Item Button */}
          <button
            onClick={onOpenAddItemModal}
            className="sketch-btn px-2.5 sm:px-3 py-1 text-xs font-bold rounded-xl bg-white hover:bg-amber-50 text-slate-850 flex items-center gap-1 cursor-pointer"
            title="手動新增食材"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">新增食材</span>
            <span className="sm:hidden">新增</span>
          </button>
        </div>
      </div>
    </header>
  );
};
