import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientItem, ClientStats } from './clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/clients';

  getAll(): Observable<ClientItem[]> {
    return this.http.get<ClientItem[]>(this.apiUrl);
  }

  getStats(): Observable<ClientStats> {
    return this.http.get<ClientStats>(`${this.apiUrl}/stats`);
  }

  getById(id: number): Observable<ClientItem> {
    return this.http.get<ClientItem>(`${this.apiUrl}/${id}`);
  }

  create(payload: Partial<ClientItem>): Observable<ClientItem> {
    return this.http.post<ClientItem>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<ClientItem>): Observable<ClientItem> {
    return this.http.put<ClientItem>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}