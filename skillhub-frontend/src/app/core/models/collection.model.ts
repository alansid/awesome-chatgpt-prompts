import { SkillSummary } from './skill.model';

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  isFeatured: boolean;
  authorUsername: string;
  createdAt: string;
  skills: SkillSummary[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}
