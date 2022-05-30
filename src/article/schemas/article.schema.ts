import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Provider from '../../common/enums/provider';
import { Quest, QuestSchema } from './quest.schema';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop()
  thumbnailURL?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, unique: true })
  link: string;

  @Prop()
  author?: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  subcategory?: string;

  @Prop({ required: true })
  provider: Provider;

  @Prop()
  providerAvatarURL?: string;

  @Prop({ required: true, type: [QuestSchema] })
  quests: Quest[];

  @Prop({ required: true })
  postedAt: Date;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  deletedAt?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
// Define compound indexes
ArticleSchema.index({ postedAt: 1, _id: 1 });
ArticleSchema.index({ category: 1, postedAt: 1, _id: 1 });
