import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICartItem, IMenuItem, IReview, IUser } from '@herkansing-cswp/shared/api';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from '@herkansing-cswp/auth';
import { Observable } from 'rxjs';
import { environment } from '@herkansing-cswp/shared/util-env';
import { GenericService } from '@herkansing-cswp/common';
@Injectable({
  providedIn: 'root'
})
export class CartService extends GenericService<IMenuItem> {
  constructor(http: HttpClient,authService: AuthService) {
    super(http, '/cart',authService);
  }

  getCartItems(): Observable<ICartItem[]> {
    return new Observable<ICartItem[]>(observer => {
      this.authService.getCurrentUser().subscribe(user => {
        if (user && user._id) {
          this.authService.getToken().subscribe(token => {
            let headers = new HttpHeaders();
            headers = headers.set('Authorization', `Bearer ${token}`);
            console.log(headers); // Log the headers to see if the Authorization header is correctly set
  
            this.http.get<ICartItem[]>(`${environment.dataApiUrl}/user/${user._id}/cart`, { headers })
              .subscribe(
                cartItems => {
                  observer.next(cartItems);
                  observer.complete();
                },
                error => observer.error(error)
              );
          }, error => observer.error(error));
        } else {
          observer.error('No user ID found');
        }
      }, error => observer.error(error));
    });
  }

  deleteCartItem(cartItemId: string): Observable<{ deleted: boolean; message?: string }> {
    return new Observable<{ deleted: boolean; message?: string }>(observer => {
        this.authService.getCurrentUser().subscribe(user => {
            if (user && user._id) {
                this.authService.getToken().subscribe(token => {
                    let headers = new HttpHeaders();
                    headers = headers.set('Authorization', `Bearer ${token}`);
                    console.log(headers); // Log the headers to see if the Authorization header is correctly set

                    this.http.delete<{ deleted: boolean; message?: string }>(`${environment.dataApiUrl}/user/${user._id}/cart/${cartItemId}`, { headers })
                        .subscribe(
                            response => {
                                observer.next(response);
                                observer.complete();
                            },
                            error => observer.error(error)
                        );
                }, error => observer.error(error));
            } else {
                observer.error('No user ID found');
            }
        }, error => observer.error(error));
    });
}

updateCartItem(cartItemId: string, quantity: number): Observable<IUser> {
  return new Observable<IUser>(observer => {
      this.authService.getCurrentUser().subscribe(user => {
          if (user && user._id) {
              this.authService.getToken().subscribe(token => {
                  let headers = new HttpHeaders();
                  headers = headers.set('Authorization', `Bearer ${token}`);
                  console.log(headers); // Log the headers to see if the Authorization header is correctly set

                  this.http.put<IUser>(`${environment.dataApiUrl}/user/${user._id}/cart/${cartItemId}`, { quantity }, { headers })
                      .subscribe(
                          response => {
                              observer.next(response);
                              observer.complete();
                          },
                          error => observer.error(error)
                      );
              }, error => observer.error(error));
          } else {
              observer.error('No user ID found');
          }
      }, error => observer.error(error));
  });
}

  
}