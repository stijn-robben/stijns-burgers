import { Component } from '@angular/core';
import { AuthService } from '@herkansing-cswp/auth';

@Component({
  selector: 'stijns-burgers-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {

  isAdmin$!: boolean;
  isLoggedIn$!: boolean;
  constructor(private authService:AuthService) {
    this.authService.isAdmin$().subscribe(isAdmin => {
      this.isAdmin$ = isAdmin;
      console.log("isAdmin$:" + this.isAdmin$);
    });

    this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      this.isLoggedIn$ = !isLoggedIn;
      console.log("isLoggedIn$:" + this.isLoggedIn$);
    });
  }



}