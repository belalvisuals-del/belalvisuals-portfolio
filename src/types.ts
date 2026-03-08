export type Category = 'Post Design' | 'Facebook Cover' | 'Print Design' | 'Ads Design' | 'Other';

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  category?: Category;
  url: string; // Google Drive direct link or YouTube/Vimeo link
  thumbnail?: string;
  createdAt: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
}
