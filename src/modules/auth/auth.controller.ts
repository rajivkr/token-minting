import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BearerTokenGuard } from './guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(BearerTokenGuard)
  @Post('auth/login')
  @HttpCode(200)
  async login(@Request() req) {
    const client = req.user;
    return this.authService.signJwtForUser(client);
  }
}
