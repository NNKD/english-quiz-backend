import { IsNotEmpty } from 'class-validator';

export class CreateReplyCommentDto {
  @IsNotEmpty({ message: 'Author should not be empty' })
  readonly author: string;
  @IsNotEmpty({ message: 'Comment should not be empty' })
  readonly content: string;
  readonly likes: string[];
  readonly dislikes: string[];
}