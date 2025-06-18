interface SocialLink {
  url: string;
  icon: 'FaXTwitter' | 'FaGithub' | 'FaYoutube' | 'FaDiscord' | 'FaTelegram';
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    url: 'https://x.com/RandAOToken',
    icon: 'FaXTwitter'
  },
  {
    url: 'https://github.com/RandAOLabs',
    icon: 'FaGithub'
  },
  {
    url: 'https://www.youtube.com/channel/UCNtMrxVkQqCx_Dhj2SN_4BQ',
    icon: 'FaYoutube'
  },
  {
    url: 'https://discord.gg/arc-ao',
    icon: 'FaDiscord'
  },
  {
    url: 'https://t.me/ArcAOGames',
    icon: 'FaTelegram'
  }
];
