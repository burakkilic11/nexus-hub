// server/src/auth/auth.controller.ts

import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

// AuthDto adında bir dosya oluşturup 'validation' (doğrulama) yapabilirdik
// ama şimdilik 'any' kullanarak basit tutuyoruz.

@Controller('auth') // Bu controller'daki tüm endpoint'ler /auth ile başlar
export class AuthController {
  constructor(private authService: AuthService) {}

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
