import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@herkansing-cswp/shared/util-env';
import { IUser } from '@herkansing-cswp/shared/api';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = `${environment.dataApiUrl}` + '/auth';
  private storageKey = 'currentUser';
  private currentUserSubject: BehaviorSubject<IUser | null>;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.currentUserSubject = new BehaviorSubject<IUser | null>(this.getUserFromStorage());
  }

  // Initialize user from storage upon service creation
   getUserFromStorage(): IUser | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem(this.storageKey);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  login(emailAddress: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.endpoint}/login`, { emailAddress, password }, { headers: this.headers })
      .pipe(
        tap(user => {
          if (user) { // Check if user is not undefined
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem(this.storageKey, JSON.stringify(user));
            }
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  isAdmin$(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      tap(user => console.log('User:', user)), // Log the entire user object
      map((user: any) => user !== null && user.access_token.user.role === 'admin')    );
  }

  logout(): void {
    // Remove user from local storage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  
    // Set current user to null
    this.currentUserSubject.next(null);
  
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // Method to get the current user
  getCurrentUser(): Observable<IUser | null> {
    return this.currentUserSubject.asObservable().pipe(
      map(token => token ? (token as any).access_token.user : null)
    );
  }

  getCurrentUserRole(): Observable<string | null> {
    return this.currentUserSubject.asObservable().pipe(
      map(user => user ? user.role : null)
    );
  }

  checkUserAuthentication(): void {
    const userJson = localStorage.getItem(this.storageKey);
    if (userJson) {
      const user = JSON.parse(userJson) as IUser;
      this.currentUserSubject.next(user);
    }
  }

  getToken(): string | null {
    const userJson = localStorage.getItem(this.storageKey);
    if (userJson) {
      const user = JSON.parse(userJson) as IUser;
      return user.token ? user.token : null;
    }
    return null;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      map(user => !!user)
    );
  }
}