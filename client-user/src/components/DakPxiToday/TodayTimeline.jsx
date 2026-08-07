import {
  Bell,
  ChevronRight,
  Clock,
  CloudRain,
  Heart,
  IdCard,
  ShieldAlert,
  Sparkles,
  Users
} from 'lucide-react';
import './DakPxiToday.css';

const renderTimelineIcon = (icon) => {
  switch (icon) {
    case 'CloudRain':
    case 'weather':
      return <CloudRain size={18} color="#2563eb" />;
    case 'Heart':
    case 'health':
      return <Heart size={18} color="#dc2626" />;
    case 'IdCard':
    case 'notification':
      return <IdCard size={18} color="#d97706" />;
    case 'Users':
    case 'event':
      return <Users size={18} color="#16a34a" />;
    case 'ShieldAlert':
    case 'alert':
      return <ShieldAlert size={18} color="#9333ea" />;
    default:
      return <Bell size={18} color="#1b4332" />;
  }
};

export default function TodayTimeline({ items = [], onItemClick }) {
  // Priority order sorting (priority 1 = highest)
  const sortedItems = [...items]
    .sort((a, b) => (a.priority || 5) - (b.priority || 5))
    .slice(0, 5);

  return (
    <div className="today-timeline-container">
      <div className="ttl-header">
        <div className="ttl-title-badge">
          <Sparkles size={16} color="#d49f53" />
          <span>HÔM NAY CÓ GÌ?</span>
        </div>
        <span className="ttl-subtitle">5 thông tin quan trọng nhất bà con cần lưu ý</span>
      </div>

      <div className="ttl-list">
        {sortedItems.map((item, idx) => (
          <div
            key={item.id || idx}
            className="ttl-item"
            onClick={() => onItemClick && onItemClick(item)}
          >
            <div className="ttl-time-col">
              <Clock size={13} className="ttl-clock-icon" />
              <span>{item.time}</span>
            </div>

            <div className="ttl-icon-col">
              <div className="ttl-icon-circle">
                {renderTimelineIcon(item.icon)}
              </div>
            </div>

            <div className="ttl-content-col">
              <div className="ttl-item-top">
                <h4 className="ttl-item-title">{item.title}</h4>
                {item.status && (
                  <span className={`ttl-status-tag tag-${item.category || 'info'}`}>
                    {item.status}
                  </span>
                )}
              </div>
              <p className="ttl-item-desc">{item.description}</p>
            </div>

            <div className="ttl-action-col">
              <ChevronRight size={16} className="ttl-arrow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
