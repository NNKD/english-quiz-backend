import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Author should not be empty' })
  readonly author: string;
  @IsNotEmpty({ message: 'QuestionId should not be empty' })
  readonly questionId: string;
  @IsNotEmpty({ message: 'Comment should not be empty' })
  readonly content: string;
  readonly likes: string[];
  readonly dislikes: string[];
}
