import React, { useState, useEffect } from "react";
import { X, ChefHat, Clock, Sparkles, RefreshCw, CheckCircle, Utensils, AlertCircle } from "lucide-react";
import { DetectedItem, RecipeItem } from "../types";
import { getRecipeDishImage } from "../utils/dishArt";

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DetectedItem[];
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    if (items.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/suggest-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes);
      } else {
        setError("未取得食譜推薦，請稍後重試");
      }
    } catch (e: any) {
      setError(e.message || "生成食譜時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && recipes.length === 0 && items.length > 0) {
      fetchRecipes();
    }
  }, [isOpen, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>智慧大廚・現有食材零浪費推薦</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  AI 生成
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                專為冰箱現有的 {items.length} 項食材量身打造，減少浪費、快速開飯
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecipes}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition flex items-center gap-1 text-xs border border-slate-700"
              title="重新生成食譜"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">換一批</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto animate-bounce">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-200 text-sm">
                AI 大廚正在思考最佳菜單...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                分析冰箱內的 {items.map((i) => i.name).slice(0, 5).join("、")} 等食材搭配
              </p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recipes.map((recipe, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition shadow-lg overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Hand-drawn Dish Illustration */}
                    <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-700 bg-[#fffdf8] relative group">
                      <img
                        src={getRecipeDishImage(recipe)}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-[9px] text-amber-200 px-1.5 py-0.5 rounded font-bold border border-slate-700">
                        手繪示意圖 🎨
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-slate-100 group-hover:text-amber-400">
                        {recipe.title}
                      </h4>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 shrink-0">
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {recipe.cookingTime}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {recipe.description}
                    </p>

                    {/* Ingredients tags */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-emerald-400">
                        冰箱現有食材：
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.usedIngredients?.map((ing: any, i: number) => {
                          const text = typeof ing === "string" ? ing : (ing.rawText || `${ing.name} ${ing.amount || ""}${ing.unit || ""}`);
                          return (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            >
                              ✓ {text}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {recipe.additionalPantry && recipe.additionalPantry.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[11px] font-semibold text-slate-400">
                          常備調味料/副料：
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recipe.additionalPantry.map((ing, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Steps */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-700/60">
                      <div className="text-[11px] font-semibold text-slate-300">
                        料理步驟：
                      </div>
                      <ol className="text-[11px] text-slate-400 space-y-1 list-decimal list-inside leading-relaxed">
                        {(recipe.cookSteps || (recipe as any).steps || []).map((step: string, sIdx: number) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>推薦食譜會隨著您冰箱盤點內容的增減動態調整</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            返回盤點
          </button>
        </div>
      </div>
    </div>
  );
};
