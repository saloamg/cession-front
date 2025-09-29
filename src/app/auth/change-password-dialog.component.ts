import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

type ChangePasswordDialogData = {
  username: string;
};

@Component({
  standalone: true,
  selector: 'app-change-password-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Cambiar contrase\u00f1a</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" mat-dialog-content class="form">
      <div class="context">
        <strong>{{ data.username }}</strong>
        <span>Debe definir una nueva contrase\u00f1a para continuar.</span>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Nueva contrase\u00f1a</mat-label>
        <input matInput type="password" formControlName="password" autocomplete="new-password" required>
        <mat-hint align="start">M\u00ednimo 8 caracteres, diferente a la anterior.</mat-hint>
        <mat-error *ngIf="passwordCtrl.hasError('required')">La contrase\u00f1a es obligatoria.</mat-error>
        <mat-error *ngIf="passwordCtrl.hasError('minlength')">Debe contener al menos 8 caracteres.</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Confirmar contrase\u00f1a</mat-label>
        <input matInput type="password" formControlName="confirm" autocomplete="new-password" required>
        <mat-error *ngIf="confirmCtrl.hasError('required')">Debes confirmar la contrase\u00f1a.</mat-error>
        <mat-error *ngIf="form.hasError('mismatch')">Las contrase\u00f1as no coinciden.</mat-error>
      </mat-form-field>

      <div mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Actualizar</button>
      </div>
    </form>
  `,
  styles: [`
    .form{display:flex;flex-direction:column;gap:16px;min-width:320px;max-width:360px;}
    .context{display:flex;flex-direction:column;gap:4px;margin-bottom:4px;color:#475569;}
    mat-form-field{width:100%;}
    [mat-dialog-actions]{margin-top:8px;}
  `]
})
export class ChangePasswordDialogComponent {
  readonly form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ChangePasswordDialogComponent, string>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ChangePasswordDialogData,
  ) {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirm: ['', [Validators.required]],
      },
      { validators: ChangePasswordDialogComponent.passwordsMatch },
    );
  }

  get passwordCtrl(): AbstractControl {
    return this.form.get('password')!;
  }

  get confirmCtrl(): AbstractControl {
    return this.form.get('confirm')!;
  }

  submit(): void {
    if (this.form.invalid) return;
    const password = (this.passwordCtrl.value as string).trim();
    this.dialogRef.close(password);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { mismatch: true };
  }
}
