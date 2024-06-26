import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { UiModule } from '@herkansing-cswp/ui';
import { FeaturesModule } from '@herkansing-cswp/features';
import { AuthModule, AuthService } from '@herkansing-cswp/auth';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule, UiModule, RouterLinkActive, AuthModule, MatChipsModule, MatFormFieldModule],
  selector: 'stijns-burgers-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'stijns-burgers-web';

  constructor(private authService: AuthService) {} // Inject AuthService

  ngOnInit() {
    console.log('checking if there is a user in local storage')
    this.authService.checkUserAuthentication();
  }
} 