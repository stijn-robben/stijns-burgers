import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMenuItem, IReview } from '@herkansing-cswp/shared/api';
import { Injectable } from '@angular/core';
import { GenericService } from '@herkansing-cswp/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from '@herkansing-cswp/auth';
import { Observable } from 'rxjs';
import { environment } from '@herkansing-cswp/shared/util-env';
@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends GenericService<IMenuItem> {
  constructor(http: HttpClient,authService: AuthService) {
    super(http, '/menu-item',authService);
  }

  updateMenuItem(id: string, data: any): Observable<IMenuItem> {
    return new Observable<IMenuItem>(observer => {
      this.authService.getToken().subscribe(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        console.log('Headers:', headers);  // Log the headers
        this.http.put<IMenuItem>(`${environment.dataApiUrl}/menu-item/${id}`, data, { headers })
          .subscribe(
            result => {
              observer.next(result);
              observer.complete();
            },
            error => observer.error(error)
          );
      }, error => observer.error(error));
    });
  }

  createMenuItem(data: any): Observable<IMenuItem> {
    return new Observable<IMenuItem>(observer => {
      this.authService.getToken().subscribe(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        console.log('Headers:', headers);  // Log the headers
        this.http.post<IMenuItem>(`${environment.dataApiUrl}/menu-item`, data, { headers })
          .subscribe(
            result => {
              observer.next(result);
              observer.complete();
            },
            error => observer.error(error)
          );
      }, error => observer.error(error));
    });
  }

  deleteMenuItem(id: string): Observable<void> {
    return new Observable<void>(observer => {
      this.authService.getToken().subscribe(token => {

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        this.http.delete<void>(`${environment.dataApiUrl}/menu-item/${id}`, { headers })
          .subscribe(
            () => {
              observer.next();
              observer.complete();
            },
            error => observer.error(error)
          );
      }, error => observer.error(error));
    });
  }

  createReview(menuItemId: string, review: Omit<IReview, '_id'>): Observable<IMenuItem> {
    return new Observable<IMenuItem>(observer => {
      this.authService.getToken().subscribe(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const { description, score } = review;  // Directly access description and score from review
        this.http.post<IMenuItem>(`${environment.dataApiUrl}/menu-item/${menuItemId}/reviews`, {description, score}, { headers })
          .subscribe(
            menuItem => {
              observer.next(menuItem);
              observer.complete();
            },
            error => observer.error(error)
          );
      }, error => observer.error(error));
    });
  }
}