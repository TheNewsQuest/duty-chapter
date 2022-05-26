import { Quest } from '../schemas/quest.schema';

export class BaseArticleDto {
  title: string;

  content: string;

  link: string;

  author?: string;

  category: string;

  subcategory?: string;

  provider: string;

  quests: Quest[];

  postedAt: Date;
}
