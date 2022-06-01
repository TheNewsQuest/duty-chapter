import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { allowedCategories } from '../constants/categories';
import { Category, CategoryDocument } from './schemas/category.schema';

export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name);

  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  /**
   * Get All list of category names
   * @returns List of category names
   */
  async getAllNames() {
    const results = await this.categoryModel.find({}).exec();
    return {
      data:
        results.length > 0
          ? results.map((r: CategoryDocument) => r.name)
          : allowedCategories,
    };
  }
}
