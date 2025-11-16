// client/src/app/watchlist/watchlist.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { WatchlistService, WatchlistItem } from '../watchlist.service'; 
import { HttpErrorResponse } from '@angular/common/http';

// <iframe> etiketine güvenli URL'ler sağlamak için
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './watchlist.html',
  styleUrl: './watchlist.scss',
})
export class Watchlist implements OnInit {
  // Gerekli servisleri 'inject' et
  private authService = inject(AuthService);
  private watchlistService = inject(WatchlistService);
  private router = inject(Router);
  
  private sanitizer = inject(DomSanitizer);

  // --- Component'in Durumu (State) ---
  
  // Yeni video URL'i için forma bağlanacak
  newVideoUrl: string = ''; // (Örn: https://www.youtube.com/...)
  
  // API'den gelen izleme listesi
  myWatchlist: WatchlistItem[] = [];
  
  // Ekranda hata göstermek için
  apiError: string = '';

  /**
   * Sayfa (Component) yüklendiğinde 1 kez çalışır
   */
  ngOnInit(): void {
    // Sayfa açılır açılmaz, kullanıcının videolarını API'den çek
    this.loadWatchlist();
  }

  /**
   * API'den izleme listesini çeken fonksiyon
   */
  loadWatchlist(): void {
    this.watchlistService.getWatchlist().subscribe({
      next: (videos: WatchlistItem[]) => {
        this.myWatchlist = videos;
      },
      error: (err: HttpErrorResponse) => {
        this.apiError = 'İzleme listesi yüklenemedi. Lütfen tekrar giriş yapın.';
      },
    });
  }

  /**
   * "Video Ekle" formu 'submit' edildiğinde çalışır
   */
  addVideo(): void {
    if (!this.newVideoUrl.trim()) return;

    this.watchlistService.addVideo(this.newVideoUrl).subscribe({
      next: (newVideoFromApi: WatchlistItem) => {
        // Başarılı: Yeni videoyu listeye ekle
        this.myWatchlist.unshift(newVideoFromApi);
        // Input'u temizle
        this.newVideoUrl = '';
        this.apiError = ''; 
      },
      error: (err: HttpErrorResponse) => {
        this.apiError = `Hata: ${err.error?.message || 'Video eklenemedi'}`;
      },
    });
  }

  /**
   * Çıkış Yap Fonksiyonu
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --- YENİ EKLENDİ (KRİTİK GÜVENLİK FONKSİYONU) ---
  /**
   * 'videoId'yi alır ve '<iframe>' için "güvenli" (safe)
   * bir 'embed' URL'ine dönüştürür.
   */
  getSafeVideoUrl(videoId: string): SafeResourceUrl {
    // 1. YouTube 'embed' URL'ini oluştur
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    // 2. DomSanitizer'a "Ben bu URL'e güveniyorum, onu XSS saldırısı olarak engelleme" diyor
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}