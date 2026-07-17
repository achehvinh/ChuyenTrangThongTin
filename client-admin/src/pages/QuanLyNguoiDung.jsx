import { useState, useEffect } from "react";
import axios from "axios";
import "./QuanLyNguoiDung.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1";

export default function QuanLyNguoiDung() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Citizen Form state
  const [editingCitizen, setEditingCitizen] = useState(null);
  const [citizenForm, setCitizenForm] = useState({
    fullName: "",
    cccd: "",
    birthDate: "",
    gender: "Nam",
    address: "",
    phone: "",
  });

  // Selected citizen for BHYT Card management
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [insuranceCard, setInsuranceCard] = useState(null);
  const [loadingCard, setLoadingCard] = useState(false);

  // BHYT Form state
  const [bhytForm, setBhytForm] = useState({
    insuranceCode: "",
    issueDate: "",
    expiryDate: "",
    status: "active",
    note: "",
  });

  const token = localStorage.getItem("admin_token");

  // Load citizens list
  const fetchCitizens = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/citizens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitizens(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách công dân.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  // Handle citizen submit (Create or Update)
  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!citizenForm.fullName || !citizenForm.cccd) {
      setError("Họ tên và số CCCD là bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      if (editingCitizen) {
        // Update
        const res = await axios.put(
          `${API_URL}/citizens/${editingCitizen._id}`,
          citizenForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Cập nhật thông tin công dân thành công!");
        setEditingCitizen(null);
      } else {
        // Create
        await axios.post(`${API_URL}/citizens`, citizenForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Thêm mới công dân thành công!");
      }

      setCitizenForm({
        fullName: "",
        cccd: "",
        birthDate: "",
        gender: "Nam",
        address: "",
        phone: "",
      });

      fetchCitizens();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi khi lưu thông tin công dân.");
    } finally {
      setLoading(false);
    }
  };

  // Edit citizen
  const handleEditCitizen = (citizen) => {
    setEditingCitizen(citizen);
    setCitizenForm({
      fullName: citizen.fullName || "",
      cccd: citizen.cccd || "",
      birthDate: citizen.birthDate ? citizen.birthDate.substring(0, 10) : "",
      gender: citizen.gender || "Nam",
      address: citizen.address || "",
      phone: citizen.phone || "",
    });
  };

  // Delete citizen
  const handleDeleteCitizen = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa công dân "${name}" và toàn bộ thông tin bảo hiểm liên quan?`)) {
      return;
    }

    try {
      setMessage("");
      setError("");
      await axios.delete(`${API_URL}/citizens/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa công dân thành công.");
      if (selectedCitizen && selectedCitizen._id === id) {
        setSelectedCitizen(null);
        setInsuranceCard(null);
      }
      fetchCitizens();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xóa công dân.");
    }
  };

  // Select citizen to manage BHYT card
  const handleSelectCitizenForBHYT = async (citizen) => {
    setSelectedCitizen(citizen);
    setInsuranceCard(null);
    setMessage("");
    setError("");

    // Reset card form
    setBhytForm({
      insuranceCode: "",
      issueDate: new Date().toISOString().substring(0, 10),
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .substring(0, 10),
      status: "active",
      note: "",
    });

    try {
      setLoadingCard(true);
      const res = await axios.get(`${API_URL}/insurances/citizen/${citizen._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setInsuranceCard(res.data);
        setBhytForm({
          insuranceCode: res.data.insuranceCode || "",
          issueDate: res.data.issueDate ? res.data.issueDate.substring(0, 10) : "",
          expiryDate: res.data.expiryDate ? res.data.expiryDate.substring(0, 10) : "",
          status: res.data.status || "active",
          note: res.data.note || "",
        });
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(err);
        setError("Lỗi khi tải thông tin thẻ BHYT.");
      }
    } finally {
      setLoadingCard(false);
    }
  };

  // Save BHYT card (Create or Update)
  const handleBhytSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedCitizen) return;

    try {
      setLoadingCard(true);
      const cardPayload = {
        ...bhytForm,
        citizenId: selectedCitizen._id,
      };

      if (insuranceCard) {
        // Update card
        await axios.put(`${API_URL}/insurances/${insuranceCard._id}`, cardPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cập nhật thẻ BHYT thành công!");
      } else {
        // Create card
        await axios.post(`${API_URL}/insurances`, cardPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Cấp mới thẻ BHYT thành công!");
      }

      // Reload card info
      handleSelectCitizenForBHYT(selectedCitizen);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi khi lưu thẻ BHYT.");
    } finally {
      setLoadingCard(false);
    }
  };

  // Delete BHYT card
  const handleDeleteBHYT = async () => {
    if (!insuranceCard) return;
    if (!window.confirm("Bạn có chắc chắn muốn hủy/xóa thẻ BHYT này của công dân?")) return;

    try {
      setLoadingCard(true);
      await axios.delete(`${API_URL}/insurances/${insuranceCard._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Đã xóa thẻ BHYT thành công.");
      setInsuranceCard(null);
      setBhytForm({
        insuranceCode: "",
        issueDate: new Date().toISOString().substring(0, 10),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .substring(0, 10),
        status: "active",
        note: "",
      });
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xóa thẻ BHYT.");
    } finally {
      setLoadingCard(false);
    }
  };

  // Filter citizens based on search term
  const filteredCitizens = citizens.filter((c) => {
    const s = searchTerm.toLowerCase();
    return (
      (c.fullName && c.fullName.toLowerCase().includes(s)) ||
      (c.cccd && c.cccd.includes(s)) ||
      (c.phone && c.phone.includes(s))
    );
  });

  return (
    <div className="quanly-page">
      <div className="quanly-header">
        <h1>👥 Quản lý Thông tin Công dân & BHYT</h1>
        <p>Thêm mới, sửa đổi thông tin người dân và cấp thẻ Bảo hiểm y tế (BHYT) tại địa phương</p>
      </div>

      {message && <div className="quanly-success">✅ {message}</div>}
      {error && <div className="quanly-error">⚠️ {error}</div>}

      <div className="user-layout-grid">
        {/* CỘT TRÁI: Quản lý Thông tin Công dân */}
        <div className="user-column">
          <div className="quanly-form-card">
            <h3>{editingCitizen ? "✏️ Cập nhật công dân" : "➕ Thêm mới công dân"}</h3>
            <form onSubmit={handleCitizenSubmit}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={citizenForm.fullName}
                  onChange={(e) => setCitizenForm({ ...citizenForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Số CCCD (12 số)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 034095012345"
                    value={citizenForm.cccd}
                    onChange={(e) => setCitizenForm({ ...citizenForm, cccd: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    value={citizenForm.gender}
                    onChange={(e) => setCitizenForm({ ...citizenForm, gender: e.target.value })}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    value={citizenForm.birthDate}
                    onChange={(e) => setCitizenForm({ ...citizenForm, birthDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0912345678"
                    value={citizenForm.phone}
                    onChange={(e) => setCitizenForm({ ...citizenForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ thường trú</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thôn Đăk Wek, xã Đăk Pxi"
                  value={citizenForm.address}
                  onChange={(e) => setCitizenForm({ ...citizenForm, address: e.target.value })}
                />
              </div>

              <div className="btn-actions-row">
                <button type="submit" className="quanly-submit-btn" disabled={loading}>
                  {editingCitizen ? "💾 Lưu cập nhật" : "➕ Thêm công dân"}
                </button>
                {editingCitizen && (
                  <button
                    type="button"
                    className="cancel-edit-btn"
                    onClick={() => {
                      setEditingCitizen(null);
                      setCitizenForm({
                        fullName: "",
                        cccd: "",
                        birthDate: "",
                        gender: "Nam",
                        address: "",
                        phone: "",
                      });
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Cấp BHYT cho công dân được chọn */}
          {selectedCitizen && (
            <div className="quanly-form-card bhyt-card-management">
              <h3>💳 Quản lý thẻ BHYT</h3>
              <div className="selected-user-brief">
                <p>Công dân: <strong>{selectedCitizen.fullName}</strong></p>
                <p>CCCD: <code>{selectedCitizen.cccd}</code></p>
                <p>Trạng thái: {insuranceCard ? <span className="status-badge active">Đã cấp thẻ BHYT</span> : <span className="status-badge missing">Chưa cấp BHYT</span>}</p>
              </div>

              <form onSubmit={handleBhytSubmit}>
                <div className="form-group">
                  <label>Mã thẻ BHYT (15 ký tự)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: GD4797931885408"
                    value={bhytForm.insuranceCode}
                    onChange={(e) => setBhytForm({ ...bhytForm, insuranceCode: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Ngày cấp</label>
                    <input
                      type="date"
                      value={bhytForm.issueDate}
                      onChange={(e) => setBhytForm({ ...bhytForm, issueDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hạn sử dụng</label>
                    <input
                      type="date"
                      value={bhytForm.expiryDate}
                      onChange={(e) => setBhytForm({ ...bhytForm, expiryDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label>Trạng thái thẻ</label>
                    <select
                      value={bhytForm.status}
                      onChange={(e) => setBhytForm({ ...bhytForm, status: e.target.value })}
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="expired">Hết hiệu lực</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Ghi chú</label>
                    <input
                      type="text"
                      placeholder="Ghi chú thẻ..."
                      value={bhytForm.note}
                      onChange={(e) => setBhytForm({ ...bhytForm, note: e.target.value })}
                    />
                  </div>
                </div>

                <div className="btn-actions-row">
                  <button type="submit" className="quanly-submit-btn card-submit-btn" disabled={loadingCard}>
                    {insuranceCard ? "💾 Lưu thẻ BHYT" : "💳 Cấp thẻ BHYT"}
                  </button>
                  {insuranceCard && (
                    <button type="button" className="delete-card-btn" onClick={handleDeleteBHYT} disabled={loadingCard}>
                      🗑️ Hủy thẻ BHYT
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: Bảng Danh sách công dân */}
        <div className="user-column">
          <div className="quanly-list-card">
            <div className="list-card-header">
              <h3>📋 Danh sách công dân</h3>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Tìm theo tên, CCCD hoặc SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="quanly-table">
                <thead>
                  <tr>
                    <th>Họ và tên / CCCD</th>
                    <th>Ngày sinh</th>
                    <th>Giới tính</th>
                    <th>Thông tin liên hệ</th>
                    <th style={{ textAlign: "center" }}>BHYT</th>
                    <th style={{ width: "160px", textAlign: "center" }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCitizens.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        Không tìm thấy công dân nào.
                      </td>
                    </tr>
                  ) : (
                    filteredCitizens.map((c) => (
                      <tr key={c._id} className={selectedCitizen && selectedCitizen._id === c._id ? "selected-row" : ""}>
                        <td>
                          <strong>{c.fullName}</strong>
                          <div className="text-muted" style={{ fontSize: "12px", marginTop: "2px" }}>
                            CCCD: <code>{c.cccd}</code>
                          </div>
                        </td>
                        <td>{c.birthDate ? new Date(c.birthDate).toLocaleDateString("vi-VN") : "N/A"}</td>
                        <td>{c.gender}</td>
                        <td>
                          <div>📞 {c.phone || "Chưa cập nhật"}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>📍 {c.address || "N/A"}</div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="manage-bhyt-badge-btn"
                            onClick={() => handleSelectCitizenForBHYT(c)}
                            title="Nhấp để xem/quản lý bảo hiểm"
                          >
                            ⚙️ Quản lý
                          </button>
                        </td>
                        <td className="text-center">
                          <div className="btn-table-actions">
                            <button className="edit-user-btn" onClick={() => handleEditCitizen(c)}>
                              ✏️ Sửa
                            </button>
                            <button
                              className="delete-user-btn-small"
                              onClick={() => handleDeleteCitizen(c._id, c.fullName)}
                            >
                              🗑️ Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
