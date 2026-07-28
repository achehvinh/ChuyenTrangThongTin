import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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

const DEFAULT_CHAT_LOGS = [
  {
    id: "chat-001",
    user: "Bà con Thôn Pa Cheng",
    question: "Làm thẻ BHYT cho trẻ em dưới 6 tuổi cần những giấy tờ gì?",
    answer: "Hồ sơ gồm: Trích lục Giấy khai sinh của trẻ và Căn cước công dân của cha/mẹ. Bà con mang đến Bộ phận Một cửa UBND xã Đăk Pxi để được cấp miễn phí 100%.",
    confidence: 96,
    source: "Phòng Văn hóa - Xã hội",
    timestamp: "2026-07-28 08:15",
    rating: "helpful"
  },
  {
    id: "chat-002",
    user: "Người dân Thôn Đăk Wek",
    question: "Có số điện thoại lạ gọi báo khóa tài khoản VNeID sau 2 tiếng có đúng không?",
    answer: "ĐÂY LÀ HÀNH VI LỪA ĐẢO. Cơ quan Công an và UBND xã KHÔNG BAO GIỜ gọi điện yêu cầu cung cấp OTP hoặc đe dọa khóa tài khoản qua điện thoại. Bà con tuyệt đối không làm theo.",
    confidence: 99,
    source: "Phòng chống Lừa đảo Mạng",
    timestamp: "2026-07-28 07:42",
    rating: "helpful"
  },
  {
    id: "chat-003",
    user: "Bà con Thôn Krong Đuân",
    question: "Đăng ký tạm trú cho công nhân làm đường ở đâu?",
    answer: "Bà con mang CCCD và hợp đồng thuê nhà/giấy xác nhận của chủ hộ đến Trụ sở Công an xã Đăk Pxi để thực hiện đăng ký tạm trú trực tiếp hoặc qua ứng dụng VNeID.",
    confidence: 88,
    source: "Thủ tục hành chính",
    timestamp: "2026-07-27 16:20",
    rating: "helpful"
  },
  {
    id: "chat-004",
    user: "Người dân Thôn Kon Đao Yôp",
    question: "Lịch tiêm chủng cho trẻ nhỏ tháng này vào ngày nào?",
    answer: "Lịch tiêm chủng mở rộng định kỳ tại Trạm Y tế xã Đăk Pxi diễn ra vào ngày 15 và 25 hàng tháng.",
    confidence: 92,
    source: "UBND xã Đăk Pxi",
    timestamp: "2026-07-27 14:10",
    rating: "helpful"
  }
];

