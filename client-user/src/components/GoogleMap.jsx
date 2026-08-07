import "./GoogleMap.css";

export default function GoogleMap({
  src = "https://maps.google.com/maps?q=UBND%20x%C3%A3%20%C4%90%C4%83k%20Pxi%2C%20%C4%90%C4%83k%20H%C3%A0%2C%20Kon%20Tum&t=m&z=16&ie=UTF8&iwloc=&output=embed",
  title = "Bản đồ vị trí cơ quan hành chính"
}) {
  return (
    <section className="google-map-wrapper">
      <header className="google-map-header">
        <h3>📍 Bản đồ vị trí & chỉ đường trụ sở</h3>
      </header>
      <figure className="google-map-frame-container" style={{ margin: 0 }}>
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
      </figure>
    </section>
  );
}
