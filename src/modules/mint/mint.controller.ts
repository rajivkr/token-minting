import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt-auth.guard';
import { CreateMintDto } from './dto/create-mint.dto';
import { MintService } from './mint.service';

@Controller('mint')
export class MintController {
  constructor(private readonly mintService: MintService) {}

  @Get('/')
  @UseGuards(UserJwtAuthGuard)
  findAllBalances(@Request() req) {
    const { user_id: userId } = req.user;
    return this.mintService.getLedgerForUser(userId);
  }

  @UseGuards(UserJwtAuthGuard)
  @Post('/')
  createDestinations(
    @Request() req,
    @Body()
    config: CreateMintDto,
  ) {
    const { user_id: userId } = req.user;
    return this.mintService.createLedgerForuser(config, userId);
  }
}
