import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KnowledgeManager.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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

const TYPES = [
  'Tuyên truyền',
  'Thủ tục hành chính',
  'Hỏi đáp',
  'Văn bản',
  'Hướng dẫn',
  'Thông báo'
];

const SOURCES = [
  'Phòng Văn hóa - Xã hội',
  'UBND xã',
  'Văn bản pháp luật',
  'Tự nhập'
];

const PRIORITIES = ['Thấp', 'Trung bình', 'Cao', 'Khẩn'];
const STATUSES = ['Nháp', 'Chờ duyệt', 'Đã duyệt'];

const DEFAULT_KNOWLEDGE = [
  {
    _id: 'kn-001',
    title: 'Xin chào, chào, hello, hi, alo, ok',
    keywords: 'chào, xin chào, hello, hi, alo, ok, trợ lý ai',
    category: 'Chung & Khác',
    type: 'Hỏi đáp',
    source: 'Phòng Văn hóa - Xã hội',
    priority: 'Trung bình',
    status: 'Đã duyệt',
    creator: 'Admin - Phòng VH-XH',
    usageCount: 156,
    active: true,
    content: `Xin chào! 👋

Tôi là Trợ lý AI của Phòng Văn hóa - Xã hội, rất vui được hỗ trợ bà con.

Tôi có thể giúp bà con:
• Tra cứu thủ tục hành chính.
• Hướng dẫn hồ sơ, giấy tờ cần chuẩn bị.
• Giải đáp thông tin về bảo hiểm y tế (BHYT).
• Cung cấp thông tin về dịch vụ công trực tuyến.
• Giải đáp các thông tin đã được UBND xã cập nhật.

Bà con chỉ cần nhập câu hỏi theo cách tự nhiên!`,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: 'kn-002',
    title: 'Cách nhận biết số điện thoại giả danh Công an, Viện kiểm sát để lừa đảo',
    keywords: 'lừa đảo, công an giả, số điện thoại lừa đảo, giả danh công an, chuyển tiền lừa đảo',
    category: 'Phòng chống Lừa đảo Mạng',
    type: 'Tuyên truyền',
    source: 'Phòng Văn hóa - Xã hội',
    priority: 'Khẩn',
    status: 'Đã duyệt',
    creator: 'Cán bộ An ninh mạng',
    usageCount: 89,
    active: true,
    content: `Khuyến cáo phòng chống thủ đoạn lừa đảo giả danh Công an:
1. Cơ quan Công an, Viện kiểm sát KHÔNG BAO GIỜ làm việc qua điện thoại hay yêu cầu người dân chuyển tiền vào khoản tạm giữ.
2. Tuyệt đối KHÔNG cung cấp mã OTP, mật khẩu ngân hàng, mật khẩu VNeID cho bất kỳ ai.
3. Khi nhận được cuộc gọi đe dọa hoặc yêu cầu chuyển tiền, bà con hãy giữ bình tĩnh và báo ngay cho Công an xã Đăk Pxi để được hỗ trợ.`,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    _id: 'kn-003',
    title: 'Hướng dẫn thủ tục cấp lại thẻ BHYT bị mất hoặc hư hỏng',
    keywords: 'cấp lại thẻ bhyt, mất thẻ bảo hiểm y tế, làm lại bhyt, bhyt hỏng, thủ tục bhyt',
    category: 'BHYT & BHXH',
    type: 'Thủ tục hành chính',
    source: 'UBND xã',
    priority: 'Cao',
    status: 'Đã duyệt',
    creator: 'Cán bộ Chuyên trách BHYT',
    usageCount: 64,
    active: true,
    content: `Trình tự thủ tục cấp lại thẻ BHYT cho người dân:
• Bước 1: Mang theo Căn cước công dân đến Bộ phận Một cửa UBND xã Đăk Pxi.
• Bước 2: Điền tờ khai tham gia, điều chỉnh thông tin BHYT (mẫu TK1-TS).
• Bước 3: Cán bộ tiếp nhận hồ sơ và tra cứu thông tin trên hệ thống BHXH.
• Bước 4: Nhận thẻ BHYT cấp lại hoặc sử dụng hình ảnh thẻ BHYT trên ứng dụng VNeID / VSSID.`,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

export default function KnowledgeManager() {
  const [form, setForm] = useState({
    title: '',
    keywords: '',
    category: 'Phòng chống Lừa đảo Mạng',
    type: 'Thủ tục hành chính',
    source: 'Phòng Văn hóa - Xã hội',
    customSource: '',
    priority: 'Trung bình',
    status: 'Đã duyệt',
    creator: 'Admin - Phòng VH-XH',
    content: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  // Search & Filter states
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [filterStatus, setFilterStatus] = useState('Tất cả');
  const [filterSource, setFilterSource] = useState('Tất cả');
  const [filterPriority, setFilterPriority] = useState('Tất cả');

  // Modals state
  const [viewingItem, setViewingItem] = useState(null);
  const [testingItem, setTestingItem] = useState(null);
  const [testQuestion, setTestQuestion] = useState('');
  const [testResult, setTestResult] = useState(null);

  // Fetch Knowledge List from API or LocalStorage/Defaults
  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/knowledge`);
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setList(res.data);
        localStorage.setItem('bhyt_knowledge_db', JSON.stringify(res.data));
      } else {
        loadLocalOrDefault();
      }
    } catch (err) {
      loadLocalOrDefault();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalOrDefault = () => {
    try {
      const saved = localStorage.getItem('bhyt_knowledge_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setList(parsed);
          return;
        }
      }
    } catch (e) {}
    setList(DEFAULT_KNOWLEDGE);
    localStorage.setItem('bhyt_knowledge_db', JSON.stringify(DEFAULT_KNOWLEDGE));
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const saveToLocal = (newList) => {
    setList(newList);
    try {
      localStorage.setItem('bhyt_knowledge_db', JSON.stringify(newList));
    } catch (e) {}
  };

  // Submit Handler (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Vui lòng nhập đầy đủ Tiêu đề tri thức và Nội dung câu trả lời!");
      return;
    }

    const finalSource = form.source === 'Tự nhập' ? (form.customSource.trim() || 'Tự nhập') : form.source;

    const payload = {
      title: form.title.trim(),
      keywords: form.keywords.trim(),
      category: form.category,
      type: form.type,
      source: finalSource,
      priority: form.priority,
      status: form.status,
      creator: form.creator.trim() || 'Admin - Phòng VH-XH',
      content: form.content.trim(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        // Edit mode
        await axios.put(`${API_BASE}/knowledge/${editingId}`, payload).catch(() => {});
        const updatedList = list.map(item => item._id === editingId ? {
          ...item,
          ...payload,
          updatedAt: new Date().toISOString()
        } : item);
        saveToLocal(updatedList);
        alert("✨ Đã cập nhật tri thức AI thành công!");
        setEditingId(null);
      } else {
        // Add new mode
        const newItem = {
          _id: `kn-${Date.now()}`,
          ...payload,
          usageCount: 0,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await axios.post(`${API_BASE}/knowledge`, payload).catch(() => {});
        const newList = [newItem, ...list];
        saveToLocal(newList);
        alert("✨ Đã thêm tri thức AI mới vào hệ thống thành công!");
      }

      resetForm();
    } catch (err) {
      alert("❌ Lỗi khi lưu tri thức: " + err.message);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      keywords: '',
      category: 'Phòng chống Lừa đảo Mạng',
      type: 'Thủ tục hành chính',
      source: 'Phòng Văn hóa - Xã hội',
      customSource: '',
      priority: 'Trung bình',
      status: 'Đã duyệt',
      creator: 'Admin - Phòng VH-XH',
      content: ''
    });
    setEditingId(null);
    setAiNotice('');
  };

  // Populate Edit Form
  const handleEdit = (item) => {
    setEditingId(item._id);
    const isStandardSource = SOURCES.includes(item.source);
    setForm({
      title: item.title || '',
      keywords: item.keywords || '',
      category: item.category || 'Phòng chống Lừa đảo Mạng',
      type: item.type || 'Thủ tục hành chính',
      source: isStandardSource ? item.source : 'Tự nhập',
      customSource: isStandardSource ? '' : item.source,
      priority: item.priority || 'Trung bình',
      status: item.status || 'Đã duyệt',
      creator: item.creator || 'Admin - Phòng VH-XH',
      content: item.content || ''
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Clone item
  const handleClone = (item) => {
    const cloned = {
      ...item,
      _id: `kn-${Date.now()}`,
      title: `(Bản sao) ${item.title}`,
      status: 'Nháp',
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newList = [cloned, ...list];
    saveToLocal(newList);
    alert(`📋 Đã nhân bản thành công bài tri thức: "${cloned.title}"!`);
  };

  // Toggle Active/Visibility
  const handleToggleActive = (item) => {
    const updated = list.map(i => i._id === item._id ? { ...i, active: !i.active } : i);
    saveToLocal(updated);
  };

  // Delete item
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tri thức: "${title}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/knowledge/${id}`).catch(() => {});
      const newList = list.filter(i => i._id !== id);
      saveToLocal(newList);
      if (editingId === id) resetForm();
    } catch (err) {
      alert("❌ Không thể xóa tri thức!");
    }
  };

  // AI Helpers
  const generateKeywords = () => {
    if (!form.title) {
      setAiNotice("⚠️ Vui lòng nhập tiêu đề tri thức trước khi sinh từ khóa.");
      return;
    }
    const t = form.title.toLowerCase();
    const noAccent = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("đ", "d");
    
    const kwSet = new Set([
      t,
      noAccent,
      `hỏi ${t}`,
      `hướng dẫn ${t}`,
      `thủ tục ${t}`,
      `tra cứu ${t}`,
      `quy định ${t}`
    ]);

    setForm(prev => ({
      ...prev,
      keywords: Array.from(kwSet).join(", ")
    }));
    setAiNotice("✨ Trợ lý AI đã tự động phân tích & sinh bộ từ khóa nhận diện!");
  };

  const generateQuestions = () => {
    if (!form.title) {
      setAiNotice("⚠️ Vui lòng nhập tiêu đề để AI gợi ý câu hỏi.");
      return;
    }
    const base = form.title.trim();
    const suggestions = [
      `1. Cho tôi hỏi về ${base.toLowerCase()}?`,
      `2. Quy trình và cách thức ${base.toLowerCase()} như thế nào?`,
      `3. Tôi cần chuẩn bị giấy tờ gì đối với ${base.toLowerCase()}?`
    ];
    setAiNotice(`✨ AI gợi ý câu hỏi của người dân:\n${suggestions.join('\n')}`);
  };

  const generateSummary = () => {
    if (!form.content) {
      setAiNotice("⚠️ Vui lòng nhập nội dung trước khi sinh tóm tắt.");
      return;
    }
    const sentences = form.content.split(/\n+|\.\s+/).filter(s => s.trim());
    const summary = sentences.slice(0, 3).map(s => `• ${s.trim().replace(/^•\s*/, '')}`).join('\n');
    setAiNotice(`✨ AI đã trích xuất tóm tắt cốt lõi:\n${summary}`);
  };

  const checkContent = () => {
    if (!form.content) {
      setAiNotice("⚠️ Vui lòng nhập nội dung để AI kiểm tra.");
      return;
    }
    const len = form.content.length;
    const words = form.content.trim().split(/\s+/).length;

    let evalMsg = "✅ Nội dung chuẩn nghiệp vụ, trình bày rõ ràng, không suy diễn!";
    if (len < 30) evalMsg = "⚠️ Nội dung quá ngắn, cần bổ sung thêm chi tiết nghiệp vụ.";
    else if (words < 10) evalMsg = "⚠️ Nội dung cần thêm câu từ hướng dẫn mạch lạc cho người dân.";

    setAiNotice(`🔍 **AI Kiểm tra nội dung**: ${evalMsg} (${words} từ, ${len} ký tự).`);
  };

  // AI Testing Modal Handlers
  const openTestModal = (item) => {
    setTestingItem(item);
    setTestQuestion(item.title);
    setTestResult(null);
  };

  const runAITest = () => {
    if (!testQuestion.trim() || !testingItem) return;

    const qLower = testQuestion.toLowerCase().trim();
    const titleLower = (testingItem.title || '').toLowerCase();
    const kwLower = (testingItem.keywords || '').toLowerCase();
    const contentLower = (testingItem.content || '').toLowerCase();

    // Check match score
    const kwArray = kwLower.split(',').map(k => k.trim()).filter(Boolean);
    const isMatchKw = kwArray.some(k => qLower.includes(k) || k.includes(qLower));
    const isMatchTitle = titleLower.includes(qLower) || qLower.includes(titleLower);
    const isMatchContent = contentLower.includes(qLower);

    if (isMatchKw || isMatchTitle || isMatchContent) {
      setTestResult({
        isMatch: true,
        confidence: isMatchKw ? 98 : isMatchTitle ? 92 : 85,
        answer: testingItem.content,
        source: testingItem.source || 'Phòng Văn hóa - Xã hội'
      });
      // Increment usage count in UI & local state
      const updatedList = list.map(i => i._id === testingItem._id ? { ...i, usageCount: (i.usageCount || 0) + 1 } : i);
      saveToLocal(updatedList);
      axios.post(`${API_BASE}/knowledge/${testingItem._id}/use`).catch(() => {});
    } else {
      setTestResult({
        isMatch: false,
        confidence: 0,
        answer: "Xin lỗi, hiện tại tôi chưa có dữ liệu về nội dung này trong cơ sở tri thức của Phòng Văn hóa - Xã hội.",
        source: 'Hệ thống Trợ lý AI'
      });
    }
  };

  // Content Counters
  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;
  const charCount = form.content.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Statistics
  const totalCount = list.length;
  const approvedCount = list.filter(i => i.status === 'Đã duyệt').length;
  const pendingCount = list.filter(i => i.status === 'Chờ duyệt').length;
  const draftCount = list.filter(i => i.status === 'Nháp').length;
  const totalAiUses = list.reduce((acc, curr) => acc + (curr.usageCount || 0), 0);

  // Filtered List
  const filteredList = list.filter(item => {
    const q = search.toLowerCase().trim();
    const matchSearch = !q || (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.keywords && item.keywords.toLowerCase().includes(q)) ||
      (item.content && item.content.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );

    const matchCat = filterCategory === 'Tất cả' || item.category === filterCategory;
    const matchStatus = filterStatus === 'Tất cả' || item.status === filterStatus;
    const matchSource = filterSource === 'Tất cả' || item.source === filterSource;
    const matchPriority = filterPriority === 'Tất cả' || item.priority === filterPriority;

    return matchSearch && matchCat && matchStatus && matchSource && matchPriority;
  });

  return (
    <div className="km-admin-container">
      {/* HEADER BANNER */}
      <div className="km-header">
        <h2>🤖 QUẢN LÝ TRI THỨC TRỢ LÝ AI (PHÒNG VĂN HÓA - XÃ HỘI)</h2>
        <p className="km-sub">Hệ thống biên soạn & thẩm định cơ sở dữ liệu tri thức chuẩn nghiệp vụ cho Trợ lý AI phục vụ Nhân dân xã Đăk Pxi</p>
      </div>

      {/* THỐNG KÊ (STATISTICS BANNER) */}
      <div className="km-stats-banner">
        <div className="km-stat-card">
          <span className="km-stat-icon">📚</span>
          <div className="km-stat-info">
            <span className="km-stat-val">{totalCount}</span>
            <span className="km-stat-lbl">Tổng tri thức</span>
          </div>
        </div>
        <div className="km-stat-card km-stat-card--approved">
          <span className="km-stat-icon">✅</span>
          <div className="km-stat-info">
            <span className="km-stat-val">{approvedCount}</span>
            <span className="km-stat-lbl">Đã duyệt</span>
          </div>
        </div>
        <div className="km-stat-card km-stat-card--pending">
          <span className="km-stat-icon">⏳</span>
          <div className="km-stat-info">
            <span className="km-stat-val">{pendingCount}</span>
            <span className="km-stat-lbl">Chờ duyệt</span>
          </div>
        </div>
        <div className="km-stat-card km-stat-card--draft">
          <span className="km-stat-icon">📝</span>
          <div className="km-stat-info">
            <span className="km-stat-val">{draftCount}</span>
            <span className="km-stat-lbl">Nháp</span>
          </div>
        </div>
        <div className="km-stat-card km-stat-card--ai">
          <span className="km-stat-icon">🤖</span>
          <div className="km-stat-info">
            <span className="km-stat-val">{totalAiUses}</span>
            <span className="km-stat-lbl">Lượt AI trả lời</span>
          </div>
        </div>
      </div>

      {/* BỐ CỤC 2 CỘT */}
      <div className="km-grid">
        {/* CỘT TRÁI: FORM NHẬP / SỬA TRI THỨC AI */}
        <div className="km-card km-form-card">
          <div className="km-form-header">
            <h3 className="km-card-title">
              {editingId ? "✏️ Hiệu chỉnh Tri thức AI" : "📝 Thêm mới Tri thức AI"}
            </h3>
            {editingId && (
              <button type="button" className="km-cancel-edit-btn" onClick={resetForm}>
                ✕ Hủy chế độ sửa
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="km-form">
            {/* Hàng 1: Danh mục & Loại tri thức */}
            <div className="km-form-row">
              <div className="km-form-group">
                <label>Danh mục chuyên mục <span className="km-req">*</span>:</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="km-select"
                >
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="km-form-group">
                <label>Loại tri thức <span className="km-req">*</span>:</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="km-select"
                >
                  {TYPES.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hàng 2: Câu hỏi / Tiêu đề */}
            <div className="km-form-group">
              <label>Câu hỏi / Tiêu đề chủ đề tri thức <span className="km-req">*</span>:</label>
              <input
                type="text"
                placeholder="Ví dụ: Cách nhận biết số điện thoại giả danh Công an lừa đảo?"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="km-input"
                required
              />
            </div>

            {/* Hàng 3: Từ khóa + Nút AI Hỗ Trợ */}
            <div className="km-form-group">
              <div className="km-label-row">
                <label>Từ khóa nhận diện (Keywords):</label>
                <div className="km-ai-tools-group">
                  <button type="button" className="km-gen-btn" onClick={generateKeywords} title="Sinh từ khóa tự động">
                    ⚡ AI sinh từ khóa
                  </button>
                  <button type="button" className="km-gen-btn km-gen-btn--sub" onClick={generateQuestions} title="Sinh mẫu câu hỏi người dân">
                    ✨ AI sinh câu hỏi
                  </button>
                  <button type="button" className="km-gen-btn km-gen-btn--sub" onClick={generateSummary} title="Sinh tóm tắt ý chính">
                    ✨ AI sinh tóm tắt
                  </button>
                  <button type="button" className="km-gen-btn km-gen-btn--sub" onClick={checkContent} title="Kiểm tra câu từ nghiệp vụ">
                    ✨ AI kiểm tra nội dung
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Từ khóa nhận diện, phân cách bằng dấu phẩy..."
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="km-input"
              />
            </div>

            {aiNotice && (
              <div className="km-ai-notice-box">
                {aiNotice}
              </div>
            )}

            {/* Hàng 4: Nguồn tri thức & Độ ưu tiên */}
            <div className="km-form-row">
              <div className="km-form-group">
                <label>Nguồn tri thức <span className="km-req">*</span>:</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  className="km-select"
                >
                  {SOURCES.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
                {form.source === 'Tự nhập' && (
                  <input
                    type="text"
                    placeholder="Nhập tên cơ quan / văn bản nguồn..."
                    value={form.customSource}
                    onChange={(e) => setForm({ ...form, customSource: e.target.value })}
                    className="km-input"
                    style={{ marginTop: '6px' }}
                  />
                )}
              </div>

              <div className="km-form-group">
                <label>Độ ưu tiên <span className="km-req">*</span>:</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="km-select"
                >
                  {PRIORITIES.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hàng 5: Trạng thái & Người tạo */}
            <div className="km-form-row">
              <div className="km-form-group">
                <label>Trạng thái <span className="km-req">*</span>:</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="km-select"
                >
                  {STATUSES.map((st, idx) => (
                    <option key={idx} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="km-form-group">
                <label>Người tạo / Cán bộ phụ trách:</label>
                <input
                  type="text"
                  placeholder="Nhập tên người tạo..."
                  value={form.creator}
                  onChange={(e) => setForm({ ...form, creator: e.target.value })}
                  className="km-input"
                />
              </div>
            </div>

            {/* Hàng 6: Nội dung câu trả lời + Live Counter */}
            <div className="km-form-group">
              <label>Nội dung câu trả lời chuẩn nghiệp vụ (Không suy diễn) <span className="km-req">*</span>:</label>
              <textarea
                placeholder="Nhập nội dung trả lời chính xác 100%, rõ ràng, trình bày theo từng bước..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="km-textarea"
                rows={7}
                required
              />
              <div className="km-content-counter">
                <span>📝 <strong>{charCount.toLocaleString('vi-VN')}</strong> ký tự</span>
                <span>•</span>
                <span>💬 <strong>{wordCount.toLocaleString('vi-VN')}</strong> từ</span>
                <span>•</span>
                <span>⏱️ Thời gian đọc: <strong>~{readTime} phút</strong></span>
              </div>
            </div>

            <button type="submit" className="km-submit-btn">
              {editingId ? "💾 Cập Nhật Tri Thức Vào CSDL AI" : "💾 Lưu Tri Thức Vào Hệ Thống AI"}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: DANH SÁCH TRI THỨC & THANH CÔNG CỤ */}
        <div className="km-card km-list-card">
          <div className="km-list-top-bar">
            <h3 className="km-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
              📚 Cơ sở Tri thức AI ({filteredList.length}/{list.length})
            </h3>
          </div>

          {/* THANH CÔNG CỤ (FILTERS BAR) */}
          <div className="km-filters-bar">
            <div className="km-search-box">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm tiêu đề, từ khóa, nội dung..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="km-search-input"
              />
            </div>

            <div className="km-filter-group">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="km-filter-select">
                <option value="Tất cả">📁 Tất cả chuyên mục</option>
                {CATEGORIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>

              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="km-filter-select">
                <option value="Tất cả">📌 Tất cả trạng thái</option>
                {STATUSES.map((st, i) => <option key={i} value={st}>{st}</option>)}
              </select>

              <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="km-filter-select">
                <option value="Tất cả">🏛️ Tất cả nguồn</option>
                {SOURCES.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>

              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="km-filter-select">
                <option value="Tất cả">🚨 Tất cả độ ưu tiên</option>
                {PRIORITIES.map((p, i) => <option key={i} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* DANH SÁCH CARDS TRI THỨC */}
          {loading ? (
            <div className="km-loading">Đang tải dữ liệu tri thức từ cơ sở dữ liệu...</div>
          ) : filteredList.length === 0 ? (
            <div className="km-empty">Không tìm thấy tri thức phù hợp với bộ lọc hiện tại.</div>
          ) : (
            <div className="km-knowledge-list">
              {filteredList.map((item) => {
                const isDraft = item.status === 'Nháp';
                const isPending = item.status === 'Chờ duyệt';
                const isApproved = item.status === 'Đã duyệt';

                const priorityClass = item.priority === 'Khẩn' ? 'prio-khan' :
                  item.priority === 'Cao' ? 'prio-cao' :
                  item.priority === 'Trung bình' ? 'prio-tb' : 'prio-thap';

                return (
                  <div key={item._id} className={`km-item-card ${!item.active ? 'is-disabled' : ''}`}>
                    <div className="km-item-top">
                      <div className="km-item-badges">
                        <span className={`km-status-badge ${isApproved ? 'st-approved' : isPending ? 'st-pending' : 'st-draft'}`}>
                          {item.status || 'Đã duyệt'}
                        </span>
                        <span className="km-cat-badge">{item.category || 'Chung'}</span>
                        <span className="km-type-badge">{item.type || 'Thủ tục'}</span>
                        <span className={`km-prio-badge ${priorityClass}`}>
                          {item.priority || 'Trung bình'}
                        </span>
                        {!item.active && (
                          <span className="km-status-badge st-disabled">Đã ẩn</span>
                        )}
                      </div>

                      <div className="km-item-usage">
                        🤖 {item.usageCount || 0} lượt AI dùng
                      </div>
                    </div>

                    <h4 className="km-item-title">{item.title}</h4>

                    {item.keywords && (
                      <div className="km-item-kw">🔑 <strong>Từ khóa:</strong> {item.keywords}</div>
                    )}

                    <div className="km-item-content">
                      {item.content}
                    </div>

                    <div className="km-item-meta-bar">
                      <span>🏛️ <strong>Nguồn:</strong> {item.source || 'Phòng VH-XH'}</span>
                      <span>•</span>
                      <span>👤 <strong>Tạo bởi:</strong> {item.creator || 'Admin'}</span>
                      <span>•</span>
                      <span>📅 <strong>Cập nhật:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('vi-VN') : 'Mới'}</span>
                    </div>

                    {/* NÚT THAO TÁC & KIỂM THỬ AI */}
                    <div className="km-item-actions">
                      <button type="button" className="km-act-btn km-act-btn--test" onClick={() => openTestModal(item)}>
                        🧪 Kiểm thử AI
                      </button>
                      <button type="button" className="km-act-btn km-act-btn--view" onClick={() => setViewingItem(item)}>
                        👁️ Xem
                      </button>
                      <button type="button" className="km-act-btn km-act-btn--edit" onClick={() => handleEdit(item)}>
                        ✏️ Sửa
                      </button>
                      <button type="button" className="km-act-btn km-act-btn--clone" onClick={() => handleClone(item)}>
                        📋 Nhân bản
                      </button>
                      <button type="button" className="km-act-btn km-act-btn--toggle" onClick={() => handleToggleActive(item)}>
                        {item.active ? '🙈 Ẩn' : '👁️‍🗨️ Hiện'}
                      </button>
                      <button type="button" className="km-act-btn km-act-btn--delete" onClick={() => handleDelete(item._id, item.title)}>
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* POPUP 1: KIỂM THỬ AI (AI TEST MODAL) */}
      {testingItem && (
        <div className="km-modal-overlay" onClick={() => setTestingItem(null)}>
          <div className="km-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="km-modal-head">
              <h3>🧪 KIỂM THỬ TRI THỨC VỚI TRỢ LÝ AI</h3>
              <button className="km-modal-close" onClick={() => setTestingItem(null)}>✕</button>
            </div>

            <div className="km-modal-body">
              <div className="km-test-info-box">
                <div>📌 <strong>Chủ đề tri thức đang thử nghiệm:</strong> {testingItem.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  🔑 Từ khóa nhận diện: {testingItem.keywords || 'Không có từ khóa'}
                </div>
              </div>

              <div className="km-form-group" style={{ marginTop: '14px' }}>
                <label>Nhập câu hỏi mô phỏng của người dân:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="km-input"
                    placeholder="Ví dụ: Cho tôi hỏi về thủ tục..."
                    value={testQuestion}
                    onChange={(e) => setTestQuestion(e.target.value)}
                  />
                  <button type="button" className="km-submit-btn" style={{ margin: 0, whiteSpace: 'nowrap' }} onClick={runAITest}>
                    🚀 Gửi câu hỏi
                  </button>
                </div>
              </div>

              {testResult && (
                <div className={`km-test-result-box ${testResult.isMatch ? 'is-success' : 'is-fallback'}`}>
                  <div className="km-test-res-head">
                    <span className="km-test-res-title">
                      {testResult.isMatch ? '🤖 Trợ lý AI trả lời (Trích xuất dữ liệu CSDL):' : '🤖 Trợ lý AI phản hồi (Không tìm thấy):'}
                    </span>
                    <span className="km-test-res-score">
                      {testResult.isMatch ? `🎯 Độ khớp: ${testResult.confidence}%` : '⚠️ Fallback 0%'}
                    </span>
                  </div>
                  <div className="km-test-res-body">
                    {testResult.answer}
                  </div>
                  <div className="km-test-res-foot">
                    📌 Nguồn trích dẫn: {testResult.source}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: XEM CHI TIẾT TRI THỨC (VIEW DETAIL MODAL) */}
      {viewingItem && (
        <div className="km-modal-overlay" onClick={() => setViewingItem(null)}>
          <div className="km-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="km-modal-head">
              <h3>📄 CHI TIẾT TRI THỨC TRỢ LÝ AI</h3>
              <button className="km-modal-close" onClick={() => setViewingItem(null)}>✕</button>
            </div>

            <div className="km-modal-body">
              <div className="km-view-detail-grid">
                <div><strong>Tiêu đề / Câu hỏi:</strong> {viewingItem.title}</div>
                <div><strong>Chuyên mục:</strong> {viewingItem.category}</div>
                <div><strong>Loại tri thức:</strong> {viewingItem.type || 'Thủ tục'}</div>
                <div><strong>Nguồn:</strong> {viewingItem.source || 'Phòng VH-XH'}</div>
                <div><strong>Độ ưu tiên:</strong> {viewingItem.priority}</div>
                <div><strong>Trạng thái:</strong> {viewingItem.status}</div>
                <div><strong>Người tạo:</strong> {viewingItem.creator}</div>
                <div><strong>Lượt AI sử dụng:</strong> {viewingItem.usageCount || 0} lượt</div>
                <div><strong>Từ khóa:</strong> {viewingItem.keywords || 'N/A'}</div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <strong style={{ fontSize: '13.5px', color: '#003d7a' }}>Nội dung câu trả lời chuẩn nghiệp vụ:</strong>
                <div className="km-item-content" style={{ marginTop: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {viewingItem.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}