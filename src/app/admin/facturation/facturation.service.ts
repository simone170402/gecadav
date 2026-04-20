import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FactureItem, FactureStats } from './facturation.model';

@Injectable({
  providedIn: 'root'
})
export class FacturationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/factures';

  getAll(): Observable<FactureItem[]> {
    return this.http.get<FactureItem[]>(this.apiUrl);
  }

  getStats(): Observable<FactureStats> {
    return this.http.get<FactureStats>(`${this.apiUrl}/stats`);
  }

  getById(id: number): Observable<FactureItem> {
    return this.http.get<FactureItem>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<FactureItem>): Observable<FactureItem> {
    return this.http.post<FactureItem>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<FactureItem>): Observable<FactureItem> {
    return this.http.put<FactureItem>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPdfUrl(id: number): string {
    return `${this.apiUrl}/${id}/pdf`;
  }
}