const DEFAULT_AI_CONFIG = {
  botName: "Trợ lý AI - Phòng Văn hóa - Xã hội",
  communeName: "UBND xã Đăk Pxi",
  systemPrompt: "Bạn là Trợ lý AI chuyên trách tư vấn nghiệp vụ, giải đáp thủ tục hành chính, chính sách BHYT/BHXH và tuyên truyền phòng chống lừa đảo mạng cho Nhân dân xã Đăk Pxi.",
  confidenceThreshold: 75,
  autoReply: true,
  fallbackMessage: "Tôi là Trợ lý AI của Phòng Văn hóa - Xã hội xã Đăk Pxi. Câu hỏi của bà con hiện chưa có trong cơ sở dữ liệu tri thức đã duyệt. Cán bộ chuyên trách sẽ cập nhật câu trả lời sớm nhất!"
};

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'knowledge'; // 'knowledge' | 'chat-history' | 'ai-config'

  // User Profile Dropdown & Modal States
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [adminUser, setAdminUser] = useState(() => {
    return {
      fullName: localStorage.getItem('admin_fullname') || 'Admin VH-XH',
      username: localStorage.getItem('admin_username') || 'admin_vhxh',
      roleTitle: localStorage.getItem('admin_role') === 'truongphong' ? 'Trưởng phòng VH-XH' : 'Quản trị hệ thống',
      phone: '0987.654.321',
      email: 'admin.vhxh@dakpxi.gov.vn'
    };
  });

  const [passForm, setPassForm] = useState({
    oldPass: '',
    newPass: '',
    confirmPass: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_fullname');
    navigate('/dang-nhap');
  };

  const [chatLogs, setChatLogs] = useState(() => {
    const saved = localStorage.getItem('bhyt_chat_logs');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return DEFAULT_CHAT_LOGS;
  });

  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('bhyt_ai_config');
    if (saved) { try { return JSON.parse(saved); } catch (e) {} }
    return DEFAULT_AI_CONFIG;
  });

  const [chatSearch, setChatSearch] = useState('');

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

      {/* THỐNG KÊ (5 STAT CARDS) */}
      <div className="km-stats-5cards">
        <div className="km-stat-box km-stat-box--blue">
          <div className="km-stat-circle km-stat-circle--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.6 2.8 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>
          </div>
          <div className="km-stat-details">
            <span className="km-stat-number">{totalCount || 1}</span>
            <span className="km-stat-title">Tổng tri thức</span>
            <span className="km-stat-sub">Tổng số tài liệu và dữ liệu</span>
          </div>
        </div>

        <div className="km-stat-box km-stat-box--green">
          <div className="km-stat-circle km-stat-circle--green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="km-stat-details">
            <span className="km-stat-number">{approvedCount || 1}</span>
            <span className="km-stat-title">Đã duyệt</span>
            <span className="km-stat-sub">Tài liệu đã được phê duyệt</span>
          </div>
        </div>

        <div className="km-stat-box km-stat-box--orange">
          <div className="km-stat-circle km-stat-circle--orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
          </div>
          <div className="km-stat-details">
            <span className="km-stat-number">{pendingCount || 0}</span>
            <span className="km-stat-title">Chờ duyệt</span>
            <span className="km-stat-sub">Tài liệu đang chờ duyệt</span>
          </div>
        </div>

        <div className="km-stat-box km-stat-box--purple">
          <div className="km-stat-circle km-stat-circle--purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div className="km-stat-details">
            <span className="km-stat-number">{draftCount || 0}</span>
            <span className="km-stat-title">Nháp</span>
            <span className="km-stat-sub">Tài liệu nháp</span>
          </div>
        </div>

        <div className="km-stat-box km-stat-box--pink">
          <div className="km-stat-circle km-stat-circle--pink" style={{ background: "#f3e8ff", border: "1px solid #e9d5ff" }}>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="46" fill="#f3e8ff" />
              <rect x="36" y="62" width="28" height="24" rx="10" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
              <circle cx="50" cy="74" r="6" fill="#2563eb" />
              <rect x="26" y="28" width="48" height="34" rx="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
              <rect x="31" y="33" width="38" height="24" rx="10" fill="#7c3aed" />
              <circle cx="43" cy="45" r="3.5" fill="#ffffff" />
              <circle cx="57" cy="45" r="3.5" fill="#ffffff" />
              <line x1="50" y1="28" x2="50" y2="20" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="18" r="4" fill="#a855f7" />
            </svg>
          </div>
          <div className="km-stat-details">
            <span className="km-stat-number">{totalAiUses || 1}</span>
            <span className="km-stat-title">Lượt AI trả lời</span>
            <span className="km-stat-sub">Tổng lượt trả lời cho người dùng</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS: CHUYỂN ĐỔI GIỮA TRI THỨC AI | LỊCH SỬ CHAT | QUẢN LÝ & CẤU HÌNH AI */}
      <div style={{ display: "flex", gap: "10px", margin: "16px 0 20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
        <button
          type="button"
          onClick={() => setSearchParams({ tab: "knowledge" })}
          style={{
            padding: "8px 22px",
            borderRadius: "30px",
            border: "none",
            background: activeTab === "knowledge" ? "linear-gradient(135deg, #003366 0%, #004085 100%)" : "#ffffff",
            color: activeTab === "knowledge" ? "#ffffff" : "#475569",
            fontSize: "13.5px",
            fontWeight: "900",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: activeTab === "knowledge" ? "0 4px 12px rgba(0,51,102,0.35)" : "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" fill="#f3e8ff" />
            <rect x="36" y="62" width="28" height="24" rx="10" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="50" cy="74" r="6" fill="#2563eb" />
            <rect x="26" y="28" width="48" height="34" rx="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
            <rect x="31" y="33" width="38" height="24" rx="10" fill="#7c3aed" />
            <circle cx="43" cy="45" r="3.5" fill="#ffffff" />
            <circle cx="57" cy="45" r="3.5" fill="#ffffff" />
            <line x1="50" y1="28" x2="50" y2="20" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="18" r="4" fill="#a855f7" />
          </svg>
          <span>Trợ lý AI ({list.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: "chat-history" })}
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            background: activeTab === "chat-history" ? "#1d4ed8" : "#ffffff",
            color: activeTab === "chat-history" ? "#ffffff" : "#475569",
            fontSize: "13px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: activeTab === "chat-history" ? "0 2px 6px rgba(29,78,216,0.3)" : "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          🕒 Lịch sử chat ({chatLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: "ai-config" })}
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            border: "none",
            background: activeTab === "ai-config" ? "#1d4ed8" : "#ffffff",
            color: activeTab === "ai-config" ? "#ffffff" : "#475569",
            fontSize: "13px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: activeTab === "ai-config" ? "0 2px 6px rgba(29,78,216,0.3)" : "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          ⚙️ Quản lý AI
        </button>
      </div>

      {/* VIEW SUB-TAB 1: TRI THỨC AI (BỐ CỤC 2 CỘT CHUẨN MỚI) */}
      {activeTab === "knowledge" && (
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
    )}

      {/* VIEW SUB-TAB 2: LỊCH SỬ CHAT CỦA BÀ CON NÔNG DÂN VỚI TRỢ LÝ AI */}
      {activeTab === "chat-history" && (
        <div className="km-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "12px" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#1e1b4b", fontWeight: "800" }}>
                🕒 LỊCH SỬ HỘI THOẠI CỦA BÀ CON NÔNG DÂN VỚI TRỢ LÝ AI
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                Theo dõi nhật ký hội thoại thực tế của người dân 10 thôn thuộc xã Đăk Pxi
              </p>
            </div>
            <input
              type="text"
              placeholder="🔍 Tìm câu hỏi / từ khóa..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="km-input"
              style={{ width: "260px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {chatLogs
              .filter(item => !chatSearch || item.question.toLowerCase().includes(chatSearch.toLowerCase()) || item.user.toLowerCase().includes(chatSearch.toLowerCase()))
              .map((log) => (
                <div key={log.id} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ background: "#dbeafe", color: "#1d4ed8", padding: "3px 10px", borderRadius: "12px", fontSize: "11.5px", fontWeight: "800" }}>
                        👤 {log.user}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{log.timestamp}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: "800", padding: "2px 8px", borderRadius: "8px" }}>
                        🎯 Độ tin cậy: {log.confidence}%
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setForm({
                            title: log.question,
                            keywords: log.question.split(" ").slice(0, 5).join(", "),
                            category: "Thủ tục Hành chính",
                            type: "Hỏi đáp",
                            source: log.source || "Phòng Văn hóa - Xã hội",
                            customSource: "",
                            priority: "Trung bình",
                            status: "Đã duyệt",
                            creator: "Admin - Phòng VH-XH",
                            content: log.answer
                          });
                          setSearchParams({ tab: "knowledge" });
                        }}
                        style={{ padding: "4px 10px", background: "#1d4ed8", color: "#fff", border: "none", borderRadius: "6px", fontSize: "11.5px", fontWeight: "700", cursor: "pointer" }}
                      >
                        + Chuyển thành Tri thức AI mới
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: "13.5px", fontWeight: "800", color: "#1e1b4b", marginBottom: "8px" }}>
                    ❓ Câu hỏi: {log.question}
                  </div>

                  <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>
                    🤖 <strong>Trợ lý AI trả lời:</strong> {log.answer}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW SUB-TAB 3: CẤU HÌNH & QUẢN LÝ HỆ THỐNG TRỢ LÝ AI */}
      {activeTab === "ai-config" && (
        <div className="km-card" style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "#1e1b4b", fontWeight: "800", borderBottom: "1.5px solid #e2e8f0", paddingBottom: "10px" }}>
            ⚙️ CẤU HÌNH HỆ THỐNG TRỢ LÝ AI PHÒNG VĂN HÓA - XÃ HỘI
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="km-form-group">
              <label>Tên Trợ lý AI hiển thị người dân:</label>
              <input
                type="text"
                value={aiConfig.botName}
                onChange={(e) => setAiConfig({ ...aiConfig, botName: e.target.value })}
                className="km-input"
              />
            </div>

            <div className="km-form-group">
              <label>Cơ quan quản lý vận hành:</label>
              <input
                type="text"
                value={aiConfig.communeName}
                onChange={(e) => setAiConfig({ ...aiConfig, communeName: e.target.value })}
                className="km-input"
              />
            </div>

            <div className="km-form-group">
              <label>Chỉ thị ngữ cảnh hệ thống (System Prompt):</label>
              <textarea
                rows="4"
                value={aiConfig.systemPrompt}
                onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
                className="km-textarea"
              />
            </div>

            <div className="km-form-group">
              <label>Ngưỡng độ tin cậy trích xuất dữ liệu CSDL (%):</label>
              <input
                type="number"
                min="50"
                max="100"
                value={aiConfig.confidenceThreshold}
                onChange={(e) => setAiConfig({ ...aiConfig, confidenceThreshold: Number(e.target.value) })}
                className="km-input"
              />
            </div>

            <div className="km-form-group">
              <label>Thông điệp phản hồi mặc định khi không tìm thấy dữ liệu (Fallback Response):</label>
              <textarea
                rows="3"
                value={aiConfig.fallbackMessage}
                onChange={(e) => setAiConfig({ ...aiConfig, fallbackMessage: e.target.value })}
                className="km-textarea"
              />
            </div>

            <button
              type="button"
              className="km-submit-btn"
              onClick={() => {
                localStorage.setItem("bhyt_ai_config", JSON.stringify(aiConfig));
                alert("✅ Đã lưu cấu hình Hệ thống Trợ lý AI thành công!");
              }}
            >
              💾 Lưu Cấu Hình Hệ Thống AI
            </button>
          </div>
        </div>
      )}

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

      {/* POPUP 3: CÀI ĐẶT THÔNG TIN TÀI KHOẢN */}
      {showProfileModal && (
        <div className="km-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="km-modal-content" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="km-modal-head">
              <h3>👤 CÀI ĐẶT THÔNG TIN TÀI KHOẢN CÁN BỘ</h3>
              <button className="km-modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>

            <div className="km-modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="km-form-group">
                <label>Họ và tên Cán bộ:</label>
                <input
                  type="text"
                  value={adminUser.fullName}
                  onChange={(e) => setAdminUser({ ...adminUser, fullName: e.target.value })}
                  className="km-input"
                />
              </div>

              <div className="km-form-group">
                <label>Tên đăng nhập hệ thống:</label>
                <input
                  type="text"
                  value={adminUser.username}
                  onChange={(e) => setAdminUser({ ...adminUser, username: e.target.value })}
                  className="km-input"
                />
              </div>

              <div className="km-form-group">
                <label>Chức danh / Vai trò nghiệp vụ:</label>
                <input
                  type="text"
                  value={adminUser.roleTitle}
                  onChange={(e) => setAdminUser({ ...adminUser, roleTitle: e.target.value })}
                  className="km-input"
                />
              </div>

              <div className="km-form-group">
                <label>Số điện thoại liên hệ:</label>
                <input
                  type="text"
                  value={adminUser.phone}
                  onChange={(e) => setAdminUser({ ...adminUser, phone: e.target.value })}
                  className="km-input"
                />
              </div>

              <div className="km-form-group">
                <label>Email công vụ:</label>
                <input
                  type="email"
                  value={adminUser.email}
                  onChange={(e) => setAdminUser({ ...adminUser, email: e.target.value })}
                  className="km-input"
                />
              </div>

              <button
                type="button"
                className="km-submit-btn"
                onClick={() => {
                  localStorage.setItem('admin_fullname', adminUser.fullName);
                  localStorage.setItem('admin_username', adminUser.username);
                  setShowProfileModal(false);
                  alert('✅ Đã cập nhật thông tin tài khoản thành công!');
                }}
              >
                💾 Cập Nhật Thông Tin Tài Khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 4: ĐỔI MẬT KHẨU BẢO MẬT */}
      {showPasswordModal && (
        <div className="km-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="km-modal-content" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="km-modal-head">
              <h3>🔑 ĐỔI MẬT KHẨU TÀI KHOẢN ADMIN</h3>
              <button className="km-modal-close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>

            <div className="km-modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="km-form-group">
                <label>Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại..."
                  value={passForm.oldPass}
                  onChange={(e) => setPassForm({ ...passForm, oldPass: e.target.value })}
                  className="km-input"
                />
              </div>

              <div className="km-form-group">
                <label>Mật khẩu mới:</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới..."
                  value={passForm.newPass}
                  onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                  className="km-input"
                />
              </div>

              <div className="km-form-group">
                <label>Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới..."
                  value={passForm.confirmPass}
                  onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                  className="km-input"
                />
              </div>

              <button
                type="button"
                className="km-submit-btn"
                onClick={() => {
                  if (!passForm.oldPass || !passForm.newPass) {
                    alert('⚠️ Vui lòng nhập đầy đủ thông tin mật khẩu!');
                    return;
                  }
                  if (passForm.newPass !== passForm.confirmPass) {
                    alert('⚠️ Mật khẩu mới xác nhận không trùng khớp!');
                    return;
                  }
                  setShowPasswordModal(false);
                  setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
                  alert('✅ Đổi mật khẩu thành công!');
                }}
              >
                🔒 Đổi Mật Khẩu Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}