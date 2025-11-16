import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// (NEX-013'te yaptığımız gibi, 'req.user' tipini tanımlıyoruz)
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

// (NEX-013'te yaptığımız gibi, 'Body' tipini tanımlıyoruz)
interface CreateVideoDto {
  url: string; // Angular'dan bu objeyi bekliyoruz
}

@Controller('watchlist') // Tüm yollar /watchlist ile başlar
@UseGuards(JwtAuthGuard) // TÜM endpoint'leri koru
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  /**
   * YENİ ENDPOINT 1: GET /watchlist
   * Giriş yapmış kullanıcının izleme listesini getirir.
   */
  @Get()
  getWatchlist(@Req() req: RequestWithUser) {
    // 'JwtAuthGuard' çalıştığı için 'req.user.userId'ye güvenle erişebiliriz.
    const userId = req.user.userId;
    return this.watchlistService.getWatchlist(userId);
  }

  /**
   * YENİ ENDPOINT 2: POST /watchlist
   * Kullanıcı için yeni bir video kaydeder.
   */
  @Post()
  addVideo(
    @Req() req: RequestWithUser,
    @Body() body: CreateVideoDto, // { "url": "https://..." }
  ) {
    const userId = req.user.userId;
    const url = body.url;

    // Servisimizdeki 'URL ayrıştırma' mantığını çağır
    return this.watchlistService.addVideo(url, userId);
  }
}
