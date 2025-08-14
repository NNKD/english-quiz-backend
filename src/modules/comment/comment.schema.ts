import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = Comments & Document;

@Schema()
export class Comments {
  _id?: Types.ObjectId;
  @Prop()
  author: string;
  @Prop()
  questionId: string;
  @Prop()
  content: string;
  @Prop({ type: [String], default: [] })
  likes: string[];
  @Prop({ type: [String], default: [] })
  dislikes: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
CommentSchema.set('versionKey', false);
