import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-info">
                    <h3 className="footer-org-name">UBND XÃ ĐĂK PXI</h3>
                    <p>Trụ sở: Thôn Pa cheng, Xã Đăk Pxi, Tỉnh Quảng Ngãi.</p>
                    <p>
                        Điện thoại: <strong>0339.310.915</strong>{' '}
                        &nbsp;–&nbsp; Email: <strong>ubnddakpxi@kontum.gov.vn</strong>
                    </p>
                    <p>
                        Đơn vị quản lý nội dung: <strong>Phòng Văn hóa – Xã hội.</strong>
                    </p>
                    <p>
                        Cổng thông tin điện tử xã Đăk Pxi:{' '}

                        <a
                            href="https://dakpxi.gov.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-link"
                        >
                            dakpxi.quangngai.gov.vn
                        </a>
                    </p>
                </div>

                <div className="footer-badge">
                    <img
                        src="https://webhcm.mediacdn.vn/thumb_w/640/webhcm/24/6/6/nca-1686043842658.png"
                        alt="Chứng nhận tín nhiệm mạng"
                        className="footer-badge-img"
                    />
                </div>
            </div>

            <div className="footer-bottom">
                <span className="footer-bottom-left">
                    TUYÊN TRUYỀN & HỖ TRỢ DỊCH VỤ CÔNG
                </span>
            </div>

            {showTop && (
                <button
                    className="footer-scroll-top"
                    onClick={scrollToTop}
                    title="Lên đầu trang"
                >
                    <ChevronUp size={22} />
                </button>
            )}
        </footer>
    );
}