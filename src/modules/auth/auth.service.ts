import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateWalletAddress(
    walletAddress: string,
    token_name: string,
    token_symbol: string,
    balance: string,
  ) {
    let user = await this.prisma.user.findFirst({
      where: {
        address: walletAddress,
      },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          address: walletAddress,
        },
      });
      await this.prisma.balances.create({
        data: {
          user_id: user.id,
          balance,
          token_name,
          token_symbol,
        },
      });
    } else {
      await this.prisma.balances.update({
        where: {
          token_name_token_symbol_user_id: {
            user_id: user.id,
            token_name,
            token_symbol,
          },
        },
        data: {
          balance,
        },
      });
    }
    return user;
  }

  async signJwtForUser(user: User) {
    const payload = {
      user_id: 'id' in user ? user.id : null,
      wallet_address: 'address' in user ? user.address : null,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findByUserId(user_id: string) {
    return this.prisma.user.findFirst({
      where: {
        id: user_id,
      },
    });
  }
}
