import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ConsentService } from './consent.service';
import { AnalyticsService } from './analytics.service';

@Injectable({ providedIn: 'root' })
export class TrackingManagerService {
  private isBrowser: boolean;
  private alreadyInitialized = false;
  private analyticsBypassConsent: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private consentService: ConsentService,
    private analyticsService: AnalyticsService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.analyticsBypassConsent = this.getBypassConsentFlag();

    if (this.analyticsBypassConsent) {
      this.startTracking();
    }
  }

  initIfConsented(): void {
    if (!this.isBrowser || this.alreadyInitialized) return;

    if (this.consentService.hasAnalyticsConsent()) {
      this.startTracking();
    }
  }

  forceInitFromConsent(): void {
    if (!this.isBrowser || this.alreadyInitialized) return;

    this.startTracking();
  }

  private startTracking(): void {
    this.analyticsService.init();
    this.trackPageViews();
    this.alreadyInitialized = true;
  }

  private trackPageViews(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.analyticsService.sendPageView(event.urlAfterRedirects);
      });
  }

  private getBypassConsentFlag(): boolean {
    if (!this.isBrowser) return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('bypassconsent') === 'true';
  }
}
