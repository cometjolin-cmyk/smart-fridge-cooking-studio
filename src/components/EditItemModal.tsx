import React, { useState, useEffect } from "react";
import { X, Check, Plus, Edit2 } from "lucide-react";
import { DetectedItem, ShelfType } from "../types";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: DetectedItem) => void;
  initialItem?: DetectedItem | null;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
}) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shelf, setShelf] = useState<ShelfType>("upper");
  const [confidence, setConfidence] = useState(0.95);

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setId(initialItem.id);
      setQuantity(initialItem.quantity);
      setShelf(initialItem.shelf);
      setConfidence(initialItem.confidence || 0.95);
    } else {
      setName("");
      setId("");
      setQuantity("1份");
      setShelf("upper");
      setConfidence(1.0);
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedId = id.trim() || name.trim().toLowerCase().replace(/\s+/g, "_");
    const num = parseFloat(quantity) || 1;
    const unitMatch = quantity.replace(/[0-9.]/g, "").trim() || "份";

    onSave({
      id: initialItem ? initialItem.id : generatedId,
      name: name.trim(),
      quantity: quantity.trim() || "1份",
      numericQty: num,
      unit: unitMatch,
      shelf,
      category: shelf === "door" ? "pantry" : "fresh",
      confidence: Number(confidence) || 0.95,
      isSelected: true,
      urgentConsume: initialItem?.urgentConsume ?? false,
      expiryDays: initialItem?.expiryDays ?? 5,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            {initialItem ? (
              <>
                <Edit2 className="w-4 h-4 text-emerald-400" />
                <span>編輯食材資料</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>手動新增食材</span>
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              食材名稱 (name - 繁體中文)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!initialItem && !id) {
                  // auto generate id
                  setId(e.target.value.toLowerCase());
                }
              }}
              required
              placeholder="例如：板豆腐、雞蛋、高麗菜"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              英文代碼 (id)
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="例如：tofu, egg, cabbage"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              數量與單位 (quantity)
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="例如：4顆、1塊、半顆、2瓶"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              所屬層架 (shelf)
            </label>
            <select
              value={shelf}
              onChange={(e) => setShelf(e.target.value as ShelfType)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="upper">upper（上層：熟食、即食食品、雞蛋、牛奶、豆製品）</option>
              <option value="middle">middle（中層：生鮮肉類、海鮮、常備密封食材、罐頭）</option>
              <option value="drawer">drawer（下層抽屜：蔬菜、根莖類、水果）</option>
              <option value="door">door（側門架：調味醬料瓶、瓶裝飲料、果汁）</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                置信度 (confidence)
              </label>
              <span className="font-mono text-emerald-400">
                {Math.round(confidence * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.01"
              value={confidence}
              onChange={(e) => setConfidence(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>儲存食材</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
