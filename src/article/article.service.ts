import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { readFileSync } from 'fs';
import { Model } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { Article, ArticleDocument } from './schemas/article.schema';

export interface FindManyArticlesByCursorResponse {
  cursor: ArticleCursor;
  data: ArticleDocument[];
}

export interface ArticleCursor {
  datetime?: Date;
  id?: string;
  isEnd?: boolean;
}

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Find Many Articles from cursor
   * @param datetime Datetime string (in ISO format)
   * @param id Object's ID
   * @returns Returned results from cursor (timestamp, id)
   */
  async findManyByCursor(
    datetime: string,
    id: string,
    limit = 5,
  ): Promise<FindManyArticlesByCursorResponse> {
    if (limit < 1) {
      throw new BadRequestException('Query limit must be larger than 1.');
    }
    let articles: ArticleDocument[] = [];
    const upperLimit = limit + 1;
    let cursorInfo: ArticleCursor = null;
    try {
      if (!datetime || !id) {
        articles = await this.articleModel
          .find({})
          .sort({ postedAt: -1, _id: -1 })
          .limit(upperLimit)
          .exec();
        cursorInfo = this._getCursor(articles, upperLimit);
        if (!cursorInfo.isEnd) articles.pop(); // Pop upper
        return {
          cursor: cursorInfo,
          data: articles,
        };
      }
      const cursorDate = new Date(datetime);
      articles = await this.articleModel
        .find({
          $and: [
            {
              postedAt: { $lte: cursorDate },
            },
            {
              $or: [
                {
                  postedAt: { $lt: cursorDate },
                },
                {
                  _id: { $lt: id },
                },
              ],
            },
          ],
        })
        .sort({ postedAt: -1, _id: -1 })
        .limit(upperLimit)
        .exec();
      cursorInfo = this._getCursor(articles, upperLimit);
      if (!cursorInfo.isEnd) articles.pop(); // Pop upper
      return {
        cursor: cursorInfo,
        data: articles,
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Get cursor information from list of article results
   * @param articles List of articles
   * @param upperLimit Limit
   * @returns Cursor info
   */
  private _getCursor(
    articles: ArticleDocument[],
    upperLimit: number,
  ): ArticleCursor {
    if (articles.length == 0 || articles.length < upperLimit) {
      return {
        datetime: null,
        id: null,
        isEnd: true,
      };
    }
    return {
      datetime: articles[upperLimit - 2].postedAt,
      id: articles[upperLimit - 2]._id,
      isEnd: false,
    };
  }

  /**
   * Get One Article Detail by ID
   * @param id ID of Article
   * @returns Article Detail
   */
  async getOne(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid ID specified for query.');
    }
    let result: ArticleDocument = null;
    try {
      result = await this.articleModel.findById(id);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
    if (!result) {
      throw new NotFoundException('Article is not found.');
    }
    return result;
  }

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
    const data = readFileSync(`${__dirname}/stats/${category}-keywords.json`, {
      encoding: 'utf-8',
    });
    const jsonData = JSON.parse(data as string);
    return {
      data: jsonData,
    };
  }
}
