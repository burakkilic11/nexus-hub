import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WatchlistDocument = Watchlist & Document;

@Schema({ timestamps: true }) // createdAt/updatedAt ekler
export class Watchlist {
  // Hangi kullanıcıya ait (NEX-005'teki JwtAuthGuard'dan gelecek)
  @Prop({ required: true })
  userId: string;

  // Ayrıştırılmış (parse) YouTube Video ID'si
  // (Örn: dQw4w9WgXcQ)
  @Prop({ required: true })
  videoId: string;

  // (Opsiyonel) Videonun başlığını veya
  // tam URL'ini de saklayabiliriz. Şimdilik videoId yeterli.
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
