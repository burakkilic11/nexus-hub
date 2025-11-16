import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

// Note arayüzü (Interface)
export interface Note {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private http = inject(HttpClient);
  
  // API adresi
  private apiUrl = '/api/notes';

  constructor() {}

  /**
   * GET /notes
   */
  getNotes(): Observable<Note[]> {
    return this.http
      .get<Note[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Get Notes API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * POST /notes
   */
  createNote(content: string): Observable<Note> {
    const body = { content: content };
    
    return this.http
      .post<Note>(this.apiUrl, body) 
      .pipe(
        catchError((error) => {
          console.error('Create Note API Hatası:', error);
          return throwError(() => error);
        }),
      );
  }
}
