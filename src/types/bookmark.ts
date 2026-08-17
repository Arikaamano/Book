export interface Bookmark {
  id: string;
  name: string;
  url: string;
  domain: string;
  favicon?: string;
  customIconBg?: string;
  tags?: string[];
  isFavorite: boolean;
  clickCount?: number;
  lastOpenedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewFilter = 'all' | 'favorites' | 'recent' | 'tag';

export interface PopularWebsite {
  name: string;
  url: string;
  domain: string;
  category: string;
  iconBg: string;
  iconColor?: string;
  initials?: string;
  description?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
