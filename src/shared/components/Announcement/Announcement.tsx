import React, { useEffect, useRef, useState } from 'react';
import './Announcement.css';

interface AnnouncementProps {
  message: string;
  showIcon?: boolean;
}

const Announcement: React.FC<AnnouncementProps> = ({ message, showIcon = true }) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (pRef.current) {
      const isOverflowing = pRef.current.offsetWidth > window.innerWidth;
      setShouldScroll(isOverflowing);
    }
  }, [message]);

  return (
    <div className="announcement">
      <p 
        ref={pRef}
        style={{ animation: shouldScroll ? undefined : 'none' }}
      >
        {showIcon ? '🚧 ' : ''}{message}{showIcon ? ' 🚧' : ''}
      </p>
    </div>
  );
};

export default Announcement;
