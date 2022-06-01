import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { CategoryService } from '../category/category.service';

@Injectable()
export class StatsService {
  constructor(private readonly categoryService: CategoryService) {}
  /**
   * Get the most popular/dominant keywords in a specified category
   * @param category Category
   * @returns Dominant keywords of category
   */
  async getCategoryKeywords(category: string) {
    const categories = await this.categoryService.getAllNames();
    if (!categories.data.includes(category)) {
      throw new BadRequestException('Specified category is not valid.');
    }
    const data = readFileSync(
      `${__dirname}/analytics/keywords/${category}-keywords.json`,
      {
        encoding: 'utf-8',
      },
    );
    const jsonData = JSON.parse(data as string);
    return {
      data: jsonData,
    };
  }

  /**
   * Get Total categorized articles by month of a year
   * @param month Month
   * @param year year
   * @returns Total categorized articles by month of a year
   */
  async getTotalArticlesByMonth(month: number, year: number) {
    let data: string;
    try {
      data = readFileSync(
        `${__dirname}/analytics/numerical/total-articles-${month}-${year}.json`,
        { encoding: 'utf-8' },
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    const jsonData = JSON.parse(data);
    return {
      data: jsonData,
    };
  }
}
