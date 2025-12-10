// Core data types for the link tree application

export interface Link {
  id: string;
  title: string;
  description: string;
  url: string;
  gradient: string;
  isActive: boolean;
  order: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  order: number;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  followers: number;
  videos: number;
  views: number;
  updatedAt: Date;
}

export interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{
    linkId: string;
    title: string;
    clicks: number;
  }>;
  clicksByDate: Array<{
    date: string;
    clicks: number;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}
