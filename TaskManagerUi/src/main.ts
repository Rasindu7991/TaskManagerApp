import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'zone.js';
import '@angular/compiler';
import { ɵresolveComponentResources as resolveComponentResourcesInternal } from '@angular/core';

(async () => {
  try {
    if (typeof resolveComponentResourcesInternal === 'function') {
    const maybePromise = (resolveComponentResourcesInternal as any)();
        if (maybePromise && typeof (maybePromise as any).then === 'function') {
          await maybePromise;
        }
    }
    await bootstrapApplication(App, appConfig);
  } catch (err) {
    console.error(err);
  }
})();
