import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { UiModule } from '@herkansing-cswp/ui';
import { FeaturesModule } from '@herkansing-cswp/features';
import { AuthModule } from '@herkansing-cswp/auth';


@Component({
  standalone: true,
  imports: [RouterModule, FeaturesModule, UiModule, RouterLinkActive, AuthModule],
  selector: 'stijns-burgers-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'stijns-burgers-web';
} 