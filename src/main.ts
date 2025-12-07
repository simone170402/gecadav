import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import 'zone.js';

bootstrapApplication(App, {
  providers: [provideRouter(routes), provideHttpClient(),provideAnimations()],
}).catch(err => console.error(err));
