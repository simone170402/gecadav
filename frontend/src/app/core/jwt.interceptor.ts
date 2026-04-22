import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser =
    typeof window !== 'undefined' &&
    typeof localStorage !== 'undefined' &&
    typeof sessionStorage !== 'undefined';

  if (!isBrowser) {
    return next(req);
  }

  const token =
    localStorage.getItem('cabinet_token') ||
    sessionStorage.getItem('cabinet_token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};