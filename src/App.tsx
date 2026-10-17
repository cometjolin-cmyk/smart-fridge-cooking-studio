import React, { useState } from "react";
import { Header } from "./components/Header";
import { Module1VisualDetection } from "./components/Module1VisualDetection";
import { Module2PreferencesFilter } from "./components/Module2PreferencesFilter";
import { Module3RecipeRefinement } from "./components/Module3RecipeRefinement";
import { FridgeVisualizer } from "./components/FridgeVisualizer";
import { ExportCodeModal } from "./components/ExportCodeModal";
import { RecipeModal } from "./components/RecipeModal";
import { EditItemModal } from "./components/EditItemModal";
import { IntroAnimationModal } from "./components/IntroAnimationModal";
import { PRESET_FRIDGES } from "./data/presets";
import {
  DetectedItem,
  CookingPreferences,
  RecipeItem,
  DeductionRecord,
  ShelfType,
} from "./types";
import { convertImageUrlToBase64 } from "./utils/helpers";
import {
  Camera,
  Sliders,
  ChefHat,
  Refrigerator,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export default function App() {
  // Step Wizard State: 1 | 2 | 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Tab View for Fridge Visualizer vs 3 Modules
  const [showFridgeShelfView, setShowFridgeShelfView] = useState(false);
  const [activeFilterShelf, setActiveFilterShelf] = useState<ShelfType | "all">("all");

  // Module 1 State: Inventory & Image
  const [selectedPreset, setSelectedPreset] = useState(PRESET_FRIDGES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>(PRESET_FRIDGES[0].detectedItems);
  const [isScanning, setIsScanning] = useState(false);

  // Module 2 State: Cooking Preferences
  const [preferences, setPreferences] = useState<CookingPreferences>({
    appliances: ["pan", "rice_cooker", "air_fryer"],
    dietStyles: ["high_protein"],
    allergiesAndAvoid: ["不吃香菜"],
    timeLimit: 30,
    onePotPreferred: true,
  });

  // Module 3 State: Recipes & Deduction
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [deductionHistory, setDeductionHistory] = useState<DeductionRecord[]>([]);

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DetectedItem | null>(null);
  const [showIntroAnimation, setShowIntroAnimation] = useState(() => {
    const pref = localStorage.getItem("smart_kitchen_autoplay_intro");
    return pref === null ? true : pref === "true";
  });

  // Active fridge photo source
  const activeImage = customImage || selectedPreset.imageUrl;

  // Run AI Detection for Module 1
  const handleRunDetection = async () => {
    setIsScanning(true);
    try {
      const { base64, mimeType } = await convertImageUrlToBase64(activeImage);
      const res = await fetch("/api/detect-fridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          prompt: "請幫我盤點這張手繪冰箱插畫中的所有食材，標註位置與數量。",
        }),
      });
      const data = await res.json();
      if (data.detected_items && Array.isArray(data.detected_items)) {
        setDetectedItems(data.detected_items);
      }
    } catch (e) {
      console.error("Scan error:", e);
    } finally {
      setIsScanning(false);
    }
  };

  // Step 2 Generate Recipes
  const handleGenerateRecipes = async () => {
    setIsGeneratingRecipes(true);
    try {
      const selectedItems = detectedItems.filter((i) => i.isSelected !== false);
      const res = await fetch("/api/generate-custom-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryItems: selectedItems,
          appliances: preferences.appliances,
          dietStyles: preferences.dietStyles,
          allergiesAndAvoid: preferences.allergiesAndAvoid,
          timeLimit: preferences.timeLimit,
          onePotPreferred: preferences.onePotPreferred,
        }),
      });
      const data = await res.json();
      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes);
        setCurrentStep(3);
      }
    } catch (e) {
      console.error("Generate recipes error:", e);
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  // Step 3 Cooking Complete & Inventory Deduction
  const handleCookCompleted = async (recipe: RecipeItem): Promise<DeductionRecord> => {
    const res = await fetch("/api/deduct-inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentInventory: detectedItems,
        recipe,
      }),
    });
    const data = await res.json();
    const newRecord: DeductionRecord = {
      id: `deduct_${Date.now()}`,
      timestamp: Date.now(),
      recipeTitle: recipe.title,
      deductions: data.deductions || [],
      remainingSnapshot: detectedItems,
      nextMealSuggestion: data.nextMealSuggestion || "💡 建議明天晚餐：高麗菜炒蛋，剛好用完所有生鮮！",
    };

    setDeductionHistory((prev) => [newRecord, ...prev]);
    if (data.updatedInventory) {
      setDetectedItems(data.updatedInventory);
    }
    return newRecord;
  };

  // Undo Deduction
  const handleUndoDeduction = (recordId: string) => {
    const record = deductionHistory.find((r) => r.id === recordId);
    if (record && record.remainingSnapshot) {
      setDetectedItems(record.remainingSnapshot);
      setDeductionHistory((prev) => prev.filter((r) => r.id !== recordId));
    }
  };

  const handleUpdateSingleRecipe = (index: number, newRecipe: RecipeItem) => {
    setRecipes((prev) => {
      const updated = [...prev];
      updated[index] = newRecipe;
      return updated;
    });
  };

  const avgConfidence =
    detectedItems.length > 0
      ? detectedItems.reduce((acc, it) => acc + (it.confidence || 0.9), 0) /
        detectedItems.length
      : 0;

  return (
    <div className="min-h-screen paper-bg text-slate-850 flex flex-col font-sans selection:bg-amber-300">
      {/* Top Header */}
      <Header
        totalItems={detectedItems.length}
        avgConfidence={avgConfidence}
        onOpenAddItemModal={() => {
          setEditingItem(null);
          setIsEditModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-5 space-y-5">
        {/* Step Wizard Bar in Hand-Drawn Style */}
        <div className="sketch-border rounded-2xl bg-white p-2.5 sm:p-3 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => {
                setCurrentStep(1);
                setShowFridgeShelfView(false);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap sketch-btn cursor-pointer ${
                currentStep === 1 && !showFridgeShelfView
                  ? "bg-amber-200 text-slate-900"
                  : "bg-[#faf6ee] text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>1</span>
              <span>📸</span>
              <span className="hidden sm:inline">照片辨識盤點</span>
              <span className="sm:hidden">食材盤點</span>
            </button>

            <span className="text-slate-400 font-bold hidden sm:inline">→</span>

            <button
              onClick={() => {
                setCurrentStep(2);
                setShowFridgeShelfView(false);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap sketch-btn cursor-pointer ${
                currentStep === 2 && !showFridgeShelfView
                  ? "bg-cyan-200 text-slate-900"
                  : "bg-[#faf6ee] text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>2</span>
              <span>⚙️</span>
              <span className="hidden sm:inline">偏好與設備限制</span>
              <span className="sm:hidden">偏好限制</span>
            </button>

            <span className="text-slate-400 font-bold hidden sm:inline">→</span>

            <button
              onClick={() => {
                if (recipes.length === 0) {
                  handleGenerateRecipes();
                } else {
                  setCurrentStep(3);
                }
                setShowFridgeShelfView(false);
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap sketch-btn cursor-pointer ${
                currentStep === 3 && !showFridgeShelfView
                  ? "bg-emerald-200 text-slate-900"
                  : "bg-[#faf6ee] text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>3</span>
              <span>🍲</span>
              <span className="hidden sm:inline">食譜與庫存扣除</span>
              <span className="sm:hidden">智慧食譜</span>
            </button>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setShowFridgeShelfView(!showFridgeShelfView)}
              className={`sketch-btn px-3 py-1 text-xs font-bold rounded-xl flex items-center gap-1.5 ${
                showFridgeShelfView
                  ? "bg-indigo-100 text-indigo-900"
                  : "bg-white text-slate-800"
              }`}
            >
              <Refrigerator className="w-3.5 h-3.5" />
              <span>{showFridgeShelfView ? "返回手帳流程" : "4層架檢視"}</span>
            </button>
          </div>
        </div>

        {/* View Content */}
        {showFridgeShelfView ? (
          <div className="sketch-border-thick rounded-3xl bg-white p-5 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>🧊 實境 4 層架物理冰箱檢視</span>
              </h2>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {detectedItems.length} 項食材
              </span>
            </div>

            <FridgeVisualizer
              items={detectedItems}
              onMoveItem={(itemId, shelf) => {
                setDetectedItems((prev) =>
                  prev.map((it) => (it.id === itemId ? { ...it, shelf } : it))
                );
              }}
              onEditItem={(item) => {
                setEditingItem(item);
                setIsEditModalOpen(true);
              }}
              onDeleteItem={(itemId) => {
                setDetectedItems((prev) => prev.filter((it) => it.id !== itemId));
              }}
              activeFilterShelf={activeFilterShelf}
              onSelectFilterShelf={setActiveFilterShelf}
            />
          </div>
        ) : (
          <>
            {/* Step 1: Visual Detection */}
            {currentStep === 1 && (
              <Module1VisualDetection
                items={detectedItems}
                onUpdateItems={setDetectedItems}
                activeImage={activeImage}
                onSelectPreset={(preset) => {
                  setSelectedPreset(preset);
                  setCustomImage(null);
                  setDetectedItems(preset.detectedItems);
                }}
                onCustomImageUpload={(dataUrl) => {
                  setCustomImage(dataUrl);
                }}
                onRunDetection={handleRunDetection}
                isLoading={isScanning}
                onConfirmAndContinue={() => setCurrentStep(2)}
              />
            )}

            {/* Step 2: Preferences & Constraints */}
            {currentStep === 2 && (
              <Module2PreferencesFilter
                preferences={preferences}
                onChangePreferences={setPreferences}
                selectedItems={detectedItems.filter((i) => i.isSelected !== false)}
                onBackToScan={() => setCurrentStep(1)}
                onGenerateRecipes={handleGenerateRecipes}
                isLoading={isGeneratingRecipes}
              />
            )}

            {/* Step 3: Recipe Refinement & Deduction */}
            {currentStep === 3 && (
              <Module3RecipeRefinement
                recipes={recipes}
                inventoryItems={detectedItems}
                preferences={preferences}
                onUpdateSingleRecipe={handleUpdateSingleRecipe}
                onCookCompleted={handleCookCompleted}
                onUndoDeduction={handleUndoDeduction}
                onBackToPreferences={() => setCurrentStep(2)}
                lastDeductionRecord={deductionHistory[0] || null}
              />
            )}
          </>
        )}
      </main>

      {/* Footer in Sketchbook style */}
      <footer className="border-t-2 border-slate-800 bg-[#fbf8f1] py-4 text-center text-xs font-bold text-slate-700">
        <p>
          智慧手繪手帳風料理助手 • CYBERVISION STUDIO RECIPE PROTOCOL
        </p>
      </footer>

      {/* Modals */}
      <ExportCodeModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        detectedItems={detectedItems}
      />

      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        items={detectedItems}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingItem(null);
        }}
        onSave={(item) => {
          setDetectedItems((prev) => {
            const exists = prev.some((it) => it.id === item.id);
            if (exists) {
              return prev.map((it) => (it.id === item.id ? { ...it, ...item } : it));
            }
            return [{ ...item, category: item.shelf === "door" ? "pantry" : "fresh", numericQty: 1, unit: "份" }, ...prev];
          });
        }}
        initialItem={editingItem}
      />

      {/* Opening Intro Animation Modal (MP4 Video) */}
      <IntroAnimationModal
        isOpen={showIntroAnimation}
        onClose={() => setShowIntroAnimation(false)}
      />
    </div>
  );
}
