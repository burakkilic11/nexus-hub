import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  // Servisleri "enjekte" et
  private authService = inject(AuthService);
  private router = inject(Router);
  // Ekranda göstermek için değişkenler
  userEmail: string | null = null;
  apiError: string = '';

  ngOnInit(): void {
    // Auth API'mize istek at
    this.authService.getProfile().subscribe({
      
      /**
       * 'next' (Başarılı Durum):
       * Interceptor'ımız (Adım 2) token'ı başarıyla ekledi
       * ve NestJS bize kullanıcı profilini döndürdü.
       */
      next: (profile: UserProfile) => {
        this.userEmail = profile.email;
        this.apiError = ''; // Hata yok
      },

      /**
       * 'error' (Hata Durumu):
       * Interceptor çalışmadı VEYA token geçersiz/süresi dolmuş VEYA
       * sunucu kapalı.
       * NestJS bize 401 Unauthorized hatası döndürdü.
       */
      error: (err) => {
        this.userEmail = null;
        this.apiError = 'Profil verisi alınamadı. Lütfen tekrar giriş yapın.';
        console.error('Profile Hatası:', err);
        
      },
    });
  }

  /**
   * Çıkış Yap (Logout) Fonksiyonu
   */
  logout(): void {
    // 1. Token'ı localStorage'dan sil
    this.authService.logout();
    
    // 2. Kullanıcıyı /login sayfasına geri yönlendir
    this.router.navigate(['/login']);
  }
}