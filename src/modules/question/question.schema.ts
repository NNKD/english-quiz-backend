import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type QuestionDocument = Questions & Document;
@Schema()
export class Questions {
  _id?: Types.ObjectId;
  @Prop()
  question: string;
  @Prop({ type: [{ key: String, value: String }] })
  options: { key: string; value: string }[];
  @Prop({ type: { key: String, value: String } })
  answer: { key: string; value: string };
  @Prop()
  explain: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Questions);
QuestionSchema.set('versionKey', false);
