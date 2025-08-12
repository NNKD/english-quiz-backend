import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument, Users } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import generateCode from '../../utils/numbers';
import { ResponseData } from '../../global/response-data';
import { HttpStatusCode, ResponseMessage } from '../../global/global.enum';

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

    const code = user?.code || '';

    if (code === 'ACTIVED') {
      return ResponseData.error(
        'User already registered',
        ResponseMessage.BAD_REQUEST,
        HttpStatusCode.BAD_REQUEST,
      );
    }

    if (code !== createUserDto.code){
      return ResponseData.error(
        'Verification code is invalid',
        ResponseMessage.BAD_REQUEST,
        HttpStatusCode.BAD_REQUEST
      );
    }

    const userRegister = await this.updateUserRegister(createUserDto.email, createUserDto.password);
    if (!userRegister){
      return ResponseData.error(
        'Verification code is invalid',
        ResponseMessage.INTERNAL_SERVER_ERROR,
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
