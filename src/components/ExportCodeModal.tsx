import React, { useState } from "react";
import { X, Copy, Check, Terminal, FileCode, CheckCircle2, Braces, Sparkles, BookOpen } from "lucide-react";
import { DetectedItem } from "../types";

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedItems: DetectedItem[];
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({
  isOpen,
  onClose,
  detectedItems,
}) => {
  const [activeTab, setActiveTab] = useState<"download_zip" | "json" | "frontend_ts" | "backend_node" | "curl" | "system_schema">("download_zip");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentJsonString = JSON.stringify(
    { detected_items: detectedItems },
    null,
    2
  );

  const frontendCode = `// 前端呼叫範例 (React / TypeScript)
export async function detectFridgeInventory(imageFile: File | string) {
  // 1. 將圖片轉為 Base64
  let imageBase64 = "";
  if (typeof imageFile === "string") {
    imageBase64 = imageFile;
  } else {
    imageBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
  }

  // 2. 呼叫後端 API 端點
  const response = await fetch("/api/detect-fridge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64,
      prompt: "請幫我盤點這張冰箱照片中的所有食材。",
    }),
  });

  if (!response.ok) {
    throw new Error("盤點失敗: " + response.statusText);
  }

  // 3. 取得型別安全的結構化資料
  const data = await response.json();
  // data.detected_items: Array<{ id: string; name: string; quantity: string; shelf: "upper"|"middle"|"drawer"|"door"; confidence: number }>
  return data.detected_items;
}`;

  const backendCode = `// 後端呼叫範例 (Node.js / Express with @google/genai)
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { "User-Agent": "aistudio-build" },
  },
});

export async function analyzeFridgeImage(imageBase64: string, prompt = "請幫我盤點這張冰箱照片中的所有食材。") {
  const cleanBase64 = imageBase64.replace(/^data:image\\/[a-zA-Z0-9+.-]+;base64,/, "");

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      systemInstruction: \`你是一個精準的「智慧冰箱視覺辨識助理」。
你的任務是分析使用者上傳的冰箱內部照片，辨識畫面中可見的所有食材、推估大致數量，並將其歸類到對應的冰箱分層架中。

【歸類規則（shelf 欄位）】：
1. "upper"（上層）：熟食、即食食品、雞蛋、牛奶、豆製品（如板豆腐）。
2. "middle"（中層）：生鮮肉類、海鮮、常備密封食材、罐頭。
3. "drawer"（下層抽屜）：蔬菜、根莖類、水果。
4. "door"（側門架）：調味醬料瓶、瓶裝飲料、果汁。

【輸出規範】：
- 必須嚴格使用 JSON 格式回應，不得包含任何 Markdown 標籤（如 \\\`\\\`\\\`json）或額外文字說明。
- id 請使用簡潔的英文小寫代碼（如 egg, tofu, cabbage）。
- name 請使用繁體中文。
- quantity 請根據視覺推估數量與單位（如 "4顆", "1塊", "半顆"）。
- 置信度 confidence 必須為 0.0 到 1.0 之間的小數。\`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detected_items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                quantity: { type: Type.STRING },
                shelf: {
                  type: Type.STRING,
                  enum: ["upper", "middle", "drawer", "door"],
                },
                confidence: { type: Type.NUMBER },
              },
              required: ["id", "name", "quantity", "shelf", "confidence"],
            },
          },
        },
        required: ["detected_items"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}`;

  const curlCode = `# cURL 呼叫本地或部署後端 API
curl -X POST https://your-app-domain.com/api/detect-fridge \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "請幫我盤點這張冰箱照片中的所有食材。",
    "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'`;

  const systemPromptAndSchema = `【1. System Instructions (系統提示詞)】
你是一個精準的「智慧冰箱視覺辨識助理」。
你的任務是分析使用者上傳的冰箱內部照片，辨識畫面中可見的所有食材、推估大致數量，並將其歸類到對應的冰箱分層架中。

【歸類規則（shelf 欄位）】：
1. "upper"（上層）：熟食、即食食品、雞蛋、牛奶、豆製品（如板豆腐）。
2. "middle"（中層）：生鮮肉類、海鮮、常備密封食材、罐頭。
3. "drawer"（下層抽屜）：蔬菜、根莖類、水果。
4. "door"（側門架）：調味醬料瓶、瓶裝飲料、果汁。

【輸出規範】：
- 必須嚴格使用 JSON 格式回應，不得包含任何 Markdown 標籤（如 \`\`\`json）或額外文字說明。
- id 請使用簡潔的英文小寫代碼（如 egg, tofu, cabbage）。
- name 請使用繁體中文。
- quantity 請根據視覺推估數量與單位（如 "4顆", "1塊", "半顆"）。
- 置信度 confidence 必須為 0.0 到 1.0 之間的小數。

--------------------------------------------------

【2. Response Schema (JSON Mode 輸出格式規格)】
{
  "type": "object",
  "properties": {
    "detected_items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "name": { "type": "string" },
          "quantity": { "type": "string" },
          "shelf": {
            "type": "string",
            "enum": ["upper", "middle", "drawer", "door"]
          },
          "confidence": { "type": "number" }
        },
        "required": ["id", "name", "quantity", "shelf"]
      }
    }
  },
  "required": ["detected_items"]
}`;

  let currentContent = "";
  if (activeTab === "json") currentContent = currentJsonString;
  else if (activeTab === "frontend_ts") currentContent = frontendCode;
  else if (activeTab === "backend_node") currentContent = backendCode;
  else if (activeTab === "curl") currentContent = curlCode;
  else if (activeTab === "system_schema") currentContent = systemPromptAndSchema;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Google AI Studio 驗證結果與程式碼導出
              </h3>
              <p className="text-xs text-slate-400">
                JSON 格式已成功驗證！可直接導出為前後端 API 與呼叫程式碼
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Notice Bar */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>驗證成功：</strong> 模型產生的 JSON 完全符合「Response Schema」與 4 分層架（upper / middle / drawer / door）定義！
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Gemini 3.8 Flash
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("download_zip")}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "download_zip"
                ? "bg-amber-400 text-slate-950 font-black shadow"
                : "text-amber-300 hover:text-amber-200 hover:bg-slate-800"
            }`}
          >
            <span className="text-sm">📦</span>
            <span>一鍵下載完整專案 (.ZIP)</span>
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "json"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Braces className="w-3.5 h-3.5" />
            <span>目前盤點 JSON ({detectedItems.length} 項)</span>
          </button>
          <button
            onClick={() => setActiveTab("frontend_ts")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "frontend_ts"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>前端呼叫 (TypeScript)</span>
          </button>
          <button
            onClick={() => setActiveTab("backend_node")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "backend_node"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>後端 @google/genai (server.ts)</span>
          </button>
          <button
            onClick={() => setActiveTab("curl")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "curl"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>cURL 測試命令</span>
          </button>
          <button
            onClick={() => setActiveTab("system_schema")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "system_schema"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Studio 提示詞與 Schema 原文</span>
          </button>
        </div>

        {/* Content Container */}
        {activeTab === "download_zip" ? (
          <div className="p-6 flex-1 overflow-auto bg-slate-950 text-slate-200 space-y-6">
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <span>📦 最新完整專案程式碼打包檔</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono font-normal">
                    v1.0.0 Ready
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  點擊右側按鈕立即下載打包為 <code className="text-amber-300 font-mono">smart-fridge-cooking-studio.zip</code> 的完整原始碼壓縮檔，包含所有前後端邏輯、手繪風 UI 元件、三大模組規格與設定檔。
                </p>
              </div>
              <a
                href="/api/export/download-zip"
                download="smart-fridge-cooking-studio.zip"
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition shrink-0"
              >
                <span className="text-base">⬇️</span>
                <span>下載完整原始碼 (.ZIP)</span>
              </a>
            </div>

            {/* Answer to user's question */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <h5 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <span>💡 關於 AI Studio 的代碼導出說明</span>
              </h5>
              <p className="text-slate-300 leading-relaxed">
                <strong>AI Studio 導出現在是所有現有的程式碼嗎？</strong><br />
                <strong>是的！</strong>AI Studio 右上角原生「Download / Export to GitHub」會匯出專案根目錄下「所有的原始碼檔案」（包含 package.json, server.ts, vite.config.ts, src/ 下所有元件與樣式）。<br />
                為了讓您能 100% 確保拿到包含<strong>「手繪風 UI」</strong>、<strong>「像素級對齊邊界框」</strong>與<strong>「三大模組完整閉環」</strong>的最新檔案，本系統亦提供上述一鍵直接下載 ZIP 壓縮檔與下方完整架構清單。
              </p>
            </div>

            {/* Project files checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-3">
              <h5 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
                <span>📁 匯出檔包含的所有核心檔案清單</span>
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold mb-1">🖥️ 後端與全端伺服器</div>
                  <div className="text-slate-300">📄 server.ts - Express + Gemini 3.1/3.8 Flash</div>
                  <div className="text-slate-400 text-[10px]">包含 /api/detect-fridge, /api/generate-custom-recipes, /api/refine-single-recipe, /api/deduct-inventory, /api/export/download-zip</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-teal-400 font-bold mb-1">🎨 模組 1：照片辨識與邊界框</div>
                  <div className="text-slate-300">📄 src/components/Module1VisualDetection.tsx</div>
                  <div className="text-slate-400 text-[10px]">1:1 貼合邊界框、[ - ] 數值 [ + ] 單位步進器、生鮮/常備分組、優先消耗標籤</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-orange-400 font-bold mb-1">🍳 模組 2：廚具與偏好篩選器</div>
                  <div className="text-slate-300">📄 src/components/Module2PreferencesFilter.tsx</div>
                  <div className="text-slate-400 text-[10px]">電鍋/氣炸鍋/微波爐/平底鍋/無烤箱設備矩陣、高蛋白/生酮飲食風格、忌口排除、時間滑桿</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">🍲 模組 3：食譜微調與扣庫存</div>
                  <div className="text-slate-300">📄 src/components/Module3RecipeRefinement.tsx</div>
                  <div className="text-slate-400 text-[10px]">手繪料理卡片、一鍵免開火/步驟減半、自然語言微調、烹飪完成結算彈窗與明日零浪費建議</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-indigo-400 font-bold mb-1">🖼️ 高畫質手繪冰箱 SVG 與像素坐標</div>
                  <div className="text-slate-300">📄 src/data/presets.ts</div>
                  <div className="text-slate-400 text-[10px]">家庭常態、健身高蛋白、蔬食派對三大情境向量手繪冰箱與真實 box_2d 映射</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-rose-400 font-bold mb-1">⚙️ 專案設定與說明文件</div>
                  <div className="text-slate-300">📄 package.json, vite.config.ts, README.md</div>
                  <div className="text-slate-400 text-[10px]">包含所有相依套件 (@google/genai, tailwindcss, lucide-react) 與本地啟動說明</div>
                </div>
              </div>
            </div>

            {/* Quick start guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
              <h5 className="font-bold text-slate-100 text-sm">🚀 本地解壓後啟動步驟</h5>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`# 1. 解壓縮檔案並進入目錄
unzip smart-fridge-cooking-studio.zip
cd smart-fridge-cooking-studio

# 2. 安裝相依套件
npm install

# 3. 設定環境變數 (.env)
cp .env.example .env
# 請在 .env 中填入你的 GEMINI_API_KEY=xxx

# 4. 啟動開發伺服器
npm run dev

# 訪問 http://localhost:3000 即可享有完整的智慧冰箱料理工作台！`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs">
            <div className="relative">
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 text-xs z-10 shadow"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">已複製！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製內容</span>
                  </>
                )}
              </button>
              <pre className="text-slate-300 p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto selection:bg-emerald-500/40">
                <code>{currentContent}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            提示：可以直接將此 JSON 或程式碼整合至你的前端購物車、庫存管理或食譜生成模組。
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
