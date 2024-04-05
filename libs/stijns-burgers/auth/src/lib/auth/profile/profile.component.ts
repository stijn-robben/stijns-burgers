import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from "../auth.service";
import { IUser, UserRole } from '@herkansing-cswp/shared/api';
import { ProfileService } from "./profile.service";
@Component({
  selector: '@stijns-burgers-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: IUser;
  selectedOption = 'user';
  isEditable = false;
  editMode = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService, private profileService: ProfileService) {
    // Initialize currentUser with default values
    this.currentUser = {
      _id: '', // You may want to handle this differently
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '', // You may want to handle this differently
      birthdate: new Date(),
      role: UserRole.user, // Assuming UserRole is an enum and User is a valid value
      postalCode: '',
      houseNumber: '',
      phoneNumber: '',
      cart: [],
      orders: [],
      reviews: []
      // Add other properties as needed
    };
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log('User:', user); // Log the user object
        if (user) {
          user.reviews = user.reviews.flat();
          this.currentUser = user;
        }
      });
  }

  logout(): void {
    this.authService.logout();
  }

  

  updateUser(user: IUser): void {
  console.log('Profile component:' + user)
  this.profileService.updateUser(this.currentUser._id, this.currentUser)
    .subscribe(updatedUser => {
      console.log('Updated user:', updatedUser);
      this.currentUser = updatedUser;
      this.editMode = false;
    });
}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}