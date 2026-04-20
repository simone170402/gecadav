import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export function roleGuard(roles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const role = authService.getRole();

    if (!role || !roles.includes(role)) {
      router.navigate(['/admin/login']);
      return false;
    }

    return true;
  };
}