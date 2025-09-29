import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

type MfaDialogData = {
  step: 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' | 'CONFIRM_SIGN_IN_WITH_SMS_CODE';
};

@Component({
  standalone: true,
  selector: 'app-mfa-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Verificaci\u00f3n MFA</h2>
    <form [formGroup]="form" mat-dialog-content class="form" (ngSubmit)="submit()">
      <p class="context">
        Ingresa el c\u00f3digo {{ hint }} para continuar con el inicio de sesi\u00f3n.
      </p>

      <mat-form-field appearance="outline">
        <mat-label>C\u00f3digo</mat-label>
        <input
          matInput
          formControlName="code"
          [attr.inputmode]="'numeric'"
          autocomplete="one-time-code"
          maxlength="8"
        >
        <mat-error *ngIf="codeCtrl.hasError('required')">Debes ingresar el c\u00f3digo recibido.</mat-error>
        <mat-error *ngIf="codeCtrl.hasError('pattern')">Solo se permiten d\u00edgitos (4 a 8 caracteres).</mat-error>
      </mat-form-field>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Validar</button>
      </div>
    </form>
  `,
  styles: [`
    .form{display:flex;flex-direction:column;gap:16px;min-width:280px;max-width:320px;}
    .context{margin:0;color:#475569;}
    mat-form-field{width:100%;}
    [mat-dialog-actions]{margin-top:8px;}
  `]
})
export class MfaDialogComponent {
  readonly form: FormGroup;
  readonly hint: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<MfaDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public readonly data: MfaDialogData,
  ) {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,8}$/)]],
    });

    this.hint = data.step === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
      ? 'de tu app de autenticaci\u00f3n'
      : 'que recibiste por SMS';
  }

  get codeCtrl(): AbstractControl {
    return this.form.get('code')!;
  }

  submit(): void {
    if (this.form.invalid) return;
    const code = (this.codeCtrl.value as string).trim();
    this.dialogRef.close(code);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
