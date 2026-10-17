import os
import math
import subprocess
import shutil

WIDTH = 1280
HEIGHT = 720
FPS = 24
DURATION_SEC = 6.5
TOTAL_FRAMES = int(FPS * DURATION_SEC) # 156 frames

OUTPUT_DIR = "/tmp/intro_frames"
AUDIO_OUTPUT = "/tmp/intro_audio.aac"
FINAL_VIDEO = "/app/applet/public/intro.mp4"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs("/app/applet/public", exist_ok=True)

def ease_in_out(t):
    return t * t * (3.0 - 2.0 * t)

def ease_in(t):
    return t * t * t

def render_frame(frame_idx):
    time_sec = frame_idx / FPS
    progress = frame_idx / TOTAL_FRAMES

    # Door opening phase: 1.2s to 3.8s
    if time_sec < 1.2:
        door_open = 0.0
    elif time_sec < 3.8:
        door_t = (time_sec - 1.2) / 2.6
        door_open = ease_in_out(door_t)
    else:
        door_open = 1.0

    # Light pulse phase: starts at 4.6s to 6.5s
    if time_sec < 4.6:
        light_intensity = 0.0
        light_radius = 0.0
        flash_white = 0.0
    elif time_sec < 5.8:
        lt = (time_sec - 4.6) / 1.2
        light_intensity = ease_in_out(lt)
        light_radius = 30 + light_intensity * 380
        flash_white = 0.0
    else:
        lt = (time_sec - 5.8) / 0.7
        light_intensity = 1.0
        light_radius = 410 + lt * 800
        flash_white = ease_in(lt)

    # Perspective angles for doors
    # When fully open, doors swing outward: left door to -105 deg, right door to 105 deg
    door_angle = door_open * 105.0 # degrees
    cos_angle = math.cos(math.radians(door_angle))
    sin_angle = math.sin(math.radians(door_angle))
    
    # Left door width perspective factor (min 0.15 for depth edge)
    left_scale_x = max(0.08, cos_angle)
    right_scale_x = max(0.08, cos_angle)

    # Camera slight push-in during light reveal
    cam_zoom = 1.0 + (light_intensity * 0.08)

    svg = f'''<svg width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Paper texture & gradients -->
    <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e2e8dc"/>
      <stop offset="60%" stop-color="#dce3d5"/>
      <stop offset="100%" stop-color="#d1daca"/>
    </linearGradient>

    <radialGradient id="lampGlow" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="#fff8db" stop-opacity="0.75"/>
      <stop offset="50%" stop-color="#faecc2" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#e2e8dc" stop-opacity="0"/>
    </radialGradient>

    <!-- Fridge Exterior Body Gradient -->
    <linearGradient id="fridgeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fdfbf5"/>
      <stop offset="50%" stop-color="#fbf7ec"/>
      <stop offset="100%" stop-color="#ede3cd"/>
    </linearGradient>

    <!-- Fridge Interior Glow -->
    <radialGradient id="fridgeInsideGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#fffbee"/>
      <stop offset="80%" stop-color="#fef5d8"/>
      <stop offset="100%" stop-color="#f5e8be"/>
    </radialGradient>

    <!-- Chrome Handle Gradient -->
    <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a0aec0"/>
      <stop offset="40%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>

    <!-- Light Burst Core -->
    <radialGradient id="coreLight" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1.0"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="70%" stop-color="#fff8db" stop-opacity="0.75"/>
      <stop offset="90%" stop-color="#fde047" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- BACKGROUND: Kitchen Wall & Tiles -->
  <rect width="{WIDTH}" height="{HEIGHT}" fill="url(#wallGrad)"/>

  <!-- Kitchen Vertical Planks/Tiles Watercolor lines -->
  <g stroke="#bccbb3" stroke-width="1.2" stroke-dasharray="1200,0" opacity="0.45">
    <line x1="120" y1="0" x2="120" y2="720"/>
    <line x1="240" y1="0" x2="240" y2="720"/>
    <line x1="360" y1="0" x2="360" y2="720"/>
    <line x1="920" y1="0" x2="920" y2="720"/>
    <line x1="1040" y1="0" x2="1040" y2="720"/>
    <line x1="1160" y1="0" x2="1160" y2="720"/>
  </g>

  <!-- PENDANT CEILING LAMP -->
  <g id="pendantLamp">
    <!-- Hanging cord -->
    <line x1="640" y1="0" x2="640" y2="75" stroke="#374151" stroke-width="3"/>
    <!-- Lamp dome -->
    <path d="M570,95 Q640,45 710,95 L720,105 L560,105 Z" fill="#3b3734" stroke="#23211f" stroke-width="2"/>
    <circle cx="640" cy="106" r="14" fill="#fbbf24"/>
    <!-- Cone of light -->
    <polygon points="640,105 380,480 900,480" fill="url(#lampGlow)"/>
  </g>

  <!-- TOP WOODEN SHELVES & KITCHEN PROPS -->
  <!-- Upper Shelf -->
  <rect x="80" y="120" width="1120" height="16" rx="3" fill="#ba9269" stroke="#523d29" stroke-width="2"/>
  <rect x="80" y="136" width="1120" height="4" fill="#8c6843"/>

  <!-- Items on upper shelf -->
  <!-- Left Ivy Pot -->
  <path d="M140,120 L160,80 L200,80 L220,120 Z" fill="#c26e4f" stroke="#3b2216" stroke-width="2"/>
  <!-- Ivy leaves -->
  <path d="M150,75 Q130,50 170,40 Q210,50 190,75 Z" fill="#4d8252" stroke="#224225" stroke-width="1.5"/>
  <path d="M135,100 Q110,130 120,160 Q135,170 145,140 Z" fill="#5f9a64" stroke="#224225" stroke-width="1.5"/>
  <path d="M210,100 Q240,125 230,165 Q215,160 205,130 Z" fill="#5f9a64" stroke="#224225" stroke-width="1.5"/>

  <!-- Glass jars with spices / tomato pasta on top shelf -->
  <rect x="250" y="70" width="35" height="50" rx="4" fill="#fde047" fill-opacity="0.8" stroke="#334155" stroke-width="1.5"/>
  <rect x="295" y="60" width="40" height="60" rx="4" fill="#ea580c" fill-opacity="0.8" stroke="#334155" stroke-width="1.5"/>
  <rect x="345" y="75" width="30" height="45" rx="4" fill="#84cc16" fill-opacity="0.8" stroke="#334155" stroke-width="1.5"/>

  <!-- Wicker basket above fridge -->
  <path d="M570,120 Q640,105 710,120 L730,70 Q640,55 550,70 Z" fill="#c89d66" stroke="#5b4020" stroke-width="2"/>
  <path d="M555,75 Q640,95 725,75" stroke="#8d683b" stroke-width="2" fill="none"/>
  <path d="M565,95 Q640,115 715,95" stroke="#8d683b" stroke-width="2" fill="none"/>

  <!-- Framed picture on shelf -->
  <rect x="740" y="55" width="45" height="65" rx="3" fill="#78350f" stroke="#451a03" stroke-width="2"/>
  <rect x="746" y="61" width="33" height="53" fill="#f8fafc"/>
  <circle cx="762" cy="82" r="10" fill="#94a3b8"/>

  <!-- Right jars & Ivy on shelf -->
  <rect x="810" y="70" width="38" height="50" rx="4" fill="#a855f7" fill-opacity="0.6" stroke="#334155" stroke-width="1.5"/>
  <rect x="855" y="65" width="35" height="55" rx="4" fill="#eab308" fill-opacity="0.7" stroke="#334155" stroke-width="1.5"/>
  <!-- Right ivy plant -->
  <path d="M920,120 L940,85 L980,85 L1000,120 Z" fill="#d97706" stroke="#451a03" stroke-width="2"/>
  <path d="M930,80 Q960,45 990,80 Z" fill="#3f7243" stroke="#1d4020" stroke-width="1.5"/>
  <path d="M990,105 Q1025,135 1010,175 Q985,160 980,120 Z" fill="#528e57" stroke="#1d4020" stroke-width="1.5"/>
  <path d="M940,110 Q920,140 930,170 Q945,165 950,130 Z" fill="#528e57" stroke="#1d4020" stroke-width="1.5"/>

  <!-- LEFT KITCHEN COUNTER & CUPBOARDS -->
  <rect x="0" y="440" width="440" height="280" fill="#5b7866" stroke="#263b2e" stroke-width="2"/>
  <!-- Wood Countertop -->
  <rect x="0" y="425" width="450" height="22" rx="3" fill="#cf9c6b" stroke="#4d321b" stroke-width="2"/>
  <!-- Cupboard panels & knobs -->
  <rect x="30" y="470" width="160" height="220" rx="8" fill="#4d6756" stroke="#263b2e" stroke-width="1.5"/>
  <circle cx="170" cy="580" r="7" fill="#d97706" stroke="#3b2216" stroke-width="1.5"/>
  <rect x="220" y="470" width="160" height="220" rx="8" fill="#4d6756" stroke="#263b2e" stroke-width="1.5"/>
  <circle cx="240" cy="580" r="7" fill="#d97706" stroke="#3b2216" stroke-width="1.5"/>

  <!-- Props on Left Counter: Cutting boards & Utensil jar -->
  <!-- Round wooden board leaning -->
  <circle cx="100" cy="385" r="45" fill="#a7774e" stroke="#4a301a" stroke-width="2"/>
  <circle cx="100" cy="385" r="40" fill="none" stroke="#875b36" stroke-width="1.5" stroke-dasharray="8,4"/>
  <!-- Rectangular wooden paddle board -->
  <rect x="135" y="335" width="55" height="95" rx="5" fill="#c49364" stroke="#4a301a" stroke-width="2"/>
  <!-- Ceramic Crock with wooden spoons -->
  <rect x="210" y="360" width="55" height="70" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <!-- Spatulas / spoons -->
  <line x1="225" y1="360" x2="215" y2="310" stroke="#8d683b" stroke-width="5" stroke-linecap="round"/>
  <circle cx="215" cy="310" r="10" fill="#ba9269"/>
  <line x1="240" y1="360" x2="245" y2="305" stroke="#8d683b" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="245" cy="305" rx="7" ry="12" fill="#c49364"/>
  <line x1="255" y1="360" x2="265" y2="315" stroke="#8d683b" stroke-width="5" stroke-linecap="round"/>
  <!-- Herb pot -->
  <path d="M300,425 L310,385 L345,385 L355,425 Z" fill="#ea580c" stroke="#431407" stroke-width="1.5"/>
  <circle cx="328" cy="370" r="18" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>

  <!-- RIGHT KITCHEN COUNTER & CUPBOARDS -->
  <rect x="830" y="440" width="450" height="280" fill="#5b7866" stroke="#263b2e" stroke-width="2"/>
  <rect x="820" y="425" width="460" height="22" rx="3" fill="#cf9c6b" stroke="#4d321b" stroke-width="2"/>
  <!-- Cupboard panels & knobs -->
  <rect x="880" y="470" width="160" height="220" rx="8" fill="#4d6756" stroke="#263b2e" stroke-width="1.5"/>
  <circle cx="1020" cy="580" r="7" fill="#d97706" stroke="#3b2216" stroke-width="1.5"/>
  <rect x="1070" y="470" width="160" height="220" rx="8" fill="#4d6756" stroke="#263b2e" stroke-width="1.5"/>
  <circle cx="1090" cy="580" r="7" fill="#d97706" stroke="#3b2216" stroke-width="1.5"/>

  <!-- Props on Right Counter: Clock, kettle, bowl of fruit -->
  <!-- Clock on wall -->
  <circle cx="910" cy="340" r="30" fill="#fffdfa" stroke="#78350f" stroke-width="4"/>
  <line x1="910" y1="340" x2="910" y2="320" stroke="#1e293b" stroke-width="2"/>
  <line x1="910" y1="340" x2="925" y2="340" stroke="#1e293b" stroke-width="2"/>
  <!-- Retro teal electric kettle -->
  <path d="M975,425 L985,360 Q1015,350 1045,360 L1055,425 Z" fill="#2dd4bf" stroke="#0f766e" stroke-width="2"/>
  <path d="M1045,370 Q1075,375 1070,410 Q1055,415 1050,400" fill="none" stroke="#0f766e" stroke-width="3"/>
  <!-- Bowl of fresh oranges -->
  <ellipse cx="1140" cy="425" rx="55" ry="18" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <circle cx="1120" cy="405" r="16" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
  <circle cx="1150" cy="400" r="17" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
  <circle cx="1135" cy="385" r="16" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/>
  <circle cx="1165" cy="410" r="15" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>

  <!-- REFRIGERATOR MAIN UNIT (X: 430 to 850, Width 420, Height 530, Y: 155 to 685) -->
  <g id="fridgeFrame">
    <!-- Outer Fridge Cabinet (Cream casing) -->
    <rect x="420" y="145" width="440" height="545" rx="35" fill="url(#fridgeBodyGrad)" stroke="#2d3748" stroke-width="3"/>

    <!-- FRIDGE INTERIOR (Visible as doors open) -->
    <g id="fridgeInterior">
      <!-- Inner cavity with warm illuminated wash -->
      <rect x="440" y="165" width="400" height="505" rx="20" fill="url(#fridgeInsideGlow)" stroke="#cbd5e1" stroke-width="2"/>

      <!-- Interior Shelves (Wire/Glass with chrome brackets) -->
      <!-- Shelf 1 (Top) -->
      <line x1="440" y1="260" x2="840" y2="260" stroke="#94a3b8" stroke-width="3"/>
      <!-- Shelf 1 contents: Jars & Egg carton -->
      <g id="shelf1Food">
        <!-- Egg carton with 10 eggs -->
        <rect x="690" y="235" width="125" height="25" rx="4" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="705" cy="235" r="7" fill="#f59e0b"/>
        <circle cx="725" cy="235" r="7" fill="#f59e0b"/>
        <circle cx="745" cy="235" r="7" fill="#f59e0b"/>
        <circle cx="765" cy="235" r="7" fill="#f59e0b"/>
        <circle cx="785" cy="235" r="7" fill="#f59e0b"/>
        <circle cx="805" cy="235" r="7" fill="#f59e0b"/>

        <!-- Jars on top shelf -->
        <rect x="465" y="200" width="38" height="58" rx="5" fill="#ef4444" fill-opacity="0.85" stroke="#334155" stroke-width="1.5"/>
        <rect x="470" y="193" width="28" height="8" rx="2" fill="#d97706"/>
        <rect x="515" y="205" width="35" height="53" rx="5" fill="#f59e0b" fill-opacity="0.85" stroke="#334155" stroke-width="1.5"/>
        <rect x="520" y="198" width="25" height="8" rx="2" fill="#b45309"/>
        <rect x="560" y="190" width="42" height="68" rx="6" fill="#84cc16" fill-opacity="0.8" stroke="#334155" stroke-width="1.5"/>
        <rect x="615" y="205" width="36" height="53" rx="5" fill="#38bdf8" fill-opacity="0.8" stroke="#334155" stroke-width="1.5"/>
      </g>

      <!-- Shelf 2 (Middle-Top) -->
      <line x1="440" y1="365" x2="840" y2="365" stroke="#94a3b8" stroke-width="3"/>
      <!-- Shelf 2 contents: Cherry tomatoes, purple grapes, fresh meal boxes -->
      <g id="shelf2Food">
        <!-- Basket of ripe red tomatoes -->
        <path d="M465,363 Q505,370 545,363 L550,335 Q505,330 460,335 Z" fill="#d97706" stroke="#451a03" stroke-width="1.5"/>
        <circle cx="480" cy="325" r="11" fill="#ef4444" stroke="#991b1b" stroke-width="1.2"/>
        <circle cx="500" cy="320" r="12" fill="#dc2626" stroke="#991b1b" stroke-width="1.2"/>
        <circle cx="522" cy="323" r="11" fill="#ef4444" stroke="#991b1b" stroke-width="1.2"/>
        <circle cx="492" cy="310" r="10" fill="#f87171" stroke="#991b1b" stroke-width="1.2"/>
        <circle cx="512" cy="308" r="11" fill="#ef4444" stroke="#991b1b" stroke-width="1.2"/>

        <!-- Violet Grapes -->
        <g id="grapes">
          <circle cx="580" cy="325" r="9" fill="#8b5cf6" stroke="#5b21b6" stroke-width="1"/>
          <circle cx="595" cy="320" r="9" fill="#7c3aed" stroke="#5b21b6" stroke-width="1"/>
          <circle cx="610" cy="323" r="9" fill="#6d28d9" stroke="#5b21b6" stroke-width="1"/>
          <circle cx="588" cy="338" r="9" fill="#7c3aed" stroke="#5b21b6" stroke-width="1"/>
          <circle cx="604" cy="336" r="9" fill="#5b21b6" stroke="#4c1d95" stroke-width="1"/>
          <circle cx="596" cy="350" r="8" fill="#4c1d95" stroke="#3b0764" stroke-width="1"/>
        </g>

        <!-- Glass meal-prep boxes with broccoli & salads -->
        <rect x="645" y="315" width="70" height="48" rx="6" fill="#ffffff" fill-opacity="0.8" stroke="#0ea5e9" stroke-width="1.5"/>
        <rect x="642" y="310" width="76" height="8" rx="2" fill="#0284c7"/>
        <circle cx="665" cy="338" r="10" fill="#22c55e"/>
        <circle cx="685" cy="335" r="12" fill="#16a34a"/>
        <circle cx="698" cy="342" r="9" fill="#15803d"/>

        <!-- Second glass container with carrots & greens -->
        <rect x="735" y="315" width="85" height="48" rx="6" fill="#ffffff" fill-opacity="0.8" stroke="#f97316" stroke-width="1.5"/>
        <rect x="732" y="310" width="91" height="8" rx="2" fill="#ea580c"/>
        <rect x="745" y="328" width="40" height="9" rx="3" fill="#f97316"/>
        <rect x="748" y="342" width="35" height="8" rx="3" fill="#fb923c"/>
        <circle cx="800" cy="336" r="10" fill="#22c55e"/>
      </g>

      <!-- Shelf 3 (Middle-Bottom) -->
      <line x1="440" y1="475" x2="840" y2="475" stroke="#94a3b8" stroke-width="3"/>
      <!-- Shelf 3 contents: Nuts, sliced lemons, limes, containers -->
      <g id="shelf3Food">
        <!-- Jar with walnuts / nuts -->
        <rect x="460" y="405" width="45" height="68" rx="6" fill="#d97706" fill-opacity="0.4" stroke="#334155" stroke-width="1.5"/>
        <rect x="462" y="398" width="41" height="8" rx="2" fill="#78350f"/>
        <circle cx="475" cy="425" r="6" fill="#b45309"/>
        <circle cx="490" cy="435" r="7" fill="#92400e"/>
        <circle cx="478" cy="450" r="7" fill="#78350f"/>

        <!-- Jar with almonds -->
        <rect x="520" y="415" width="40" height="58" rx="5" fill="#f59e0b" fill-opacity="0.4" stroke="#334155" stroke-width="1.5"/>
        <rect x="522" y="408" width="36" height="8" rx="2" fill="#92400e"/>

        <!-- Sliced lemons in glass bowl -->
        <ellipse cx="610" cy="460" rx="35" ry="14" fill="#ffffff" stroke="#38bdf8" stroke-width="1.5"/>
        <circle cx="595" cy="445" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="1.2"/>
        <circle cx="615" cy="442" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="1.2"/>
        <circle cx="628" cy="448" r="11" fill="#a3e635" stroke="#65a30d" stroke-width="1.2"/>

        <!-- Clear container with berries / cut melons -->
        <rect x="670" y="425" width="75" height="48" rx="6" fill="#ffffff" fill-opacity="0.8" stroke="#38bdf8" stroke-width="1.5"/>
        <rect x="668" y="420" width="79" height="7" rx="2" fill="#0284c7"/>
        <circle cx="690" cy="445" r="8" fill="#ec4899"/>
        <circle cx="705" cy="442" r="9" fill="#f43f5e"/>
        <circle cx="725" cy="448" r="8" fill="#e11d48"/>

        <!-- Glass bottle with green dressing -->
        <rect x="770" y="395" width="32" height="78" rx="6" fill="#84cc16" fill-opacity="0.6" stroke="#334155" stroke-width="1.5"/>
        <rect x="778" y="380" width="16" height="16" rx="2" fill="#4d7c0f"/>
      </g>

      <!-- CRISPER DRAWERS (Bottom) -->
      <!-- Left Drawer: Fruits -->
      <g id="fruitsDrawer">
        <rect x="450" y="495" width="185" height="155" rx="10" fill="#fef08a" fill-opacity="0.45" stroke="#ca8a04" stroke-width="2"/>
        <!-- Drawer handle -->
        <rect x="500" y="505" width="85" height="12" rx="4" fill="#fde047" stroke="#a16207" stroke-width="1.5"/>
        <!-- Handwritten label: Fruits -->
        <text x="542" y="542" font-family="'Comic Sans MS', 'Patrick Hand', sans-serif" font-weight="bold" font-size="14" fill="#a16207" text-anchor="middle">Fruits</text>
        <!-- Apples & Oranges inside -->
        <circle cx="485" cy="580" r="22" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="530" cy="585" r="21" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
        <circle cx="585" cy="580" r="22" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="510" cy="615" r="20" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
        <circle cx="560" cy="620" r="21" fill="#ea580c" stroke="#9a3412" stroke-width="1.5"/>
      </g>

      <!-- Right Drawer: Vegetables -->
      <g id="vegetablesDrawer">
        <rect x="645" y="495" width="185" height="155" rx="10" fill="#bbf7d0" fill-opacity="0.45" stroke="#16a34a" stroke-width="2"/>
        <!-- Drawer handle -->
        <rect x="695" y="505" width="85" height="12" rx="4" fill="#86efac" stroke="#15803d" stroke-width="1.5"/>
        <!-- Handwritten label: Vegetables -->
        <text x="737" y="542" font-family="'Comic Sans MS', 'Patrick Hand', sans-serif" font-weight="bold" font-size="14" fill="#15803d" text-anchor="middle">Vegetables</text>
        <!-- Broccoli, red peppers, corn, carrots -->
        <circle cx="680" cy="580" r="22" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
        <circle cx="730" cy="575" r="20" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
        <circle cx="785" cy="580" r="22" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
        <circle cx="705" cy="618" r="20" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
        <circle cx="760" cy="615" r="22" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
      </g>
    </g>

    <!-- LEFT DOOR (Hinged at X=430) -->
    <g transform="translate(430, 0)">
      <g transform="scale({left_scale_x}, 1.0)">
        <!-- Left Door Base -->
        <path d="M0,155 L205,155 L205,680 L0,680 Z" fill="#fbf8ef" stroke="#2d3748" stroke-width="2.5"/>
        <!-- Left door inside shelves when swung open -->
        {f"""
        <g opacity="{door_open}">
          <!-- Door racks with condiment bottles, olive oil -->
          <rect x="15" y="220" width="175" height="18" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
          <rect x="30" y="175" width="22" height="45" rx="3" fill="#ea580c"/>
          <rect x="65" y="165" width="26" height="55" rx="4" fill="#84cc16"/>
          <rect x="105" y="170" width="28" height="50" rx="4" fill="#eab308"/>
          <!-- Lower door rack -->
          <rect x="15" y="380" width="175" height="18" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
          <rect x="35" y="315" width="30" height="65" rx="5" fill="#16a34a"/>
          <rect x="80" y="300" width="35" height="80" rx="5" fill="#f8fafc" stroke="#94a3b8"/>
        </g>
        """ if door_open > 0.05 else ""}

        <!-- Left door exterior face when closed or partially open -->
        <g opacity="{max(0.0, 1.0 - door_open * 1.2)}">
          <!-- Embossed FRIPGER (Left half) -->
          <text x="180" y="195" font-family="Georgia, serif" font-weight="900" font-size="20" letter-spacing="4" fill="#94a3b8" text-anchor="end">FRIP</text>

          <!-- Chrome Handle Left -->
          <rect x="180" y="340" width="14" height="140" rx="7" fill="url(#chromeGrad)" stroke="#475569" stroke-width="2"/>
          <rect x="176" y="360" width="6" height="20" fill="#334155"/>
          <rect x="176" y="440" width="6" height="20" fill="#334155"/>

          <!-- Magnets on Left Door -->
          <!-- Orange ticket "POP STE // 50" -->
          <g transform="rotate(-6, 75, 275)">
            <rect x="40" y="240" width="70" height="70" rx="4" fill="#fb923c" stroke="#9a3412" stroke-width="2"/>
            <text x="75" y="268" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="11" fill="#7c2d12" text-anchor="middle">POP STE</text>
            <text x="75" y="292" font-family="'Comic Sans MS', sans-serif" font-weight="900" font-size="16" fill="#7c2d12" text-anchor="middle">#50</text>
          </g>

          <!-- Black & white landscape photo "The Cliff" -->
          <g transform="rotate(3, 85, 390)">
            <rect x="45" y="345" width="80" height="90" rx="2" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
            <rect x="52" y="352" width="66" height="58" fill="#334155"/>
            <!-- Cliff wave silhouette -->
            <path d="M52,390 Q75,370 95,385 L118,375 L118,410 L52,410 Z" fill="#64748b"/>
            <text x="85" y="425" font-family="'Comic Sans MS', sans-serif" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">The Cliff</text>
            <!-- Pin magnet -->
            <circle cx="85" cy="348" r="4" fill="#ef4444"/>
          </g>
        </g>
      </g>
    </g>

    <!-- RIGHT DOOR (Hinged at X=850) -->
    <g transform="translate(850, 0)">
      <g transform="scale({right_scale_x}, 1.0)">
        <!-- Right Door Base (drawn relative to hinge at 0, goes left to -205) -->
        <path d="M0,155 L-205,155 L-205,680 L0,680 Z" fill="#f8f4e8" stroke="#2d3748" stroke-width="2.5"/>

        <!-- Right door inside shelves when swung open -->
        {f"""
        <g opacity="{door_open}">
          <!-- Door racks with milk & drinks -->
          <rect x="-190" y="220" width="175" height="18" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
          <rect x="-170" y="170" width="28" height="50" rx="4" fill="#f87171"/>
          <rect x="-130" y="160" width="35" height="60" rx="4" fill="#38bdf8"/>
          <!-- Lower door rack -->
          <rect x="-190" y="380" width="175" height="18" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
          <!-- Milk bottles with gold caps -->
          <rect x="-175" y="300" width="34" height="80" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
          <rect x="-168" y="292" width="20" height="10" rx="2" fill="#f59e0b"/>
          <rect x="-130" y="300" width="34" height="80" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
          <rect x="-123" y="292" width="20" height="10" rx="2" fill="#f59e0b"/>
          <rect x="-85" y="315" width="32" height="65" rx="5" fill="#f97316"/>
        </g>
        """ if door_open > 0.05 else ""}

        <!-- Right door exterior face when closed or partially open -->
        <g opacity="{max(0.0, 1.0 - door_open * 1.2)}">
          <!-- Embossed FRIPGER (Right half) -->
          <text x="-175" y="195" font-family="Georgia, serif" font-weight="900" font-size="20" letter-spacing="4" fill="#94a3b8" text-anchor="start">GER</text>

          <!-- Chrome Handle Right -->
          <rect x="-194" y="340" width="14" height="140" rx="7" fill="url(#chromeGrad)" stroke="#475569" stroke-width="2"/>
          <rect x="-182" y="360" width="6" height="20" fill="#334155"/>
          <rect x="-182" y="440" width="6" height="20" fill="#334155"/>

          <!-- Magnets on Right Door -->
          <!-- Green circular sticker "SWEET PEAS" -->
          <g transform="translate(-140, 245)">
            <circle cx="0" cy="0" r="22" fill="#86efac" stroke="#15803d" stroke-width="2"/>
            <text x="0" y="-3" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="8" fill="#14532d" text-anchor="middle">SWEET</text>
            <text x="0" y="9" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="8" fill="#14532d" text-anchor="middle">PEAS</text>
          </g>

          <!-- Blue stamp "FRUIT" -->
          <g transform="translate(-85, 240) rotate(5)">
            <rect x="-18" y="-18" width="36" height="36" rx="4" fill="#7dd3fc" stroke="#0369a1" stroke-width="2"/>
            <text x="0" y="5" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="9" fill="#0c4a6e" text-anchor="middle">FRUIT</text>
          </g>

          <!-- Yellow post-it "Tut Mocking" -->
          <g transform="translate(-115, 310) rotate(-4)">
            <rect x="-42" y="-28" width="84" height="56" rx="2" fill="#fef08a" stroke="#ca8a04" stroke-width="1.8"/>
            <text x="0" y="6" font-family="'Comic Sans MS', sans-serif" font-weight="bold" font-size="12" fill="#854d0e" text-anchor="middle">Tut Mocking</text>
            <!-- Red heart magnet -->
            <path d="M-2, -26 C-2,-30 -8,-30 -8,-26 C-8,-22 -2,-18 -2,-18 C-2,-18 4,-22 4,-26 C4,-30 -2,-30 -2,-26 Z" fill="#ef4444"/>
          </g>

          <!-- Orange square sticky notes at bottom right with doodles -->
          <g transform="translate(-110, 410) rotate(2)">
            <rect x="-35" y="-35" width="70" height="70" rx="3" fill="#fdba74" stroke="#c2410c" stroke-width="2"/>
            <circle cx="-12" cy="-12" r="8" fill="none" stroke="#9a3412" stroke-width="2"/>
            <line x1="5" y1="-12" x2="20" y2="-12" stroke="#9a3412" stroke-width="2"/>
            <line x1="-15" y1="8" x2="20" y2="8" stroke="#9a3412" stroke-width="2"/>
            <line x1="-15" y1="20" x2="10" y2="20" stroke="#9a3412" stroke-width="2"/>
          </g>
        </g>
      </g>
    </g>
  </g>

  <!-- LIGHT BURST / RADIANT ENERGY EFFECT (Frame 7-9) -->
  {f"""
  <g id="lightBurst" opacity="{light_intensity}">
    <!-- Concentric Light Ripple Rings -->
    <circle cx="640" cy="400" r="{max(10, light_radius * 0.45)}" fill="none" stroke="#ffffff" stroke-width="{6 * (1.0 - light_intensity * 0.5)}" opacity="0.9"/>
    <circle cx="640" cy="400" r="{max(15, light_radius * 0.72)}" fill="none" stroke="#fef08a" stroke-width="{4 * (1.0 - light_intensity * 0.5)}" opacity="0.75"/>
    <circle cx="640" cy="400" r="{max(20, light_radius * 1.0)}" fill="none" stroke="#ffffff" stroke-width="{3 * (1.0 - light_intensity * 0.5)}" opacity="0.6"/>

    <!-- Bright White-Golden Radial Flare Core -->
    <circle cx="640" cy="400" r="{max(30, light_radius * 1.4)}" fill="url(#coreLight)"/>
  </g>
  """ if light_intensity > 0.01 else ""}

  <!-- FULL WHITE SCREEN BLOOM / FLASH (Final Transition) -->
  {f"""
  <rect width="{WIDTH}" height="{HEIGHT}" fill="#ffffff" opacity="{flash_white}"/>
  """ if flash_white > 0.01 else ""}

</svg>'''
    return svg

