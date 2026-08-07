import {
  AlertTriangle,
  Bell,
  Bus,
  Calendar,
  CloudRain,
  Coffee,
  Info,
  ShieldCheck
} from 'lucide-react';
import React from 'react';
import './DakPxiToday.css';

const renderCardIcon = (icon, category) => {
  if (React.isValidElement(icon)) return icon;

  const key = icon || category;
  switch (key) {
    case 'weather':
    case 'CloudRain':
    case 'SunCloud':
      return <CloudRain size={22} color="#0284c7" />;
    case 'alert':
    case 'AlertTriangle':
    case 'ShieldAlert':
      return <AlertTriangle size={22} color="#dc2626" />;
    case 'health':
    case 'ShieldCheck':
    case 'HeartPulse':
      return <ShieldCheck size={22} color="#16a34a" />;
    case 'coffee':
    case 'agriculture':
    case 'Sprout':
      return <Coffee size={22} color="#b45309" />;
    case 'bus':
    case 'transit':
      return <Bus size={22} color="#2563eb" />;
    case 'event':
    case 'Calendar':
      return <Calendar size={22} color="#059669" />;
    case 'notification':
    case 'Bell':
      return <Bell size={22} color="#d97706" />;
    default:
      return <Info size={22} color="#1b4332" />;
  }
};

const getIconBgColor = (icon, category) => {
  const key = icon || category;
  switch (key) {
    case 'weather':
    case 'CloudRain':
      return '#e0f2fe';
    case 'alert':
    case 'AlertTriangle':
      return '#fee2e2';
    case 'health':
    case 'ShieldCheck':
      return '#dcfce7';
    case 'coffee':
    case 'agriculture':
      return '#fef3c7';
    case 'bus':
      return '#eff6ff';
    default:
      return '#f1f5f9';
  }
};

export default function TodayInfoCard({
  icon,
  category,
  title,
  value,
  description,
  status,
  onClick
}) {
  return (
    <div
      className={`dkt-horizontal-item ${status === 'urgent' ? 'item-urgent' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
    >
      <div
        className="dkt-item-icon-box"
        style={{ background: getIconBgColor(icon, category) }}
      >
        {renderCardIcon(icon, category)}
      </div>

      <div className="dkt-item-content">
        <div className="dkt-item-label">{title}</div>
        <div className="dkt-item-value">{value}</div>
        <div className="dkt-item-desc">{description}</div>
      </div>
    </div>
  );
}
