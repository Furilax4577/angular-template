import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ConsentService } from '../../services/consent.service';
import { AnalyticsService } from '../../services/analytics.service';
import { TrackingManagerService } from '../../services/tracking-manager.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CookieBannerComponent implements OnInit {
  shouldShowBanner = false;
  isBrowser = false;

  constructor(
    private consentService: ConsentService,
    private analyticsService: AnalyticsService,
    private trackingManagerService: TrackingManagerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (!this.isBrowser) return; // ❌ ne pas afficher côté serveur

    this.shouldShowBanner = !this.consentService.getConsent();

    if (this.consentService.hasAnalyticsConsent()) {
      this.analyticsService.init();
    }
  }

  accept(): void {
    this.consentService.giveConsent({ analytics: true });
    this.trackingManagerService.forceInitFromConsent();
    this.shouldShowBanner = false;
  }

  refuse(): void {
    this.consentService.giveConsent({ analytics: false });
    this.shouldShowBanner = false;
  }
}
