// core/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

export const authGuard = async () => {
  const router = inject(Router);
  try {
    await getCurrentUser();
    return true;
  } catch {
    router.navigate(['/login']);
    return false;
  }
};
