import { Injectable } from '@angular/core';
import { LocalWebStorageService } from './local-web-storage.service';

export interface CookieConsent {
  analytics: boolean;
}

const CONSENT_KEY = 'cookieConsent';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  constructor(private storage: LocalWebStorageService) {}

  getConsent(): CookieConsent | null {
    return this.storage.getItem<CookieConsent>(CONSENT_KEY);
  }

  hasAnalyticsConsent(): boolean {
    const consent = this.getConsent();
    return consent?.analytics === true;
  }

  giveConsent(consent: CookieConsent): void {
    this.storage.setItem(CONSENT_KEY, consent);
  }

  revokeConsent(): void {
    this.storage.removeItem(CONSENT_KEY);
  }
}
