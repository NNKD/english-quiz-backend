import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionDocument, Questions } from './question.schema';
import { Model } from 'mongoose';
import { ResponseData } from '../../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Questions.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async getOneRandomQuestion() {
    const result = await this.questionModel
      .aggregate<Questions>([{ $sample: { size: 1 } }])
      .exec();
    if (!result) {
      throw new HttpException(
        ResponseData.error(
          'No questions available right now',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND,
      );
    }
    return ResponseData.success(
      {
        _id: result[0]._id,
      },
      'Question retrieved successfully',
      ResponseMessage.SUCCESS,
    );
  }

  async getById(id: string) {
    const result = await this.questionModel.findById(id);
    if (!result) {
      throw new HttpException(
        ResponseData.error(
          'No questions available right now',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND,
      );
    } else {
      return ResponseData.success(
        result,
        'Question retrieved successfully',
        ResponseMessage.SUCCESS,
      );
    }
  }
}
