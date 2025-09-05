import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class CommentReply {
  _id?: Types.ObjectId;
  @Prop()
  author: string;
  @Prop()
  content: string;
  @Prop({ type: [String], default: [] })
  likes: string[];
  @Prop({ type: [String], default: [] })
  dislikes: string[];
  replies?: CommentReply[];
}

export const CommentReplySchema = SchemaFactory.createForClass(CommentReply);

CommentReplySchema.add({
  replies: { type: [CommentReplySchema], default: [] },
});

CommentReplySchema.set('versionKey', false);
