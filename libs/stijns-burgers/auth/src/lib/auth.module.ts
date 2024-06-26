import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './auth/profile/profile.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { RegisterComponent } from './auth/register/register.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatChipsModule,
  ],
  declarations: [LoginComponent, ProfileComponent, RegisterComponent], 
  exports: [LoginComponent, ProfileComponent, RegisterComponent], 
  providers: [AuthService],
})
export class AuthModule { }

export { AuthService };