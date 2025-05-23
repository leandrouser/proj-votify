import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth/login'; // ajuste conforme necessário

  private inactivityTimeout: any;
  private readonly INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutos

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }, { observe: 'response' })
      .pipe(
        tap(response => {
          const token = response.headers.get('Authorization');
          if (token) {
            localStorage.setItem('token', token);
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  startInactivityWatcher(logoutCallback: () => void) {
    this.resetInactivityTimer(logoutCallback);
    ['mousemove', 'keydown', 'click'].forEach(event =>
      window.addEventListener(event, () => this.resetInactivityTimer(logoutCallback))
    );
  }

  resetInactivityTimer(logoutCallback: () => void) {
    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logout();
      logoutCallback();
    }, this.INACTIVITY_LIMIT);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
  getUserById(id: number) {
  const token = this.getToken();
  const headers = token
    ? new HttpHeaders({ Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` })
    : undefined;
  return this.http.get<any>(
    `http://localhost:8080/api/v1/users/${id}`,
    headers ? { headers } : {}
  );
}
}