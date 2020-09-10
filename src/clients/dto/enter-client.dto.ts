import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsValidCPF } from '../../shared/helpers/custom-class-validators';

export class EnterClientDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsValidCPF)
  cpf: string;
}
