import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMintDto {
  @IsNotEmpty()
  @IsString()
  receiver_address: string;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  txn_hash: string;
}
