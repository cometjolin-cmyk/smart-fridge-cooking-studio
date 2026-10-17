import { RecipeItem, DishArtStyle } from "../types";

// SVG Filter definition for watercolor paper texture and sketchy pencil outlines
const SVG_FILTERS = `
  <defs>
    <!-- Paper Texture Gradient -->
    <linearGradient id="warmPaper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffdf8"/>
      <stop offset="50%" stop-color="#fdf9f0"/>
      <stop offset="100%" stop-color="#fbf4e4"/>
    </linearGradient>

    <!-- Broth Gradient for Soups -->
    <radialGradient id="soupBroth" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#facc15" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#ca8a04" stop-opacity="0.85"/>
    </radialGradient>

    <!-- Tomato Sauce Gradient -->
    <radialGradient id="tomatoSauce" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="50%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </radialGradient>

    <!-- Salmon Glaze Gradient -->
    <linearGradient id="teriyakiGlaze" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#fb7185"/>
      <stop offset="40%" stop-color="#f43f5e"/>
      <stop offset="80%" stop-color="#881337"/>
      <stop offset="100%" stop-color="#4c0519"/>
    </linearGradient>

    <!-- Ceramic Bowl Gradient -->
    <linearGradient id="ceramicBowl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="60%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>

    <!-- Cast Iron Gradient -->
    <linearGradient id="castIron" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>

    <!-- Watercolor Noise Filter -->
    <filter id="handDrawnSketch" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>

    <!-- Soft Drop Shadow -->
    <filter id="foodShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.18"/>
    </filter>
  </defs>
`;

/**
 * 1. Curated Masterpiece: 微波鮮蔥嫩豆腐蛋花羹 (Microwave Tofu Egg Drop Soup)
 */
