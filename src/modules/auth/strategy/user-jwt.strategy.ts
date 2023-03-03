import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

/**
 * This strategy is applicable after the user is logged-in or the token is validated
 * So this validates the JWT token itself
 */
@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { user_id, wallet_address } = payload;
    try {
      const userObj = await this.authService.findByUserId(user_id);
      if (!userObj || userObj.address !== wallet_address) {
        throw new UnauthorizedException();
      }
      return {
        user_id: payload.user_id,
        wallet_address: payload.wallet_address,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
