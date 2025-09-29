import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { forkJoin } from 'rxjs';
import { rutValidator } from '../shared/rut.validator';
import { RutPipe } from '../shared/rut.pipe';
import { CesionesDataService, Cedente, CesionarioPreset, CesionPayload } from './cesiones-data.service';

@Component({
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    RutPipe,
  ],
  template: `
  <div class="page">
    <header class="header">
      <div class="brand"><mat-icon>trending_flat</mat-icon>&nbsp;Cesi\u00f3n gen\u00e9rica</div>
    </header>

    <div class="container">
      <div class="alert info" *ngIf="loadingData">Cargando cat\u00e1logos desde mock...</div>
      <div class="alert error" *ngIf="!loadingData && dataError">{{ dataError }}</div>
      <div class="alert success" *ngIf="submitSuccess">{{ submitSuccess }}</div>
      <div class="alert error" *ngIf="submitError">{{ submitError }}</div>

      <form [formGroup]="form" (ngSubmit)="ceder()">
        <div class="grid">
          <mat-card class="panel">
            <h2 class="panel-title">Cedente</h2>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cedente</mat-label>
              <mat-select formControlName="cedenteId" (selectionChange)="onCedenteChange()" [disabled]="loadingData || !CEDENTES.length">
                <mat-option *ngFor="let c of CEDENTES" [value]="c.id">{{ c.nombre }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Rut</mat-label>
              <input matInput formControlName="ced_rut" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Raz\u00f3n social</mat-label>
              <input matInput formControlName="ced_razon" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Direcci\u00f3n</mat-label>
              <input matInput formControlName="ced_direccion" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Correo</mat-label>
              <input matInput formControlName="ced_correo" [disabled]="true">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Firmante</mat-label>
              <mat-select formControlName="firmante" [disabled]="loadingData || !firmantesDisponibles.length">
                <mat-option *ngFor="let f of firmantesDisponibles" [value]="f">{{ f }}</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card>

          <mat-card class="panel">
            <h2 class="panel-title">Cesionario</h2>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Cesionario</mat-label>
              <mat-select formControlName="cesionarioPreset" (selectionChange)="onCesionarioChange()" [disabled]="loadingData">
                <mat-option *ngFor="let cz of CESIONARIOS" [value]="cz.id">{{ cz.nombre }}</mat-option>
                <mat-option value="otro">Otro</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Rut</mat-label>
              <input matInput formControlName="ces_rut" [disabled]="!esCesionarioOtro" autocomplete="off">
              <mat-error *ngIf="form.get('ces_rut')?.invalid && esCesionarioOtro">RUT inv\u00e1lido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Raz\u00f3n social</mat-label>
              <input matInput formControlName="ces_razon" [disabled]="!esCesionarioOtro" autocomplete="off">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Direcci\u00f3n</mat-label>
              <input matInput formControlName="ces_direccion" [disabled]="!esCesionarioOtro" autocomplete="off">
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Correo</mat-label>
              <input matInput formControlName="ces_correo" [disabled]="!esCesionarioOtro" autocomplete="off">
            </mat-form-field>
          </mat-card>
        </div>

        <mat-card class="panel doc-panel">
          <h2 class="panel-title">Documentos</h2>

          <div class="doc-row">
            <mat-radio-group formControlName="doc_tipo" class="mr16" [disabled]="loadingData">
              <mat-radio-button value="xml">Xmls</mat-radio-button>
              <mat-radio-button value="aec" class="ml16">Aecs</mat-radio-button>
            </mat-radio-group>

            <button mat-stroked-button type="button" (click)="fileInput.click()" [disabled]="loadingData">
              <mat-icon>add</mat-icon>&nbsp;Agregar
            </button>
            <input #fileInput type="file" multiple (change)="onFilesSelected($event)" hidden>
          </div>

          <div class="files" *ngIf="files.length">
            <div class="file" *ngFor="let f of files; let i = index">
              <mat-icon inline>insert_drive_file</mat-icon>
              <span class="file-name" [title]="f.name">{{ f.name }}</span>
              <button mat-icon-button color="warn" (click)="removeFile(i)" aria-label="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>

        <div class="footer">
          <button mat-raised-button color="primary" [disabled]="!puedeCeder() || submitting" type="submit">
            {{ submitting ? 'Enviando...' : 'Ceder' }}
          </button>
        </div>
      </form>
    </div>
  </div>
  `,
  styles: [`
    .page{min-height:100vh;background:#f7f8fb;}
    .header{height:64px;background:#062447;color:#fff;display:flex;align-items:center;padding:0 20px;}
    .brand{font-size:20px;font-weight:600;display:flex;align-items:center}
    .container{padding:24px;max-width:1200px;margin:0 auto;}
    .grid{display:grid;grid-template-columns:1fr;gap:24px;}
    @media (min-width: 1024px){ .grid{grid-template-columns:1fr 1fr;} }
    .panel{padding:16px;}
    .panel-title{margin:4px 0 12px 0;font-weight:600}
    .w-full{width:100%}
    .doc-panel .doc-row{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
    .files{display:flex;flex-wrap:wrap;gap:8px}
    .file{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;}
    .file-name{max-width:420px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .footer{display:flex;justify-content:flex-end;margin-top:16px;}
    .ml16{margin-left:16px}.mr16{margin-right:16px}
    .alert{padding:12px 16px;border-radius:8px;margin-bottom:16px;border:1px solid transparent;font-size:0.95rem;}
    .alert.info{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8;}
    .alert.error{background:#fef2f2;border-color:#fecaca;color:#b91c1c;}
    .alert.success{background:#ecfdf5;border-color:#bbf7d0;color:#047857;}
  `]
})
export class CesionesPageComponent implements OnInit {
  CEDENTES: Cedente[] = [];
  CESIONARIOS: CesionarioPreset[] = [];
  form: FormGroup;
  esCesionarioOtro = true;
  firmantesDisponibles: string[] = [];
  files: File[] = [];
  loadingData = true;
  dataError: string | null = null;
  submitting = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;

