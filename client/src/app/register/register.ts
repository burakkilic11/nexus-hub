import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  apiResponse: string = '';
  apiError: string = '';

  register() {
    this.apiResponse = '';
    this.apiError = '';

    this.authService.register(this.email, this.password).subscribe({
      
      next: (response: any) => {
        // (Gelecekte: response.message'i de kullanabiliriz)
        this.apiResponse = 'Kayıt başarılı! Lütfen giriş yapın.';

        // 2. /login sayfasına yönlendir
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Kayıt Olma Hatası:', err);
        this.apiError = `Hata: ${err.error?.message || 'Sunucuya bağlanılamadı'}`;
      },
    });
  }
}