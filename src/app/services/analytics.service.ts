// src/app/services/analytics.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private trackingId = 'G-05JW2Z9EX1';
  private initialized = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  init(): void {
    if (!this.isBrowser || this.initialized) return;

    // Injecte le script gtag.js
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialise dataLayer et gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.trackingId, {
      send_page_view: true,
    });

    this.initialized = true;
  }

  sendEvent(eventName: string, params?: { [key: string]: any }) {
    console.log('sendPageView');
    if (this.isBrowser && window.gtag) {
      window.gtag('event', eventName, params || {});
    }
  }

  sendPageView(url: string) {
    console.log('sendPageView');
    if (this.isBrowser && window.gtag) {
      window.gtag('config', this.trackingId, {
        page_path: url,
      });
    }
  }
}
