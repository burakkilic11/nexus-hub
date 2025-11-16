import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})

export class Dashboard {
  // Servisleri "enjekte" et
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    // 1. Token'ı localStorage'dan sil
    this.authService.logout();
    
    // 2. Kullanıcıyı /login sayfasına geri yönlendir
    this.router.navigate(['/login']);
  }
} 

