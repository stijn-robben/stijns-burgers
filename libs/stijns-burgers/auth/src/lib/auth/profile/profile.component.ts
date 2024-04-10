import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from "../auth.service";
import { IReview, IUser, IUserReviews, Review, UserRole } from '@herkansing-cswp/shared/api';
import { Router } from "@angular/router";

@Component({
  selector: '@stijns-burgers-profile',
  templateUrl: './profile.component.html',
})



export class ProfileComponent implements OnInit, OnDestroy {
  
  currentUser: IUser;
  selectedOption = 'user';
  isEditable = false;
  editMode = false;
  selectedOrderIndex: number | null = null;
  private unsubscribe$ = new Subject<void>();
  
  userReviews: IUserReviews | undefined;
  constructor(private authService: AuthService, private router: Router) {
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
      // Add other properties as needed
    };
    
    
  }
  
  // ProfileComponent
  ngOnInit(): void {
    this.authService.getProfile()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log('User:', user); // Log the user object
        this.currentUser = user;
  
        // Fetch the reviews of the user
        this.authService.getReviewsByUserId(user._id)
          .subscribe(reviews => {
            console.log('Reviews:', reviews);
            this.userReviews = reviews;
          });
      });
  }
  logout(): void {
    this.authService.logout();
  }

  updateUser(user: IUser): void {
    console.log('Profile component:' + user)
    // Update currentUser immediately
    this.currentUser = { ...this.currentUser, ...user };
    this.authService.updateUser(this.currentUser._id, this.currentUser)
      .subscribe(updatedUser => {
        console.log('Updated user:', updatedUser);
        // Refresh currentUser with the data from the server
        this.currentUser = updatedUser;
        this.editMode = false;
      });
      //here
      this.authService.getProfile()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log('User:', user); // Log the user object
        this.currentUser = user;
  
        // Fetch the reviews of the user
        this.authService.getReviewsByUserId(user._id)
          .subscribe(reviews => {
            console.log('Reviews:', reviews);
            this.userReviews = reviews;
          });
      });

  }

  deleteUserReview(reviewId: string): void {
    if (this.currentUser && this.currentUser._id) {
      this.authService.deleteReview(reviewId, this.currentUser._id)
        .subscribe(() => {
          console.log('Deleted review:', reviewId);
          // Remove the deleted review from userReviews
          if (this.userReviews && this.userReviews.reviews) {
            const index = this.userReviews.reviews.findIndex(r => r._id === reviewId);
            if (index !== -1) {
              this.userReviews.reviews.splice(index, 1);
            }
          }
        });
    } else {
      console.error('Current user or user ID is undefined');
    }
  }
  
  isAdmin(): Observable<boolean> {
    return this.authService.isAdmin()
      .pipe(
        tap((isAdmin: any) => console.log('User is admin:', isAdmin))
      );
  }
  updateReview(review: Review): void {
    if (review && review._id) {
      this.authService.updateReview(review._id, review)
        .subscribe(updatedReview => {
          console.log('Updated review:', updatedReview);
          // Refresh userReviews with the updated review
          if (this.userReviews && this.userReviews.reviews) {
            const index = this.userReviews.reviews.findIndex(r => r._id === updatedReview._id);
            if (index !== -1) {
              this.userReviews.reviews[index] = updatedReview;
            }
          } else {
            console.error('userReviews or userReviews.reviews is undefined');
          }
        });
    } else {
      console.error('Review or review ID is undefined');
    }
    this.authService.getProfile()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        console.log('User:', user); // Log the user object
        this.currentUser = user;
  
        // Fetch the reviews of the user
        this.authService.getReviewsByUserId(user._id)
          .subscribe(reviews => {
            console.log('Reviews:', reviews);
            this.userReviews = reviews;
          });
      });

  }    

  deleteCurrentUser(): void {
    if (this.currentUser && this.currentUser._id) {
      this.authService.deleteUser(this.currentUser._id)
        .subscribe(
          () => {
            console.log('User deleted successfully');
            // Redirect to the login page or home page
            this.router.navigate(['/login']);
          },
          error => {
            console.error('Error deleting user:', error);
          }
        );
    } else {
      console.error('Current user or user ID is undefined');
    }
  }
  
  forceRefresh(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile']);
    });
  }  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}