import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiKeyInterceptor } from './interceptors/api-key.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    //enable zoneless change detection
    provideZoneChangeDetection({eventCoalescing: true}),

    //enable routing
    provideRouter(routes),

    //configure htto client and register interceptors
    provideHttpClient(
      withInterceptors([apiKeyInterceptor])
    ),
  ]
};
