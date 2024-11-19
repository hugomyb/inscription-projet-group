import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

/**
 * The main configuration object for the Angular application.
 * It sets up essential providers for routing, change detection, animations, and toast notifications.
 * @type {ApplicationConfig}
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Enables optimized zone-based change detection with event coalescing.
     * This helps reduce the number of change detection cycles in the application.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),

    /**
     * Provides the application's routing configuration.
     * Uses the routes defined in the `app.routes.ts` file.
     */
    provideRouter(routes),

    /**
     * Imports providers for external modules required by the application.
     * Includes the BrowserAnimationsModule for animations and ToastrModule for toast notifications.
     */
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot()
    ),

    /**
     * Provides the HttpClient service to make HTTP requests.
     * Uses the default configuration for the HttpClient service.
     */
    provideHttpClient(),

    /**
     * Configures the location strategy to use the hash-based routing.
     * This strategy adds a hash (#) to the URLs for browser compatibility.
     */
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
