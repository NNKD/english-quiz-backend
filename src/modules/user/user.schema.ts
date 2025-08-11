import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = Users & Document;

@Schema()
export class Users {
  @Prop()
  email: string;
  @Prop()
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
