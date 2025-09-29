import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { signUp } from 'aws-amplify/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
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
          <mat-icon style="color:#1e90ff;">apartment</mat-icon>
          Registro de Empresa
        </h2>
        <div style="color:#1e90ff;font-size:1.1rem;font-weight:500;margin-bottom:2px;">
          Plataforma Financiera
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="registrar()" autocomplete="on">
        <mat-form-field appearance="outline" style="width:100%;margin-bottom:18px;">
          <mat-label>RUT Empresa</mat-label>
          <input matInput formControlName="rutEmpresa" autocomplete="off" [disabled]="loading">
          <mat-icon matPrefix style="color:#1e90ff;">badge</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%;margin-bottom:18px;">
          <mat-label>Razón Social</mat-label>
          <input matInput formControlName="razonSocial" autocomplete="off" [disabled]="loading">
          <mat-icon matPrefix style="color:#1e90ff;">business</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%;margin-bottom:18px;">
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" [disabled]="loading">
          <mat-icon matPrefix style="color:#1e90ff;">mail</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width:100%;margin-bottom:18px;">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="new-password" [disabled]="loading">
          <mat-icon matPrefix style="color:#1e90ff;">vpn_key</mat-icon>
        </mat-form-field>

        <div style="display:flex;justify-content:center;margin-top:10px;">
          <button
            mat-raised-button
            color="primary"
            style="font-weight:600;font-size:1.08rem;min-width:120px;"
            [disabled]="form.invalid || loading"
          >
            <mat-icon style="font-size:20px;margin-right:6px;">check_circle</mat-icon>
            Registrarse
          </button>
        </div>
      </form>
    </mat-card>
  </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity:0; transform: translateY(24px);}
      to { opacity:1; transform: none;}
    }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rutEmpresa: ['', Validators.required],
      razonSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async registrar() {
    if (this.form.invalid) return;
    this.loading = true;
    const { rutEmpresa, razonSocial, email, password } = this.form.value;

    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:company_rut': rutEmpresa,
            'custom:company_name': razonSocial
          }
        }
      });

      console.log('✅ Registro exitoso:', result);
      alert('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      alert('Hubo un problema al registrar la empresa.');
    } finally {
      this.loading = false;
    }
  }
}
