import React, { useState } from "react";
import { Plus, X, ArrowLeft, ChevronRight, Check } from "lucide-react";
import { CookingPreferences, DetectedItem } from "../types";
import { APPLIANCE_OPTIONS, DIET_STYLE_OPTIONS, QUICK_AVOID_TAGS, TIME_BUDGET_OPTIONS } from "../data/presets";

interface Module2PreferencesFilterProps {
  preferences: CookingPreferences;
  onChangePreferences: (prefs: CookingPreferences) => void;
  selectedItems: DetectedItem[];
  onBackToScan: () => void;
  onGenerateRecipes: () => void;
  isLoading: boolean;
}

export const Module2PreferencesFilter: React.FC<Module2PreferencesFilterProps> = ({
  preferences,
  onChangePreferences,
  selectedItems,
  onBackToScan,
  onGenerateRecipes,
  isLoading,
}) => {
  const [customAvoidInput, setCustomAvoidInput] = useState("");

  const toggleAppliance = (id: string) => {
    const current = preferences.appliances;
    const next = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    onChangePreferences({ ...preferences, appliances: next.length > 0 ? next : [id] });
  };

  const toggleDietStyle = (id: string) => {
    const current = preferences.dietStyles;
    const next = current.includes(id)
      ? current.filter((d) => d !== id)
      : [...current, id];
    onChangePreferences({ ...preferences, dietStyles: next });
  };

  const toggleAvoidTag = (tag: string) => {
    const current = preferences.allergiesAndAvoid;
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onChangePreferences({ ...preferences, allergiesAndAvoid: next });
  };

  const handleAddCustomAvoid = () => {
    if (customAvoidInput.trim() && !preferences.allergiesAndAvoid.includes(customAvoidInput.trim())) {
      onChangePreferences({
        ...preferences,
        allergiesAndAvoid: [...preferences.allergiesAndAvoid, customAvoidInput.trim()],
      });
      setCustomAvoidInput("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 font-sans">
      {/* Top Sketchbook Page Container matching Image 2 */}
      <div className="sketch-border-thick rounded-3xl bg-[#fffdf9] p-4 sm:p-7 shadow-xl space-y-5 relative">
        {/* Top Header Row matching Image 2 */}
        <div className="flex items-center justify-between text-xs pb-1">
          <span className="font-extrabold text-slate-800 text-sm tracking-wide">
            智慧廚房手帳
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-600 bg-amber-50 px-2 py-0.5 rounded-full border border-slate-300">
              CYBERVISION STUDIO
            </span>
          </div>
        </div>

        {/* Main Title Row with Doodles */}
        <div className="flex items-start justify-between border-b-2 border-slate-850 pb-3 gap-2">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span>偏好與設備篩選器</span>
              <span className="text-base sm:text-lg">🔦</span>
              <span className="text-base sm:text-lg">⚙️</span>
            </h2>
            <p className="text-[11px] sm:text-xs font-bold text-slate-600 tracking-wide mt-0.5 font-mono">
              Preferred Constraints Filter
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border-2 border-slate-850 bg-teal-50 shadow-xs shrink-0 whitespace-nowrap">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-teal-500 border border-slate-800 shrink-0"></span>
            <span className="text-xs font-extrabold text-slate-850">設定中</span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 font-mono hidden xs:inline">ADJUSTING</span>
          </div>
        </div>

        {/* 1. 現有設備 (多選) Appliances可用 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🔍</span>
              <span>現有設備 (多選)</span>
            </h3>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 font-mono">
              已選 {preferences.appliances.length} 項
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5">
            {APPLIANCE_OPTIONS.map((app) => {
              const isSelected = preferences.appliances.includes(app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => toggleAppliance(app.id)}
                  className={`p-2 sm:p-2.5 rounded-2xl border-2 border-slate-850 text-center transition-all relative flex flex-col items-center justify-center min-h-[84px] sm:min-h-[90px] shadow-[2px_2px_0px_#1e293b] cursor-pointer ${
                    isSelected
                      ? "bg-cyan-100 hover:bg-cyan-200"
                      : "bg-[#fdfaf5] hover:bg-slate-100 opacity-90"
                  }`}
                >
                  {/* Top right checkmark badge */}
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <span className="text-xl sm:text-2xl select-none mb-1">{app.icon}</span>
                  <div className="font-extrabold text-[11px] sm:text-xs text-slate-900 leading-tight whitespace-nowrap">
                    {app.name}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-semibold text-slate-500 font-mono leading-tight mt-0.5 whitespace-nowrap">
                    {app.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Two Columns: 飲食風格 & 忌口與排除 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
          {/* Left Column: 飲食風格 Diet Style */}
          <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-slate-850 bg-white shadow-[2px_2px_0px_#1e293b] space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🥗</span>
              <span>飲食風格 Diet Style</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {DIET_STYLE_OPTIONS.map((diet) => {
                const isSelected = preferences.dietStyles.includes(diet.id);
                return (
                  <button
                    key={diet.id}
                    onClick={() => toggleDietStyle(diet.id)}
                    className={`py-2 px-1.5 rounded-xl border-2 border-slate-850 text-center transition flex flex-col items-center justify-center shadow-[1.5px_1.5px_0px_#1e293b] cursor-pointer ${
                      isSelected
                        ? "bg-[#115e59] text-white"
                        : "bg-[#fdfaf5] text-slate-850 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-extrabold text-xs whitespace-nowrap">{diet.label}</span>
                    <span className={`text-[10px] font-mono whitespace-nowrap ${isSelected ? "text-teal-200" : "text-slate-500"}`}>
                      {diet.enLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 忌口與排除 Allergies/Exclusions */}
          <div className="p-3 sm:p-3.5 rounded-2xl border-2 border-slate-850 bg-white shadow-[2px_2px_0px_#1e293b] space-y-2.5">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
              <span className="text-rose-500 font-bold">🚫</span>
              <span>忌口與排除 Allergies/Exclusions</span>
            </h4>

            {/* Input field */}
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="輸入忌口 (e.g. 香菜)..."
                value={customAvoidInput}
                onChange={(e) => setCustomAvoidInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomAvoid()}
                className="w-full text-xs px-2.5 py-1.5 rounded-xl border-2 border-slate-850 bg-[#faf6ee] text-slate-900 placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={handleAddCustomAvoid}
                className="px-2.5 py-1.5 rounded-xl border-2 border-slate-850 bg-slate-900 text-white text-xs font-bold shrink-0 cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Chips matching Image 2 */}
            <div className="flex flex-col gap-1.5">
              {QUICK_AVOID_TAGS.map((tag) => {
                const isSelected = preferences.allergiesAndAvoid.includes(tag.zh);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleAvoidTag(tag.zh)}
                    className={`w-full py-1 px-2.5 rounded-xl border-2 border-slate-850 text-xs font-bold flex items-center justify-between transition shadow-[1px_1px_0px_#1e293b] cursor-pointer ${
                      isSelected
                        ? "bg-rose-50 text-slate-900"
                        : "bg-[#fdfaf5] text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span className="whitespace-nowrap truncate pr-1">
                      {tag.zh} <span className="font-mono text-[10px] text-slate-500 font-normal">{tag.en}</span>
                    </span>
                    <span className="w-4 h-4 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-bold text-rose-600 bg-white shrink-0">
                      ✕
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. 烹飪時間限制 Time Limit matching Image 2 */}
        <div className="p-3 sm:p-4 rounded-2xl border-2 border-slate-850 bg-white shadow-[2px_2px_0px_#1e293b] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>🕒</span>
              <span>烹飪時間限制 Time Limit</span>
            </h4>
          </div>

          {/* 3 Options */}
          <div className="grid grid-cols-3 gap-2">
            {TIME_BUDGET_OPTIONS.map((tb) => {
              const isSelected = preferences.timeLimit === tb.minutes;
              return (
                <button
                  key={tb.minutes}
                  onClick={() => onChangePreferences({ ...preferences, timeLimit: tb.minutes })}
                  className={`py-2 px-1.5 sm:px-2 rounded-xl border-2 border-slate-850 text-center transition flex flex-col items-center justify-center shadow-[1.5px_1.5px_0px_#1e293b] cursor-pointer ${
                    isSelected
                      ? "bg-cyan-100 text-slate-900 font-extrabold"
                      : "bg-[#fdfaf5] text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-1 font-extrabold text-xs whitespace-nowrap">
                    <span>{tb.icon}</span>
                    <span className="hidden sm:inline">{tb.label}</span>
                    <span className="sm:hidden">{tb.minutes} 分鐘</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 mt-0.5 whitespace-nowrap">
                    {tb.enLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hand-drawn Slider Track matching Image 2 */}
          <div className="pt-2 space-y-1">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={preferences.timeLimit}
                onChange={(e) =>
                  onChangePreferences({ ...preferences, timeLimit: parseInt(e.target.value, 10) })
                }
                className="w-full h-2.5 bg-cyan-100 rounded-lg appearance-none cursor-pointer border-2 border-slate-850 accent-cyan-600"
              />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-700 font-mono px-1">
              <span>0 min</span>
              <span className="px-2 py-0.5 rounded-full border border-slate-850 bg-white font-extrabold whitespace-nowrap">
                {preferences.timeLimit} 分鐘
              </span>
              <span>60+ min</span>
            </div>
          </div>
        </div>

        {/* Bottom Note & Estimates matching Image 2 */}
        <div className="space-y-1 pt-1 text-xs text-slate-800">
          <div className="flex items-center gap-1.5 font-bold">
            <span>💡</span>
            <span>系統已為您排除繁瑣烤箱步驟。</span>
          </div>
          <p className="text-[11px] text-slate-600 font-semibold pl-5">
            預估：備料 8 分鐘 | 料理 15 分鐘 | 一鍋到底 (One-pot Friendly)
          </p>
        </div>

        {/* CTA Button: 🪄 開始生成專屬食譜 GENERATE RECIPES */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={onBackToScan}
            className="sketch-btn px-3.5 sm:px-4 py-3 rounded-2xl bg-white text-slate-800 text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">上一步</span>
          </button>

          <button
            onClick={onGenerateRecipes}
            disabled={isLoading}
            className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl watercolor-pink sketch-btn text-slate-900 font-black text-center shadow-md active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-base sm:text-lg shrink-0">🪄</span>
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5">
              <span className="text-xs sm:text-base font-extrabold text-slate-900 whitespace-nowrap">
                開始生成專屬食譜
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-700 whitespace-nowrap hidden xs:inline">
                GENERATE RECIPES
              </span>
            </div>
          </button>
        </div>

        {/* Decorative Pencil doodle at bottom left */}
        <div className="absolute -bottom-3 -left-2 text-2xl select-none rotate-[-45deg] pointer-events-none">
          ✏️
        </div>
      </div>
    </div>
  );
};
