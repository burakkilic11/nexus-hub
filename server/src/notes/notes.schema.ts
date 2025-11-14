import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Bu, 'NoteDocument' tipini TypeScript'e tanıtır
export type NoteDocument = Note & Document;

@Schema({ timestamps: true }) // 'timestamps: true' createdAt/updatedAt ekler
export class Note {
  // Notun içeriği
  @Prop({ required: true })
  content: string;

  // Bu notun HANGİ KULLANICIYA ait olduğunu
  // belirten 'userId' alanı (req.user.userId'den gelecek)
  @Prop({ required: true })
  userId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
