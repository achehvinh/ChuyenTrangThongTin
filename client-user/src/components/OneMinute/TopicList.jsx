import React from 'react';
import { 
  Plant, 
  ShieldCheck, 
  Heart, 
  UsersThree, 
  BookOpen, 
  Sparkle, 
  ArrowRight, 
  CaretRight 
} from '../icons';

const renderTopicIcon = (iconName, color) => {
  switch (iconName) {
    case 'Plant':
      return <Plant size={24} weight="duotone" color={color} />;
    case 'ShieldCheck':
      return <ShieldCheck size={24} weight="duotone" color={color} />;
    case 'Heart':
      return <Heart size={24} weight="duotone" color={color} />;
    case 'UsersThree':
      return <UsersThree size={24} weight="duotone" color={color} />;
    case 'BookOpen':
      return <BookOpen size={24} weight="duotone" color={color} />;
    default:
      return <Sparkle size={24} weight="duotone" color={color} />;
  }
};

export default function TopicList({ topics, activeTopic, onSelectTopic }) {
  return (
    <div className="om-topic-panel-card">
      
      <div className="om-topic-panel-header">
        <h3 className="om-topic-panel-title">
          CHỦ ĐỀ KHÁC
        </h3>
        <p className="om-topic-panel-sub">Khám phá kiến thức theo từng nhóm</p>
      </div>

      <div className="om-topic-list">
        {topics.map((topic) => {
          const isActive = activeTopic === topic.id;
          return (
            <div
              key={topic.id}
              className={`om-topic-item-card ${isActive ? 'active-topic' : ''}`}
              style={{
                '--topic-bg': topic.bg || '#f8fafc',
                '--topic-color': topic.color || '#1b4332'
              }}
              onClick={() => onSelectTopic(topic.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectTopic(topic.id)}
              aria-label={`Chọn chủ đề ${topic.name}`}
            >
              <div className="om-topic-icon-box" style={{ background: topic.bg }}>
                {renderTopicIcon(topic.icon, topic.color)}
              </div>

              <div className="om-topic-text-col">
                <div className="om-topic-name" style={{ color: isActive ? '#1b4332' : topic.color }}>
                  {topic.name}
                </div>
                {topic.desc && (
                  <div className="om-topic-desc">{topic.desc}</div>
                )}
              </div>

              <div className="om-topic-arrow">
                <ArrowRight size={18} color={topic.color} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
