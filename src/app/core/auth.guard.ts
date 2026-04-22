import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isBrowser =
    typeof window !== 'undefined' &&
    typeof localStorage !== 'undefined' &&
    typeof sessionStorage !== 'undefined';

  if (!isBrowser) {
    return true;
  }

  const token =
    localStorage.getItem('cabinet_token') ||
    sessionStorage.getItem('cabinet_token');

  if (token) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};