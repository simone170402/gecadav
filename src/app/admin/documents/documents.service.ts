import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentItem, DocumentStats } from './documents.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/documents`;

  getAll(): Observable<DocumentItem[]> {
    return this.http.get<DocumentItem[]>(this.apiUrl);
  }

  getStats(): Observable<DocumentStats> {
    return this.http.get<DocumentStats>(`${this.apiUrl}/stats`);
  }

  upload(formData: FormData): Observable<DocumentItem> {
    return this.http.post<DocumentItem>(`${this.apiUrl}/upload`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDownloadUrl(id: number): string {
    return `${this.apiUrl}/${id}/download`;
  }
}