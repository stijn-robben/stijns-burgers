import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from "../auth.service";
import { IUser } from '@herkansing-cswp/shared/api';

@Component({
  selector: '@stijns-burgers-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: IUser | null | undefined;
  selectedOption = 'user';
  isEditable = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log('User:', user); // Log the user object
        this.currentUser = user;
      });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}