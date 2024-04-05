import { Component } from '@angular/core';
import { AuthService } from '@herkansing-cswp/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'stijns-burgers-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent {

  isAdmin$!: boolean;
  isLoggedIn$!: boolean;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAdmin$().subscribe(isAdmin => {
      this.isAdmin$ = isAdmin;
      console.log("isAdmin$:" + this.isAdmin$);
    });

    this.authService.isLoggedIn$().subscribe(isLoggedIn => {
      this.isLoggedIn$ = isLoggedIn;
      console.log("isLoggedIn$:" + this.isLoggedIn$);
    });
  }

  logout(): void {
    this.authService.logout();
  }

  profile(): void {
    this.router.navigate(['/profile']);
  }
}