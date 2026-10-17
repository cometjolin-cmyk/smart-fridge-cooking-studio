import { PresetFridge, ShelfConfig, ApplianceOption } from "../types";

export const SHELF_CONFIGS: Record<string, ShelfConfig> = {
  upper: {
    id: "upper",
    name: "上層冷藏架",
    englishName: "Upper Shelf",
    badge: "熟食・蛋奶・豆製品",
    color: "text-amber-800",
    bgColor: "bg-amber-100/70",
    borderColor: "border-amber-400",
    accentColor: "#f59e0b",
    iconName: "Egg",
    description: "適合熟食、即食食品、雞蛋、牛奶、豆製品（如板豆腐），溫度均勻且易拿取。",
    allowedCategories: ["熟食", "即食食品", "雞蛋", "牛奶", "豆製品"],
    recommendedTemp: "4°C ~ 6°C",
  },
  middle: {
    id: "middle",
    name: "中層低溫架",
    englishName: "Middle Shelf",
    badge: "生鮮肉品・海鮮・密封罐",
    color: "text-rose-800",
    bgColor: "bg-rose-100/70",
    borderColor: "border-rose-400",
    accentColor: "#f43f5e",
    iconName: "Fish",
    description: "生鮮肉類、海鮮、常備密封食材、罐頭。溫度較低，防止生鮮肉汁滴落污染。",
    allowedCategories: ["生鮮肉類", "海鮮", "常備密封食材", "罐頭食品"],
    recommendedTemp: "2°C ~ 4°C",
  },
  drawer: {
    id: "drawer",
    name: "下層蔬果保鮮抽屜",
    englishName: "Crisper Drawer",
    badge: "蔬菜・根莖・新鮮水果",
    color: "text-emerald-800",
    bgColor: "bg-emerald-100/70",
    borderColor: "border-emerald-400",
    accentColor: "#10b981",
    iconName: "Carrot",
    description: "高濕度保鮮區，適合葉菜類、根莖類蔬菜、水果，防止水分流失乾癟。",
    allowedCategories: ["蔬菜類", "根莖類", "水果類"],
    recommendedTemp: "5°C ~ 7°C (濕度 85%)",
  },
  door: {
    id: "door",
    name: "側門多功能置物架",
    englishName: "Door Rack",
    badge: "醬料瓶・果汁飲品・調味品",
    color: "text-sky-800",
    bgColor: "bg-sky-100/70",
    borderColor: "border-sky-400",
    accentColor: "#38bdf8",
    iconName: "Milk",
    description: "溫度波動較大，最適合調味醬料瓶、瓶裝飲料、果汁等耐溫防腐食材。",
    allowedCategories: ["調味醬料瓶", "瓶裝飲料", "果汁", "果醬"],
    recommendedTemp: "6°C ~ 8°C",
  },
};

export const APPLIANCE_OPTIONS: ApplianceOption[] = [
  { id: "rice_cooker", name: "電鍋", icon: "🍚", description: "Electric Pot" },
  { id: "air_fryer", name: "氣炸鍋", icon: "🌀", description: "Air Fryer" },
  { id: "microwave", name: "微波爐", icon: "📻", description: "Microwave" },
  { id: "single_stove", name: "單口瓦斯爐", icon: "🔥", description: "Single Gas Stove" },
  { id: "pan", name: "不沾平底鍋", icon: "🍳", description: "Pan" },
  { id: "no_oven", name: "無烤箱", icon: "❌", description: "No Oven" },
];

export const DIET_STYLE_OPTIONS = [
  { id: "high_protein", label: "高蛋白增肌", enLabel: "High Protein" },
  { id: "low_carb", label: "低醣生酮", enLabel: "Keto" },
  { id: "low_fat", label: "低脂低卡", enLabel: "Low Cal" },
  { id: "vegetarian", label: "全素/蛋奶素", enLabel: "Vegetarian" },
];

