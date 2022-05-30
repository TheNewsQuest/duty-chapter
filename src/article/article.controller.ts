import { Controller, Get, Query } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Index '/articles' router to get list of articles
   * @returns List of articles
   */
  @Get()
  async findManyByCursor(
    @Query('datetime') datetime?: string,
    @Query('id') id?: string,
    @Query('limit') limit = 5,
  ) {
    return await this.articleService.findManyByCursor(datetime, id, limit);
  }
}
