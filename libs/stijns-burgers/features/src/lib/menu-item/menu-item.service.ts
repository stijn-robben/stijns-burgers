import { HttpClient } from '@angular/common/http';
import { IMenuItem } from '@herkansing-cswp/shared/api';
import { Injectable } from '@angular/core';
import { GenericService } from '@herkansing-cswp/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from '@herkansing-cswp/auth';
@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends GenericService<IMenuItem> {
  constructor(http: HttpClient,authService: AuthService) {
    super(http, '/menuitem',authService);
  }
}