import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcurationItem, ProcurationStats } from './procurations.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcurationsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/procurations`;

  getAll(): Observable<ProcurationItem[]> {
    return this.http.get<ProcurationItem[]>(this.apiUrl);
  }

  getStats(): Observable<ProcurationStats> {
    return this.http.get<ProcurationStats>(`${this.apiUrl}/stats`);
  }

  create(payload: Partial<ProcurationItem>): Observable<ProcurationItem> {
    return this.http.post<ProcurationItem>(this.apiUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<ProcurationItem> {
    return this.http.get<ProcurationItem>(`${this.apiUrl}/${id}`);
  }

  update(id: number, payload: Partial<ProcurationItem>): Observable<ProcurationItem> {
    return this.http.put<ProcurationItem>(`${this.apiUrl}/${id}`, payload);
  }
  getPdfUrl(id: number): string {
    return `${this.apiUrl}/${id}/pdf`;
    }
}