import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/Auth/auth.service';
import { catchError, map, of, take } from 'rxjs';
import { User } from '../models/user';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  
  return authService.profileUser().pipe(
    map(user => {
      console.log('privilege:', user.privilege);
      if (user && user.privilege === 'admin') {
        return true; 
      } else {
        router.navigate(['/login']); 
        return false;
      }
    }),
    catchError(err => {
      console.error('Error al recuperar el perfil del usuario:', err);
      router.navigate(['/login']); 
      return of(false);
    })
  );
};
