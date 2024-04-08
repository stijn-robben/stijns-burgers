import { Injectable } from '@angular/core';
import { IUser } from '@herkansing-cswp/shared/api';
import { IOrder } from '@herkansing-cswp/shared/api';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@herkansing-cswp/shared/util-env';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from '@herkansing-cswp/auth';


export interface IOrderWithUser extends IOrder {
  userFirstName?: string;
  userLastName?: string;
}

@Injectable()
export class OrdersService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    getAllOrders(): Promise<IOrderWithUser[]> {
        return new Promise<IOrderWithUser[]>((resolve, reject) => {
          this.authService.getToken().subscribe(token => {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            this.http.get(`${environment.dataApiUrl}/user`, { headers }).toPromise()
              .then((response: any) => {
                console.log('Response:', response);  // Log the entire response
      
                if (response && Array.isArray(response)) {
                    const users: IUser[] = response;
                    const orders: IOrderWithUser[] = [];

                    users.forEach(user => {
                      if (user.orders.length > 0) {
                        user.orders.forEach(order => {
                          // Create a new order object that includes the user's first and last name
                          const orderWithUser: IOrderWithUser = {
                            ...order,
                            userFirstName: user.firstName,
                            userLastName: user.lastName
                          };
                          orders.push(orderWithUser);
                        });
                      }
                      // else, user has no orders, and we're ignoring them
                    });

                    resolve(orders);
                  } else {
                    reject('No data received from the server');
                  }
              })
              .catch(error => {
                reject(error);
              });
          }, error => reject(error));
        });
}}