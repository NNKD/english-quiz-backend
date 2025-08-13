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

  async findById(_id: string): Promise<Users | null> {
    return this.userModel.findOne({ _id }).exec();
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userModel.findOne({ email: {$regex: email, $options: 'i'} }).exec();
  }

  async updateUserCode(email: string, code: string): Promise<Users | null> {
    return this.userModel.findOneAndUpdate({ email: {$regex: email, $options: 'i'} }, {email, code}, { new: true, upsert: true }).exec();
  }

  async updateUserName(email: string, name: string): Promise<Users | null> {
    return this.userModel.findOneAndUpdate({ email: {$regex: email, $options: 'i'} }, {email, name}, { new: true, upsert: true }).exec();
  }

  async updateUserAvatar(email: string, avatar: string): Promise<Users | null> {
    return this.userModel.findOneAndUpdate({ email: {$regex: email, $options: 'i'} }, {email, avatar}, { new: true, upsert: true }).exec();
  }

  async updateUserRegister(email: string, password: string, code = 'UPDATE'): Promise<Users|null> {
    return this.userModel.findOneAndUpdate({ email: {$regex: email, $options: 'i'} }, {email, password, code}, { new: true, upsert: true }).exec();
  }

  async register(createUserDto: CreateUserDto): Promise<ResponseData<Users>> {
    const user = await this.findByEmail(createUserDto.email);

    const code = user?.code || 'BLANK';

    if (code === 'UPDATE') {
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

  async updateNameAfterLogin(id: string, email: string, name: string) {
    const userCheckId = await this.findById(id);
    if(!userCheckId){
      throw new HttpException(
        ResponseData.error(
          'User not found',
          ResponseMessage.NOT_FOUND,
          HttpStatusCode.NOT_FOUND,
        ),
        HttpStatusCode.NOT_FOUND
      )
    }

    if (userCheckId.email.toLowerCase() !== email.toLowerCase()) {
      throw new HttpException(
        ResponseData.error(
          'Email does not match user id',
          ResponseMessage.BAD_REQUEST,
          HttpStatusCode.BAD_REQUEST,
        ),
        HttpStatusCode.BAD_REQUEST
      );
    }

    try {
      await this.updateUserName(email, name);
      await this.updateUserCode(email, 'ACTIVED');
      const avatar = this.generateAvatar(name);
      const user = await this.updateUserAvatar(email, avatar);
      return ResponseData.success(
        user,
        'Your profile has been updated!',
        ResponseMessage.SUCCESS,
      );
    } catch (error) {
      throw new HttpException(
        ResponseData.error(
          'Failed to update user',
          ResponseMessage.INTERNAL_SERVER_ERROR,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
        ),
        HttpStatusCode.INTERNAL_SERVER_ERROR
      )
    }
  }

  generateAvatar(name: string): string {
    const firstLetter = name.substring(0, 1)
    return `https://ui-avatars.com/api/?name=${firstLetter}&background=random&format=png`;
  }

}
