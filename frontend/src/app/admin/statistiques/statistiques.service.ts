import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatistiquesDashboard } from './statistiques.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/statistiques`;

  getDashboard(): Observable<StatistiquesDashboard> {
    return this.http.get<StatistiquesDashboard>(`${this.apiUrl}/dashboard`);
  }
}