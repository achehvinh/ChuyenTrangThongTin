import React, { useState, useEffect } from "react";
import { X, ClipboardPlus, Plus, Calendar, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { getStaffList, createTask } from "../../services/taskService";

/**
 * Component Modal Giao Nhiệm Vụ Mới Dành Riêng Cho Trưởng Phòng
 * Kết nối Realtime MongoDB + API + Auth + Form Validation Chuyên Nghiệp
 */
const CreateTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const todayStr = new Date().toISOString().substring(0, 10);

  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    assigneeName: "",
    priority: "Bình thường",
    startDate: todayStr,
    dueDate: "",
    note: "",
  });

  // Fetch danh sách cán bộ thực tế từ API Backend MongoDB khi mở Modal
  useEffect(() => {
    if (isOpen) {
      const fetchStaff = async () => {
        try {
          setLoadingStaff(true);
          const list = await getStaffList();
          setStaffList(list);

          // Nếu có danh sách cán bộ, tự chọn cán bộ đầu tiên làm mặc định
          if (list && list.length > 0) {
            setFormData((prev) => ({
              ...prev,
              assignedTo: list[0]._id || list[0].id || "",
              assigneeName: list[0].fullName || list[0].name || "",
            }));
          }
        } catch (err) {
          console.error("Lỗi lấy danh sách cán bộ:", err);
        } finally {
          setLoadingStaff(false);
        }
      };
      fetchStaff();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStaffChange = (e) => {
    const selectedId = e.target.value;
    const foundStaff = staffList.find((s) => (s._id || s.id) === selectedId);
    setFormData({
      ...formData,
      assignedTo: selectedId,
      assigneeName: foundStaff ? foundStaff.fullName || foundStaff.name : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // ── Validation Nghiệp vụ ──
    if (!formData.title || !formData.title.trim()) {
      setErrorMsg("Tên nhiệm vụ không được để trống.");
      return;
    }

    if (!formData.assignedTo && !formData.assigneeName) {
      setErrorMsg("Vui lòng chọn cán bộ thực hiện.");
      return;
    }

    if (!formData.dueDate) {
      setErrorMsg("Hạn hoàn thành không được để trống.");
      return;
    }

    const start = new Date(formData.startDate || todayStr);
    const due = new Date(formData.dueDate);

    if (due < start) {
      setErrorMsg("Hạn hoàn thành phải sau ngày bắt đầu.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createTask({
        title: formData.title.trim(),
        description: formData.description,
        assignedTo: formData.assignedTo,
        assigneeName: formData.assigneeName,
        priority: formData.priority,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        note: formData.note,
      });

      if (res?.success) {
        // Reset Form
        setFormData({
          title: "",
          description: "",
          assignedTo: staffList[0]?._id || "",
          assigneeName: staffList[0]?.fullName || "",
          priority: "Bình thường",
          startDate: todayStr,
          dueDate: "",
          note: "",
        });

        if (onSuccess) {
          onSuccess(res.message || "Đã giao nhiệm vụ thành công.");
        }
        onClose();
      }
    } catch (err) {
      console.error("Lỗi giao nhiệm vụ:", err);
      setErrorMsg(
        err.response?.data?.message || "Không thể giao nhiệm vụ. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop-gov">
      <div className="modal-content-gov" style={{ maxWidth: "680px" }}>
        {/* HEADER MODAL */}
        <div className="modal-header-gov" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#172033", display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipboardPlus size={20} color="#005BAC" />
              <span>GIAO NHIỆM VỤ MỚI</span>
            </h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "#64748B", fontWeight: "500" }}>
              Phân công nhiệm vụ cho cán bộ thuộc Phòng Văn hóa - Xã hội
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn-close-gov">
            <X size={20} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="modal-body-gov">
          {/* THÔNG BÁO LỖI VALIDATION */}
          {errorMsg && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. TÊN NHIỆM VỤ */}
          <div className="form-group-gov">
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
              1. TÊN NHIỆM VỤ <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Tổng hợp báo cáo tình hình thực hiện nhiệm vụ tháng 8/2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* 2. NỘI DUNG NHIỆM VỤ */}
          <div className="form-group-gov">
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
              2. NỘI DUNG NHIỆM VỤ
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả rõ nội dung, yêu cầu và kết quả cần đạt..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* 3. NGƯỜI THỰC HIỆN (LẤY TỪ API THẬT) */}
          <div className="form-group-gov">
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
              3. NGƯỜI THỰC HIỆN <span style={{ color: "#DC2626" }}>*</span>
            </label>
            {loadingStaff ? (
              <div style={{ fontSize: "13px", color: "#64748B", padding: "8px 0" }}>Đang tải danh sách cán bộ...</div>
            ) : (
              <select
                value={formData.assignedTo}
                onChange={handleStaffChange}
                required
                style={{ height: "42px" }}
              >
                <option value="">-- Chọn cán bộ thực hiện --</option>
                {staffList.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>
                    {s.fullName || s.name} — {s.chucVu || s.position || "Công chức chuyên môn"} ({s.phongBan || "Phòng VH-XH"})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 4. MỨC ĐỘ ƯU TIÊN */}
          <div className="form-row-gov">
            <div className="form-group-gov">
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
                4. MỨC ĐỘ ƯU TIÊN
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Thấp">Thấp</option>
                <option value="Bình thường">Bình thường</option>
                <option value="Cao">Cao</option>
                <option value="Khẩn cấp">Khẩn cấp</option>
              </select>
            </div>

            {/* 5. NGÀY BẮT ĐẦU */}
            <div className="form-group-gov">
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
                5. NGÀY BẮT ĐẦU
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
          </div>

          {/* 6. HẠN HOÀN THÀNH */}
          <div className="form-group-gov">
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
              6. HẠN HOÀN THÀNH <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* 7. GHI CHÚ */}
          <div className="form-group-gov">
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#172033" }}>
              7. GHI CHÚ & CHỈ ĐẠO THÊM
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm về hồ sơ kèm theo hoặc chỉ đạo đặc biệt (nếu có)..."
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>

          {/* FOOTER ACTION BUTTONS */}
          <div className="modal-footer-gov" style={{ marginTop: "10px", paddingTop: "14px", borderTop: "1px solid #E2E8F0" }}>
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="btn-secondary-gov"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary-gov"
              style={{ padding: "10px 22px" }}
            >
              {submitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Đang giao nhiệm vụ...</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Giao nhiệm vụ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
