// src/app/auth/callback.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

@Component({
  standalone: true,
  template: `
    <div style="padding:2rem; text-align:center">
      <h2>Procesando inicio de sesión...</h2>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      // (Opcional) Diagnóstico: confirma que Cognito te envió el "code"
      const code = new URLSearchParams(window.location.search).get('code');
      console.log('[Callback] code:', code);

      // Amplify v6: resuelve el intercambio code -> tokens y los guarda
      const session = await fetchAuthSession();
      console.log('[Callback] tokens:', session?.tokens);

      // Confirma que hay usuario autenticado
      await getCurrentUser();

      // Redirige a la pantalla protegida
      this.router.navigate(['/cesiones']);
    } catch (err) {
      console.error('[Callback] error:', err);
      this.router.navigate(['/login']);
    }
  }
}
