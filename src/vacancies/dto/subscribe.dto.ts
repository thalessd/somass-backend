import { IsNotEmpty, IsUUID } from 'class-validator';

export class SubscribeDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}
