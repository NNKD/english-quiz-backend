import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comments } from './comment.schema';
import { ResponseData } from '../../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';
import { CreateCommentDto } from '../../dtos/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comments.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async getQuestionComment(questionId: string) {
    const comments = await this.commentModel.find({ questionId }).exec();
    return ResponseData.success(
      comments,
      'Comments retrieved successfully.',
      ResponseMessage.SUCCESS,
    );
  }

  async addQuestionComment(createCommentDto: CreateCommentDto) {
    const comment = await this.commentModel.create(createCommentDto);
    return ResponseData.success(
      comment,
      'Comment added successfully.',
      ResponseMessage.SUCCESS,
    );
  }

  async toggleLike(_id: string, userId: string) {
    const comment = await this.commentModel.findById(_id);
    if (!comment) {
      throw new HttpException(
        ResponseData.error(
          'Comment not found',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND,
      );
    }

    comment.dislikes = comment.dislikes.filter((id) => id !== userId);

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    return ResponseData.success(
      comment,
      'Comment updated',
      ResponseMessage.SUCCESS,
    );
  }

  async toggleDislike(_id: string, userId: string) {
    const comment = await this.commentModel.findById(_id);
    if (!comment) {
      throw new HttpException(
        ResponseData.error(
          'Comment not found',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND,
      );
    }

    comment.likes = comment.likes.filter((id) => id !== userId);

    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter((id) => id !== userId);
    } else {
      comment.dislikes.push(userId);
    }

    await comment.save();
    return ResponseData.success(
      comment,
      'Comment updated',
      ResponseMessage.SUCCESS,
    );
  }
}
