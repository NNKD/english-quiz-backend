import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentReply, CommentReplySchema } from './comment-reply.schema';

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
  @Prop({ type: [CommentReplySchema], default: [] })
  replies?: CommentReply[];
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
CommentSchema.set('versionKey', false);
