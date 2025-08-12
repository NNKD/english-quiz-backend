import { HttpStatusCode } from './global.enum';

export class ResponseData<T> {
  constructor(
    public data: T | T[] | null,
    public message: string,
    public status: string,
    public statusCode: number,
  ) {}

  static success<T>(
    data: T | T[],
    message: string,
    statsus: string,
  ): ResponseData<T> {
    return new ResponseData<T>(data, message, statsus, HttpStatusCode.OK);
  }

  static error<T>(
    message: string,
    status: string,
    statusCode: number,
  ): ResponseData<T> {
    return new ResponseData<T>(null, message, status, statusCode);
  }
}
