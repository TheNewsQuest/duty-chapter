import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';

export interface FindManyArticlesByCursorResponse {
  cursor: {
    datetime?: Date;
    id?: string;
  };
  data: ArticleDocument[];
}

export interface ArticleCursor {
  datetime: Date;
  id: string;
}

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
  ) {}

  /**
   *
   * @returns List of all articles
   */
  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  /**
   * Find Many Articles from cursor
   * @param datetime Datetime string (in ISO format)
   * @param id Object's ID
   * @returns Returned results from cursor (timestamp, id)
   */
  async findManyByCursor(
    datetime: string,
    id: string,
    limit: number,
  ): Promise<FindManyArticlesByCursorResponse> {
    let result: ArticleDocument[] = [];
    try {
      if (!datetime || !id) {
        result = await this.articleModel
          .find({})
          .sort({ postedAt: -1, _id: -1 })
          .limit(limit)
          .exec();
        return {
          cursor: this.getCursor(result, limit),
          data: result,
        };
      }
      const cursorDate = new Date(datetime);
      result = await this.articleModel
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
        .limit(limit)
        .exec();
      return {
        cursor: this.getCursor(result, limit),
        data: result,
      };
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Get cursor information from list of article results
   * @param articles List of articles
   * @param limit Limit
   * @returns Cursor info
   */
  private getCursor(articles: ArticleDocument[], limit: number): ArticleCursor {
    if (articles.length < limit) {
      return {
        datetime: null,
        id: null,
      };
    }
    return {
      datetime: articles[limit - 1].postedAt,
      id: articles[limit - 1]._id,
    };
  }
}