  constructor(private fb: FormBuilder, private dataService: CesionesDataService) {
    this.form = this.fb.group({
      cedenteId: ['', Validators.required],
      ced_rut: [{ value: '', disabled: true }],
      ced_razon: [{ value: '', disabled: true }],
      ced_direccion: [{ value: '', disabled: true }],
      ced_correo: [{ value: '', disabled: true }],
      firmante: ['', Validators.required],
      cesionarioPreset: ['otro', Validators.required],
      ces_rut: ['', [rutValidator]],
      ces_razon: [''],
      ces_direccion: [''],
      ces_correo: ['', Validators.email],
      doc_tipo: ['xml', Validators.required],
    });

    this.onCesionarioChange();
  }

  ngOnInit(): void {
    forkJoin({
      cedentes: this.dataService.getCedentes(),
      cesionarios: this.dataService.getCesionarios(),
    }).subscribe({
      next: ({ cedentes, cesionarios }) => {
        this.CEDENTES = cedentes;
        this.CESIONARIOS = cesionarios;

        if (cedentes.length) {
          this.form.patchValue({ cedenteId: cedentes[0].id });
          this.setCedente(cedentes[0]);
        }

        this.loadingData = false;
      },
      error: (error) => {
        console.error('[Cesiones] Error cargando cat\u00e1logos', error);
        this.dataError = 'No se pudieron cargar los cat\u00e1logos de referencia. Reintenta m\u00e1s tarde.';
        this.loadingData = false;
      },
    });
  }

  onCedenteChange(): void {
    const id = this.form.get('cedenteId')?.value as string;
    const ced = this.CEDENTES.find((c) => c.id === id);
    if (ced) this.setCedente(ced);
  }

  private setCedente(c: Cedente): void {
    this.form.patchValue({
      ced_rut: c.rut,
      ced_razon: c.razon,
      ced_direccion: c.direccion,
      ced_correo: c.correo,
      firmante: null,
    });
    this.firmantesDisponibles = c.firmantes;
  }

