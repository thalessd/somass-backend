import { IsNotEmpty, IsUUID } from 'class-validator';

export class UnsubscribeDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}
