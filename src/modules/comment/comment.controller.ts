import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from '../../dtos/create-comment.dto';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Get('/question/:id')
  async getQuestionComment(@Param('id') id: string) {
    return this.commentService.getQuestionComment(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async addQuestionComment(@Body() createCommentDto: CreateCommentDto) {
    console.log(createCommentDto);
    return this.commentService.addQuestionComment(createCommentDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id/likes/:userId')
  async updateQuestionCommentLikes(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.commentService.toggleLike(id, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('/:id/dislikes/:userId')
  async updateQuestionCommentDisLikes(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.commentService.toggleDislike(id, userId);
  }
}
