import { Module } from '@nestjs/common';
import { MintService } from './mint.service';
import { MintController } from './mint.controller';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt-auth.guard';
import { PrismaService } from '../../services/prisma.service';

@Module({
  providers: [MintService, UserJwtAuthGuard, PrismaService],
  controllers: [MintController],
})
export class MintModule {}
