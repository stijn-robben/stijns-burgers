import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './auth/profile/profile.component';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  declarations: [LoginComponent, ProfileComponent], 
  exports: [LoginComponent, ProfileComponent], 
  providers: [AuthService],
})
export class AuthModule { }

export { AuthService };