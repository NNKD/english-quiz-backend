import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ResponseData } from './global/response-data';
import { HttpStatusCode, ResponseMessage } from './global/global.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metaData: ArgumentMetadata): Promise<any> {
    if (this.isEmpty(value)) {
      return ResponseData.error(
        'No payload provided',
        ResponseMessage.BAD_REQUEST,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const { metatype } = metaData;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value) as object;
    const errors = await validate(object);

    if (errors.length > 0) {
      const firstError = errors[0];

      const firstMessage = firstError
        ? Object.values(firstError.constraints || {})[0]
        : 'Validation failed';

      throw new HttpException(
        ResponseData.error(
          firstMessage,
          ResponseMessage.BAD_REQUEST,
          HttpStatusCode.BAD_REQUEST,
        ),
        HttpStatusCode.BAD_REQUEST,
      );
    }

    return value;
  }

  private isEmpty(value: any): boolean {
    if (value == null) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0)
      return true;
    return false;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
