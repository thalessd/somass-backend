import {
  IsNotEmpty,
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

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  @Validate(TimeIsValid)
  startTime: string;

  @IsNotEmpty()
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(500)
  vacancy: number;

  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}
