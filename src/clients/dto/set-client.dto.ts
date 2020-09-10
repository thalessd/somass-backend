import { IsOptional, IsString, IsArray } from 'class-validator';

export class SetClientDto {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsArray()
  escorts: string[];

  @IsOptional()
  @IsString()
  deviceInfoOs: string;

  @IsOptional()
  @IsString()
  deviceInfoBrand: string;

  @IsOptional()
  @IsString()
  deviceInfoModel: string;

  @IsOptional()
  @IsString()
  deviceInfoPhysicalDevice: string;

  @IsOptional()
  @IsString()
  deviceInfoDisplay: string;
}
