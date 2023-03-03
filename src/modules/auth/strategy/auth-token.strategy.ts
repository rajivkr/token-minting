import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(
  HeaderAPIKeyStrategy,
  'bearer-token',
) {
  constructor(private authService: AuthService) {
    super(
      {
        header: 'Authorization',
        prefix: 'Bearer ',
      },
      false,
      // eslint-disable-next-line consistent-return
      async (apiKey: string, done: (error: Error, data: any) => void) => {
        if (apiKey) return this.validate(apiKey, done);
        done(new UnauthorizedException(), null);
      },
    );
  }

  async validate(
    token: string,
    done: (error: Error, data) => void,
  ): Promise<any> {
    const bearerToken = Buffer.from(token, 'base64').toString('utf-8');
    const [walletAddress, tokenName, tokenSymbol, balanceStr] =
      bearerToken.split(':');
    try {
      if (!bearerToken) {
        done(new UnauthorizedException(), null);
      } else {
        const user = await this.authService.validateWalletAddress(
          walletAddress,
          tokenName,
          tokenSymbol,
          balanceStr,
        );
        if (!user) {
          done(new UnauthorizedException(), null);
        }
        done(null, user);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