  onCesionarioChange(): void {
    const presetId = this.form.get('cesionarioPreset')?.value as string;
    this.esCesionarioOtro = presetId === 'otro';

    const rutCtrl = this.form.get('ces_rut');
    const razonCtrl = this.form.get('ces_razon');
    const dirCtrl = this.form.get('ces_direccion');
    const mailCtrl = this.form.get('ces_correo');

    if (!rutCtrl || !razonCtrl || !dirCtrl || !mailCtrl) return;

    if (this.esCesionarioOtro) {
      rutCtrl.setValidators([rutValidator, Validators.required]);
      razonCtrl.setValidators([Validators.required]);
      rutCtrl.enable(); razonCtrl.enable(); dirCtrl.enable(); mailCtrl.enable();
      rutCtrl.reset(); razonCtrl.reset(); dirCtrl.reset(); mailCtrl.reset();
    } else {
      const preset = this.CESIONARIOS.find((x) => x.id === presetId);
      rutCtrl.clearValidators(); razonCtrl.clearValidators();
      rutCtrl.disable(); razonCtrl.disable(); dirCtrl.disable(); mailCtrl.disable();
      this.form.patchValue({
        ces_rut: preset?.rut ?? '',
        ces_razon: preset?.razon ?? '',
        ces_direccion: preset?.direccion ?? '',
        ces_correo: preset?.correo ?? '',
      });
    }

    rutCtrl.updateValueAndValidity();
    razonCtrl.updateValueAndValidity();
  }

  onFilesSelected(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.files = [...this.files, ...Array.from(input.files)];
    input.value = '';
  }

  removeFile(i: number): void {
    this.files.splice(i, 1);
    this.files = [...this.files];
  }

  puedeCeder(): boolean {
    if (this.loadingData) return false;

    const baseOk = this.form.valid && !!this.form.value.firmante;
    const docsOk = this.files.length > 0;

    if (this.esCesionarioOtro) {
      const rutOk = this.form.get('ces_rut')?.valid && !!this.form.get('ces_rut')?.value;
      const razonOk = !!this.form.get('ces_razon')?.value;
      return baseOk && docsOk && !!rutOk && razonOk;
    }
    return baseOk && docsOk;
  }

  ceder(): void {
    if (!this.puedeCeder() || this.submitting) return;

    const ced = this.CEDENTES.find((c) => c.id === this.form.value.cedenteId);
    if (!ced) {
      this.submitError = 'Selecciona un cedente v\u00e1lido.';
      return;
    }

    const payload: CesionPayload = {
      cedente: {
        id: ced.id,
        firmante: this.form.value.firmante,
      },
      cesionario: this.esCesionarioOtro
        ? {
            rut: this.form.get('ces_rut')?.value,
            razon: this.form.get('ces_razon')?.value,
            direccion: this.form.get('ces_direccion')?.value,
            correo: this.form.get('ces_correo')?.value,
          }
        : { presetId: this.form.value.cesionarioPreset },
      documentos: {
        tipo: this.form.value.doc_tipo,
        archivos: this.files,
      },
    };

    this.submitting = true;
    this.submitError = null;
    this.submitSuccess = null;

    this.dataService.submitCesion(payload).subscribe({
      next: () => {
        this.submitSuccess = 'Cesi\u00f3n simulada correctamente (mock).';
        this.files = [];
        this.form.get('firmante')?.reset();
        if (this.esCesionarioOtro) {
          this.form.get('ces_rut')?.reset();
          this.form.get('ces_razon')?.reset();
          this.form.get('ces_direccion')?.reset();
          this.form.get('ces_correo')?.reset();
        }
      },
      error: (error) => {
        console.error('[Cesiones] Error al simular env\u00edo', error);
        this.submitError = 'No se pudo simular el env\u00edo de la cesi\u00f3n.';
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
