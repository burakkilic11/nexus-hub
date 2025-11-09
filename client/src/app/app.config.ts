import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // importProvidersFrom eklendi
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// YENİ EKLENDİ: API istekleri için (HttpClient)
import { provideHttpClient } from '@angular/common/http';

// YENİ EKLENDİ: Formlar (Login Formu) için
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // YENİ EKLENDİ: Angular'a "HttpClient'ı kullanıma hazırla" diyoruz.
    provideHttpClient(),

    // YENİ EKLENDİ: Angular'a "Form modüllerini kullanıma hazırla" diyoruz.
    importProvidersFrom(FormsModule),
  ],
};
