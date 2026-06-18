import { useState, useRef } from "react";
import "./DragDrop.css";

const ITEMS = [
  { id: "d1", e: "🦺", label: "Mặc áo phao", val: "safe" },
  { id: "d2", e: "😨", label: "Tắm sông một mình", val: "danger" },
  { id: "d3", e: "👨‍👩‍👧", label: "Đi cùng người lớn", val: "safe" },
  { id: "d4", e: "⛔", label: "Chơi gần bờ suối", val: "danger" },
];

export default function DragDrop() {
  // zones: { safe: string[], danger: string[] }, pool: remaining item ids
  const [pool, setPool] = useState(ITEMS.map((i) => i.id));
  const [zones, setZones] = useState({ safe: [], danger: [] });
  const [overZone, setOverZone] = useState(null);
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong'
  const dragId = useRef(null);

  const getItem = (id) => ITEMS.find((i) => i.id === id);

  const onDragStart = (e, id) => {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, zone) => {
    e.preventDefault();
    setOverZone(zone);
  };

  const onDragLeave = () => setOverZone(null);

  const onDrop = (e, zone) => {
    e.preventDefault();
    setOverZone(null);
    const id = dragId.current;
    if (!id) return;

    // Remove from pool or other zone
    setPool((p) => p.filter((x) => x !== id));
    setZones((z) => {
      const other = zone === "safe" ? "danger" : "safe";
      return {
        ...z,
        [other]: z[other].filter((x) => x !== id),
        [zone]: z[zone].includes(id) ? z[zone] : [...z[zone], id],
      };
    });
    setResult(null);
  };

  const checkAnswer = () => {
    const total = zones.safe.length + zones.danger.length;
    if (total < ITEMS.length) return; // not all placed yet
    const safeOk = zones.safe.every((id) => getItem(id).val === "safe");
    const dangerOk = zones.danger.every((id) => getItem(id).val === "danger");
    setResult(safeOk && dangerOk ? "correct" : "wrong");
  };

  const reset = () => {
    setPool(ITEMS.map((i) => i.id));
    setZones({ safe: [], danger: [] });
    setResult(null);
  };

  const allPlaced = zones.safe.length + zones.danger.length === ITEMS.length;

  return (
    <div className="dd-card">
      <div className="dd-title">🧩 Ghép đúng — Sai</div>
      <p className="dd-hint">Kéo thả hành động vào ô phù hợp</p>

      {/* Pool */}
      <div className="dd-pool">
        {pool.map((id) => {
          const item = getItem(id);
          return (
            <button
              key={id}
              className="drag-item"
              draggable
              onDragStart={(e) => onDragStart(e, id)}
            >
              <span>{item.e}</span> {item.label}
            </button>
          );
        })}
      </div>

      {/* Drop zones */}
      <div className="dd-zones">
        {["safe", "danger"].map((zone) => (
          <div key={zone} className="dd-zone-wrap">
            <div className={`dd-zone-label ${zone}`}>
              {zone === "safe" ? "✅ An toàn" : "❌ Nguy hiểm"}
            </div>
            <div
              className={`dd-zone ${overZone === zone ? "over" : ""}`}
              onDragOver={(e) => onDragOver(e, zone)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, zone)}
            >
              {zones[zone].map((id) => {
                const item = getItem(id);
                return (
                  <button
                    key={id}
                    className="drag-item placed"
                    draggable
                    onDragStart={(e) => onDragStart(e, id)}
                  >
                    <span>{item.e}</span> {item.label}
                  </button>
                );
              })}
              {zones[zone].length === 0 && (
                <span className="dd-placeholder">Thả vào đây</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="dd-actions">
        {allPlaced && !result && (
          <button className="dd-check-btn" onClick={checkAnswer}>
            Kiểm tra kết quả ✔
          </button>
        )}
        <button className="dd-reset-btn" onClick={reset}>
          Làm lại 🔄
        </button>
      </div>

      {/* Result message */}
      {result && (
        <div className={`dd-result ${result}`}>
          {result === "correct"
            ? "🎉 Hoàn toàn đúng! Bé biết phân biệt an toàn rất tốt!"
            : "❌ Có chỗ chưa đúng — thử lại nhé!"}
        </div>
      )}
    </div>
  );
}