import { Controller, Get } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './schemas/article.schema';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Index '/articles' router to get list of articles
   * @returns List of articles
   */
  @Get()
  async findAll(): Promise<Article[]> {
    return await this.articleService.findAll();
  }
}
