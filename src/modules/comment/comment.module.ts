import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentSchema } from './comment.schema';
import { CommentsController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comments.name, schema: CommentSchema }]),
  ],
  providers: [CommentService],
  controllers: [CommentsController],
})
export class CommentModule {}
