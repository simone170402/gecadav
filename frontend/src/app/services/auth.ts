import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(email: string, password: string, rememberMe = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (!this.isBrowser()) return;

        const storage = rememberMe ? localStorage : sessionStorage;

        localStorage.removeItem('cabinet_token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('role');

        sessionStorage.removeItem('cabinet_token');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('role');

        storage.setItem('cabinet_token', response.token);
        storage.setItem('userEmail', response.email);
        storage.setItem('role', response.role);
      })
    );
  }

  logout(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem('cabinet_token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');

    sessionStorage.removeItem('cabinet_token');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('role');
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;

    return localStorage.getItem('cabinet_token')
      || sessionStorage.getItem('cabinet_token');
  }

  getEmail(): string | null {
    if (!this.isBrowser()) return null;

    return localStorage.getItem('userEmail')
      || sessionStorage.getItem('userEmail');
  }

  getRole(): string | null {
    if (!this.isBrowser()) return null;

    return localStorage.getItem('role')
      || sessionStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isAvocat(): boolean {
    return this.getRole() === 'AVOCAT';
  }

  isSecretaire(): boolean {
    return this.getRole() === 'SECRETAIRE';
  }

  isComptable(): boolean {
    return this.getRole() === 'COMPTABLE';
  }
}