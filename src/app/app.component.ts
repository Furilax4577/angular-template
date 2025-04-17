import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TrackingManagerService } from './services/tracking-manager.service';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { Meta, Title } from '@angular/platform-browser';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CookieBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private trackingManager: TrackingManagerService,
    private configService: ConfigService,
    private meta: Meta,
    private title: Title
  ) {
    console.log('config:', this.configService.getConfig());
    this.title.setTitle('Angular project');
    this.meta.updateTag({
      name: 'description',
      content: 'Angular project description',
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'angular, project',
    });
  }

  ngOnInit(): void {
    this.trackingManager.initIfConsented();
  }
}
