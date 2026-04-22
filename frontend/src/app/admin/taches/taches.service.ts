import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TacheItem {
  id: number;
  titre: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  assignedTo: string;
}

@Injectable({ providedIn: 'root' })
export class TachesService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/api/taches`;

  getAll(): Observable<TacheItem[]> {
    return this.http.get<TacheItem[]>(this.api);
  }

  create(data: Partial<TacheItem>) {
    return this.http.post<TacheItem>(this.api, data);
  }

  toggle(id: number) {
    return this.http.put<TacheItem>(`${this.api}/${id}/toggle`, {});
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}