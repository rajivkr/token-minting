import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { CreateMintDto } from './dto/create-mint.dto';

@Injectable()
export class MintService {
  constructor(private readonly prisma: PrismaService) {}

  async getLedgerForUser(user_id: string) {
    return this.prisma.ledger.findMany({
      where: {
        user_id,
      },
      include: {
        user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createLedgerForuser(config: CreateMintDto, user_id: string) {
    await this.prisma.ledger.create({
      data: {
        receiver_address: config.receiver_address,
        amount: config.amount,
        txn_hash: config.txn_hash,
        user_id,
      },
    });

    return this.prisma.ledger.findMany({
      where: {
        user_id,
      },
      include: {
        user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
