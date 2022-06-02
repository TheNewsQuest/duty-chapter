import { Controller, Get, Param, Query } from '@nestjs/common';
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
    @Query('limit') limit?: string,
  ) {
    return await this.articleService.findManyByCursor(
      datetime,
      id,
      limit && parseInt(limit, 10),
    );
  }

  /**
   * Controller to get one article detail
   * @param id ObjectID of articles
   * @returns Article Detail
   */
  @Get('/:id')
  async getOne(@Param('id') id: string) {
    const article = await this.articleService.getOne(id);
    return {
      data: article,
    };
  }
}
