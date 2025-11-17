// server/src/books/books.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;
export enum BookStatus {
  TO_READ = 'TO_READ',
  READ = 'READ',
}

@Schema({ timestamps: true }) // createdAt/updatedAt ekler
export class Book {
  @Prop({ required: true })
  userId: string;

  // Kitabın başlığı
  @Prop({ required: true })
  title: string;
  // Kitabın linki
  @Prop({ required: true })
  url: string;

  // YENİ (NEX-018): Okunma durumu
  // Varsayılan olarak her yeni kitap 'TO_READ' olur.
  @Prop({ required: true, default: BookStatus.TO_READ })
  status: BookStatus;

  // YENİ (NEX-018): Puan (1-5 arası)
  // 'required: false' bu alanın "opsiyonel" (isteğe bağlı) olduğunu belirtir.
  @Prop({ required: false, min: 1, max: 5 })
  rating: number;

  // YENİ (NEX-018): Yorum
  @Prop({ required: false })
  comment: string;

  // YENİ (Yaratıcı Fonksiyon): Favori
  @Prop({ default: false })
  isFavorite: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
