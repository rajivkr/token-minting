import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserBalanceDto {
  @IsNotEmpty()
  @IsString()
  token_name: string;

  @IsNotEmpty()
  @IsString()
  token_symbol: string;

  @IsNotEmpty()
  @IsString()
  balance: string;
}
