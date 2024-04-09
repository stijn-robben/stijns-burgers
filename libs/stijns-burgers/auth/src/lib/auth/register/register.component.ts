import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '@herkansing-cswp/backend/dto';
import { Router } from '@angular/router';
import { UserRole } from '@herkansing-cswp/shared/api';

@Component({
  selector: 'stijns-burgers-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      _id: [''],
      birthdate: [new Date()],
      role: [UserRole.user],
      postalCode: [''],
      houseNumber: [''],
      phoneNumber: [''],
      cart: [[]],
      orders: [[]],
      reviews: [[]]
    });
  }


  save(): void {
    if (this.registerForm.valid) {
      const data: CreateUserDto = this.registerForm.value;
      this.authService.createUser(data).then(user => {
        console.log('User created', user);
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error('User creation failed', error);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}