import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/:category/keywords')
  async getCategoryKeywords(@Param('category') category: string) {
    return await this.statsService.getCategoryKeywords(category);
  }

  @Get('/monthly-total-articles')
  async getTotalArticlesByMonth(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    if (!month || !year) {
      throw new BadRequestException('Unspecified month or year.');
    }
    if (Number.isInteger(month) || Number.isInteger(year)) {
      throw new BadRequestException(
        'Malformed data type of month or year variables.',
      );
    }
    return await this.statsService.getTotalArticlesByMonth(
      parseInt(month),
      parseInt(year),
    );
  }

  @Get('/sentiment-score')
  async getSentimentScore() {
    return await this.statsService.getSentimentScore();
  }
}
