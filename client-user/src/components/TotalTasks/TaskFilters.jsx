import React from "react";
import { Search, RotateCcw, Filter } from "lucide-react";

/**
 * Component Thanh Bộ Lọc Nhiệm Vụ Toàn Phòng
 * Nằm trên một hàng trên Desktop, đầy đủ các trường lọc tiêu chuẩn
 */
const TaskFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  assigneeFilter,
  setAssigneeFilter,
  priorityFilter,
  setPriorityFilter,
  timeFilter,
  setTimeFilter,
  onResetFilters
}) => {
  const selectStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: "13.5px",
    color: "#172033",
    outline: "none",
    cursor: "pointer",
    fontWeight: "500",
    height: "38px"
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        padding: "14px 18px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap"
      }}
    >
      {/* Ô tìm kiếm */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          padding: "0 12px",
          flex: "1 1 240px",
          minWidth: "200px",
          height: "38px"
        }}
      >
        <Search size={17} color="#64748B" />
        <input
          type="text"
          placeholder="Tìm kiếm nhiệm vụ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            width: "100%",
            fontSize: "13.5px",
            color: "#172033"
          }}
        />
      </div>

      {/* Lọc Trạng thái */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={selectStyle}
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="Đang thực hiện">Đang thực hiện</option>
        <option value="Sắp đến hạn">Sắp đến hạn</option>
        <option value="Quá hạn">Quá hạn</option>
        <option value="Hoàn thành">Hoàn thành</option>
        <option value="Chờ phê duyệt">Chờ phê duyệt</option>
      </select>

      {/* Lọc Cán bộ */}
      <select
        value={assigneeFilter}
        onChange={(e) => setAssigneeFilter(e.target.value)}
        style={selectStyle}
      >
        <option value="ALL">Tất cả cán bộ</option>
        <option value="Lê Ngọc Sơn">Lê Ngọc Sơn</option>
        <option value="Nguyễn Văn A">Nguyễn Văn A</option>
        <option value="Trần Văn B">Trần Văn B</option>
        <option value="Nguyễn Thị C">Nguyễn Thị C</option>
        <option value="Nguyễn Văn D">Nguyễn Văn D</option>
      </select>

      {/* Lọc Mức độ */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        style={selectStyle}
      >
        <option value="ALL">Tất cả mức độ</option>
        <option value="Cấp bách">Cấp bách</option>
        <option value="Khẩn">Khẩn</option>
        <option value="Bình thường">Bình thường</option>
      </select>

      {/* Lọc Thời gian */}
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        style={selectStyle}
      >
        <option value="ALL">Thời gian: Tất cả</option>
        <option value="AUG_2026">Tháng 8/2026</option>
        <option value="Q3_2026">Quý III/2026</option>
        <option value="YEAR_2026">Năm 2026</option>
      </select>

      {/* Nút Đặt lại */}
      <button
        type="button"
        onClick={onResetFilters}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "0 14px",
          height: "38px",
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#F8FAFC",
          color: "#475569",
          fontSize: "13px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.15s"
        }}
        title="Đặt lại toàn bộ bộ lọc"
      >
        <RotateCcw size={15} />
        <span>Đặt lại</span>
      </button>
    </div>
  );
};

export default TaskFilters;
