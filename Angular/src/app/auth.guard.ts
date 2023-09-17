import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('auth_token');
  console.log(route);
  console.log(state);
  const router = inject(Router);
  console.log('Im in auth guard');
  console.log('token', token);
  if(token) {
    return true;
  } else {
    router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
};
