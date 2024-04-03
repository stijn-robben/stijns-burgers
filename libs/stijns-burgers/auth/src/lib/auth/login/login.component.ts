import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from '@herkansing-cswp/shared/api';

@Component({
  selector: '@stijns-burgers-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
    hidePassword = true;
  subs: Subscription = new Subscription(); // Initialize this.subs as a new Subscription
  submitted = false;
  loginError = false;
  userId: string | null = null;
  errorMessage: string | null = null;
  user = {
    emailAddress: '',
    password: ''
  };

  

  loginForm: FormGroup = new FormGroup({
    emailAddress: new FormControl(null, [
      Validators.required,
      this.validEmail.bind(this),
    ]),
    password: new FormControl(null, [
      Validators.required,
      this.validPassword.bind(this),
    ]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }


  save(form: NgForm): void {
    if (form.valid) {
      // Implement your save logic here
      // You can access the form values with form.value
      console.log(form.value.emailAddress, form.value.password);
    }
  }

  ngOnInit(): void {
    if (this.authService) { // Check if this.authService is not null
      const user = this.authService.getUserFromStorage(); // Get the user directly
      if (user) {
        console.log('User already logged in > to profile', user.emailAddress);
      }
      this.subs.add(this.authService.currentUser$.subscribe({
        next: (user: IUser | null) => {
          if (user && user._id) { // Check if user and user._id are not null
            this.userId = user._id; // Set this.userId
            this.router.navigate([`profile`]); // Navigate here
          }
        },
        error: (error) => {
          console.error('Error getting user information:', error);
        },
      }));
    }
  }


  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.submitted = true;
      const email = this.loginForm.value.emailAddress;
      const password = this.loginForm.value.password;
      this.authService.login(email, password).subscribe(
        (user: IUser | null) => {
          if (user) {
            console.log('Logged in');
            console.log('User logged in', user._id, this.userId, user.emailAddress, user.role);
            this.router.navigate(['/']);
            this.errorMessage = null; // Clear any previous error message
          }
        },
        (error: Error) => {
          // Error during login
          this.errorMessage = error.message; // Set the error message to the one from the error
          this.submitted = false;
        }
      );
    } else {
      this.submitted = false;
      console.error('loginForm invalid');
      this.errorMessage = 'The form is invalid.'; // Set the error message
    }
  }
  validEmail(control: FormControl): {[s: string]: boolean} | null {
    // Check if the control's value is a valid email address.
    // This is just a simple check; you might want to use a more comprehensive regex in a real application.
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(control.value)) {
      // If the control's value is not a valid email address, return an error object.
      return {invalidEmail: true};
    }
  
    // If the control's value is a valid email address, return null.
    return null;
  }
  
  validPassword(control: FormControl): {[s: string]: boolean} | null {
    // Check if the control's value is null or if it's a valid password.
    // This is just a simple check; you might want to use a more comprehensive check in a real application.
    if (control.value === null || control.value.length < 7) {
      // If the control's value is null or not a valid password, return an error object.
      return {invalidPassword: true};
    }
  
    // If the control's value is a valid password, return null.
    return null;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  
}