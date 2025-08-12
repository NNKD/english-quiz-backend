import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument, Users } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from '../mail/mail.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import generateCode from '../../utils/numbers';

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

  async updateUserRegister(createUserDTO: CreateUserDto): Promise<Users|null> {
    const email = createUserDTO.email
    const password = createUserDTO.password
    const code = createUserDTO.code
    return this.userModel.findOneAndUpdate({ email: {$regex: createUserDTO.email, $options: 'i'} }, {email, password, code}, { new: true, upsert: true }).exec();
  }

  async register(createUserDto: CreateUserDto): Promise<Users | null> {
    const user = await this.findByEmail(createUserDto.email);
    if (!user) return null;

    if (user.code !== createUserDto.code) return null;

    const userRegister = await this.updateUserRegister(createUserDto);
    if (!userRegister) return null;

    return this.updateUserCode(userRegister.email, '');
  }


}
