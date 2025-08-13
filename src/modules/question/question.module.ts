import { Module } from '@nestjs/common';
import { Questions, QuestionSchema } from './question.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Questions.name, schema: QuestionSchema },
    ]),
  ],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
