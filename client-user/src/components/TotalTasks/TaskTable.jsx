import React, { useState } from "react";
import { Eye, MoreVertical, ChevronLeft, ChevronRight, Edit3, UserCheck, CalendarDays, XCircle } from "lucide-react";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskProgress from "./TaskProgress";

/**
 * Component Bảng Tất Cả Nhiệm Vụ Toàn Phòng
 * Hỗ trợ Horizontal Scroll trên mobile, Dropdown Thao tác và Phân trang chuẩn Hành chính
 */
const TaskTable = ({
  tasks = [],
  totalCount = 128,
  currentPage = 1,
  onPageChange,
  onViewTask,
  onUpdateTask,
  onChangeAssignee,
  onExtendDueDate,
  onCancelTask
}) => {
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        marginBottom: "24px"
      }}
    >
      {/* SECTION HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: "800",
            color: "#172033",
            letterSpacing: "0.3px",
            textTransform: "uppercase"
          }}
        >
          TẤT CẢ NHIỆM VỤ
        </h3>

        <span
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#005BAC",
            backgroundColor: "#E0F2FE",
            padding: "4px 12px",
            borderRadius: "20px"
          }}
        >
          {totalCount} nhiệm vụ
        </span>
      </div>

      {/* TABLE CONTAINER WITH HORIZONTAL SCROLL ON MOBILE */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            fontSize: "13.5px"
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#F8FAFC",
                borderBottom: "2px solid #E2E8F0",
                color: "#475569",
                fontWeight: "700",
                fontSize: "12.5px",
                textTransform: "uppercase",
                letterSpacing: "0.2px"
              }}
            >
              <th style={{ padding: "12px 10px", width: "50px", textAlign: "center" }}>STT</th>
              <th style={{ padding: "12px 14px", minWidth: "260px" }}>Nhiệm vụ</th>
              <th style={{ padding: "12px 14px", minWidth: "150px" }}>Người thực hiện</th>
              <th style={{ padding: "12px 12px", minWidth: "100px" }}>Ngày giao</th>
              <th style={{ padding: "12px 12px", minWidth: "110px" }}>Hạn hoàn thành</th>
              <th style={{ padding: "12px 14px", minWidth: "130px" }}>Tiến độ</th>
              <th style={{ padding: "12px 14px", minWidth: "130px" }}>Trạng thái</th>
              <th style={{ padding: "12px 10px", width: "90px", textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>
                  Không tìm thấy nhiệm vụ phù hợp với điều kiện lọc.
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr
                  key={task.id || index}
                  style={{
                    borderBottom: "1px solid #E2E8F0",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* STT */}
                  <td style={{ padding: "14px 10px", textAlign: "center", fontWeight: "700", color: "#64748B" }}>
                    {(currentPage - 1) * 10 + index + 1}
                  </td>

                  {/* Nhiệm vụ */}
                  <td style={{ padding: "14px 14px" }}>
                    <div style={{ fontWeight: "700", color: "#172033", lineHeight: "1.35", marginBottom: "2px" }}>
                      {task.title}
                    </div>
                    {task.priority && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: task.priority === "Cấp bách" ? "#DC2626" : task.priority === "Khẩn" ? "#D97706" : "#64748B"
                        }}
                      >
                        Mức độ: {task.priority}
                      </span>
                    )}
                  </td>

                  {/* Người thực hiện */}
                  <td style={{ padding: "14px 14px", fontWeight: "600", color: "#334155" }}>
                    {task.assignee}
                  </td>

                  {/* Ngày giao */}
                  <td style={{ padding: "14px 12px", color: "#64748B", fontSize: "13px" }}>
                    {task.assignedDate}
                  </td>

                  {/* Hạn hoàn thành */}
                  <td style={{ padding: "14px 12px", fontWeight: "700", color: task.status === "Quá hạn" ? "#DC2626" : "#334155", fontSize: "13px" }}>
                    {task.dueDate}
                  </td>

                  {/* Tiến độ */}
                  <td style={{ padding: "14px 14px" }}>
                    <TaskProgress progress={task.progress} status={task.status} />
                  </td>

                  {/* Trạng thái */}
                  <td style={{ padding: "14px 14px" }}>
                    <TaskStatusBadge status={task.status} />
                  </td>

                  {/* Thao tác */}
                  <td style={{ padding: "14px 10px", textAlign: "center", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      {/* Nút Xem chi tiết */}
                      <button
                        type="button"
                        onClick={() => onViewTask(task)}
                        style={{
                          background: "#F1F5F9",
                          border: "1px solid #CBD5E1",
                          borderRadius: "6px",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#334155"
                        }}
                        title="Xem chi tiết nhiệm vụ"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Nút Dropdown ⋮ */}
                      <button
                        type="button"
                        onClick={(e) => toggleDropdown(task.id, e)}
                        style={{
                          background: activeDropdownId === task.id ? "#E2E8F0" : "#F1F5F9",
                          border: "1px solid #CBD5E1",
                          borderRadius: "6px",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#334155"
                        }}
                        title="Thao tác mở rộng"
                      >
                        <MoreVertical size={15} />
                      </button>
                    </div>

                    {/* DROPDOWN MENU MENU */}
                    {activeDropdownId === task.id && (
                      <>
                        <div
                          onClick={() => setActiveDropdownId(null)}
                          style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "calc(100% + 2px)",
                            zIndex: 9999,
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #CBD5E1",
                            borderRadius: "8px",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                            padding: "4px",
                            width: "170px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            textAlign: "left"
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => { setActiveDropdownId(null); onViewTask(task); }}
                            style={dropdownItemStyle}
                          >
                            <Eye size={14} /> <span>Xem chi tiết</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveDropdownId(null); onUpdateTask(task); }}
                            style={dropdownItemStyle}
                          >
                            <Edit3 size={14} /> <span>Cập nhật nhiệm vụ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveDropdownId(null); onChangeAssignee(task); }}
                            style={dropdownItemStyle}
                          >
                            <UserCheck size={14} /> <span>Đổi người thực hiện</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveDropdownId(null); onExtendDueDate(task); }}
                            style={dropdownItemStyle}
                          >
                            <CalendarDays size={14} /> <span>Gia hạn</span>
                          </button>
                          <div style={{ height: "1px", backgroundColor: "#E2E8F0", margin: "2px 0" }} />
                          <button
                            type="button"
                            onClick={() => { setActiveDropdownId(null); onCancelTask(task); }}
                            style={{ ...dropdownItemStyle, color: "#DC2626" }}
                          >
                            <XCircle size={14} /> <span>Hủy nhiệm vụ</span>
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          paddingTop: "14px",
          borderTop: "1px solid #E2E8F0",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>
          Hiển thị <strong style={{ color: "#172033" }}>1–10</strong> trong <strong style={{ color: "#172033" }}>{totalCount}</strong> nhiệm vụ
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #CBD5E1",
              backgroundColor: currentPage === 1 ? "#F1F5F9" : "#FFFFFF",
              color: currentPage === 1 ? "#94A3B8" : "#334155",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {[1, 2, 3, 4, 5].map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                border: "1px solid #CBD5E1",
                backgroundColor: currentPage === pageNum ? "#005BAC" : "#FFFFFF",
                color: currentPage === pageNum ? "#FFFFFF" : "#334155",
                fontWeight: currentPage === pageNum ? "800" : "600",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              {pageNum}
            </button>
          ))}

          <span style={{ padding: "0 4px", color: "#94A3B8", fontWeight: "700" }}>...</span>

          <button
            type="button"
            onClick={() => onPageChange(13)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              border: "1px solid #CBD5E1",
              backgroundColor: currentPage === 13 ? "#005BAC" : "#FFFFFF",
              color: currentPage === 13 ? "#FFFFFF" : "#334155",
              fontWeight: currentPage === 13 ? "800" : "600",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            13
          </button>

          <button
            type="button"
            disabled={currentPage === 13}
            onClick={() => onPageChange(currentPage + 1)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid #CBD5E1",
              backgroundColor: currentPage === 13 ? "#F1F5F9" : "#FFFFFF",
              color: currentPage === 13 ? "#94A3B8" : "#334155",
              cursor: currentPage === 13 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const dropdownItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  padding: "8px 10px",
  border: "none",
  background: "transparent",
  borderRadius: "6px",
  fontSize: "12.5px",
  fontWeight: "600",
  color: "#334155",
  cursor: "pointer",
  textAlign: "left"
};

export default TaskTable;
