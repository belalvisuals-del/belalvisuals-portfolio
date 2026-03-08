import { PortfolioItem } from '../types';

export const sampleData: PortfolioItem[] = [
  {
    id: 's1',
    title: 'Modern Brand Identity',
    type: 'image',
    category: 'Post Design',
    url: 'https://picsum.photos/seed/design1/800/1000',
    createdAt: Date.now() - 10000
  },
  {
    id: 's2',
    title: 'Social Media Campaign',
    type: 'image',
    category: 'Ads Design',
    url: 'https://picsum.photos/seed/design2/800/600',
    createdAt: Date.now() - 20000
  },
  {
    id: 's3',
    title: 'Corporate Presentation',
    type: 'image',
    category: 'Print Design',
    url: 'https://picsum.photos/seed/design3/800/1200',
    createdAt: Date.now() - 30000
  },
  {
    id: 's4',
    title: 'Facebook Cover Design',
    type: 'image',
    category: 'Facebook Cover',
    url: 'https://picsum.photos/seed/design4/1200/450',
    createdAt: Date.now() - 40000
  },
  {
    id: 's5',
    title: 'Motion Graphics Reel',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    createdAt: Date.now() - 50000
  },
  {
    id: 's6',
    title: 'Minimalist Poster',
    type: 'image',
    category: 'Print Design',
    url: 'https://picsum.photos/seed/design5/800/1100',
    createdAt: Date.now() - 60000
  }
];
