import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from '../category/category.service';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  providers: [StatsService, CategoryService],
  controllers: [StatsController],
})
export class StatsModule {}
