import { HttpInterceptorFn } from '@angular/common/http';
import { fetchAuthSession } from 'aws-amplify/auth';
import { from, switchMap, catchError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return from(fetchAuthSession()).pipe(
    switchMap(session => {
      // Usa el que necesites en tu backend: accessToken (API) o idToken (claims)
      const token =
        session?.tokens?.accessToken?.toString() ??
        session?.tokens?.idToken?.toString();

      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(authReq);
    }),
    // Si falló obtener sesión, seguimos la request sin token (evita romper DEV)
    catchError(() => next(req))
  );
};
