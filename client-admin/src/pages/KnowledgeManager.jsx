import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KnowledgeManager.css';

const KnowledgeManager = () => {
    const [data, setData] = useState({ title: '', content: '', category: '' });
    const [list, setList] = useState([]);

    // Hàm lấy danh sách kiến thức
    const fetchKnowledge = async () => {
        try {
            const res = await axios.get('https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/knowledge');
            setList(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchKnowledge(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/knowledge', data);
        alert("Đã cập nhật!");
        setData({ title: '', content: '', category: '' });
        fetchKnowledge(); // Tải lại danh sách
    };

    return (
        <div className="admin-container">
            <h2>Quản lý Tri thức AI</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Tiêu đề" value={data.title} onChange={(e) => setData({...data, title: e.target.value})} />
                <input placeholder="Danh mục" value={data.category} onChange={(e) => setData({...data, category: e.target.value})} />
                <textarea placeholder="Nội dung chi tiết..." value={data.content} onChange={(e) => setData({...data, content: e.target.value})} />
                <button type="submit">Lưu kiến thức</button>
            </form>

            <div className="knowledge-list">
                <h3>Danh sách đã nhập:</h3>
                {list.map((item) => (
                    <div key={item._id} className="knowledge-item">
                        <strong>{item.title}</strong> - <small>{item.category}</small>
                        <p>{item.content.substring(0, 100)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default KnowledgeManager;