import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatistiquesDashboard } from './statistiques.model';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/statistiques';

  getDashboard(): Observable<StatistiquesDashboard> {
    return this.http.get<StatistiquesDashboard>(`${this.apiUrl}/dashboard`);
  }
}