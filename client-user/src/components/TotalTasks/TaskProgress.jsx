import React from "react";

/**
 * Component hiển thị Tiến độ nhiệm vụ (Số phần trăm + Progress bar nằm ngang)
 * Chiều cao thanh vừa phải (6px), giao diện mượt mà administrative
 */
const TaskProgress = ({ progress = 0, status = "" }) => {
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  let barColor = "#005BAC";
  if (safeProgress === 100 || status === "Hoàn thành") {
    barColor = "#16A34A";
  } else if (status === "Quá hạn") {
    barColor = "#DC2626";
  } else if (status === "Sắp đến hạn") {
    barColor = "#F59E0B";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "110px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12.5px", fontWeight: "800", color: "#172033" }}>
          {safeProgress}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "6px",
          backgroundColor: "#E2E8F0",
          borderRadius: "4px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${safeProgress}%`,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: "4px",
            transition: "width 0.4s ease-in-out"
          }}
        />
      </div>
    </div>
  );
};

export default TaskProgress;
