// client/src/app/books/books.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // [(ngModel)]
import { Router, RouterLink } from '@angular/router'; // RouterLink
import { AuthService } from '../auth.service'; // 'logout' için
import { BooksService, Book } from '../books.service'; // Books API
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class Books implements OnInit {
  // Gerekli servisleri 'inject' et
  private authService = inject(AuthService);
  private booksService = inject(BooksService);
  private router = inject(Router);

  // --- Component'in Durumu (State) ---

  // Yeni kitap ekleme formu için
  newBookTitle: string = '';
  newBookUrl: string = '';

  // API'den gelen tüm kitapları tutacak ana dizi
  allBooks: Book[] = [];
  
  // Ekranda göstermek için filtrelenmiş diziler
  toReadBooks: Book[] = [];
  readBooks: Book[] = [];

  // Hata mesajları için
  addBookError: string = '';
  loadBooksError: string = '';

  /**
   * Sayfa (Component) yüklendiğinde 1 kez çalışır
   */
  ngOnInit(): void {
    this.loadBooks();
  }

  /**
   * API'den tüm kitapları çeken ve filtreleyen ana fonksiyon
   */
  loadBooks(): void {
    this.booksService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.allBooks = books;
        this.filterBooks(); // Kitapları iki listeye ayır
      },
      error: (err: HttpErrorResponse) => {
        this.loadBooksError = 'Kitaplar yüklenemedi. Lütfen tekrar giriş yapın.';
      },
    });
  }

  /**
   * Kitapları 'status'e göre iki ayrı diziye (array) ayırır
   */
  filterBooks(): void {
    this.toReadBooks = this.allBooks.filter(book => book.status === 'TO_READ');
    this.readBooks = this.allBooks.filter(book => book.status === 'READ');
  }

  /**
   * "Yeni Kitap Ekle" formu 'submit' edildiğinde çalışır
   */
  addBook(): void {
    if (!this.newBookTitle.trim() || !this.newBookUrl.trim()) {
      this.addBookError = 'Başlık ve URL alanları zorunludur.';
      return;
    }

    this.booksService.addBook(this.newBookTitle, this.newBookUrl).subscribe({
      next: (newBookFromApi: Book) => {
        // Yeni kitabı 'allBooks' dizisinin başına ekle
        this.allBooks.unshift(newBookFromApi);
        this.filterBooks(); // Listeleri yeniden filtrele
        
        // Formu temizle
        this.newBookTitle = '';
        this.newBookUrl = '';
        this.addBookError = '';
      },
      error: (err: HttpErrorResponse) => {
        this.addBookError = `Hata: ${err.error?.message || 'Kitap eklenemedi'}`;
      },
    });
  }

  /**
   * "Okundu Olarak İşaretle" butonuna tıklandığında çalışır
   */
  markAsRead(bookId: string): void {
    this.booksService.updateBookStatus(bookId, 'READ').subscribe({
      next: (updatedBook: Book) => {
        // 'allBooks' dizisindeki eski kitabı bul ve yenisiyle değiştir
        const index = this.allBooks.findIndex(b => b._id === updatedBook._id);
        if (index !== -1) {
          this.allBooks[index] = updatedBook;
        }
        this.filterBooks(); // Listeleri yeniden filtrele (kitap 'readBooks'a geçecek)
      },
      error: (err) => {
        console.error('Update Status Hatası:', err);
        // (Şimdilik basit hata yönetimi)
        alert('Kitap durumu güncellenemedi.');
      }
    });
  }
  
  saveReview(book: Book): void {
    
    // DÜZELTME: 'book.rating' 'undefined' (veya null) ise, '0' gönder.
    const ratingToSend = book.rating ?? 0;
    
    // DÜZELTME: 'book.comment' 'undefined' (veya null) ise, '' (boş string) gönder.
    const commentToSend = book.comment ?? '';
    
    this.booksService.updateBookReview(book._id, ratingToSend, commentToSend).subscribe({
      next: (updatedBook: Book) => {
        // 'allBooks' dizisindeki eski kitabı bul ve yenisiyle değiştir
        const index = this.allBooks.findIndex(b => b._id === updatedBook._id);
        if (index !== -1) {
          this.allBooks[index] = updatedBook;
        }
        this.filterBooks(); // (Gerekli değil ama iyi bir alışkanlık)
        alert('Yorum kaydedildi!');
      },
      error: (err) => {
        alert('Yorum kaydedilemedi.');
      }
    });
  }
  
  /**
   * "Favori" butonuna basıldığında çalışır
   */
  toggleFavorite(book: Book): void {
    this.booksService.toggleFavorite(book._id).subscribe({
      next: (updatedBook: Book) => {
        // 'allBooks' dizisindeki eski kitabı bul ve yenisiyle değiştir
        const index = this.allBooks.findIndex(b => b._id === updatedBook._id);
        if (index !== -1) {
          this.allBooks[index] = updatedBook;
        }
        this.filterBooks();
      },
      error: (err) => {
        alert('Favori durumu güncellenemedi.');
      }
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