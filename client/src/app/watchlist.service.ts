import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface WatchlistItem {
  _id: string;
  userId: string;
  videoId: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private http = inject(HttpClient);

  private apiUrl = '/api/watchlist';

  constructor() {}

  /**
   * YENİ FONKSİYON 1: GET /watchlist
   * Kullanıcının tüm kayıtlı videolarını getirir.
   *
   * (AuthInterceptor bu isteğe OTOMATİK token ekleyecek)
   */
  getWatchlist(): Observable<WatchlistItem[]> {
    return this.http
      .get<WatchlistItem[]>(this.apiUrl) // GET isteği at
      .pipe(
        catchError((error) => {
          console.error('Get Watchlist API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * YENİ FONKSİYON 2: POST /watchlist
   * Yeni bir video URL'i kaydeder.
   */
  addVideo(url: string): Observable<WatchlistItem> {
    const body = { url: url };
    
    // POST isteği at ve gövdede 'body' objesini gönder
    return this.http
      .post<WatchlistItem>(this.apiUrl, body) 
      .pipe(
        catchError((error) => {
          console.error('Add Video API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }
}