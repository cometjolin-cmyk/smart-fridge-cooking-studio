import React, { useRef, useState } from "react";
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Minus,
  Check,
  Clock,
  RefreshCw,
  Edit2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { DetectedItem } from "../types";
import { PRESET_FRIDGES } from "../data/presets";

interface Module1VisualDetectionProps {
  items: DetectedItem[];
  onUpdateItems: (items: DetectedItem[]) => void;
  activeImage: string;
  onSelectPreset: (preset: any) => void;
  onCustomImageUpload: (dataUrl: string, file: File) => void;
  onRunDetection: () => void;
  isLoading: boolean;
  onConfirmAndContinue: () => void;
  scanFeedback?: { message: string; type: "success" | "error" | "info" } | null;
}

export const Module1VisualDetection: React.FC<Module1VisualDetectionProps> = ({
  items,
  onUpdateItems,
  activeImage,
  onSelectPreset,
  onCustomImageUpload,
  onRunDetection,
  isLoading,
  onConfirmAndContinue,
  scanFeedback,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const freshItems = items.filter((it) => it.category === "fresh");
  const pantryItems = items.filter((it) => it.category === "pantry");

  const handleToggleSelect = (id: string) => {
    onUpdateItems(
      items.map((it) => (it.id === id ? { ...it, isSelected: !it.isSelected } : it))
    );
  };

  const handleQtyChange = (id: string, delta: number) => {
    onUpdateItems(
      items.map((it) => {
        if (it.id === id) {
          const current = typeof it.numericQty === "number" ? it.numericQty : (parseFloat(it.quantity) || 1);
          const next = Math.max(0.5, Math.round((current + delta) * 10) / 10);
          return {
            ...it,
            numericQty: next,
            quantity: `${next} ${it.unit || "份"}`,
          };
        }
        return it;
      })
    );
  };

  const handleStartEditName = (item: DetectedItem) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveEditName = (id: string) => {
    if (editingName.trim()) {
      onUpdateItems(
        items.map((it) => (it.id === id ? { ...it, name: editingName.trim() } : it))
      );
    }
    setEditingId(null);
  };

  const handleAddNewItem = () => {
    const newItem: DetectedItem = {
      id: `manual_${Date.now()}`,
      name: "手動新食材",
      quantity: "1 份",
      numericQty: 1,
      unit: "份",
      shelf: "middle",
      category: "fresh",
      confidence: 1.0,
      isSelected: true,
      urgentConsume: false,
      expiryDays: 5,
      box_2d: [350, 400, 450, 600],
    };
    onUpdateItems([...items, newItem]);
    setEditingId(newItem.id);
    setEditingName("手動新食材");
    setHoveredItemId(newItem.id);
  };

  const handleBoxClick = (item: DetectedItem) => {
    setSelectedBoxId(item.id);
    setHoveredItemId(item.id);
    const rowEl = document.getElementById(`item-row-${item.id}`);
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Scan Feedback Banner Toast */}
      {scanFeedback && (
        <div
          className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top duration-200 ${
            scanFeedback.type === "success"
              ? "bg-emerald-50 border-emerald-600 text-emerald-950"
              : scanFeedback.type === "error"
              ? "bg-rose-50 border-rose-600 text-rose-950"
              : "bg-amber-50 border-amber-600 text-amber-950"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{scanFeedback.type === "success" ? "✨" : scanFeedback.type === "error" ? "⚠️" : "💡"}</span>
            <span>{scanFeedback.message}</span>
          </div>
          {scanFeedback.type === "error" && (
            <button
              onClick={onRunDetection}
              className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[11px] font-black hover:bg-rose-700 whitespace-nowrap ml-2"
            >
              重試
            </button>
          )}
        </div>
      )}

      {/* 1. Illustrated Refrigerator Canvas Container */}
      <div className="sketch-border-thick rounded-3xl overflow-hidden bg-white relative shadow-xl">
        {/* Top Header bar over fridge */}
        <div className="p-2.5 sm:p-3 bg-[#fdfbf7] border-b-2 border-slate-850 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse border border-slate-900"></span>
            <span className="text-xs font-black text-slate-850 tracking-wide font-sans">
              智慧冰箱多模態掃描
            </span>
            <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-md bg-amber-100 border border-slate-800 text-slate-800 font-bold">
              視覺辨識
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="sketch-btn px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-amber-50 text-slate-800 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              title="使用相機拍照辨識冰箱"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
              <span className="hidden xs:inline">相機拍照</span>
              <span className="xs:hidden">拍照</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="sketch-btn px-2 sm:px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white hover:bg-amber-50 text-slate-800 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              title="從相簿選取照片辨識冰箱"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden xs:inline">相簿選取</span>
              <span className="xs:hidden">相簿</span>
            </button>

            {/* Top Right Re-Scan Button */}
            <button
              onClick={onRunDetection}
              disabled={isLoading}
              className="sketch-btn px-2.5 sm:px-3 py-1 rounded-full watercolor-teal text-slate-900 font-extrabold text-[11px] tracking-wide flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0"
              title="重新使用 AI 分析畫面食材"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "掃描中..." : "RE-SCAN"}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) onCustomImageUpload(ev.target.result as string, file);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) onCustomImageUpload(ev.target.result as string, file);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        {/* Fridge Image with EXACTLY ALIGNED CRAYON HAND-DRAWN Bounding Boxes */}
        <div className="relative bg-[#faf5ec] p-3 sm:p-5 flex items-center justify-center select-none overflow-hidden">
          {/* TIGHT IMAGE WRAPPER: Ensures absolute overlay matches the exact rendered image! */}
          <div className="relative inline-block max-w-full rounded-2xl overflow-visible shadow-[3px_3px_0px_#1e293b] border-2 border-slate-900 bg-white">
            <img
              src={activeImage}
              alt="手繪冰箱插畫"
              className="block max-h-[520px] w-auto max-w-full rounded-2xl select-none"
            />

            {/* Dynamic Laser Scanning Line Animation */}
            {isLoading && (
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden bg-slate-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center z-40">
                <div className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-scan"></div>
                <div className="px-4 py-2 rounded-xl bg-white border-2 border-slate-800 shadow-[3px_3px_0px_#1e293b] text-slate-900 font-bold text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
                  <span>AI 視覺辨識食材位置與數量中...</span>
                </div>
              </div>
            )}

            {/* Overlaid Crayon Doodle Bounding Boxes strictly aligned 1:1 on the food */}
            {!isLoading && (
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-visible">
                {items.map((item) => {
                  if (!item.box_2d || item.box_2d.length < 4) return null;
                  const [ymin, xmin, ymax, xmax] = item.box_2d;
                  const top = `${ymin / 10}%`;
                  const left = `${xmin / 10}%`;
                  const height = `${(ymax - ymin) / 10}%`;
                  const width = `${(xmax - xmin) / 10}%`;

                  const isHovered = hoveredItemId === item.id || selectedBoxId === item.id;
                  const isChecked = item.isSelected !== false;

                  // Vivid Crayon Palette with Doodle Styles
                  let crayonBorderColor = "#0284c7"; // sky
                  let crayonFill = "rgba(2, 132, 199, 0.14)";
                  let tagBg = "bg-sky-200 text-slate-950";

                  if (item.id === "eggs") {
                    crayonBorderColor = "#0284c7";
                    crayonFill = "rgba(2, 132, 199, 0.16)";
                    tagBg = "bg-sky-300 text-slate-950";
                  } else if (item.id === "tofu") {
                    crayonBorderColor = "#ca8a04";
                    crayonFill = "rgba(202, 138, 4, 0.18)";
                    tagBg = "bg-amber-300 text-slate-950";
                  } else if (item.id === "tomatoes") {
                    crayonBorderColor = "#dc2626";
                    crayonFill = "rgba(220, 38, 38, 0.16)";
                    tagBg = "bg-red-300 text-slate-950";
                  } else if (item.id === "bell_peppers") {
                    crayonBorderColor = "#ea580c";
                    crayonFill = "rgba(234, 88, 12, 0.16)";
                    tagBg = "bg-orange-300 text-slate-950";
                  } else if (item.id.includes("salmon")) {
                    crayonBorderColor = "#e11d48";
                    crayonFill = "rgba(225, 29, 72, 0.18)";
                    tagBg = "bg-rose-300 text-slate-950";
                  } else if (item.id === "fruits") {
                    crayonBorderColor = "#f43f5e";
                    crayonFill = "rgba(244, 63, 94, 0.16)";
                    tagBg = "bg-pink-300 text-slate-950";
                  } else if (item.id === "broccoli") {
                    crayonBorderColor = "#16a34a";
                    crayonFill = "rgba(22, 163, 74, 0.18)";
                    tagBg = "bg-emerald-300 text-slate-950";
                  } else if (item.id === "orange_juice") {
                    crayonBorderColor = "#f59e0b";
                    crayonFill = "rgba(245, 158, 11, 0.18)";
                    tagBg = "bg-amber-300 text-slate-950";
                  } else if (item.id === "olive_oil") {
                    crayonBorderColor = "#65a30d";
                    crayonFill = "rgba(101, 163, 13, 0.18)";
                    tagBg = "bg-lime-300 text-slate-950";
                  }

                  const displayQty = item.numericQty
                    ? `x${item.numericQty}`
                    : item.quantity
                    ? `x${item.quantity}`
                    : "";

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleBoxClick(item)}
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      style={{ top, left, width, height }}
                      className={`absolute pointer-events-auto transition-all duration-200 cursor-pointer ${
                        !isChecked ? "opacity-30 grayscale" : ""
                      } ${isHovered ? "z-30 scale-[1.03]" : "z-10"}`}
                      title={`${item.name} (${item.quantity}) - 點擊定位食材清單`}
                    >
                      {/* Crayon SVG Bounding Box with Rough, Sketchy, Organic Strokes */}
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        {/* Underlying rough crayon sketch layer */}
                        <rect
                          x="2"
                          y="2"
                          width="96"
                          height="96"
                          rx="10"
                          ry="10"
                          fill={isHovered ? crayonFill.replace("0.1", "0.35") : crayonFill}
                          stroke={crayonBorderColor}
                          strokeWidth={isHovered ? "5" : "3.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={isHovered ? "none" : "90, 4"}
                          opacity="0.95"
                        />
                        {/* Secondary hand-drawn sketchy dashed contour */}
                        <rect
                          x="3"
                          y="3"
                          width="94"
                          height="94"
                          rx="9"
                          ry="9"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="1.2"
                          strokeDasharray="4, 3"
                          opacity="0.75"
                        />
                      </svg>

                      {/* Masking tape label with hand-drawn crayon text & estimated quantity */}
                      <div className="absolute -top-3.5 left-1 z-30 pointer-events-none">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-md border-2 border-slate-900 shadow-[1.5px_1.5px_0px_#1e293b] tracking-tight transform -rotate-1 ${tagBg}`}
                        >
                          <span>{item.name}</span>
                          {displayQty && <span className="opacity-90">{displayQty}</span>}
                        </span>
                      </div>

                      {/* Bouncing Hand-drawn Arrow when Hovered */}
                      {isHovered && (
                        <div className="absolute -top-8 -right-6 flex items-center gap-1 bg-[#fef08a] border-2 border-slate-900 px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1e293b] text-[10px] font-black text-slate-900 animate-crayon-wiggle z-40 whitespace-nowrap">
                          <svg
                            className="w-3.5 h-3.5 text-rose-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 5L5 19M5 19H15M5 19V9" />
                          </svg>
                          <span>↙ 這裡！(Here)</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Preset Thumbnails Selector Bar */}
        <div className="p-2.5 bg-[#f8f5ee] border-t-2 border-slate-850 flex items-center justify-between text-xs overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>範例情境：</span>
          </div>
          <div className="flex items-center gap-2">
            {PRESET_FRIDGES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg border-2 text-[11px] font-extrabold transition cursor-pointer ${
                  activeImage === preset.imageUrl
                    ? "border-slate-900 bg-amber-200 text-slate-950 shadow-[2px_2px_0px_#1e293b]"
                    : "border-slate-800 bg-white text-slate-700 hover:bg-amber-50"
                }`}
              >
                {preset.title.split("(")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Floating Hand-Drawn Bottom Sheet Card matching Image 1 */}
      <div className="sketch-border-thick rounded-3xl bg-white p-5 sm:p-6 shadow-xl space-y-5 relative">
        {/* Watercolor splash background accent */}
        <div className="absolute top-0 right-0 left-0 h-3 rounded-t-3xl watercolor-grad opacity-80"></div>

        {/* Title row */}
        <div className="flex items-start justify-between pt-1">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                AI 盤點結果
              </h2>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block border border-slate-850"></span>
              <span className="text-slate-500 text-base">🕒</span>
            </div>
            <p className="text-xs font-bold text-slate-500 tracking-wide mt-0.5">
              可編輯食材清單 ‧ 點擊食材名稱直接修改 ‧ 框線即時聯動
            </p>
          </div>

          <button
            onClick={onRunDetection}
            disabled={isLoading}
            className="sketch-btn px-3 py-1 rounded-xl watercolor-teal text-slate-900 font-extrabold text-xs tracking-wider cursor-pointer disabled:opacity-60"
          >
            RE-SCAN
          </button>
        </div>

        {/* Section: 生鮮食材 (Fresh) */}
        <div className="space-y-3 pt-2">
          <div className="border-b-2 border-slate-850 pb-1 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-850 tracking-wide flex items-center gap-2">
              <span>生鮮食材 (Fresh)</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                {freshItems.length} 項
              </span>
            </h3>
            <span className="text-[11px] text-slate-500 font-bold">易腐保鮮 ‧ 優先規劃</span>
          </div>

          <div className="space-y-2.5">
            {freshItems.map((item) => (
              <HandDrawnItemRow
                key={item.id}
                item={item}
                isHovered={hoveredItemId === item.id}
                isSelectedBox={selectedBoxId === item.id}
                onHover={(h) => setHoveredItemId(h ? item.id : null)}
                onToggleSelect={() => handleToggleSelect(item.id)}
                onQtyChange={(delta) => handleQtyChange(item.id, delta)}
                isEditing={editingId === item.id}
                editingName={editingName}
                onStartEdit={() => handleStartEditName(item)}
                onSaveEdit={() => handleSaveEditName(item.id)}
                onChangeEditingName={setEditingName}
              />
            ))}
          </div>
        </div>

        {/* Section: 調料/常備 (Pantry) */}
        <div className="space-y-3 pt-2">
          <div className="border-b-2 border-slate-850 pb-1 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-850 tracking-wide flex items-center gap-2">
              <span>調料/常備 (Pantry)</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                {pantryItems.length} 項
              </span>
            </h3>
            <span className="text-[11px] text-slate-500 font-bold">側門架 ‧ 長期常備</span>
          </div>

          <div className="space-y-2.5">
            {pantryItems.map((item) => (
              <HandDrawnItemRow
                key={item.id}
                item={item}
                isHovered={hoveredItemId === item.id}
                isSelectedBox={selectedBoxId === item.id}
                onHover={(h) => setHoveredItemId(h ? item.id : null)}
                onToggleSelect={() => handleToggleSelect(item.id)}
                onQtyChange={(delta) => handleQtyChange(item.id, delta)}
                isEditing={editingId === item.id}
                editingName={editingName}
                onStartEdit={() => handleStartEditName(item)}
                onSaveEdit={() => handleSaveEditName(item.id)}
                onChangeEditingName={setEditingName}
              />
            ))}
          </div>
        </div>

        {/* Action Link: + 手動新增漏掉的食材 (Add Item) */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleAddNewItem}
            className="sketch-btn px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-black text-slate-900 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-900 stroke-[3]" />
            <span>+ 手動新增漏掉的食材</span>
          </button>
          <span className="text-[11px] text-slate-500 font-bold">
            已選中 {items.filter((i) => i.isSelected !== false).length} / {items.length} 項
          </span>
        </div>

        {/* Main CTA: CONFIRM & CONTINUE Button matching Image 1 */}
        <div className="pt-3">
          <button
            onClick={onConfirmAndContinue}
            className="w-full py-3 sm:py-3.5 px-3 sm:px-6 rounded-2xl watercolor-pink sketch-btn text-slate-900 font-black text-center shadow-md active:scale-98 transition flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="text-xs sm:text-base tracking-wider font-extrabold text-slate-900 whitespace-nowrap">
              CONFIRM & CONTINUE
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-700 -mt-0.5 text-center px-1">
              (確認並繼續 ➔ 設定設備與飲食條件)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface HandDrawnItemRowProps {
  item: DetectedItem;
  isHovered: boolean;
  isSelectedBox: boolean;
  onHover: (hover: boolean) => void;
  onToggleSelect: () => void;
  onQtyChange: (delta: number) => void;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onChangeEditingName: (name: string) => void;
}

const HandDrawnItemRow: React.FC<HandDrawnItemRowProps> = ({
  item,
  isHovered,
  isSelectedBox,
  onHover,
  onToggleSelect,
  onQtyChange,
  isEditing,
  editingName,
  onStartEdit,
  onSaveEdit,
  onChangeEditingName,
}) => {
  const isChecked = item.isSelected !== false;
  const currentNumeric = typeof item.numericQty === "number" ? item.numericQty : (parseFloat(item.quantity) || 1);
  const currentUnit = item.unit || "份";

  return (
    <div
      id={`item-row-${item.id}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`p-2.5 rounded-xl border-2 transition-all relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        !isChecked
          ? "border-slate-300 bg-slate-50 opacity-60"
          : isHovered || isSelectedBox
          ? "border-slate-850 bg-amber-50 shadow-[3px_3px_0px_#1e293b] scale-[1.01]"
          : "border-slate-800/80 bg-white"
      }`}
    >
      {/* Hand-drawn Crayon Arrow Indicator pointing to the Refrigerator Image */}
      {(isHovered || isSelectedBox) && (
        <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-1 bg-[#fef08a] border-2 border-slate-900 px-2 py-0.5 rounded-full shadow-[2px_2px_0px_#1e293b] text-[10px] font-black text-slate-900 animate-bounce">
          <svg
            className="w-3.5 h-3.5 text-rose-600 stroke-[3]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span>⤴ 指向冰箱食材位置</span>
        </div>
      )}

      {/* Checkbox & Item Name */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          onClick={onToggleSelect}
          className={`w-5 h-5 rounded-md border-2 border-slate-850 flex items-center justify-center transition shrink-0 cursor-pointer ${
            isChecked ? "bg-amber-300" : "bg-white hover:bg-slate-100"
          }`}
          title={isChecked ? "點擊排除此食材" : "點擊加入庫存"}
        >
          {isChecked && <Check className="w-4 h-4 text-slate-900 stroke-[3]" />}
        </button>

        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={editingName}
              onChange={(e) => onChangeEditingName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
              className="text-xs bg-amber-50 border-2 border-slate-850 rounded px-2 py-0.5 font-bold text-slate-900 focus:outline-none w-full"
              autoFocus
            />
            <button
              onClick={onSaveEdit}
              className="px-2.5 py-0.5 rounded bg-emerald-500 text-white text-xs font-bold border border-slate-800 cursor-pointer"
            >
              OK
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 truncate">
            <button
              onClick={onStartEdit}
              className="text-xs sm:text-sm font-bold text-slate-850 hover:text-amber-800 truncate text-left tracking-tight flex items-center gap-1 cursor-pointer group"
              title="點擊修改名稱"
            >
              <span className={!isChecked ? "line-through text-slate-500" : ""}>
                {item.name}
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-amber-700 opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>
        )}
      </div>

      {/* Stepper [ - ] 數值 [ + ] 單位 & Smart Badges */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-nowrap">
        {/* Quantity Stepper Controller */}
        <div className="flex items-center rounded-lg border-2 border-slate-850 bg-[#ffedd5] overflow-hidden shadow-[1.5px_1.5px_0px_#1e293b] shrink-0">
          <button
            onClick={() => onQtyChange(-1)}
            disabled={!isChecked}
            className="w-6 h-6 flex items-center justify-center text-slate-900 hover:bg-amber-200 transition font-bold cursor-pointer disabled:opacity-40 shrink-0"
            title="減少數量"
          >
            <Minus className="w-3 h-3 stroke-[2.5]" />
          </button>
          <span className="px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-black text-slate-850 select-none border-x-2 border-slate-850 bg-[#fff7ed] min-w-[48px] sm:min-w-[54px] text-center whitespace-nowrap">
            {currentNumeric} {currentUnit}
          </span>
          <button
            onClick={() => onQtyChange(1)}
            disabled={!isChecked}
            className="w-6 h-6 flex items-center justify-center text-slate-900 hover:bg-amber-200 transition font-bold cursor-pointer disabled:opacity-40 shrink-0"
            title="增加數量"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Smart Badges matching Prompt Specifications:
            1. 優先消耗 (紅色)
            2. 賞味期預警：X 天 (橘色/灰色) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {item.urgentConsume ? (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md border-1.5 border-rose-900 bg-rose-500 text-white font-black text-[10px] tracking-tight shadow-[1px_1px_0px_#881337] transform -rotate-1 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>優先消耗</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md border text-[10px] font-bold whitespace-nowrap shrink-0 ${
                (item.expiryDays || 10) <= 3
                  ? "border-amber-700 bg-amber-100 text-amber-900"
                  : "border-slate-300 bg-slate-100 text-slate-600"
              }`}
            >
              <Clock className="w-2.5 h-2.5 shrink-0" />
              <span>賞味期: {item.expiryDays ?? 5}天</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
