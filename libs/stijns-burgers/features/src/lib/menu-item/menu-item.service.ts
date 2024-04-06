import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMenuItem } from '@herkansing-cswp/shared/api';
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
}