import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipeStats, MembreEquipeItem, MembreProfil } from './equipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/equipe`;

  getAll(): Observable<MembreEquipeItem[]> {
    return this.http.get<MembreEquipeItem[]>(this.apiUrl);
  }

  getStats(): Observable<EquipeStats> {
    return this.http.get<EquipeStats>(`${this.apiUrl}/stats`);
  }

  create(payload: Partial<MembreEquipeItem>): Observable<MembreEquipeItem> {
    return this.http.post<MembreEquipeItem>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<MembreEquipeItem>): Observable<MembreEquipeItem> {
    return this.http.put<MembreEquipeItem>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProfil(id: number): Observable<MembreProfil> {
    return this.http.get<MembreProfil>(`${this.apiUrl}/${id}/profil`);
}
}