import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { RendezVous } from './rendezvous.model'

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {

  private http = inject(HttpClient)
  private api = 'http://localhost:8080/api/rendezvous'

  getAll(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(this.api)
  }

  create(rdv: RendezVous): Observable<RendezVous> {
    return this.http.post<RendezVous>(this.api, rdv)
  }

  update(id: number, rdv: RendezVous): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.api}/${id}`, rdv)
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`)
  }
}