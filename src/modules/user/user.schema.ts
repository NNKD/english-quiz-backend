import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = Users & Document;

@Schema()
export class Users {
  _id?: Types.ObjectId;

  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  code: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
UsersSchema.set('versionKey', false);
