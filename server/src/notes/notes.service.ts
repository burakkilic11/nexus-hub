import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './notes.schema';

@Injectable()
export class NotesService {
  constructor(
    // Mongoose 'Note' modelini bu servise 'inject' et
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
  ) {}
  //Belirli bir 'userId'ye ait tüm notları bulur.
  async getNotes(userId: string): Promise<Note[]> {
    // Veritabanında 'userId' alanı, bize verilen 'userId' ile eşleşen TÜM notları bul ve döndür.
    return this.noteModel.find({ userId: userId }).exec();
  }

  //Belirli bir 'userId' için yeni bir not oluşturur.
  async createNote(content: string, userId: string): Promise<Note> {
    const newNote = new this.noteModel({
      content, // (Shorthand for content: content)
      userId, // (Shorthand for userId: userId)
    });
    // Yeni notu veritabanına kaydet ve döndür.
    return newNote.save();
  }
}
