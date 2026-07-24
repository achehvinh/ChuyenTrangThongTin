import "./GoogleMap.css";

export default function GoogleMap({
  src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.7247854611!2d107.954!3d14.632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM3JzU1LjIiTiAxMDfCsDU3JzE0LjQiRQ!5e0!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s",
  title = "Bản đồ vị trí UBND xã Đăk Pxi"
}) {
  return (
    <section className="google-map-wrapper">
      <div className="google-map-header">
        <h3>📍 Bản đồ chỉ đường tới Trụ sở UBND xã Đăk Pxi</h3>
      </div>
      <div className="google-map-frame-container">
        <iframe
          title={title}
          src={src}
          width="100%"
          height="360"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
