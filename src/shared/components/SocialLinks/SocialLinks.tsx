import React from 'react';
import { FaGithub, FaYoutube, FaDiscord, FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SOCIAL_LINKS } from './constants';
import './SocialLinks.css';

export const SocialLinks: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FaXTwitter':
        return <FaXTwitter size={24} />;
      case 'FaGithub':
        return <FaGithub size={24} />;
      case 'FaYoutube':
        return <FaYoutube size={24} />;
      case 'FaDiscord':
        return <FaDiscord size={24} />;
      case 'FaTelegram':
        return <FaTelegram size={24} />;
      default:
        return null;
    }
  };

  return (
    <div className="social-links">
      {SOCIAL_LINKS.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          {getIcon(link.icon)}
        </a>
      ))}
    </div>
  );
};
