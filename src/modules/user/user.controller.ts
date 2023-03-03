import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserJwtAuthGuard } from '../auth/guards/user-jwt-auth.guard';
import { UpdateUserBalanceDto } from './dto/balances.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/balance')
  @UseGuards(UserJwtAuthGuard)
  findAllBalances() {
    return this.userService.findAllBalances();
  }

  @UseGuards(UserJwtAuthGuard)
  @Patch('/balance')
  updateUserBalance(
    @Request() req,
    @Body()
    config: UpdateUserBalanceDto,
  ) {
    const { user_id: userId } = req.user;
    return this.userService.updateUserBalance(config, userId);
  }
}
