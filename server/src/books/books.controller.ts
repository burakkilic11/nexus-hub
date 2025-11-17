import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Param,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookStatus } from './books.schema';

// 'req.user' objemizin tipini tanımlıyoruz
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

// 'POST' için DTO (Data Transfer Object)
class CreateBookDto {
  title: string;
  url: string;
}

// 'PATCH' (status) için DTO
class UpdateBookStatusDto {
  status: BookStatus;
}

// 'PATCH' (review) için DTO
class UpdateBookReviewDto {
  rating: number;
  comment: string;
}

@Controller('books') // Tüm yollar /books ile başlar
@UseGuards(JwtAuthGuard) // Bu controller'daki TÜM yolları koru
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  /**
   * 1. GET /books
   * Kullanıcının tüm kitaplarını getirir.
   */
  @Get()
  getBooks(@Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.booksService.getBooks(userId);
  }

  /**
   * 2. POST /books
   * Kullanıcı için yeni bir kitap oluşturur.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addBook(@Req() req: RequestWithUser, @Body() body: CreateBookDto) {
    const userId = req.user.userId;
    return this.booksService.addBook(body.title, body.url, userId);
  }

  /**
   * 3. PATCH /books/:id/status
   * Kitabın durumunu günceller (örn: 'READ')
   * :id -> URL'den gelen parametre
   */
  @Patch(':id/status')
  updateBookStatus(
    @Req() req: RequestWithUser,
    @Param('id') bookId: string,
    @Body() body: UpdateBookStatusDto,
  ) {
    const userId = req.user.userId;
    return this.booksService.updateBookStatus(bookId, body.status, userId);
  }

  /**
   * 4. PATCH /books/:id/review
   * Kitabın puanını ve/veya yorumunu günceller.
   */
  @Patch(':id/review')
  updateBookReview(
    @Req() req: RequestWithUser,
    @Param('id') bookId: string,
    @Body() body: UpdateBookReviewDto,
  ) {
    const userId = req.user.userId;
    return this.booksService.updateBookReview(
      bookId,
      body.rating,
      body.comment,
      userId,
    );
  }

  /**
   * 5. PATCH /books/:id/favorite
   * Kitabın 'isFavorite' durumunu tersine çevirir (toggle).
   */
  @Patch(':id/favorite')
  toggleFavorite(@Req() req: RequestWithUser, @Param('id') bookId: string) {
    const userId = req.user.userId;
    return this.booksService.toggleFavorite(bookId, userId);
  }
}
