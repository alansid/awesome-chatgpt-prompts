export interface SkillSummary {
  id: number;
  slug: string;
  name: string;
  description: string;
  authorUsername: string;
  categoryName: string;
  categorySlug: string;
  version: string;
  installCount: number;
  aiScore: number;
  thumbnailUrl: string;
  tags: string[];
  compatibleAgents: string[];
}

export interface SkillDetail extends SkillSummary {
  content: string;
  authorDisplayName: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillRequest {
  name: string;
  description: string;
  content: string;
  categoryId?: number;
  version: string;
  compatibleAgents: string[];
  tagIds?: number[];
  thumbnailUrl?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
