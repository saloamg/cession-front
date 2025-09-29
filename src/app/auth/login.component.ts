import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { signIn, confirmSignIn, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
  <div
    style="
      min-height:100vh;
      display:grid;
      place-items:center;
      background:linear-gradient(135deg, #0a2540 0%, #1e90ff 100%);
      font-family:'Segoe UI',Roboto,Arial,sans-serif;
    "
  >
    <mat-card
      style="
        width:420px;
        max-width:92vw;
        padding:32px 28px 24px 28px;
        border-radius:20px;
        box-shadow:0 8px 32px 0 rgba(10,37,64,0.18);
        background: #fff;
        border-top: 6px solid #1e90ff;
        animation: fadeIn 0.7s;
      "
    >
      <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:18px;">
        <img
          src="assets/logo.svg"
          alt="Logo"
          style="width:72px;height:72px;margin-bottom:8px;filter:drop-shadow(0 2px 8px #1e90ff44);"
        />
        <h2
          style="
            margin:0 0 4px 0;
            display:flex;
            align-items:center;
            gap:8px;
            color:#0a2540;
            font-weight:600;
            font-size:2rem;
            letter-spacing:0.5px;
          "
        >
          <mat-icon style="color:#1e90ff;">lock</mat-icon>
          Ingreso Corporativo
        </h2>
        <div style="color:#1e90ff;font-size:1.1rem;font-weight:500;margin-bottom:2px;">
          Plataforma Financiera
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onLogin()" autocomplete="on">
        <mat-form-field appearance="outline" style="width:100%;margin-bottom:18px;">
          <mat-label>Usuario o email</mat-label>
          <input matInput formControlName="username" autocomplete="username" [disabled]="loading">
          <mat-icon matPrefix style="color:#1e90ff;">person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%;margin-bottom:10px;">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="current-password" [disabled]="loading">
          <mat-icon matPrefix style="color:#1e90ff;">vpn_key</mat-icon>
        </mat-form-field>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
          <button
            mat-stroked-button
            color="primary"
            type="button"
            (click)="onForgotPassword()"
            style="font-size:0.97rem;padding:0 10px;min-width:0;background:#f6f7fb;border-color:#1e90ff;color:#1e90ff;"
            [disabled]="loading"
          >
            <mat-icon style="font-size:18px;margin-right:4px;">help_outline</mat-icon>
            ¿Olvidaste tu contraseña?
          </button>
          <span style="font-size:0.95rem;color:#888;">&nbsp;</span>
        </div>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          (click)="onLogin()"
          [disabled]="loading"
          style="
            width:100%;
            background:linear-gradient(90deg,#1e90ff 60%,#0a2540 100%);
            color:#fff;
            font-weight:600;
            font-size:1.1rem;
            box-shadow:0 2px 8px #1e90ff33;
            transition:background 0.2s;
          "
        >
          <mat-icon>login</mat-icon>&nbsp;{{ loading ? 'Ingresando…' : 'Entrar' }}
        </button>

        <div *ngIf="error" style="color:#c00;margin-top:14px;font-weight:500;text-align:center;">
          {{ error }}
        </div>
      </form>
    </mat-card>
  </div>
  <style>
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px);}
      to { opacity: 1; transform: translateY(0);}
    }
    ::ng-deep .mat-form-field-appearance-outline .mat-form-field-outline {
      color: #1e90ff !important;
      border-color: #1e90ff !important;
    }
    ::ng-deep .mat-form-field.mat-focused .mat-form-field-outline-thick {
      color: #1e90ff !important;
      border-color: #1e90ff !important;
    }
    ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {
      color: #1e90ff !important;
    }
    ::ng-deep .mat-raised-button.mat-primary {
      background: linear-gradient(90deg,#1e90ff 60%,#0a2540 100%) !important;
      color: #fff !important;
    }
  </style>
  `
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    console.log('[Login] click; form.valid=', this.form.valid, this.form.value);

    if (this.loading) return;
    this.loading = true;
    this.error = null;

    const { username, password } = this.form.value as { username: string; password: string };

    try {
      const res = await signIn({ username, password });
      console.log('[signIn] nextStep:', (res as any)?.nextStep);

      const step = (res as any)?.nextStep?.signInStep;
      if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD') {
        const newPass = prompt('Debes cambiar tu contraseña. Ingresa una nueva:') || '';
        if (!newPass) throw new Error('Nueva contraseña requerida');
        await confirmSignIn({ challengeResponse: newPass });
      }
      if (step === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' || step === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        const code = prompt('Ingresa el código MFA:') || '';
        if (!code) throw new Error('Código MFA requerido');
        await confirmSignIn({ challengeResponse: code });
      }

      const session = await fetchAuthSession();
      console.log('[session tokens]', session.tokens);
      await getCurrentUser();

      this.router.navigate(['/cesiones']);
    } catch (e: any) {
      console.error('[Login] error:', e);
      this.error = e?.message ?? 'No se pudo iniciar sesión';
    } finally {
      this.loading = false;
    }
  }

  onForgotPassword() {
    // Aquí podrías redirigir a una página de recuperación o mostrar un modal
    // Por ahora, solo mostramos un prompt para el email
    const email = prompt('Ingresa tu email para recuperar la contraseña:');
    if (email) {
      // Aquí podrías llamar a la función de recuperación de AWS Cognito
      alert('Si el email está registrado, recibirás instrucciones para recuperar tu contraseña.');
    }
  }
}
