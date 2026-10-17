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

// Convert SVG data URL or image to JPEG base64 for API call
export async function convertImageUrlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 600;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("無法建立 Canvas 上下文"));
        return;
      }
      // Fill dark kitchen background
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
      resolve({ base64, mimeType: "image/jpeg" });
    };
    img.onerror = (e) => reject(new Error("載入圖片失敗: " + e));
    img.src = url;
  });
}
