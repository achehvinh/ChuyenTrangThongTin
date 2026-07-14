import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Baucu.css';

export default function Baucu() {
    const navigate = useNavigate();
    const [speaking, setSpeaking] = useState(false);
    const [showInviteBanner, setShowInviteBanner] = useState(true);
    // Sử dụng tệp âm thanh ghi âm riêng (giong-doc-bau-cu.mp3 trong thư mục public/video)
    const [audio] = useState(() => new Audio('/video/giong-doc-bau-cu.mp3'));

    function handleSpeak() {
        if (speaking) {
            audio.pause();
            setSpeaking(false);
        } else {
            audio.play()
                .then(() => {
                    setSpeaking(true);
                })
                .catch((err) => {
                    alert("Tính năng đọc giọng nói: Bà con vui lòng đặt tệp âm thanh 'giong-doc-bau-cu.mp3' vào thư mục public/video/ để nghe giọng đọc nhé!");
                    console.error("Audio play error:", err);
                });
        }
    }

    // Tự động phát âm thanh khi vào trang & đăng ký các sự kiện
    useEffect(() => {
        const handleEnded = () => setSpeaking(false);
        audio.addEventListener('ended', handleEnded);

        // Kích hoạt tự động phát sau khi load xong trang
        const autoPlayTimer = setTimeout(() => {
            audio.play()
                .then(() => {
                    setSpeaking(true);
                })
                .catch((err) => {
                    console.log("Trình duyệt chặn phát âm thanh tự động, cần tương tác trước.", err);
                });
        }, 600);

        return () => {
            clearTimeout(autoPlayTimer);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, [audio]);

    return (
        <div className="baucu-container">
            {/* Banner mời nghe tuyên truyền bầu cử */}
            {showInviteBanner && (
                <div className={`baucu-invite-banner ${speaking ? 'playing' : ''}`}>
                    <div className="banner-icon-pulse">📢</div>
                    <div className="banner-text">
                        <strong>Kính mời bà con lắng nghe tuyên truyền bầu cử!</strong>
                        <p>{speaking ? 'Hệ thống đang tự động phát thanh hướng dẫn...' : 'Bấm nút "Nghe hướng dẫn" bên dưới nếu loa chưa phát.'}</p>
                    </div>
                    {speaking && (
                        <div className="sound-wave">
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                            <span className="wave-bar"></span>
                        </div>
                    )}
                    <button className="banner-close-btn" onClick={() => setShowInviteBanner(false)}>✕</button>
                </div>
            )}

            {/* Nút quay lại */}
            <button className="baucu-back-btn" onClick={() => navigate('/chuyen-muc')}>
                ← Quay lại Chuyên mục
            </button>

            {/* Header Quốc kỳ & Huy hiệu */}
            <header className="baucu-header">
                <div className="baucu-header-logo">🗳️</div>
                <h1 className="baucu-main-title">
                    HƯỚNG DẪN QUY TRÌNH BẦU CỬ
                </h1>
                <p className="baucu-subtitle">
                    Đại biểu Quốc hội khóa XV và Đại biểu Hội đồng nhân dân các cấp
                </p>
                <span className="baucu-gov-badge">ỦY BAN BẦU CỬ XÃ ĐẮK PXI</span>

                {/* Nút nghe đọc giọng nói */}
                <button
                    onClick={handleSpeak}
                    className={`baucu-speak-btn ${speaking ? 'speaking' : ''}`}
                >
                    {speaking ? '⏹ Dừng đọc hướng dẫn' : '🔊 Nghe hướng dẫn bằng giọng nói'}
                </button>
            </header>

            {/* Khung 4 nguyên tắc vàng */}
            <section className="baucu-principles">
                <h2 className="baucu-section-title">4 Nguyên Tắc Vàng Khi Bỏ Phiếu</h2>
                <div className="baucu-principles-grid">
                    <div className="principle-card">
                        <span className="principle-icon">🌍</span>
                        <h3>Phổ thông</h3>
                        <p>Mọi công dân từ đủ 18 tuổi đều có quyền bầu cử.</p>
                    </div>
                    <div className="principle-card">
                        <span className="principle-icon">⚖️</span>
                        <h3>Bình đẳng</h3>
                        <p>Mỗi cử tri có một lá phiếu và giá trị như nhau.</p>
                    </div>
                    <div className="principle-card">
                        <span className="principle-icon">🤝</span>
                        <h3>Trực tiếp</h3>
                        <p>Cử tri phải tự tay bỏ phiếu, không nhờ người khác.</p>
                    </div>
                    <div className="principle-card">
                        <span className="principle-icon">🔒</span>
                        <h3>Bỏ phiếu kín</h3>
                        <p>Bảo mật tuyệt đối lựa chọn của cử tri trong buồng kín.</p>
                    </div>
                </div>
            </section>

            {/* Quy trình 4 bước với 4 hình ảnh minh họa */}
            <section className="baucu-steps">
                <h2 className="baucu-section-title">Quy Trình 4 Bước Bỏ Phiếu Đúng Quy Định</h2>

                <div className="baucu-steps-list">
                    {/* Bước 1 */}
                    <div className="baucu-step-row">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 1</span>
                            <h3>Nhận thẻ cử tri &amp; Kiểm tra thông tin</h3>
                            <p>
                                Bà con đến địa điểm niêm yết danh sách cử tri tại nhà rông hoặc nhà văn hóa thôn mình để kiểm tra kỹ họ tên, ngày sinh. Sau đó nhận Thẻ cử tri từ thành viên Tổ bầu cử cấp phát.
                            </p>
                            <div className="step-alert">
                                💡 Lưu ý: Mang theo căn cước công dân khi đi nhận thẻ và đối chiếu.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-1.jpg"
                                alt="Niêm yết danh sách cử tri và phát thẻ"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=1'; }}
                            />
                            <span className="image-caption">Hình 1: Danh sách cử tri được niêm yết công khai tại địa phương</span>
                        </div>
                    </div>

                    {/* Bước 2 */}
                    <div className="baucu-step-row reverse">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 2</span>
                            <h3>Tìm hiểu về các ứng cử viên</h3>
                            <p>
                                Bà con dành thời gian đọc kỹ bảng tiểu sử tóm tắt, quá trình học tập, công tác và chương trình hành động của các ứng cử viên được dán tại khu vực bỏ phiếu để lựa chọn người đại biểu xứng đáng nhất.
                            </p>
                            <div className="step-alert">
                                💡 Lưu ý: Hãy thảo luận và xem kỹ để chọn ra người có đức có tài.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-2.png"
                                alt="Tìm hiểu tiểu sử ứng cử viên"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=2'; }}
                            />
                            <span className="image-caption">Hình 2: Cử tri tìm hiểu tiểu sử tóm tắt của các ứng cử viên</span>
                        </div>
                    </div>

                    {/* Bước 3 */}
                    <div className="baucu-step-row">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 3</span>
                            <h3>Xuất trình thẻ &amp; Nhận phiếu bầu</h3>
                            <p>
                                Vào ngày chủ nhật bầu cử, bà con đến đúng phòng bỏ phiếu quy định của thôn. Xuất trình Thẻ cử tri cho ban tiếp nhận đóng dấu xác nhận và nhận phiếu bầu cử tương ứng cho các cấp.
                            </p>
                            <div className="step-alert">
                                💡 Lưu ý: Giữ gìn phiếu phẳng phiu, không làm rách hoặc bẩn phiếu.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-3.png"
                                alt="Cử tri nhận phiếu bầu"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=3'; }}
                            />
                            <span className="image-caption">Hình 3: Xuất trình thẻ cử tri để nhận phiếu bỏ bầu cử</span>
                        </div>
                    </div>

                    {/* Bước 4 */}
                    <div className="baucu-step-row reverse">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 4</span>
                            <h3>Gạch phiếu &amp; Tự tay bỏ phiếu</h3>
                            <p>
                                Bà con vào phòng gạch phiếu độc lập. Dùng bút gạch ngang qua họ tên những người không tín nhiệm (để lại những người tín nhiệm). Sau đó đi ra khu vực hòm phiếu và tự tay bỏ lá phiếu của mình vào hòm phiếu.
                            </p>
                            <div className="step-alert warning">
                                ⚠️ Cực kỳ quan trọng: Tuyệt đối không bỏ phiếu hộ hoặc nhờ người khác bỏ phiếu thay mình.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-4.jpg"
                                alt="Bỏ phiếu vào hòm phiếu"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=4'; }}
                            />
                            <span className="image-caption">Hình 4: Cử tri tự tay bỏ phiếu vào hòm phiếu niêm phong</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cảnh báo và Hướng dẫn cụ thể */}
            <section className="baucu-notices">
                <h2 className="baucu-section-title">Những Điều Cần Ghi Nhớ</h2>
                <div className="notices-content">
                    <div className="notice-box danger">
                        <h4>🔴 Các hành vi bị CẤM nghiêm ngặt:</h4>
                        <ul>
                            <li>Không bỏ phiếu hộ, bỏ phiếu thay người khác dưới mọi hình thức.</li>
                            <li>Không mang điện thoại, máy ảnh vào trong buồng gạch phiếu để chụp ảnh phiếu bầu.</li>
                            <li>Không được ký hoặc ghi bất kỳ ký hiệu lạ nào khác ngoài việc gạch tên người không tín nhiệm lên phiếu bầu.</li>
                        </ul>
                    </div>
                    <div className="notice-box info">
                        <h4>🔵 Thời gian và Địa điểm:</h4>
                        <ul>
                            <li><strong>Thời gian bỏ phiếu:</strong> Từ 07h00 sáng đến 19h00 tối ngày Chủ Nhật bầu cử.</li>
                            <li><strong>Địa điểm:</strong> Tại phòng bỏ phiếu của Tổ bầu cử đặt ở Nhà rông/Nhà văn hóa các thôn thuộc xã Đăk Pxi.</li>
                            <li>Trường hợp bà con già yếu, khuyết tật không tự đi bỏ phiếu được, Tổ bầu cử sẽ mang hòm phiếu phụ đến tận nhà hỗ trợ.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Khẩu hiệu tuyên truyền chân trang */}
            <footer className="baucu-footer">
                <p className="slogan">"BẦU CỬ ĐẠI BIỂU QUỐC HỘI VÀ HĐND CÁC CẤP LÀ QUYỀN LỢI VÀ NGHĨA VỤ CỦA MỖI CÔNG DÂN!"</p>
                <p className="copyright">© 2026 Trang thông tin điện tử xã Đăk Pxi - Phát triển bởi Ban tuyên giáo xã</p>
            </footer>
        </div>
    );
}
