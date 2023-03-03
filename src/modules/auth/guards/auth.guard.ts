import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT AuthGuard to avoid magic strings in the code
 */
@Injectable()
export class BearerTokenGuard extends AuthGuard('bearer-token') {}
