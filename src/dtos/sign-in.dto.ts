import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  readonly password: string;
}
