import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { IUser } from '@herkansing-cswp/shared/api';

@Component({
    selector: '@stijns-burgers-profile',
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  currentUser: IUser | null | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}