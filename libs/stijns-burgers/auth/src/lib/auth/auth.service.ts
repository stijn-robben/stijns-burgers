/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@herkansing-cswp/shared/api';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '@herkansing-cswp/shared/util-env';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = `${environment.dataApiUrl}` + '/auth';
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  private readonly storageKey = 'currentUser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeUser();
  }

  // Initialize user from storage upon service creation
  private initializeUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.getUserFromStorage();
      console.log('InitializeUser - User from storage:', user);
  
      if (user) {
        this.validateToken(user).subscribe((validatedUser) => {
          console.log('InitializeUser - Token validation response:', validatedUser);
          if (validatedUser) {
            this.currentUserSubject.next(validatedUser);
          } else {
            this.currentUserSubject.next(null);
          }
        });
      }
    }
  }
  
  getToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.token || null;
  }
  
  login(emailAddress: string, password: string): Observable<IUser | null> {
    return this.http
      .post<{ results: { access_token: { user: IUser, token: string } } }>(
        `${this.endpoint}/login`,
        { emailAddress, password },
        { headers: this.headers }
      )
      .pipe(
        map(response => {
          console.log('Login response:', response);
          const userWithToken = response.results.access_token;
          const user = userWithToken.user;
          const token = user.token;
          console.log('token: ' + token);
          user.token = token;
          this.saveUserToStorage(user);
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          // Handle errors
          let errorMessage = 'Inloggen mislukt. Controleer uw inloggegevens.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // Register a new user and handle response
  register(userData: IUser): Observable<IUser | null> {
    return this.http
      .post<IUser>(`${this.endpoint}/register`, userData, { headers: this.headers })
      .pipe(
        map(response => this.handleLoginResponse(response)),
        catchError(this.handleError('register'))
      );
  }

  // Handle login/register response
  private handleLoginResponse(user: IUser): IUser {
    // this.saveUserToStorage(user);
    // this.currentUserSubject.next(user);
    return user;
  }

  // Validate user token
  validateToken(userData: IUser): Observable<IUser | null> {
    console.log('validateToken binnen VlaidateToken', userData.token);
    const url = `${this.endpoint}/profile`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData.token,
      }),
    };
  
    console.log('Starting token validation for user:', userData);
  
    return this.http.get<IUser>(url, httpOptions).pipe(
      map((response) => {
        console.log('Token validation successful, user data:', userData);
        console.log('Token validation successful, response data:', response);
        return userData;
      }),
      catchError((error: any) => {
        console.error('Token validation failed:', error.message);
        this.logout();
        console.log('User has been logged out due to token validation failure.');
        return of(null);
      })
    );
  }
  

  // Retrieve user from storage
  public getUserFromStorage(): IUser | null {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = sessionStorage.getItem(this.storageKey);
      console.log('storedUser:', JSON.parse(storedUser!));
      return storedUser ? JSON.parse(storedUser) : null;
    }
    // If not in a browser environment, gracefully handle the absence of sessionStorage
    return null;
  }

  // Save user to storage
  protected saveUserToStorage(user: IUser): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  // Log out the current user
  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
}


  // Check if the current user is an admin
  isAdmin$(): Observable<boolean> {
    return this.currentUserSubject.asObservable().pipe(
      map(user => user?.role === 'admin'),
    );
  }

  // Get the current user's role
  getCurrentUserRole(): string {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser ? currentUser.role : 'guest';
  }

  // Centralized error handling method
  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      const errorMessage = error.error?.message || 'An error occurred during ' + operation;
      return throwError(() => new Error(errorMessage));
    };
  }

  // Accessor for the current user Observable
  get currentUser$(): Observable<IUser | null> {
    return this.currentUserSubject.asObservable();
  }
  getCurrentUser(): IUser | null {
    console.log('currentUser', this.currentUserSubject.value?._id);
    return this.currentUserSubject.value;
  }
  canEdit(userId: string): boolean {
    const currentUser = this.getCurrentUser();
    return !!currentUser && (currentUser._id === userId || currentUser.role === 'admin');
  }
  // Check if the user is logged in
  public isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map(user => !!user)
  );
  forceValidateCurrentUser(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.validateToken(user).subscribe(validatedUser => {
        this.currentUserSubject.next(validatedUser ? user : null);
      });
    }
  }
}
