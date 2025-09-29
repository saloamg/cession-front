import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { signIn, confirmSignIn, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { MfaDialogComponent } from './mfa-dialog.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule],
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
          <mat-label>Contrase\u00f1a</mat-label>
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
            \u00bfOlvidaste tu contrase\u00f1a?
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
          <mat-icon>login</mat-icon>&nbsp;{{ loading ? 'Ingresando\u2026' : 'Entrar' }}
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

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onLogin(): Promise<void> {
    console.log('[Login] click; form.valid=', this.form.valid, this.form.value);

    if (this.loading) return;
    this.loading = true;
    this.error = null;

    const { username, password } = this.form.value as { username: string; password: string };

    try {
      let result = await signIn({ username, password });
      console.log('[signIn] nextStep:', (result as any)?.nextStep);

      result = await this.resolveAdditionalChallenges(result, username);

      const session = await fetchAuthSession();
      console.log('[session tokens]', session.tokens);
      await getCurrentUser();

      this.router.navigate(['/cesiones']);
    } catch (e: any) {
      console.error('[Login] error:', e);
      this.error = e?.message ?? 'No se pudo iniciar sesi\u00f3n';
    } finally {
      this.loading = false;
    }
  }

  onForgotPassword(): void {
    // Aqu\u00ed podr\u00edas redirigir a una p\u00e1gina de recuperaci\u00f3n o mostrar un modal
    // Por ahora, solo mostramos un prompt para el email
    const email = prompt('Ingresa tu email para recuperar la contrase\u00f1a:');
    if (email) {
      // Aqu\u00ed podr\u00edas llamar a la funci\u00f3n de recuperaci\u00f3n de AWS Cognito
      alert('Si el email est\u00e1 registrado, recibir\u00e1s instrucciones para recuperar tu contrase\u00f1a.');
    }
  }

  private async resolveAdditionalChallenges(result: any, username: string): Promise<any> {
    let current = result;
    let step = current?.nextStep?.signInStep as string | undefined;

    while (step && !this.isSignInCompleted(step)) {
      if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD') {
        const password = await this.promptForNewPassword(username);
        current = await confirmSignIn({ challengeResponse: password });
      } else if (step === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' || step === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        const code = await this.promptForMfa(step);
        current = await confirmSignIn({ challengeResponse: code });
      } else {
        console.warn('[Login] Paso de autenticaci\u00f3n no manejado:', step);
        break;
      }

      step = current?.nextStep?.signInStep as string | undefined;
    }

    return current;
  }

  private isSignInCompleted(step: string): boolean {
    return step === 'DONE' || step === 'COMPLETE_SIGN_IN' || step === 'COMPLETE';
  }

  private async promptForNewPassword(username: string): Promise<string> {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      disableClose: true,
      data: { username },
    });
    const value = await firstValueFrom(dialogRef.afterClosed());
    if (!value) {
      throw new Error('Cambio de contrase\u00f1a cancelado');
    }
    return value;
  }

  private async promptForMfa(step: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' | 'CONFIRM_SIGN_IN_WITH_SMS_CODE'): Promise<string> {
    const dialogRef = this.dialog.open(MfaDialogComponent, {
      disableClose: true,
      data: { step },
    });
    const value = await firstValueFrom(dialogRef.afterClosed());
    if (!value) {
      throw new Error('Verificaci\u00f3n MFA cancelada');
    }
    return value;
  }
}
