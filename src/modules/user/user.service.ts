import { Injectable } from '@nestjs/common';
import { Balances, User } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { UpdateUserBalanceDto } from './dto/balances.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findAllBalances(): Promise<Balances[]> {
    return this.prisma.balances.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async updateUserBalance(data: UpdateUserBalanceDto, id) {
    return this.prisma.balances.update({
      where: {
        token_name_token_symbol_user_id: {
          token_name: data.token_name,
          token_symbol: data.token_symbol,
          user_id: id,
        },
      },
      data: {
        balance: data.balance,
      },
    });
  }
}
