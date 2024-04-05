import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from '@herkansing-cswp/shared/util-env';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  endpoint = `${environment.dataApiUrl}` + '/user';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(id: string): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        return this.http.get(`${this.endpoint}/${id}`, { headers });
      })
    );
  }


  updateUser(id: string, user: any): Observable<any> {
    return this.authService.getToken().pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
        console.log('Updating user:', user);
        console.log('Token:', token);
        return this.http.put(`${this.endpoint}/${id}`, user, { headers });
      })
    );
  }
}