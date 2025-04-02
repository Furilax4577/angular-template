import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TrackingManagerService } from './services/tracking-manager.service';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CookieBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private trackingManager: TrackingManagerService) {}
  ngOnInit(): void {
    this.trackingManager.initIfConsented();
  }
}
