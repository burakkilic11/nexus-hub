import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = 'test@example.com';
  password = 'strongpassword123';

  apiResponse: string = '';
  apiError: string = '';

  login() {
    this.apiResponse = '';
    this.apiError = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: AuthResponse) => {
        this.apiResponse = 'Giriş başarılı. Yönlendiriliyorsunuz...';
        
        // 1. Token'ı kaydet
        this.authService.saveToken(response.access_token);
        
        // 2. /dashboard sayfasına yönlendir
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login Hatası:', err);
        this.apiError = `Hata: ${err.error?.message || 'Sunucuya bağlanılamadı'}`;
      },
    });
  }
}
