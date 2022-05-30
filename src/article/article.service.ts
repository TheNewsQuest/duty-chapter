import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    let result: ArticleDocument[] = [];
    const upperLimit = limit + 1;
    let cursorInfo: ArticleCursor;
    try {
      if (!datetime || !id) {
        result = await this.articleModel
          .find({})
          .sort({ postedAt: -1, _id: -1 })
          .limit(upperLimit)
          .exec();
        cursorInfo = this._getCursor(result, upperLimit);
        if (!cursorInfo.isEnd) result.pop();
        return {
          cursor: cursorInfo,
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
        .limit(upperLimit)
        .exec();
      cursorInfo = this._getCursor(result, upperLimit);
      if (!cursorInfo.isEnd) result.pop();
      return {
        cursor: cursorInfo,
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
}
