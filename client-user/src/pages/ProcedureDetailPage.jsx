import { Link, useParams } from "react-router-dom";

export default function ProcedureDetailPage() {
  const { slug } = useParams();

  return (
    <div className="tthc-detail-page">

      <div className="tthc-gov-header">
        <div className="tthc-gov-top">
          ỦY BAN NHÂN DÂN XÃ ĐĂK PXI
        </div>

        <div className="tthc-gov-title">
          HỆ THỐNG GIẢI QUYẾT THỦ TỤC HÀNH CHÍNH
        </div>
      </div>

      <div className="tthc-container">

        <div className="tthc-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span> › </span>
          <Link to="/thu-tuc-hanh-chinh">
            Danh sách thủ tục hành chính
          </Link>
          <span> › </span>
          <span>{slug}</span>
        </div>

        <h1>Chi tiết thủ tục</h1>

      </div>
    </div>
  );
}