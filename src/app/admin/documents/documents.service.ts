import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Document } from './document.model'

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private http = inject(HttpClient)

  private api = "http://localhost:8080/api/documents"

  getAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.api)
  }

  upload(formData: FormData): Observable<Document> {
    return this.http.post<Document>(this.api + "/upload", formData)
  }

  delete(id: number) {
    return this.http.delete(this.api + "/" + id)
  }

}