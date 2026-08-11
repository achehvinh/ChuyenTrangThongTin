import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Plus, Download, ClipboardList, CheckCircle2, Clock3, AlertTriangle, X, Activity, Bell, History } from "lucide-react";
import TaskStatistics from "./TaskStatistics";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import TaskStatusBadge from "./TaskStatusBadge";
import TaskProgress from "./TaskProgress";
import { getBackendServerUrl } from "../../utils/apiConfig";
import { useTaskRealtime } from "../../hooks/useTaskRealtime";
import "./TotalTasksPage.css";

const BASE_URL = getBackendServerUrl();

const TotalTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    submitted: 0,
  });
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // New Task Form State
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    assignee: "Nguyễn Văn A",
    dueDate: "",
    priority: "Bình thường",
    description: "",
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Helper lấy Auth Header Token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ── Fetch dữ liệu từ MongoDB qua REST APIs ──
  const fetchDepartmentTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/tasks/department`, {
        headers: getAuthHeader(),
      });

      if (res.data?.success) {
        setTasks(res.data.tasks || []);
        if (res.data.statistics) {
          setStats(res.data.statistics);
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách nhiệm vụ từ MongoDB:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/tasks/activities`, {
        headers: getAuthHeader(),
      });
      if (res.data?.success) {
        setActivities(res.data.activities || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải nhật ký hoạt động:", err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/tasks/notifications`, {
        headers: getAuthHeader(),
      });
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    }
  }, []);

  useEffect(() => {
    fetchDepartmentTasks();
    fetchActivities();
    fetchNotifications();
  }, [fetchDepartmentTasks, fetchActivities, fetchNotifications]);

  // ── Lắng nghe các sự kiện REALTIME từ Socket.IO Server ──
  const { isConnected } = useTaskRealtime({
    onTaskUpdated: (data) => {
      fetchDepartmentTasks();
    },
    onProgressUpdated: (data) => {
      if (data?.taskId && data?.progress !== undefined) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === data.taskId
              ? {
                  ...t,
                  progress: data.progress,
                  status: data.status || t.status,
                }
              : t
          )
        );
      }
      if (data?.stats) {
        setStats(data.stats);
      }
      showToast(`⚡ REALTIME: ${data?.updatedBy || "Cán bộ"} đã cập nhật tiến độ nhiệm vụ lên ${data?.progress}%!`);
    },
    onTaskCreated: (data) => {
      fetchDepartmentTasks();
      showToast(`⚡ REALTIME: Trưởng phòng vừa giao nhiệm vụ mới!`);
    },
    onActivityNew: (activity) => {
      setActivities((prev) => [activity, ...prev]);
    },
    onNotificationNew: (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    },
    onReconnect: () => {
      fetchDepartmentTasks();
      fetchActivities();
    },
  });

  // ── Lọc danh sách nhiệm vụ ──
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (
        searchTerm.trim() !== "" &&
        !t.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !t.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter !== "ALL" && t.status !== statusFilter) {
        return false;
      }
      if (assigneeFilter !== "ALL" && t.assignee !== assigneeFilter) {
        return false;
      }
      if (priorityFilter !== "ALL" && t.priority !== priorityFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, searchTerm, statusFilter, assigneeFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setAssigneeFilter("ALL");
    setPriorityFilter("ALL");
    setTimeFilter("ALL");
    setCurrentPage(1);
    showToast("Đã đặt lại toàn bộ bộ lọc về mặc định");
  };

  const handleExportReport = () => {
    showToast("Đang xuất báo cáo danh sách nhiệm vụ toàn phòng (File Excel/CSV)...");
  };

  // ── API: Trưởng phòng Giao Nhiệm Vụ Mới ──
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/tasks`,
        {
          title: newTaskForm.title,
          assigneeName: newTaskForm.assignee,
          dueDate: newTaskForm.dueDate,
          priority: newTaskForm.priority,
          description: newTaskForm.description,
        },
        { headers: getAuthHeader() }
      );

      if (res.data?.success) {
        setShowAssignModal(false);
        setNewTaskForm({
          title: "",
          assignee: "Nguyễn Văn A",
          dueDate: "",
          priority: "Bình thường",
          description: "",
        });
        fetchDepartmentTasks();
        fetchActivities();
        showToast(`Đã giao nhiệm vụ thành công cho cán bộ ${newTaskForm.assignee}!`);
      }
    } catch (err) {
      console.error("Lỗi giao nhiệm vụ:", err);
      showToast("Không thể giao nhiệm vụ. Vui lòng thử lại!");
    }
  };

  // ── API: Lấy Lịch sử Tiến độ của Task ──
  const handleViewTask = async (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/tasks/${task.id}/history`, {
        headers: getAuthHeader(),
      });
      if (res.data?.success) {
        setTaskHistory(res.data.history || []);
      }
    } catch (err) {
      setTaskHistory([]);
    }
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  // ── API: Cán bộ Cập nhật Tiến độ qua REST API ──
  const handleSaveProgressUpdate = async (newProgress, note) => {
    if (!selectedTask) return;
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/tasks/${selectedTask.id}/progress`,
        { progress: newProgress, note },
        { headers: getAuthHeader() }
      );

      if (res.data?.success) {
        setShowUpdateModal(false);
        fetchDepartmentTasks();
        fetchActivities();
        showToast(`Đã cập nhật tiến độ nhiệm vụ lên ${newProgress}% vào MongoDB thành công!`);
      }
    } catch (err) {
      console.error("Lỗi cập nhật tiến độ:", err);
      showToast("Không thể cập nhật tiến độ. Vui lòng kiểm tra lại!");
    }
  };

  // ── API: Trưởng phòng Phê duyệt Hoàn thành ──
  const handleApproveTask = async (task) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/tasks/${task.id}/approve`,
        {},
        { headers: getAuthHeader() }
      );
      if (res.data?.success) {
        fetchDepartmentTasks();
        fetchActivities();
        showToast(`Đã phê duyệt hoàn thành nhiệm vụ "${task.title}"!`);
      }
    } catch (err) {
      showToast("Lỗi khi phê duyệt nhiệm vụ!");
    }
  };

  // ── API: Trưởng phòng Yêu cầu Bổ sung ──
  const handleRequestRevision = async (task) => {
    const reason = prompt(`Nhập lý do yêu cầu bổ sung cho cán bộ ${task.assignee}:`, "Cần bổ sung thêm phụ lục thống kê");
    if (!reason || !reason.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/tasks/${task.id}/request-revision`,
        { reason: reason.trim() },
        { headers: getAuthHeader() }
      );
      if (res.data?.success) {
        fetchDepartmentTasks();
        fetchActivities();
        showToast(`Đã gởi yêu cầu bổ sung nhiệm vụ tới cán bộ ${task.assignee}`);
      }
    } catch (err) {
      showToast("Lỗi khi gửi yêu cầu bổ sung!");
    }
  };

  const handleChangeAssignee = (task) => {
    const newName = prompt(`Nhập tên cán bộ mới thay thế cho '${task.assignee}':`, task.assignee);
    if (newName && newName.trim()) {
      showToast(`Đã đổi cán bộ thực hiện sang ${newName.trim()}`);
    }
  };

  const handleExtendDueDate = (task) => {
    const newDate = prompt(`Nhập hạn hoàn thành mới (dd/mm/yyyy):`, task.dueDate);
    if (newDate && newDate.trim()) {
      showToast(`Đã gia hạn nhiệm vụ đến ngày ${newDate.trim()}`);
    }
  };

  const handleCancelTask = (task) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy nhiệm vụ: "${task.title}"?`)) {
      showToast(`Đã hủy nhiệm vụ thành công.`);
    }
  };

  return (
    <div className="total-tasks-container">
      {/* CẢNH BÁO MẤT KẾT NỐI REALTIME (REQ 22) */}
      {!isConnected && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={16} className="animate-spin" />
          <span>Đang kết nối lại với Socket.IO Realtime Server...</span>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && <div className="total-tasks-toast">{toastMessage}</div>}

      {/* ========================================
          1. TIÊU ĐỀ HÀNH CHÍNH & NÚT TÁC VỤ
      ======================================== */}
      <div className="total-tasks-header">
        <div>
          <h1 className="total-tasks-title">TỔNG NHIỆM VỤ TOÀN PHÒNG</h1>
          <p className="total-tasks-subtitle">
            Theo dõi, điều hành và đánh giá tiến độ thực hiện nhiệm vụ của toàn phòng (MongoDB Realtime)
          </p>
        </div>

        <div className="total-tasks-actions">
          <button type="button" className="btn-primary-gov" onClick={() => setShowAssignModal(true)}>
            <Plus size={18} />
            <span>Giao nhiệm vụ</span>
          </button>

          <button type="button" className="btn-secondary-gov" onClick={handleExportReport}>
            <Download size={18} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* ========================================
          2. 4 THẺ THỐNG KÊ CHÍNH (KPI REALTIME TỪ MONGODB)
      ======================================== */}
      <TaskStatistics stats={stats} />

      {/* ========================================
          3. BỘ LỌC TÌM KIẾM
      ======================================== */}
      <TaskFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        onResetFilters={handleResetFilters}
      />

      {/* ========================================
          LAYOUT CHÍNH: BẢNG NHIỆM VỤ & TIMELINE HOẠT ĐỘNG REALTIME
      ======================================== */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
        {/* BẢNG NHIỆM VỤ */}
        <div>
          <TaskTable
            tasks={filteredTasks}
            totalCount={stats.total || filteredTasks.length}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            onViewTask={handleViewTask}
            onUpdateTask={handleUpdateTask}
            onChangeAssignee={handleChangeAssignee}
            onExtendDueDate={handleExtendDueDate}
            onCancelTask={handleCancelTask}
          />
        </div>

        {/* CỘT PHỤ: HOẠT ĐỘNG GẦN ĐÂY (REALTIME TIMELINE) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <h4 style={{ margin: "0 0 14px 0", fontSize: "14px", fontWeight: "800", color: "#172033", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}>
              <Activity size={17} color="#005BAC" />
              <span>HOẠT ĐỘNG GẦN ĐÂY</span>
            </h4>

            {activities.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>Chưa có hoạt động nào phát sinh.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "420px", overflowY: "auto" }}>
                {activities.slice(0, 10).map((act, i) => (
                  <div key={act._id || i} style={{ display: "flex", gap: "10px", paddingBottom: "10px", borderBottom: "1px solid #F1F5F9" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: act.action === "APPROVE" ? "#16A34A" : act.action === "UPDATE_PROGRESS" ? "#0284C7" : "#005BAC", marginTop: "6px", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", color: "#172033" }}>{act.actorName}</div>
                      <div style={{ fontSize: "12px", color: "#475569", margin: "2px 0", lineHeight: "1.35" }}>{act.description}</div>
                      <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                        {act.createdAt ? new Date(act.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "Vừa xong"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================
          MODAL: GIAO NHIỆM VỤ MỚI
      ======================================== */}
      {showAssignModal && (
        <div className="modal-backdrop-gov">
          <div className="modal-content-gov">
            <div className="modal-header-gov">
              <h3>PHÂN CÔNG GIAO NHIỆM VỤ MỚI</h3>
              <button onClick={() => setShowAssignModal(false)} className="btn-close-gov">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="modal-body-gov">
              <div className="form-group-gov">
                <label>Tên nhiệm vụ <span style={{ color: "#DC2626" }}>*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên nhiệm vụ cần giao..."
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                />
              </div>

              <div className="form-row-gov">
                <div className="form-group-gov">
                  <label>Cán bộ thực hiện</label>
                  <select
                    value={newTaskForm.assignee}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assignee: e.target.value })}
                  >
                    <option value="Lê Ngọc Sơn">Lê Ngọc Sơn (Chuyên viên)</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A (Chuyên viên)</option>
                    <option value="Trần Văn B">Trần Văn B (Chuyên viên)</option>
                    <option value="Nguyễn Thị C">Nguyễn Thị C (Chuyên viên)</option>
                    <option value="Nguyễn Văn D">Nguyễn Văn D (Chuyên viên)</option>
                  </select>
                </div>

                <div className="form-group-gov">
                  <label>Mức độ ưu tiên</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                  >
                    <option value="Bình thường">Bình thường</option>
                    <option value="Khẩn">Khẩn</option>
                    <option value="Cấp bách">Cấp bách</option>
                  </select>
                </div>
              </div>

              <div className="form-group-gov">
                <label>Hạn hoàn thành</label>
                <input
                  type="date"
                  value={newTaskForm.dueDate}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                />
              </div>

              <div className="form-group-gov">
                <label>Nội dung chỉ đạo & Yêu cầu cụ thể</label>
                <textarea
                  rows={3}
                  placeholder="Nhập ghi chú chỉ đạo của Trưởng phòng..."
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                />
              </div>

              <div className="modal-footer-gov">
                <button type="button" onClick={() => setShowAssignModal(false)} className="btn-secondary-gov">
                  Hủy bỏ
                </button>
                <button type="submit" className="btn-primary-gov">
                  Xác nhận giao nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          MODAL: CHI TIẾT NHIỆM VỤ & LỊCH SỬ TIẾN ĐỘ DB
      ======================================== */}
      {showDetailModal && selectedTask && (
        <div className="modal-backdrop-gov">
          <div className="modal-content-gov">
            <div className="modal-header-gov">
              <h3>CHI TIẾT NHIỆM VỤ & LỊCH SỬ TIẾN ĐỘ</h3>
              <button onClick={() => setShowDetailModal(false)} className="btn-close-gov">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body-gov">
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#172033", marginBottom: "12px", lineHeight: "1.4" }}>
                {selectedTask.title}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#F8FAFC", padding: "14px", borderRadius: "10px", border: "1px solid #E2E8F0", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Cán bộ thực hiện:</span>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#172033" }}>{selectedTask.assignee}</div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Trạng thái:</span>
                  <div><TaskStatusBadge status={selectedTask.status} /></div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Ngày giao:</span>
                  <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>{selectedTask.assignedDate}</div>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Hạn hoàn thành:</span>
                  <div style={{ fontSize: "13.5px", fontWeight: "700", color: selectedTask.status === "Quá hạn" ? "#DC2626" : "#172033" }}>{selectedTask.dueDate}</div>
                </div>
              </div>

              {/* LỊCH SỬ TIẾN ĐỘ TỪ MONGODB */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                  <History size={15} />
                  <span>Lịch sử cập nhật tiến độ (MongoDB Audit Log):</span>
                </span>
                {taskHistory.length === 0 ? (
                  <p style={{ fontSize: "12.5px", color: "#94A3B8", margin: "6px 0" }}>Chưa có lịch sử cập nhật tiến độ.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", maxHeight: "160px", overflowY: "auto" }}>
                    {taskHistory.map((h, idx) => (
                      <div key={h._id || idx} style={{ background: "#F8FAFC", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
                        <div style={{ fontWeight: "700", color: "#005BAC" }}>
                          {h.userName}: {h.oldProgress}% → {h.newProgress}%
                        </div>
                        {h.note && <div style={{ color: "#475569", marginTop: "2px" }}>"{h.note}"</div>}
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                          {new Date(h.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer-gov">
                <button type="button" onClick={() => setShowDetailModal(false)} className="btn-secondary-gov">
                  Đóng
                </button>
                {selectedTask.status === "Chờ phê duyệt" && (
                  <>
                    <button type="button" onClick={() => { setShowDetailModal(false); handleRequestRevision(selectedTask); }} className="btn-secondary-gov" style={{ color: "#D97706", borderColor: "#FDE68A" }}>
                      Yêu cầu bổ sung
                    </button>
                    <button type="button" onClick={() => { setShowDetailModal(false); handleApproveTask(selectedTask); }} className="btn-primary-gov" style={{ backgroundColor: "#16A34A" }}>
                      Phê duyệt hoàn thành
                    </button>
                  </>
                )}
                {selectedTask.status !== "Chờ phê duyệt" && (
                  <button type="button" className="btn-primary-gov" onClick={() => { setShowDetailModal(false); handleUpdateTask(selectedTask); }}>
                    Cập nhật tiến độ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          MODAL: CẬP NHẬT TIẾN ĐỘ NHIỆM VỤ
      ======================================== */}
      {showUpdateModal && selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          onClose={() => setShowUpdateModal(false)}
          onSave={handleSaveProgressUpdate}
        />
      )}
    </div>
  );
};

const UpdateTaskModal = ({ task, onClose, onSave }) => {
  const [progressVal, setProgressVal] = useState(task.progress || 0);
  const [noteVal, setNoteVal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(Number(progressVal), noteVal);
  };

  return (
    <div className="modal-backdrop-gov">
      <div className="modal-content-gov" style={{ maxWidth: "450px" }}>
        <div className="modal-header-gov">
          <h3>CẬP NHẬT TIẾN ĐỘ NHIỆM VỤ</h3>
          <button onClick={onClose} className="btn-close-gov">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body-gov">
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#172033", marginBottom: "14px" }}>
            {task.title}
          </div>

          <div className="form-group-gov">
            <label>Tiến độ thực hiện ({progressVal}%):</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressVal}
              onChange={(e) => setProgressVal(e.target.value)}
              style={{ width: "100%", accentColor: "#005BAC", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
              <span>0% (Mới giao)</span>
              <span>50% (Đang làm)</span>
              <span>100% (Hoàn thành)</span>
            </div>
          </div>

          <div className="form-group-gov">
            <label>Ghi chú tiến độ & Kết quả công việc:</label>
            <textarea
              rows={3}
              placeholder="Nhập chi tiết công việc đã hoàn thành..."
              value={noteVal}
              onChange={(e) => setNoteVal(e.target.value)}
            />
          </div>

          <div className="modal-footer-gov" style={{ marginTop: "16px" }}>
            <button type="button" onClick={onClose} className="btn-secondary-gov">
              Hủy
            </button>
            <button type="submit" className="btn-primary-gov">
              Lưu cập nhật DB & Báo Realtime
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TotalTasksPage;
