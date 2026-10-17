# 智慧冰箱食材盤點與客製料理微調工作台 (Smart Fridge Cooking Studio)

本專案是一個採用手繪溫暖風格（Hand-drawn Warm Aesthetic）設計的多模態 AI 智慧廚房助理系統，包含三大專屬模組：

1. **模組 1：智慧食材視覺盤點頁面（Smart Inventory Visual Detection）**
   - 多模態視覺模型（Gemini Vision）自動辨識冰箱內部食材照片。
   - 照片上方精準疊加手繪風格食材邊界框（Bounding Box），框線旁標註食材名稱與預估數量（如：`雞蛋 x12`、`彩椒 x3`）。
   - 可編輯盤點清單卡片，分群為「生鮮食材 (Fresh)」與「調料/常備 (Pantry)」。
   - `[ - ] 數值 [ + ] 單位` 步進控制器，支援小數與即時點擊更名。
   - 智慧標籤：優先消耗標籤、賞味期預警天數。

2. **模組 2：個人化烹飪條件與設備篩選器（Cooking Preferences & Constraints Filter）**
   - 現有廚具設備矩陣：電鍋、氣炸鍋、微波爐、瓦斯爐、平底鍋、無烤箱/免烤。
   - 飲食風格（高蛋白增肌、低醣生酮、低脂低卡、全素/蛋奶素）與忌口排除（不吃香菜、不吃海鮮、無辛辣等）。
   - 出菜時間限制（15 分鐘極速出菜、30 分鐘常規、慢燉/不限時）。
   - 動態計算預估備料時間與清洗負擔（一鍋到底）。

3. **模組 3：智慧食譜微調與庫存連動閉環（Recipe Refinement & Auto-Deduction）**
   - 推薦料理卡片，清晰標示烹飪時間、廚具、所需食材明細與步驟（備料 vs 料理流程）。
   - 快捷替換標籤（換一道免開火料理、步驟再減半、優先消耗快過期高麗菜）與自然語言微調對話列。
   - 烹飪完成結算彈窗：自動扣除庫存、顯示剩餘食材與智慧下一餐零浪費建議。

---

## 本地開發與啟動方式

### 1. 安裝相依套件
確保本地環境已安裝 Node.js (v18+)：
```bash
npm install
```

### 2. 環境變數設定
複製 `.env.example` 為 `.env`，並填入 Google Gemini API Key：
```bash
cp .env.example .env
```
在 `.env` 中設定：
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. 啟動開發伺服器
```bash
npm run dev
```
開啟瀏覽器訪問：`http://localhost:3000`

### 4. 建置生產環境版本
```bash
npm run build
npm start
```

---

## 專案目錄結構

```
.
├── server.ts                  # 後端 Express 伺服器，整合 Gemini 3.1 / 3.8 Flash API
├── index.html                 # 前端 HTML 進入點（手繪可愛字體與樣式）
├── package.json               # 專案相依與 Scripts
├── vite.config.ts             # Vite 配置
├── src/
│   ├── main.tsx               # React 進入點
│   ├── App.tsx                # 主應用程式控制器與步驟切換
│   ├── index.css              # 全域 Tailwind CSS 與手繪風主題樣式
│   ├── types.ts               # 資料結構定義（食材、食譜、篩選偏好、扣除明細）
│   ├── data/
│   │   └── presets.ts         # 多組高解析手繪冰箱 SVG 與像素級精準坐標對照
│   └── components/
│       ├── Header.tsx                 # 頂部導覽列（含一鍵下載源碼按鈕）
│       ├── Module1VisualDetection.tsx # 模組 1：照片辨識與邊界框盤點
│       ├── Module2PreferencesFilter.tsx # 模組 2：廚具與偏好篩選器
│       ├── Module3RecipeRefinement.tsx  # 模組 3：食譜推薦、換菜與扣除閉環
│       ├── ExportCodeModal.tsx        # 代碼導出與 API 整合規格視窗
│       └── ...
└── ...
```
