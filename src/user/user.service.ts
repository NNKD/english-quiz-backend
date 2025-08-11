import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument, Users } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getUsers(): Promise<Users[]> {
    return this.userModel.find().exec();
  }
}
