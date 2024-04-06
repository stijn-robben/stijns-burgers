import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError, switchMap } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@herkansing-cswp/shared/util-env';
import { IUser } from '@herkansing-cswp/shared/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = `${environment.dataApiUrl}` + '/auth';
  userEndpoint = `${environment.dataApiUrl}` + '/user';
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

  getToken(): Observable<string> {
    const currentUser: any = this.currentUserSubject.value;
    console.log('Current user:', currentUser);  // Log the current user
    if (currentUser && currentUser.access_token && currentUser.access_token.user && currentUser.access_token.user.token) {
      console.log('Token getToken:', currentUser.access_token.user.token);  // Log the token
      return of(currentUser.access_token.user.token);
    } else {
      return throwError('No token found');
    }
  }
  
  isAdmin(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      tap(user => console.log('User isAdmin:', user)), // Log the user object
      map((user: any) => {
        const isAdmin = user && user.access_token && user.access_token.user ? user.access_token.user.role === 'admin' : false;
        console.log('Is Admin:', isAdmin); // Log the isAdmin value
        return isAdmin;
      })
    );
  }  
  
  isLoggedIn$(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      map(user => !!user)
    );
  }

  login(emailAddress: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.endpoint}/login`, { emailAddress, password }, { headers: this.headers })
      .pipe(
        tap(user => {
          if (user) { // Check if user is not undefined
            localStorage.setItem(this.storageKey, JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  checkUserAuthentication(): boolean {
    return !!this.getUserFromStorage();
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

  getCurrentUser(): Observable<IUser | null> {
    return this.currentUserSubject.asObservable().pipe(
      map((data: any) => data && data.access_token ? data.access_token.user : null)
    );
  }
  
  getCurrentUserReviews(): Observable<any> {
    return this.currentUserSubject.asObservable().pipe(
      tap((data: any) => console.log('Data:', data)), // Log the entire data object
      map((data: any) => data && data.access_token && data.access_token.user && data.access_token.user.reviews ? data.access_token.user.reviews.flat() : [])
    );
  }  getCurrentUserRole(): Observable<string | null> {
    return this.currentUserSubject.asObservable().pipe(
      map(user => user ? user.role : null)
    );
  }

  getUser(id: string): Observable<any> {
    return this.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.userEndpoint}/${id}`, { headers });
      })
    );
  }

  updateUser(id: string, user: any): Observable<IUser> {
    return this.getToken().pipe(
      tap(token => console.log('Token:', token)), // Log the token
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.put<IUser>(`${this.userEndpoint}/${id}`, user, { headers }).pipe(
          switchMap(() => {
            const headers = new HttpHeaders({
              'Authorization': `Bearer ${token}`
            });
            return this.http.get<IUser>(`${this.endpoint}/profile`, { headers });
          })
        );
      }),
      tap(updatedUser => {
        // Update currentUserSubject with the updated user
        this.currentUserSubject.next(updatedUser);
      })
    );
  }
  getProfile(): Observable<IUser> {
    return this.getToken().pipe(
      tap(token => console.log('Token:', token)), // Log the token
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get<IUser>(`${this.endpoint}/profile`, { headers });
      })
    );
  }}