export function getTofuEggSoupSvg(style: DishArtStyle = "watercolor"): string {
  const isJapanese = style === "japanese_cookbook";
  const badgeText = isJapanese ? "和風・豆腐たまごスープ" : "手繪水彩・鮮美暖胃羹湯";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    ${SVG_FILTERS}

    <!-- Background paper -->
    <rect width="500" height="500" fill="url(#warmPaper)" rx="24"/>
    <rect x="12" y="12" width="476" height="476" rx="18" fill="none" stroke="#e2d8c3" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Tablecloth / Mat Doodle -->
    <ellipse cx="250" cy="380" rx="200" ry="85" fill="#fef3c7" opacity="0.6"/>
    <ellipse cx="250" cy="380" rx="190" ry="75" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.7"/>

    <!-- Bowl Shadow -->
    <ellipse cx="250" cy="350" rx="160" ry="60" fill="#0f172a" opacity="0.12"/>

    <!-- Ceramic Donburi Bowl Outer -->
    <g filter="url(#foodShadow)">
      <path d="M100,220 C100,340 160,390 250,390 C340,390 400,340 400,220 C400,195 330,185 250,185 C170,185 100,195 100,220 Z" fill="url(#ceramicBowl)" stroke="#1e293b" stroke-width="3"/>
      <!-- Blue rim stripe on bowl -->
      <path d="M105,225 C105,245 170,260 250,260 C330,260 395,245 395,225" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
      <path d="M110,235 C110,250 170,265 250,265 C330,265 390,250 390,235" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
    </g>

    <!-- Soup Broth Surface -->
    <ellipse cx="250" cy="225" rx="142" ry="48" fill="url(#soupBroth)"/>
    <ellipse cx="250" cy="225" rx="138" ry="44" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.5"/>

    <!-- Golden Egg Flower Swirls (蛋花) -->
    <g filter="url(#handDrawnSketch)">
      <!-- Swirl 1 -->
      <path d="M160,215 Q200,195 240,210 Q280,225 320,205 Q300,240 260,235 Q210,245 160,215 Z" fill="#fef08a" opacity="0.9" stroke="#eab308" stroke-width="1.2"/>
      <!-- Swirl 2 -->
      <path d="M190,230 Q230,250 280,240 Q330,230 350,220 Q320,255 270,255 Q210,255 190,230 Z" fill="#fef9c3" opacity="0.95" stroke="#facc15" stroke-width="1.5"/>
      <!-- Swirl 3 fluffy center -->
      <path d="M220,210 Q250,200 290,215 Q260,235 220,210 Z" fill="#fef08a" opacity="0.85"/>
      <path d="M140,220 Q165,205 185,225 Q160,235 140,220 Z" fill="#fde047" opacity="0.8"/>
    </g>

    <!-- Silken Tofu Cubes (板豆腐丁) with hand-drawn edges -->
    <g>
      <!-- Tofu Cube 1 -->
      <g transform="translate(180, 205)">
        <polygon points="0,10 24,0 44,8 20,18" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="0,10 20,18 20,38 0,30" fill="#fefce8" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="20,18 44,8 44,28 20,38" fill="#fef08a" stroke="#1e293b" stroke-width="1.8"/>
        <line x1="2" y1="12" x2="18" y2="17" stroke="#fef9c3" stroke-width="1"/>
      </g>
      <!-- Tofu Cube 2 -->
      <g transform="translate(255, 215)">
        <polygon points="0,8 22,0 40,7 18,15" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="0,8 18,15 18,33 0,26" fill="#fefce8" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="18,15 40,7 40,25 18,33" fill="#fef08a" stroke="#1e293b" stroke-width="1.8"/>
      </g>
      <!-- Tofu Cube 3 -->
      <g transform="translate(220, 235)">
        <polygon points="0,7 20,0 36,6 16,13" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="0,7 16,13 16,29 0,23" fill="#fefce8" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="16,13 36,6 36,22 16,29" fill="#fef08a" stroke="#1e293b" stroke-width="1.8"/>
      </g>
      <!-- Tofu Cube 4 (submerged) -->
      <g transform="translate(300, 205)" opacity="0.85">
        <polygon points="0,6 18,0 32,5 14,11" fill="#fefce8" stroke="#1e293b" stroke-width="1.5"/>
        <polygon points="0,6 14,11 14,24 0,19" fill="#fef08a" stroke="#1e293b" stroke-width="1.5"/>
        <polygon points="14,11 32,5 32,18 14,24" fill="#fde047" stroke="#1e293b" stroke-width="1.5"/>
      </g>
    </g>

    <!-- Fresh Chopped Green Scallions (翠綠蔥花) -->
    <g>
      <circle cx="165" cy="210" r="5" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="165" cy="210" r="2" fill="#86efac"/>
      <circle cx="215" cy="200" r="5.5" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
      <circle cx="215" cy="200" r="2.5" fill="#86efac"/>
      <circle cx="285" cy="215" r="5" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="285" cy="215" r="2" fill="#86efac"/>
      <circle cx="335" cy="225" r="4.5" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
      <circle cx="245" cy="250" r="5" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="200" cy="245" r="4" fill="#16a34a" stroke="#14532d" stroke-width="1.2"/>
      <circle cx="310" cy="240" r="4.5" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
    </g>

    <!-- White Sesame Seeds (白芝麻點綴) -->
    <g fill="#fffbeb" stroke="#d97706" stroke-width="0.8">
      <ellipse cx="240" cy="205" rx="2" ry="3.5" transform="rotate(30 240 205)"/>
      <ellipse cx="260" cy="235" rx="2" ry="3.5" transform="rotate(-20 260 235)"/>
      <ellipse cx="180" cy="230" rx="2" ry="3.5" transform="rotate(45 180 230)"/>
      <ellipse cx="325" cy="215" rx="2" ry="3.5" transform="rotate(-35 325 215)"/>
    </g>

    <!-- Wooden Soup Spoon (原木湯匙) resting in bowl -->
    <g filter="url(#foodShadow)">
      <path d="M375,150 C385,140 405,145 400,165 L320,240 C310,250 295,248 290,235 C285,222 295,210 305,205 Z" fill="#b45309" stroke="#1e293b" stroke-width="2.5"/>
      <path d="M305,208 C300,215 295,225 300,232 C305,238 315,240 320,235" fill="none" stroke="#78350f" stroke-width="2"/>
    </g>

    <!-- Steam Wisps Rising (裊裊熱氣) -->
    <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" filter="url(#handDrawnSketch)">
      <path d="M190,175 Q180,140 200,110 Q215,85 205,65"/>
      <path d="M250,165 Q265,130 245,95 Q230,70 245,50" stroke-width="3.5"/>
      <path d="M310,170 Q325,135 310,105 Q295,80 310,55"/>
    </g>

    <!-- Top Badge / Stamp -->
    <rect x="25" y="25" width="220" height="38" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
    <text x="35" y="44" font-family="'Noto Sans TC', sans-serif" font-size="12" font-weight="900" fill="#0f172a">🍲 ${badgeText}</text>
    <text x="35" y="56" font-family="monospace" font-size="9" font-weight="bold" fill="#0284c7">INGREDIENTS: TOFU x EGG x SCALLION</text>

    <!-- Chef Stamp Bottom Right -->
    <g transform="translate(385, 420)">
      <rect width="80" height="50" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="40" y="24" font-family="'Noto Sans TC', sans-serif" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">職人手繪</text>
      <text x="40" y="39" font-family="monospace" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">SMART CHEF</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * 2. Curated Masterpiece: 黃金番茄滑蛋豆腐煲 (Golden Tomato Egg Tofu Stew)
 */
export function getTomatoEggTofuSvg(style: DishArtStyle = "watercolor"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    ${SVG_FILTERS}

    <!-- Background paper -->
    <rect width="500" height="500" fill="url(#warmPaper)" rx="24"/>
    <rect x="12" y="12" width="476" height="476" rx="18" fill="none" stroke="#fed7aa" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Wooden trivet / pan mat -->
    <ellipse cx="250" cy="385" rx="195" ry="70" fill="#d97706" opacity="0.25"/>
    <ellipse cx="250" cy="385" rx="180" ry="60" fill="#b45309" opacity="0.15"/>

    <!-- Cast Iron Skillet / Pot -->
    <g filter="url(#foodShadow)">
      <!-- Handle -->
      <path d="M400,240 L470,225 C480,223 485,233 480,245 L405,275 Z" fill="url(#castIron)" stroke="#0f172a" stroke-width="3"/>
      <!-- Pan body -->
      <ellipse cx="250" cy="270" rx="175" ry="95" fill="url(#castIron)" stroke="#0f172a" stroke-width="4"/>
      <ellipse cx="250" cy="265" rx="165" ry="85" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    </g>

    <!-- Simmering Tomato Stew Base (番茄濃湯底) -->
    <ellipse cx="250" cy="265" rx="155" ry="76" fill="url(#tomatoSauce)"/>

    <!-- Golden Scrambled Egg Folds (金黃滑蛋) -->
    <g filter="url(#handDrawnSketch)">
      <path d="M150,250 C180,230 220,240 240,265 C220,290 170,295 150,270 Z" fill="#fde047" stroke="#eab308" stroke-width="2"/>
      <path d="M260,255 C290,235 340,245 355,270 C330,295 280,290 260,270 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <path d="M200,275 C230,265 270,265 290,285 C260,305 220,305 200,285 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.8"/>
    </g>

    <!-- Braised Tofu Cubes (吸飽湯汁的嫩豆腐丁) -->
    <g>
      <!-- Tofu 1 -->
      <g transform="translate(180, 240)">
        <polygon points="0,10 28,0 52,10 24,20" fill="#fef9c3" stroke="#1e293b" stroke-width="2"/>
        <polygon points="0,10 24,20 24,42 0,32" fill="#fed7aa" stroke="#1e293b" stroke-width="2"/>
        <polygon points="24,20 52,10 52,32 24,42" fill="#fca5a5" stroke="#1e293b" stroke-width="2"/>
        <!-- Sauce glaze on tofu -->
        <path d="M10,8 Q24,14 35,9" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
      <!-- Tofu 2 -->
      <g transform="translate(265, 235)">
        <polygon points="0,8 26,0 48,8 22,18" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <polygon points="0,8 22,18 22,38 0,28" fill="#fefce8" stroke="#1e293b" stroke-width="2"/>
        <polygon points="22,18 48,8 48,28 22,38" fill="#fecdd3" stroke="#1e293b" stroke-width="2"/>
      </g>
      <!-- Tofu 3 -->
      <g transform="translate(225, 280)">
        <polygon points="0,8 24,0 44,7 20,16" fill="#fef9c3" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="0,8 20,16 20,34 0,26" fill="#fef08a" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="20,16 44,7 44,25 20,34" fill="#fb7185" stroke="#1e293b" stroke-width="1.8"/>
      </g>
    </g>

    <!-- Juicy Tomato Wedges (牛番茄滾刀塊) -->
    <g filter="url(#handDrawnSketch)">
      <!-- Tomato Wedge 1 -->
      <path d="M125,260 C135,235 165,230 180,250 C170,275 140,280 125,260 Z" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/>
      <path d="M140,248 C150,242 165,248 160,260" fill="#fca5a5" stroke="#b91c1c" stroke-width="1.5"/>
      <circle cx="150" cy="255" r="2.5" fill="#fef08a"/>

      <!-- Tomato Wedge 2 -->
      <path d="M315,250 C335,230 365,240 370,265 C350,285 320,280 315,250 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2"/>
      <path d="M330,245 C345,240 355,250 350,262" fill="#f87171" stroke="#991b1b" stroke-width="1.5"/>
      <circle cx="340" cy="252" r="2.5" fill="#fef08a"/>
    </g>

    <!-- Fresh Basil / Parsley Sprig Garnish (九層塔/香草嫩葉) -->
    <g>
      <path d="M245,240 C235,225 240,215 250,220 C260,215 265,225 255,240 Z" fill="#15803d" stroke="#14532d" stroke-width="1.8"/>
      <path d="M250,220 L250,245" stroke="#14532d" stroke-width="1.5"/>
      <path d="M235,235 C225,230 228,220 235,225 C242,220 245,230 238,235 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.2"/>
    </g>

    <!-- Steam wisps -->
    <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" filter="url(#handDrawnSketch)">
      <path d="M175,200 Q160,160 180,120 Q195,90 180,65"/>
      <path d="M250,185 Q270,145 250,110 Q235,80 250,55" stroke-width="3.5"/>
      <path d="M320,195 Q335,155 315,115 Q300,85 315,60"/>
    </g>

    <!-- Top Badge -->
    <rect x="25" y="25" width="230" height="38" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
    <text x="35" y="44" font-family="'Noto Sans TC', sans-serif" font-size="12" font-weight="900" fill="#0f172a">🍳 手繪水彩・酸甜滑蛋煲</text>
    <text x="35" y="56" font-family="monospace" font-size="9" font-weight="bold" fill="#ea580c">TOMATO x TOFU x EGG CASSEROLE</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * 3. Curated Masterpiece: 照燒鮮鮭魚佐高麗菜 (Teriyaki Salmon with Cabbage)
 */
export function getTeriyakiSalmonSvg(style: DishArtStyle = "watercolor"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    ${SVG_FILTERS}

    <!-- Background paper -->
    <rect width="500" height="500" fill="url(#warmPaper)" rx="24"/>
    <rect x="12" y="12" width="476" height="476" rx="18" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Bamboo Platter Mat -->
    <ellipse cx="250" cy="380" rx="200" ry="75" fill="#f1f5f9" opacity="0.7"/>

    <!-- Stoneware Ceramic Serving Dish (長型日式陶盤) -->
    <g filter="url(#foodShadow)">
      <path d="M70,250 C70,225 150,210 250,210 C350,210 430,225 430,250 C430,330 350,355 250,355 C150,355 70,330 70,250 Z" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
      <!-- Inner rim glaze -->
      <path d="M85,252 C85,235 155,222 250,222 C345,222 415,235 415,252 C415,315 345,340 250,340 C155,340 85,315 85,252 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
    </g>

    <!-- Shredded Green Cabbage Bed Left (高麗菜絲山) -->
    <g filter="url(#handDrawnSketch)">
      <ellipse cx="160" cy="275" rx="55" ry="38" fill="#dcfce7" stroke="#86efac" stroke-width="1.5"/>
      <path d="M120,265 Q145,245 175,260 Q195,280 160,295 Z" fill="#bbf7d0" stroke="#4ade80" stroke-width="1.2"/>
      <!-- Cabbage shred lines -->
      <path d="M130,260 Q150,250 170,265" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <path d="M125,275 Q150,265 180,278" fill="none" stroke="#22c55e" stroke-width="1.5"/>
      <path d="M140,285 Q165,275 190,285" fill="none" stroke="#16a34a" stroke-width="1.2"/>
    </g>

    <!-- Fresh Yellow Lemon Wedge (新鮮黃檸檬片) -->
    <g transform="translate(100, 280) rotate(-20)">
      <path d="M0,20 A22,22 0 0,1 44,20 Z" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
      <path d="M5,18 A17,17 0 0,1 39,18 Z" fill="#fef9c3"/>
      <!-- Pulp lines -->
      <line x1="22" y1="2" x2="22" y2="18" stroke="#eab308" stroke-width="1.5"/>
      <line x1="12" y1="7" x2="22" y2="18" stroke="#eab308" stroke-width="1.5"/>
      <line x1="32" y1="7" x2="22" y2="18" stroke="#eab308" stroke-width="1.5"/>
    </g>

    <!-- Pan-Seared Teriyaki Salmon Steak (香煎照燒鮭魚排) -->
    <g filter="url(#foodShadow)">
      <!-- Crispy skin edge -->
      <path d="M205,250 C230,225 320,220 375,235 C380,245 375,255 365,260 L215,275 Z" fill="#451a03" stroke="#1e293b" stroke-width="2"/>

      <!-- Salmon Meat Flesh with Marbled Lines -->
      <path d="M200,260 C230,230 330,225 375,245 C385,275 350,310 295,315 C240,320 185,295 200,260 Z" fill="url(#teriyakiGlaze)" stroke="#1e293b" stroke-width="2.5"/>

      <!-- Salmon fat striations (鮭魚天然油脂紋理) -->
      <path d="M230,250 Q240,280 235,300" stroke="#fecdd3" stroke-width="2.5" fill="none" opacity="0.8"/>
      <path d="M260,242 Q275,275 270,308" stroke="#fecdd3" stroke-width="2.5" fill="none" opacity="0.8"/>
      <path d="M295,238 Q310,270 305,312" stroke="#fecdd3" stroke-width="2.5" fill="none" opacity="0.8"/>
      <path d="M330,242 Q342,270 338,300" stroke="#fecdd3" stroke-width="2" fill="none" opacity="0.8"/>

      <!-- Teriyaki Caramelized Sear Marks (焦香烙痕與照燒蜜汁) -->
      <path d="M225,260 Q270,245 315,255" stroke="#3b0764" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M240,278 Q290,262 340,270" stroke="#4a044e" stroke-width="3.5" fill="none" opacity="0.7"/>
      <path d="M255,295 Q295,282 335,288" stroke="#3b0764" stroke-width="3" fill="none" opacity="0.6"/>

      <!-- Glossy sauce shine -->
      <ellipse cx="290" cy="270" rx="45" ry="15" fill="#ffffff" opacity="0.25"/>
    </g>

    <!-- Roasted White Sesame Topping (白芝麻粒) -->
    <g fill="#fffbeb" stroke="#78350f" stroke-width="0.8">
      <ellipse cx="270" cy="265" rx="2" ry="3.5" transform="rotate(25 270 265)"/>
      <ellipse cx="295" cy="258" rx="2" ry="3.5" transform="rotate(-15 295 258)"/>
      <ellipse cx="320" cy="272" rx="2" ry="3.5" transform="rotate(40 320 272)"/>
      <ellipse cx="280" cy="285" rx="2" ry="3.5" transform="rotate(-30 280 285)"/>
      <ellipse cx="305" cy="290" rx="2" ry="3.5" transform="rotate(15 305 290)"/>
    </g>

    <!-- Bamboo Chopsticks (原木竹筷) alongside plate -->
    <g filter="url(#foodShadow)">
      <path d="M90,380 L390,360" stroke="#b45309" stroke-width="5" stroke-linecap="round"/>
      <path d="M95,395 L395,372" stroke="#92400e" stroke-width="5" stroke-linecap="round"/>
      <!-- Chopstick rest (筷架) -->
      <rect x="140" y="365" width="22" height="35" rx="4" fill="#0284c7" stroke="#0f172a" stroke-width="1.8"/>
    </g>

    <!-- Steam wisps -->
    <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" filter="url(#handDrawnSketch)">
      <path d="M260,195 Q275,155 255,120 Q240,90 255,65"/>
      <path d="M320,205 Q340,165 320,130 Q305,100 320,75"/>
    </g>

    <!-- Top Badge -->
    <rect x="25" y="25" width="230" height="38" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
    <text x="35" y="44" font-family="'Noto Sans TC', sans-serif" font-size="12" font-weight="900" fill="#0f172a">🐟 手繪水彩・香煎照燒鮭魚</text>
    <text x="35" y="56" font-family="monospace" font-size="9" font-weight="bold" fill="#0284c7">PAN-SEARED TERIYAKI SALMON</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * 4. Curated Masterpiece: 蒜香五花肉片燉時蔬 (Garlic Pork Belly Stew with Vegetables)
 */
export function getGarlicPorkStewSvg(style: DishArtStyle = "watercolor"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    ${SVG_FILTERS}

    <!-- Background paper -->
    <rect width="500" height="500" fill="url(#warmPaper)" rx="24"/>
    <rect x="12" y="12" width="476" height="476" rx="18" fill="none" stroke="#fed7aa" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Earthen Pot Shadow -->
    <ellipse cx="250" cy="380" rx="180" ry="65" fill="#0f172a" opacity="0.15"/>

    <!-- Terracotta Clay Pot / Nabe (日式土鍋) -->
    <g filter="url(#foodShadow)">
      <!-- Left/Right Pot Ears -->
      <ellipse cx="85" cy="265" rx="18" ry="24" fill="#78350f" stroke="#1e293b" stroke-width="2.5"/>
      <ellipse cx="415" cy="265" rx="18" ry="24" fill="#78350f" stroke="#1e293b" stroke-width="2.5"/>

      <!-- Pot Rim & Body -->
      <path d="M95,245 C95,350 160,390 250,390 C340,390 405,350 405,245 C405,215 335,200 250,200 C165,200 95,215 95,245 Z" fill="#9a3412" stroke="#1e293b" stroke-width="3.5"/>
      <ellipse cx="250" cy="240" rx="150" ry="42" fill="#78350f" stroke="#451a03" stroke-width="2"/>
    </g>

    <!-- Savory Dashi Stock Surface -->
    <ellipse cx="250" cy="245" rx="142" ry="36" fill="#ca8a04" opacity="0.8"/>

    <!-- Braised Cabbage Leaves Base (燉爛高麗菜葉) -->
    <g filter="url(#handDrawnSketch)">
      <path d="M130,240 Q170,225 210,245 Q170,270 130,240 Z" fill="#a7f3d0" stroke="#34d399" stroke-width="1.5"/>
      <path d="M290,240 Q330,225 370,245 Q330,270 290,240 Z" fill="#6ee7b7" stroke="#10b981" stroke-width="1.5"/>
      <path d="M210,250 Q250,235 290,250 Q250,275 210,250 Z" fill="#d1fae5" stroke="#34d399" stroke-width="1.5"/>
    </g>

    <!-- Sliced Pork Belly Strips (薄切五花肉片) -->
    <g filter="url(#foodShadow)">
      <!-- Pork Slice 1 -->
      <g transform="translate(160, 230) rotate(-10)">
        <path d="M0,15 C20,5 60,8 80,18 C65,30 25,28 0,15 Z" fill="#fda4af" stroke="#be123c" stroke-width="2"/>
        <!-- Fat ribbon -->
        <path d="M10,13 C30,7 50,10 70,17" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.9"/>
        <path d="M5,18 C25,12 55,14 75,22" stroke="#f43f5e" stroke-width="2" fill="none"/>
      </g>
      <!-- Pork Slice 2 -->
      <g transform="translate(230, 235) rotate(15)">
        <path d="M0,15 C25,5 70,10 90,22 C75,34 30,30 0,15 Z" fill="#fb7185" stroke="#9f1239" stroke-width="2"/>
        <path d="M12,14 C35,8 60,12 80,20" stroke="#fff1f2" stroke-width="3.5" fill="none"/>
      </g>
    </g>

    <!-- Roasted Golden Garlic Cloves (金黃整顆蒜瓣) -->
    <g>
      <ellipse cx="210" cy="235" rx="9" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8" transform="rotate(20 210 235)"/>
      <path d="M208,225 Q212,235 210,245" stroke="#eab308" stroke-width="1"/>
      <ellipse cx="280" cy="230" rx="9" ry="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8" transform="rotate(-30 280 230)"/>
      <ellipse cx="245" cy="260" rx="8" ry="10" fill="#fde047" stroke="#ca8a04" stroke-width="1.8"/>
    </g>

    <!-- Sliced Tomato Wedges in Broth -->
    <g>
      <path d="M140,250 C150,235 170,235 175,250 C165,265 145,265 140,250 Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.8"/>
      <path d="M325,248 C335,233 355,233 360,248 C350,263 330,263 325,248 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.8"/>
    </g>

    <!-- Chopped Scallions & Black Pepper specks -->
    <g>
      <circle cx="200" cy="248" r="3.5" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
      <circle cx="230" cy="225" r="4" fill="#16a34a" stroke="#14532d" stroke-width="1"/>
      <circle cx="270" cy="255" r="3.5" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
      <circle cx="295" cy="245" r="4" fill="#16a34a" stroke="#14532d" stroke-width="1"/>
    </g>

    <!-- Steam wisps -->
    <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" filter="url(#handDrawnSketch)">
      <path d="M185,185 Q170,145 190,110 Q205,80 190,55"/>
      <path d="M250,170 Q270,130 250,95 Q235,65 250,40" stroke-width="3.5"/>
      <path d="M315,180 Q330,140 310,105 Q295,75 310,50"/>
    </g>

    <!-- Top Badge -->
    <rect x="25" y="25" width="230" height="38" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
    <text x="35" y="44" font-family="'Noto Sans TC', sans-serif" font-size="12" font-weight="900" fill="#0f172a">🍲 手繪水彩・蒜香五花肉時蔬鍋</text>
    <text x="35" y="56" font-family="monospace" font-size="9" font-weight="bold" fill="#b45309">GARLIC PORK BELLY STEW</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * 5. Dynamic Procedural Hand-Drawn Culinary Illustrator
 * Tailors a custom, mouthwatering hand-drawn SVG painting according to ANY dish title,
 * cooking method (soup/stirfry/panfry/steam/salad), and detected ingredients!
 */
export function generateDynamicHandDrawnDishSvg(recipe: RecipeItem, style: DishArtStyle = "watercolor"): string {
  const title = recipe.title || "手作私房佳餚";
  const ings = (recipe.usedIngredients || []).map((i) => i.name).join(" ");
  const allText = `${title} ${ings} ${(recipe.cookSteps || []).join(" ")}`;

  // Determine dish classification
  const isSoup = /湯|羹|煲|鍋|燉|粥|麵|udon|soup|stew|hotpot/i.test(allText);
  const isStirFry = /炒|爆|快炒|時蔬|stir|wok/i.test(allText);
  const isSaladOrCold = /涼拌|沙拉|冷盤|涼麵|刺身|生菜/i.test(allText);
  const hasFish = /鮭魚|魚|海鮮|蝦|fish|salmon|seafood/i.test(allText);
  const hasEgg = /蛋|滑蛋|烘蛋|煎蛋|egg/i.test(allText);
  const hasTofu = /豆腐|豆皮|豆花|tofu/i.test(allText);
  const hasTomato = /番茄|番茄醬|tomato/i.test(allText);
  const hasPorkOrMeat = /五花肉|豬肉|牛肉|雞肉|肉片|肉絲|pork|beef|chicken/i.test(allText);
  const hasGreens = /菜|高麗菜|青菜|花椰菜|菠菜|青江菜|蔥|cabbage|greens/i.test(allText);

  // Style badge title
  const styleLabel =
    style === "japanese_cookbook"
      ? "日式料理書風格"
      : style === "colored_pencil"
      ? "色鉛筆手繪插畫"
      : "溫暖水彩手繪美食";

  // Vessel Selection: Bowl for soups, Round plate for stir-fries, Oblong plate for fish/meat
  let vesselSvg = "";
  if (isSoup) {
    vesselSvg = `
      <g filter="url(#foodShadow)">
        <path d="M100,230 C100,345 160,395 250,395 C340,395 400,345 400,230 C400,205 330,195 250,195 C170,195 100,205 100,230 Z" fill="url(#ceramicBowl)" stroke="#1e293b" stroke-width="3"/>
        <path d="M105,235 C105,255 170,270 250,270 C330,270 395,255 395,235" fill="none" stroke="#ca8a04" stroke-width="2.5"/>
      </g>
      <ellipse cx="250" cy="235" rx="142" ry="46" fill="${hasTomato ? "url(#tomatoSauce)" : "url(#soupBroth)"}"/>
    `;
  } else if (hasFish) {
    vesselSvg = `
      <g filter="url(#foodShadow)">
        <ellipse cx="250" cy="285" rx="175" ry="85" fill="#f8fafc" stroke="#1e293b" stroke-width="3"/>
        <ellipse cx="250" cy="285" rx="155" ry="72" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
      </g>
    `;
  } else {
    // Round ceramic plate or skillet
    vesselSvg = `
      <g filter="url(#foodShadow)">
        <ellipse cx="250" cy="280" rx="170" ry="95" fill="#fffdfa" stroke="#1e293b" stroke-width="3.5"/>
        <ellipse cx="250" cy="278" rx="150" ry="80" fill="#fefce8" stroke="#fde047" stroke-width="1.5"/>
      </g>
    `;
  }

  // Food elements inside vessel
  let foodElements = "";

  // 1. Tofu blocks
  if (hasTofu) {
    foodElements += `
      <g transform="translate(180, 225)">
        <polygon points="0,8 24,0 44,8 20,16" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="0,8 20,16 20,34 0,26" fill="#fefce8" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="20,16 44,8 44,26 20,34" fill="#fef08a" stroke="#1e293b" stroke-width="1.8"/>
      </g>
      <g transform="translate(250, 235)">
        <polygon points="0,8 22,0 40,7 18,15" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="0,8 18,15 18,33 0,26" fill="#fefce8" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="18,15 40,7 40,25 18,33" fill="#fef08a" stroke="#1e293b" stroke-width="1.8"/>
      </g>
    `;
  }

  // 2. Eggs (swirls or fluffy omelet curds)
  if (hasEgg) {
    foodElements += `
      <g filter="url(#handDrawnSketch)">
        <path d="M150,240 Q190,215 240,230 Q290,245 330,225 Q290,265 240,260 Q180,270 150,240 Z" fill="#fef08a" opacity="0.9" stroke="#eab308" stroke-width="1.5"/>
        <path d="M200,255 Q245,240 290,255 Q265,280 215,275 Z" fill="#fde047" opacity="0.95" stroke="#facc15" stroke-width="1.5"/>
      </g>
    `;
  }

  // 3. Fish or Meat
  if (hasFish) {
    foodElements += `
      <g transform="translate(200, 240)">
        <path d="M0,25 C30,5 110,0 145,18 C150,38 120,60 75,62 C30,64 -10,45 0,25 Z" fill="url(#teriyakiGlaze)" stroke="#1e293b" stroke-width="2.5"/>
        <path d="M20,20 Q60,10 100,22" stroke="#4a044e" stroke-width="3" fill="none"/>
        <path d="M35,38 Q75,25 115,40" stroke="#4a044e" stroke-width="3" fill="none"/>
      </g>
    `;
  } else if (hasPorkOrMeat) {
    foodElements += `
      <g transform="translate(170, 245) rotate(-5)">
        <path d="M0,15 C25,5 75,8 95,20 C80,32 30,30 0,15 Z" fill="#fda4af" stroke="#be123c" stroke-width="2"/>
        <path d="M15,13 C40,8 65,11 85,18" stroke="#ffffff" stroke-width="3" fill="none"/>
      </g>
      <g transform="translate(230, 260) rotate(12)">
        <path d="M0,15 C25,5 70,8 88,20 C75,32 30,30 0,15 Z" fill="#fb7185" stroke="#be123c" stroke-width="2"/>
        <path d="M12,13 C35,8 60,10 78,18" stroke="#ffffff" stroke-width="3" fill="none"/>
      </g>
    `;
  }

  // 4. Tomato wedges
  if (hasTomato) {
    foodElements += `
      <path d="M135,260 C145,235 175,230 185,252 C170,275 145,280 135,260 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
      <path d="M310,255 C330,235 360,240 365,265 C345,285 320,280 310,255 Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    `;
  }

  // 5. Cabbage or fresh vegetables
  if (hasGreens || isStirFry || isSaladOrCold) {
    foodElements += `
      <g filter="url(#handDrawnSketch)">
        <ellipse cx="150" cy="275" rx="35" ry="25" fill="#bbf7d0" stroke="#22c55e" stroke-width="1.5"/>
        <ellipse cx="340" cy="275" rx="35" ry="25" fill="#86efac" stroke="#16a34a" stroke-width="1.5"/>
        <circle cx="210" cy="240" r="4.5" fill="#16a34a"/>
        <circle cx="280" cy="245" r="4.5" fill="#22c55e"/>
        <circle cx="250" cy="270" r="4" fill="#16a34a"/>
      </g>
    `;
  }

  // Steam if cooked
  const steamSvg = !isSaladOrCold
    ? `
      <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65" filter="url(#handDrawnSketch)">
        <path d="M185,180 Q170,140 190,105 Q205,75 190,50"/>
        <path d="M250,165 Q270,125 250,90 Q235,60 250,35" stroke-width="3.5"/>
        <path d="M315,175 Q330,135 310,100 Q295,70 310,45"/>
      </g>
    `
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
    ${SVG_FILTERS}

    <!-- Background paper -->
    <rect width="500" height="500" fill="url(#warmPaper)" rx="24"/>
    <rect x="12" y="12" width="476" height="476" rx="18" fill="none" stroke="#e2d8c3" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Tablecloth mat -->
    <ellipse cx="250" cy="380" rx="195" ry="75" fill="#fef3c7" opacity="0.5"/>

    <!-- Vessel -->
    ${vesselSvg}

    <!-- Food elements -->
    ${foodElements}

    <!-- Steam -->
    ${steamSvg}

    <!-- Top Dish Title Badge -->
    <rect x="25" y="25" width="260" height="42" rx="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
    <text x="35" y="46" font-family="'Noto Sans TC', sans-serif" font-size="12" font-weight="900" fill="#0f172a">🎨 ${title.slice(0, 14)}</text>
    <text x="35" y="58" font-family="monospace" font-size="9" font-weight="bold" fill="#0284c7">${styleLabel} // AI GENERATED</text>

    <!-- Chef Stamp Bottom Right -->
    <g transform="translate(385, 420)">
      <rect width="80" height="50" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
      <text x="40" y="24" font-family="'Noto Sans TC', sans-serif" font-size="11" font-weight="bold" fill="#b91c1c" text-anchor="middle">料理圖鑑</text>
      <text x="40" y="39" font-family="monospace" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">CHEF ART</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Universal Dish Image Resolver:
 * Maps any dish title to its curated high-fidelity masterpiece,
 * or generates a procedural watercolor painting if dynamic.
 */
export function getRecipeDishImage(recipe: RecipeItem, preferredStyle: DishArtStyle = "watercolor"): string {
  if (recipe.imageUrl && recipe.imageUrl.startsWith("data:image")) {
    return recipe.imageUrl;
  }

  const title = (recipe.title || "").trim();

  // Match curated artworks
  if (title.includes("蛋花羹") || title.includes("豆腐蛋花") || title.includes("Tofu Egg Drop")) {
    return getTofuEggSoupSvg(preferredStyle);
  }
  if (title.includes("番茄滑蛋") || title.includes("番茄炒蛋") || title.includes("豆腐煲")) {
    return getTomatoEggTofuSvg(preferredStyle);
  }
  if (title.includes("鮭魚") || title.includes("照燒") || title.includes("Salmon")) {
    return getTeriyakiSalmonSvg(preferredStyle);
  }
  if (title.includes("五花肉") || title.includes("蒜香") || title.includes("肉片燉")) {
    return getGarlicPorkStewSvg(preferredStyle);
  }

  // Fallback to dynamic tailored hand-drawn illustration
  return generateDynamicHandDrawnDishSvg(recipe, preferredStyle);
}
