import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Baucu.css';

export default function Baucu() {
    const navigate = useNavigate();
    const [speaking, setSpeaking] = useState(false);
    const [showInviteBanner, setShowInviteBanner] = useState(true);
    // Sử dụng tệp âm thanh ghi âm riêng (dakpxi-baucu.mp3 và QUY TRINH BAU CU TRUONG THON-PXI.mp3 trong thư mục public/video)
    const [introAudio] = useState(() => new Audio('/video/dakpxi-baucu.mp3'));
    const [mainAudio] = useState(() => new Audio('/video/QUY TRINH BAU CU TRUONG THON-PXI.mp3'));
    const activeAudioRef = useRef(introAudio);

    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    function handleCopyLink() {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error("Failed to copy link:", err);
            });
    }

    const downloadQR = async () => {
        try {
            const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'QR-Tuyen-Truyen-Bieu-Quyet-DakPxi.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download QR code:", err);
        }
    };

    function handleSpeak() {
        if (speaking) {
            activeAudioRef.current.pause();
            setSpeaking(false);
        } else {
            activeAudioRef.current.play()
                .then(() => {
                    setSpeaking(true);
                })
                .catch((err) => {
                    alert("Tính năng đọc giọng nói: Bà con vui lòng đặt tệp âm thanh 'dakpxi-baucu.mp3' và 'QUY TRINH BAU CU TRUONG THON-PXI.mp3' vào thư mục public/video/ để nghe giọng đọc nhé!");
                    console.error("Audio play error:", err);
                });
        }
    }

    // Tự động phát âm thanh khi vào trang & đăng ký các sự kiện
    useEffect(() => {
        const handleIntroEnded = () => {
            activeAudioRef.current = mainAudio;
            mainAudio.play()
                .then(() => {
                    setSpeaking(true);
                })
                .catch((err) => {
                    console.error("Main audio play error:", err);
                    setSpeaking(false);
                });
        };

        const handleMainEnded = () => {
            setSpeaking(false);
            // Reset về âm thanh intro cho lần bấm tiếp theo
            activeAudioRef.current = introAudio;
            introAudio.currentTime = 0;
            mainAudio.currentTime = 0;
        };

        introAudio.addEventListener('ended', handleIntroEnded);
        mainAudio.addEventListener('ended', handleMainEnded);

        // Kích hoạt tự động phát sau khi load xong trang
        const autoPlayTimer = setTimeout(() => {
            introAudio.play()
                .then(() => {
                    setSpeaking(true);
                })
                .catch((err) => {
                    console.log("Trình duyệt chặn phát âm thanh tự động, cần tương tác trước.", err);
                });
        }, 600);

        return () => {
            clearTimeout(autoPlayTimer);
            introAudio.removeEventListener('ended', handleIntroEnded);
            mainAudio.removeEventListener('ended', handleMainEnded);
            introAudio.pause();
            mainAudio.pause();
        };
    }, [introAudio, mainAudio]);

    return (
        <div className="baucu-container">
            {/* Banner mời nghe tuyên truyền biểu quyết */}
            {showInviteBanner && (
                <div className={`baucu-invite-banner ${speaking ? 'playing' : ''}`}>
                    <div className="banner-icon-pulse">📢</div>
                    <div className="banner-text">
                        <strong>Kính mời bà con lắng nghe hướng dẫn biểu quyết!</strong>
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
                <div className="baucu-header-logo">🙋‍♂️</div>
                <h1 className="baucu-main-title">
                    HƯỚNG DẪN QUY TRÌNH BIỂU QUYẾT TẠI HỘI NGHỊ CỬ TRI
                </h1>
                <p className="baucu-subtitle">
                    Các làng trên địa bàn xã Đăk Pxi - Nhiệm kỳ 2025 - 2030
                </p>
                <span className="baucu-gov-badge">ỦY BAN NHÂN DÂN XÃ ĐĂK PXI</span>

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
                <h2 className="baucu-section-title">4 Nguyên Tắc Vàng Khi Biểu Quyết</h2>
                <div className="baucu-principles-grid">
                    <div className="principle-card">
                        <span className="principle-icon">🌍</span>
                        <h3>Phổ thông</h3>
                        <p>Mọi cử tri đại diện hộ gia đình đều có quyền tham gia biểu quyết.</p>
                    </div>
                    <div className="principle-card">
                        <span className="principle-icon">⚖️</span>
                        <h3>Dân chủ</h3>
                        <p>Mỗi cử tri đại diện hộ gia đình có một quyền biểu quyết ngang nhau.</p>
                    </div>
                    <div className="principle-card">
                        <span className="principle-icon">🙋‍♂️</span>
                        <h3>Trực tiếp</h3>
                        <p>Cử tri phải tự mình giơ tay biểu quyết trực tiếp tại hội nghị.</p>
                    </div>
                    <div className="principle-card">
                        <span className="principle-icon">👁️</span>
                        <h3>Công khai</h3>
                        <p>Thực hiện biểu quyết công khai dưới sự chứng kiến của toàn thể hội nghị.</p>
                    </div>
                </div>
            </section>

            {/* Các hình thức bỏ phiếu */}
            <section className="baucu-methods">
                <h2 className="baucu-section-title">Hình Thức Biểu Quyết Hợp Lệ</h2>
                <div className="baucu-methods-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="method-card method-card--featured" style={{ maxWidth: '960px', width: '100%' }}>
                        <div className="method-image-box">
                            <img src="/huong-dan/hinh-thuc-2.png" alt="Biểu Quyết Giơ Tay" className="method-img" />
                            <span className="method-badge success">HỘI NGHỊ THÔN</span>
                        </div>
                        <div className="method-content-wrap">
                            <h3>Biểu Quyết Giơ Tay</h3>
                            <p>
                                Áp dụng trực tiếp tại <strong>Hội nghị cử tri của thôn</strong>. Cử tri thực hiện quyền biểu quyết đồng ý hoặc không đồng ý công khai bằng cách <strong>giơ tay biểu quyết trực tiếp</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hộp liên kết Facebook Tuyên truyền */}
            <section className="baucu-fb-link-section">
                <div className="fb-link-card">
                    <div className="fb-link-icon">📱</div>
                    <div className="fb-link-content">
                        <h3>Xem & Chia Sẻ Tuyên Truyền Biểu Quyết Trên Facebook Xã Đăk Pxi</h3>
                        <p>
                            Thông tin chính thức về hội nghị biểu quyết, nội dung chương trình và quy trình biểu quyết bằng hình thức giơ tay đã được đăng tải trên Trang cộng đồng của xã. Kính mời bà con truy cập Facebook để theo dõi, tương tác và chia sẻ thông tin đến mọi người dân trong thôn!
                        </p>
                        <a
                            href="https://www.facebook.com/share/p/1DwY7F2kzy/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fb-link-btn"
                        >
                            🔵 Xem bài viết trên Facebook UBND xã Đăk Pxi
                        </a>
                    </div>
                </div>
            </section>

            {/* Quy trình 4 bước với 4 hình ảnh minh họa */}
            <section className="baucu-steps">
                <h2 className="baucu-section-title">Quy Trình 4 Bước Biểu Quyết Đúng Quy Định</h2>

                <div className="baucu-steps-list">
                    {/* Bước 1 */}
                    <div className="baucu-step-row step-row-1">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 1</span>
                            <h3>Ổn định tổ chức &amp; Kiểm tra tư cách cử tri</h3>
                            <p>
                                Bà con đến địa điểm tổ chức hội nghị tại nhà rông hoặc nhà văn hóa thôn mình đúng giờ để đăng ký tham dự, ổn định tổ chức và kiểm tra tư cách cử tri đại diện cho hộ gia đình tham gia biểu quyết.
                            </p>
                            <div className="step-alert">
                                💡 Lưu ý: Mang theo căn cước công dân hoặc giấy mời của Ủy ban nhân dân xã/thôn để đối chiếu.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-1.jpg"
                                alt="Niêm yết danh sách cử tri và phát thẻ"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=1'; }}
                            />
                            <span className="image-caption">Hình 1: Ban tổ chức đối chiếu danh sách cử tri tham gia hội nghị</span>
                        </div>
                    </div>

                    {/* Bước 2 */}
                    <div className="baucu-step-row reverse step-row-2">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 2</span>
                            <h3>Lắng nghe báo cáo &amp; Đề cử nhân sự</h3>
                            <p>
                                Bà con lắng nghe kỹ báo cáo kết quả công tác nhiệm kỳ vừa qua của trưởng thôn cũ, đồng thời xem xét danh sách nhân sự đề cử trưởng thôn mới do chi bộ hoặc ban công tác mặt trận thôn giới thiệu trước hội nghị.
                            </p>
                            <div className="step-alert">
                                💡 Lưu ý: Tập trung thảo luận dân chủ, thẳng thắn về năng lực và đạo đức của người được giới thiệu.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-2.png"
                                alt="Tìm hiểu tiểu sử ứng cử viên"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=2'; }}
                            />
                            <span className="image-caption">Hình 2: Cử tri thảo luận và đề xuất ý kiến về nhân sự trưởng thôn mới</span>
                        </div>
                    </div>

                    {/* Bước 3 */}
                    <div className="baucu-step-row step-row-3">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 3</span>
                            <h3>Thảo luận công khai &amp; Thống nhất phương án</h3>
                            <p>
                                Toàn thể hội nghị tiến hành thảo luận công khai các nội dung đề cử. Bà con có thể tự ứng cử hoặc đề cử thêm nhân sự khác có đủ tài đức ngoài danh sách dự kiến để đưa ra thống nhất trước khi tiến hành biểu quyết.
                            </p>
                            <div className="step-alert">
                                💡 Lưu ý: Phát huy tinh thần dân chủ, đoàn kết để chọn ra người có tài có đức gánh vác việc chung.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-3.png"
                                alt="Cử tri nhận phiếu bầu"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=3'; }}
                            />
                            <span className="image-caption">Hình 3: Cử tri thảo luận thống nhất danh sách nhân sự trước khi biểu quyết</span>
                        </div>
                    </div>

                    {/* Bước 4 */}
                    <div className="baucu-step-row reverse step-row-4">
                        <div className="baucu-step-info">
                            <span className="step-badge">BƯỚC 4</span>
                            <h3>Tiến hành biểu quyết bằng giơ tay</h3>
                            <p>
                                Khi chủ trì hội nghị lấy ý kiến biểu quyết, bà con thực hiện quyền biểu quyết bằng cách giơ tay (Đồng ý, Không đồng ý hoặc có ý kiến khác). Ban thư ký hội nghị sẽ tiến hành quan sát, kiểm đếm và ghi biên bản chính xác kết quả.
                            </p>
                            <div className="step-alert warning">
                                ⚠️ Cực kỳ quan trọng: Mỗi hộ gia đình chỉ được biểu quyết đại diện một lần, tuyệt đối không biểu quyết hộ cho hộ gia đình khác.
                            </div>
                        </div>
                        <div className="baucu-step-image">
                            <img
                                src="/huong-dan/baucu-4.jpg"
                                alt="Bỏ phiếu vào hòm phiếu"
                                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=4'; }}
                            />
                            <span className="image-caption">Hình 4: Cử tri biểu quyết thống nhất nhân sự trưởng thôn bằng hình thức giơ tay</span>
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
                            <li>Tuyệt đối không giơ tay biểu quyết hộ, biểu quyết thay cho hộ gia đình khác dưới mọi hình thức.</li>
                            <li>Không gây mất trật tự, tranh cãi hoặc cản trở tiến trình tổ chức hội nghị biểu quyết.</li>
                            <li>Nghiêm cấm mọi hành vi gian lận hoặc can thiệp sai lệch vào quá trình kiểm đếm số lượng giơ tay của thư ký hội nghị.</li>
                        </ul>
                    </div>
                    <div className="notice-box info">
                        <h4>🔵 Thời gian và Địa điểm:</h4>
                        <ul>
                            <li><strong>Thời gian tổ chức hội nghị:</strong> Bắt đầu từ lúc 07 giờ 30 phút, ngày 19 tháng 7 năm 2026.</li>
                            <li><strong>Địa điểm tổ chức:</strong> Tại Nhà rông hoặc Nhà văn hóa các thôn trên địa bàn xã Đăk Pxi.</li>
                            <li>Kính mời toàn thể cử tri đại diện cho các hộ gia đình sắp xếp công việc tham dự đầy đủ, đúng giờ để bảo đảm quyền dân chủ của mình.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Chia sẻ & Tạo mã QR */}
            <section className="baucu-share-section">
                <h2 className="baucu-section-title">Chia Sẻ & Tuyên Truyền Biểu Quyết</h2>
                <div className="share-container-card">
                    <div className="share-info-col">
                        <h3>📢 Gửi hướng dẫn đến người thân &amp; hàng xóm</h3>
                        <p>
                            Bà con hãy chung tay tuyên truyền quy trình biểu quyết bằng cách chia sẻ đường liên kết hướng dẫn này đến các nhóm Zalo, Facebook của gia đình, dòng họ hoặc làng mình để mọi người cùng nắm vững quy trình và chủ động tham gia biểu quyết đúng quy định pháp luật.
                        </p>
                        <div className="share-actions-buttons">
                            <button
                                className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopyLink}
                            >
                                {copied ? '✅ Đã sao chép liên kết!' : '🔗 Sao chép liên kết chia sẻ'}
                            </button>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-btn facebook-btn"
                            >
                                👥 Chia sẻ lên Facebook
                            </a>
                            <a
                                href={`https://sp.zalo.me/share_to_zalo?url=${encodeURIComponent(currentUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-btn zalo-btn"
                            >
                                💬 Chia sẻ qua Zalo
                            </a>
                        </div>
                    </div>

                    <div className="share-qr-col">
                        <h3>📲 Quét mã QR truy cập nhanh</h3>
                        <p className="qr-sub">Dùng camera điện thoại hoặc Zalo quét mã dưới đây để xem hướng dẫn trực tiếp:</p>
                        <div className="qr-code-box">
                            {currentUrl && (
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                                    alt="Mã QR Biểu quyết"
                                    className="qr-code-img"
                                />
                            )}
                        </div>
                        <button className="download-qr-btn" onClick={downloadQR}>
                            📥 Tải ảnh mã QR về điện thoại / máy tính
                        </button>
                    </div>
                </div>
            </section>

            {/* Cổng thông tin kiểm chứng chính thức */}
            <section className="baucu-source-verification">
                <div className="verification-card">
                    <div className="verification-header-info">
                        <span className="verification-badge-icon">🛡️</span>
                        <h3>Xác Thực Thông Tin Chính Thống</h3>
                    </div>
                    <p className="verification-desc">
                        Đây là thông tin tuyên truyền hướng dẫn quy trình biểu quyết tại hội nghị cử tri chính thức, đúng sự thật của Ủy ban nhân dân xã Đăk Pxi. Bà con có thể nhấn vào liên kết chính thức dưới đây để kiểm chứng và xem chi tiết bài đăng gốc trên Trang thông tin điện tử xã Đăk Pxi, tỉnh Quảng Ngãi:
                    </p>
                    <a
                        href="https://dakpxi.quangngai.gov.vn/gioi-thieu/tin-chi-dao-dieu-hanh/dak-pxi-san-sang-cho-cuoc-bau-cu-truong-thon-nhiem-ky-2025-20302.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="verification-link-btn"
                    >
                        🌐 Xem bài viết gốc tại dakpxi.quangngai.gov.vn
                    </a>
                </div>
            </section>

            {/* Khẩu hiệu tuyên truyền chân trang */}
            <footer className="baucu-footer">
                <p className="slogan">"TÍCH CỰC THAM GIA HỘI NGHỊ CỬ TRI – PHÁT HUY DÂN CHỦ TRONG BIỂU QUYẾT TRƯỞNG THÔN!"</p>
            </footer>
        </div>
    );
}