print(f"Generating {TOTAL_FRAMES} frames...")
for i in range(TOTAL_FRAMES):
    svg_code = render_frame(i)
    frame_path = os.path.join(OUTPUT_DIR, f"frame_{i:04d}.svg")
    with open(frame_path, "w", encoding="utf-8") as f:
        f.write(svg_code)

print("Frames generated! Now generating gentle audio track with ffmpeg...")
# Synthesize cozy audio: subtle background tone + door click + rising chime
audio_cmd = [
    "ffmpeg", "-y",
    "-f", "lavfi",
    "-i", f"sine=frequency=523:duration={DURATION_SEC}",
    "-af", "afade=t=in:ss=0:d=1,afade=t=out:st=5.5:d=1,volume=0.06",
    "-c:a", "aac",
    AUDIO_OUTPUT
]
subprocess.run(audio_cmd, check=True)

print("Now encoding MP4 with ffmpeg...")
video_cmd = [
    "ffmpeg", "-y",
    "-framerate", str(FPS),
    "-i", os.path.join(OUTPUT_DIR, "frame_%04d.svg"),
    "-i", AUDIO_OUTPUT,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.1",
    "-pix_fmt", "yuv420p",
    "-preset", "fast",
    "-crf", "20",
    "-c:a", "aac",
    "-shortest",
    FINAL_VIDEO
]
subprocess.run(video_cmd, check=True)

print("Success! Output video created at:", FINAL_VIDEO)
if os.path.exists(FINAL_VIDEO):
    print("File size:", os.path.getsize(FINAL_VIDEO), "bytes")
