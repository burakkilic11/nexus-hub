import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Token'ı kontrol etmek için

export const authGuard: CanActivateFn = (route, state) => {
    // Gerekli servisleri 'inject' (enjekte) ediyoruz
  const authService = inject(AuthService)
  const router = inject(Router)
  // --- Bouncer Mantığı ---

  // 1. Adım: Token'ı kontrol et
  if (authService.getToken()){
  // Kullanıcının token'ı VAR (localStorage'da).
    // Demek ki giriş yapmış.
    // Rotanın açılmasına İZİN VER.
    return true;
  }

  // 2. Adım: Token YOKSA
  // Kullanıcının token'ı YOK (giriş yapmamış).
  // Rotanın açılmasına İZİN VERME.
  
  // Önce kullanıcıyı /login sayfasına "at" (yönlendir).
  router.navigate(['/login']);
  
  // Sonra rotanın açılmasını ENGELLE.
  return false;
};
