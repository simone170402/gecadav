import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Publication, PublicationListItem, PublicationRequest, PublicationType } from './publication.model';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getPublications(type: PublicationType, category?: string): Observable<PublicationListItem[]> {
    let params = new HttpParams().set('type', type);

    if (category && category !== 'Tous') {
      params = params.set('category', category);
    }

    return this.http.get<PublicationListItem[]>(`${this.apiUrl}/publications`, { params });
  }

  getBySlug(slug: string, userEmail?: string): Observable<Publication> {
    let params = new HttpParams();

    if (userEmail) {
      params = params.set('userEmail', userEmail);
    }

    return this.http.get<Publication>(`${this.apiUrl}/publications/${slug}`, { params });
  }

  getAdminPublicationById(id: number): Observable<Publication> {
    return this.http.get<Publication>(`${this.apiUrl}/admin/publications/${id}`);
  }

  getAdminPublications(): Observable<PublicationListItem[]> {
    return this.http.get<PublicationListItem[]>(`${this.apiUrl}/admin/publications`);
  }

  createPublication(payload: PublicationRequest): Observable<Publication> {
    return this.http.post<Publication>(`${this.apiUrl}/admin/publications`, payload);
  }

  updatePublication(id: number, payload: PublicationRequest): Observable<Publication> {
    return this.http.put<Publication>(`${this.apiUrl}/admin/publications/${id}`, payload);
  }

  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/publications/${id}`);
  }
}