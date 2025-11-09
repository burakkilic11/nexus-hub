// client/src/app/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs'; // RxJS Kütüphanesi

export interface AuthResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  // Sunucumuzun (NestJS) adresini bir değişkende tutuyoruz.
  private apiUrl = 'http://localhost:3000/auth';

  constructor() {}

  login(email: string, password: string): Observable<AuthResponse> {
    
    // API'ye POST isteği atıyoruz:
    // 1. URL: 'http://localhost:3000/auth/login'
    // 2. Body: { email, password }
    // 3. Dönen verinin tipinin 'AuthResponse' olmasını beklediğimizi söylüyoruz.
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        // '.pipe()' metodu, bu 'Observable' akışına
        // müdahale etmemizi sağlar.
        catchError((error) => {
          // Eğer API 401 (Geçersiz Şifre) gibi bir hata döndürürse,
          // 'catchError' bunu yakalar.
          console.error('Login API Hata:', error);
          
          // Hata akışını devam ettiririz ki
          // bu servisi kullanan component (Login Formu) hatayı görebilsin.
          return throwError(() => error);
        }),
      );
  }

  // Not: signUp (Kayıt Ol) fonksiyonunu da buraya ekleyebilirdik,
  // ama şimdilik sadece 'login' işlemine odaklanıyoruz.
}