import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RendezVousItem } from './rendezvous.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/rendezvous`;

  getAll(): Observable<RendezVousItem[]> {
    return this.http.get<RendezVousItem[]>(this.apiUrl);
  }

  getUpcoming(): Observable<RendezVousItem[]> {
    return this.http.get<RendezVousItem[]>(`${this.apiUrl}/upcoming`);
  }

  create(payload: Partial<RendezVousItem>): Observable<RendezVousItem> {
    return this.http.post<RendezVousItem>(this.apiUrl, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}