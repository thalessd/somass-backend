import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
