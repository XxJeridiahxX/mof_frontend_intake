import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  private v1BaseUrl = environment.apiV1BaseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('intake_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body, {
      headers: this.getHeaders(),
    });
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body, {
      headers: this.getHeaders(),
    });
  }

  getV1<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http.get<T>(`${this.v1BaseUrl}/${path}`, {
      headers: this.getHeaders(),
      params,
    });
  }

  postV1<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.v1BaseUrl}/${path}`, body, {
      headers: this.getHeaders(),
    });
  }
}
