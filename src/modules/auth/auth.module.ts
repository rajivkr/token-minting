import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../services/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_TOKEN_EXPIRATION_TIME } from './constants';
import { TokenStrategy } from './strategy/auth-token.strategy';
import { UserJwtStrategy } from './strategy/user-jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: JWT_TOKEN_EXPIRATION_TIME,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [TokenStrategy, AuthService, PrismaService, UserJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
