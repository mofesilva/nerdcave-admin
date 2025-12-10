// Mock data store - In production, this would be replaced with a real database
import { Link, SocialLink, Profile, Analytics } from '@/types';

// Initial data
let links: Link[] = [
  {
    id: '1',
    title: '🎮 Gaming Content',
    description: 'Check out my latest gaming videos and streams',
    url: 'https://youtube.com/@nerdcave',
    gradient: 'from-red-500 to-pink-500',
    isActive: true,
    order: 1,
    clicks: 1250,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: '💻 Tech Blog',
    description: 'Articles about coding, tech reviews, and tutorials',
    url: 'https://blog.nerdcave.com',
    gradient: 'from-blue-500 to-cyan-500',
    isActive: true,
    order: 2,
    clicks: 890,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: '🎙️ Podcast',
    description: 'Weekly discussions on gaming and tech',
    url: 'https://podcast.nerdcave.com',
    gradient: 'from-purple-500 to-indigo-500',
    isActive: true,
    order: 3,
    clicks: 645,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: '🛍️ Merch Store',
    description: 'Official Nerdcave merchandise',
    url: 'https://store.nerdcave.com',
    gradient: 'from-green-500 to-emerald-500',
    isActive: true,
    order: 4,
    clicks: 523,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: '📧 Newsletter',
    description: 'Subscribe for weekly updates and exclusive content',
    url: 'https://newsletter.nerdcave.com',
    gradient: 'from-orange-500 to-yellow-500',
    isActive: true,
    order: 5,
    clicks: 412,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: '💬 Discord Community',
    description: 'Join our amazing community of nerds',
    url: 'https://discord.gg/nerdcave',
    gradient: 'from-violet-500 to-purple-500',
    isActive: true,
    order: 6,
    clicks: 1580,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

let socialLinks: SocialLink[] = [
  { id: '1', platform: 'Twitter', url: 'https://twitter.com/nerdcave', isActive: true, order: 1 },
  { id: '2', platform: 'YouTube', url: 'https://youtube.com/@nerdcave', isActive: true, order: 2 },
  { id: '3', platform: 'GitHub', url: 'https://github.com/nerdcave', isActive: true, order: 3 },
  { id: '4', platform: 'Instagram', url: 'https://instagram.com/nerdcave', isActive: true, order: 4 },
  { id: '5', platform: 'Twitch', url: 'https://twitch.tv/nerdcave', isActive: true, order: 5 },
  { id: '6', platform: 'Discord', url: 'https://discord.gg/nerdcave', isActive: true, order: 6 },
];

let profile: Profile = {
  id: '1',
  name: 'Nerdcave',
  title: 'Gaming • Tech • Content Creator',
  bio: 'Welcome to my corner of the internet! 🚀 I create content about gaming, technology, and everything in between. Join me on this adventure!',
  followers: 100000,
  videos: 500,
  views: 1000000,
  updatedAt: new Date(),
};

// Data access functions
export const dataStore = {
  // Links
  getLinks: async (): Promise<Link[]> => {
    return [...links].sort((a, b) => a.order - b.order);
  },

  getLink: async (id: string): Promise<Link | undefined> => {
    return links.find(link => link.id === id);
  },

  createLink: async (link: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<Link> => {
    const newLink: Link = {
      ...link,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    links.push(newLink);
    return newLink;
  },

  updateLink: async (id: string, updates: Partial<Link>): Promise<Link | undefined> => {
    const index = links.findIndex(link => link.id === id);
    if (index === -1) return undefined;
    links[index] = { ...links[index], ...updates, updatedAt: new Date() };
    return links[index];
  },

  deleteLink: async (id: string): Promise<boolean> => {
    const index = links.findIndex(link => link.id === id);
    if (index === -1) return false;
    links.splice(index, 1);
    return true;
  },

  // Social Links
  getSocialLinks: async (): Promise<SocialLink[]> => {
    return [...socialLinks].sort((a, b) => a.order - b.order);
  },

  updateSocialLink: async (id: string, updates: Partial<SocialLink>): Promise<SocialLink | undefined> => {
    const index = socialLinks.findIndex(link => link.id === id);
    if (index === -1) return undefined;
    socialLinks[index] = { ...socialLinks[index], ...updates };
    return socialLinks[index];
  },

  // Profile
  getProfile: async (): Promise<Profile> => {
    return { ...profile };
  },

  updateProfile: async (updates: Partial<Profile>): Promise<Profile> => {
    profile = { ...profile, ...updates, updatedAt: new Date() };
    return { ...profile };
  },

  // Analytics
  getAnalytics: async (): Promise<Analytics> => {
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const topLinks = [...links]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(link => ({
        linkId: link.id,
        title: link.title,
        clicks: link.clicks,
      }));

    // Generate mock data for the last 7 days
    const clicksByDate = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        clicks: Math.floor(Math.random() * 500) + 200,
      };
    });

    return {
      totalClicks,
      uniqueVisitors: Math.floor(totalClicks * 0.7),
      topLinks,
      clicksByDate,
      deviceStats: {
        mobile: 60,
        desktop: 30,
        tablet: 10,
      },
    };
  },
};
