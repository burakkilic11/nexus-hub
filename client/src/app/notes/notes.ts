import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotesService, Note } from '../notes.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes implements OnInit {
  private authService = inject(AuthService);
  private notesService = inject(NotesService);
  private router = inject(Router);

  // --- Component'in Durumu (State) ---
  
  // Yeni not formunun 'input'una bağlanacak
  newNoteContent: string = ''; 
  
  // API'den gelen notları tutacak dizi
  myNotes: Note[] = [];
  
  // Ekranda hata göstermek için
  apiError: string = '';

  /**
   * Sayfa (Component) yüklendiğinde 1 kez çalışır
   */
  ngOnInit(): void {
    // Sayfa açılır açılmaz, kullanıcının notlarını API'den çek
    this.loadNotes();
  }

  /**
   * API'den notları çeken fonksiyon
   */
  loadNotes(): void {
    this.notesService.getNotes().subscribe({
      next: (notes: Note[]) => {
        // Başarılı: Gelen notları 'myNotes' dizisine ata
        this.myNotes = notes;
      },
      error: (err: HttpErrorResponse) => {
        this.apiError = 'Notlar yüklenemedi. Lütfen tekrar giriş yapın.';
        if (err.status === 401) {
        }
      },
    });
  }

  /**
   * "Yeni Not Ekle" formu 'submit' edildiğinde çalışır
   */
  addNote(): void {
    // Input boşsa bir şey yapma
    if (!this.newNoteContent.trim()) return;

    this.notesService.createNote(this.newNoteContent).subscribe({
      next: (newNoteFromApi: Note) => {
        // Başarılı: Yeni notu 'myNotes' dizisinin başına ekle
        // (Böylece anında ekranda görünür, 'loadNotes()'u tekrar çağırmaya gerek kalmaz)
        this.myNotes.unshift(newNoteFromApi);
        
        // Input'u temizle
        this.newNoteContent = '';
        this.apiError = ''; // Eski hataları temizle
      },
      error: (err: HttpErrorResponse) => {
        this.apiError = 'Not oluşturulamadı. Sunucu hatası.';
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
}
