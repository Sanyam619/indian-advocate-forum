export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'Supreme Court' | 'High Court' | 'Legal Update' | 'Judgment' | 'Case Analysis';
  courtType: 'supreme' | 'high';
  courtName?: string; // Specific court name for high courts
  publishDate: string; // ISO date string
  readTime: number; // in minutes
  tags: string[];
  imageUrl?: string; // Optional image URL
  videoUrl?: string | null; // Optional video URL for news articles
  videoThumbnail?: string | null; // Optional video thumbnail
  hasVideo?: boolean; // Whether the article has video content
}

export interface CourtNewsData {
  courtType: 'supreme' | 'high';
  courtName: string;
  description: string;
  news: NewsItem[];
}

export interface NewsFilters {
  category?: string;
  courtType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  rating?: number;
  featured?: boolean;
}

export interface NewsPagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}