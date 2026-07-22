import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KnowledgeManager.css';

const CATEGORIES = [
  'Phòng chống Lừa đảo Mạng',
  'An toàn Giao thông',
  'Phòng chống Thiên tai',
  'BHYT & BHXH',
  'Hướng dẫn VNeID',
  'Thủ tục Hành chính',
  'Tuyên truyền Bầu cử',
  'Chung & Khác'
];

const KnowledgeManager = () => {
  const [data, setData] = useState({
    title: '',
    keywords: '',
    category: 'Phòng chống Lừa đảo Mạng',
    content: ''
  });
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy danh sách tri thức
  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/knowledge');
      setList(res.data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách tri thức AI:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.title || !data.content) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung trả lời!");
      return;
    }
    try {
      await axios.post('https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/knowledge', data);
      alert("✨ Đã cập nhật tri thức AI thành công!");
      setData({
        title: '',
        keywords: '',
        category: 'Phòng chống Lừa đảo Mạng',
        content: ''
      });
      fetchKnowledge();
    } catch (err) {
      alert("❌ Lỗi khi lưu tri thức: " + err.message);
    }
  };

  const generateKeywords = () => {
    if (!data.title) return;
    let title = data.title.toLowerCase();
    let keywords = [];

    keywords.push(title);
    keywords.push(title.replaceAll("đ", "d"));
    keywords.push(title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d"));
    keywords.push("hỏi " + title);
    keywords.push("làm " + title);
    keywords.push("thủ tục " + title);
    keywords.push("hướng dẫn " + title);

    setData({
      ...data,
      keywords: [...new Set(keywords)].join(", ")
    });
  };

  const filteredList = list.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase()) ||
    item.keywords?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="km-admin-container">
      <div className="km-header">
        <h2>🤖 QUẢN LÝ TRI THỨC TRỢ LÝ AI (PHÒNG VĂN HÓA - XÃ HỘI)</h2>
        <p className="km-sub">Thêm mới & điều chỉnh câu hỏi - câu trả lời chuẩn nghiệp vụ cho Trợ lý AI</p>
      </div>

      <div className="km-grid">
        {/* CỘT TRÁI: FORM NHẬP TRI THỨC MỚI */}
        <div className="km-card km-form-card">
          <h3 className="km-card-title">📝 Thêm mới Tri thức AI</h3>

          <form onSubmit={handleSubmit} className="km-form">
            <div className="km-form-group">
              <label>Danh mục chuyên mục:</label>
              <select
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
                className="km-select"
              >
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="km-form-group">
              <label>Câu hỏi / Tiêu đề chủ đề tri thức:</label>
              <input
                type="text"
                placeholder="Ví dụ: Cách nhận biết số điện thoại giả danh Công an lừa đảo?"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="km-input"
              />
            </div>

            <div className="km-form-group">
              <div className="km-label-row">
                <label>Từ khóa nhận diện (Keywords):</label>
                <button
                  type="button"
                  className="km-gen-btn"
                  onClick={generateKeywords}
                >
                  ⚡ AI sinh từ khóa
                </button>
              </div>
              <input
                type="text"
                placeholder="Từ khóa nhận diện, phân cách bằng dấu phẩy..."
                value={data.keywords}
                onChange={(e) => setData({ ...data, keywords: e.target.value })}
                className="km-input"
              />
            </div>

            <div className="km-form-group">
              <label>Nội dung câu trả lời chuẩn nghiệp vụ (Không suy diễn):</label>
              <textarea
                placeholder="Nhập nội dung trả lời chính xác 100%, rõ ràng, trình bày theo từng bước..."
                value={data.content}
                onChange={(e) => setData({ ...data, content: e.target.value })}
                className="km-textarea"
                rows={7}
              />
            </div>

            <button type="submit" className="km-submit-btn">
              💾 Lưu Tri Thức Vào Hệ Thống AI
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: DANH SÁCH TRI THỨC HIỆN CÓ */}
        <div className="km-card km-list-card">
          <div className="km-list-header">
            <h3 className="km-card-title">📚 Cơ sở Tri thức AI đã duyệt ({list.length})</h3>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm tri thức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="km-search-input"
            />
          </div>

          {loading ? (
            <div className="km-loading">Đang tải dữ liệu tri thức...</div>
          ) : filteredList.length === 0 ? (
            <div className="km-empty">Chưa có dữ liệu tri thức khớp với từ khóa tìm kiếm.</div>
          ) : (
            <div className="km-knowledge-list">
              {filteredList.map((item, idx) => (
                <div key={item._id || idx} className="km-item-card">
                  <div className="km-item-top">
                    <span className="km-cat-badge">{item.category || 'Chung'}</span>
                    <strong className="km-item-title">{item.title}</strong>
                  </div>
                  {item.keywords && (
                    <div className="km-item-kw">🔑 Từ khóa: {item.keywords}</div>
                  )}
                  <div className="km-item-content">{item.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeManager;