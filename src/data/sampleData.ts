import { PortfolioItem } from '../types';

export const sampleData: PortfolioItem[] = [
  {
    id: 's1',
    type: 'image',
    category: 'Post Design',
    url: 'https://picsum.photos/seed/design1/800/1000',
    createdAt: Date.now() - 10000
  },
  {
    id: 's2',
    type: 'image',
    category: 'Ads Design',
    url: 'https://picsum.photos/seed/design2/800/600',
    createdAt: Date.now() - 20000
  },
  {
    id: 's3',
    type: 'image',
    category: 'Print Design',
    url: 'https://picsum.photos/seed/design3/800/1200',
    createdAt: Date.now() - 30000
  },
  {
    id: 's4',
    type: 'image',
    category: 'Facebook Cover',
    url: 'https://picsum.photos/seed/design4/1200/450',
    createdAt: Date.now() - 40000
  },
  {
    id: 's5',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    createdAt: Date.now() - 50000
  },
  {
    id: 's6',
    type: 'image',
    category: 'Print Design',
    url: 'https://picsum.photos/seed/design5/800/1100',
    createdAt: Date.now() - 60000
  }
];
