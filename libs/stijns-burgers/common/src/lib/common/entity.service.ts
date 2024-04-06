/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, InjectionToken } from "@angular/core";
import { ApiResponse } from "@herkansing-cswp/shared/api";
import { Observable, catchError, map, tap, throwError } from "rxjs";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { environment } from "@herkansing-cswp/shared/util-env";
import { AuthService } from "@herkansing-cswp/auth";

export const httpOptions = {
    observe: 'body' as const, 
    responseType: 'json' as const
};
export const ENDPOINT_SUFFIX = new InjectionToken<string>('EndpointSuffix');
@Injectable()
export class GenericService<T> {
    endpoint: string;

    constructor(
        protected readonly http: HttpClient,
        @Inject(ENDPOINT_SUFFIX) endpointSuffix: string,
        private authService:AuthService
        
    ) {
        this.endpoint = `${environment.dataApiUrl}${endpointSuffix}`;
    }
    // public list(options?: any): Observable<T[] | null> {
    //     console.log(`list ${this.endpoint}`);
    //     return this.http
    //         .get<ApiResponse<T[]>>(this.endpoint, {
    //             ...options,
    //             ...httpOptions,
    //         })
    //         .pipe(
    //             map((response: any) => response.results as T[]),
    //             tap(console.log),
    //             catchError(this.handleError)
    //         );
    // }
    public list(options?: any): Observable<T[] | null> {
      console.log(`list ${this.endpoint}`); // Log the endpoint URL
      const headers = this.getAuthHeader(); // Get the headers with the auth token
      return this.http
        .get<ApiResponse<T[]>>(this.endpoint, { headers, ...options })
        .pipe(
          map((response: any) => {
            console.log("Response: ", response); // Log the server response
            return response as T[]; // Change this line
          }),
          tap(console.log),
          catchError(this.handleError)
        );
    }
    
    
    public read(id: string | null, options?: any): Observable<T> {
      const url = this.endpoint + '/' + id?.toString();
      const headers = this.getAuthHeader();
      console.log(`read ${url}`);
      return this.http
        .get<ApiResponse<T>>(url, {
          headers,
          ...options,
        })
        .pipe(
          tap(console.log),
          map((response: any) => response as T),
          catchError(this.handleError)
        );
    }    public create(item: T): Observable<T> {
        console.log(`Creating a new item in ${this.endpoint}`);
        const url = this.endpoint + '/' + 'create';
         // Clone the object to avoid side effects
         const itemToCreate = { ...(item as object) }; 

         // Now you can safely check for the _id property and delete it if necessary
         if ('_id' in itemToCreate && itemToCreate['_id'] === '') {
           delete itemToCreate['_id'];
         }
        return this.http
            .post<ApiResponse<T>>(url, itemToCreate)
            .pipe(
                map((response: any) => response.results as T),
                tap(newItem => console.log('Created Item:', newItem)),
                catchError(this.handleError)
            );
    }
    public update(id: string, item: T): Observable<T> {
        console.log(`Updating item with ID: ${id} at ${this.endpoint}`);
        const headers = this.getAuthHeader();
        return this.http
          .put<ApiResponse<T>>(`${this.endpoint}/${id}`, item, { headers })
          .pipe(
            map((response: any) => response.results as T),
            tap(updatedItem => console.log('Updated Item:', updatedItem)),
            catchError(this.handleError)
          );
    }
    public delete(id: string): Observable<any> {
        console.log(`Deleting item with ID: ${id} from ${this.endpoint}`);
        const headers = this.getAuthHeader();
        return this.http.delete<ApiResponse<T>>(`${this.endpoint}/${id}`, { headers })
          .pipe(
            tap(() => console.log(`Deleted item with ID: ${id}`)),
            catchError(this.handleError)
          );
    }
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError', error);
        return throwError(() => new Error(error.message));
    }
    private getAuthHeader(): HttpHeaders {
      const token = this.authService.getToken();
      
        if (token) {
          return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token here
          });
        } else {
          return new HttpHeaders({
            'Content-Type': 'application/json'
          });
        }
    }
}
