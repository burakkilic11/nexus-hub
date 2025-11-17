// server/src/books/books.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument, BookStatus } from './books.schema';

@Injectable()
export class BooksService {
  constructor(
    // Mongoose 'Book' modelini bu servise 'inject' et
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  /**
   * 1. Belirli bir 'userId'ye ait tüm kitapları bulur.
   */
  async getBooks(userId: string): Promise<Book[]> {
    // 'createdAt' (oluşturulma tarihi) sırasına göre tersten (yeni eklenen en üstte) sırala
    return this.bookModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * 2. Yeni bir kitap ekler (Otomatik olarak 'TO_READ' statüsünde)
   */
  async addBook(title: string, url: string, userId: string): Promise<Book> {
    const newBook = new this.bookModel({
      userId,
      title,
      url,
      status: BookStatus.TO_READ,
    });
    return newBook.save();
  }

  /**
   * 3. Kitabın durumunu günceller (örn: 'READ' yapar)
   */
  async updateBookStatus(
    bookId: string,
    status: BookStatus,
    userId: string,
  ): Promise<Book> {
    const updatedBook = await this.bookModel.findOneAndUpdate(
      { _id: bookId, userId: userId },
      { status: status },
      { new: true },
    );

    if (!updatedBook) {
      throw new NotFoundException('Kitap bulunamadı veya yetkiniz yok');
    }
    return updatedBook;
  }

  /**
   * 4. Kitabın puanını ve/veya yorumunu günceller
   */
  async updateBookReview(
    bookId: string,
    rating: number,
    comment: string,
    userId: string,
  ): Promise<Book> {
    const updatedBook = await this.bookModel.findOneAndUpdate(
      // Güvenlik Kuralı: Sadece 'bookId' VE 'userId' eşleşirse güncelle
      { _id: bookId, userId: userId },
      // Güncellenecek alanlar
      { rating: rating, comment: comment },
      { new: true },
    );

    if (!updatedBook) {
      throw new NotFoundException('Kitap bulunamadı veya yetkiniz yok');
    }
    return updatedBook;
  }

  /**
   * 5. Kitabın 'isFavorite' durumunu tersine çevirir (toggle)
   */
  async toggleFavorite(bookId: string, userId: string): Promise<Book> {
    // Önce kitabı bulmalıyız (güvenlik kontrolüyle)
    const book = await this.bookModel.findOne({ _id: bookId, userId: userId });

    if (!book) {
      throw new NotFoundException('Kitap bulunamadı veya yetkiniz yok');
    }

    // 'isFavorite' durumunu tersine çevir (true -> false, false -> true)
    book.isFavorite = !book.isFavorite;

    // Değişikliği kaydet ve döndür
    return book.save();
  }
}
