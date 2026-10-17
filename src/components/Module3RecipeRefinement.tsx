import React, { useState } from "react";
import {
  Clock,
  Sparkles,
  RefreshCw,
  Send,
  Check,
  Undo2,
  X,
  Sliders,
  ChevronRight,
  Palette,
  Maximize2,
  Download,
  Flame,
  ChefHat,
} from "lucide-react";
import { RecipeItem, DetectedItem, CookingPreferences, DeductionRecord, DishArtStyle } from "../types";
import { getRecipeDishImage, generateDynamicHandDrawnDishSvg } from "../utils/dishArt";

interface Module3RecipeRefinementProps {
  recipes: RecipeItem[];
  inventoryItems: DetectedItem[];
  preferences: CookingPreferences;
  onUpdateSingleRecipe: (index: number, newRecipe: RecipeItem) => void;
  onCookCompleted: (recipe: RecipeItem) => Promise<DeductionRecord>;
  onUndoDeduction: (recordId: string) => void;
  onBackToPreferences: () => void;
  lastDeductionRecord: DeductionRecord | null;
}

export const Module3RecipeRefinement: React.FC<Module3RecipeRefinementProps> = ({
  recipes,
  inventoryItems,
  preferences,
  onUpdateSingleRecipe,
  onCookCompleted,
  onUndoDeduction,
  onBackToPreferences,
  lastDeductionRecord,
}) => {
  const [refiningIndex, setRefiningIndex] = useState<number | null>(null);
  const [generatingImageIndex, setGeneratingImageIndex] = useState<number | null>(null);
  const [activeLightboxRecipe, setActiveLightboxRecipe] = useState<RecipeItem | null>(null);
  const [activeStyleMenuIndex, setActiveStyleMenuIndex] = useState<number | null>(null);
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [activeDeductionModal, setActiveDeductionModal] = useState<DeductionRecord | null>(null);
  const [isDeducting, setIsDeducting] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // If no recipes are loaded yet, provide the default featured dish from Image 3
  const activeRecipes =
    recipes.length > 0
      ? recipes
      : [
          {
            id: "featured_soup",
            title: "微波鮮蔥嫩豆腐蛋花羹",
            difficulty: "極簡",
            cookingTime: "12 分鐘",
            cookingTimeMinutes: 12,
            usedAppliances: ["微波爐"],
            onePot: true,
            prepTime: "3 分鐘",
            cookTime: "9 分鐘",
            usedIngredients: [
              { name: "雞蛋", amount: 2, unit: "顆", rawText: "雞蛋 2 顆" },
              { name: "板豆腐", amount: 0.5, unit: "塊", rawText: "板豆腐 0.5 塊 (Tofu x0.5)" },
              { name: "蔥花", amount: 1, unit: "份", rawText: "蔥花少許 (Scallions)" },
            ],
            additionalPantry: ["日式醬油", "香油", "鹽"],
            description: "微波極速鮮美熱湯，豆腐切丁吸汁，蛋花如雲朵般滑順，低脂暖胃。",
            prepSteps: ["豆腐切丁、雞蛋打散 (Dice tofu, beat eggs)"],
            cookSteps: ["加水與調味微波 3 分鐘，倒入蛋液再微波 1 分鐘 (Microwave with water, stir in eggs)"],
            highlightTag: "今日推薦",
          },
        ];

  const handleQuickReroll = async (index: number, instruction: string) => {
    setRefiningIndex(index);
    try {
      const original = activeRecipes[index];
      const res = await fetch("/api/refine-single-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalRecipe: original,
          userInstruction: instruction,
          inventoryItems,
          appliances: preferences.appliances,
        }),
      });
      const data = await res.json();
      if (data.recipe) {
        onUpdateSingleRecipe(index, data.recipe);
      }
    } catch (e) {
      console.error("Quick reroll error:", e);
    } finally {
      setRefiningIndex(null);
    }
  };

  const handleChatRefine = async (index: number) => {
    const text = chatInputs[index]?.trim();
    if (!text) return;
    setRefiningIndex(index);
    try {
      const original = activeRecipes[index];
      const res = await fetch("/api/refine-single-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalRecipe: original,
          userInstruction: text,
          inventoryItems,
          appliances: preferences.appliances,
        }),
      });
      const data = await res.json();
      if (data.recipe) {
        onUpdateSingleRecipe(index, data.recipe);
        setChatInputs((prev) => ({ ...prev, [index]: "" }));
      }
    } catch (e) {
      console.error("Chat refine error:", e);
    } finally {
      setRefiningIndex(null);
    }
  };

  const handleGenerateRecipeImage = async (index: number, style: DishArtStyle) => {
    setActiveStyleMenuIndex(null);
    setGeneratingImageIndex(index);
    try {
      const targetRecipe = activeRecipes[index];
      const res = await fetch("/api/generate-recipe-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeTitle: targetRecipe.title,
          ingredients: targetRecipe.usedIngredients?.map((i) => i.name) || [],
          cookingMethod: targetRecipe.usedAppliances?.[0] || "",
          style,
        }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        const updated = {
          ...targetRecipe,
          imageUrl: data.imageUrl,
          imageStyle: style,
        };
        onUpdateSingleRecipe(index, updated);
        setActiveLightboxRecipe((prev) => (prev && prev.id === targetRecipe.id ? updated : prev));
      } else {
        const fallbackSvg = generateDynamicHandDrawnDishSvg(targetRecipe, style);
        const updated = {
          ...targetRecipe,
          imageUrl: fallbackSvg,
          imageStyle: style,
        };
        onUpdateSingleRecipe(index, updated);
        setActiveLightboxRecipe((prev) => (prev && prev.id === targetRecipe.id ? updated : prev));
      }
    } catch (e) {
      console.error("Generate image error:", e);
      const fallbackSvg = generateDynamicHandDrawnDishSvg(activeRecipes[index], style);
      const updated = {
        ...activeRecipes[index],
        imageUrl: fallbackSvg,
        imageStyle: style,
      };
      onUpdateSingleRecipe(index, updated);
      setActiveLightboxRecipe((prev) => (prev && prev.id === activeRecipes[index].id ? updated : prev));
    } finally {
      setGeneratingImageIndex(null);
    }
  };

  const handleGenerateAllRecipeImages = async (style: DishArtStyle = "watercolor") => {
    setIsGeneratingAll(true);
    try {
      for (let i = 0; i < activeRecipes.length; i++) {
        await handleGenerateRecipeImage(i, style);
      }
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleTriggerCookComplete = async (recipe: RecipeItem) => {
    setIsDeducting(true);
    try {
      const record = await onCookCompleted(recipe);
      setActiveDeductionModal(record);
    } finally {
      setIsDeducting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 font-sans">
      {/* Top Sketchbook Container matching Image 3 */}
      <div className="sketch-border-thick rounded-3xl bg-[#fffdf9] p-5 sm:p-7 shadow-xl space-y-5 relative">
        {/* Top Protocol Header */}
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-300">
          <span className="font-extrabold text-slate-800 text-sm tracking-wide">
            智慧廚房
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-700">
            CYBERVISION STUDIO // RECIPE PROTOCOL
          </span>
        </div>

        {/* Title Header with Pan and Notes Doodles */}
        <div className="flex items-start justify-between border-b-2 border-slate-850 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>智慧食譜與庫存扣除</span>
              <span className="text-lg">🍲</span>
              <span className="text-lg">📝</span>
            </h2>
            <p className="text-xs font-bold text-slate-600 tracking-wide mt-0.5 font-mono">
              Smart Recipe & Deduction
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-slate-850 bg-emerald-50 shadow-sm shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-800"></span>
            <span className="text-xs font-extrabold text-slate-850">食譜已生成</span>
            <span className="text-[10px] font-bold text-slate-600 font-mono">RECIPE GENERATED</span>
          </div>
        </div>

        {/* AI Watercolor Dish Illustration Studio Bar */}
        <div className="watercolor-card p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-50/90 via-rose-50/80 to-sky-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-200 border-2 border-slate-800 flex items-center justify-center text-lg shrink-0 shadow-xs">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900">
                  AI 手繪水彩料理寫生藝廊
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 border border-amber-400 font-mono">
                  WATERCOLOR STUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                每道推薦食譜均配備真實食材對應之手繪水彩成品示意照，支援點擊放大與風格重繪。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleGenerateAllRecipeImages("watercolor")}
              disabled={isGeneratingAll || generatingImageIndex !== null}
              className="watercolor-btn-primary px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap w-full sm:w-auto"
              title="一鍵呼叫 AI 依據每道食譜食材與工法，批量繪製水彩手繪料理照片"
            >
              {isGeneratingAll ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-800 shrink-0" />
                  <span>AI 繪製全體食譜中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>AI 一鍵繪製全體水彩照片</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recipe Cards List */}
        <div className="space-y-5">
          {activeRecipes.map((recipe, idx) => {
            const isRefiningThis = refiningIndex === idx;
            const dishImage = getRecipeDishImage(recipe, recipe.imageStyle);

            return (
              <div
                key={recipe.id || idx}
                className="sketch-border rounded-2xl bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#1e293b] space-y-4 relative overflow-hidden"
              >
                {/* Refining Overlay */}
                {isRefiningThis && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center space-y-2 p-4 text-center">
                    <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
                    <div className="text-xs font-bold text-slate-900">
                      AI 正在依您的需求微調此道菜色...
                    </div>
                  </div>
                )}

                {/* Recipe Card Header matching Image 3 */}
                <div className="border-b-2 border-slate-850 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-1.5">
                    <span>🍲</span>
                    <span>
                      今日推薦：{recipe.title}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono font-bold pl-6">
                    ({recipe.title === "微波鮮蔥嫩豆腐蛋花羹" ? "Microwave Tofu Egg Drop Soup" : "Special Chef Recipe"})
                  </span>
                </div>

                {/* Recipe Content Row: Left illustration + Right Details */}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Left illustrated food thumbnail & AI Art Generator */}
                  <div className="flex flex-col items-center gap-2 shrink-0 mx-auto sm:mx-0">
                    <div
                      onClick={() => setActiveLightboxRecipe(recipe)}
                      className="w-32 h-32 rounded-2xl border-2 border-slate-850 bg-[#fffdf8] overflow-hidden shadow-[2px_2px_0px_#1e293b] relative group/dish cursor-pointer transition-transform hover:scale-[1.02]"
                      title="點擊放大檢視手繪原稿與食材解析"
                    >
                      <img
                        src={dishImage}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Loading overlay for image generation */}
                      {generatingImageIndex === idx && (
                        <div className="absolute inset-0 bg-white/92 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center z-10">
                          <Palette className="w-6 h-6 text-amber-600 animate-bounce" />
                          <span className="text-[10px] font-bold text-slate-900 mt-1">
                            AI 手繪創作中...
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay with Zoom Icon */}
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/dish:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-xs font-bold">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-[10px]">點擊看大圖</span>
                      </div>

                      {/* Hand-drawn badge */}
                      <div className="absolute bottom-1 left-1 bg-slate-900/80 backdrop-blur-xs text-[9px] font-bold text-amber-200 px-1.5 py-0.5 rounded border border-slate-700">
                        手繪照片 🎨
                      </div>
                    </div>

                    {/* AI Redraw & Style Selector Button */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveStyleMenuIndex(activeStyleMenuIndex === idx ? null : idx)
                        }
                        disabled={generatingImageIndex === idx}
                        className="sketch-btn px-2.5 py-1 text-[11px] font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-800 flex items-center justify-center gap-1 shadow-xs cursor-pointer whitespace-nowrap"
                      >
                        <Palette className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>AI 繪製手繪照片</span>
                      </button>

                      {/* Style Menu Dropdown */}
                      {activeStyleMenuIndex === idx && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-30 w-44 bg-white rounded-xl border-2 border-slate-850 p-1.5 shadow-xl space-y-1 text-xs font-bold animate-in fade-in zoom-in-95 duration-150">
                          <div className="text-[10px] text-slate-400 font-mono px-2 py-0.5">
                            選擇 AI 手繪畫風
                          </div>
                          <button
                            onClick={() => handleGenerateRecipeImage(idx, "watercolor")}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 text-slate-850 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>🎨</span>
                            <span>溫暖水彩風</span>
                          </button>
                          <button
                            onClick={() => handleGenerateRecipeImage(idx, "japanese_cookbook")}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 text-slate-850 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>🍱</span>
                            <span>日式食譜書風</span>
                          </button>
                          <button
                            onClick={() => handleGenerateRecipeImage(idx, "colored_pencil")}
                            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-amber-50 text-slate-850 flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>✏️</span>
                            <span>精緻色鉛筆風</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Time, Appliance, and Ingredient Checklist */}
                  <div className="flex-1 space-y-2.5">
                    {/* Time & Appliance */}
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{recipe.cookingTime}</span>
                        <span className="text-slate-500 font-mono font-normal">{recipe.cookingTimeMinutes || 12} min</span>
                      </div>
                      <span className="text-slate-400">|</span>
                      <div className="flex items-center gap-1">
                        <span>🔌</span>
                        <span>{recipe.usedAppliances?.join("、") || "微波爐"}</span>
                        <span className="text-slate-500 font-mono font-normal">Microwave</span>
                      </div>
                    </div>

                    {/* Ingredient checklist with ☑️ icons */}
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-850 pt-1">
                      {recipe.usedIngredients?.map((ing, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-600"
                        >
                          <span className="text-emerald-700">☑️</span>
                          <span>{ing.rawText || `${ing.name} ${ing.amount}${ing.unit}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Steps Section: 備料 Prepare vs 料理 Cook */}
                <div className="p-3 rounded-xl border-2 border-slate-850 bg-[#faf6ee] text-xs space-y-2">
                  <div className="flex items-start gap-1.5">
                    <span className="font-extrabold text-slate-900 shrink-0">
                      備料 Prepare:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {recipe.prepSteps?.join("、") || "豆腐切丁、雞蛋打散 (Dice tofu, beat eggs)"}
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 pt-1 border-t border-slate-300">
                    <span className="font-extrabold text-slate-900 shrink-0">
                      料理 Cook:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {recipe.cookSteps?.join("，") || "加水與調味微波 3 分鐘，倒入蛋液再微波 1 分鐘 (Microwave with water, stir in eggs)"}
                    </span>
                  </div>
                </div>

                {/* Dynamic Re-roll & Chat Controls matching Image 3 */}
                <div className="pt-2 space-y-2.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
                    <span>動態換菜與微調控制 (One-Click Re-roll & Chat)</span>
                  </div>

                  {/* 3 Quick Chips matching Image 3 */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleQuickReroll(idx, "換一道免開火料理")}
                      className="py-1.5 px-1 sm:px-2 rounded-xl border-2 border-slate-850 bg-white hover:bg-slate-100 text-slate-900 text-center text-xs font-bold transition shadow-[1.5px_1.5px_0px_#1e293b] cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <span>🔄</span>
                        <span>免開火</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 font-normal whitespace-nowrap">
                        No Cook
                      </div>
                    </button>

                    <button
                      onClick={() => handleQuickReroll(idx, "步驟再減半（只要 2 步驟）")}
                      className="py-1.5 px-1 sm:px-2 rounded-xl border-2 border-slate-850 bg-white hover:bg-slate-100 text-slate-900 text-center text-xs font-bold transition shadow-[1.5px_1.5px_0px_#1e293b] cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <span>⚡</span>
                        <span>步驟減半</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 font-normal whitespace-nowrap">
                        Quick
                      </div>
                    </button>

                    <button
                      onClick={() => handleQuickReroll(idx, "優先消耗快過期的高麗菜")}
                      className="py-1.5 px-1 sm:px-2 rounded-xl border-2 border-slate-850 bg-white hover:bg-slate-100 text-slate-900 text-center text-xs font-bold transition shadow-[1.5px_1.5px_0px_#1e293b] cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                        <span>🥬</span>
                        <span className="hidden sm:inline">優先消耗高麗菜</span>
                        <span className="sm:hidden">消耗高麗菜</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 font-normal whitespace-nowrap">
                        Cabbage First
                      </div>
                    </button>
                  </div>

                  {/* Chat input box */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="💬 換成酸辣口味/不想吃太油..."
                        value={chatInputs[idx] || ""}
                        onChange={(e) =>
                          setChatInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleChatRefine(idx)}
                        className="w-full text-xs px-3 py-2 rounded-xl border-2 border-slate-850 bg-white text-slate-900 placeholder-slate-500 focus:outline-none shadow-[1.5px_1.5px_0px_#1e293b]"
                      />
                    </div>
                    <button
                      onClick={() => handleChatRefine(idx)}
                      disabled={isRefiningThis || !chatInputs[idx]?.trim()}
                      className="px-3 py-2 rounded-xl border-2 border-slate-850 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs shadow-[1.5px_1.5px_0px_#1e293b] transition cursor-pointer whitespace-nowrap shrink-0"
                    >
                      發送
                    </button>
                  </div>
                </div>

                {/* Cook Finished & Deduct CTA matching Image 3 */}
                <div className="pt-3 border-t-2 border-slate-850">
                  <button
                    onClick={() => handleTriggerCookComplete(recipe)}
                    disabled={isDeducting}
                    className="w-full py-3 px-4 rounded-2xl bg-[#bbf7d0] hover:bg-[#86efac] border-2 border-slate-850 text-slate-900 font-extrabold text-center shadow-[2.5px_2.5px_0px_#1e293b] active:scale-98 transition flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black whitespace-nowrap">
                      <span>☑️</span>
                      <span>烹飪完成！扣除庫存</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-700 whitespace-nowrap">
                      (Cook Finished & Deduct)
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={onBackToPreferences}
            className="sketch-btn px-4 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold flex items-center gap-1"
          >
            <span>← 調整偏好設定</span>
          </button>
        </div>
      </div>

      {/* Deduction Modal Popup matching Image 3 */}
      {activeDeductionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="sketch-border-thick rounded-3xl bg-[#fffdf9] w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 relative">
            {/* Modal Title matching Image 3 */}
            <div className="text-center pb-2 border-b-2 border-slate-850">
              <div className="flex items-center justify-center gap-1.5 text-base sm:text-lg font-black text-slate-900">
                <span>☑️</span>
                <span>烹飪完成！扣除冰箱庫存</span>
              </div>
              <p className="text-xs font-bold text-slate-500 font-mono mt-0.5">
                Deduct Inventory?
              </p>
            </div>

            {/* Deduction summary text matching Image 3 */}
            <div className="space-y-3 py-1 text-center font-bold text-xs sm:text-sm text-slate-800">
              <div className="p-3 rounded-2xl border-2 border-slate-850 bg-[#faf6ee] space-y-2">
                <div className="text-slate-900">
                  已自庫存扣除：
                  <span className="font-extrabold text-rose-700">
                    {activeDeductionModal.deductions.map((d) => `${d.name} ${d.deductedAmount}`).join("、")}
                  </span>
                </div>

                <div className="text-slate-700 text-xs">
                  冰箱尚餘：
                  {activeDeductionModal.deductions.map((d) => `${d.name} ${d.remainingQty}`).join("、")}
                </div>
              </div>

              {/* Next meal link matching Image 3 */}
              <div className="p-3 rounded-2xl border-2 border-slate-850 bg-amber-50 text-xs text-slate-800 text-left space-y-1">
                <div className="flex items-center gap-1 text-amber-900 font-extrabold">
                  <span>💡</span>
                  <span>連鎖推薦：</span>
                </div>
                <p className="font-bold text-slate-800 leading-relaxed pl-4">
                  {activeDeductionModal.nextMealSuggestion}
                </p>
              </div>
            </div>

            {/* Modal action buttons matching Image 3 */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setActiveDeductionModal(null)}
                className="py-2.5 px-4 rounded-2xl bg-[#fca5a5] hover:bg-[#f87171] border-2 border-slate-850 text-slate-900 font-black text-center shadow-[2px_2px_0px_#1e293b] active:scale-98 transition flex flex-col items-center justify-center"
              >
                <span className="text-xs font-extrabold">確認更新</span>
                <span className="text-[10px] font-mono font-bold text-slate-700">
                  Confirm Deduct
                </span>
              </button>

              <button
                onClick={() => {
                  onUndoDeduction(activeDeductionModal.id);
                  setActiveDeductionModal(null);
                }}
                className="py-2.5 px-4 rounded-2xl bg-[#e2e8f0] hover:bg-[#cbd5e1] border-2 border-slate-850 text-slate-900 font-black text-center shadow-[2px_2px_0px_#1e293b] active:scale-98 transition flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-xs font-extrabold">手滑復原</span>
                <span className="text-[10px] font-mono font-bold text-slate-700">
                  Undo
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Hand-drawn Food Photo & Ingredient Mapping */}
      {activeLightboxRecipe && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="sketch-border-thick rounded-3xl bg-[#fffdf9] w-full max-w-2xl shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 relative max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-850 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl border-2 border-slate-850 bg-amber-100 flex items-center justify-center text-xl shadow-[1.5px_1.5px_0px_#1e293b]">
                  🎨
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{activeLightboxRecipe.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                      手繪實物照
                    </span>
                  </h3>
                  <p className="text-xs font-bold text-slate-500 font-mono">
                    CHEF'S HAND-DRAWN WATERCOLOR CULINARY ART
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveLightboxRecipe(null)}
                className="p-1.5 rounded-xl border-2 border-slate-850 bg-white hover:bg-slate-100 text-slate-800 transition cursor-pointer shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Row: Large Food Art + Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Left Large Dish Art */}
              <div className="relative rounded-2xl border-2 border-slate-850 bg-[#fffdf8] p-2 shadow-[3px_3px_0px_#1e293b] aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={getRecipeDishImage(activeLightboxRecipe, activeLightboxRecipe.imageStyle)}
                  alt={activeLightboxRecipe.title}
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-[10px] text-amber-200 font-bold px-2 py-1 rounded-lg border border-slate-700">
                  ✨ 職人純手繪原畫
                </div>
              </div>

              {/* Right Dish Details & Ingredients Mapping */}
              <div className="space-y-3">
                {/* Intro */}
                <div className="p-3 rounded-xl border-2 border-slate-850 bg-amber-50/70 text-xs text-slate-850 space-y-1">
                  <div className="font-extrabold text-amber-950 flex items-center gap-1">
                    <span>🍲</span>
                    <span>視覺呈現特色：</span>
                  </div>
                  <p className="font-medium leading-relaxed text-slate-700">
                    採用日式繪本溫暖水彩手繪技法，精準還原食材色澤：黃金蛋花輕柔流動、嫩豆腐方正分明、翠綠蔥花清脆點綴，帶來如日劇深夜食堂般的治癒感。
                  </p>
                </div>

                {/* Corresponding Ingredients list */}
                <div className="space-y-1.5">
                  <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    <span>🌱</span>
                    <span>畫面中對應食材：</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeLightboxRecipe.usedIngredients?.map((ing, iIdx) => (
                      <span
                        key={iIdx}
                        className="text-xs font-bold px-2 py-1 rounded-lg border-2 border-slate-850 bg-emerald-50 text-emerald-900 shadow-[1px_1px_0px_#1e293b]"
                      >
                        ✓ {ing.rawText || `${ing.name} ${ing.amount}${ing.unit}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cooking Meta */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-800">
                  <div className="p-2 rounded-xl border-2 border-slate-850 bg-white shadow-xs">
                    <div className="text-slate-400 text-[10px] font-mono">COOK TIME</div>
                    <div className="text-slate-900">{activeLightboxRecipe.cookingTime}</div>
                  </div>
                  <div className="p-2 rounded-xl border-2 border-slate-850 bg-white shadow-xs">
                    <div className="text-slate-400 text-[10px] font-mono">APPLIANCE</div>
                    <div className="text-slate-900">
                      {activeLightboxRecipe.usedAppliances?.join("、") || "一般廚具"}
                    </div>
                  </div>
                </div>

                {/* Style Switcher inside Lightbox */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5 text-amber-600" />
                      <span>切換 AI 手繪寫生畫風：</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeLightboxRecipe.imageStyle || "watercolor"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {[
                      { id: "watercolor", label: "🎨 溫暖水彩風" },
                      { id: "japanese_cookbook", label: "🍱 日式食譜風" },
                      { id: "colored_pencil", label: "✏️ 柔和色鉛筆" },
                      { id: "vintage_sketch", label: "📜 復古手帳速寫" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          const idx = activeRecipes.findIndex((r) => r.id === activeLightboxRecipe.id);
                          if (idx !== -1) {
                            handleGenerateRecipeImage(idx, st.id as DishArtStyle);
                          } else {
                            const newSvg = generateDynamicHandDrawnDishSvg(activeLightboxRecipe, st.id as DishArtStyle);
                            const updated = {
                              ...activeLightboxRecipe,
                              imageUrl: newSvg,
                              imageStyle: st.id as DishArtStyle,
                            };
                            setActiveLightboxRecipe(updated);
                          }
                        }}
                        className={`px-2 py-1.5 rounded-lg border-1.5 font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          (activeLightboxRecipe.imageStyle || "watercolor") === st.id
                            ? "bg-amber-300 text-slate-900 border-slate-900 shadow-xs"
                            : "bg-white hover:bg-amber-50 text-slate-700 border-slate-300"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={getRecipeDishImage(activeLightboxRecipe, activeLightboxRecipe.imageStyle)}
                    download={`${activeLightboxRecipe.title}-手繪示意圖.svg`}
                    className="flex-1 py-2 px-3 rounded-xl border-2 border-slate-850 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center shadow-[2px_2px_0px_#1e293b] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>下載手繪圖鑑</span>
                  </a>
                  <button
                    onClick={() => setActiveLightboxRecipe(null)}
                    className="py-2 px-4 rounded-xl border-2 border-slate-850 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-[2px_2px_0px_#1e293b] cursor-pointer"
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
