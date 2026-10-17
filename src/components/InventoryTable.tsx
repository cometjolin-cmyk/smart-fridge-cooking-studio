import React, { useState } from "react";
import { DetectedItem, ShelfType } from "../types";
import { SHELF_CONFIGS } from "../data/presets";
import { getIngredientEmoji, getConfidenceBadge } from "../utils/helpers";
import { Search, Download, Trash2, Edit2, ArrowUpDown, Copy, Check } from "lucide-react";

interface InventoryTableProps {
  items: DetectedItem[];
  onMoveItem: (itemId: string, targetShelf: ShelfType) => void;
  onEditItem: (item: DetectedItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onMoveItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"confidence" | "name" | "shelf">("confidence");
  const [sortAsc, setSortAsc] = useState(false);
  const [copied, setCopied] = useState(false);

  const filteredItems = items
    .filter(
      (it) =>
        it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        it.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        SHELF_CONFIGS[it.shelf]?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comp = 0;
      if (sortBy === "confidence") comp = a.confidence - b.confidence;
      if (sortBy === "name") comp = a.name.localeCompare(b.name, "zh-Hant");
      if (sortBy === "shelf") comp = a.shelf.localeCompare(b.shelf);
      return sortAsc ? comp : -comp;
    });

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(
      JSON.stringify({ detected_items: items }, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ detected_items: items }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fridge-inventory-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋食材名稱、ID 或層架..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopyJSON}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">已複製 JSON</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>複製結構化 JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出 .json 檔案</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/70">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-700">
            <tr>
              <th className="py-3 px-4">食材項目</th>
              <th className="py-3 px-3">英文代碼 (id)</th>
              <th className="py-3 px-3">推估數量 (quantity)</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-slate-200 transition"
                onClick={() => {
                  if (sortBy === "shelf") setSortAsc(!sortAsc);
                  else {
                    setSortBy("shelf");
                    setSortAsc(true);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>所屬層架 (shelf)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-slate-200 transition"
                onClick={() => {
                  if (sortBy === "confidence") setSortAsc(!sortAsc);
                  else {
                    setSortBy("confidence");
                    setSortAsc(false);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <span>置信度 (confidence)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  沒有符合搜尋條件的食材項目
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const emoji = getIngredientEmoji(item.name, item.id);
                const shelf = SHELF_CONFIGS[item.shelf];
                const confBadge = getConfidenceBadge(item.confidence);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition group"
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{emoji}</span>
                        <span className="font-semibold text-slate-100">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {item.id}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-amber-300">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={item.shelf}
                        onChange={(e) =>
                          onMoveItem(item.id, e.target.value as ShelfType)
                        }
                        className="bg-slate-800 text-slate-200 rounded px-2 py-1 border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="upper">上層 (upper)</option>
                        <option value="middle">中層 (middle)</option>
                        <option value="drawer">抽屜 (drawer)</option>
                        <option value="door">側門 (door)</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono border font-medium ${confBadge.bg} ${confBadge.textCol}`}
                      >
                        {confBadge.text}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition"
                          title="編輯"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-700 transition"
                          title="刪除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
