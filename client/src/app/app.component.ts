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
}

