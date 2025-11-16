// client/src/app/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface AuthResponse {
  access_token: string;
}

// Profile API'sinden ne beklediğimizi tanımlıyoruz
export interface UserProfile {
  userId: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth';

  // Token'ı saklayacağımız anahtar
  private readonly TOKEN_KEY = 'nexus_auth_token';

  constructor() {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Login API Hata:', error);
          return throwError(() => error);
        }),
      );
  }

  register(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Register API Hata:', error);
          return throwError(() => error);
        }),
      );
  }

  // /profile endpoint'ine istek atacak fonksiyon
  getProfile(): Observable<UserProfile> {
    return this.http
      .get<UserProfile>(`${this.apiUrl}/profile`)
      .pipe(
        catchError((error) => {
          console.error('Get Profile API Hata:', error);
          return throwError(() => error);
        })
      );
  }

  // --- Token Depolama (LocalStorage) ---

  // Token'ı tarayıcının yerel depolamasına kaydeder
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Token'ı yerel depolamadan okur
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Token'ı yerel depolamadan siler (Logout için)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
