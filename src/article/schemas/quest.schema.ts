import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestDocument = Quest & Document;

@Schema()
export class Quest {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  choices: string[];

  @Prop({ required: true })
  answer: number;

  @Prop({ required: true })
  createdAt: Date;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
