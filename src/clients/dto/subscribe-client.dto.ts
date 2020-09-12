import { IsNotEmpty, IsUUID } from 'class-validator';

export class SubscribeClientDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}
