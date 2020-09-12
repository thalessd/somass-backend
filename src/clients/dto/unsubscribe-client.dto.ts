import { IsNotEmpty, IsUUID } from 'class-validator';

export class UnsubscribeClientDto {
  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}
