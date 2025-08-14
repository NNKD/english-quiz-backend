import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/random')
  getRandomQuestion() {
    return this.questionService.getOneRandomQuestion();
  }

  @Get('/:id')
  getQuestionById(@Param('id') id: string) {
    return this.questionService.getById(id);
  }
}
