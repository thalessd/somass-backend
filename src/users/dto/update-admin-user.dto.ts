import { IsEmail, IsOptional } from 'class-validator';

export class UpdateAdminUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  password?: string;
}
