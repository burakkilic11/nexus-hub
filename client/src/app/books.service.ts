import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Book {
  _id: string;
  userId: string;
  title: string;
  url: string;
  status: 'TO_READ' | 'READ'; // (BookStatus enum'umuzu string'e çevirdik)
  rating?: number; // Opsiyonel
  comment?: string; // Opsiyonel
  isFavorite?: boolean; // Opsiyonel
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private http = inject(HttpClient);
  
  private apiUrl = '/api/books';

  constructor() {}

  /**
   * 1. GET /books
   * Kullanıcının tüm kitaplarını getirir.
   */
  getBooks(): Observable<Book[]> {
    return this.http
      .get<Book[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Get Books API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * 2. POST /books
   * Yeni bir kitap ekler.
   */
  addBook(title: string, url: string): Observable<Book> {
    const body = { title, url };
    return this.http
      .post<Book>(this.apiUrl, body) 
      .pipe(
        catchError((error) => {
          console.error('Add Book API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * 3. PATCH /books/:id/status
   * Kitabın durumunu günceller.
   */
  updateBookStatus(bookId: string, status: 'TO_READ' | 'READ'): Observable<Book> {
    const body = { status };
    // URL'e bookId'yi ekliyoruz: '/api/books/12345/status'
    return this.http
      .patch<Book>(`${this.apiUrl}/${bookId}/status`, body)
      .pipe(
        catchError((error) => {
          console.error('Update Status API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * 4. PATCH /books/:id/review
   * Kitabın puanını ve yorumunu günceller.
   */
  updateBookReview(bookId: string, rating: number, comment: string): Observable<Book> {
    const body = { rating, comment };
    return this.http
      .patch<Book>(`${this.apiUrl}/${bookId}/review`, body)
      .pipe(
        catchError((error) => {
          console.error('Update Review API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * 5. PATCH /books/:id/favorite
   * Kitabın 'isFavorite' durumunu (toggle) günceller.
   */
  toggleFavorite(bookId: string): Observable<Book> {
    // Bu endpoint 'body' beklemiyor, sadece 'PATCH' atıyoruz.
    return this.http
      .patch<Book>(`${this.apiUrl}/${bookId}/favorite`, {})
      .pipe(
        catchError((error) => {
          console.error('Toggle Favorite API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }
}