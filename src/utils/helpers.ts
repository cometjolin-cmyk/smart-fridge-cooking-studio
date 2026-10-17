export function getIngredientEmoji(name: string, id: string): string {
  const n = (name + " " + id).toLowerCase();
  if (n.includes("蛋") || n.includes("egg")) return "🥚";
  if (n.includes("奶") || n.includes("milk")) return "🥛";
  if (n.includes("豆腐") || n.includes("tofu")) return "🧈";
  if (n.includes("肉") || n.includes("pork") || n.includes("beef") || n.includes("steak") || n.includes("排")) return "🥩";
  if (n.includes("雞") || n.includes("chicken")) return "🍗";
  if (n.includes("魚") || n.includes("鮭魚") || n.includes("salmon") || n.includes("fish")) return "🐟";
  if (n.includes("蝦") || n.includes("shrimp") || n.includes("prawn")) return "🦐";
  if (n.includes("高麗菜") || n.includes("菜") || n.includes("cabbage") || n.includes("lettuce")) return "🥬";
  if (n.includes("番茄") || n.includes("tomato")) return "🍅";
  if (n.includes("胡蘿蔔") || n.includes("紅蘿蔔") || n.includes("carrot")) return "🥕";
  if (n.includes("洋蔥") || n.includes("onion")) return "🧅";
  if (n.includes("蒜") || n.includes("garlic")) return "🧄";
  if (n.includes("酪梨") || n.includes("avocado")) return "🥑";
  if (n.includes("蘋果") || n.includes("apple")) return "🍎";
  if (n.includes("檸檬") || n.includes("lemon")) return "🍋";
  if (n.includes("玉米") || n.includes("corn")) return "🌽";
  if (n.includes("瓜") || n.includes("cucumber")) return "🥒";
  if (n.includes("花椰菜") || n.includes("青花菜") || n.includes("broccoli")) return "🥦";
  if (n.includes("泡菜") || n.includes("kimchi")) return "🥫";
  if (n.includes("優格") || n.includes("yogurt")) return "🥣";
  if (n.includes("醬油") || n.includes("soy_sauce") || n.includes("醬")) return "🍾";
  if (n.includes("辣") || n.includes("sriracha") || n.includes("chili")) return "🌶️";
  if (n.includes("油") || n.includes("oil")) return "🫒";
  if (n.includes("汁") || n.includes("juice")) return "🧃";
  if (n.includes("咖啡") || n.includes("coffee")) return "☕";
  if (n.includes("水") || n.includes("water") || n.includes("soda")) return "🥤";
  if (n.includes("酒") || n.includes("beer") || n.includes("wine")) return "🍺";
  return "🍱";
}

export function getConfidenceBadge(confidence: number): { text: string; bg: string; textCol: string } {
  const percent = Math.round(confidence * 100);
  if (percent >= 92) {
    return { text: `${percent}% 極高置信`, bg: "bg-emerald-500/15 border-emerald-500/30", textCol: "text-emerald-400" };
  } else if (percent >= 85) {
    return { text: `${percent}% 高度推估`, bg: "bg-teal-500/15 border-teal-500/30", textCol: "text-teal-300" };
  } else if (percent >= 75) {
    return { text: `${percent}% 一般辨識`, bg: "bg-amber-500/15 border-amber-500/30", textCol: "text-amber-400" };
  }
  return { text: `${percent}% 待確認`, bg: "bg-rose-500/15 border-rose-500/30", textCol: "text-rose-400" };
}

// Convert and optimize any image URL (Base64 data URL, SVG, or Remote/Blob URL) for AI Vision API
export async function convertImageUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  if (!url) {
    return { base64: "", mimeType: "image/jpeg" };
  }

  // 1. If it's an SVG data URI (like the default hand-drawn preset), rasterize cleanly
  if (url.startsWith("data:image/svg+xml")) {
    try {
      return await rasterizeSvgToJpeg(url);
    } catch (err) {
      console.warn("SVG rasterization warning, falling back:", err);
    }
  }

  // 2. For photographic / data / blob URLs, optimize and downscale to max 1440px to ensure fast transfer and prevent payload overflow
  try {
    return await optimizeImageForAi(url);
  } catch (err) {
    console.warn("Image optimization fallback:", err);
    // Direct extraction fallback
    if (url.startsWith("data:") && url.includes(";base64,")) {
      const [header, base64] = url.split(";base64,");
      const mimeMatch = header.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      return { base64, mimeType };
    }
    return { base64: "", mimeType: "image/jpeg" };
  }
}

// Downscale large smartphone camera photos (often 12-48MP / 20MB) to ~1440px JPEG (~300KB)
export function optimizeImageForAi(urlOrDataUri: string): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const MAX_DIM = 1440;
        let width = img.naturalWidth || img.width || 800;
        let height = img.naturalHeight || img.height || 600;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No 2d context");

        ctx.fillStyle = "#faf5ec";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        resolve({ base64, mimeType: "image/jpeg" });
      } catch (e) {
        if (urlOrDataUri.startsWith("data:") && urlOrDataUri.includes(";base64,")) {
          const [header, base64] = urlOrDataUri.split(";base64,");
          const mimeMatch = header.match(/data:([^;]+)/);
          resolve({ base64, mimeType: mimeMatch ? mimeMatch[1] : "image/jpeg" });
        } else {
          resolve({ base64: "", mimeType: "image/jpeg" });
        }
      }
    };
    img.onerror = () => {
      if (urlOrDataUri.startsWith("data:") && urlOrDataUri.includes(";base64,")) {
        const [header, base64] = urlOrDataUri.split(";base64,");
        const mimeMatch = header.match(/data:([^;]+)/);
        resolve({ base64, mimeType: mimeMatch ? mimeMatch[1] : "image/jpeg" });
      } else {
        resolve({ base64: "", mimeType: "image/jpeg" });
      }
    };
    img.src = urlOrDataUri;
  });
}

function rasterizeSvgToJpeg(url: string): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 1250;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("No canvas context");

        ctx.fillStyle = "#faf5ec";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
        resolve({ base64, mimeType: "image/jpeg" });
      } catch (e) {
        // Return a clean fallback base64
        resolve({
          base64: "",
          mimeType: "image/jpeg",
        });
      }
    };
    img.onerror = () => {
      resolve({
        base64: "",
        mimeType: "image/jpeg",
      });
    };
    img.src = url;
  });
}
