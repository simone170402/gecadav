export type PublicationType = 'BLOG' | 'REVUE';
export type PublicationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PublicationListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  coverImageUrl?: string;
  type: PublicationType;
  premium: boolean;
  featured: boolean;
  views: number;
  estimatedReadTime?: number;
  publishedAt?: string;
}

export interface Publication {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImageUrl?: string;
  type: PublicationType;
  status: PublicationStatus;
  premium: boolean;
  featured: boolean;
  views: number;
  estimatedReadTime?: number;
  previewContent?: string;
  hasAccess: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImageUrl?: string;
  type: PublicationType;
  status: PublicationStatus;
  premium: boolean;
  featured: boolean;
  estimatedReadTime?: number;
  previewContent?: string;
}