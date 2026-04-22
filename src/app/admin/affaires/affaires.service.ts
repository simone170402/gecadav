import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AffaireItem, AffaireStats } from './affaires.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AffairesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/affaires`;

  getAll(): Observable<AffaireItem[]> {
    return this.http.get<AffaireItem[]>(this.apiUrl);
  }

  getStats(): Observable<AffaireStats> {
    return this.http.get<AffaireStats>(`${this.apiUrl}/stats`);
  }

  create(payload: Partial<AffaireItem>): Observable<AffaireItem> {
    return this.http.post<AffaireItem>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<AffaireItem>): Observable<AffaireItem> {
    return this.http.put<AffaireItem>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}