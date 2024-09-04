import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CardDTO } from './card.dto';

export class CreateChargeDTO {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDTO)
  card: CardDTO;

  @IsNumber()
  amount: number;
}
