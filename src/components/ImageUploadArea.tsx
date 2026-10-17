import React, { useRef, useState } from "react";
import { Upload, Camera, Sparkles, Image as ImageIcon, Check, RefreshCw, AlertCircle } from "lucide-react";
import { PRESET_FRIDGES } from "../data/presets";
import { PresetFridge } from "../types";

interface ImageUploadAreaProps {
  selectedPreset: PresetFridge | null;
  onSelectPreset: (preset: PresetFridge) => void;
  customImagePreview: string | null;
  onCustomImageLoaded: (base64Url: string, file: File) => void;
  userPrompt: string;
  onChangeUserPrompt: (prompt: string) => void;
  onRunDetection: () => void;
  isLoading: boolean;
  loadingStep: string;
}

export const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  selectedPreset,
  onSelectPreset,
  customImagePreview,
  onCustomImageLoaded,
  userPrompt,
  onChangeUserPrompt,
  onRunDetection,
  isLoading,
  loadingStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const activeImage = customImagePreview || selectedPreset?.imageUrl || PRESET_FRIDGES[0].imageUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCustomImageLoaded(event.target.result as string, file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Image Selection & Preview */}
        <div className="lg:w-7/12 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>冰箱照片輸入 (預設示範情境 / 自訂上傳)</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition flex items-center gap-1.5"
              >
                <Upload className="w-3 h-3 text-emerald-400" />
                <span>上傳照片</span>
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition flex items-center gap-1.5"
              >
                <Camera className="w-3 h-3 text-cyan-400" />
                <span>相機拍攝</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_FRIDGES.map((preset) => {
              const isSelected = selectedPreset?.id === preset.id && !customImagePreview;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border transition relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50"
                      : "bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-slate-200 line-clamp-1">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    約 {preset.itemCount} 項食材
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Image Display / Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 overflow-hidden bg-slate-950/80 flex items-center justify-center min-h-[260px] max-h-[340px] transition group ${
              isDragOver
                ? "border-emerald-500 bg-emerald-950/20"
                : "border-slate-700/60 hover:border-slate-600"
            }`}
          >
            <img
              src={activeImage}
              alt="冰箱內部照片"
              className="w-full h-full object-contain max-h-[320px] rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Overlay tag */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-xs">
              <span className="text-slate-300 truncate font-medium">
                {customImagePreview
                  ? "已載入自訂使用者冰箱照片"
                  : `示範照片：${selectedPreset?.title || PRESET_FRIDGES[0].title}`}
              </span>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                高解析多模態輸入
              </span>
            </div>

            {/* Quick change hover action */}
            {customImagePreview && (
              <button
                onClick={() => onSelectPreset(PRESET_FRIDGES[0])}
                className="absolute top-2.5 right-2.5 px-2.5 py-1 text-xs rounded bg-slate-900/80 hover:bg-slate-900 text-slate-300 border border-slate-700 flex items-center gap-1 backdrop-blur"
              >
                <RefreshCw className="w-3 h-3" />
                回復示範照片
              </button>
            )}
          </div>
        </div>

        {/* Right: AI Vision Prompt & Execution */}
        <div className="lg:w-5/12 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>User 盤點提示詞 (Prompt)</span>
              </label>
              <button
                type="button"
                onClick={() => onChangeUserPrompt("請幫我盤點這張冰箱照片中的所有食材。")}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition"
              >
                重置為預設
              </button>
            </div>

            <div className="relative">
              <textarea
                value={userPrompt}
                onChange={(e) => onChangeUserPrompt(e.target.value)}
                rows={3}
                className="w-full text-xs sm:text-sm bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition resize-none font-sans"
                placeholder="請輸入給視覺模型的提示詞，例如：請幫我盤點這張冰箱照片中的所有食材。"
              />
            </div>

            {/* Specs Highlights Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 space-y-2 text-xs">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>系統執行規範摘要：</span>
              </div>
              <ul className="text-slate-400 space-y-1 list-disc list-inside text-[11px]">
                <li>
                  <strong className="text-slate-300">分層規則：</strong>
                  upper (熟食/蛋奶/豆製品) ｜ middle (生鮮肉品/海鮮) ｜ drawer (蔬果) ｜ door (醬料飲品)
                </li>
                <li>
                  <strong className="text-slate-300">輸出規範：</strong>
                  嚴格 JSON 結構化模式，含 id, name (繁中), quantity, shelf, confidence
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button & Loading step */}
          <div className="pt-2">
            {isLoading ? (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-center space-y-2 shadow-lg shadow-emerald-950/40">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>AI 視覺辨識處理中...</span>
                </div>
                <p className="text-xs text-slate-400 font-mono animate-pulse">
                  {loadingStep}
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onRunDetection}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-emerald-700/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>執行多模態照片盤點 (Run)</span>
              </button>
            )}
            <p className="text-[11px] text-slate-500 text-center mt-2">
              點擊後將發送多模態圖片至 Gemini 3.8 Flash 並以 JSON Mode 回傳分層架結構
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
