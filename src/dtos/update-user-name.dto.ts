import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserNameDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  readonly name: string;
}
