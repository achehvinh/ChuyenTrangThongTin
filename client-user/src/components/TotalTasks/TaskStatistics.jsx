import React from "react";
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";

/**
 * Component 4 Thẻ Thống kê KPI chính cho Tổng nhiệm vụ toàn phòng
 */
const TaskStatistics = ({ stats }) => {
  const total = stats?.total ?? 128;
  const inProgress = stats?.inProgress ?? 43;
  const completed = stats?.completed ?? 76;
  const overdue = stats?.overdue ?? 9;

  const inProgressPercent = total > 0 ? ((inProgress / total) * 100).toFixed(1) : "33.6";
  const completedPercent = total > 0 ? ((completed / total) * 100).toFixed(1) : "59.4";

  const cards = [
    {
      id: "total",
      title: "Tổng nhiệm vụ",
      value: total,
      description: "Toàn bộ nhiệm vụ",
      icon: ClipboardList,
      color: "#005BAC",
      bgColor: "#E0F2FE"
    },
    {
      id: "inProgress",
      title: "Đang thực hiện",
      value: inProgress,
      description: `${inProgressPercent}% tổng nhiệm vụ`,
      icon: Clock3,
      color: "#0284C7",
      bgColor: "#E0F2FE"
    },
    {
      id: "completed",
      title: "Hoàn thành",
      value: completed,
      description: `${completedPercent}% tổng nhiệm vụ`,
      icon: CheckCircle2,
      color: "#16A34A",
      bgColor: "#DCFCE7"
    },
    {
      id: "overdue",
      title: "Quá hạn",
      value: overdue,
      description: "Cần xử lý ngay",
      icon: AlertTriangle,
      color: "#DC2626",
      bgColor: "#FEE2E2"
    }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        marginBottom: "20px"
      }}
    >
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              transition: "transform 0.15s ease, box-shadow 0.15s ease"
            }}
          >
            {/* Icon trong ô vuông bo góc */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: card.bgColor,
                color: card.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              <IconComponent size={24} strokeWidth={2.2} />
            </div>

            {/* Thông số & Tiêu đề */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748B" }}>
                {card.title}
              </span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: card.id === "overdue" ? "#DC2626" : "#172033",
                  lineHeight: "1.1",
                  margin: "3px 0"
                }}
              >
                {card.value}
              </span>
              <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: "500" }}>
                {card.description}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStatistics;
