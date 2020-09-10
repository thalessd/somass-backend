import {
  IsOptional,
  IsString,
  IsEnum,
  Validate,
  IsInt,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { DayOfWeek } from '../enum/day-of-week.enum';
import { TimeIsValid } from '../../shared/helpers/custom-class-validators';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @Validate(TimeIsValid)
  startTime?: string;

  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  vacancy?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
