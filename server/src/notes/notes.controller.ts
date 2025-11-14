import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

interface CreateNoteDto {
  content: string;
}

@Controller('notes') // Bu controller'daki tüm yollar /notes ile başlar
@UseGuards(JwtAuthGuard) // YENİ EKLENDİ: BU ÇOK ÖNEMLİ!
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  //YENİ ENDPOINT 1: GET /notes Kullanıcının tüm notlarını getirir.
  @Get()
  getNotes(@Req() req: RequestWithUser) {
    // '@Req()' decorator'ı sayesinde 'req' objesine erişiyoruz.
    // 'JwtAuthGuard' çalıştığı için, 'req.user' objesinin
    // var olduğunu (%100) biliyoruz.
    const userId = req.user.userId;
    // Servisimize "Bu 'userId'ye ait notları bul" diyoruz.
    return this.notesService.getNotes(userId);
  }

  //YENİ ENDPOINT 2: POST /notes Kullanıcı için yeni bir not oluşturur.
  @Post()
  createNote(
    @Req() req: RequestWithUser,
    @Body() body: CreateNoteDto, // Angular'dan gelen '{ "content": "..." }'
  ) {
    // Hem 'userId'yi (token'dan) hem de 'content'ı (body'den) alıp servisimize paslıyoruz.
    const userId = req.user.userId;
    const content = body.content;
    return this.notesService.createNote(content, userId);
  }
}