export const QUICK_AVOID_TAGS = [
  { id: "cilantro", zh: "不吃香菜", en: "No Cilantro" },
  { id: "seafood", zh: "不吃海鮮", en: "No Seafood" },
  { id: "spicy", zh: "無辛辣", en: "No Spicy" },
];

export const TIME_BUDGET_OPTIONS = [
  { minutes: 15, label: "15 分鐘極速", enLabel: "15 min", icon: "⚡" },
  { minutes: 30, label: "30 分鐘常規", enLabel: "30 min", icon: "⏱️" },
  { minutes: 60, label: "慢燉/不限時", enLabel: "No Limit", icon: "🍲" },
];

// High-fidelity watercolor hand-drawn open refrigerator SVG
function createHandDrawnFridgeSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    <defs>
      <linearGradient id="fridgeBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#eaf3fb"/>
        <stop offset="50%" stop-color="#f2f7fc"/>
        <stop offset="100%" stop-color="#e4eef8"/>
      </linearGradient>
      <linearGradient id="doorGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
      <filter id="sketchBlur" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>

    <!-- Warm Wall Background -->
    <rect width="800" height="1000" fill="#faf5ec"/>
    <!-- Top Art Frame -->
    <rect x="330" y="25" width="140" height="65" rx="6" fill="#fffdfa" stroke="#475569" stroke-width="2.5"/>
    <text x="400" y="48" fill="#1e293b" font-size="12" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" font-weight="bold">Good Food</text>
    <text x="400" y="65" fill="#1e293b" font-size="12" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" font-weight="bold">Good Mood ♡</text>

    <!-- Plant Pot Left Top -->
    <ellipse cx="140" cy="70" rx="35" ry="15" fill="#d97706" opacity="0.3"/>
    <path d="M110,65 Q140,40 170,65 Q155,90 125,90 Z" fill="#b45309" stroke="#1e293b" stroke-width="2"/>
    <circle cx="125" cy="45" r="18" fill="#10b981" opacity="0.8"/>
    <circle cx="150" cy="40" r="22" fill="#059669" opacity="0.8"/>
    <circle cx="165" cy="55" r="16" fill="#34d399" opacity="0.8"/>

    <!-- Open Refrigerator Outer Frame -->
    <rect x="30" y="100" width="740" height="880" rx="24" fill="#cbd5e1" stroke="#1e293b" stroke-width="4"/>
    <rect x="42" y="112" width="716" height="856" rx="18" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>

    <!-- Digital Temp Display Strip -->
    <rect x="350" y="125" width="100" height="24" rx="4" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
    <text x="400" y="141" fill="#38bdf8" font-size="11" font-family="monospace" text-anchor="middle">4°C | -18°C</text>

    <!-- Left Open Door -->
    <path d="M45,120 L180,145 L180,950 L45,950 Z" fill="url(#doorGrad)" stroke="#1e293b" stroke-width="3"/>
    <!-- Door Racks Left -->
    <rect x="55" y="160" width="115" height="110" rx="6" fill="#ecfeff" stroke="#0891b2" stroke-width="1.8" opacity="0.9"/>
    <!-- Egg Shelf Left Door -->
    <rect x="55" y="290" width="115" height="70" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/>
    <ellipse cx="80" cy="325" rx="10" ry="14" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="102" cy="325" rx="10" ry="14" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="124" cy="325" rx="10" ry="14" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/>
    <ellipse cx="146" cy="325" rx="10" ry="14" fill="#fffbeb" stroke="#b45309" stroke-width="1.5"/>

    <!-- Oil & Sauce Bottles Left Door -->
    <rect x="55" y="380" width="115" height="150" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.8"/>
    <rect x="68" y="415" width="22" height="95" rx="4" fill="#ca8a04" opacity="0.75" stroke="#1e293b" stroke-width="1.5"/>
    <rect x="95" y="405" width="24" height="105" rx="4" fill="#65a30d" opacity="0.75" stroke="#1e293b" stroke-width="1.5"/>
    <rect x="125" y="420" width="30" height="90" rx="6" fill="#fef08a" opacity="0.8" stroke="#1e293b" stroke-width="1.5"/>
    <text x="140" y="465" font-size="8" fill="#713f12" font-family="serif" text-anchor="middle">Olive Oil</text>

    <!-- Juice & Milk Bottles Bottom Left Door -->
    <rect x="55" y="550" width="115" height="190" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <rect x="65" y="580" width="30" height="145" rx="5" fill="#fb923c" stroke="#1e293b" stroke-width="1.8"/>
    <text x="80" y="660" font-size="8" fill="#ffffff" font-family="serif" text-anchor="middle" font-weight="bold">Orange</text>
    <rect x="100" y="580" width="30" height="145" rx="5" fill="#84cc16" stroke="#1e293b" stroke-width="1.8"/>
    <text x="115" y="660" font-size="8" fill="#ffffff" font-family="serif" text-anchor="middle" font-weight="bold">Detox</text>
    <rect x="135" y="580" width="30" height="145" rx="5" fill="#f1f5f9" stroke="#1e293b" stroke-width="1.8"/>
    <text x="150" y="660" font-size="8" fill="#475569" font-family="serif" text-anchor="middle" font-weight="bold">Milk</text>

    <!-- Right Open Door -->
    <path d="M755,120 L620,145 L620,950 L755,950 Z" fill="url(#doorGrad)" stroke="#1e293b" stroke-width="3"/>
    <!-- Jam jars Right Door -->
    <rect x="630" y="160" width="115" height="100" rx="6" fill="#fef2f2" stroke="#e11d48" stroke-width="1.8"/>
    <!-- Yogurt tubs Right Door -->
    <rect x="630" y="280" width="115" height="80" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.8"/>
    <!-- Glass Carafes Bottom Right Door -->
    <rect x="630" y="550" width="115" height="190" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <rect x="640" y="580" width="45" height="145" rx="6" fill="#fef9c3" stroke="#1e293b" stroke-width="1.8"/>
    <rect x="692" y="580" width="45" height="145" rx="6" fill="#ecfdf5" stroke="#1e293b" stroke-width="1.8"/>

    <!-- Center Main Refrigerator Cavity -->
    <rect x="195" y="150" width="410" height="810" fill="url(#fridgeBg)" stroke="#334155" stroke-width="3"/>

    <!-- Shelf 1 (Top) -->
    <line x1="195" y1="260" x2="605" y2="260" stroke="#1e293b" stroke-width="3"/>
    <!-- Fresh Tofu Container (x:215-305, y:180-255) -->
    <rect x="215" y="180" width="90" height="75" rx="8" fill="#fefce8" stroke="#ca8a04" stroke-width="2"/>
    <rect x="225" y="190" width="70" height="55" rx="5" fill="#ffffff" stroke="#eab308" stroke-width="1.8"/>
    <text x="260" y="218" fill="#854d0e" font-size="11" font-family="'Noto Sans TC', sans-serif" text-anchor="middle" font-weight="bold">板豆腐</text>
    <text x="260" y="233" fill="#a16207" font-size="9" font-family="sans-serif" text-anchor="middle">Tofu 1塊</text>

    <!-- Milk Carton (x:320-395, y:170-255) -->
    <rect x="320" y="170" width="75" height="85" rx="6" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
    <polygon points="320,195 357,170 395,195" fill="#bfdbfe" stroke="#2563eb" stroke-width="1.5"/>
    <text x="357" y="222" fill="#1d4ed8" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">MILK</text>
    <text x="357" y="236" fill="#2563eb" font-size="8" font-family="sans-serif" text-anchor="middle">鮮奶</text>

    <!-- Blueberries Glass Cup (x:410-480, y:185-255) -->
    <rect x="410" y="185" width="70" height="70" rx="8" fill="#dbeafe" fill-opacity="0.6" stroke="#2563eb" stroke-width="2"/>
    <circle cx="430" cy="210" r="6" fill="#3b82f6"/>
    <circle cx="445" cy="225" r="6" fill="#1d4ed8"/>
    <circle cx="460" cy="212" r="6" fill="#3b82f6"/>
    <circle cx="435" cy="235" r="6" fill="#2563eb"/>

    <!-- Herb pot top shelf -->
    <ellipse cx="540" cy="235" rx="22" ry="10" fill="#ca8a04" opacity="0.6" stroke="#1e293b" stroke-width="1.8"/>
    <circle cx="530" cy="210" r="15" fill="#22c55e"/>
    <circle cx="550" cy="205" r="16" fill="#16a34a"/>

    <!-- Shelf 2 (Middle) -->
    <line x1="195" y1="390" x2="605" y2="390" stroke="#1e293b" stroke-width="3"/>
    <!-- Glass box: Tomatoes (x:215-310, y:275-380) -->
    <rect x="215" y="275" width="95" height="105" rx="8" fill="#fee2e2" fill-opacity="0.6" stroke="#ef4444" stroke-width="2"/>
    <circle cx="245" cy="315" r="13" fill="#ef4444"/>
    <circle cx="272" cy="325" r="13" fill="#dc2626"/>
    <circle cx="255" cy="348" r="13" fill="#b91c1c"/>
    <text x="262" y="372" fill="#991b1b" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">牛番茄 x10</text>

    <!-- Glass box: Bell Peppers (x:320-405, y:275-380) -->
    <rect x="320" y="275" width="85" height="105" rx="8" fill="#fed7aa" fill-opacity="0.6" stroke="#f97316" stroke-width="2"/>
    <rect x="335" y="305" width="55" height="50" rx="10" fill="#ea580c"/>
    <path d="M362,298 Q360,288 368,288" stroke="#15803d" stroke-width="3" fill="none"/>
    <text x="362" y="372" fill="#c2410c" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">彩椒 x3</text>

    <!-- Glass box: Cucumbers (x:415-510, y:275-380) -->
    <rect x="415" y="275" width="95" height="105" rx="8" fill="#dcfce7" fill-opacity="0.6" stroke="#16a34a" stroke-width="2"/>
    <ellipse cx="445" cy="325" rx="10" ry="22" fill="#22c55e"/>
    <ellipse cx="475" cy="325" rx="10" ry="22" fill="#16a34a"/>
    <text x="462" y="372" fill="#166534" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">小黃瓜</text>

    <!-- Shelf 3 (Prepped meats & seafood) -->
    <line x1="195" y1="480" x2="605" y2="480" stroke="#1e293b" stroke-width="3"/>
    <!-- Fresh Salmon Fillet in Glass Dish (x:215-340, y:400-475) -->
    <rect x="215" y="400" width="125" height="75" rx="6" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>
    <rect x="225" y="410" width="105" height="55" rx="4" fill="#fb7185" stroke="#e11d48" stroke-width="1.8"/>
    <!-- Salmon meat grain stripes -->
    <line x1="245" y1="412" x2="260" y2="463" stroke="#ffe4e6" stroke-width="2"/>
    <line x1="270" y1="412" x2="285" y2="463" stroke="#ffe4e6" stroke-width="2"/>
    <line x1="295" y1="412" x2="310" y2="463" stroke="#ffe4e6" stroke-width="2"/>
    <text x="277" y="442" font-size="10" fill="#ffffff" font-family="sans-serif" text-anchor="middle" font-weight="bold">生鮮鮭魚 (Salmon)</text>
    <text x="277" y="458" font-size="8" fill="#fff1f2" font-family="sans-serif" text-anchor="middle">2份・需優先烹飪</text>

    <!-- Prepped Veggies Sticks (x:355-520, y:405-475) -->
    <rect x="355" y="405" width="50" height="65" rx="6" fill="#ecfdf5" stroke="#10b981" stroke-width="1.8"/>
    <rect x="415" y="405" width="50" height="65" rx="6" fill="#ffedd5" stroke="#f97316" stroke-width="1.8"/>
    <rect x="475" y="405" width="50" height="65" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="1.8"/>

    <!-- Shelf 4 (Glass Dry Jars & Lemons) -->
    <line x1="195" y1="580" x2="605" y2="580" stroke="#1e293b" stroke-width="3"/>
    <rect x="220" y="495" width="48" height="75" rx="6" fill="#fef08a" fill-opacity="0.4" stroke="#854d0e" stroke-width="2"/>
    <rect x="278" y="495" width="48" height="75" rx="6" fill="#fed7aa" fill-opacity="0.4" stroke="#c2410c" stroke-width="2"/>
    <rect x="336" y="495" width="48" height="75" rx="6" fill="#fef3c7" fill-opacity="0.4" stroke="#a16207" stroke-width="2"/>
    <!-- Lemon bowl -->
    <ellipse cx="440" cy="550" rx="35" ry="18" fill="#e2e8f0" stroke="#1e293b" stroke-width="2"/>
    <circle cx="430" cy="530" r="12" fill="#facc15"/>
    <circle cx="450" cy="532" r="12" fill="#eab308"/>
    <circle cx="440" cy="515" r="11" fill="#84cc16"/>

    <!-- Bottom Crisper Drawers -->
    <line x1="195" y1="730" x2="605" y2="730" stroke="#1e293b" stroke-width="3"/>
    
    <!-- Fruits Drawer Left (x:205-390, y:600-720) -->
    <rect x="205" y="600" width="185" height="120" rx="10" fill="#ffe4e6" fill-opacity="0.6" stroke="#f43f5e" stroke-width="2.5"/>
    <text x="297" y="628" fill="#be123c" font-size="13" font-family="'Brush Script MT', cursive, sans-serif" text-anchor="middle" font-weight="bold">Fruits 水果 ♡</text>
    <circle cx="240" cy="670" r="16" fill="#ef4444"/>
    <circle cx="270" cy="685" r="15" fill="#f97316"/>
    <circle cx="295" cy="665" r="16" fill="#84cc16"/>
    <circle cx="325" cy="680" r="15" fill="#fb923c"/>
    <circle cx="350" cy="665" r="15" fill="#ef4444"/>

    <!-- Vegetables Crisper Drawer Right (x:405-590, y:600-720) -->
    <rect x="405" y="600" width="185" height="120" rx="10" fill="#ede9fe" fill-opacity="0.6" stroke="#8b5cf6" stroke-width="2.5"/>
    <text x="497" y="628" fill="#6d28d9" font-size="13" font-family="'Brush Script MT', cursive, sans-serif" text-anchor="middle" font-weight="bold">Vegetables 蔬菜 ♡</text>
    <!-- Broccoli -->
    <circle cx="440" cy="675" r="16" fill="#15803d"/>
    <circle cx="455" cy="660" r="14" fill="#16a34a"/>
    <!-- Yellow Pepper -->
    <rect x="475" y="650" width="28" height="35" rx="8" fill="#eab308" stroke="#ca8a04" stroke-width="1.5"/>
    <!-- Red Pepper -->
    <rect x="510" y="650" width="28" height="35" rx="8" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>

  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_FRIDGES: PresetFridge[] = [
  {
    id: "preset-watercolor",
    title: "手繪風常備冰箱 (Hand-drawn Daily Fridge)",
    description: "手繪水彩風格，生鮮蔬果、蛋奶、果汁與調味罐全數標註。",
    badge: "手繪手帳風",
    itemCount: 9,
    imageUrl: createHandDrawnFridgeSvg(),
    defaultPrompt: "請幫我盤點這張手繪水彩冰箱插畫中的所有食材，標註位置與數量。",
    detectedItems: [
      {
        id: "eggs",
        name: "雞蛋 (Eggs)",
        quantity: "12 顆",
        numericQty: 12,
        unit: "顆",
        shelf: "upper",
        category: "fresh",
        confidence: 0.98,
        isSelected: true,
        urgentConsume: false,
        expiryDays: 14,
        box_2d: [290, 69, 360, 213], // Left door egg rack (x:55-170, y:290-360)
      },
      {
        id: "tofu",
        name: "板豆腐 (Tofu)",
        quantity: "1 塊",
        numericQty: 1,
        unit: "塊",
        shelf: "upper",
        category: "fresh",
        confidence: 0.96,
        isSelected: true,
        urgentConsume: true,
        expiryDays: 2,
        box_2d: [180, 269, 255, 381], // Top shelf left tofu container (x:215-305, y:180-255)
      },
      {
        id: "tomatoes",
        name: "牛番茄 (Tomatoes)",
        quantity: "10 顆",
        numericQty: 10,
        unit: "顆",
        shelf: "middle",
        category: "fresh",
        confidence: 0.97,
        isSelected: true,
        urgentConsume: false,
        expiryDays: 8,
        box_2d: [275, 269, 380, 388], // Middle shelf 2 left glass container (x:215-310, y:275-380)
      },
      {
        id: "bell_peppers",
        name: "彩椒 (Bell Peppers)",
        quantity: "3 顆",
        numericQty: 3,
        unit: "顆",
        shelf: "drawer",
        category: "fresh",
        confidence: 0.96,
        isSelected: true,
        urgentConsume: false,
        expiryDays: 7,
        box_2d: [275, 400, 380, 506], // Middle shelf 2 center container (x:320-405, y:275-380)
      },
      {
        id: "salmon",
        name: "生鮮鮭魚 (Salmon)",
        quantity: "2 份",
        numericQty: 2,
        unit: "份",
        shelf: "middle",
        category: "fresh",
        confidence: 0.95,
        isSelected: true,
        urgentConsume: true,
        expiryDays: 2,
        box_2d: [400, 269, 475, 425], // Middle shelf 3 salmon dish (x:215-340, y:400-475)
      },
      {
        id: "fruits",
        name: "綜合水果 (Fruits)",
        quantity: "5 顆",
        numericQty: 5,
        unit: "顆",
        shelf: "drawer",
        category: "fresh",
        confidence: 0.96,
        isSelected: true,
        urgentConsume: false,
        expiryDays: 6,
        box_2d: [600, 256, 720, 488], // Bottom left drawer (Fruits ♡) (x:205-390, y:600-720)
      },
      {
        id: "broccoli",
        name: "花椰菜 (Broccoli)",
        quantity: "1 顆",
        numericQty: 1,
        unit: "顆",
        shelf: "drawer",
        category: "fresh",
        confidence: 0.94,
        isSelected: true,
        urgentConsume: true,
        expiryDays: 3,
        box_2d: [600, 506, 720, 738], // Bottom right drawer (Vegetables ♡) (x:405-590, y:600-720)
      },
      {
        id: "orange_juice",
        name: "柳橙汁 (Orange Juice)",
        quantity: "1 瓶",
        numericQty: 1,
        unit: "瓶",
        shelf: "door",
        category: "pantry",
        confidence: 0.98,
        isSelected: true,
        urgentConsume: false,
        expiryDays: 30,
        box_2d: [550, 69, 740, 213], // Left door bottom juice bottle (x:55-170, y:550-740)
      },
      {
        id: "olive_oil",
        name: "橄欖油 (Olive Oil)",
        quantity: "1 瓶",
        numericQty: 1,
        unit: "瓶",
        shelf: "door",
        category: "pantry",
        confidence: 0.99,
        isSelected: true,
        urgentConsume: false,
        expiryDays: 180,
        box_2d: [380, 69, 530, 213], // Left door middle shelf (x:55-170, y:380-530)
      },
    ],
  },
];
