import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.API_URL;
  private authenticated = false;
  private role: string = '';
  private userId: string = '';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.baseUrl}/login`, { email, password }).subscribe({
        next: (response: any) => {
          this.authenticated = true;
          this.userId = response.userId;
          this.role = response.role;
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          this.authenticated = false;
          this.userId = '';
          this.role = '';
          observer.error(err);
        },
      });
    });
  }

  getUserId(): string {
    return this.userId;
  }

  getRole(): string {
    return this.role;
  }

  isLoggedIn(): boolean {
    return this.authenticated;
  }

  logout(): void {
    this.authenticated = false;
    this.userId = '';
    this.role = '';
  }
}

