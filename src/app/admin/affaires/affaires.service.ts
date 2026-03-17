import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Affaire } from './affaire.model';

@Injectable({
  providedIn: 'root'
})
export class AffairesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/affaires';

  getAffaires(): Observable<Affaire[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((affaires) =>
        affaires.map((affaire) => ({
          id: affaire.id,
          titre: affaire.titre,
          description: affaire.description,
          statut: affaire.statut,
          dateOuverture: affaire.dateOuverture,
          clientId: affaire.client?.id,
          clientNom: affaire.client ? `${affaire.client.nom} ${affaire.client.prenom}` : ''
        }))
      )
    );
  }

  createAffaire(affaire: Affaire): Observable<Affaire> {
    return this.http.post<Affaire>(this.apiUrl, affaire);
  }

  updateAffaire(id: number, affaire: Affaire): Observable<Affaire> {
    return this.http.put<Affaire>(`${this.apiUrl}/${id}`, affaire);
  }

  deleteAffaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}