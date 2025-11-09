// server/src/auth/auth.controller.ts

import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';

@Controller('auth') // Bu controller'daki tüm endpoint'ler /auth ile başlar
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * GET /auth/profile
   * Bu endpoint, SADECE geçerli bir JWT token'ı olan
   * kullanıcılar tarafından erişilebilir.
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    // 'JwtStrategy'mizin 'validate' metodunda ne döndürdüysek
    // (yani { userId: ..., email: ... }),
    // NestJS onu 'req.user' içine koyar.
    return req.user;
  }
  /**
   * POST /auth/login
   */
  @HttpCode(HttpStatus.OK) // Başarılı 'POST' isteği için 200 OK kodu döndür
  @Post('login')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto.email, authDto.password);
  }

  /**
   * POST /auth/register
   */
  @Post('register')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto.email, authDto.password);
  }
}
