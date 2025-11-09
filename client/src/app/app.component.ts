import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Form (ngModel) için
import { CommonModule } from '@angular/common'; // (ngIf, ngFor) için
import { AuthService, AuthResponse } from './auth.service'; // YENİ: Auth Servisimiz
import { HttpErrorResponse } from '@angular/common/http'; // Hata tipi için

@Component({
  selector: 'app-root', // HTML'deki <app-root> etiketi
  standalone: true, // Angular'ın modern "standalone" component yapısı
  
  // Bu component'in ihtiyaç duyduğu diğer modüller/component'ler
  imports: [RouterOutlet, CommonModule, FormsModule],
  
  templateUrl: './app.component.html', // Bu component'in HTML dosyası
  styleUrl: './app.component.scss', // Bu component'in stil (SCSS) dosyası
})
export class AppComponent {
  
  // 'inject' ile Auth Servisimizi bu component'e "enjekte" ediyoruz.
  private authService = inject(AuthService);

  // Formdan gelen verileri tutmak için iki değişken
  // HTML'deki [(ngModel)] buraya bağlanacak
  email = 'test@example.com'; // (Kolay test için önceden doldurduk)
  password = 'strongpassword123'; // (Kolay test için önceden doldurduk)

  // API'den gelen sonucu (token veya hata)
  // ekranda göstermek için değişkenler
  apiResponse: string = '';
  apiError: string = '';

  /**
   * (Mentor Notu: RxJS .subscribe() (Abone Olma) )
   *
   * HTML'deki <form> (ngSubmit)="login()" yaptığında bu fonksiyon çalışacak.
   */
  login() {
    // API'den gelen bir cevap veya hata varsa, yeni istek öncesi temizle
    this.apiResponse = '';
    this.apiError = '';

    // Hatırlatma: authService.login() API isteğini BAŞLATMAZ.
    // Sadece bir "Observable" (İstek Planı) döndürür.
    
    // İsteği başlatan şey, '.subscribe()' (Abone Ol) metodudur.
    this.authService.login(this.email, this.password).subscribe({
      
      /**
       * (1) 'next' (Başarılı Durum):
       * Observable (boru hattı) başarıyla veri getirdiğinde
       * (yani API 200 OK döndüğünde) burası çalışır.
       */
      next: (response: AuthResponse) => {
        console.log('API Yanıtı:', response);
        this.apiResponse = `Başarılı! Token (ilk 10 karakter): ${response.access_token.substring(0, 10)}...`;
        
        // Gelecekte (NEX-008): Token'ı burada localStorage'a kaydedeceğiz.
      },

      /**
       * (2) 'error' (Hata Durumu):
       * Observable (boru hattı) bir hata fırlattığında
       * (yani API 401 Unauthorized döndüğünde) burası çalışır.
       */
      error: (err: HttpErrorResponse) => {
        console.error('API Hatası:', err);
        // NestJS'ten gelen hata mesajını ayıklıyoruz
        this.apiError = `Hata: ${err.error?.message || 'Sunucuya bağlanılamadı'}`;
      },
    });
  }
}

