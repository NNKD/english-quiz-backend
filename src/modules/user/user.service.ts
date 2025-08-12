import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument, Users } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { ResponseData } from '../../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(Users.name) private readonly userModel: Model<UserDocument>,) {}

  async getUsers(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userModel.findOne({ email: {$regex: email, $options: 'i'} }).exec();
  }

  async updateUserCode(email: string, code: string): Promise<Users | null> {
    return this.userModel.findOneAndUpdate({ email: {$regex: email, $options: 'i'} }, {email, code}, { new: true, upsert: true }).exec();
  }

  async updateUserRegister(email: string, password: string, code = 'ACTIVED'): Promise<Users|null> {
    return this.userModel.findOneAndUpdate({ email: {$regex: email, $options: 'i'} }, {email, password, code}, { new: true, upsert: true }).exec();
  }

  async register(createUserDto: CreateUserDto): Promise<ResponseData<Users>> {
    const user = await this.findByEmail(createUserDto.email);

    const code = user?.code || 'BLANK';

    if (code === 'ACTIVED') {
      throw new HttpException(
        ResponseData.error(
          'User already registered',
          ResponseMessage.BAD_REQUEST,
          HttpStatusCode.BAD_REQUEST,
        ),
        HttpStatusCode.BAD_REQUEST
      )
    }

    if (code !== createUserDto.code){
      throw new HttpException(ResponseData.error(
        'Verification code is invalid',
        ResponseMessage.BAD_REQUEST,
        HttpStatusCode.BAD_REQUEST
      ),
        HttpStatusCode.BAD_REQUEST
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userRegister = await this.updateUserRegister(createUserDto.email, hashedPassword);
    if (!userRegister){
      throw new HttpException(ResponseData.error(
        'Failed to register user due to server error',
        ResponseMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCode.INTERNAL_SERVER_ERROR
      ),
        HttpStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    return ResponseData.success(
      userRegister,
      'User registered successfully',
      ResponseMessage.SUCCESS,
    );
  }


}
