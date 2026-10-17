import React from "react";
import { DetectedItem, ShelfType } from "../types";
import { SHELF_CONFIGS } from "../data/presets";
import { getIngredientEmoji, getConfidenceBadge } from "../utils/helpers";
import {
  Layers,
  ArrowUpDown,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  MoveRight,
  Info,
} from "lucide-react";

interface FridgeVisualizerProps {
  items: DetectedItem[];
  onMoveItem: (itemId: string, targetShelf: ShelfType) => void;
  onEditItem: (item: DetectedItem) => void;
  onDeleteItem: (itemId: string) => void;
  activeFilterShelf: ShelfType | "all";
  onSelectFilterShelf: (shelf: ShelfType | "all") => void;
}

export const FridgeVisualizer: React.FC<FridgeVisualizerProps> = ({
  items,
  onMoveItem,
  onEditItem,
  onDeleteItem,
  activeFilterShelf,
  onSelectFilterShelf,
}) => {
  const shelfOrder: ShelfType[] = ["upper", "middle", "drawer", "door"];

  // Filter shelves if user selected a single shelf filter
  const displayedShelves =
    activeFilterShelf === "all"
      ? shelfOrder
      : shelfOrder.filter((s) => s === activeFilterShelf);

  return (
    <div className="space-y-4">
      {/* Shelf Filter Chips & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            層架過濾：
          </span>
          <button
            onClick={() => onSelectFilterShelf("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              activeFilterShelf === "all"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            全部顯示 ({items.length})
          </button>
          {shelfOrder.map((shelfKey) => {
            const shelf = SHELF_CONFIGS[shelfKey];
            const count = items.filter((it) => it.shelf === shelfKey).length;
            const isSelected = activeFilterShelf === shelfKey;
            return (
              <button
                key={shelfKey}
                onClick={() => onSelectFilterShelf(shelfKey)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-700 text-white ring-1 ring-emerald-400 font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>{shelf.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px] text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>點選卡片右下箭頭可自由調整食材歸屬層架</span>
        </div>
      </div>

      {/* Refrigerator Frame Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-slate-700 shadow-2xl overflow-hidden p-3 sm:p-5">
        {/* Top Metallic Refrigerator Trim */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 opacity-60"></div>

        {/* Shelves Column */}
        <div className="space-y-4">
          {displayedShelves.map((shelfKey) => {
            const config = SHELF_CONFIGS[shelfKey];
            const shelfItems = items.filter((it) => it.shelf === shelfKey);

            return (
              <div
                key={shelfKey}
                className={`rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm p-3.5 sm:p-4.5 transition-all shadow-inner`}
              >
                {/* Shelf Header */}
                <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-700/50 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: config.accentColor }}
                    />
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                      {config.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({config.englishName})
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${config.borderColor} ${config.color} bg-slate-900/60`}
                    >
                      {config.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono hidden sm:inline">
                      溫控: {config.recommendedTemp}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 font-bold border border-slate-700">
                      {shelfItems.length} 項
                    </span>
                  </div>
                </div>

                {/* Items in Shelf */}
                {shelfItems.length === 0 ? (
                  <div className="py-6 text-center rounded-lg border border-dashed border-slate-700/60 bg-slate-900/40">
                    <p className="text-xs text-slate-400">
                      目前此層架尚無辨識到食材
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      建議存放：{config.allowedCategories.join("、")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {shelfItems.map((item) => {
                      const emoji = getIngredientEmoji(item.name, item.id);
                      const confBadge = getConfidenceBadge(item.confidence);

                      return (
                        <div
                          key={item.id}
                          className="group relative bg-slate-900/90 hover:bg-slate-800/95 border border-slate-700/70 hover:border-slate-500 rounded-xl p-3 transition shadow-md flex flex-col justify-between"
                        >
                          <div>
                            {/* Top row: Emoji, Name, and Confidence */}
                            <div className="flex items-start justify-between gap-1.5 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                                  {emoji}
                                </span>
                                <div>
                                  <div className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    ID: {item.id}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-medium ${confBadge.bg} ${confBadge.textCol}`}
                                title={`視覺辨識置信度: ${Math.round(
                                  item.confidence * 100
                                )}%`}
                              >
                                {confBadge.text}
                              </span>
                            </div>

                            {/* Quantity Badge */}
                            <div className="flex items-center justify-between text-xs my-2 px-2 py-1 rounded bg-slate-950/70 border border-slate-800">
                              <span className="text-slate-400 text-[11px]">推估數量:</span>
                              <span className="font-bold text-amber-300">
                                {item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1 text-xs">
                            {/* Shelf Relocate selector */}
                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                              <span>移至:</span>
                              <select
                                value={item.shelf}
                                onChange={(e) =>
                                  onMoveItem(item.id, e.target.value as ShelfType)
                                }
                                className="bg-slate-800 text-slate-200 text-[11px] rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                              >
                                <option value="upper">上層</option>
                                <option value="middle">中層</option>
                                <option value="drawer">抽屜</option>
                                <option value="door">側門</option>
                              </select>
                            </div>

                            {/* Edit & Delete Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onEditItem(item)}
                                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
                                title="修改食材或數量"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700 transition"
                                title="刪除食材"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Shelf Light Reflection Effect */}
        <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>智慧冰箱冷藏分區模式（遵守 4 大分層架儲存規範）</span>
          <span className="text-emerald-400">分層儲存更衛生、延長食材保鮮期</span>
        </div>
      </div>
    </div>
  );
};
