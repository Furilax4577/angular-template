import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private isBrowser: boolean;
  private gaMeasurementId = 'G-T8QE4Y4B0S'; // Remplacez par votre ID de mesure GA4

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Vérifie si on est dans le navigateur (et non sur le serveur)
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Initialise Google Analytics en injectant dynamiquement le script GA4
   * uniquement côté client.
   */
  public init(): void {
    if (!this.isBrowser) {
      // On est sur le serveur, on ne fait rien
      return;
    }

    // Vérifie si le script GA n’est pas déjà injecté
    if (!document.getElementById('ga-script')) {
      // Crée la balise script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaMeasurementId}`;
      script.id = 'ga-script';
      document.head.appendChild(script);

      // Initialise la configuration GA
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function gtag() {
        (window as any).dataLayer.push(arguments);
      };

      (window as any).gtag('js', new Date());
      (window as any).gtag('config', this.gaMeasurementId);
    }
  }

  /**
   * Envoie un événement personnalisé à Google Analytics.
   * @param eventName Nom de l'événement (ex: 'login', 'view_item', etc.)
   * @param eventParams Paramètres personnalisés (ex: { method: 'Google' })
   */
  public sendEvent(
    eventName: string,
    eventParams: Record<string, any> = {}
  ): void {
    if (!this.isBrowser) {
      return;
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  }

  /**
   * Exemple de méthode pour envoyer une vue de page (page_view).
   * @param pagePath Chemin de la page (ex: '/dashboard')
   */
  public sendPageView(pagePath: string): void {
    if (!this.isBrowser) {
      return;
    }
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pagePath,
      });
    }
  }
}
