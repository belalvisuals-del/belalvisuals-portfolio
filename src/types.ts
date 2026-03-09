export type Category = 'Post Design' | 'Facebook Cover' | 'Print Design' | 'Ads Design' | 'Other';

export interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  category?: Category;
  url: string; // Google Drive direct link or YouTube/Vimeo link
  thumbnail?: string; // Required for videos
  createdAt: number;
}

export interface BlogPost {
  id: string;
  image: string;
  content: string;
  createdAt: number;
}

export interface SiteSettings {
  heroImage: string;
  cvLink: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
}
