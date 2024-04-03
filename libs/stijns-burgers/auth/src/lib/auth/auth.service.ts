/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '@herkansing-cswp/shared/api';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
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
      .post<{ access_token: { user: IUser, token: string } }>(
        `${this.endpoint}/login`,
        { emailAddress, password },
        { headers: this.headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Inloggen mislukt. Controleer uw inloggegevens.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          console.error(errorMessage);
          return throwError(() => new Error(errorMessage));
        }),
    map(response => {
      console.log('Login response:', response);
  
      console.log('Accessing user from response...');
      const user = response.access_token.user;  // Corrected line
      console.log('User:', user);
  
      console.log('Accessing token from response...');
      const token = response.access_token.token;  // Corrected line
      console.log('Token:', token);
          console.log('Assigning token to user...');
          user.token = token;
          console.log('User after assigning token:', user);
          
          console.log('Saving user to storage...');
          this.saveUserToStorage(user);
          
          console.log('Updating currentUserSubject...');
          this.currentUserSubject.next(user);
          
          console.log('Returning user...');
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
  // Validate user token
  validateToken(userData: IUser): Observable<IUser | null> {
    this.logout();

    return of(null);

    // if (!userData || !userData.token || typeof userData.token !== 'string') {
    //   console.error('Invalid user data or token');
    //   this.logout();
    //   return of(null);
    // }
  
    // console.log('validateToken binnen VlaidateToken', userData.token);
    // const url = `${this.endpoint}/profile`;
  
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + userData.token,
    //   }),
    // };
  
    // console.log('Starting token validation for user:', userData);
  
    // return this.http.get<IUser>(url, httpOptions).pipe(
    //   map((response) => {
    //     console.log('Token validation successful, user data:', userData);
    //     console.log('Token validation successful, response data:', response);
    //     return userData;
    //   }),
    //   catchError((error: any) => {
    //     console.error('Token validation failed:', error.message);
    //     this.logout();
    //     console.log('User has been logged out due to token validation failure.');
    //     return of(null);
    //   })
    // );
  }
  

  // Retrieve user from storage
  public getUserFromStorage(): IUser | null {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      console.log('storedUser:', JSON.parse(storedUser!));
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  }

  // Save user to storage
  saveUserToStorage(user: IUser): void {
    console.log('saveUserToStorage called with:', user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Log out the current user
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
}


  // Check if the current user is an admin
  isAdmin$(): Observable<boolean> {
    console.log('isAdmin$ called')
    return this.currentUserSubject.asObservable().pipe(
      map(user => user?.role === 'admin'),
      tap(isAdmin => console.log('Is user admin?', isAdmin))

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

  isLoggedIn$(): Observable<boolean> {
    console.log('isLoggedIn$ called')
    return this.currentUserSubject.asObservable().pipe(
      map(user => !!user)

    );
  }

  forceValidateCurrentUser(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.validateToken(user).subscribe(validatedUser => {
        this.currentUserSubject.next(validatedUser ? user : null);
      });
    }
  }
  checkUserInLocalStorage() {
    const userItem = localStorage.getItem('currentUser');
    console.log('UserItem:', userItem);
    if (userItem !== null) {
      const user = JSON.parse(userItem);
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
  }
}
