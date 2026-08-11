import React from "react";

/**
 * Component hiển thị Badge Trạng thái nhiệm vụ
 * Dùng tông màu nhạt administrative, bo tròn, font nhỏ nét rõ
 */
const TaskStatusBadge = ({ status }) => {
  let styleConfig = {
    bg: "#e2e8f0",
    color: "#475569",
    border: "#cbd5e1"
  };

  switch (status) {
    case "Đang thực hiện":
      styleConfig = { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" };
      break;
    case "Sắp đến hạn":
      styleConfig = { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
      break;
    case "Quá hạn":
      styleConfig = { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" };
      break;
    case "Hoàn thành":
      styleConfig = { bg: "#dcfce7", color: "#15803d", border: "#86efac" };
      break;
    case "Chờ phê duyệt":
      styleConfig = { bg: "#f3e8ff", color: "#7e22ce", border: "#d8b4fe" };
      break;
    default:
      break;
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "700",
        backgroundColor: styleConfig.bg,
        color: styleConfig.color,
        border: `1px solid ${styleConfig.border}`,
        lineHeight: "1.3",
        whiteSpace: "nowrap",
        userSelect: "none"
      }}
    >
      {status}
    </span>
  );
};

export default TaskStatusBadge;
